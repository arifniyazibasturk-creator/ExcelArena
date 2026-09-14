import { LEVEL_01_FINANCIAL } from "../lib/financial/content/level01";
import { FinancialEvaluator } from "../lib/financial/evaluator";

console.log("=== TESTING FINANCIAL EVALUATOR ===");

const ex1 = LEVEL_01_FINANCIAL.practiceExercises[0]; // Revenue Growth
console.log("Testing Exercise 1:", ex1.titleEn);

// Test correct dynamic formula: =B3*(1+C2)
const resCorrect = FinancialEvaluator.evaluate("=B3*(1+C2)", ex1);
console.log("Correct formula result:", {
  score: resCorrect.score,
  financialLogicCorrect: resCorrect.financialLogicCorrect,
  modelUpdatesDynamically: resCorrect.modelUpdatesDynamically,
  containsHardcode: resCorrect.containsHardcode,
  feedback: resCorrect.feedback.en,
});

if (resCorrect.score !== 100 || !resCorrect.financialLogicCorrect || !resCorrect.modelUpdatesDynamically) {
  throw new Error("Expected 100 score for valid dynamic formula");
}

// Test hardcoded formula: =500000*1.12
const resHardcode = FinancialEvaluator.evaluate("=500000*1.12", ex1);
console.log("Hardcoded formula result:", {
  score: resHardcode.score,
  financialLogicCorrect: resHardcode.financialLogicCorrect,
  containsHardcode: resHardcode.containsHardcode,
  feedback: resHardcode.feedback.en,
});

if (!resHardcode.containsHardcode) {
  throw new Error("Expected anti-hardcoding detection to flag =500000*1.12");
}

// Test missing dependency: =B3*1.12 (missing C2)
const resMissingDep = FinancialEvaluator.evaluate("=B3*1.12", ex1);
console.log("Missing dep formula result:", {
  dependenciesValid: resMissingDep.dependenciesValid,
  feedback: resMissingDep.feedback.en,
});

if (resMissingDep.dependenciesValid) {
  throw new Error("Expected missing dependency to fail");
}

console.log("=== ALL FINANCIAL EVALUATOR TESTS PASSED SUCCESSFULLY! ===");
