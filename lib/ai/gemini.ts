import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AIProvider,
  GenerateHintParams,
  GenerateHintResult,
  GenerateFeedbackParams,
  GenerateFeedbackResult,
  GenerateScenarioParams,
  GenerateScenarioResult,
} from "./provider";
import { FallbackAIProvider } from "./fallback";

export class GeminiAIProvider implements AIProvider {
  name = "GoogleGemini";
  private fallback: FallbackAIProvider;

  constructor() {
    this.fallback = new FallbackAIProvider();
  }

  private getGenAI(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey.includes("your_gemini_api_key")) {
      return null;
    }
    try {
      return new GoogleGenerativeAI(apiKey.trim());
    } catch {
      return null;
    }
  }

  isConfigured(): boolean {
    return this.getGenAI() !== null;
  }

  async generateHint(params: GenerateHintParams): Promise<GenerateHintResult> {
    const genAI = this.getGenAI();
    if (!genAI) {
      return this.fallback.generateHint(params);
    }

    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are a helpful Excel tutor in Excel Arena.
The user is working on an Excel formula challenge.
Task: "${params.task}"
Target Concept: "${params.expectedConcept}"
Current Attempt Number: ${params.attemptCount} (Hint Level ${Math.min(3, params.attemptCount)})
User's Attempted Formula: "${params.userFormula || "None yet"}"
Language: ${params.language === "tr" ? "Turkish (Türkçe)" : "English"}

Generate a progressive hint for level ${Math.min(3, params.attemptCount)}.
- Level 1: Conceptual hint pointing in the right direction without mentioning the formula structure.
- Level 2: Mention the function name and general syntax structure.
- Level 3: Explain the exact parameters and criteria quoting needed.
IMPORTANT: NEVER reveal the full answer directly. Output in strictly valid JSON:
{
  "hint": "the hint text",
  "level": ${Math.min(3, params.attemptCount)},
  "isConceptual": ${params.attemptCount <= 2}
}`;

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const text = response.response.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.hint === "string") {
        return {
          hint: parsed.hint,
          level: parsed.level || Math.min(3, params.attemptCount),
          isConceptual: Boolean(parsed.isConceptual),
        };
      }
    } catch (err) {
      console.warn("[Gemini Provider] Hint generation failed, using fallback:", err);
    }

    return this.fallback.generateHint(params);
  }

  async generateFeedback(params: GenerateFeedbackParams): Promise<GenerateFeedbackResult> {
    const genAI = this.getGenAI();
    if (!genAI) {
      return this.fallback.generateFeedback(params);
    }

    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are an intelligent Excel educator in Excel Arena.
The user submitted an incorrect formula.
Task: "${params.task}"
Expected Concept: "${params.expectedConcept}"
User Formula: "${params.userFormula}"
User Evaluation Result: "${String(params.evaluationResult)}"
Expected Result: "${String(params.expectedResult)}"
Language: ${params.language === "tr" ? "Turkish (Türkçe)" : "English"}

Provide pedagogical feedback explaining why the formula failed without directly giving away the solution.
Output in strictly valid JSON format:
{
  "title": "Short title",
  "explanation": "Clear explanation of what the user formula computed vs what was expected",
  "conceptualIssue": "The underlying conceptual misunderstanding",
  "suggestedAction": "Actionable next step for the user to try"
}`;

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const text = response.response.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.explanation === "string") {
        return {
          title: parsed.title || "Feedback",
          explanation: parsed.explanation,
          conceptualIssue: parsed.conceptualIssue || "",
          suggestedAction: parsed.suggestedAction || "",
        };
      }
    } catch (err) {
      console.warn("[Gemini Provider] Feedback generation failed, using fallback:", err);
    }

    return this.fallback.generateFeedback(params);
  }

  async generateScenario(params: GenerateScenarioParams): Promise<GenerateScenarioResult> {
    const genAI = this.getGenAI();
    if (!genAI) {
      return this.fallback.generateScenario(params);
    }

    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are a curriculum designer for Excel Arena.
Generate a realistic business scenario and dataset for practicing: ${params.topic}.
Difficulty Level: ${params.difficulty} (1 to 5)
Language: ${params.language === "tr" ? "Turkish (Türkçe)" : "English"}

Output strictly valid JSON with this schema:
{
  "title": "string",
  "scenario": "string (business background)",
  "task": "string (clear objective)",
  "dataset": {
    "columns": [
      { "key": "col1", "name": "Column Name", "colLetter": "A", "type": "string" },
      { "key": "col2", "name": "Value ($)", "colLetter": "B", "type": "number" }
    ],
    "rows": [
      { "col1": "Alpha", "col2": 100 }
    ]
  },
  "expectedResult": 100,
  "suggestedFormula": "=SUM(B2:B5)"
}`;

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const text = response.response.text();
      const parsed = JSON.parse(text);
      if (parsed && parsed.dataset && parsed.task) {
        return parsed;
      }
    } catch (err) {
      console.warn("[Gemini Provider] Scenario generation failed, using fallback:", err);
    }

    return this.fallback.generateScenario(params);
  }
}

export const aiProvider = new GeminiAIProvider();
