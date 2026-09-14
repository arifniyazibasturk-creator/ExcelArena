import { ChallengeDataset, FormulaValue } from "../formula/types";
import { FormulaEvaluator } from "../formula/evaluator";
import { FormulaParser } from "../formula/parser";
import { ASTNode } from "../formula/types";
import { FinancialExercise, FinancialExerciseResult } from "./types";

export class FinancialEvaluator {
  public static evaluate(
    userFormula: string,
    exercise: FinancialExercise
  ): FinancialExerciseResult {
    const trimmed = userFormula.trim();

    if (!trimmed) {
      return {
        outputCorrect: false,
        formulaValid: false,
        dependenciesValid: false,
        containsHardcode: false,
        modelUpdatesDynamically: false,
        financialLogicCorrect: false,
        score: 0,
        feedback: {
          en: "Please enter a formula.",
          tr: "Lütfen bir formül yazın.",
        },
      };
    }

    if (!exercise.dataset) {
      return {
        outputCorrect: false,
        formulaValid: false,
        dependenciesValid: false,
        containsHardcode: false,
        modelUpdatesDynamically: false,
        financialLogicCorrect: false,
        score: 0,
        feedback: {
          en: "Exercise dataset is missing.",
          tr: "Alıştırma veri seti bulunamadı.",
        },
      };
    }

    // 1. Evaluate user formula against baseline dataset
    const evalResult = FormulaEvaluator.evaluate(trimmed, exercise.dataset);

    if (!evalResult.success) {
      return {
        outputCorrect: false,
        formulaValid: false,
        dependenciesValid: false,
        containsHardcode: false,
        modelUpdatesDynamically: false,
        financialLogicCorrect: false,
        score: 0,
        feedback: {
          en: `Formula syntax error: ${evalResult.errorMessage || "Check parentheses and operators."}`,
          tr: `Formül sözdizimi hatası: ${evalResult.errorMessage || "Parantezleri ve işlem işaretlerini kontrol edin."}`,
        },
        details: {
          errorMessage: evalResult.errorMessage,
        },
      };
    }

    const userValue = evalResult.value;
    const referencedCells = evalResult.referencedCells || [];

    // 2. Check output correctness
    const outputCorrect = this.areValuesEqual(userValue, exercise.expectedResult, 1e-4);

    // 3. Dependency checking
    const requiredCells = exercise.requiredDependencies || [];
    let dependenciesValid = true;
    if (requiredCells.length > 0) {
      dependenciesValid = requiredCells.every((req) =>
        referencedCells.some((ref) => ref.toUpperCase().replace(/\$/g, "") === req.toUpperCase())
      );
    }

    // 4. Anti-hardcode detection
    let containsHardcode = false;
    let forbiddenMatched: any = null;

    if (exercise.forbiddenHardcodes && exercise.forbiddenHardcodes.length > 0) {
      try {
        const ast = FormulaParser.parse(trimmed);
        const numbersInAst = this.extractNumericLiterals(ast);
        for (const num of numbersInAst) {
          for (const forbidden of exercise.forbiddenHardcodes) {
            if (typeof forbidden === "number" && Math.abs(num - forbidden) < 1e-6) {
              containsHardcode = true;
              forbiddenMatched = forbidden;
              break;
            }
          }
          if (containsHardcode) break;
        }
      } catch {
        // Ignore parser error during AST inspection
      }
    }

    // If formula has no cell references at all and output is a constant
    if (referencedCells.length === 0 && requiredCells.length > 0) {
      containsHardcode = true;
    }

    // 5. Scenario Sensitivity Check (Dynamic model updates)
    let modelUpdatesDynamically = false;
    if (exercise.assumptionCell && exercise.assumptionPerturbation !== undefined) {
      const perturbedDataset = this.cloneAndPerturbDataset(
        exercise.dataset,
        exercise.assumptionCell,
        exercise.assumptionPerturbation
      );
      const perturbedEval = FormulaEvaluator.evaluate(trimmed, perturbedDataset);

      if (perturbedEval.success) {
        if (exercise.expectedPerturbedResult !== undefined) {
          modelUpdatesDynamically = this.areValuesEqual(
            perturbedEval.value,
            exercise.expectedPerturbedResult,
            1e-4
          );
        } else {
          // Verify that output responded (is not identical to baseline userValue)
          modelUpdatesDynamically = !this.areValuesEqual(perturbedEval.value, userValue, 1e-4);
        }
      }
    } else {
      modelUpdatesDynamically = dependenciesValid && !containsHardcode;
    }

    // 6. Financial Logic Evaluation
    const financialLogicCorrect = outputCorrect && dependenciesValid && !containsHardcode;

    // 7. Calculate Comprehensive Score
    let score = 0;
    if (outputCorrect) score += 40;
    if (dependenciesValid) score += 25;
    if (!containsHardcode) score += 20;
    if (modelUpdatesDynamically) score += 15;

    // 8. Generate Bilingual Feedback
    let feedbackEn = "";
    let feedbackTr = "";

    if (financialLogicCorrect && modelUpdatesDynamically) {
      feedbackEn = "Excellent! Your formula is dynamic, mathematically correct, and properly linked.";
      feedbackTr = "Mükemmel! Formülünüz dinamik, matematiksel olarak doğru ve tablolara eksiksiz bağlı.";
    } else if (containsHardcode) {
      feedbackEn = `Hardcoding detected! Avoid typing raw numbers (such as ${forbiddenMatched || "static values"}). Reference the driver cells directly.`;
      feedbackTr = `Sabit sayı tespit edildi! Formüle elle doğrudan sayı (${forbiddenMatched || "sabit değerler"}) yazmayın; ilgili sürücü hücrelerini referans gösterin.`;
    } else if (!dependenciesValid) {
      feedbackEn = `Missing dependencies: your formula must reference required cells: ${requiredCells.join(", ")}.`;
      feedbackTr = `Eksik hücre referansı: Formülünüz şu zorunlu hücreleri referans almalıdır: ${requiredCells.join(", ")}.`;
    } else if (!modelUpdatesDynamically) {
      feedbackEn = "Model sensitivity check failed: your formula did not respond when the assumption cell changed.";
      feedbackTr = "Model duyarlılık testi başarısız: Varsayım hücresi değiştiğinde formülünüz dinamik tepki vermedi.";
    } else if (!outputCorrect) {
      feedbackEn = `Incorrect output: formula returned '${String(userValue)}', expected '${String(exercise.expectedResult)}'.`;
      feedbackTr = `Hatalı sonuç: Formül '${String(userValue)}' üretti, beklenen '${String(exercise.expectedResult)}'.`;
    } else {
      feedbackEn = "Please review your financial formula logic.";
      feedbackTr = "Lütfen formülünüzün finansal mantığını gözden geçirin.";
    }

    return {
      outputCorrect,
      formulaValid: true,
      dependenciesValid,
      containsHardcode,
      modelUpdatesDynamically,
      financialLogicCorrect,
      score,
      feedback: {
        en: feedbackEn,
        tr: feedbackTr,
      },
      details: {
        userValue,
        expectedValue: exercise.expectedResult,
        referencedCells,
        requiredCells,
      },
    };
  }

