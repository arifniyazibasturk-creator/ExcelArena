import { StageType } from "../content/types";
import { LEVELS, getTotalTopicCount } from "../content/levels";

export interface TopicProgress {
  topicId: string;
  levelId: string;
  learnCompleted: boolean;
  practiceCompleted: boolean;
  testCompleted: boolean;
  testScore: number; // 0 to 100
  solveCompleted: boolean;
  attemptsCount: number;
  correctAttemptsCount: number;
  lastUpdated: string;
  masteryPercentage: number; // 0 to 100
}

export interface UserStats {
  overallMastery: number; // 0 to 100
  accuracyRate: number; // 0 to 100
  challengesSolved: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  completedTopicsCount: number;
  totalTopicsCount: number;
}

export interface FormulaAttempt {
  id: string;
  topicId: string;
  levelId: string;
  stage: StageType;
  formula: string;
  isCorrect: boolean;
  timestamp: string;
}

const STORAGE_KEY_PROGRESS = "excel_arena_progress";
const STORAGE_KEY_ATTEMPTS = "excel_arena_attempts";
const STORAGE_KEY_STATS = "excel_arena_stats";

class ProgressService {
  private progressMap: Map<string, TopicProgress> = new Map();
  private stats: UserStats = {
    overallMastery: 0,
    accuracyRate: 100,
    challengesSolved: 0,
    currentStreak: 1,
    bestStreak: 1,
    lastActiveDate: null,
    completedTopicsCount: 0,
    totalTopicsCount: 0,
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.load();
    }
  }

  public load(): void {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress) as Record<string, TopicProgress>;
        this.progressMap = new Map(Object.entries(parsed));
      }

      const storedStats = localStorage.getItem(STORAGE_KEY_STATS);
      if (storedStats) {
        this.stats = JSON.parse(storedStats);
      }

      this.updateStreak();
      this.recalculateAll();
    } catch {
      // Ignore storage read errors
    }
  }

  private save(): void {
    if (typeof window === "undefined") return;
    try {
      const progressObj: Record<string, TopicProgress> = {};
      this.progressMap.forEach((val, key) => {
        progressObj[key] = val;
      });
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressObj));
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(this.stats));

      // Dispatch storage event for reactive UI updates
      window.dispatchEvent(new CustomEvent("excel_arena_progress_updated"));
    } catch {
      // Ignore storage write errors
    }
  }

  public getTopicProgress(topicId: string, levelId?: string): TopicProgress {
    let prog = this.progressMap.get(topicId);
    if (!prog) {
      prog = {
        topicId,
        levelId: levelId || "level-01",
        learnCompleted: false,
        practiceCompleted: false,
        testCompleted: false,
        testScore: 0,
        solveCompleted: false,
        attemptsCount: 0,
        correctAttemptsCount: 0,
        lastUpdated: new Date().toISOString(),
        masteryPercentage: 0,
      };
      this.progressMap.set(topicId, prog);
    }
    return prog;
  }

  public markStageCompleted(
    topicId: string,
    levelId: string,
    stage: StageType,
    testScorePercentage?: number
  ): TopicProgress {
    const prog = this.getTopicProgress(topicId, levelId);

    if (stage === "learn") {
      prog.learnCompleted = true;
    } else if (stage === "practice") {
      prog.practiceCompleted = true;
    } else if (stage === "test") {
      prog.testCompleted = true;
      if (testScorePercentage !== undefined) {
        prog.testScore = Math.max(prog.testScore, testScorePercentage);
      }
    } else if (stage === "solve") {
      prog.solveCompleted = true;
    }

    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateTopicMastery(prog);

    this.progressMap.set(topicId, prog);
    this.recalculateAll();
    this.save();

    return prog;
  }

  public recordAttempt(
    topicId: string,
    levelId: string,
    stage: StageType,
    formula: string,
    isCorrect: boolean
  ): void {
    const prog = this.getTopicProgress(topicId, levelId);
    prog.attemptsCount += 1;
    if (isCorrect) {
      prog.correctAttemptsCount += 1;
    }

    prog.lastUpdated = new Date().toISOString();
    prog.masteryPercentage = this.calculateTopicMastery(prog);
    this.progressMap.set(topicId, prog);

    // Save attempt log
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      const attempts: FormulaAttempt[] = stored ? JSON.parse(stored) : [];
      attempts.unshift({
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        topicId,
        levelId,
        stage,
        formula,
        isCorrect,
        timestamp: new Date().toISOString(),
      });
      // Cap at 100 recent attempts
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts.slice(0, 100)));
    } catch {}

    this.recalculateAll();
    this.save();
  }

  /**
   * Transparent mastery calculation:
   * Learn: 15%
   * Practice: 30%
   * Test: 25% (scaled by testScore)
   * Solve: 30%
   */
  public calculateTopicMastery(prog: TopicProgress): number {
    let score = 0;
    if (prog.learnCompleted) score += 15;
    if (prog.practiceCompleted) score += 30;
    if (prog.testCompleted) {
      const testWeight = (prog.testScore > 0 ? prog.testScore : 100) / 100;
      score += Math.round(25 * testWeight);
    }
    if (prog.solveCompleted) score += 30;

    return Math.min(100, Math.max(0, score));
  }

  public getStats(): UserStats {
    return this.stats;
  }

  public getLevelMastery(levelId: string): { percentage: number; completedTopics: number; totalTopics: number } {
    const level = LEVELS.find((l) => l.id === levelId);
    if (!level || level.topics.length === 0) {
      return { percentage: 0, completedTopics: 0, totalTopics: 0 };
    }

    let totalMasterySum = 0;
    let completedTopics = 0;

    level.topics.forEach((t) => {
      const prog = this.progressMap.get(t.id);
      if (prog) {
        totalMasterySum += prog.masteryPercentage;
        if (prog.masteryPercentage >= 80 || (prog.practiceCompleted && prog.solveCompleted)) {
          completedTopics += 1;
        }
      }
    });

    const percentage = Math.round(totalMasterySum / level.topics.length);
    return {
      percentage,
      completedTopics,
      totalTopics: level.topics.length,
    };
  }

  public isTopicUnlocked(levelId: string, topicId: string): boolean {
    const level = LEVELS.find((l) => l.id === levelId);
    if (!level || level.isLocked) return false;

    // First topic in level 01 is always unlocked
    if (levelId === "level-01" && level.topics[0]?.id === topicId) {
      return true;
    }

    // Check position in current level
    const topicIdx = level.topics.findIndex((t) => t.id === topicId);
    if (topicIdx === 0) {
      // First topic of a level: check if previous level is at least 60% mastered
      const currentLevelIdx = LEVELS.findIndex((l) => l.id === levelId);
      if (currentLevelIdx > 0) {
        const prevLevel = LEVELS[currentLevelIdx - 1];
        const prevMastery = this.getLevelMastery(prevLevel.id);
        return prevMastery.percentage >= 50 || prevMastery.completedTopics > 0;
      }
      return true;
    }

    // Otherwise, previous topic must have at least Learn or Practice completed
    const prevTopic = level.topics[topicIdx - 1];
    if (!prevTopic) return true;
    const prevProg = this.progressMap.get(prevTopic.id);
    return prevProg ? prevProg.learnCompleted || prevProg.practiceCompleted : false;
  }

  public getNextRecommendedTopic(): { levelId: string; topicId: string } {
    for (const level of LEVELS) {
      if (level.isLocked) continue;
      for (const topic of level.topics) {
        const prog = this.progressMap.get(topic.id);
        if (!prog || prog.masteryPercentage < 80) {
          return { levelId: level.id, topicId: topic.id };
        }
      }
    }
    // All done: return first
    return { levelId: "level-01", topicId: "cell-references" };
  }

  private recalculateAll(): void {
    const totalTopics = getTotalTopicCount();
    let totalMastery = 0;
    let completedTopics = 0;
    let totalAttempts = 0;
    let totalCorrectAttempts = 0;
    let challengesSolvedCount = 0;

    this.progressMap.forEach((prog) => {
      totalMastery += prog.masteryPercentage;
      if (prog.masteryPercentage >= 80 || (prog.practiceCompleted && prog.solveCompleted)) {
        completedTopics += 1;
      }
      totalAttempts += prog.attemptsCount;
      totalCorrectAttempts += prog.correctAttemptsCount;
      if (prog.practiceCompleted) challengesSolvedCount += 1;
      if (prog.solveCompleted) challengesSolvedCount += 1;
    });

    const overallMastery = totalTopics > 0 ? Math.round(totalMastery / totalTopics) : 0;
    const accuracyRate =
      totalAttempts > 0 ? Math.round((totalCorrectAttempts / totalAttempts) * 100) : 100;

    this.stats = {
      ...this.stats,
      overallMastery,
      accuracyRate,
      challengesSolved: challengesSolvedCount,
      completedTopicsCount: completedTopics,
      totalTopicsCount: totalTopics,
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

    if (lastActive === today) {
      // Same day, streak intact
      return;
    }

    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Consecutive day!
      this.stats.currentStreak += 1;
      this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
      this.stats.lastActiveDate = today;
    } else if (diffDays > 1) {
      // Missed a day
      this.stats.currentStreak = 1;
      this.stats.lastActiveDate = today;
    }
  }

  public resetAll(): void {
    this.progressMap.clear();
    this.stats = {
      overallMastery: 0,
      accuracyRate: 100,
      challengesSolved: 0,
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      completedTopicsCount: 0,
      totalTopicsCount: getTotalTopicCount(),
    };
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_PROGRESS);
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        localStorage.removeItem(STORAGE_KEY_STATS);
        window.dispatchEvent(new CustomEvent("excel_arena_progress_updated"));
      } catch {}
    }
  }
}

export const progressService = new ProgressService();
