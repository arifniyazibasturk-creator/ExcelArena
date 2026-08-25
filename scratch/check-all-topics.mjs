import fs from "fs";
import path from "path";

const topicsDir = "./lib/content/topics";
const files = fs.readdirSync(topicsDir).filter(f => f.endsWith(".ts"));

console.log("Analyzing all topic files in", topicsDir);

let totalIssues = 0;

for (const file of files) {
  const filePath = path.join(topicsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  console.log(`\n========================================\nChecking file: ${file}`);
  
  // Find all topic blocks
  const topicBlocks = content.split(/\{\s*id:\s*"/g).slice(1);

  topicBlocks.forEach((block) => {
    const idMatch = block.match(/^([^"]+)"/);
    if (!idMatch) return;
    const topicId = idMatch[1];

    const canonMatch = block.match(/canonicalFunction:\s*"([^"]+)"/);
    const canonicalFunction = canonMatch ? canonMatch[1] : "UNKNOWN";

    // Find all expectedConcepts inside this topic
    const expectedConcepts = [...block.matchAll(/expectedConcept:\s*"([^"]+)"/g)].map(m => m[1]);
    const suggestedFormulas = [...block.matchAll(/suggestedFormulaEn:\s*"([^"]+)"/g)].map(m => m[1]);

    suggestedFormulas.forEach((formula, idx) => {
      const exp = expectedConcepts[idx];
      const isSumTopic = topicId.includes("sum") || topicId.includes("autosum");
      const formulaUsesSum = formula.toUpperCase().includes("SUM");

      if (exp === "SUM" && !formulaUsesSum && !isSumTopic) {
        console.warn(`[MISMATCH] In file '${file}' Topic '${topicId}' item #${idx + 1}: expectedConcept is 'SUM' but suggested formula is '${formula}'`);
        totalIssues++;
      }
    });

    if (canonicalFunction === "SUM" && !topicId.includes("sum") && !topicId.includes("autosum")) {
      console.warn(`[CANONICAL MISMATCH] In file '${file}' Topic '${topicId}': canonicalFunction is 'SUM' but topic is not a SUM topic.`);
      totalIssues++;
    }
  });
}

console.log(`\n========================================`);
console.log(`Finished! Total concept mismatch issues found: ${totalIssues}`);
console.log(`========================================`);
