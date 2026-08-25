"use client";

import React, { useState, useEffect } from "react";
import { TopicContent, PracticeChallenge } from "@/lib/content/types";
import { ExcelGrid } from "../excel/ExcelGrid";
import { FormulaBar } from "../excel/FormulaBar";
import { FormulaValidator } from "@/lib/formula/validator";
import { ValidationFeedback } from "@/lib/formula/types";
import { useI18n } from "@/lib/i18n/I18nContext";
import { progressService } from "@/lib/services/progress";
import { practiceSessionService } from "@/lib/services/practiceSession";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface PracticeStageProps {
  topic: TopicContent;
  onComplete: () => void;
}

export const PracticeStage: React.FC<PracticeStageProps> = ({ topic, onComplete }) => {
  const { interfaceLocale, t } = useI18n();

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [userFormula, setUserFormula] = useState("");
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [revealedHintLevel, setRevealedHintLevel] = useState(0);
  const [dynamicHint, setDynamicHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);

  // Load saved session on topic mount
  useEffect(() => {
    const session = practiceSessionService.getOrCreateSession(topic.id);
    const validIdx = Math.min(Math.max(0, session.currentChallengeIndex), topic.practice.length - 1);
    setChallengeIdx(validIdx);
    setCompletedIndices(session.completedIndices || []);
    setUserFormula("");
    setFeedback(null);
    setAttemptCount(0);
    setRevealedHintLevel(0);
    setDynamicHint(null);
  }, [topic.id, topic.practice.length]);

  const challenges = topic.practice;
  const currentChallenge: PracticeChallenge = challenges[challengeIdx] || challenges[0];

  const task =
    interfaceLocale === "tr" ? currentChallenge.taskTr : currentChallenge.taskEn;
  const staticHints =
    interfaceLocale === "tr" ? currentChallenge.hintsTr : currentChallenge.hintsEn;

  const handleCheckFormula = () => {
    if (!userFormula.trim()) return;

    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    // 1. Run deterministic AST formula validator
    const result = FormulaValidator.validate(userFormula, {
      dataset: currentChallenge.dataset,
      expectedResult: currentChallenge.expectedResult,
      expectedConcept: currentChallenge.expectedConcept,
      requireDataReference: true,
    });

    setFeedback(result);

    if (result.isCorrect) {
      practiceSessionService.markChallengeCompleted(topic.id, challengeIdx);
      if (!completedIndices.includes(challengeIdx)) {
        setCompletedIndices([...completedIndices, challengeIdx]);
      }
    }

    // 2. Record attempt in progress service
    progressService.recordAttempt(
      topic.id,
      topic.levelId,
      "practice",
      userFormula,
      result.isCorrect
    );
  };

  const handleRequestHint = async () => {
    const nextLevel = Math.min(3, revealedHintLevel + 1);
    setRevealedHintLevel(nextLevel);

    // Fetch dynamic AI hint from /api/ai/hint if available, fallback to static hints
    setIsLoadingHint(true);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          expectedConcept: currentChallenge.expectedConcept,
          userFormula,
          attemptCount: nextLevel,
          language: interfaceLocale,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.hint) {
          setDynamicHint(data.hint);
          setIsLoadingHint(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Static fallback hint
    const staticH = staticHints[nextLevel - 1] || staticHints[staticHints.length - 1];
    setDynamicHint(staticH);
    setIsLoadingHint(false);
  };

  const goToChallenge = (idx: number) => {
    practiceSessionService.setCurrentIndex(topic.id, idx);
    setChallengeIdx(idx);
    setUserFormula("");
    setFeedback(null);
    setAttemptCount(0);
    setRevealedHintLevel(0);
    setDynamicHint(null);
  };

  const handleResetPractice = () => {
    practiceSessionService.resetSession(topic.id);
    setChallengeIdx(0);
    setCompletedIndices([]);
    setUserFormula("");
    setFeedback(null);
    setAttemptCount(0);
    setRevealedHintLevel(0);
    setDynamicHint(null);
  };

  const handleNextChallenge = () => {
    if (challengeIdx < challenges.length - 1) {
      goToChallenge(challengeIdx + 1);
    } else {
      // Mark practice complete
      progressService.markStageCompleted(topic.id, topic.levelId, "practice");
      onComplete();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">
      {/* 1. Challenge Selector & Header (Section 20 Spec) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent">
            {t.practiceStage.taskHeaderPrefix} {challengeIdx + 1} / {challenges.length}
          </span>
          <span className="text-xs font-mono text-foreground-muted">
            ({completedIndices.length} / {challenges.length} {interfaceLocale === "tr" ? "çözüldü" : "solved"})
          </span>
        </div>

        {/* Carousel Selector Buttons & Reset */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <div className="flex items-center gap-1">
            {challenges.map((_, idx) => {
              const isCurrent = idx === challengeIdx;
              const isDone = completedIndices.includes(idx);

              return (
                <button
                  key={idx}
                  onClick={() => goToChallenge(idx)}
                  type="button"
                  title={`${interfaceLocale === "tr" ? "Soru" : "Challenge"} ${idx + 1}`}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-accent text-accent-foreground shadow-xs scale-105"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-surface-secondary text-foreground-muted border border-border hover:border-accent/50"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleResetPractice}
            title={interfaceLocale === "tr" ? "Pratiği Baştan Başlat" : "Reset Practice"}
            className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Task Description Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-surface border border-border shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted">
            Difficulty {currentChallenge.difficulty}/5
          </span>
          <span className="text-xs font-mono text-foreground-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            {t.practiceStage.formulaEvaluatorBadge}
          </span>
        </div>

        <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
          {task}
        </p>
      </div>

      {/* 3. Miniature Excel Spreadsheet Dataset */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
          {t.practiceStage.datasetTitle}
        </span>
        <ExcelGrid
          dataset={currentChallenge.dataset}
          maxHeight="240px"
          title="Challenge Worksheet"
        />
      </div>

      {/* 4. Formula Bar Input (Section 21 Spec) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
            {t.practiceStage.writeFormulaTitle}
          </span>
          <span className="text-xs text-foreground-muted">
            {t.practiceStage.formulaInputHint}
          </span>
        </div>

        <FormulaBar
          value={userFormula}
          onChange={setUserFormula}
          onSubmit={handleCheckFormula}
          placeholder={t.practiceStage.formulaInputPlaceholder}
          submitButtonText={t.common.checkFormula}
        />
      </div>

      {/* 5. Feedback Box (Section 26 Spec) */}
      {feedback && (
        <div
          className={`p-4 sm:p-5 rounded-xl border animate-slide-up flex flex-col gap-3 ${
            feedback.isCorrect
              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : feedback.status === "hardcoded_warning"
              ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
              : "bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
              <h4 className="text-sm font-bold tracking-wider uppercase font-mono">
                {feedback.isCorrect ? t.practiceStage.correctTitle : t.practiceStage.incorrectTitle}
              </h4>
            </div>

            {!feedback.isCorrect && feedback.userResult !== undefined && (
              <div className="text-xs font-mono flex items-center gap-2 px-2.5 py-1 rounded bg-surface/80 border border-border text-foreground">
                <span>
                  {t.practiceStage.yourResult}: <strong>{String(feedback.userResult)}</strong>
                </span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm leading-relaxed">
            {interfaceLocale === "tr" ? feedback.messageTr : feedback.messageEn}
          </p>

          {/* Action buttons inside feedback */}
          <div className="flex items-center justify-between pt-1">
            {!feedback.isCorrect && revealedHintLevel < 3 && (
              <button
                onClick={handleRequestHint}
                disabled={isLoadingHint}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{isLoadingHint ? t.common.loading : t.common.needHint}</span>
              </button>
            )}

            {feedback.isCorrect && (
              <button
                onClick={handleNextChallenge}
                type="button"
                className="ml-auto flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer hover:translate-x-0.5"
              >
                <span>
                  {challengeIdx < challenges.length - 1
                    ? t.practiceStage.nextChallenge
                    : t.stages.test}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Progressive 3-Tier Hint System (Section 25 Spec) */}
      {revealedHintLevel > 0 && dynamicHint && (
        <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <span>
                {t.hints.hintTitle} ({revealedHintLevel}/3)
              </span>
            </div>
            {revealedHintLevel < 3 && (
              <button
                onClick={handleRequestHint}
                disabled={isLoadingHint}
                className="text-[11px] text-accent hover:underline font-semibold cursor-pointer"
              >
                {t.hints.requestNextHint}
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">{dynamicHint}</p>
        </div>
      )}
    </div>
  );
};
