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

  const learn = topic.learn;
  const problem = interfaceLocale === "tr" ? learn.problemTr : learn.problemEn;
  const reasoningQuestion =
    interfaceLocale === "tr" ? learn.reasoningQuestionTr : learn.reasoningQuestionEn;
  const reasoningSteps =
    interfaceLocale === "tr" ? learn.reasoningStepsTr : learn.reasoningStepsEn;
  const exampleFormula =
    resolvedFormulaLocale === "tr" ? learn.exampleFormulaTr : learn.exampleFormulaEn;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">
      {/* 1. Problem Statement Section */}
      <div className="p-5 sm:p-6 rounded-xl bg-surface border border-border shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-accent">
          <Lightbulb className="w-4 h-4" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            {t.learnStage.problemTitle}
          </span>
        </div>
        <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
          {problem}
        </p>
      </div>

      {/* 2. Miniature Excel Worksheet Dataset */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
          {t.learnStage.datasetTitle}
        </span>
        <ExcelGrid
          dataset={learn.dataset}
          highlightColumnLetter={highlightedCol}
          maxHeight="220px"
          title={`${topic.canonicalFunction} Reference Data`}
        />
      </div>

      {/* 3. Concept Breakdown & Observation */}
      <div className="p-5 sm:p-6 rounded-xl bg-surface-secondary/40 border border-border flex flex-col gap-4">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span>{reasoningQuestion}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {reasoningSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-surface border border-border/80 text-xs text-foreground-secondary leading-relaxed flex items-start gap-2.5 shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-accent/10 text-accent font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <p className="pt-0.5">{step}</p>
            </div>
          ))}
        </div>

        {/* Reveal Formula Action */}
        {!revealed ? (
          <div className="pt-2 flex justify-start">
            <button
              onClick={() => setRevealed(true)}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-secondary text-accent font-semibold text-xs rounded-lg border border-accent/40 shadow-xs transition-all hover:border-accent cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{t.learnStage.showFormula}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-2 animate-slide-up">
            {/* Interactive Formula Anatomy */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
                {t.learnStage.syntaxTitle}
              </span>
              <FormulaAnatomy
                formula={exampleFormula}
                parts={learn.anatomy}
                onHoverColumn={(col) => setHighlightedCol(col)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Mini Concept Check (Section 16 Spec) */}
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
              {interfaceLocale === "tr"
                ? `Hücre referansları formüllere dinamik güç katar: Hücredeki değer değiştiğinde formül sonucu otomatik güncellenir.`
                : `Cell references make formulas dynamic: when data in the sheet updates, formula calculations recalculate automatically.`}
            </p>
          </div>
        )}
      </div>

      {/* 5. Action Button: Proceed to Practice */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all cursor-pointer hover:translate-x-0.5"
        >
          <span>{t.learnStage.readyForPractice}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
