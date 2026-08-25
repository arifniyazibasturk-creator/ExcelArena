import {
  ASTNode,
  ChallengeDataset,
  EvaluationResult,
  FormulaValue,
  CellReferenceNode,
  RangeReferenceNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  FunctionCallNode,
} from "./types";
import { FormulaParser } from "./parser";
import { BUILT_IN_FUNCTIONS } from "./functions";
import { CanonicalFunctionId } from "../i18n/types";

export class FormulaEvaluator {
  private dataset: ChallengeDataset;
  private referencedCells: Set<string> = new Set();
  private referencedRanges: Set<string> = new Set();
  private usedFunctions: Set<CanonicalFunctionId> = new Set();

  constructor(dataset: ChallengeDataset) {
    this.dataset = dataset;
  }

  public static evaluate(formula: string, dataset: ChallengeDataset): EvaluationResult {
    try {
      const ast = FormulaParser.parse(formula);
      const evaluator = new FormulaEvaluator(dataset);
      const value = evaluator.evaluateNode(ast);

      return {
        success: true,
        value,
        referencedCells: Array.from(evaluator.referencedCells),
        referencedRanges: Array.from(evaluator.referencedRanges),
        usedFunctions: Array.from(evaluator.usedFunctions),
      };
    } catch (err: any) {
      return {
        success: false,
        error: "#SYNTAX!",
        errorMessage: err.message || "Failed to evaluate formula",
        referencedCells: [],
        referencedRanges: [],
        usedFunctions: [],
      };
    }
  }

  public evaluateNode(node: ASTNode): FormulaValue {
    switch (node.type) {
      case "NumberLiteral":
        return node.value;

      case "StringLiteral":
        return node.value;

      case "BooleanLiteral":
        return node.value;

      case "CellReference":
        return this.evaluateCellReference(node);

      case "RangeReference":
        return this.evaluateRangeReference(node);

      case "UnaryExpression":
        return this.evaluateUnary(node);

      case "BinaryExpression":
        return this.evaluateBinary(node);

      case "FunctionCall":
        return this.evaluateFunctionCall(node);

      default:
        throw new Error(`Unsupported AST Node: ${(node as any).type}`);
    }
  }

  private evaluateCellReference(node: CellReferenceNode): FormulaValue {
    this.referencedCells.add(node.raw.toUpperCase());

    const colIdx = this.colLetterToIndex(node.col);
    const colDef = this.dataset.columns[colIdx];
    if (!colDef) {
      return "#REF!";
    }

    const rowNum = node.row;
    const hasHeader = this.dataset.hasHeaderRow !== false;

    // Row 1 is header
    if (hasHeader && rowNum === 1) {
      return colDef.name;
    }

    const dataRowIdx = hasHeader ? rowNum - 2 : rowNum - 1;
    const rowData = this.dataset.rows[dataRowIdx];
    if (!rowData) {
      return "";
    }

    const val = rowData[colDef.key];
    return val !== undefined ? val : "";
  }

  private evaluateRangeReference(node: RangeReferenceNode): FormulaValue[] | FormulaValue[][] {
    this.referencedRanges.add(node.raw.toUpperCase());

    const startColIdx = this.colLetterToIndex(node.startCol);
    const endColIdx = this.colLetterToIndex(node.endCol);
    const minCol = Math.min(startColIdx, endColIdx);
    const maxCol = Math.max(startColIdx, endColIdx);

    const minRow = Math.min(node.startRow, node.endRow);
    const maxRow = Math.max(node.startRow, node.endRow);
    const hasHeader = this.dataset.hasHeaderRow !== false;

    // Single column range: returns 1D array
    if (minCol === maxCol) {
      const colDef = this.dataset.columns[minCol];
      if (!colDef) return ["#REF!"];

      const values: FormulaValue[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        if (hasHeader && r === 1) {
          values.push(colDef.name);
          continue;
        }
        const dataRowIdx = hasHeader ? r - 2 : r - 1;
        const rowData = this.dataset.rows[dataRowIdx];
        if (rowData) {
          const val = rowData[colDef.key];
          values.push(val !== undefined ? val : "");
        } else {
          values.push("");
        }
      }
      return values;
    }

    // Single row range: returns 1D array
    if (minRow === maxRow) {
      const r = minRow;
      const values: FormulaValue[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        const colDef = this.dataset.columns[c];
        if (!colDef) {
          values.push("#REF!");
          continue;
        }
        if (hasHeader && r === 1) {
          values.push(colDef.name);
          continue;
        }
        const dataRowIdx = hasHeader ? r - 2 : r - 1;
        const rowData = this.dataset.rows[dataRowIdx];
        if (rowData) {
          const val = rowData[colDef.key];
          values.push(val !== undefined ? val : "");
        } else {
          values.push("");
        }
      }
      return values;
    }

    // 2D range: returns 2D array [row][col]
    const grid: FormulaValue[][] = [];
    for (let r = minRow; r <= maxRow; r++) {
      const rowValues: FormulaValue[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        const colDef = this.dataset.columns[c];
        if (!colDef) {
          rowValues.push("#REF!");
          continue;
        }
        if (hasHeader && r === 1) {
          rowValues.push(colDef.name);
          continue;
        }
        const dataRowIdx = hasHeader ? r - 2 : r - 1;
        const rowData = this.dataset.rows[dataRowIdx];
        if (rowData) {
          const val = rowData[colDef.key];
          rowValues.push(val !== undefined ? val : "");
        } else {
          rowValues.push("");
        }
      }
      grid.push(rowValues);
    }
    return grid;
  }

