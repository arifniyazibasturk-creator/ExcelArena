export interface TestAnswerRecord {
  questionIndex: number;
  selectedOption?: number | null;
  orderedBlocks?: number[];
  isCorrect: boolean;
}

export interface TestSession {
  id: string;
  userId: string;
  topicId: string;
  testId: string;
  currentQuestionIndex: number; // 0 to 4
  answers: TestAnswerRecord[];
  score: number; // 0 to 100
  startedAt: string;
  updatedAt: string;
  completed: boolean;
}

const STORAGE_PREFIX = "excel_arena_test_session_";

class TestSessionService {
  public getSession(topicId: string): TestSession | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
      if (!stored) return null;
      return JSON.parse(stored) as TestSession;
    } catch {
      return null;
    }
  }

  public createSession(topicId: string): TestSession {
    const session: TestSession = {
      id: `ts_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: "local_user",
      topicId,
      testId: `test_${topicId}`,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
    };
    this.saveSession(session);
    return session;
  }

  public saveSession(session: TestSession): void {
    if (typeof window === "undefined") return;
    try {
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(`${STORAGE_PREFIX}${session.topicId}`, JSON.stringify(session));
    } catch {}
  }

  public recordAnswer(
    topicId: string,
    questionIndex: number,
    isCorrect: boolean,
    selectedOption?: number | null,
    orderedBlocks?: number[]
  ): TestSession {
    let session = this.getSession(topicId);
    if (!session || session.completed) {
      session = this.createSession(topicId);
    }

    // Filter out previous answer for this question if it exists
    const existingAnswers = session.answers.filter((a) => a.questionIndex !== questionIndex);
    existingAnswers.push({
      questionIndex,
      selectedOption,
      orderedBlocks,
      isCorrect,
    });

    session.answers = existingAnswers.sort((a, b) => a.questionIndex - b.questionIndex);
    session.currentQuestionIndex = Math.min(4, questionIndex + 1);

    this.saveSession(session);
    return session;
  }

  public completeSession(topicId: string, finalScore: number): TestSession {
    let session = this.getSession(topicId);
    if (!session) {
      session = this.createSession(topicId);
    }

    session.completed = true;
    session.score = finalScore;
    session.updatedAt = new Date().toISOString();

    this.saveSession(session);
    return session;
  }

  public resetSession(topicId: string): TestSession {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${topicId}`);
      } catch {}
    }
    return this.createSession(topicId);
  }

  public hasUnfinishedSession(topicId: string): boolean {
    const session = this.getSession(topicId);
    return Boolean(session && !session.completed && session.answers.length > 0);
  }
}

export const testSessionService = new TestSessionService();
