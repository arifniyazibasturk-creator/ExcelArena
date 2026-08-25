import { ALL_LEVELS } from "../lib/content/levels.js";

console.log("Auditing all levels and topics for concept mismatches...");
let totalIssues = 0;

for (const level of ALL_LEVELS) {
  console.log(`\n=== Level ${level.code}: ${level.titleEn} ===`);
  for (const topic of level.topics) {
    // Check if canonicalFunction is reasonable
    const topicId = topic.id;
    const canon = topic.canonicalFunction;

    // Check practice challenges
    topic.practice.forEach((p, idx) => {
      const exp = p.expectedConcept;
      const sugEn = p.suggestedFormulaEn || "";
      const sugTr = p.suggestedFormulaTr || "";

      // Look for red flag: expectedConcept is SUM but suggested formula doesn't use SUM / TOPLA
      const usesSum = sugEn.toUpperCase().includes("SUM") || sugTr.toUpperCase().includes("TOPLA");
      if (exp === "SUM" && !usesSum && !topicId.includes("sum") && !topicId.includes("autosum")) {
        console.warn(`[WARN] Level ${level.code} Topic '${topicId}' Practice #${idx + 1} (${p.id}): expectedConcept is 'SUM' but suggested formula is '${sugEn}'`);
        totalIssues++;
      }

      // Check if hint says SUM / TOPLA for non-SUM topic
      const hintsText = [...p.hintsEn, ...p.hintsTr].join(" ").toUpperCase();
      if ((hintsText.includes("TOPLA") || hintsText.includes("SUM(")) && !usesSum && !topicId.includes("sum") && !topicId.includes("autosum")) {
        console.warn(`[WARN HINT] Level ${level.code} Topic '${topicId}' Practice #${idx + 1} (${p.id}): Hints mention SUM/TOPLA but formula is '${sugEn}'`);
        totalIssues++;
      }
    });

    // Check solve challenge
    if (topic.solve) {
      const exp = topic.solve.expectedConcept;
      const sugEn = topic.solve.suggestedFormulaEn || "";
      const usesSum = sugEn.toUpperCase().includes("SUM") || (topic.solve.suggestedFormulaTr || "").toUpperCase().includes("TOPLA");
      if (exp === "SUM" && !usesSum && !topicId.includes("sum") && !topicId.includes("autosum")) {
        console.warn(`[WARN SOLVE] Level ${level.code} Topic '${topicId}' Solve: expectedConcept is 'SUM' but suggested formula is '${sugEn}'`);
        totalIssues++;
      }
    }
  }
}

console.log(`\nAudit finished with ${totalIssues} issue(s) detected.`);
