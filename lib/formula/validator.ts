import { ChallengeDataset, FormulaValue, ValidationFeedback } from "./types";
import { FormulaEvaluator } from "./evaluator";
import { CanonicalFunctionId } from "../i18n/types";
import { FORMULA_DEFINITIONS } from "../i18n/formulaLocale";

export const KNOWN_EXCEL_FUNCTIONS = new Set<string>([
  "SUM",
  "AVERAGE",
  "MIN",
  "MAX",
  "COUNT",
  "COUNTA",
  "IF",
  "IFS",
  "AND",
  "OR",
  "NOT",
  "COUNTIF",
  "SUMIF",
  "AVERAGEIF",
  "COUNTIFS",
  "SUMIFS",
  "AVERAGEIFS",
  "XLOOKUP",
  "VLOOKUP",
  "HLOOKUP",
  "INDEX",
  "MATCH",
  "XMATCH",
  "IFERROR",
  "LEFT",
  "RIGHT",
  "MID",
  "LEN",
  "TRIM",
  "PROPER",
  "UPPER",
  "LOWER",
  "FIND",
  "SEARCH",
  "SUBSTITUTE",
  "CONCAT",
  "TEXTJOIN",
  "DATE",
  "YEAR",
  "MONTH",
  "DAY",
  "TODAY",
  "NOW",
  "FILTER",
  "SORT",
  "UNIQUE",
]);

export interface ValidationOptions {
  dataset: ChallengeDataset;
  expectedResult: FormulaValue;
  expectedConcept?: string;
  requireDataReference?: boolean; // Default true (anti-cheat against hardcoded values)
  tolerance?: number; // For floats, default 1e-6
  customValidation?: (result: FormulaValue, formula: string) => { isValid: boolean; messageEn?: string; messageTr?: string };
}

