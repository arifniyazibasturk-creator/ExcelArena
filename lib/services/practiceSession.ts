export interface PracticeSession {
  topicId: string;
  currentChallengeIndex: number;
  completedIndices: number[];
  draftFormula?: string;
  lastUpdated: string;
}

const STORAGE_PREFIX = "excel_arena_practice_session_";

class PracticeSessionService {
  public getSession(topicId: string): PracticeSession | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
      if (!stored) return null;
      return JSON.parse(stored) as PracticeSession;
    } catch {
      return null;
    }
  }

  public saveSession(session: PracticeSession): void {
    if (typeof window === "undefined") return;
    try {
      session.lastUpdated = new Date().toISOString();
      localStorage.setItem(`${STORAGE_PREFIX}${session.topicId}`, JSON.stringify(session));
    } catch {}
  }

  public getOrCreateSession(topicId: string): PracticeSession {
    const existing = this.getSession(topicId);
    if (existing) return existing;

    const newSession: PracticeSession = {
      topicId,
      currentChallengeIndex: 0,
      completedIndices: [],
      draftFormula: "",
      lastUpdated: new Date().toISOString(),
    };
    this.saveSession(newSession);
    return newSession;
  }

  public setCurrentIndex(topicId: string, index: number): PracticeSession {
    const session = this.getOrCreateSession(topicId);
    session.currentChallengeIndex = index;
    this.saveSession(session);
    return session;
  }

  public markChallengeCompleted(topicId: string, index: number): PracticeSession {
    const session = this.getOrCreateSession(topicId);
    if (!session.completedIndices.includes(index)) {
      session.completedIndices.push(index);
    }
    this.saveSession(session);
    return session;
  }

  public resetSession(topicId: string): PracticeSession {
    const fresh: PracticeSession = {
      topicId,
      currentChallengeIndex: 0,
      completedIndices: [],
      draftFormula: "",
      lastUpdated: new Date().toISOString(),
    };
    this.saveSession(fresh);
    return fresh;
  }
}

export const practiceSessionService = new PracticeSessionService();
