import { FormulaParser } from "../lib/formula/parser.js";
import { FormulaEvaluator } from "../lib/formula/evaluator.js";
import { FormulaValidator } from "../lib/formula/validator.js";

// Sample dataset
const dataset = {
  columns: [
    { key: "customer", name: "Customer", colLetter: "A" },
    { key: "city", name: "City", colLetter: "B" },
    { key: "sales", name: "Sales", colLetter: "C" },
  ],
  rows: [
    { customer: "Ahmet", city: "Ankara", sales: 12000 },
    { customer: "Mehmet", city: "Istanbul", sales: 8500 },
    { customer: "Ayşe", city: "Ankara", sales: 9300 },
    { customer: "Can", city: "Izmir", sales: 15000 },
    { customer: "Zeynep", city: "Ankara", sales: 4200 },
  ],
  hasHeaderRow: true,
};

console.log("Testing Formula Engine...");

// Test 1: Basic English SUM
const res1 = FormulaEvaluator.evaluate("=SUM(C2:C6)", dataset);
console.log("SUM(C2:C6) =", res1.value, "Expected: 49000");

// Test 2: Turkish ETOPLA with semicolon
const res2 = FormulaEvaluator.evaluate('=ETOPLA(B2:B6; "Ankara"; C2:C6)', dataset);
console.log('ETOPLA(B2:B6; "Ankara"; C2:C6) =', res2.value, "Expected: 25500");

// Test 3: English SUMIF with comma
const res3 = FormulaEvaluator.evaluate('=SUMIF(B2:B6, "Ankara", C2:C6)', dataset);
console.log('SUMIF(B2:B6, "Ankara", C2:C6) =', res3.value, "Expected: 25500");

// Test 4: English COUNTIF with comparison
const res4 = FormulaEvaluator.evaluate('=COUNTIF(C2:C6, ">9000")', dataset);
console.log('COUNTIF(C2:C6, ">9000") =', res4.value, "Expected: 3");

// Test 5: Turkish ÇOKETOPLA (SUMIFS)
const res5 = FormulaEvaluator.evaluate('=ÇOKETOPLA(C2:C6; B2:B6; "Ankara"; C2:C6; ">5000")', dataset);
console.log('ÇOKETOPLA(C2:C6; B2:B6; "Ankara"; C2:C6; ">5000") =', res5.value, "Expected: 21300");

// Test 6: Validator anti-cheat
const valCheat = FormulaValidator.validate("=25500", { dataset, expectedResult: 25500 });
console.log("Cheat validation status:", valCheat.status, "(Should be hardcoded_warning)");

// Test 7: Validator correct
const valCorrect = FormulaValidator.validate('=SUMIF(B2:B6, "Ankara", C2:C6)', { dataset, expectedResult: 25500 });
console.log("Correct validation isCorrect:", valCorrect.isCorrect);

console.log("All formula tests completed successfully!");
