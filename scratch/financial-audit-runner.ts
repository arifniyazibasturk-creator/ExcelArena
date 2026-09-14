import { LEVEL_01_FINANCIAL } from "../lib/financial/content/level01";
import { FINANCIAL_LEVELS, getFinancialLevelById } from "../lib/financial/levels";
import { FinancialEvaluator } from "../lib/financial/evaluator";
import { financialProgressService } from "../lib/services/financialProgress";

console.log("=== COMPREHENSIVE FINANCIAL EXCEL AUDIT RUNNER ===");

let passedChecks = 0;
let failedChecks = 0;

function assert(condition: any, message: string) {
  if (Boolean(condition)) {
    passedChecks++;
  } else {
    failedChecks++;
    console.error("FAIL:", message);
  }
}

// 1. CURRICULUM ARCHITECTURE AUDIT
console.log("\n1. Auditing 12-Level Financial Curriculum Structure...");
assert(FINANCIAL_LEVELS.length === 12, "Should have exactly 12 financial levels");
FINANCIAL_LEVELS.forEach((lvl, idx) => {
  assert(lvl.number === idx + 1, `Level ${lvl.id} has sequential number ${idx + 1}`);
  assert(Boolean(lvl.titleEn && lvl.titleTr), `Level ${lvl.id} has bilingual titles`);
  assert(Boolean(lvl.descriptionEn && lvl.descriptionTr), `Level ${lvl.id} has bilingual descriptions`);
  assert(lvl.topics.length >= 3, `Level ${lvl.id} has at least 3 topics defined`);
});

// 2. LEVEL 1 LESSONS AUDIT
console.log("\n2. Auditing Level 1 Learn Lessons...");
const lvl1 = LEVEL_01_FINANCIAL;
assert(lvl1.learnLessons.length >= 3, "Level 1 must have at least 3 Learn lessons");
lvl1.learnLessons.forEach((lesson) => {
  assert(Boolean(lesson.titleEn && lesson.titleTr), `Lesson ${lesson.id} has bilingual titles`);
  assert(Boolean(lesson.conceptEn && lesson.conceptTr), `Lesson ${lesson.id} has concept text`);
  assert(lesson.statementsAffected.length > 0, `Lesson ${lesson.id} lists affected statements`);
  assert(lesson.keyFormulas.length > 0, `Lesson ${lesson.id} contains key formulas`);
  assert(lesson.commonMistakesEn.length > 0, `Lesson ${lesson.id} contains common mistakes`);
  assert(Boolean(lesson.practicalExample), `Lesson ${lesson.id} contains practical example table`);
});

// 3. LEVEL 1 PRACTICE EXERCISES AUDIT & FORMULA EVALUATION
console.log("\n3. Auditing & Evaluating Level 1 Practice Exercises...");
assert(lvl1.practiceExercises.length >= 5, "Level 1 must have at least 5 Practice exercises");

// Practice 1: Revenue Growth
const p1 = lvl1.practiceExercises[0];
const p1Res = FinancialEvaluator.evaluate("=B3*(1+C2)", p1);
assert(p1Res.financialLogicCorrect, "P1: =B3*(1+C2) must be financially correct");
assert(p1Res.modelUpdatesDynamically, "P1: Must update dynamically with assumption");
assert(!p1Res.containsHardcode, "P1: Must not contain hardcoding");
assert(p1Res.score === 100, `P1: Score must be 100, got ${p1Res.score}`);

// P1 anti-hardcoding test
const p1Hard = FinancialEvaluator.evaluate("=500000*1.12", p1);
assert(p1Hard.containsHardcode, "P1: =500000*1.12 must flag hardcoded values");
assert(p1Hard.score < 80, "P1: Hardcoded formula must not get full score");

// Practice 2: Gross Profit
const p2 = lvl1.practiceExercises[1];
const p2Res = FinancialEvaluator.evaluate("=B2-B3", p2);
assert(p2Res.financialLogicCorrect, "P2: =B2-B3 must be financially correct");
assert(p2Res.score === 100, `P2: Score must be 100, got ${p2Res.score}`);

// Practice 3: Driver Selection
const p3 = lvl1.practiceExercises[2];
assert(p3.type === "driver_selection", "P3 must be driver_selection");
assert(p3.correctOptionIndex === 1, "P3 correct option must be DSO driver");

// Practice 4: Retained Earnings Roll-Forward
const p4 = lvl1.practiceExercises[3];
const p4Res = FinancialEvaluator.evaluate("=B2+B3-B4", p4);
assert(p4Res.financialLogicCorrect, "P4: =B2+B3-B4 must be financially correct");
assert(p4Res.score === 100, "P4: Score must be 100");

