"use client";

import React, { useState, useEffect } from "react";
import { TopicContent } from "@/lib/content/types";
import { ExcelGrid } from "../excel/ExcelGrid";
import { FormulaBar } from "../excel/FormulaBar";
import { FormulaValidator } from "@/lib/formula/validator";
import { ValidationFeedback } from "@/lib/formula/types";
import { useI18n } from "@/lib/i18n/I18nContext";
import { progressService } from "@/lib/services/progress";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface SolveStageProps {
  topic: TopicContent;
  onComplete: () => void;
}

export const SolveStage: React.FC<SolveStageProps> = ({ topic, onComplete }) => {
  const { interfaceLocale, t } = useI18n();
  const solve = topic.solve;

  const [userFormula, setUserFormula] = useState("");
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);

  useEffect(() => {
    const prog = progressService.getTopicProgress(topic.id, topic.levelId);
    if (prog.solveCompleted) {
      setFeedback({
        isValid: true,
        isCorrect: true,
        status: "correct",
        messageEn: "You have previously solved this capstone challenge successfully!",
        messageTr: "Bu vaka analizini daha önce başarıyla tamamladınız!",
        usedFunctions: [],
        isEquivalent: true,
      });
    } else {
      setUserFormula("");
      setFeedback(null);
    }
  }, [topic.id, topic.levelId, solve.suggestedFormulaEn]);

  const title = interfaceLocale === "tr" ? solve.titleTr : solve.titleEn;
  const scenario = interfaceLocale === "tr" ? solve.scenarioTr : solve.scenarioEn;
  const task = interfaceLocale === "tr" ? solve.taskTr : solve.taskEn;

  const handleSubmitSolution = () => {
    if (!userFormula.trim()) return;

    // Validate using deterministic engine with anti-cheat
    const result = FormulaValidator.validate(userFormula, {
      dataset: solve.dataset,
      expectedResult: solve.expectedResult,
      expectedConcept: solve.expectedConcept,
      requireDataReference: true,
    });

    setFeedback(result);

    // Record attempt
    progressService.recordAttempt(
      topic.id,
      topic.levelId,
      "solve",
      userFormula,
      result.isCorrect
    );

    if (result.isCorrect) {
      // Mark solve stage complete
      progressService.markStageCompleted(topic.id, topic.levelId, "solve");
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in max-w-4xl">
      {/* 1. Realistic Business Case Scenario */}
      <div className="p-5 rounded-xl bg-surface border border-border shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.solveStage.scenarioTitle}
            </span>
          </div>

          <span className="text-[11px] font-mono text-foreground-muted">
            {t.solveStage.equivalentFormulaAccepted}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-foreground">{title}</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">{scenario}</p>

        {/* Objective Box */}
        <div className="mt-2 p-3.5 rounded-lg bg-surface-secondary/70 border border-border text-xs sm:text-sm font-semibold text-foreground flex items-start gap-2">
          <span className="text-accent font-bold uppercase tracking-wide text-xs shrink-0 pt-0.5">
            {t.solveStage.solveTask}:
          </span>
          <span>{task}</span>
        </div>
      </div>

      {/* 2. Large Dataset Table */}
      <ExcelGrid
        dataset={solve.dataset}
        maxHeight="280px"
        title="Production Data (Full Dataset)"
      />

      {/* 3. Formula Input */}
      <div className="flex flex-col gap-2">
        <FormulaBar
          value={userFormula}
          onChange={setUserFormula}
          onSubmit={handleSubmitSolution}
          placeholder={t.practiceStage.formulaInputPlaceholder}
          submitButtonText={t.solveStage.submitSolution}
        />
      </div>

      {/* 4. Feedback & Completion Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border animate-slide-up flex flex-col gap-3 ${
            feedback.isCorrect
              ? "bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : feedback.status === "hardcoded_warning"
              ? "bg-amber-50/80 dark:bg-amber-950/25 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
              : "bg-rose-50/80 dark:bg-rose-950/25 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {feedback.isCorrect ? t.solveStage.solvedTitle : t.practiceStage.incorrectTitle}
              </h4>
            </div>

            {!feedback.isCorrect && feedback.userResult !== undefined && (
              <div className="text-xs font-mono px-2.5 py-1 rounded bg-surface/80 border border-border text-foreground">
                <span>
                  {t.practiceStage.yourResult}: <strong>{String(feedback.userResult)}</strong>
                </span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm leading-relaxed">
            {interfaceLocale === "tr" ? feedback.messageTr : feedback.messageEn}
          </p>

          {/* Success Mastery Action Button */}
          {feedback.isCorrect && (
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{t.solveStage.topicMastered}</span>
              </div>

              <button
                onClick={onComplete}
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer hover:translate-x-0.5"
              >
                <span>{t.solveStage.nextTopic}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
