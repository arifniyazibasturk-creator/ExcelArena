import { CanonicalFunctionId } from "../i18n/types";
import { ChallengeDataset, FormulaValue } from "../formula/types";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type StageType = "learn" | "practice" | "test" | "solve";

export type TestChallengeType =
  | "formula-selection"
  | "formula-debugging"
  | "output-prediction"
  | "formula-ordering"
  | "scenario-matching";

export type ExpectedConcept = CanonicalFunctionId | string;

export interface FormulaAnatomyPart {
  labelEn: string;
  labelTr: string;
  code: string;
  descEn: string;
  descTr: string;
  targetColumnLetter?: string; // Column letter to highlight in table (e.g. "B" or "C")
}

export interface LearnStageContent {
  problemEn: string;
  problemTr: string;
  reasoningQuestionEn: string;
  reasoningQuestionTr: string;
  reasoningStepsEn: string[];
  reasoningStepsTr: string[];
  dataset: ChallengeDataset;
  exampleFormulaEn: string;
  exampleFormulaTr: string;
  anatomy: FormulaAnatomyPart[];
}

export interface PracticeChallenge {
  id: string;
  difficulty: DifficultyLevel;
  taskEn: string;
  taskTr: string;
  dataset: ChallengeDataset;
  expectedResult: FormulaValue;
  expectedConcept?: ExpectedConcept;
  hintsEn: string[];
  hintsTr: string[];
  suggestedFormulaEn?: string;
  suggestedFormulaTr?: string;
}

export interface TestChallenge {
  id: string;
  type: TestChallengeType;
  difficulty: DifficultyLevel;
  questionEn: string;
  questionTr: string;
  dataset?: ChallengeDataset;
  formulaToDebug?: string; // for formula-debugging
  formulaToEvaluate?: string; // for output-prediction
  optionsEn?: string[];
  optionsTr?: string[];
  correctOptionIndex?: number;
  formulaBlocks?: string[]; // for formula-ordering
  correctBlockOrder?: number[]; // indices of formulaBlocks in correct sequence
  explanationEn?: string;
  explanationTr?: string;
}

export interface SolveChallenge {
  id?: string;
  difficulty?: DifficultyLevel;
  titleEn: string;
  titleTr: string;
  scenarioEn: string;
  scenarioTr: string;
  taskEn: string;
  taskTr: string;
  dataset: ChallengeDataset;
  expectedResult: FormulaValue;
  expectedConcept?: ExpectedConcept;
  hintsEn?: string[];
  hintsTr?: string[];
  suggestedFormulaEn?: string;
  suggestedFormulaTr?: string;
}

export interface TopicContent {
  id: string;
  levelId: string;
  canonicalFunction: CanonicalFunctionId | string;
  titleEn: string;
  titleTr: string;
  shortDescEn: string;
  shortDescTr: string;
  difficulty: DifficultyLevel;
  order: number;
  learn: LearnStageContent;
  practice: PracticeChallenge[];
  test: TestChallenge[];
  solve: SolveChallenge;
}

export interface LevelDefinition {
  id: string;
  number: number;
  code: string; // e.g. "01", "02", "03"
  titleEn: string;
  titleTr: string;
  descriptionEn: string;
  descriptionTr: string;
  iconName: string;
  topics: TopicContent[];
  isLocked?: boolean;
}