export class FormulaValidator {
  public static validate(
    userFormula: string,
    options: ValidationOptions
  ): ValidationFeedback {
    const trimmed = userFormula.trim();

    if (!trimmed) {
      return {
        isValid: false,
        isCorrect: false,
        status: "empty",
        messageEn: "Please enter a formula.",
        messageTr: "Lütfen bir formül yazın.",
        usedFunctions: [],
        isEquivalent: false,
      };
    }

    // 1. Evaluate formula deterministically
    const evalResult = FormulaEvaluator.evaluate(trimmed, options.dataset);

    if (!evalResult.success) {
      return {
        isValid: false,
        isCorrect: false,
        status: "syntax_error",
        messageEn: `Syntax error: ${evalResult.errorMessage || "Please check your formula syntax and parentheses."}`,
        messageTr: `Sözdizimi hatası: ${evalResult.errorMessage || "Lütfen formül sözdizimini ve parantezleri kontrol edin."}`,
        usedFunctions: [],
        isEquivalent: false,
      };
    }

    const userResult = evalResult.value;
    const usedFunctions = evalResult.usedFunctions || [];

    // Check for runtime Excel errors (#VALUE!, #DIV/0!, #REF!, #NAME?, etc.)
    if (typeof userResult === "string" && userResult.startsWith("#")) {
      return {
        isValid: true,
        isCorrect: false,
        userResult,
        expectedResult: options.expectedResult,
        status: "runtime_error",
        messageEn: `Formula produced an Excel error: ${userResult}. Verify your cell references and argument types.`,
        messageTr: `Formül bir Excel hatası üretti: ${userResult}. Hücre referanslarınızı ve bağımsız değişken türlerini kontrol edin.`,
        usedFunctions,
        isEquivalent: false,
      };
    }

    // 2. Anti-cheat: Check if formula references cells or ranges
    const requireData = options.requireDataReference !== false;
    const hasReferences =
      (evalResult.referencedCells && evalResult.referencedCells.length > 0) ||
      (evalResult.referencedRanges && evalResult.referencedRanges.length > 0);

    if (requireData && !hasReferences && usedFunctions.length === 0) {
      return {
        isValid: true,
        isCorrect: false,
        userResult,
        expectedResult: options.expectedResult,
        status: "hardcoded_warning",
        messageEn: "Your formula contains a hardcoded static value. You must reference cells or ranges from the dataset.",
        messageTr: "Formülünüz doğrudan sabit bir sayı içeriyor. Tablodaki hücre veya aralıkları referans göstermelisiniz.",
        usedFunctions,
        isEquivalent: false,
      };
    }

    // 3. Compare user result with expected result
    const isValueEqual = this.areValuesEqual(userResult, options.expectedResult, options.tolerance ?? 1e-6);

    // 4. Custom validation if specified
    if (options.customValidation) {
      const customRes = options.customValidation(userResult, trimmed);
      if (!customRes.isValid) {
        return {
          isValid: true,
          isCorrect: false,
          userResult,
          expectedResult: options.expectedResult,
          status: "incorrect",
          messageEn: customRes.messageEn || "Your formula did not satisfy all challenge constraints.",
          messageTr: customRes.messageTr || "Formülünüz sorudaki tüm kısıtlamaları karşılamadı.",
          usedFunctions,
          isEquivalent: false,
        };
      }
    }

    const isConceptAFunction = options.expectedConcept && KNOWN_EXCEL_FUNCTIONS.has(options.expectedConcept);

    if (isValueEqual) {
      const isEquivalent = isConceptAFunction
        ? !usedFunctions.includes(options.expectedConcept as CanonicalFunctionId)
        : false;

      return {
        isValid: true,
        isCorrect: true,
        userResult,
        expectedResult: options.expectedResult,
        status: "correct",
        messageEn: isEquivalent
          ? "Correct! Your formula evaluates to the expected result using a valid alternative approach."
          : "Correct! Your formula produces the expected result and matches the required logic.",
        messageTr: isEquivalent
          ? "Doğru! Formülünüz geçerli bir alternatif yöntem kullanarak beklenen sonucu üretti."
          : "Doğru! Formülünüz beklenen sonucu başarıyla üretti ve mantıkla tam eşleşti.",
        usedFunctions,
        isEquivalent,
      };
    }

    // Pedagogical feedback for incorrect formulas
    let diagnosticMsgEn = `Your formula produced '${String(userResult)}', but '${String(options.expectedResult)}' was expected.`;
    let diagnosticMsgTr = `Formülünüz '${String(userResult)}' sonucunu verdi, ancak '${String(options.expectedResult)}' bekleniyordu.`;

    if (isConceptAFunction && !usedFunctions.includes(options.expectedConcept as CanonicalFunctionId)) {
      const def = FORMULA_DEFINITIONS[options.expectedConcept as CanonicalFunctionId];
      const nameEn = def?.en || options.expectedConcept;
      const nameTr = def?.tr || options.expectedConcept;
      diagnosticMsgEn += ` Consider using the ${nameEn} function.`;
      diagnosticMsgTr += ` ${nameTr} fonksiyonunu kullanmayı düşünebilirsiniz.`;
    } else if (
      options.expectedConcept === "CELL_REFERENCE" ||
      options.expectedConcept === "REFERENCES" ||
      options.expectedConcept === "ARITHMETIC" ||
      options.expectedConcept === "TABLE_REFERENCES"
    ) {
      diagnosticMsgEn += " Check your cell coordinates, mathematical operators (+, -, *, /), and dollar ($) signs.";
      diagnosticMsgTr += " Lütfen hücre koordinatlarınızı, işlem işaretlerinizi (+, -, *, /) ve $ sabitlemelerinizi kontrol edin.";
    } else if (options.expectedConcept === "PERCENTAGE") {
      diagnosticMsgEn += " Check your percentage calculation formula (e.g. Price * Rate or Value / Total).";
      diagnosticMsgTr += " Lütfen yüzde hesaplama formülünüzü kontrol edin (örn. Fiyat * Oran veya Değer / Toplam).";
    } else {
      diagnosticMsgEn += " Check your cell ranges, criteria, and formula arguments.";
      diagnosticMsgTr += " Lütfen hücre aralıklarınızı, ölçütlerinizi ve formül parametrelerinizi kontrol edin.";
    }

    return {
      isValid: true,
      isCorrect: false,
      userResult,
      expectedResult: options.expectedResult,
      status: "incorrect",
      messageEn: diagnosticMsgEn,
      messageTr: diagnosticMsgTr,
      usedFunctions,
      isEquivalent: false,
    };
  }

  private static areValuesEqual(a: FormulaValue, b: FormulaValue, tolerance: number): boolean {
    if (a === b) return true;
    if (a === null || a === undefined || b === null || b === undefined) return a === b;

    // Both are numbers
    const numA = typeof a === "number" ? a : parseFloat(String(a).replace(/,/g, ""));
    const numB = typeof b === "number" ? b : parseFloat(String(b).replace(/,/g, ""));

    if (!isNaN(numA) && !isNaN(numB)) {
      return Math.abs(numA - numB) <= tolerance;
    }

    // Both are booleans
    if (typeof a === "boolean" || typeof b === "boolean") {
      return Boolean(a) === Boolean(b);
    }

    // Both are strings
    return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  }
}
