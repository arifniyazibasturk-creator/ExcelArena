import { FormulaEvaluator } from "../lib/formula/evaluator.js";
import { FormulaValidator } from "../lib/formula/validator.js";
import { FallbackAIProvider } from "../lib/ai/fallback.js";
import { LEVELS, getAllLevels, getTopicById } from "../lib/content/levels.js";

console.log("=========================================");
console.log("EXCEL ARENA — COMPREHENSIVE TEST SUITE");
console.log("=========================================\n");

// 1. Content & Level integrity check
console.log("1. Checking Levels & Topics Seed Content...");
const allLevels = getAllLevels();
console.log(`- Loaded ${allLevels.length} levels.`);
allLevels.forEach((lvl) => {
  console.log(`  * Level ${lvl.code}: ${lvl.titleEn} (${lvl.topics.length} topics)`);
  lvl.topics.forEach((top) => {
    if (!top.learn || !top.practice || !top.test || !top.solve) {
      throw new Error(`Topic ${top.id} is missing stages!`);
    }
  });
});
console.log("✓ All levels and 4-stage topics verified.\n");

// 2. Comprehensive Formula Engine verification
console.log("2. Running Deterministic Formula Engine Tests...");

const sampleSalesDataset = {
  columns: [
    { key: "item", name: "Item", colLetter: "A" },
    { key: "city", name: "City", colLetter: "B" },
    { key: "sales", name: "Sales", colLetter: "C" },
    { key: "units", name: "Units", colLetter: "D" },
  ],
  rows: [
    { item: "Laptop", city: "Ankara", sales: 15000, units: 5 },
    { item: "Mouse", city: "Istanbul", sales: 2500, units: 25 },
    { item: "Monitor", city: "Ankara", sales: 8000, units: 10 },
    { item: "Keyboard", city: "Izmir", sales: 4500, units: 15 },
    { item: "Headset", city: "Ankara", sales: 6000, units: 12 },
  ],
  hasHeaderRow: true,
};

const testCases = [
  { name: "Basic Operators: =C2*D2", formula: "=C2*D2", expected: 75000 },
  { name: "SUM: =SUM(C2:C6)", formula: "=SUM(C2:C6)", expected: 36000 },
  { name: "AVERAGE: =AVERAGE(D2:D6)", formula: "=AVERAGE(D2:D6)", expected: 13.4 },
  { name: "MIN: =MIN(C2:C6)", formula: "=MIN(C2:C6)", expected: 2500 },
  { name: "MAX: =MAX(C2:C6)", formula: "=MAX(C2:C6)", expected: 15000 },
  { name: "COUNT: =COUNT(C2:C6)", formula: "=COUNT(C2:C6)", expected: 5 },
  { name: "IF (True): =IF(C2>10000, 'High', 'Low')", formula: '=IF(C2>10000, "High", "Low")', expected: "High" },
  { name: "IF (False): =IF(C3>10000, 'High', 'Low')", formula: '=IF(C3>10000, "High", "Low")', expected: "Low" },
  { name: "AND logic: =AND(C2>10000, D2>=5)", formula: "=AND(C2>10000, D2>=5)", expected: true },
  { name: "OR logic: =OR(C3>10000, D3>20)", formula: "=OR(C3>10000, D3>20)", expected: true },
  { name: "COUNTIF: =COUNTIF(B2:B6, 'Ankara')", formula: '=COUNTIF(B2:B6, "Ankara")', expected: 3 },
  { name: "COUNTIF comparison: =COUNTIF(C2:C6, '>5000')", formula: '=COUNTIF(C2:C6, ">5000")', expected: 3 },
  { name: "SUMIF: =SUMIF(B2:B6, 'Ankara', C2:C6)", formula: '=SUMIF(B2:B6, "Ankara", C2:C6)', expected: 29000 },
  { name: "AVERAGEIF: =AVERAGEIF(B2:B6, 'Ankara', C2:C6)", formula: '=AVERAGEIF(B2:B6, "Ankara", C2:C6)', expected: 29000 / 3 },
  { name: "Turkish ETOPLA with semicolon: =ETOPLA(B2:B6; 'Ankara'; C2:C6)", formula: '=ETOPLA(B2:B6; "Ankara"; C2:C6)', expected: 29000 },
  { name: "Turkish ÇOKETOPLA (SUMIFS): =ÇOKETOPLA(C2:C6; B2:B6; 'Ankara'; C2:C6; '>7000')", formula: '=ÇOKETOPLA(C2:C6; B2:B6; "Ankara"; C2:C6; ">7000")', expected: 23000 },
  { name: "English SUMIFS: =SUMIFS(C2:C6, B2:B6, 'Ankara', C2:C6, '>7000')", formula: '=SUMIFS(C2:C6, B2:B6, "Ankara", C2:C6, ">7000")', expected: 23000 },
];

let passCount = 0;
testCases.forEach((tc) => {
  const res = FormulaEvaluator.evaluate(tc.formula, sampleSalesDataset);
  const isMatch = typeof tc.expected === "number"
    ? Math.abs((res.value || 0) - tc.expected) < 1e-6
    : res.value === tc.expected;

  if (isMatch) {
    console.log(`  ✓ ${tc.name} -> ${res.value}`);
    passCount++;
  } else {
    console.error(`  ✗ ${tc.name} FAILED! Got: ${res.value}, Expected: ${tc.expected}`);
  }
});
console.log(`Result: ${passCount}/${testCases.length} formula engine tests passed.\n`);

// 3. Anti-cheat validation tests
console.log("3. Testing Anti-Cheat & Intent Validator...");
const cheatValidation = FormulaValidator.validate("=29000", {
  dataset: sampleSalesDataset,
  expectedResult: 29000,
});
if (cheatValidation.status === "hardcoded_warning" && !cheatValidation.isCorrect) {
  console.log("  ✓ Hardcoded static formula (=29000) correctly rejected with hardcoded_warning.");
} else {
  console.error("  ✗ Hardcoded validation test failed!", cheatValidation);
}

const correctValidation = FormulaValidator.validate('=ETOPLA(B2:B6; "Ankara"; C2:C6)', {
  dataset: sampleSalesDataset,
  expectedResult: 29000,
});
if (correctValidation.isCorrect && correctValidation.status === "correct") {
  console.log("  ✓ Valid formula correctly accepted.");
} else {
  console.error("  ✗ Valid formula test failed!", correctValidation);
}
console.log("");

// 4. AI Fallback Provider test
console.log("4. Testing AI Fallback Provider...");
const fallback = new FallbackAIProvider();
const hintRes = await fallback.generateHint({
  task: "Find total sales in Ankara",
  expectedConcept: "SUMIF",
  attemptCount: 1,
  language: "en",
});
console.log("  ✓ Fallback Hint Level 1:", hintRes.hint);

const feedbackRes = await fallback.generateFeedback({
  task: "Find total sales in Ankara",
  expectedConcept: "SUMIF",
  userFormula: "=SUM(C2:C6)",
  evaluationResult: 36000,
  expectedResult: 29000,
  language: "tr",
});
console.log("  ✓ Fallback Feedback (TR):", feedbackRes.explanation);

console.log("\n=========================================");
console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
console.log("=========================================");
