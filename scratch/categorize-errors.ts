import { LEVELS } from "../lib/content/levels";
import { FormulaValidator } from "../lib/formula/validator";

console.log("=== ERROR CATEGORIZATION REPORT ===");
const errorsByCategory: Record<string, string[]> = {};

function addError(cat: string, msg: string) {
  if (!errorsByCategory[cat]) errorsByCategory[cat] = [];
  errorsByCategory[cat].push(msg);
}

LEVELS.forEach((level) => {
  level.topics.forEach((topic) => {
    topic.practice.forEach((p, idx) => {
      const formulaEn = p.suggestedFormulaEn;
      const formulaTr = p.suggestedFormulaTr;
      const exp = p.expectedResult;

      if (formulaEn) {
        const valRes = FormulaValidator.validate(formulaEn, {
          dataset: p.dataset,
          expectedResult: exp,
          expectedConcept: p.expectedConcept,
          requireDataReference: true,
        });

        if (!valRes.isCorrect) {
          const msg = valRes.messageEn || "";
          let cat = "Other Evaluation Failure";
          if (msg.includes("Unknown function")) {
            cat = "Missing Function Implementation";
          } else if (msg.includes("Excel error: #VALUE!")) {
            cat = "#VALUE! Error in Evaluator";
          } else if (msg.includes("Excel error: #NAME?")) {
            cat = "#NAME? Error";
          } else if (msg.includes("Excel error: #REF!")) {
            cat = "#REF! Coordinate Out of Bounds";
          } else if (msg.includes("produced '") && msg.includes("was expected")) {
            cat = "Value Mismatch between Formula & ExpectedResult";
          }
          addError(cat, `[Practice EN] ${topic.id} (#${idx + 1}): Formula '${formulaEn}' -> Expected '${exp}', got '${valRes.userResult}'. Msg: ${msg}`);
        }
      }

      if (formulaTr) {
        const valResTr = FormulaValidator.validate(formulaTr, {
          dataset: p.dataset,
          expectedResult: exp,
          expectedConcept: p.expectedConcept,
          requireDataReference: true,
        });

        if (!valResTr.isCorrect) {
          const msg = valResTr.messageTr || "";
          let cat = "Turkish Formula Failure";
          if (msg.includes("Bilinmeyen fonksiyon") || msg.includes("Unknown function")) {
            cat = "Missing Turkish Function Translation";
          }
          addError(cat, `[Practice TR] ${topic.id} (#${idx + 1}): Formula '${formulaTr}' -> Expected '${exp}', got '${valResTr.userResult}'. Msg: ${msg}`);
        }
      }
    });

    if (topic.solve) {
      const solve = topic.solve;
      if (solve.suggestedFormulaEn) {
        const valRes = FormulaValidator.validate(solve.suggestedFormulaEn, {
          dataset: solve.dataset,
          expectedResult: solve.expectedResult,
          expectedConcept: solve.expectedConcept,
          requireDataReference: true,
        });
        if (!valRes.isCorrect) {
          addError("Solve Stage Failures", `[Solve EN] ${topic.id}: Formula '${solve.suggestedFormulaEn}' -> Expected '${solve.expectedResult}', got '${valRes.userResult}'. Msg: ${valRes.messageEn}`);
        }
      }
    }
  });
});

Object.entries(errorsByCategory).forEach(([cat, items]) => {
  console.log(`\n----------------------------------------`);
  console.log(`CATEGORY: ${cat} (${items.length} occurrences)`);
  console.log(`----------------------------------------`);
  items.slice(0, 10).forEach(i => console.log(i));
  if (items.length > 10) console.log(`... and ${items.length - 10} more`);
});
