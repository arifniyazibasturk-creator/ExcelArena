"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FinancialLevel, FinancialStageType } from "@/lib/financial/types";
import {
  financialProgressService,
  getDefaultLevelProgress,
} from "@/lib/services/financialProgress";
import { useI18n } from "@/lib/i18n/I18nContext";
import { FinancialExerciseRenderer } from "./FinancialExerciseRenderer";
import { NordicRetailProject } from "./NordicRetailProject";
import {
  BookOpen,
  Code2,
  Zap,
  Briefcase,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldCheck,
  Building2,
  ArrowRight,
  RotateCcw,
  Trophy,
} from "lucide-react";

interface FinancialArenaProps {
  level: FinancialLevel;
}

export const FinancialArena: React.FC<FinancialArenaProps> = ({ level }) => {
  const router = useRouter();
  const { interfaceLocale } = useI18n();
  const isTr = interfaceLocale === "tr";

  const [activeStage, setActiveStage] = useState<FinancialStageType>("learn");
  const [levelProgress, setLevelProgress] = useState(
    getDefaultLevelProgress(level.id)
  );

  // Lesson, Practice, Solve, Test indices
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [currentPracticeIdx, setCurrentPracticeIdx] = useState(0);
  const [currentSolveIdx, setCurrentSolveIdx] = useState(0);

  // Test state
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  useEffect(() => {
    setLevelProgress({ ...financialProgressService.getLevelProgress(level.id) });

    const handleUpdate = () => {
      setLevelProgress({ ...financialProgressService.getLevelProgress(level.id) });
    };
    window.addEventListener("excel_arena_financial_progress_updated", handleUpdate);
    return () => window.removeEventListener("excel_arena_financial_progress_updated", handleUpdate);
  }, [level.id]);

  const stageTabs: {
    id: FinancialStageType;
    labelEn: string;
    labelTr: string;
    icon: React.ElementType;
    isCompleted: boolean;
  }[] = [
    {
      id: "learn",
      labelEn: "1. Learn",
      labelTr: "1. Öğren",
      icon: BookOpen,
      isCompleted: levelProgress.completedStages.includes("learn"),
    },
    {
      id: "practice",
      labelEn: "2. Practice",
      labelTr: "2. Alıştırma",
      icon: Code2,
      isCompleted: levelProgress.completedStages.includes("practice"),
    },
    {
      id: "solve",
      labelEn: "3. Solve",
      labelTr: "3. Çöz",
      icon: Briefcase,
      isCompleted: levelProgress.completedStages.includes("solve"),
    },
    {
      id: "test",
      labelEn: "4. Test",
      labelTr: "4. Test",
      icon: Zap,
      isCompleted: levelProgress.testCompleted,
    },
    {
      id: "project",
      labelEn: "5. Project",
      labelTr: "5. Proje",
      icon: Building2,
      isCompleted: levelProgress.projectCompleted,
    },
  ];

  // Stage Transitions
  const handleNextLesson = () => {
    const currentLesson = level.learnLessons[currentLessonIdx];
    if (currentLesson) {
      financialProgressService.markLearnLessonCompleted(level.id, currentLesson.id);
    }

    if (currentLessonIdx < level.learnLessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
    } else {
      setActiveStage("practice");
    }
  };

  const handlePracticeExerciseComplete = (exId: string) => {
    financialProgressService.markPracticeCompleted(level.id, exId);
  };

  const handleSolveExerciseComplete = (exId: string) => {
    financialProgressService.markSolveCompleted(level.id, exId);
  };

  const handleSelectTestOption = (questionId: string, optionIdx: number) => {
    if (testSubmitted) return;
    setTestAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitTest = () => {
    let correct = 0;
    level.testQuestions.forEach((q) => {
      if (testAnswers[q.id] === q.correctIndex) correct += 1;
    });
    const finalScore = Math.round((correct / level.testQuestions.length) * 100);
    setTestScore(finalScore);
    setTestSubmitted(true);
    financialProgressService.completeTest(level.id, finalScore, testAnswers);
  };

  const handleProjectComplete = (score: number) => {
    financialProgressService.completeProject(level.id, score);
  };

  const activeLesson = level.learnLessons[currentLessonIdx] || level.learnLessons[0];
  const activePractice = level.practiceExercises[currentPracticeIdx] || level.practiceExercises[0];
  const activeSolve = level.solveExercises[currentSolveIdx] || level.solveExercises[0];

  return (
    <div className="flex flex-col gap-6 pb-16 animate-fade-in">
      {/* Top Breadcrumb & Level Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-foreground-muted">
            <Link href="/" className="hover:text-accent">
              {isTr ? "Finansal Excel" : "Financial Excel"}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>LEVEL {level.code}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent font-bold">
              {isTr ? level.titleTr : level.titleEn}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {isTr ? level.titleTr : level.titleEn}
          </h1>
        </div>

        {/* Level Mastery Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-surface border border-border flex items-center gap-2">
            <span className="text-foreground-muted">Mastery:</span>
            <strong suppressHydrationWarning className="text-accent text-sm font-bold">
              {levelProgress.masteryPercentage}%
            </strong>
          </div>
        </div>
      </div>

      {/* 5-Stage Segmented Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-surface-secondary/60 p-1.5 rounded-2xl border border-border">
        {stageTabs.map((tab) => {
          const isActive = activeStage === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStage(tab.id)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-surface text-accent shadow-xs border border-border font-bold"
                  : "text-foreground-secondary hover:text-foreground hover:bg-surface/50"
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {tab.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-accent" : ""}`} />
                )}
                <span className="truncate">{isTr ? tab.labelTr : tab.labelEn}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* STAGE 1: LEARN */}
      {activeStage === "learn" && activeLesson && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Lesson Navigation Header */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-accent font-bold">
                {isTr ? "Ders" : "Lesson"} {currentLessonIdx + 1}/{level.learnLessons.length}
              </span>
              <span className="text-foreground-muted">•</span>
              <span className="text-foreground truncate max-w-xs sm:max-w-md font-semibold">
                {isTr ? activeLesson.titleTr : activeLesson.titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {level.learnLessons.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setCurrentLessonIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    i === currentLessonIdx
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : levelProgress.learnLessonsCompleted.includes(l.id)
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-300"
                      : "bg-surface-secondary text-foreground-muted hover:bg-surface-secondary/80"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Lesson Content Body */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                {isTr ? "Kavram ve Finansal Mantık" : "Concept & Financial Rationale"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {isTr ? activeLesson.titleTr : activeLesson.titleEn}
              </h2>
            </div>

            <p className="text-sm text-foreground-secondary leading-relaxed">
              {isTr ? activeLesson.conceptTr : activeLesson.conceptEn}
            </p>

            {/* Why It Matters & Affected Statements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold text-accent uppercase">
                  {isTr ? "Neden Kritik Önemde?" : "Why It Matters"}
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {isTr ? activeLesson.whyItMattersTr : activeLesson.whyItMattersEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold text-foreground-muted uppercase">
                  {isTr ? "Etkilenen Finansal Tablolar" : "Statements Affected"}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeLesson.statementsAffected.map((st, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-surface border border-border text-foreground font-semibold"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Excel Formulas Box */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground-muted">
                {isTr ? "Kilit Finansal Formüller" : "Key Financial Formulas"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeLesson.keyFormulas.map((kf, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border flex flex-col gap-1.5"
                  >
                    <span className="text-xs font-bold text-foreground">
                      {isTr ? kf.nameTr : kf.nameEn}
                    </span>
                    <code className="font-mono text-xs text-accent font-bold bg-surface p-1 rounded border border-border/60">
                      {kf.formula}
                    </code>
                    <p className="text-[11px] text-foreground-muted leading-relaxed">
                      {isTr ? kf.explanationTr : kf.explanationEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Financial Table Example */}
            {activeLesson.practicalExample && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground-muted">
                  {isTr ? "Pratik Tablo Örneği" : "Practical Framework Table"}
                </span>
                <p className="text-xs text-foreground-secondary">
                  {isTr
                    ? activeLesson.practicalExample.descriptionTr
                    : activeLesson.practicalExample.descriptionEn}
                </p>
                <div className="overflow-x-auto rounded-xl border border-border shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-surface-secondary/80 border-b border-border text-foreground-muted font-mono uppercase">
                      <tr>
                        {activeLesson.practicalExample.headers.map((h, i) => (
                          <th key={i} className="p-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeLesson.practicalExample.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface-secondary/40">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 font-mono">
                              {typeof cell === "number" ? cell.toLocaleString() : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                disabled={currentLessonIdx === 0}
                onClick={() => setCurrentLessonIdx(currentLessonIdx - 1)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground-secondary hover:text-foreground disabled:opacity-40 cursor-pointer"
              >
                {isTr ? "Önceki Ders" : "Previous Lesson"}
              </button>

              <button
                type="button"
                onClick={handleNextLesson}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
              >
                <span>
                  {currentLessonIdx < level.learnLessons.length - 1
                    ? isTr
                      ? "Dersi Tamamla ve İlerle"
                      : "Complete & Next Lesson"
                    : isTr
                    ? "Öğrenmeyi Tamamla: Alıştırmalara Geç"
                    : "Complete Learn: Go to Practice"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PRACTICE */}
      {activeStage === "practice" && activePractice && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Practice Ribbon Selector */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border">
            <span className="text-xs font-mono font-bold text-accent">
              {isTr ? "Alıştırma" : "Practice Challenge"} {currentPracticeIdx + 1}/
              {level.practiceExercises.length}
            </span>

            <div className="flex items-center gap-1.5">
              {level.practiceExercises.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCurrentPracticeIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    i === currentPracticeIdx
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : levelProgress.practiceCompleted.includes(p.id)
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-300"
                      : "bg-surface-secondary text-foreground-muted hover:bg-surface-secondary/80"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <FinancialExerciseRenderer
            exercise={activePractice}
            onCompleted={(res) => handlePracticeExerciseComplete(activePractice.id)}
          />

          {/* Navigation Between Practice Exercises */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentPracticeIdx === 0}
              onClick={() => setCurrentPracticeIdx(currentPracticeIdx - 1)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground-secondary hover:text-foreground disabled:opacity-40"
            >
              {isTr ? "Önceki Alıştırma" : "Previous Challenge"}
            </button>

            {currentPracticeIdx < level.practiceExercises.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentPracticeIdx(currentPracticeIdx + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-secondary font-bold text-xs"
              >
                <span>{isTr ? "Sonraki Alıştırma" : "Next Challenge"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveStage("solve")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs"
              >
                <span>{isTr ? "Çöz Aşamasına Geç" : "Proceed to Solve"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: SOLVE */}
      {activeStage === "solve" && activeSolve && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Solve Ribbon Selector */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border">
            <span className="text-xs font-mono font-bold text-accent">
              {isTr ? "İş Senaryosu" : "Business Scenario"} {currentSolveIdx + 1}/
              {level.solveExercises.length}
            </span>

            <div className="flex items-center gap-1.5">
              {level.solveExercises.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSolveIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    i === currentSolveIdx
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : levelProgress.solveCompleted.includes(s.id)
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-300"
                      : "bg-surface-secondary text-foreground-muted hover:bg-surface-secondary/80"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <FinancialExerciseRenderer
            exercise={activeSolve}
            onCompleted={(res) => handleSolveExerciseComplete(activeSolve.id)}
          />

          {/* Navigation Between Solve Exercises */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentSolveIdx === 0}
              onClick={() => setCurrentSolveIdx(currentSolveIdx - 1)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground-secondary hover:text-foreground disabled:opacity-40"
            >
              {isTr ? "Önceki Senaryo" : "Previous Case"}
            </button>

            {currentSolveIdx < level.solveExercises.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSolveIdx(currentSolveIdx + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-secondary font-bold text-xs"
              >
                <span>{isTr ? "Sonraki Senaryo" : "Next Case"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveStage("test")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs"
              >
                <span>{isTr ? "Sınav Testine Geç" : "Proceed to Test"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STAGE 4: TEST */}
      {activeStage === "test" && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="p-6 sm:p-7 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-accent uppercase">
                  {isTr ? "Kapsamlı Değerlendirme Testi" : "Comprehensive Evaluation Test"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
                  {isTr ? "Finansal Tablolar Sınavı" : "Financial Statement Exam"}
                </h2>
              </div>

              {testSubmitted && (
                <div className="flex items-center gap-2 font-mono text-sm px-4 py-1.5 rounded-xl bg-surface-secondary border border-border">
                  <span>Score:</span>
                  <strong
                    className={`font-bold text-base ${
                      testScore >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {testScore}%
                  </strong>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              {isTr
                ? "10 soru: Çoktan seçmeli sorular, formül seçimi, hata ayıklama ve model bağlantı testleri."
                : "10 Questions: Multiple choice, formula selection, model debugging, and statement linking."}
            </p>
          </div>

          {/* Questions List */}
          <div className="flex flex-col gap-4">
            {level.testQuestions.map((q, qIdx) => {
              const selectedOpt = testAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;
              const options = isTr ? q.optionsTr : q.optionsEn;

              return (
                <div
                  key={q.id}
                  className="p-5 sm:p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-accent/10 text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {isTr ? q.questionTr : q.questionEn}
                      </h4>
                    </div>

                    {testSubmitted && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={testSubmitted}
                          onClick={() => handleSelectTestOption(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-3 cursor-pointer ${
                            testSubmitted
                              ? optIdx === q.correctIndex
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                                : isSelected
                                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200"
                                : "bg-surface/50 border-border opacity-60 text-foreground-muted"
                              : isSelected
                              ? "bg-accent/10 border-accent text-accent font-bold"
                              : "bg-surface border-border hover:bg-surface-secondary/50 text-foreground"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono">
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {testSubmitted && (
                    <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground-secondary leading-relaxed">
                      <strong className="text-accent font-mono text-[11px] block mb-0.5">
                        {isTr ? "Açıklama:" : "Explanation:"}
                      </strong>
                      {isTr ? q.explanationTr : q.explanationEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Submit / Retry Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!testSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitTest}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>{isTr ? "Testi Gönder ve Değerlendir" : "Submit Test Answers"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTestSubmitted(false);
                    setTestAnswers({});
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-surface-secondary"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isTr ? "Tekrar Dene" : "Retake Test"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStage("project")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm"
                >
                  <span>{isTr ? "Bitirme Projesine Geç" : "Proceed to Capstone Project"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 5: PROJECT */}
      {activeStage === "project" && (
        <NordicRetailProject
          project={level.project}
          onProjectCompleted={handleProjectComplete}
        />
      )}
    </div>
  );
};
