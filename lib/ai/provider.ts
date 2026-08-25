import { CanonicalFunctionId } from "../i18n/types";
import { ChallengeDataset, FormulaValue } from "../formula/types";
import { DifficultyLevel } from "../content/types";

export interface GenerateHintParams {
  task: string;
  expectedConcept: CanonicalFunctionId | string;
  userFormula?: string;
  attemptCount: number;
  datasetSummary?: string;
  language: "en" | "tr";
}

export interface GenerateHintResult {
  hint: string;
  level: number; // 1, 2, or 3
  isConceptual: boolean;
}

export interface GenerateFeedbackParams {
  task: string;
  expectedConcept: CanonicalFunctionId | string;
  userFormula: string;
  evaluationResult?: FormulaValue;
  expectedResult: FormulaValue;
  errorMessage?: string;
  language: "en" | "tr";
}

export interface GenerateFeedbackResult {
  title: string;
  explanation: string;
  conceptualIssue: string;
  suggestedAction: string;
}

export interface GenerateScenarioParams {
  topic: CanonicalFunctionId | string;
  difficulty: DifficultyLevel;
  industry?: string;
  language: "en" | "tr";
}

export interface GenerateScenarioResult {
  title: string;
  scenario: string;
  task: string;
  dataset: ChallengeDataset;
  expectedResult: FormulaValue;
  suggestedFormula: string;
}

export interface AIProvider {
  name: string;
  isConfigured(): boolean;
  generateHint(params: GenerateHintParams): Promise<GenerateHintResult>;
  generateFeedback(params: GenerateFeedbackParams): Promise<GenerateFeedbackResult>;
  generateScenario(params: GenerateScenarioParams): Promise<GenerateScenarioResult>;
}
