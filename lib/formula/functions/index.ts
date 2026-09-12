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
  // Lookup & Reference Functions
  XLOOKUP: (
    lookupValue: any,
    lookupArray: any[],
    returnArray: any[],
    ifNotFound: any = "#N/A",
    matchMode: any = 0,
    searchMode: any = 1
  ) => {
    if (!Array.isArray(lookupArray) || !Array.isArray(returnArray)) return "#VALUE!";
    const reverse = searchMode === -1 || searchMode === "-1";
    const startIdx = reverse ? lookupArray.length - 1 : 0;
    const endIdx = reverse ? -1 : lookupArray.length;
    const step = reverse ? -1 : 1;

    for (let i = startIdx; i !== endIdx; i += step) {
      if (CriteriaMatcher.test(lookupArray[i], lookupValue)) {
        if (Array.isArray(returnArray[0])) {
          // If returnArray is 2D and lookup array matched horizontal headers:
          if (lookupArray.length === (returnArray[0] as any[]).length) {
            return returnArray.map((r) => (Array.isArray(r) ? r[i] : r));
          }
          return returnArray[i] ?? null;
        }
        return returnArray[i] ?? null;
      }
    }
    return ifNotFound;
  },

  VLOOKUP: (
    lookupValue: any,
    tableArray: any[][],
    colIndex: any,
    rangeLookup: any = false
  ) => {
    if (!Array.isArray(tableArray) || tableArray.length === 0) return "#VALUE!";
    const colIdx = (typeof colIndex === "number" ? colIndex : parseInt(String(colIndex), 10)) - 1;
    if (isNaN(colIdx) || colIdx < 0) return "#VALUE!";

    const isApproximate =
      rangeLookup === true ||
      rangeLookup === 1 ||
      String(rangeLookup).toLowerCase() === "true" ||
      String(rangeLookup).toLowerCase() === "doğru" ||
      String(rangeLookup).toLowerCase() === "dogru";

    if (!isApproximate) {
      for (let i = 0; i < tableArray.length; i++) {
        const row = tableArray[i];
        if (Array.isArray(row) && row.length > 0) {
          if (CriteriaMatcher.test(row[0], lookupValue)) {
            return row[colIdx] ?? "#REF!";
          }
        }
      }
      return "#N/A";
    }

    // Approximate Match (Find largest item <= lookupValue in sorted 1st column)
    let bestRowIdx = -1;
    const lookupNum = typeof lookupValue === "number" ? lookupValue : parseFloat(String(lookupValue));

    for (let i = 0; i < tableArray.length; i++) {
      const row = tableArray[i];
      if (Array.isArray(row) && row.length > 0) {
        const cellVal = row[0];
        const cellNum = typeof cellVal === "number" ? cellVal : parseFloat(String(cellVal));
        if (!isNaN(lookupNum) && !isNaN(cellNum)) {
          if (cellNum <= lookupNum) {
            bestRowIdx = i;
          } else {
            break;
          }
        } else if (String(cellVal).localeCompare(String(lookupValue)) <= 0) {
          bestRowIdx = i;
        }
      }
    }

    if (bestRowIdx !== -1) {
      return tableArray[bestRowIdx][colIdx] ?? "#REF!";
    }
    return "#N/A";
  },

  HLOOKUP: (
    lookupValue: any,
    tableArray: any[][],
    rowIndex: any,
    rangeLookup: any = false
  ) => {
    if (!Array.isArray(tableArray) || tableArray.length === 0) return "#VALUE!";
    const rowIdx = (typeof rowIndex === "number" ? rowIndex : parseInt(String(rowIndex), 10)) - 1;
    if (isNaN(rowIdx) || rowIdx < 0 || !tableArray[rowIdx]) return "#REF!";

    const headerRow = tableArray[0];
    if (!Array.isArray(headerRow)) return "#VALUE!";

    const isApproximate =
      rangeLookup === true ||
      rangeLookup === 1 ||
      String(rangeLookup).toLowerCase() === "true" ||
      String(rangeLookup).toLowerCase() === "doğru";

    if (!isApproximate) {
      for (let col = 0; col < headerRow.length; col++) {
        if (CriteriaMatcher.test(headerRow[col], lookupValue)) {
          return tableArray[rowIdx][col] ?? "#REF!";
        }
      }
      return "#N/A";
    }

    let bestColIdx = -1;
    const lookupNum = typeof lookupValue === "number" ? lookupValue : parseFloat(String(lookupValue));
    for (let col = 0; col < headerRow.length; col++) {
      const cellVal = headerRow[col];
      const cellNum = typeof cellVal === "number" ? cellVal : parseFloat(String(cellVal));
      if (!isNaN(lookupNum) && !isNaN(cellNum)) {
        if (cellNum <= lookupNum) {
          bestColIdx = col;
        } else {
          break;
        }
      } else if (String(cellVal).localeCompare(String(lookupValue)) <= 0) {
        bestColIdx = col;
      }
    }

    if (bestColIdx !== -1) {
      return tableArray[rowIdx][bestColIdx] ?? "#REF!";
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
    const mType = typeof matchType === "number" ? matchType : parseInt(String(matchType), 10) || 0;

    // Exact Match (matchType === 0)
    if (mType === 0) {
      for (let i = 0; i < lookupArray.length; i++) {
        if (CriteriaMatcher.test(lookupArray[i], lookupValue)) {
          return i + 1; // 1-based index
        }
      }
      return "#N/A";
    }

    // Less than or equal to (matchType === 1)
    if (mType === 1) {
      let bestIdx = -1;
      const target = typeof lookupValue === "number" ? lookupValue : parseFloat(String(lookupValue));
      for (let i = 0; i < lookupArray.length; i++) {
        const item = typeof lookupArray[i] === "number" ? lookupArray[i] : parseFloat(String(lookupArray[i]));
        if (!isNaN(item) && !isNaN(target)) {
          if (item <= target) {
            bestIdx = i + 1;
          } else {
            break;
          }
        }
      }
      return bestIdx !== -1 ? bestIdx : "#N/A";
    }

    // Greater than or equal to (matchType === -1)
    if (mType === -1) {
      let bestIdx = -1;
      const target = typeof lookupValue === "number" ? lookupValue : parseFloat(String(lookupValue));
      for (let i = 0; i < lookupArray.length; i++) {
        const item = typeof lookupArray[i] === "number" ? lookupArray[i] : parseFloat(String(lookupArray[i]));
        if (!isNaN(item) && !isNaN(target)) {
          if (item >= target) {
            bestIdx = i + 1;
          } else {
            break;
          }
        }
      }
      return bestIdx !== -1 ? bestIdx : "#N/A";
    }

    return "#N/A";
  },

  XMATCH: (lookupValue: any, lookupArray: any[], matchMode: any = 0, searchMode: any = 1) => {
    if (!Array.isArray(lookupArray)) return "#VALUE!";
    const reverse = searchMode === -1 || searchMode === "-1";
    const startIdx = reverse ? lookupArray.length - 1 : 0;
    const endIdx = reverse ? -1 : lookupArray.length;
    const step = reverse ? -1 : 1;

    // Exact Match (matchMode === 0 or default) or Wildcard Match (matchMode === 2)
    if (matchMode === 0 || matchMode === "0" || matchMode === 2 || matchMode === "2") {
      for (let i = startIdx; i !== endIdx; i += step) {
        if (CriteriaMatcher.test(lookupArray[i], lookupValue)) {
          return i + 1;
        }
      }
      return "#N/A";
    }

    // Exact match or next smaller item (matchMode === -1)
    if (matchMode === -1 || matchMode === "-1") {
      let bestIdx = -1;
      let bestDiff = Infinity;
      const target = typeof lookupValue === "number" ? lookupValue : parseFloat(String(lookupValue));
      for (let i = 0; i < lookupArray.length; i++) {
        const item = typeof lookupArray[i] === "number" ? lookupArray[i] : parseFloat(String(lookupArray[i]));
        if (!isNaN(item) && !isNaN(target) && item <= target) {
          const diff = target - item;
          if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i + 1;
          }
        }
      }
      return bestIdx !== -1 ? bestIdx : "#N/A";
    }

    // Exact match or next larger item (matchMode === 1)
    if (matchMode === 1 || matchMode === "1") {
      let bestIdx = -1;
      let bestDiff = Infinity;
      const target = typeof lookupValue === "number" ? lookupValue : parseFloat(String(lookupValue));
      for (let i = 0; i < lookupArray.length; i++) {
        const item = typeof lookupArray[i] === "number" ? lookupArray[i] : parseFloat(String(lookupArray[i]));
        if (!isNaN(item) && !isNaN(target) && item >= target) {
          const diff = item - target;
          if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i + 1;
          }
        }
      }
      return bestIdx !== -1 ? bestIdx : "#N/A";
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

  // Information & Count Functions
  COUNTBLANK: (...args: any[]) => {
    const all = flattenAll(args);
    return all.filter((v) => v === "" || v === null || v === undefined).length;
  },

  ISBLANK: (value: any) => {
    return value === "" || value === null || value === undefined;
  },

  ISNUMBER: (value: any) => {
    return typeof value === "number" && !isNaN(value);
  },

  ISTEXT: (value: any) => {
    return typeof value === "string";
  },

  ISERROR: (value: any) => {
    return typeof value === "string" && value.startsWith("#");
  },

  // Dynamic Array & Data Functions
  FILTER: (array: any[], include: any, ifEmpty: any = "#CALC!") => {
    if (!Array.isArray(array)) return "#VALUE!";
    let mask: boolean[] = [];

    if (Array.isArray(include)) {
      mask = include.map((v) => Boolean(v));
    } else {
      mask = [Boolean(include)];
    }

    const filtered = array.filter((_, idx) => Boolean(mask[idx]));
    if (filtered.length === 0) return ifEmpty;

    // In single-cell expectation contexts, return the first cell/row if matched
    return filtered;
  },

  SORT: (array: any[], sortIndex: any = 1, sortOrder: any = 1) => {
    if (!Array.isArray(array)) return "#VALUE!";
    const colIdx = (typeof sortIndex === "number" ? sortIndex : parseInt(String(sortIndex), 10) || 1) - 1;
    const order = sortOrder === -1 || sortOrder === "-1" ? -1 : 1;

    const copy = [...array];
    return copy.sort((a, b) => {
      const valA = Array.isArray(a) ? a[colIdx] ?? a[0] : a;
      const valB = Array.isArray(b) ? b[colIdx] ?? b[0] : b;

      const numA = typeof valA === "number" ? valA : parseFloat(String(valA));
      const numB = typeof valB === "number" ? valB : parseFloat(String(valB));

      if (!isNaN(numA) && !isNaN(numB)) {
        return (numA - numB) * order;
      }
      return String(valA).localeCompare(String(valB)) * order;
    });
  },

  UNIQUE: (array: any[]) => {
    if (!Array.isArray(array)) return "#VALUE!";
    if (array.length > 0 && Array.isArray(array[0])) {
      const seen = new Set<string>();
      const result: any[] = [];
      for (const row of array) {
        const key = JSON.stringify(row);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(row);
        }
      }
      return result;
    }
    return Array.from(new Set(array));
  },
};