  private evaluateUnary(node: UnaryExpressionNode): FormulaValue {
    const arg = this.evaluateNode(node.argument);
    const num = typeof arg === "number" ? arg : parseFloat(String(arg ?? "0"));
    if (isNaN(num)) return "#VALUE!";
    return node.operator === "-" ? -num : +num;
  }

  private evaluateBinary(node: BinaryExpressionNode): FormulaValue {
    const left = this.evaluateNode(node.left);
    const right = this.evaluateNode(node.right);

    switch (node.operator) {
      case "+": {
        const n1 = this.asNumber(left);
        const n2 = this.asNumber(right);
        if (n1 === null || n2 === null) return "#VALUE!";
        return n1 + n2;
      }
      case "-": {
        const n1 = this.asNumber(left);
        const n2 = this.asNumber(right);
        if (n1 === null || n2 === null) return "#VALUE!";
        return n1 - n2;
      }
      case "*": {
        const n1 = this.asNumber(left);
        const n2 = this.asNumber(right);
        if (n1 === null || n2 === null) return "#VALUE!";
        return n1 * n2;
      }
      case "/": {
        const n1 = this.asNumber(left);
        const n2 = this.asNumber(right);
        if (n1 === null || n2 === null) return "#VALUE!";
        if (n2 === 0) return "#DIV/0!";
        return n1 / n2;
      }
      case "^": {
        const n1 = this.asNumber(left);
        const n2 = this.asNumber(right);
        if (n1 === null || n2 === null) return "#VALUE!";
        return Math.pow(n1, n2);
      }
      case "&": {
        return `${left ?? ""}${right ?? ""}`;
      }
      case "=": {
        return this.areEqual(left, right);
      }
      case "<>": {
        return !this.areEqual(left, right);
      }
      case "<": {
        return this.compare(left, right) < 0;
      }
      case "<=": {
        return this.compare(left, right) <= 0;
      }
      case ">": {
        return this.compare(left, right) > 0;
      }
      case ">=": {
        return this.compare(left, right) >= 0;
      }
      default:
        throw new Error(`Unsupported operator: ${node.operator}`);
    }
  }

  private evaluateFunctionCall(node: FunctionCallNode): FormulaValue {
    this.usedFunctions.add(node.canonical);

    const fn = BUILT_IN_FUNCTIONS[node.canonical];
    if (!fn) {
      throw new Error(`Function '${node.canonical}' is not yet implemented.`);
    }

    const evaluatedArgs = node.args.map((argNode) => this.evaluateNode(argNode));
    return fn(...evaluatedArgs);
  }

  private colLetterToIndex(letter: string): number {
    const clean = letter.toUpperCase();
    let index = 0;
    for (let i = 0; i < clean.length; i++) {
      index = index * 26 + (clean.charCodeAt(i) - 65 + 1);
    }
    return index - 1; // 0-based
  }

  private asNumber(val: any): number | null {
    if (typeof val === "number") return isNaN(val) ? null : val;
    if (val === null || val === undefined || val === "") return 0;
    const parsed = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(parsed) ? null : parsed;
  }

  private areEqual(a: any, b: any): boolean {
    if (typeof a === "number" && typeof b === "number") {
      return Math.abs(a - b) < 1e-9;
    }
    return String(a ?? "").toLowerCase() === String(b ?? "").toLowerCase();
  }

  private compare(a: any, b: any): number {
    const n1 = this.asNumber(a);
    const n2 = this.asNumber(b);
    if (n1 !== null && n2 !== null) {
      return n1 - n2;
    }
    return String(a ?? "").localeCompare(String(b ?? ""));
  }
}
