"use client";

import React, { useState, useEffect } from "react";
import { TopicContent, TestChallenge } from "@/lib/content/types";
import { ExcelGrid } from "../excel/ExcelGrid";
import { useI18n } from "@/lib/i18n/I18nContext";
import { progressService } from "@/lib/services/progress";
import { testSessionService, TestSession } from "@/lib/services/testSession";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  Play,
  RotateCw,
} from "lucide-react";

interface TestStageProps {
  topic: TopicContent;
  onComplete: () => void;
}

export const TestStage: React.FC<TestStageProps> = ({ topic, onComplete }) => {
  const { interfaceLocale, t } = useI18n();
  const tests = topic.test;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [orderedBlockIndices, setOrderedBlockIndices] = useState<number[]>([]);
  const [answers, setAnswers] = useState<{ isCorrect: boolean }[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [resumePromptSession, setResumePromptSession] = useState<TestSession | null>(null);

  // Initialize and check for existing unfinished test session
  useEffect(() => {
    const existing = testSessionService.getSession(topic.id);
    if (existing && !existing.completed && existing.currentQuestionIndex > 0) {
      setResumePromptSession(existing);
    } else if (!existing) {
      testSessionService.createSession(topic.id);
    }
  }, [topic.id]);

  const handleResume = () => {
    if (!resumePromptSession) return;
    setCurrentIdx(resumePromptSession.currentQuestionIndex);
    setAnswers(resumePromptSession.answers.map((a) => ({ isCorrect: a.isCorrect })));
    setResumePromptSession(null);
  };

  const handleStartFresh = () => {
    testSessionService.resetSession(topic.id);
    testSessionService.createSession(topic.id);
    setCurrentIdx(0);
    setAnswers([]);
    setSelectedOption(null);
    setOrderedBlockIndices([]);
    setShowSummary(false);
    setResumePromptSession(null);
  };

  const currentTest: TestChallenge = tests[currentIdx] || tests[0];
  const question =
    interfaceLocale === "tr" ? currentTest.questionTr : currentTest.questionEn;
  const options =
    interfaceLocale === "tr" ? currentTest.optionsTr : currentTest.optionsEn;

  // Handles multiple-choice selection
  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  // Handles formula ordering block clicks
  const handleAddBlock = (blockIdx: number) => {
    if (!orderedBlockIndices.includes(blockIdx)) {
      setOrderedBlockIndices([...orderedBlockIndices, blockIdx]);
    }
  };

  const handleRemoveBlock = (blockIdx: number) => {
    setOrderedBlockIndices(orderedBlockIndices.filter((i) => i !== blockIdx));
  };

  const handleNextQuestion = () => {
    let isCorrect = false;

    if (currentTest.type === "formula-ordering") {
      const correctOrder = currentTest.correctBlockOrder || [];
      isCorrect =
        orderedBlockIndices.length === correctOrder.length &&
        orderedBlockIndices.every((val, idx) => val === correctOrder[idx]);
    } else if (currentTest.correctOptionIndex !== undefined) {
      isCorrect = selectedOption === currentTest.correctOptionIndex;
    }

    const updatedAnswers = [...answers, { isCorrect }];
    setAnswers(updatedAnswers);

    // Record into persistent session
    testSessionService.recordAnswer(
      topic.id,
      currentIdx,
      isCorrect,
      selectedOption,
      orderedBlockIndices
    );

    // Reset selection state for next question
    setSelectedOption(null);
    setOrderedBlockIndices([]);

    if (currentIdx < tests.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate final score
      const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
      const scorePct = Math.round((correctCount / tests.length) * 100);

      // Complete test session
      testSessionService.completeSession(topic.id, scorePct);

      // Save test completion to master progress
      progressService.markStageCompleted(topic.id, topic.levelId, "test", scorePct);
      setShowSummary(true);
    }
  };

  const handleRetryTest = () => {
    handleStartFresh();
  };

  // Unfinished session resume modal banner (Section 24 Spec)
  if (resumePromptSession) {
    return (
      <div className="p-6 sm:p-8 rounded-xl bg-surface border border-accent/30 shadow-sm flex flex-col items-center text-center gap-5 animate-scale-up max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
          <Zap className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-bold">
            {interfaceLocale === "tr" ? "TESTE DEVAM ET" : "CONTINUE TEST"}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-foreground">
            {interfaceLocale === "tr" ? topic.titleTr : topic.titleEn}
          </h3>
          <p className="text-xs sm:text-sm text-foreground-secondary">
            {interfaceLocale === "tr"
              ? `Yarım kalan bir testiniz bulunmaktadır. (Soru ${resumePromptSession.currentQuestionIndex + 1} / ${tests.length})`
              : `You have an unfinished test. (Question ${resumePromptSession.currentQuestionIndex + 1} of ${tests.length})`}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleResume}
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>{interfaceLocale === "tr" ? "TESTE DEVAM ET" : "RESUME TEST"}</span>
          </button>

          <button
            onClick={handleStartFresh}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground-secondary transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{interfaceLocale === "tr" ? "BAŞTAN BAŞLA" : "START OVER"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Summary after question 5 (Section 25 Spec)
  if (showSummary) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const scorePct = Math.round((correctCount / tests.length) * 100);
    const passed = scorePct >= 60;

    return (
      <div className="p-6 sm:p-8 rounded-xl bg-surface border border-border shadow-sm flex flex-col items-center text-center gap-6 animate-scale-up max-w-lg mx-auto">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            passed
              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
          }`}
        >
          <Trophy className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            {t.testStage.testComplete}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground">
            {correctCount} / {tests.length}
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted font-mono">
            {t.dashboard.accuracyRate}: <strong className="text-foreground">{scorePct}%</strong> · Mastery updated.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleRetryTest}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.testStage.retryTest}</span>
          </button>

          <button
            onClick={onComplete}
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <span>{t.testStage.continueToSolve}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isCurrentValid =
    currentTest.type === "formula-ordering"
      ? orderedBlockIndices.length > 0
      : selectedOption !== null;

  return (
    <div className="flex flex-col gap-5 animate-fade-in max-w-3xl">
      {/* 1. Header & Test Progress (Section 21 Spec: Question X of 5 with dots indicator) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            {interfaceLocale === "tr" ? "Soru" : "Question"} {currentIdx + 1} / {tests.length}
          </span>
        </div>

        {/* Clean Step Indicator: ● ● → ○ ○ */}
        <div className="flex items-center gap-2">
          {tests.map((_, qIdx) => {
            const hasAnswered = qIdx < answers.length;
            const isCurrent = qIdx === currentIdx;
            const isQCorrect = hasAnswered ? answers[qIdx]?.isCorrect : null;

            return (
              <div
                key={qIdx}
                className={`font-mono text-xs font-bold transition-all ${
                  isCurrent
                    ? "text-accent font-black scale-125"
                    : isQCorrect === true
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isQCorrect === false
                    ? "text-rose-500"
                    : "text-foreground-muted/40"
                }`}
                title={`Question ${qIdx + 1}`}
              >
                {isCurrent ? "→" : isQCorrect === true ? "●" : isQCorrect === false ? "×" : "○"}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Question Statement Card */}
      <div className="p-5 rounded-xl bg-surface border border-border shadow-xs flex flex-col gap-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
          {currentTest.type.replace("-", " ").toUpperCase()}
        </span>
        <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {question}
        </h3>

        {/* Optional Dataset for Output Prediction */}
        {currentTest.dataset && (
          <div className="mt-2">
            <ExcelGrid dataset={currentTest.dataset} maxHeight="180px" />
          </div>
        )}
      </div>

      {/* 3. Challenge Interactive Area */}
      {currentTest.type === "formula-ordering" ? (
        /* Formula Ordering Interactive Drag / Click Block UI */
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs font-semibold text-foreground-secondary">
            {t.testStage.dragOrClick}
          </span>

          {/* Constructed Formula Preview */}
          <div className="min-h-12 p-2.5 rounded-lg bg-surface-secondary border border-dashed border-border-strong font-mono text-sm flex items-center flex-wrap gap-1.5">
            {orderedBlockIndices.length === 0 ? (
              <span className="text-xs text-foreground-muted italic">
                {t.testStage.selectedOrder}
              </span>
            ) : (
              orderedBlockIndices.map((bIdx) => (
                <button
                  key={bIdx}
                  onClick={() => handleRemoveBlock(bIdx)}
                  className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-mono font-bold shadow-xs hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  {currentTest.formulaBlocks?.[bIdx]}
                </button>
              ))
            )}
          </div>

          {/* Scrambled Blocks to pick from */}
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-border">
            {currentTest.formulaBlocks?.map((block, idx) => {
              const isUsed = orderedBlockIndices.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleAddBlock(idx)}
                  disabled={isUsed}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all cursor-pointer ${
                    isUsed
                      ? "opacity-30 border-dashed border-border bg-surface-secondary cursor-not-allowed"
                      : "bg-surface border-border hover:border-accent hover:text-accent shadow-2xs hover:scale-105"
                  }`}
                >
                  {block}
                </button>
              );
            })}

            {orderedBlockIndices.length > 0 && (
              <button
                onClick={() => setOrderedBlockIndices([])}
                className="ml-auto text-[11px] text-foreground-muted hover:text-foreground underline cursor-pointer"
              >
                {t.testStage.clearBlocks}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Multiple Choice Options */
        <div className="grid grid-cols-1 gap-2.5">
          {options?.map((opt, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-mono font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent font-bold shadow-xs scale-[1.005]"
                    : "border-border bg-surface hover:border-border-strong hover:bg-surface-secondary/70 text-foreground"
                }`}
              >
                <span>{opt}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                    isSelected ? "border-accent bg-accent text-accent-foreground" : "border-border"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Action Button: Submit & Next */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleNextQuestion}
          disabled={!isCurrentValid}
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{currentIdx < tests.length - 1 ? t.common.next : t.common.submit}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