  private static extractNumericLiterals(node: ASTNode): number[] {
    const nums: number[] = [];

    const walk = (n: ASTNode) => {
      if (!n) return;
      if (n.type === "NumberLiteral") {
        nums.push(n.value);
      } else if (n.type === "BinaryExpression") {
        walk(n.left);
        walk(n.right);
      } else if (n.type === "UnaryExpression") {
        walk(n.argument);
      } else if (n.type === "FunctionCall") {
        n.args.forEach(walk);
      }
    };

    walk(node);
    return nums;
  }

  private static cloneAndPerturbDataset(
    original: ChallengeDataset,
    targetCell: string,
    newValue: FormulaValue
  ): ChallengeDataset {
    const match = targetCell.toUpperCase().match(/^([A-Z]+)(\d+)$/);
    if (!match) return original;

    const colLetter = match[1];
    const rowNum = parseInt(match[2], 10);
    const hasHeader = original.hasHeaderRow !== false;
    const dataRowIdx = hasHeader ? (rowNum === 1 ? 0 : rowNum - 2) : rowNum - 1;

    const colDef = original.columns.find(
      (c) => c.colLetter.toUpperCase() === colLetter
    );
    if (!colDef) return original;

    const clonedRows = original.rows.map((r, idx) => {
      if (idx === dataRowIdx) {
        return {
          ...r,
          [colDef.key]: newValue,
        };
      }
      return { ...r };
    });

    return {
      columns: [...original.columns],
      rows: clonedRows,
      hasHeaderRow: original.hasHeaderRow,
    };
  }

  private static areValuesEqual(a: any, b: any, tolerance: number = 1e-4): boolean {
    if (a === b) return true;
    if (a === null || a === undefined || b === null || b === undefined) return a === b;

    const normalizeNumStr = (val: any): string => {
      let s = String(val).trim();
      if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        s = s.replace(/,/g, "");
      }
      return s;
    };

    const cleanA = normalizeNumStr(a);
    const cleanB = normalizeNumStr(b);
    const isNumA = typeof a === "number" || (!isNaN(parseFloat(cleanA)) && isFinite(Number(cleanA)));
    const isNumB = typeof b === "number" || (!isNaN(parseFloat(cleanB)) && isFinite(Number(cleanB)));

    if (isNumA && isNumB) {
      const numA = typeof a === "number" ? a : parseFloat(cleanA);
      const numB = typeof b === "number" ? b : parseFloat(cleanB);
      return Math.abs(numA - numB) <= tolerance;
    }

    if (typeof a === "boolean" || typeof b === "boolean") {
      return Boolean(a) === Boolean(b);
    }

    return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  }
}
