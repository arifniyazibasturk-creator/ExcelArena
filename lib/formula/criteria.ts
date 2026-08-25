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
  public static test(cellValue: FormulaValue, criteria: FormulaValue): boolean {
    if (criteria === null || criteria === undefined) {
      return cellValue === null || cellValue === undefined || cellValue === "";
    }

    // Direct boolean criteria
    if (typeof criteria === "boolean") {
      return Boolean(cellValue) === criteria;
    }

    // Direct numeric criteria
    if (typeof criteria === "number") {
      const numCell = typeof cellValue === "number" ? cellValue : parseFloat(String(cellValue));
      return !isNaN(numCell) && numCell === criteria;
    }

    const critStr = String(criteria).trim();

    // Check operator prefixes in string criteria: >=, <=, <>, >, <, =
    if (critStr.startsWith(">=")) {
      const target = parseFloat(critStr.substring(2).trim());
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum >= target;
    }

    if (critStr.startsWith("<=")) {
      const target = parseFloat(critStr.substring(2).trim());
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum <= target;
    }

    if (critStr.startsWith("<>")) {
      const targetStr = critStr.substring(2).trim();
      const targetNum = parseFloat(targetStr);
      const cellNum = this.asNumber(cellValue);

      if (!isNaN(targetNum) && cellNum !== null) {
        return cellNum !== targetNum;
      }
      return !this.matchesWildcardOrEqual(String(cellValue ?? ""), targetStr);
    }

    if (critStr.startsWith(">")) {
      const target = parseFloat(critStr.substring(1).trim());
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum > target;
    }

    if (critStr.startsWith("<")) {
      const target = parseFloat(critStr.substring(1).trim());
      const cellNum = this.asNumber(cellValue);
      return cellNum !== null && !isNaN(target) && cellNum < target;
    }

    let searchStr = critStr;
    if (searchStr.startsWith("=")) {
      searchStr = searchStr.substring(1).trim();
    }

    // Numeric comparison if search string is pure number
    const targetNum = parseFloat(searchStr);
    const cellNum = this.asNumber(cellValue);
    if (!isNaN(targetNum) && searchStr === String(targetNum) && cellNum !== null) {
      return cellNum === targetNum;
    }

    // String / wildcard comparison
    return this.matchesWildcardOrEqual(String(cellValue ?? ""), searchStr);
  }

  private static asNumber(val: FormulaValue): number | null {
    if (typeof val === "number") return val;
    if (val === null || val === undefined || val === "") return null;
    const parsed = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(parsed) ? null : parsed;
  }

  private static matchesWildcardOrEqual(text: string, pattern: string): boolean {
    const normText = text.toLowerCase().trim();
    const normPattern = pattern.toLowerCase().trim();

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
