import { ChallengeDataset, FormulaValue } from "../formula/types";

export type FinancialStageType = "learn" | "practice" | "solve" | "test" | "project";

export type FinancialExerciseType =
  | "driver_selection"
  | "build_formula"
  | "formula_debugging"
  | "assumption_or_formula"
  | "model_linking"
  | "financial_interpretation"
  | "error_hunt"
  | "scenario_decision"
  | "mini_model";

export interface FinancialExerciseResult {
  outputCorrect: boolean;
  formulaValid: boolean;
  dependenciesValid: boolean;
  containsHardcode: boolean;
  modelUpdatesDynamically: boolean;
  financialLogicCorrect: boolean;
  interpretationCorrect?: boolean;
  score: number; // 0 to 100
  feedback: {
    en: string;
    tr: string;
  };
  details?: {
    userValue?: any;
    expectedValue?: any;
    referencedCells?: string[];
    requiredCells?: string[];
    errorMessage?: string;
  };
}

export interface FinancialExercise {
  id: string;
  type: FinancialExerciseType;
  titleEn: string;
  titleTr: string;
  taskEn: string;
  taskTr: string;
  contextEn: string;
  contextTr: string;
  dataset?: ChallengeDataset;
  targetCell?: string;
  initialFormula?: string;
  expectedFormula?: string;
  expectedResult?: FormulaValue;
  requiredDependencies?: string[]; // Cells that MUST be referenced, e.g. ["B3", "B4"]
  forbiddenHardcodes?: (number | string)[]; // Raw constants that must NOT be typed into formula
  assumptionCell?: string; // Cell to perturb for sensitivity analysis
  assumptionPerturbation?: FormulaValue; // Value to put into assumptionCell during sensitivity check
  expectedPerturbedResult?: FormulaValue; // Result that must change to during sensitivity check
  optionsEn?: string[];
  optionsTr?: string[];
  correctOptionIndex?: number;
  hintsEn: string[];
  hintsTr: string[];
  explanationEn: string;
  explanationTr: string;
  statementContext?: "Income Statement" | "Balance Sheet" | "Cash Flow" | "Integrated";
}

export interface FinancialLearnLesson {
  id: string;
  titleEn: string;
  titleTr: string;
  conceptEn: string;
  conceptTr: string;
  whyItMattersEn: string;
  whyItMattersTr: string;
  whenToUseEn: string;
  whenToUseTr: string;
  statementsAffected: string[];
  keyFormulas: {
    nameEn: string;
    nameTr: string;
    formula: string;
    explanationEn: string;
    explanationTr: string;
  }[];
  commonMistakesEn: string[];
  commonMistakesTr: string[];
  practicalExample: {
    descriptionEn: string;
    descriptionTr: string;
    headers: string[];
    rows: (string | number)[][];
    notesEn?: string;
    notesTr?: string;
  };
}

export interface FinancialTestQuestion {
  id: string;
  type: "multiple_choice" | "formula_selection" | "debugging" | "interpretation" | "model_linking";
  questionEn: string;
  questionTr: string;
  contextEn?: string;
  contextTr?: string;
  optionsEn: string[];
  optionsTr: string[];
  correctIndex: number;
  explanationEn: string;
  explanationTr: string;
}

export interface FinancialProjectClassificationItem {
  id: string;
  accountEn: string;
  accountTr: string;
  amount: number;
  correctStatement: "income_statement" | "balance_sheet" | "cash_flow";
}

export interface FinancialProjectStep {
  stepId: string;
  stepNumber: number;
  titleEn: string;
  titleTr: string;
  instructionEn: string;
  instructionTr: string;
  type: "classification" | "formula" | "balance_check" | "interpretation";
  targetCell?: string;
  expectedResult?: any;
  requiredDependencies?: string[];
  optionsEn?: string[];
  optionsTr?: string[];
  correctOptionIndex?: number;
  hintEn: string;
  hintTr: string;
}

export interface FinancialProject {
  id: string;
  titleEn: string;
  titleTr: string;
  companyName: string;
  industryEn: string;
  industryTr: string;
  scenarioEn: string;
  scenarioTr: string;
  dataset: ChallengeDataset;
  classificationItems?: FinancialProjectClassificationItem[];
  steps: FinancialProjectStep[];
}

export interface FinancialLevel {
  id: string;
  number: number;
  code: string;
  titleEn: string;
  titleTr: string;
  descriptionEn: string;
  descriptionTr: string;
  topics: {
    id: string;
    titleEn: string;
    titleTr: string;
    descEn: string;
    descTr: string;
  }[];
  isLocked: boolean;
  learnLessons: FinancialLearnLesson[];
  practiceExercises: FinancialExercise[];
  solveExercises: FinancialExercise[];
  testQuestions: FinancialTestQuestion[];
  project: FinancialProject;
}

export interface FinancialLevelProgress {
  levelId: string;
  currentStage: FinancialStageType;
  completedStages: FinancialStageType[];
  learnLessonsCompleted: string[];
  practiceCompleted: string[];
  solveCompleted: string[];
  testCompleted: boolean;
  testScore: number;
  testAnswers: Record<string, number>;
  projectCompleted: boolean;
  projectScore: number;
  modelIntegrity: number; // 0 to 100
  masteryPercentage: number; // 0 to 100
  attemptsCount: number;
  correctAttemptsCount: number;
  lastUpdated: string;
}

export interface FinancialStats {
  mastery: number; // 0 to 100
  accuracy: number; // 0 to 100
  bestStreak: number;
  currentStreak: number;
  modelIntegrity: number; // 0 to 100
  completedLevels: number;
  completedProjects: number;
  lastActiveDate: string | null;
}
