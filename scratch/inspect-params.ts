import { LEVELS } from "../lib/content/levels";

console.log("=== INSPECTING PARAMETER CELL REFERENCES (E1, F1, G1, D1) ===");

LEVELS.forEach((level) => {
  level.topics.forEach((topic) => {
    topic.practice.forEach((p, idx) => {
      const formula = p.suggestedFormulaEn || "";
      if (formula.match(/[D-G]\$?1\b/)) {
        console.log(`Topic: ${topic.id} #${idx + 1} (${p.id})`);
        console.log(`  Task: ${p.taskEn}`);
        console.log(`  Formula: ${formula}`);
        console.log(`  Columns:`, p.dataset.columns.map(c => `${c.colLetter}: name='${c.name}', key='${c.key}'`));
        console.log(`  Row 0:`, p.dataset.rows[0]);
        console.log(`  Expected:`, p.expectedResult);
        console.log(`---`);
      }
    });

    if (topic.solve) {
      const formula = topic.solve.suggestedFormulaEn || "";
      if (formula.match(/[D-G]\$?1\b/)) {
        console.log(`[SOLVE] Topic: ${topic.id}`);
        console.log(`  Task: ${topic.solve.taskEn}`);
        console.log(`  Formula: ${formula}`);
        console.log(`  Columns:`, topic.solve.dataset.columns.map(c => `${c.colLetter}: name='${c.name}', key='${c.key}'`));
        console.log(`  Row 0:`, topic.solve.dataset.rows[0]);
        console.log(`  Expected:`, topic.solve.expectedResult);
        console.log(`---`);
      }
    }
  });
});
