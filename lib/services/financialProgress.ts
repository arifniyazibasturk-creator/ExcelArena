import {
  FinancialLevelProgress,
  FinancialStageType,
  FinancialStats,
} from "../financial/types";

const STORAGE_KEY_FINANCIAL_PROGRESS = "excel_arena_financial_progress";
const STORAGE_KEY_FINANCIAL_STATS = "excel_arena_financial_stats";
const STORAGE_KEY_FINANCIAL_ATTEMPTS = "excel_arena_financial_attempts";

export const DEFAULT_FINANCIAL_STATS: FinancialStats = {
  mastery: 0,
  accuracy: 100,
  bestStreak: 1,
  currentStreak: 1,
  modelIntegrity: 100,
  completedLevels: 0,
  completedProjects: 0,
  lastActiveDate: null,
};

export function getDefaultLevelProgress(levelId: string): FinancialLevelProgress {
  return {
    levelId,
    currentStage: "learn",
    completedStages: [],
    learnLessonsCompleted: [],
    practiceCompleted: [],
    solveCompleted: [],
    testCompleted: false,
    testScore: 0,
    testAnswers: {},
    projectCompleted: false,
    projectScore: 0,
    modelIntegrity: 100,
    masteryPercentage: 0,
    attemptsCount: 0,
    correctAttemptsCount: 0,
    lastUpdated: "",
  };
}

class FinancialProgressService {
  private progressMap: Map<string, FinancialLevelProgress> = new Map();
  private stats: FinancialStats = { ...DEFAULT_FINANCIAL_STATS };

  constructor() {
    if (typeof window !== "undefined") {
      this.load();
    }
  }

