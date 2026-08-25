import {
  Token,
  ASTNode,
  NumberLiteralNode,
  StringLiteralNode,
  BooleanLiteralNode,
  CellReferenceNode,
  RangeReferenceNode,
  FunctionCallNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
} from "./types";
import { FormulaTokenizer } from "./tokenizer";
import { resolveToCanonicalFunction } from "../i18n/formulaLocale";

const PARSE_CACHE = new Map<string, ASTNode>();
const MAX_CACHE_SIZE = 500;

export class FormulaParser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public static parse(formula: string): ASTNode {
    const trimmed = formula.trim();
    if (PARSE_CACHE.has(trimmed)) {
      return PARSE_CACHE.get(trimmed)!;
    }

    const tokenizer = new FormulaTokenizer(formula);
    const tokens = tokenizer.tokenize();
    const parser = new FormulaParser(tokens);
    const ast = parser.parseFormula();

    if (PARSE_CACHE.size >= MAX_CACHE_SIZE) {
      const firstKey = PARSE_CACHE.keys().next().value;
      if (firstKey) PARSE_CACHE.delete(firstKey);
    }
    PARSE_CACHE.set(trimmed, ast);

    return ast;
  }

  public parseFormula(): ASTNode {
    const expr = this.parseExpression();
    if (!this.isAtEnd()) {
      const remaining = this.peek();
      throw new Error(`Unexpected token '${remaining.value}' at position ${remaining.position}`);
    }
    return expr;
  }

  // Level 1: Comparisons (=, <>, <, <=, >, >=)
  private parseExpression(): ASTNode {
    let expr = this.parseConcatenation();

    while (this.matchOperator("=", "<>", "<", "<=", ">", ">=")) {
      const operator = this.previous().value as any;
      const right = this.parseConcatenation();
      expr = {
        type: "BinaryExpression",
        operator,
        left: expr,
        right,
      } as BinaryExpressionNode;
    }

    return expr;
  }

  // Level 2: Text Concatenation (&)
  private parseConcatenation(): ASTNode {
    let expr = this.parseAdditive();

    while (this.matchOperator("&")) {
      const operator = "&";
      const right = this.parseAdditive();
      expr = {
        type: "BinaryExpression",
        operator,
        left: expr,
        right,
      } as BinaryExpressionNode;
    }

    return expr;
  }

  // Level 3: Addition & Subtraction (+, -)
  private parseAdditive(): ASTNode {
    let expr = this.parseMultiplicative();

    while (this.matchOperator("+", "-")) {
      const operator = this.previous().value as "+" | "-";
      const right = this.parseMultiplicative();
      expr = {
        type: "BinaryExpression",
        operator,
        left: expr,
        right,
      } as BinaryExpressionNode;
    }

    return expr;
  }

  // Level 4: Multiplication & Division (*, /)
  private parseMultiplicative(): ASTNode {
    let expr = this.parseExponentiation();

    while (this.matchOperator("*", "/")) {
      const operator = this.previous().value as "*" | "/";
      const right = this.parseExponentiation();
      expr = {
        type: "BinaryExpression",
        operator,
        left: expr,
        right,
      } as BinaryExpressionNode;
    }

    return expr;
  }

  // Level 5: Exponentiation (^)
  private parseExponentiation(): ASTNode {
    let expr = this.parseUnary();

    while (this.matchOperator("^")) {
      const operator = "^";
      const right = this.parseUnary();
      expr = {
        type: "BinaryExpression",
        operator,
        left: expr,
        right,
      } as BinaryExpressionNode;
    }

    return expr;
  }

  // Level 6: Unary (+, -)
  private parseUnary(): ASTNode {
    if (this.matchOperator("+", "-")) {
      const operator = this.previous().value as "+" | "-";
      const argument = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator,
        argument,
      } as UnaryExpressionNode;
    }

    return this.parsePrimary();
  }

  // Level 7: Primary / Atoms
  private parsePrimary(): ASTNode {
    // Number literal
    if (this.matchType("NUMBER")) {
      return {
        type: "NumberLiteral",
        value: parseFloat(this.previous().value),
      } as NumberLiteralNode;
    }

    // String literal
    if (this.matchType("STRING")) {
      return {
        type: "StringLiteral",
        value: this.previous().value,
      } as StringLiteralNode;
    }

    // Boolean literal
    if (this.matchType("BOOLEAN")) {
      return {
        type: "BooleanLiteral",
        value: this.previous().value === "TRUE",
      } as BooleanLiteralNode;
    }

    // Range Reference: e.g. A1:B10
    if (this.matchType("RANGE_REF")) {
      const raw = this.previous().value;
      return this.parseRangeRef(raw);
    }

    // Cell Reference: e.g. A1, $A$1
    if (this.matchType("CELL_REF")) {
      const raw = this.previous().value;
      return this.parseCellRef(raw);
    }

    // Function call: e.g. SUM(A1:A10)
    if (this.checkType("FUNCTION")) {
      return this.parseFunctionCall();
    }

    // Parentheses: (expr)
    if (this.matchType("LPAREN")) {
      const expr = this.parseExpression();
      this.consume("RPAREN", "Expected ')' after expression");
      return expr;
    }

    const token = this.peek();
    throw new Error(`Unexpected token '${token.value}' of type '${token.type}' at position ${token.position}`);
  }

  private parseFunctionCall(): FunctionCallNode {
    const funcToken = this.advance();
    const rawName = funcToken.value;
    const canonical = funcToken.canonicalFunction || resolveToCanonicalFunction(rawName);

    if (!canonical) {
      throw new Error(`Unknown function: '${rawName}'`);
    }

    this.consume("LPAREN", `Expected '(' after function name '${rawName}'`);

    const args: ASTNode[] = [];
    if (!this.checkType("RPAREN")) {
      do {
        if (this.checkType("RPAREN")) break;
        args.push(this.parseExpression());
      } while (this.matchSeparator());
    }

    this.consume("RPAREN", `Expected ')' after function arguments for '${rawName}'`);

    return {
      type: "FunctionCall",
      canonical,
      rawName,
      args,
    };
  }

  private matchSeparator(): boolean {
    if (this.matchType("COMMA") || this.matchType("SEMICOLON")) {
      return true;
    }
    return false;
  }

  private parseCellRef(raw: string): CellReferenceNode {
    // e.g. "$A$1", "B2", "$C10", "D$5"
    const match = raw.match(/^(\$?)([A-Za-z]+)(\$?)([0-9]+)$/);
    if (!match) {
      throw new Error(`Invalid cell reference: '${raw}'`);
    }
    const isColAbsolute = match[1] === "$";
    const col = match[2].toUpperCase();
    const isRowAbsolute = match[3] === "$";
    const row = parseInt(match[4], 10);

    return {
      type: "CellReference",
      col,
      row,
      isColAbsolute,
      isRowAbsolute,
      raw,
    };
  }

  private parseRangeRef(raw: string): RangeReferenceNode {
    // e.g. "A1:B10", "$A$1:$B$10"
    const parts = raw.split(":");
    const startMatch = parts[0].match(/^(\$?)([A-Za-z]+)(\$?)([0-9]+)$/);
    const endMatch = parts[1].match(/^(\$?)([A-Za-z]+)(\$?)([0-9]+)$/);

    if (!startMatch || !endMatch) {
      throw new Error(`Invalid range reference: '${raw}'`);
    }

    return {
      type: "RangeReference",
      startCol: startMatch[2].toUpperCase(),
      startRow: parseInt(startMatch[4], 10),
      endCol: endMatch[2].toUpperCase(),
      endRow: parseInt(endMatch[4], 10),
      isStartColAbsolute: startMatch[1] === "$",
      isStartRowAbsolute: startMatch[3] === "$",
      isEndColAbsolute: endMatch[1] === "$",
      isEndRowAbsolute: endMatch[3] === "$",
      raw,
    };
  }

  private matchType(...types: Token["type"][]): boolean {
    for (const type of types) {
      if (this.checkType(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private matchOperator(...ops: string[]): boolean {
    if (this.checkType("OPERATOR")) {
      const val = this.peek().value;
      if (ops.includes(val)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private checkType(type: Token["type"]): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: "EOF", value: "", position: -1 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: Token["type"], message: string): Token {
    if (this.checkType(type)) return this.advance();
    const token = this.peek();
    throw new Error(`${message} at position ${token.position}`);
  }
}
