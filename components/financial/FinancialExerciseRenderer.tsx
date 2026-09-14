"use client";

import React, { useState, useEffect } from "react";
import { FinancialExercise, FinancialExerciseResult } from "@/lib/financial/types";
import { FinancialEvaluator } from "@/lib/financial/evaluator";
import { ExcelGrid } from "../excel/ExcelGrid";
import { FormulaBar } from "../excel/FormulaBar";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface FinancialExerciseRendererProps {
  exercise: FinancialExercise;
  onCompleted: (result: FinancialExerciseResult) => void;
}

export const FinancialExerciseRenderer: React.FC<FinancialExerciseRendererProps> = ({
  exercise,
  onCompleted,
}) => {
  const { interfaceLocale } = useI18n();
  const isTr = interfaceLocale === "tr";

  const [formula, setFormula] = useState(exercise.initialFormula || "");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<FinancialExerciseResult | null>(null);
  const [hintLevel, setHintLevel] = useState(0);

  useEffect(() => {
    setFormula(exercise.initialFormula || "");
    setSelectedOption(null);
    setResult(null);
    setHintLevel(0);
  }, [exercise.id]);

  const isFormulaType =
    exercise.type === "build_formula" ||
    exercise.type === "formula_debugging" ||
    exercise.type === "model_linking";

  const handleEvaluateFormula = () => {
    if (!formula.trim()) return;

    const evalRes = FinancialEvaluator.evaluate(formula, exercise);
    setResult(evalRes);

    if (evalRes.financialLogicCorrect && evalRes.modelUpdatesDynamically) {
      onCompleted(evalRes);
    }
  };

  const handleEvaluateOption = (idx: number) => {
    setSelectedOption(idx);
    const isCorrect = idx === exercise.correctOptionIndex;

    const optRes: FinancialExerciseResult = {
      outputCorrect: isCorrect,
      formulaValid: true,
      dependenciesValid: true,
      containsHardcode: false,
      modelUpdatesDynamically: true,
      financialLogicCorrect: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: {
        en: isCorrect
          ? "Correct! You selected the optimal financial modeling driver."
          : "Incorrect driver selection. Review the financial context and try again.",
        tr: isCorrect
          ? "Doğru! En uygun finansal modelleme sürücüsünü seçtiniz."
          : "Hatalı sürücü seçimi. Finansal bağlamı inceleyip tekrar deneyin.",
      },
    };

    setResult(optRes);
    if (isCorrect) {
      onCompleted(optRes);
    }
  };

  const options = isTr ? exercise.optionsTr : exercise.optionsEn;
  const hints = isTr ? exercise.hintsTr : exercise.hintsEn;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Exercise Header & Context */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-accent/10 text-accent uppercase tracking-wider">
              {exercise.statementContext || "Financial Modeling"}
            </span>
            <span className="text-xs font-mono text-foreground-muted uppercase">
              {exercise.type.replace(/_/g, " ")}
            </span>
          </div>

          {result && (
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-foreground-muted">Score:</span>
              <strong
                className={`font-bold ${
                  result.score >= 80
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {result.score}/100
              </strong>
            </div>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-foreground">
          {isTr ? exercise.titleTr : exercise.titleEn}
        </h3>

        <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
          {isTr ? exercise.taskTr : exercise.taskEn}
        </p>

        <div className="p-3.5 rounded-xl bg-surface-secondary/50 border border-border/80 text-xs text-foreground-muted flex items-start gap-2.5">
          <TrendingUp className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {isTr ? exercise.contextTr : exercise.contextEn}
          </span>
        </div>
      </div>

      {/* Main Interactive Area */}
      {isFormulaType && exercise.dataset ? (
        <div className="flex flex-col gap-4">
          {/* Formula Bar */}
          <FormulaBar
            value={formula}
            onChange={setFormula}
            onSubmit={handleEvaluateFormula}
            disabled={result?.financialLogicCorrect && result?.modelUpdatesDynamically}
          />

          {/* Interactive Spreadsheet Grid */}
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
            <ExcelGrid
              dataset={exercise.dataset}
              maxHeight="260px"
              title={isTr ? "Finansal Çalışma Sayfası" : "Financial Worksheet"}
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHintLevel((prev) => Math.min(hints.length, prev + 1))}
                disabled={hintLevel >= hints.length}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {isTr ? "İpucu Al" : "Need Hint"} ({hintLevel}/{hints.length})
                </span>
              </button>

              {result && (
                <button
                  type="button"
                  onClick={() => {
                    setFormula(exercise.initialFormula || "");
                    setResult(null);
                  }}
                  className="p-2 rounded-xl border border-border text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleEvaluateFormula}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isTr ? "Formülü Kontrol Et" : "Check Formula"}</span>
            </button>
          </div>
        </div>
      ) : options && options.length > 0 ? (
        /* Multiple-Choice / Driver Selection View */
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-foreground-muted font-bold">
            {isTr ? "Seçenekler" : "Available Drivers"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === exercise.correctOptionIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleEvaluateOption(idx)}
                  className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? isCorrectOpt
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-100"
                        : "bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-100"
                      : "bg-surface border-border hover:border-accent hover:bg-surface-secondary/50 text-foreground"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1 leading-relaxed">{opt}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Revealed Hints */}
      {hintLevel > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Lightbulb className="w-4 h-4" />
            <span>{isTr ? "İpuçları" : "Progressive Hints"}</span>
          </div>
          {hints.slice(0, hintLevel).map((h, i) => (
            <p
              key={i}
              className="text-xs text-amber-900 dark:text-amber-200 pl-4 border-l-2 border-amber-400"
            >
              {h}
            </p>
          ))}
        </div>
      )}

      {/* Real-time Comprehensive Financial Evaluation Badges */}
      {result && (
        <div
          className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-4 animate-slide-up ${
            result.financialLogicCorrect && result.modelUpdatesDynamically
              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
              : "bg-surface border-border"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {result.financialLogicCorrect && result.modelUpdatesDynamically ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <h4 className="text-sm font-bold text-foreground">
                {result.financialLogicCorrect && result.modelUpdatesDynamically
                  ? isTr
                    ? "Alıştırma Başarıyla Tamamlandı!"
                    : "Exercise Successfully Validated!"
                  : isTr
                  ? "Model Doğrulama Uyarısı"
                  : "Model Validation Feedback"}
              </h4>
            </div>

            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface border border-border">
              {result.score}/100 pts
            </span>
          </div>

          <p className="text-xs text-foreground-secondary leading-relaxed">
            {isTr ? result.feedback.tr : result.feedback.en}
          </p>

          {/* Institutional Model Integrity Criteria Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/80 text-[11px] font-mono">
            {/* 1. Output Correctness */}
            <div className="p-2.5 rounded-lg bg-surface-secondary/60 flex flex-col gap-1">
              <span className="text-foreground-muted text-[10px] uppercase">
                {isTr ? "Sonuç Doğruluğu" : "Output Check"}
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  result.outputCorrect
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {result.outputCorrect ? "✓ Valid" : "✗ Mismatch"}
              </span>
            </div>

            {/* 2. Dependency Checking */}
            <div className="p-2.5 rounded-lg bg-surface-secondary/60 flex flex-col gap-1">
              <span className="text-foreground-muted text-[10px] uppercase">
                {isTr ? "Hücre Referansları" : "Dependencies"}
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  result.dependenciesValid
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {result.dependenciesValid ? "✓ Linked" : "✗ Broken"}
              </span>
            </div>

            {/* 3. Anti-Hardcoding */}
            <div className="p-2.5 rounded-lg bg-surface-secondary/60 flex flex-col gap-1">
              <span className="text-foreground-muted text-[10px] uppercase">
                {isTr ? "Sabit Sayı Kuralı" : "Anti-Hardcode"}
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  !result.containsHardcode
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {!result.containsHardcode ? "✓ Dynamic" : "⚠ Hardcoded"}
              </span>
            </div>

            {/* 4. Scenario Sensitivity */}
            <div className="p-2.5 rounded-lg bg-surface-secondary/60 flex flex-col gap-1">
              <span className="text-foreground-muted text-[10px] uppercase">
                {isTr ? "Dinamik Duyarlılık" : "Sensitivity"}
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  result.modelUpdatesDynamically
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {result.modelUpdatesDynamically ? "✓ Responsive" : "✗ Static"}
              </span>
            </div>
          </div>

          {/* Professional Financial Logic Takeaway */}
          {result.financialLogicCorrect && (
            <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-foreground flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <strong className="font-bold text-accent">
                  {isTr ? "Finansal Analist Notu" : "Financial Analyst Insight"}
                </strong>
                <span className="text-foreground-secondary leading-relaxed">
                  {isTr ? exercise.explanationTr : exercise.explanationEn}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