  public load(): void {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEY_FINANCIAL_PROGRESS);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress) as Record<string, FinancialLevelProgress>;
        this.progressMap = new Map(Object.entries(parsed));
      }

      const storedStats = localStorage.getItem(STORAGE_KEY_FINANCIAL_STATS);
      if (storedStats) {
        this.stats = JSON.parse(storedStats);
      }

      this.updateStreak();
      this.recalculateAll();
    } catch {
      // Ignore storage errors
    }
  }

  private save(): void {
    if (typeof window === "undefined") return;
    try {
      const progressObj: Record<string, FinancialLevelProgress> = {};
      this.progressMap.forEach((val, key) => {
        progressObj[key] = val;
      });
      localStorage.setItem(STORAGE_KEY_FINANCIAL_PROGRESS, JSON.stringify(progressObj));
      localStorage.setItem(STORAGE_KEY_FINANCIAL_STATS, JSON.stringify(this.stats));

      window.dispatchEvent(new CustomEvent("excel_arena_financial_progress_updated"));
    } catch {
      // Ignore storage errors
    }
  }

  public getLevelProgress(levelId: string): FinancialLevelProgress {
    let prog = this.progressMap.get(levelId);
    if (!prog) {
      prog = {
        levelId,
        currentStage: "learn",
        completedStages: [],
        learnLessonsCompleted: [],
        practiceCompleted: [],
        solveCompleted: [],
        testCompleted: false,
        testScore: 0,
        testAnswers: {},
        projectCompleted: false,
        projectScore: 0,
        modelIntegrity: 100,
        masteryPercentage: 0,
        attemptsCount: 0,
        correctAttemptsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
      this.progressMap.set(levelId, prog);
    }
    return prog;
  }

  public markLearnLessonCompleted(levelId: string, lessonId: string): void {
    const prog = this.getLevelProgress(levelId);
    if (!prog.learnLessonsCompleted.includes(lessonId)) {
      prog.learnLessonsCompleted.push(lessonId);
    }
    // If at least 3 lessons completed, mark learn stage completed
    if (prog.learnLessonsCompleted.length >= 3 && !prog.completedStages.includes("learn")) {
      prog.completedStages.push("learn");
    }
    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateLevelMastery(prog);
    this.recalculateAll();
    this.save();
  }

  public markPracticeCompleted(levelId: string, exerciseId: string): void {
    const prog = this.getLevelProgress(levelId);
    if (!prog.practiceCompleted.includes(exerciseId)) {
      prog.practiceCompleted.push(exerciseId);
    }
    // If at least 5 practice completed
    if (prog.practiceCompleted.length >= 5 && !prog.completedStages.includes("practice")) {
      prog.completedStages.push("practice");
    }
    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateLevelMastery(prog);
    this.recalculateAll();
    this.save();
  }

  public markSolveCompleted(levelId: string, exerciseId: string): void {
    const prog = this.getLevelProgress(levelId);
    if (!prog.solveCompleted.includes(exerciseId)) {
      prog.solveCompleted.push(exerciseId);
    }
    // If at least 5 solve completed
    if (prog.solveCompleted.length >= 5 && !prog.completedStages.includes("solve")) {
      prog.completedStages.push("solve");
    }
    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateLevelMastery(prog);
    this.recalculateAll();
    this.save();
  }

  public completeTest(levelId: string, score: number, answers: Record<string, number>): void {
    const prog = this.getLevelProgress(levelId);
    prog.testCompleted = true;
    prog.testScore = Math.max(prog.testScore, score);
    prog.testAnswers = { ...prog.testAnswers, ...answers };
    if (!prog.completedStages.includes("test")) {
      prog.completedStages.push("test");
    }
    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateLevelMastery(prog);
    this.recalculateAll();
    this.save();
  }

  public completeProject(levelId: string, score: number): void {
    const prog = this.getLevelProgress(levelId);
    prog.projectCompleted = true;
    prog.projectScore = Math.max(prog.projectScore, score);
    if (!prog.completedStages.includes("project")) {
      prog.completedStages.push("project");
    }
    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateLevelMastery(prog);
    this.recalculateAll();
    this.save();
  }

  public recordAttempt(
    levelId: string,
    exerciseId: string,
    isCorrect: boolean,
    modelIntegrityScore?: number
  ): void {
    const prog = this.getLevelProgress(levelId);
    prog.attemptsCount += 1;
    if (isCorrect) {
      prog.correctAttemptsCount += 1;
    }
    if (modelIntegrityScore !== undefined) {
      // Exponential moving average for integrity
      prog.modelIntegrity = Math.round(prog.modelIntegrity * 0.7 + modelIntegrityScore * 0.3);
    }

    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateLevelMastery(prog);
    this.recalculateAll();
    this.save();
  }

  /**
   * Financial Mastery Weights per Section 10:
   * 25% Formula Accuracy (derived from practice completion & accuracy)
   * 25% Financial Logic (derived from solve stage & test logic questions)
   * 20% Model Linking (derived from project statement linkages)
   * 15% Error Detection (debugging & error hunt tasks)
   * 15% Financial Interpretation (analysis & scenario interpretations)
   */
  public calculateLevelMastery(prog: FinancialLevelProgress): number {
    let formulaAccuracy = Math.min(100, (prog.practiceCompleted.length / 5) * 100);
    let financialLogic = Math.min(100, (prog.solveCompleted.length / 5) * 100);
    let modelLinking = prog.projectCompleted ? (prog.projectScore > 0 ? prog.projectScore : 100) : 0;
    let errorDetection = prog.testCompleted ? (prog.testScore > 0 ? prog.testScore : 100) : 0;
    let financialInterpretation = Math.min(
      100,
      ((prog.learnLessonsCompleted.length / 3) * 50) + (prog.projectCompleted ? 50 : 0)
    );

    const weightedScore =
      0.25 * formulaAccuracy +
      0.25 * financialLogic +
      0.20 * modelLinking +
      0.15 * errorDetection +
      0.15 * financialInterpretation;

    return Math.min(100, Math.max(0, Math.round(weightedScore)));
  }

  public getStats(): FinancialStats {
    return this.stats;
  }

  public isLevelUnlocked(levelId: string): boolean {
    if (levelId === "fin-level-01") return true;
    // For other levels, previous level must have at least 70% mastery
    const num = parseInt(levelId.replace("fin-level-", ""), 10);
    if (isNaN(num) || num <= 1) return true;
    const prevId = `fin-level-${String(num - 1).padStart(2, "0")}`;
    const prevProg = this.progressMap.get(prevId);
    return prevProg ? prevProg.masteryPercentage >= 60 : false;
  }

  public getResumeActivity(): {
    levelId: string;
    stage: FinancialStageType;
    labelEn: string;
    labelTr: string;
  } {
    const level01Prog = this.getLevelProgress("fin-level-01");

    if (level01Prog.learnLessonsCompleted.length < 3) {
      return {
        levelId: "fin-level-01",
        stage: "learn",
        labelEn: "Learn: Three Financial Statements",
        labelTr: "Öğren: Üç Finansal Tablo",
      };
    }

    if (level01Prog.practiceCompleted.length < 5) {
      return {
        levelId: "fin-level-01",
        stage: "practice",
        labelEn: `Practice: Financial Drivers (${level01Prog.practiceCompleted.length}/5)`,
        labelTr: `Alıştırma: Finansal Sürücüler (${level01Prog.practiceCompleted.length}/5)`,
      };
    }

    if (level01Prog.solveCompleted.length < 5) {
      return {
        levelId: "fin-level-01",
        stage: "solve",
        labelEn: `Solve: Business Cases (${level01Prog.solveCompleted.length}/5)`,
        labelTr: `Çöz: İş Senaryoları (${level01Prog.solveCompleted.length}/5)`,
      };
    }

    if (!level01Prog.testCompleted) {
      return {
        levelId: "fin-level-01",
        stage: "test",
        labelEn: "Test: Statement Basics Evaluation",
        labelTr: "Test: Temel Tablolar Sınavı",
      };
    }

    if (!level01Prog.projectCompleted) {
      return {
        levelId: "fin-level-01",
        stage: "project",
        labelEn: "Project: Nordic Retail 3-Statement Model",
        labelTr: "Proje: Nordic Retail 3-Tablolu Model",
      };
    }

    return {
      levelId: "fin-level-01",
      stage: "project",
      labelEn: "Review Level 1 Capstone Project",
      labelTr: "1. Seviye Bitirme Projesini İncele",
    };
  }

  private recalculateAll(): void {
    let totalMastery = 0;
    let totalIntegrity = 0;
    let completedLevelsCount = 0;
    let completedProjectsCount = 0;
    let totalAttempts = 0;
    let totalCorrect = 0;
    let count = 0;

    this.progressMap.forEach((prog) => {
      totalMastery += prog.masteryPercentage;
      totalIntegrity += prog.modelIntegrity;
      count += 1;
      if (prog.masteryPercentage >= 80 || prog.projectCompleted) {
        completedLevelsCount += 1;
      }
      if (prog.projectCompleted) {
        completedProjectsCount += 1;
      }
      totalAttempts += prog.attemptsCount;
      totalCorrect += prog.correctAttemptsCount;
    });

    const levelCount = 12; // Total 12 levels
    const mastery = Math.round(totalMastery / levelCount);
    const modelIntegrity = count > 0 ? Math.round(totalIntegrity / count) : 100;
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

    this.stats = {
      ...this.stats,
      mastery,
      accuracy,
      modelIntegrity,
      completedLevels: completedLevelsCount,
      completedProjects: completedProjectsCount,
    };
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split("T")[0];
    const lastActive = this.stats.lastActiveDate;

    if (!lastActive) {
      this.stats.lastActiveDate = today;
      this.stats.currentStreak = 1;
      this.stats.bestStreak = 1;
      return;
    }

    if (lastActive === today) return;

    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      this.stats.currentStreak += 1;
      this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
      this.stats.lastActiveDate = today;
    } else if (diffDays > 1) {
      this.stats.currentStreak = 1;
      this.stats.lastActiveDate = today;
    }
  }

  public resetAll(): void {
    this.progressMap.clear();
    this.stats = {
      mastery: 0,
      accuracy: 100,
      bestStreak: 1,
      currentStreak: 1,
      modelIntegrity: 100,
      completedLevels: 0,
      completedProjects: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],
    };
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_FINANCIAL_PROGRESS);
        localStorage.removeItem(STORAGE_KEY_FINANCIAL_STATS);
        localStorage.removeItem(STORAGE_KEY_FINANCIAL_ATTEMPTS);
        window.dispatchEvent(new CustomEvent("excel_arena_financial_progress_updated"));
      } catch {}
    }
  }
}

export const financialProgressService = new FinancialProgressService();
