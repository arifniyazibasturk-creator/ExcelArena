import { LEVELS } from "../lib/content/levels";
import { FormulaEvaluator } from "../lib/formula/evaluator";
import { FormulaValidator } from "../lib/formula/validator";

console.log("=== COMPREHENSIVE CURRICULUM & ENGINE AUDIT ===");

let totalChallengesTested = 0;
let totalErrors = 0;
let totalWarnings = 0;

LEVELS.forEach((level) => {
  console.log(`\n========================================`);
  console.log(`LEVEL ${level.code}: ${level.titleEn} (${level.topics.length} topics)`);
  console.log(`========================================`);

  level.topics.forEach((topic) => {
    // 1. Audit Learn Stage
    const learn = topic.learn;
    if (learn.exampleFormulaEn && learn.dataset) {
      totalChallengesTested++;
      const evalResEn = FormulaEvaluator.evaluate(learn.exampleFormulaEn, learn.dataset);
      if (!evalResEn.success || (typeof evalResEn.value === "string" && evalResEn.value.startsWith("#"))) {
        console.error(`[ERROR] Learn example EN failed in Topic '${topic.id}': Formula '${learn.exampleFormulaEn}' -> Error: ${evalResEn.errorMessage || evalResEn.value}`);
        totalErrors++;
      }
    }
    if (learn.exampleFormulaTr && learn.dataset) {
      totalChallengesTested++;
      const evalResTr = FormulaEvaluator.evaluate(learn.exampleFormulaTr, learn.dataset);
      if (!evalResTr.success || (typeof evalResTr.value === "string" && evalResTr.value.startsWith("#"))) {
        console.error(`[ERROR] Learn example TR failed in Topic '${topic.id}': Formula '${learn.exampleFormulaTr}' -> Error: ${evalResTr.errorMessage || evalResTr.value}`);
        totalErrors++;
      }
    }

    // 2. Audit Practice Stage
    topic.practice.forEach((p, idx) => {
      totalChallengesTested++;
      const formulaEn = p.suggestedFormulaEn;
      const formulaTr = p.suggestedFormulaTr;
      const exp = p.expectedResult;

      if (!formulaEn) {
        console.warn(`[WARN] Practice #${idx + 1} (${p.id}) in Topic '${topic.id}' missing suggestedFormulaEn`);
        totalWarnings++;
      } else {
        const valRes = FormulaValidator.validate(formulaEn, {
          dataset: p.dataset,
          expectedResult: exp,
          expectedConcept: p.expectedConcept,
          requireDataReference: true,
        });

        if (!valRes.isCorrect) {
          console.error(`[FAIL PRACTICE EN] Topic '${topic.id}' #${idx + 1} (${p.id}): Formula '${formulaEn}' evaluated to '${valRes.userResult}', expected '${exp}'. Message: ${valRes.messageEn}`);
          totalErrors++;
        }
      }

      if (formulaTr) {
        totalChallengesTested++;
        const valResTr = FormulaValidator.validate(formulaTr, {
          dataset: p.dataset,
          expectedResult: exp,
          expectedConcept: p.expectedConcept,
          requireDataReference: true,
        });

        if (!valResTr.isCorrect) {
          console.error(`[FAIL PRACTICE TR] Topic '${topic.id}' #${idx + 1} (${p.id}): Formula '${formulaTr}' evaluated to '${valResTr.userResult}', expected '${exp}'. Message: ${valResTr.messageTr}`);
          totalErrors++;
        }
      }

      // Check column keys consistency in dataset
      const colKeys = p.dataset.columns.map((c) => c.key);
      p.dataset.rows.forEach((r, rIdx) => {
        colKeys.forEach((k) => {
          if (r[k] === undefined) {
            console.warn(`[DATASET MISMATCH] Topic '${topic.id}' Practice #${idx + 1} Row #${rIdx + 1} missing key '${k}'`);
            totalWarnings++;
          }
        });
      });
    });

    // 3. Audit Test Stage
    topic.test.forEach((t, tIdx) => {
      totalChallengesTested++;
      if (t.type === "formula-selection" || t.type === "output-prediction" || t.type === "formula-debugging" || t.type === "scenario-matching") {
        if (t.correctOptionIndex === undefined || t.correctOptionIndex < 0 || !t.optionsEn || t.correctOptionIndex >= t.optionsEn.length) {
          console.error(`[TEST OPTION ERROR] Topic '${topic.id}' Test #${tIdx + 1} (${t.id}): Invalid correctOptionIndex ${t.correctOptionIndex}`);
          totalErrors++;
        }
      } else if (t.type === "formula-ordering") {
        if (!t.formulaBlocks || !t.correctBlockOrder || t.formulaBlocks.length !== t.correctBlockOrder.length) {
          console.error(`[TEST ORDER ERROR] Topic '${topic.id}' Test #${tIdx + 1} (${t.id}): Block count mismatch`);
          totalErrors++;
        }
      }
    });

    // 4. Audit Solve Stage
    if (topic.solve) {
      totalChallengesTested++;
      const solve = topic.solve;
      const sugEn = solve.suggestedFormulaEn;
      const sugTr = solve.suggestedFormulaTr;
      const exp = solve.expectedResult;

      if (sugEn) {
        const valRes = FormulaValidator.validate(sugEn, {
          dataset: solve.dataset,
          expectedResult: exp,
          expectedConcept: solve.expectedConcept,
          requireDataReference: true,
        });

        if (!valRes.isCorrect) {
          console.error(`[FAIL SOLVE EN] Topic '${topic.id}' Solve: Formula '${sugEn}' evaluated to '${valRes.userResult}', expected '${exp}'. Message: ${valRes.messageEn}`);
          totalErrors++;
        }
      }

      if (sugTr) {
        totalChallengesTested++;
        const valResTr = FormulaValidator.validate(sugTr, {
          dataset: solve.dataset,
          expectedResult: exp,
          expectedConcept: solve.expectedConcept,
          requireDataReference: true,
        });

        if (!valResTr.isCorrect) {
          console.error(`[FAIL SOLVE TR] Topic '${topic.id}' Solve: Formula '${sugTr}' evaluated to '${valResTr.userResult}', expected '${exp}'. Message: ${valResTr.messageTr}`);
          totalErrors++;
        }
      }
    }
  });
});

console.log(`\n========================================`);
console.log(`AUDIT COMPLETE:`);
console.log(`Total checks run: ${totalChallengesTested}`);
console.log(`Total Errors: ${totalErrors}`);
console.log(`Total Warnings: ${totalWarnings}`);
console.log(`========================================`);
