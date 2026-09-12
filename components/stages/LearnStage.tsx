"use client";

import React, { useState } from "react";
import { TopicContent } from "@/lib/content/types";
import { ExcelGrid } from "../excel/ExcelGrid";
import { FormulaAnatomy } from "../excel/FormulaAnatomy";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  Lightbulb,
  ArrowRight,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Keyboard,
  BookOpen,
  Check,
} from "lucide-react";

interface LearnStageProps {
  topic: TopicContent;
  onComplete: () => void;
}

export const LearnStage: React.FC<LearnStageProps> = ({ topic, onComplete }) => {
  const { interfaceLocale, resolvedFormulaLocale, t } = useI18n();
  const [revealed, setRevealed] = useState(false);
  const [highlightedCol, setHighlightedCol] = useState<string | null>(null);
  const [showConceptCheck, setShowConceptCheck] = useState(false);

  // Quick check state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedCheck, setHasSubmittedCheck] = useState(false);

  const learn = topic.learn;
  const isTr = interfaceLocale === "tr";

  const problem = isTr ? learn.problemTr : learn.problemEn;
  const overview = isTr ? learn.overviewTr : learn.overviewEn;
  const reasoningQuestion = isTr ? learn.reasoningQuestionTr : learn.reasoningQuestionEn;
  const reasoningSteps = isTr ? learn.reasoningStepsTr : learn.reasoningStepsEn;
  const rules = isTr ? learn.rulesTr : learn.rulesEn;
  const exampleFormula =
    resolvedFormulaLocale === "tr" ? learn.exampleFormulaTr : learn.exampleFormulaEn;

  const quickCheck = learn.quickCheck;
  const quickQuestion = quickCheck ? (isTr ? quickCheck.questionTr : quickCheck.questionEn) : null;
  const quickOptions = quickCheck ? (isTr ? quickCheck.optionsTr : quickCheck.optionsEn) : [];
  const quickExplanation = quickCheck ? (isTr ? quickCheck.explanationTr : quickCheck.explanationEn) : null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl pb-12">
      {/* 1. Problem Statement & Conceptual Overview */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-accent">
            <BookOpen className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {isTr ? "1. Senaryo & Öğrenme Amacı" : "1. Scenario & Learning Goal"}
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
            {topic.canonicalFunction}
          </span>
        </div>

        <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {problem}
        </p>

        {overview && (
          <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground-secondary leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-foreground text-xs font-mono uppercase tracking-wide">
                {isTr ? "Neden Önemli?" : "Why This Matters"}
              </span>
              <p>{overview}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Miniature Excel Worksheet Dataset */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <span>{t.learnStage.datasetTitle}</span>
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">
            {isTr ? "Sütunların üzerine gelerek bağlantıyı görün" : "Hover columns to inspect mapping"}
          </span>
        </div>
        <ExcelGrid
          dataset={learn.dataset}
          highlightColumnLetter={highlightedCol}
          maxHeight="240px"
          title={`${topic.canonicalFunction} Reference Data`}
        />
      </div>

      {/* 3. Concept Breakdown & Step-by-Step Logic */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-5">
        <div className="flex items-center gap-2 text-accent border-b border-border/60 pb-3">
          <Lightbulb className="w-4 h-4" />
          <h4 className="text-sm font-bold text-foreground">
            {reasoningQuestion}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {reasoningSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-secondary/40 border border-border/80 text-xs text-foreground-secondary leading-relaxed flex flex-col gap-2 shadow-2xs hover:border-accent/40 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-accent/15 text-accent font-bold font-mono text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <p className="text-foreground-secondary font-medium">{step}</p>
            </div>
          ))}
        </div>

        {/* Reveal Formula Action & Interactive Anatomy */}
        {!revealed ? (
          <div className="pt-2 flex justify-start">
            <button
              onClick={() => setRevealed(true)}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 text-accent font-bold text-xs rounded-xl border border-accent/40 shadow-xs transition-all hover:border-accent cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{t.learnStage.showFormula}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2 animate-slide-up border-t border-border/60">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent pt-2">
              {t.learnStage.syntaxTitle}
            </span>
            <FormulaAnatomy
              formula={exampleFormula}
              parts={learn.anatomy}
              onHoverColumn={(col) => setHighlightedCol(col)}
            />
          </div>
        )}
      </div>

      {/* 4. Core Rules & Mental Model (If available) */}
      {rules && rules.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {isTr ? "Temel Kurallar & Mantık Çerçevesi" : "Core Rules & Mental Model"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-foreground-secondary leading-relaxed flex items-start gap-2.5"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <p className="font-medium">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Common Mistakes & Traps (If available) */}
      {learn.commonMistakes && learn.commonMistakes.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {isTr ? "Sık Yapılan Hatalar & Çözümleri" : "Common Mistakes & How to Fix Them"}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {learn.commonMistakes.map((mistake, idx) => {
              const explanation = isTr ? mistake.explanationTr : mistake.explanationEn;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold line-through">
                        {mistake.wrongFormula}
                      </span>
                      <span className="text-xs text-rose-500 font-semibold">
                        {isTr ? "Hatalı Yaklaşım" : "Wrong Approach"}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-secondary leading-relaxed">
                      {explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:border-l md:border-rose-500/20 md:pl-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        {isTr ? "Doğru Formül:" : "Correct Formula:"}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                        {mistake.correction}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Pro Tips & Shortcuts (If available) */}
      {learn.proTips && learn.proTips.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {isTr ? "İş Hayatından Pro İpuçları & Kısayollar" : "Pro Tips & Keyboard Shortcuts"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {learn.proTips.map((tip, idx) => {
              const title = isTr ? tip.titleTr : tip.titleEn;
              const desc = isTr ? tip.descTr : tip.descEn;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {title}
                    </span>
                    {tip.shortcut && (
                      <span className="px-2 py-0.5 rounded bg-surface border border-border font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 shadow-2xs flex items-center gap-1">
                        <Keyboard className="w-3 h-3" />
                        {tip.shortcut}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Interactive Quick Comprehension Check (If available) */}
      {quickCheck && quickQuestion && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-accent">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {isTr ? "Hızlı Kavrama Kontrolü" : "Quick Concept Check"}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-foreground">
            {quickQuestion}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {quickOptions.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === quickCheck.correctOptionIndex;
              const showResult = hasSubmittedCheck;

              let btnStyle = "bg-surface-secondary/40 border-border hover:border-accent/40 text-foreground";
              if (showResult) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-500/15 border-rose-500/40 text-rose-500 line-through";
                }
              } else if (isSelected) {
                btnStyle = "bg-accent/15 border-accent text-accent font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedOption(idx);
                    setHasSubmittedCheck(true);
                  }}
                  type="button"
                  className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {showResult && isCorrect && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {hasSubmittedCheck && quickExplanation && (
            <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-foreground-secondary leading-relaxed animate-fade-in flex items-start gap-2">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p>
                <strong className="text-foreground">
                  {selectedOption === quickCheck.correctOptionIndex
                    ? (isTr ? "Harika! " : "Correct! ")
                    : (isTr ? "İpucu: " : "Explanation: ")}
                </strong>
                {quickExplanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fallback Legacy Mini Concept Check if quickCheck not present */}
      {!quickCheck && (
        <div className="p-4 rounded-xl bg-surface border border-border shadow-xs flex flex-col gap-3">
          <button
            onClick={() => setShowConceptCheck(!showConceptCheck)}
            type="button"
            className="flex items-center justify-between text-xs font-bold text-foreground-secondary hover:text-foreground cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              <span className="font-mono uppercase tracking-wider text-[11px] text-accent">
                {t.learnStage.conceptCheckTitle}
              </span>
            </div>
            {showConceptCheck ? (
              <ChevronUp className="w-4 h-4 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-foreground-muted" />
            )}
          </button>

          {showConceptCheck && (
            <div className="pt-2 border-t border-border/80 text-xs text-foreground-secondary leading-relaxed animate-fade-in flex flex-col gap-2">
              <p className="font-medium text-foreground">
                {isTr
                  ? `Excel formülleri dinamik güç katar: Kaynak hücredeki değer değiştiğinde formül sonucu otomatik olarak yeniden hesaplanır.`
                  : `Excel formulas provide dynamic power: when referenced data changes, calculations update automatically.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 8. Action Button: Proceed to Practice */}
      <div className="flex items-center justify-between pt-2 border-t border-border/80">
        <span className="text-xs text-foreground-muted">
          {isTr ? "Konuyu kavradıysanız pratik alıştırmalara geçebilirsiniz." : "Ready to test your hands-on skills in practice?"}
        </span>
        <button
          onClick={onComplete}
          type="button"
          className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer hover:translate-x-1"
        >
          <span>{t.learnStage.readyForPractice}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