// Practice 5: Balance Sheet Equilibrium
const p5 = lvl1.practiceExercises[4];
const p5Res = FinancialEvaluator.evaluate("=B2-(B3+B4)", p5);
assert(p5Res.financialLogicCorrect, "P5: =B2-(B3+B4) must be financially correct");
assert(p5Res.score === 100, "P5: Score must be 100");

// 4. LEVEL 1 SOLVE EXERCISES AUDIT & EVALUATION
console.log("\n4. Auditing & Evaluating Level 1 Solve Business Cases...");
assert(lvl1.solveExercises.length >= 5, "Level 1 must have at least 5 Solve exercises");

// Solve 1: EBITDA to Net Income Bridge
const s1 = lvl1.solveExercises[0];
const s1Res = FinancialEvaluator.evaluate("=B2-B3-B4", s1);
assert(s1Res.financialLogicCorrect, "S1: =B2-B3-B4 must evaluate to 195000");

// Solve 2: Accounts Receivable from DSO
const s2 = lvl1.solveExercises[1];
const s2Res = FinancialEvaluator.evaluate("=(B2/B4)*B3", s2);
assert(s2Res.financialLogicCorrect, "S2: =(B2/B4)*B3 must evaluate to 90000");

// Solve 3: Broken Debt Interest Debugging
const s3 = lvl1.solveExercises[2];
const s3Res = FinancialEvaluator.evaluate("=((B2+B4)/2)*B5", s3);
assert(s3Res.financialLogicCorrect, "S3: Average debt formula must evaluate to 10500");

// Solve 4: Net PP&E Schedule
const s4 = lvl1.solveExercises[3];
const s4Res = FinancialEvaluator.evaluate("=B2+B3-B4", s4);
assert(s4Res.financialLogicCorrect, "S4: PP&E roll-forward must evaluate to 475000");

// Solve 5: CFO Reconciliation
const s5 = lvl1.solveExercises[4];
const s5Res = FinancialEvaluator.evaluate("=B2+B3-B4+B5", s5);
assert(s5Res.financialLogicCorrect, "S5: CFO reconciliation must evaluate to 135000");

// 5. LEVEL 1 TEST QUESTIONS AUDIT
console.log("\n5. Auditing Level 1 Test Questions...");
assert(lvl1.testQuestions.length >= 10, "Level 1 must have at least 10 Test questions");
lvl1.testQuestions.forEach((q, idx) => {
  assert(Boolean(q.questionEn && q.questionTr), `Q${idx + 1} has bilingual question text`);
  assert(q.optionsEn.length >= 4, `Q${idx + 1} has at least 4 English options`);
  assert(q.optionsTr.length >= 4, `Q${idx + 1} has at least 4 Turkish options`);
  assert(q.correctIndex >= 0 && q.correctIndex < q.optionsEn.length, `Q${idx + 1} has valid correctIndex`);
  assert(Boolean(q.explanationEn && q.explanationTr), `Q${idx + 1} has explanations`);
});

// 6. CAPSTONE MINI PROJECT AUDIT
console.log("\n6. Auditing Level 1 Capstone Mini Project...");
const proj = lvl1.project;
assert(Boolean(proj.id && proj.titleEn), "Project has title and ID");
assert(proj.classificationItems && proj.classificationItems.length === 6, "Project has 6 trial balance items to classify");
assert(proj.steps.length === 5, "Project has 5 sequential steps");

// 7. FINANCIAL PROGRESS SERVICE AUDIT
console.log("\n7. Auditing FinancialProgressService State & Mastery Calculation...");
const initialStats = financialProgressService.getStats();
assert(initialStats.modelIntegrity >= 0, "Model integrity stat exists");
assert(initialStats.completedLevels >= 0, "Completed levels stat exists");

// Test level mastery weighting calculation (25/25/20/15/15)
const mockProg: any = {
  levelId: "fin-level-01",
  learnLessonsCompleted: ["l1", "l2", "l3"], // 50 pts out of 50
  practiceCompleted: ["p1", "p2", "p3", "p4", "p5"], // 100 pts -> 25% = 25
  solveCompleted: ["s1", "s2", "s3", "s4", "s5"], // 100 pts -> 25% = 25
  testCompleted: true,
  testScore: 100, // 100 pts -> 15% = 15
  projectCompleted: true,
  projectScore: 100, // 100 pts -> 20% = 20, interpretation = 50 pts -> 15% = 15
};

const calculatedMastery = financialProgressService.calculateLevelMastery(mockProg);
assert(calculatedMastery === 100, `Fully completed mock progress should yield 100% mastery, got ${calculatedMastery}%`);

console.log("\n========================================");
console.log(`FINANCIAL AUDIT COMPLETE:`);
console.log(`Total Checks Run: ${passedChecks + failedChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);
console.log("========================================");

if (failedChecks > 0) {
  process.exit(1);
}
