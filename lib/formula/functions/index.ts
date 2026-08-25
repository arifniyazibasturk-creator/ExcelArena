import { CanonicalFunctionId, FormulaValue } from "../types";
import { CriteriaMatcher } from "../criteria";

type FunctionImplementation = (...args: any[]) => FormulaValue;

function flattenNumbers(args: any[]): number[] {
  const result: number[] = [];
  function recurse(item: any) {
    if (Array.isArray(item)) {
      item.forEach(recurse);
    } else if (typeof item === "number" && !isNaN(item)) {
      result.push(item);
    } else if (typeof item === "string" && item.trim() !== "") {
      const parsed = parseFloat(item.replace(/,/g, ""));
      if (!isNaN(parsed)) {
        result.push(parsed);
      }
    }
  }
  args.forEach(recurse);
  return result;
}

function flattenAll(args: any[]): any[] {
  const result: any[] = [];
  function recurse(item: any) {
    if (Array.isArray(item)) {
      item.forEach(recurse);
    } else if (item !== undefined) {
      result.push(item);
    }
  }
  args.forEach(recurse);
  return result;
}

export const BUILT_IN_FUNCTIONS: Record<string, FunctionImplementation> = {
  // Aggregation Functions
  SUM: (...args: any[]) => {
    const nums = flattenNumbers(args);
    return nums.reduce((acc, val) => acc + val, 0);
  },

  AVERAGE: (...args: any[]) => {
    const nums = flattenNumbers(args);
    if (nums.length === 0) return "#DIV/0!";
    const sum = nums.reduce((acc, val) => acc + val, 0);
    return sum / nums.length;
  },

  MIN: (...args: any[]) => {
    const nums = flattenNumbers(args);
    if (nums.length === 0) return 0;
    return Math.min(...nums);
  },

  MAX: (...args: any[]) => {
    const nums = flattenNumbers(args);
    if (nums.length === 0) return 0;
    return Math.max(...nums);
  },

  COUNT: (...args: any[]) => {
    const nums = flattenNumbers(args);
    return nums.length;
  },

  COUNTA: (...args: any[]) => {
    const all = flattenAll(args);
    const nonBlank = all.filter((v) => v !== null && v !== undefined && v !== "");
    return nonBlank.length;
  },

  // Logical Functions
  IF: (test: any, valueIfTrue: any, valueIfFalse: any = false) => {
    return Boolean(test) ? valueIfTrue : valueIfFalse;
  },

  IFS: (...args: any[]) => {
    if (args.length < 2 || args.length % 2 !== 0) return "#VALUE!";
    for (let i = 0; i < args.length; i += 2) {
      if (Boolean(args[i])) {
        return args[i + 1];
      }
    }
    return "#N/A";
  },

  AND: (...args: any[]) => {
    const all = flattenAll(args);
    if (all.length === 0) return "#VALUE!";
    return all.every((val) => Boolean(val));
  },

  OR: (...args: any[]) => {
    const all = flattenAll(args);
    if (all.length === 0) return "#VALUE!";
    return all.some((val) => Boolean(val));
  },

  NOT: (arg: any) => {
    return !Boolean(arg);
  },

  IFERROR: (value: any, valueIfError: any) => {
    if (typeof value === "string" && value.startsWith("#")) {
      return valueIfError;
    }
    if (value === undefined || value === null) {
      return value;
    }
    return value;
  },

  // Conditional Aggregations
  COUNTIF: (range: any[], criteria: any) => {
    if (!Array.isArray(range)) range = [range];
    let count = 0;
    for (const cell of range) {
      if (CriteriaMatcher.test(cell, criteria)) {
        count++;
      }
    }
    return count;
  },

  SUMIF: (range: any[], criteria: any, sumRange?: any[]) => {
    if (!Array.isArray(range)) range = [range];
    const targets = Array.isArray(sumRange) ? sumRange : range;
    let sum = 0;

    for (let i = 0; i < range.length; i++) {
      if (CriteriaMatcher.test(range[i], criteria)) {
        const val = targets[i];
        const num = typeof val === "number" ? val : parseFloat(String(val ?? "0").replace(/,/g, ""));
        if (!isNaN(num)) {
          sum += num;
        }
      }
    }
    return sum;
  },

  AVERAGEIF: (range: any[], criteria: any, avgRange?: any[]) => {
    if (!Array.isArray(range)) range = [range];
    const targets = Array.isArray(avgRange) ? avgRange : range;
    let sum = 0;
    let count = 0;

    for (let i = 0; i < range.length; i++) {
      if (CriteriaMatcher.test(range[i], criteria)) {
        const val = targets[i];
        const num = typeof val === "number" ? val : parseFloat(String(val ?? "0").replace(/,/g, ""));
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    return count > 0 ? sum / count : "#DIV/0!";
  },

  COUNTIFS: (...args: any[]) => {
    if (args.length < 2 || args.length % 2 !== 0) return "#VALUE!";
    const pairs: { range: any[]; criteria: any }[] = [];
    let minLen = Infinity;

    for (let i = 0; i < args.length; i += 2) {
      const range = Array.isArray(args[i]) ? args[i] : [args[i]];
      const criteria = args[i + 1];
      pairs.push({ range, criteria });
      if (range.length < minLen) minLen = range.length;
    }

    let count = 0;
    for (let rowIdx = 0; rowIdx < minLen; rowIdx++) {
      const satisfiesAll = pairs.every(({ range, criteria }) =>
        CriteriaMatcher.test(range[rowIdx], criteria)
      );
      if (satisfiesAll) count++;
    }
    return count;
  },

  SUMIFS: (sumRange: any[], ...criteriaPairs: any[]) => {
    if (!Array.isArray(sumRange) || criteriaPairs.length < 2 || criteriaPairs.length % 2 !== 0) {
      return "#VALUE!";
    }

    const pairs: { range: any[]; criteria: any }[] = [];
    let minLen = sumRange.length;

    for (let i = 0; i < criteriaPairs.length; i += 2) {
      const range = Array.isArray(criteriaPairs[i]) ? criteriaPairs[i] : [criteriaPairs[i]];
      const criteria = criteriaPairs[i + 1];
      pairs.push({ range, criteria });
      if (range.length < minLen) minLen = range.length;
    }

    let sum = 0;
    for (let rowIdx = 0; rowIdx < minLen; rowIdx++) {
      const satisfiesAll = pairs.every(({ range, criteria }) =>
        CriteriaMatcher.test(range[rowIdx], criteria)
      );

      if (satisfiesAll) {
        const val = sumRange[rowIdx];
        const num = typeof val === "number" ? val : parseFloat(String(val ?? "0").replace(/,/g, ""));
        if (!isNaN(num)) sum += num;
      }
    }
    return sum;
  },

  AVERAGEIFS: (avgRange: any[], ...criteriaPairs: any[]) => {
    if (!Array.isArray(avgRange) || criteriaPairs.length < 2 || criteriaPairs.length % 2 !== 0) {
      return "#VALUE!";
    }

    const pairs: { range: any[]; criteria: any }[] = [];
    let minLen = avgRange.length;

    for (let i = 0; i < criteriaPairs.length; i += 2) {
      const range = Array.isArray(criteriaPairs[i]) ? criteriaPairs[i] : [criteriaPairs[i]];
      const criteria = criteriaPairs[i + 1];
      pairs.push({ range, criteria });
      if (range.length < minLen) minLen = range.length;
    }

    let sum = 0;
    let count = 0;

    for (let rowIdx = 0; rowIdx < minLen; rowIdx++) {
      const satisfiesAll = pairs.every(({ range, criteria }) =>
        CriteriaMatcher.test(range[rowIdx], criteria)
      );

      if (satisfiesAll) {
        const val = avgRange[rowIdx];
        const num = typeof val === "number" ? val : parseFloat(String(val ?? "0").replace(/,/g, ""));
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    return count > 0 ? sum / count : "#DIV/0!";
  },

  // Text Functions
  LEFT: (text: any, numChars: any = 1) => {
    const str = String(text ?? "");
    const count = typeof numChars === "number" ? numChars : parseInt(String(numChars), 10) || 1;
    return str.substring(0, Math.max(0, count));
  },

  RIGHT: (text: any, numChars: any = 1) => {
    const str = String(text ?? "");
    const count = typeof numChars === "number" ? numChars : parseInt(String(numChars), 10) || 1;
    if (count <= 0) return "";
    return str.substring(Math.max(0, str.length - count));
  },

  MID: (text: any, startNum: any, numChars: any) => {
    const str = String(text ?? "");
    const start = typeof startNum === "number" ? startNum : parseInt(String(startNum), 10) || 1;
    const count = typeof numChars === "number" ? numChars : parseInt(String(numChars), 10) || 0;
    if (start < 1) return "#VALUE!";
    return str.substring(start - 1, start - 1 + Math.max(0, count));
  },

  LEN: (text: any) => {
    return String(text ?? "").length;
  },

  TRIM: (text: any) => {
    return String(text ?? "").replace(/\s+/g, " ").trim();
  },

  PROPER: (text: any) => {
    return String(text ?? "")
      .toLowerCase()
      .replace(/(?:^|\s|\b)\w/g, (char) => char.toUpperCase());
  },

  UPPER: (text: any) => {
    return String(text ?? "").toUpperCase();
  },

  LOWER: (text: any) => {
    return String(text ?? "").toLowerCase();
  },

  FIND: (findText: any, withinText: any, startNum: any = 1) => {
    const target = String(findText ?? "");
    const source = String(withinText ?? "");
    const start = typeof startNum === "number" ? startNum : parseInt(String(startNum), 10) || 1;
    if (start < 1 || start > source.length + 1) return "#VALUE!";
    const idx = source.indexOf(target, start - 1);
    return idx === -1 ? "#VALUE!" : idx + 1;
  },

  SEARCH: (findText: any, withinText: any, startNum: any = 1) => {
    const target = String(findText ?? "").toLowerCase();
    const source = String(withinText ?? "").toLowerCase();
    const start = typeof startNum === "number" ? startNum : parseInt(String(startNum), 10) || 1;
    if (start < 1 || start > source.length + 1) return "#VALUE!";
    const idx = source.indexOf(target, start - 1);
    return idx === -1 ? "#VALUE!" : idx + 1;
  },

  SUBSTITUTE: (text: any, oldText: any, newText: any, instanceNum?: any) => {
    const str = String(text ?? "");
    const oldT = String(oldText ?? "");
    const newT = String(newText ?? "");
    if (!oldT) return str;

    if (instanceNum === undefined || instanceNum === null) {
      return str.split(oldT).join(newT);
    }

    const targetInst = typeof instanceNum === "number" ? instanceNum : parseInt(String(instanceNum), 10);
    if (isNaN(targetInst) || targetInst < 1) return str;

    let count = 0;
    return str.replace(new RegExp(oldT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), (match) => {
      count++;
      return count === targetInst ? newT : match;
    });
  },

  CONCAT: (...args: any[]) => {
    const all = flattenAll(args);
    return all.join("");
  },

  TEXTJOIN: (delimiter: any, ignoreEmpty: any, ...args: any[]) => {
    const delim = String(delimiter ?? "");
    const shouldIgnore = Boolean(ignoreEmpty);
    const all = flattenAll(args);
    const filtered = shouldIgnore
      ? all.filter((v) => v !== null && v !== undefined && String(v).trim() !== "")
      : all;
    return filtered.join(delim);
  },

  // Lookup & Reference Functions
  XLOOKUP: (
    lookupValue: any,
    lookupArray: any[],
    returnArray: any[],
    ifNotFound: any = "#N/A"
  ) => {
    if (!Array.isArray(lookupArray) || !Array.isArray(returnArray)) return "#VALUE!";
    for (let i = 0; i < lookupArray.length; i++) {
      if (CriteriaMatcher.test(lookupArray[i], lookupValue)) {
        return returnArray[i] ?? null;
      }
    }
    return ifNotFound;
  },

  VLOOKUP: (
    lookupValue: any,
    tableArray: any[][],
    colIndex: any,
    exactMatch: any = true
  ) => {
    if (!Array.isArray(tableArray) || tableArray.length === 0) return "#VALUE!";
    const colIdx = (typeof colIndex === "number" ? colIndex : parseInt(String(colIndex), 10)) - 1;
    if (isNaN(colIdx) || colIdx < 0) return "#VALUE!";

    for (let i = 0; i < tableArray.length; i++) {
      const row = tableArray[i];
      if (Array.isArray(row) && row.length > 0) {
        if (CriteriaMatcher.test(row[0], lookupValue)) {
          return row[colIdx] ?? "#REF!";
        }
      }
    }
    return "#N/A";
  },

  HLOOKUP: (
    lookupValue: any,
    tableArray: any[][],
    rowIndex: any,
    exactMatch: any = true
  ) => {
    if (!Array.isArray(tableArray) || tableArray.length === 0) return "#VALUE!";
    const rowIdx = (typeof rowIndex === "number" ? rowIndex : parseInt(String(rowIndex), 10)) - 1;
    if (isNaN(rowIdx) || rowIdx < 0 || !tableArray[rowIdx]) return "#REF!";

    const headerRow = tableArray[0];
    if (!Array.isArray(headerRow)) return "#VALUE!";

    for (let col = 0; col < headerRow.length; col++) {
      if (CriteriaMatcher.test(headerRow[col], lookupValue)) {
        return tableArray[rowIdx][col] ?? "#REF!";
      }
    }
    return "#N/A";
  },

  INDEX: (array: any[] | any[][], rowNum: any, colNum?: any) => {
    const row = typeof rowNum === "number" ? rowNum : parseInt(String(rowNum), 10);
    if (isNaN(row) || row < 1) return "#VALUE!";
    if (!Array.isArray(array)) return "#VALUE!";

    // 1D array
    if (!Array.isArray(array[0])) {
      return array[row - 1] ?? "#REF!";
    }

    // 2D array
    const col = colNum !== undefined ? (typeof colNum === "number" ? colNum : parseInt(String(colNum), 10)) : 1;
    if (isNaN(col) || col < 1) return "#VALUE!";

    const targetRow = (array as any[][])[row - 1];
    if (!targetRow) return "#REF!";
    return targetRow[col - 1] ?? "#REF!";
  },

  MATCH: (lookupValue: any, lookupArray: any[], matchType: any = 0) => {
    if (!Array.isArray(lookupArray)) return "#VALUE!";
    for (let i = 0; i < lookupArray.length; i++) {
      if (CriteriaMatcher.test(lookupArray[i], lookupValue)) {
        return i + 1; // 1-based index
      }
    }
    return "#N/A";
  },

  XMATCH: (lookupValue: any, lookupArray: any[], matchMode: any = 0) => {
    if (!Array.isArray(lookupArray)) return "#VALUE!";
    for (let i = 0; i < lookupArray.length; i++) {
      if (CriteriaMatcher.test(lookupArray[i], lookupValue)) {
        return i + 1;
      }
    }
    return "#N/A";
  },

  // Date & Time Functions
  DATE: (year: any, month: any, day: any) => {
    const y = typeof year === "number" ? year : parseInt(String(year), 10);
    const m = typeof month === "number" ? month : parseInt(String(month), 10);
    const d = typeof day === "number" ? day : parseInt(String(day), 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return "#VALUE!";
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toISOString().split("T")[0];
  },

  YEAR: (serial: any) => {
    const d = new Date(String(serial));
    return isNaN(d.getTime()) ? "#VALUE!" : d.getUTCFullYear();
  },

  MONTH: (serial: any) => {
    const d = new Date(String(serial));
    return isNaN(d.getTime()) ? "#VALUE!" : d.getUTCMonth() + 1;
  },

  DAY: (serial: any) => {
    const d = new Date(String(serial));
    return isNaN(d.getTime()) ? "#VALUE!" : d.getUTCDate();
  },

  TODAY: () => {
    return new Date().toISOString().split("T")[0];
  },

  NOW: () => {
    return new Date().toISOString();
  },

  FILTER: (array: any[], include: boolean[], ifEmpty: any = "#CALC!") => {
    if (!Array.isArray(array) || !Array.isArray(include)) return "#VALUE!";
    const result = array.filter((_, idx) => Boolean(include[idx]));
    return result.length > 0 ? result : ifEmpty;
  },

  SORT: (array: any[]) => {
    if (!Array.isArray(array)) return "#VALUE!";
    return [...array].sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      return String(a).localeCompare(String(b));
    });
  },

  UNIQUE: (array: any[]) => {
    if (!Array.isArray(array)) return "#VALUE!";
    return Array.from(new Set(array));
  },
};
