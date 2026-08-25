import { CanonicalFunctionId } from "../i18n/types";
export type { CanonicalFunctionId };

export type TokenType =
  | "FUNCTION"
  | "CELL_REF"
  | "RANGE_REF"
  | "NUMBER"
  | "STRING"
  | "BOOLEAN"
  | "OPERATOR"
  | "COMMA"
  | "SEMICOLON"
  | "LPAREN"
  | "RPAREN"
  | "EOF"
  | "UNKNOWN";

export interface Token {
  type: TokenType;
  value: string;
  position: number;
  canonicalFunction?: CanonicalFunctionId;
}

export type ASTNodeType =
  | "NumberLiteral"
  | "StringLiteral"
  | "BooleanLiteral"
  | "CellReference"
  | "RangeReference"
  | "UnaryExpression"
  | "BinaryExpression"
  | "FunctionCall";

export interface BaseASTNode {
  type: ASTNodeType;
}

export interface NumberLiteralNode extends BaseASTNode {
  type: "NumberLiteral";
  value: number;
}

export interface StringLiteralNode extends BaseASTNode {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteralNode extends BaseASTNode {
  type: "BooleanLiteral";
  value: boolean;
}

export interface CellReferenceNode extends BaseASTNode {
  type: "CellReference";
  col: string; // "A", "B", etc.
  row: number; // 1-based index: 1, 2, 3...
  isColAbsolute: boolean;
  isRowAbsolute: boolean;
  raw: string;
}

export interface RangeReferenceNode extends BaseASTNode {
  type: "RangeReference";
  startCol: string;
  startRow: number;
  endCol: string;
  endRow: number;
  isStartColAbsolute: boolean;
  isStartRowAbsolute: boolean;
  isEndColAbsolute: boolean;
  isEndRowAbsolute: boolean;
  raw: string;
}

export interface UnaryExpressionNode extends BaseASTNode {
  type: "UnaryExpression";
  operator: "+" | "-";
  argument: ASTNode;
}

export interface BinaryExpressionNode extends BaseASTNode {
  type: "BinaryExpression";
  operator: "+" | "-" | "*" | "/" | "^" | "&" | "=" | "<>" | "<" | "<=" | ">" | ">=";
  left: ASTNode;
  right: ASTNode;
}

export interface FunctionCallNode extends BaseASTNode {
  type: "FunctionCall";
  canonical: CanonicalFunctionId;
  rawName: string;
  args: ASTNode[];
}

export type ASTNode =
  | NumberLiteralNode
  | StringLiteralNode
  | BooleanLiteralNode
  | CellReferenceNode
  | RangeReferenceNode
  | UnaryExpressionNode
  | BinaryExpressionNode
  | FunctionCallNode;

export interface DatasetColumn {
  key: string; // e.g. "sales"
  name: string; // e.g. "Sales ($)"
  colLetter: string; // "A", "B", "C"
  type?: "string" | "number" | "boolean" | "date";
}

export interface ChallengeDataset {
  columns: DatasetColumn[];
  rows: Record<string, any>[];
  hasHeaderRow?: boolean; // Default true (Row 1 is header, data is rows 2..N)
}

export interface FormulaEvaluationContext {
  dataset: ChallengeDataset;
  allowHardcoded?: boolean;
}

export type FormulaValue = string | number | boolean | null | undefined | FormulaValue[];

export interface EvaluationResult {
  success: boolean;
  value?: FormulaValue;
  error?: string; // e.g. "#VALUE!", "#DIV/0!", "#NAME?", "#REF!", "#SYNTAX!"
  errorMessage?: string;
  referencedCells?: string[];
  referencedRanges?: string[];
  usedFunctions?: CanonicalFunctionId[];
}

export interface ValidationFeedback {
  isValid: boolean;
  isCorrect: boolean;
  userResult?: FormulaValue;
  expectedResult?: FormulaValue;
  status: "correct" | "incorrect" | "syntax_error" | "runtime_error" | "hardcoded_warning" | "empty";
  messageEn: string;
  messageTr: string;
  usedFunctions: CanonicalFunctionId[];
  isEquivalent: boolean;
}
