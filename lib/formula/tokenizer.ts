import { Token, TokenType } from "./types";
import { resolveToCanonicalFunction } from "../i18n/formulaLocale";

export class FormulaTokenizer {
  private input: string;
  private pos: number = 0;
  private length: number;

  constructor(formula: string) {
    // Strip leading '=' if user started with it
    let clean = formula.trim();
    if (clean.startsWith("=")) {
      clean = clean.substring(1).trim();
    }
    this.input = clean;
    this.length = clean.length;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.length) {
      this.skipWhitespace();
      if (this.pos >= this.length) break;

      const char = this.input[this.pos];
      const startPos = this.pos;

      // 1. Quoted String: "..."
      if (char === '"') {
        tokens.push(this.readString());
        continue;
      }

      // 2. Numbers (e.g. 12000, 3.14, 0.5)
      if (this.isDigit(char) || (char === "." && this.isDigit(this.peek(1)))) {
        tokens.push(this.readNumber());
        continue;
      }

      // 3. Multi-character and single-character Operators
      if (char === "<") {
        if (this.peek(1) === "=") {
          tokens.push({ type: "OPERATOR", value: "<=", position: startPos });
          this.pos += 2;
          continue;
        }
        if (this.peek(1) === ">") {
          tokens.push({ type: "OPERATOR", value: "<>", position: startPos });
          this.pos += 2;
          continue;
        }
        tokens.push({ type: "OPERATOR", value: "<", position: startPos });
        this.pos++;
        continue;
      }

      if (char === ">") {
        if (this.peek(1) === "=") {
          tokens.push({ type: "OPERATOR", value: ">=", position: startPos });
          this.pos += 2;
          continue;
        }
        tokens.push({ type: "OPERATOR", value: ">", position: startPos });
        this.pos++;
        continue;
      }

      if (char === "=") {
        tokens.push({ type: "OPERATOR", value: "=", position: startPos });
        this.pos++;
        continue;
      }

      if (char === "+" || char === "-" || char === "*" || char === "/" || char === "^" || char === "&") {
        tokens.push({ type: "OPERATOR", value: char, position: startPos });
        this.pos++;
        continue;
      }

      // 4. Parentheses
      if (char === "(") {
        tokens.push({ type: "LPAREN", value: "(", position: startPos });
        this.pos++;
        continue;
      }

      if (char === ")") {
        tokens.push({ type: "RPAREN", value: ")", position: startPos });
        this.pos++;
        continue;
      }

      // 5. Separators (, and ;)
      if (char === ",") {
        tokens.push({ type: "COMMA", value: ",", position: startPos });
        this.pos++;
        continue;
      }

      if (char === ";") {
        tokens.push({ type: "SEMICOLON", value: ";", position: startPos });
        this.pos++;
        continue;
      }

      // 6. Cell / Range reference or Identifier / Function
      // Handles $A$1, A1:B10, SUM, EĞERSAY, ÇOKETOPLA, BAĞ_DEĞ_SAY, etc.
      if (char === "$" || this.isLetterOrUnderscoreOrUnicode(char)) {
        const token = this.readIdentifierOrReference();
        tokens.push(token);
        continue;
      }

      // 7. Unknown character
      tokens.push({ type: "UNKNOWN", value: char, position: startPos });
      this.pos++;
    }

    tokens.push({ type: "EOF", value: "", position: this.pos });
    return tokens;
  }

  private skipWhitespace() {
    while (this.pos < this.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  private peek(offset: number = 0): string {
    const idx = this.pos + offset;
    return idx < this.length ? this.input[idx] : "";
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private isLetterOrUnderscoreOrUnicode(char: string): boolean {
    return /^[a-zA-Z_\u00C0-\u024F\u1E00-\u1EFF]$/.test(char);
  }

  private readString(): Token {
    const startPos = this.pos;
    this.pos++; // Skip opening quote
    let value = "";

    while (this.pos < this.length) {
      const char = this.input[this.pos];
      if (char === '"') {
        // Escaped quote: ""
        if (this.peek(1) === '"') {
          value += '"';
          this.pos += 2;
        } else {
          // Closing quote
          this.pos++;
          break;
        }
      } else {
        value += char;
        this.pos++;
      }
    }

    return { type: "STRING", value, position: startPos };
  }

  private readNumber(): Token {
    const startPos = this.pos;
    let value = "";
    let hasDot = false;

    while (this.pos < this.length) {
      const char = this.input[this.pos];
      if (this.isDigit(char)) {
        value += char;
        this.pos++;
      } else if (char === "." && !hasDot) {
        hasDot = true;
        value += char;
        this.pos++;
      } else {
        break;
      }
    }

    return { type: "NUMBER", value, position: startPos };
  }

  private readIdentifierOrReference(): Token {
    const startPos = this.pos;
    let raw = "";

    // Read characters that can be part of identifier, function name, cell ref, or range ref
    while (this.pos < this.length) {
      const char = this.input[this.pos];
      if (
        this.isLetterOrUnderscoreOrUnicode(char) ||
        this.isDigit(char) ||
        char === "$" ||
        char === "." ||
        char === ":"
      ) {
        raw += char;
        this.pos++;
      } else {
        break;
      }
    }

    // Check Range Reference: e.g. A1:B10, $A$1:$B$10, B2:B100
    const rangeRegex = /^(\$?[A-Za-z]+)(\$?[0-9]+):(\$?[A-Za-z]+)(\$?[0-9]+)$/;
    if (rangeRegex.test(raw)) {
      return { type: "RANGE_REF", value: raw.toUpperCase(), position: startPos };
    }

    // Check Single Cell Reference: e.g. A1, $A$1, B2, $C10, D$5
    const cellRegex = /^(\$?[A-Za-z]+)(\$?[0-9]+)$/;
    if (cellRegex.test(raw)) {
      return { type: "CELL_REF", value: raw.toUpperCase(), position: startPos };
    }

    // Check Booleans: TRUE / FALSE or Turkish DOĞRU / YANLIŞ
    const upper = raw.toUpperCase();
    if (upper === "TRUE" || upper === "DOĞRU" || upper === "DOGRU") {
      return { type: "BOOLEAN", value: "TRUE", position: startPos };
    }
    if (upper === "FALSE" || upper === "YANLIŞ" || upper === "YANLIS") {
      return { type: "BOOLEAN", value: "FALSE", position: startPos };
    }

    // Check Function Name
    const canonical = resolveToCanonicalFunction(raw);
    if (canonical) {
      return {
        type: "FUNCTION",
        value: raw,
        position: startPos,
        canonicalFunction: canonical,
      };
    }

    // Default to Identifier / Named entity
    return { type: "FUNCTION", value: raw, position: startPos };
  }
}
