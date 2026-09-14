import { FormulaValue } from "./types";

export class CriteriaMatcher {
  /**
   * Tests whether a cell value satisfies an Excel criteria string/number/boolean.
   * e.g.
   *   testCriteria(12000, ">10000") -> true
   *   testCriteria("Ankara", "Ankara") -> true
   *   testCriteria("Istanbul", "<>Ankara") -> true
   *   testCriteria("Product A", "Prod*") -> true
   */
  private static parseCleanNumber(val: any): number {
    if (typeof val === "number") return val;
    let s = String(val ?? "").trim();
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
    return parseFloat(s);
  }

  public static test(cellValue: FormulaValue, criteria: FormulaValue): boolean {
    if (criteria === null || criteria === undefined) {
      return cellValue === null || cellValue === undefined || cellValue === "";
    }

    // Direct boolean criteria
    if (typeof criteria === "boolean") {
      if (typeof cellValue === "boolean") return cellValue === criteria;
      if (typeof cellValue === "number") return (cellValue !== 0) === criteria;
      return Boolean(cellValue) === criteria;
    }

    // Direct numeric criteria
    if (typeof criteria === "number") {
      let numCell: number;
      if (typeof cellValue === "number") {
        numCell = cellValue;
      } else if (typeof cellValue === "boolean") {
        numCell = cellValue ? 1 : 0;
      } else {
        numCell = this.parseCleanNumber(cellValue);
      }
      return !isNaN(numCell) && Math.abs(numCell - criteria) < 1e-9;
    }

    const critStr = String(criteria).trim();

    // Check operator prefixes in string criteria: >=, <=, <>, >, <, =
    if (critStr.startsWith(">=")) {
      const target = this.parseCleanNumber(critStr.substring(2));
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum >= target - 1e-9;
    }

    if (critStr.startsWith("<=")) {
      const target = this.parseCleanNumber(critStr.substring(2));
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum <= target + 1e-9;
    }

    if (critStr.startsWith("<>")) {
      const targetStr = critStr.substring(2).trim();
      const targetNum = this.parseCleanNumber(targetStr);
      const cellNum = this.asNumber(cellValue);

      if (!isNaN(targetNum) && cellNum !== null && !isNaN(Number(targetStr.replace(/,/g, "")))) {
        return Math.abs(cellNum - targetNum) > 1e-9;
      }
      return !this.matchesWildcardOrEqual(String(cellValue ?? ""), targetStr);
    }

    if (critStr.startsWith(">")) {
      const target = this.parseCleanNumber(critStr.substring(1));
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum > target + 1e-9;
    }

    if (critStr.startsWith("<")) {
      const target = this.parseCleanNumber(critStr.substring(1));
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum < target - 1e-9;
    }

    let searchStr = critStr;
    if (searchStr.startsWith("=")) {
      searchStr = searchStr.substring(1).trim();
    }

    // Numeric comparison if search string is a number
    const targetNum = this.parseCleanNumber(searchStr);
    const cellNum = this.asNumber(cellValue);
    const numCleaned = searchStr.replace(/,/g, "");
    if (!isNaN(targetNum) && cellNum !== null && isFinite(Number(numCleaned))) {
      return Math.abs(cellNum - targetNum) < 1e-9;
    }

    // String / wildcard comparison
    return this.matchesWildcardOrEqual(String(cellValue ?? ""), searchStr);
  }

  private static asNumber(val: FormulaValue): number | null {
    if (typeof val === "number") return isNaN(val) ? null : val;
    if (val === null || val === undefined || val === "") return null;
    const parsed = this.parseCleanNumber(val);
    return isNaN(parsed) ? null : parsed;
  }

  private static normalizeText(str: string): string {
    return str
      .replace(/İ/g, "i")
      .replace(/I/g, "ı")
      .toLowerCase()
      .trim();
  }

  private static matchesWildcardOrEqual(text: string, pattern: string): boolean {
    const normText = this.normalizeText(text);
    const normPattern = this.normalizeText(pattern);

    if (!normPattern.includes("*") && !normPattern.includes("?")) {
      return normText === normPattern;
    }

    // Convert Excel wildcard to Regex
    // Escape special regex chars except * and ?
    let regexStr = "^";
    let i = 0;
    while (i < normPattern.length) {
      const char = normPattern[i];
      if (char === "~") {
        // Escape next char
        if (i + 1 < normPattern.length) {
          regexStr += this.escapeRegexChar(normPattern[i + 1]);
          i += 2;
          continue;
        }
      }
      if (char === "*") {
        regexStr += ".*";
      } else if (char === "?") {
        regexStr += ".";
      } else {
        regexStr += this.escapeRegexChar(char);
      }
      i++;
    }
    regexStr += "$";

    try {
      const regex = new RegExp(regexStr, "i");
      return regex.test(normText);
    } catch {
      return normText === normPattern;
    }
  }

  private static escapeRegexChar(c: string): string {
    return /[.*+?^${}()|[\]\\]/.test(c) ? `\\${c}` : c;
  }
}
