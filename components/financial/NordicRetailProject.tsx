"use client";

import React, { useState } from "react";
import { FinancialProject } from "@/lib/financial/types";
import { useI18n } from "@/lib/i18n/I18nContext";
import { FormulaEvaluator } from "@/lib/formula/evaluator";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Trophy,
  Sparkles,
  HelpCircle,
  RotateCcw,
} from "lucide-react";

interface NordicRetailProjectProps {
  project: FinancialProject;
  onProjectCompleted: (score: number) => void;
}

export const NordicRetailProject: React.FC<NordicRetailProjectProps> = ({
  project,
  onProjectCompleted,
}) => {
  const { interfaceLocale } = useI18n();
  const isTr = interfaceLocale === "tr";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Step 1 State: Account Classifications
  const [classifications, setClassifications] = useState<Record<string, string>>({});
  const [step1Error, setStep1Error] = useState(false);

  // Step 2 State: Formula / Number entry
  const [step2Revenue, setStep2Revenue] = useState("");
  const [step2GrossProfit, setStep2GrossProfit] = useState("");
  const [step2Feedback, setStep2Feedback] = useState<string | null>(null);

  // Step 3 State: Retained Earnings
  const [step3RE, setStep3RE] = useState("");
  const [step3Feedback, setStep3Feedback] = useState<string | null>(null);

  // Step 4 State: Balance Check
  const [step4Check, setStep4Check] = useState("");
  const [step4Feedback, setStep4Feedback] = useState<string | null>(null);

  // Step 5 State: Final Interpretation
  const [selectedInterpretation, setSelectedInterpretation] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Completed steps tracker
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Handlers
  const handleClassify = (itemId: string, statement: string) => {
    setClassifications((prev) => ({ ...prev, [itemId]: statement }));
    setStep1Error(false);
  };

  const validateStep1 = () => {
    const items = project.classificationItems || [];
    const allAnswered = items.every((it) => classifications[it.id]);
    if (!allAnswered) {
      setStep1Error(true);
      return;
    }

    const allCorrect = items.every((it) => classifications[it.id] === it.correctStatement);
    if (allCorrect) {
      if (!completedSteps.includes(1)) setCompletedSteps([...completedSteps, 1]);
      setCurrentStepIndex(1);
    } else {
      setStep1Error(true);
    }
  };

  const parseFinancialInput = (val: string): number => {
    if (!val) return NaN;
    let cleaned = val.replace(/[$€₺TL]/gi, "").trim();

    // If student entered an Excel formula or arithmetic expression (e.g. =1000000*1.15 or 1150000-690000)
    if (cleaned.startsWith("=") || /[+*\/^-]/.test(cleaned)) {
      const formulaStr = cleaned.startsWith("=") ? cleaned : `=${cleaned}`;
      const evalRes = FormulaEvaluator.evaluate(formulaStr, { columns: [], rows: [] });
      if (evalRes.success && typeof evalRes.value === "number" && !isNaN(evalRes.value)) {
        return evalRes.value;
      }
    }

    // Turkish thousand separator with dot: 1.150.000 or 1.150.000,00
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      cleaned = cleaned.replace(/,/g, "");
    }
    return parseFloat(cleaned);
  };

  const validateStep2 = () => {
    // 2024 Revenue is 1,000,000, Growth is 15% -> 2025 Revenue = 1,150,000
    // COGS is 60% = 690,000 -> Gross Profit = 460,000 (or 1150000 - 690000)
    const revNum = parseFinancialInput(step2Revenue);
    const gpNum = parseFinancialInput(step2GrossProfit);

    if (revNum === 1150000 && (gpNum === 460000 || gpNum === 1150000 - 690000)) {
      setStep2Feedback(null);
      if (!completedSteps.includes(2)) setCompletedSteps([...completedSteps, 2]);
      setCurrentStepIndex(2);
    } else {
      setStep2Feedback(
        isTr
          ? "Hatalı hesaplama. Hasılat: 1.000.000 * (1 + 0.15) = 1.150.000 TL; Brüt Kâr: 1.150.000 - 690.000 = 460.000 TL olmalıdır."
          : "Calculation error. Revenue: 1,000,000 * 1.15 = $1,150,000; Gross Profit: $1,150,000 - $690,000 = $460,000."
      );
    }
  };

  const validateStep3 = () => {
    // Beginning RE ($210,000) + Net Income ($147,000) - Dividends ($35,000) = 322,000
    const reNum = parseFinancialInput(step3RE);
    if (reNum === 322000) {
      setStep3Feedback(null);
      if (!completedSteps.includes(3)) setCompletedSteps([...completedSteps, 3]);
      setCurrentStepIndex(3);
    } else {
      setStep3Feedback(
        isTr
          ? "Hatalı devir tutarı. Formül: 210.000 + 147.000 - 35.000 = 322.000 TL."
          : "Incorrect roll-forward. Formula: 210,000 + 147,000 - 35,000 = $322,000."
      );
    }
  };

  const validateStep4 = () => {
    // Assets ($850,000) - Liabilities ($228,000) - Equity ($622,000) = 0
    const checkNum = parseFinancialInput(step4Check);
    if (checkNum === 0) {
      setStep4Feedback(null);
      if (!completedSteps.includes(4)) setCompletedSteps([...completedSteps, 4]);
      setCurrentStepIndex(4);
    } else {
      setStep4Feedback(
        isTr
          ? "Bilanço denkleşmedi! 850.000 - (228.000 + 622.000) tam 0 olmalıdır."
          : "Balance sheet does not balance! 850,000 - (228,000 + 622,000) must equal exactly 0."
      );
    }
  };

  const validateStep5 = (idx: number) => {
    setSelectedInterpretation(idx);
    if (idx === 0) {
      setIsCompleted(true);
      if (!completedSteps.includes(5)) setCompletedSteps([...completedSteps, 5]);
      onProjectCompleted(100);
    }
  };

  const steps = project.steps;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Project Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>{isTr ? "Bitirme Mini Projesi" : "Capstone Mini Project"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-foreground-muted">
              {isTr ? "İlerleme" : "Progress"}:
            </span>
            <strong className="font-mono text-xs text-accent">
              {completedSteps.length}/{steps.length} {isTr ? "Adım" : "Steps"}
            </strong>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            {isTr ? project.titleTr : project.titleEn}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs font-mono text-foreground-muted">
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <span>{project.companyName}</span>
            <span>•</span>
            <span>{isTr ? project.industryTr : project.industryEn}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
          {isTr ? project.scenarioTr : project.scenarioEn}
        </p>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 gap-2 pt-2 border-t border-border/70">
          {steps.map((st, i) => {
            const isDone = completedSteps.includes(i + 1);
            const isCurrent = currentStepIndex === i;

            return (
              <button
                key={st.stepId}
                type="button"
                onClick={() => setCurrentStepIndex(i)}
                className={`py-2 px-1 rounded-lg text-center text-xs font-mono transition-all cursor-pointer ${
                  isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800"
                    : isCurrent
                    ? "bg-accent/10 text-accent font-bold border border-accent"
                    : "bg-surface-secondary text-foreground-muted hover:bg-surface-secondary/80"
                }`}
              >
                <div className="truncate">
                  {isDone ? "✓" : `${i + 1}.`} {isTr ? `Adım ${i + 1}` : `Step ${i + 1}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      {!isCompleted ? (
        <div className="p-6 sm:p-7 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-accent uppercase">
                {isTr ? `Adım ${currentStepIndex + 1}` : `Step ${currentStepIndex + 1}`}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
                {isTr ? steps[currentStepIndex].titleTr : steps[currentStepIndex].titleEn}
              </h3>
            </div>
            <span className="text-xs font-mono text-foreground-muted">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            {isTr ? steps[currentStepIndex].instructionTr : steps[currentStepIndex].instructionEn}
          </p>

          {/* STEP 1: Classification */}
          {currentStepIndex === 0 && project.classificationItems && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.classificationItems.map((item) => {
                  const val = classifications[item.id] || "";

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {isTr ? item.accountTr : item.accountEn}
                        </span>
                        <span className="text-xs font-mono text-foreground-muted">
                          ${item.amount.toLocaleString()}
                        </span>
                      </div>

                      <select
                        value={val}
                        onChange={(e) => handleClassify(item.id, e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-border bg-surface text-foreground focus:ring-1 focus:ring-accent"
                      >
                        <option value="">{isTr ? "-- Tablo Seçin --" : "-- Select Statement --"}</option>
                        <option value="income_statement">
                          {isTr ? "Gelir Tablosu (P&L)" : "Income Statement (P&L)"}
                        </option>
                        <option value="balance_sheet">
                          {isTr ? "Bilanço (Balance Sheet)" : "Balance Sheet"}
                        </option>
                        <option value="cash_flow">
                          {isTr ? "Nakit Akış Tablosu (Cash Flow)" : "Cash Flow Statement"}
                        </option>
                      </select>
                    </div>
                  );
                })}
              </div>

              {step1Error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {isTr
                      ? "Bazı hesaplar yanlış sınıflandırıldı veya boş bırakıldı. Lütfen kontrol edin."
                      : "Some accounts were classified incorrectly or left unselected. Please review."}
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={validateStep1}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>{isTr ? "Doğrula ve İlerle" : "Validate & Proceed"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Revenue & Gross Profit Forecast */}
          {currentStepIndex === 1 && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span>2024 Actual Revenue:</span>
                  <strong>$1,000,000</strong>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>2025 Growth Rate Assumption:</span>
                  <strong>15% (+0.15)</strong>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>2025 COGS Assumption:</span>
                  <strong>$690,000</strong>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">
                  {isTr ? "2025 Tahmini Satış Hasılatı ($)" : "2025 Forecasted Revenue ($)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1150000"
                  value={step2Revenue}
                  onChange={(e) => setStep2Revenue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") validateStep2();
                  }}
                  className="p-2.5 rounded-xl border border-border bg-surface text-foreground font-mono text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">
                  {isTr ? "2025 Brüt Kâr ($)" : "2025 Gross Profit ($)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 460000"
                  value={step2GrossProfit}
                  onChange={(e) => setStep2GrossProfit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") validateStep2();
                  }}
                  className="p-2.5 rounded-xl border border-border bg-surface text-foreground font-mono text-sm"
                />
              </div>

              {step2Feedback && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{step2Feedback}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={validateStep2}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>{isTr ? "Hesaplamayı Onayla" : "Confirm Calculation"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Retained Earnings Roll-Forward */}
          {currentStepIndex === 2 && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Beginning Retained Earnings:</span>
                  <strong>$210,000</strong>
                </div>
                <div className="flex justify-between">
                  <span>+ FY2025 Net Income:</span>
                  <strong>$147,000</strong>
                </div>
                <div className="flex justify-between">
                  <span>- FY2025 Dividends Paid:</span>
                  <strong>$35,000</strong>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">
                  {isTr ? "Dönem Sonu Dağıtılmamış Kârlar ($)" : "Ending Retained Earnings ($)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 322000"
                  value={step3RE}
                  onChange={(e) => setStep3RE(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") validateStep3();
                  }}
                  className="p-2.5 rounded-xl border border-border bg-surface text-foreground font-mono text-sm"
                />
              </div>

              {step3Feedback && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{step3Feedback}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={validateStep3}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>{isTr ? "Devir Tutarını Onayla" : "Confirm Roll-Forward"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Balance Check */}
          {currentStepIndex === 3 && (
            <div className="flex flex-col gap-4 max-w-xl">
              <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Total Assets:</span>
                  <strong>$850,000</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Liabilities:</span>
                  <strong>$228,000</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Equity:</span>
                  <strong>$622,000</strong>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">
                  {isTr ? "Bilanço Denge Farkı (Aktif - Pasif)" : "Balance Check Delta (Assets - Liabilities - Equity)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0"
                  value={step4Check}
                  onChange={(e) => setStep4Check(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") validateStep4();
                  }}
                  className="p-2.5 rounded-xl border border-border bg-surface text-foreground font-mono text-sm"
                />
              </div>

              {step4Feedback && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{step4Feedback}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={validateStep4}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>{isTr ? "Denkliği Onayla" : "Confirm Equilibrium"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Executive Financial Interpretation */}
          {currentStepIndex === 4 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3">
                {steps[4].optionsEn?.map((opt, i) => {
                  const isSelected = selectedInterpretation === i;
                  const isCorrect = i === steps[4].correctOptionIndex;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => validateStep5(i)}
                      className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? isCorrect
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100"
                            : "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100"
                          : "bg-surface border-border hover:border-accent text-foreground"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="leading-relaxed">
                        {isTr ? steps[4].optionsTr?.[i] : opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Capstone Success & Certificate Card */
        <div className="p-8 rounded-3xl bg-surface border border-emerald-400 dark:border-emerald-800 shadow-xl flex flex-col items-center text-center gap-5 animate-scale-up">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {isTr ? "Tebrikler! Seviye 1 Projesi Tamamlandı" : "Level 1 Capstone Completed"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground">
              {isTr ? "Finansal Tablo Temelleri Sertifikalandı" : "Financial Statement Foundations Certified"}
            </h3>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed mt-1">
              {isTr
                ? "Nordic Retail Co. 3 tablolu modelini başarıyla inşa ettiniz, hesapları sınıflandırdınız, dağıtılmamış kârları devrettiniz ve bilanço denkliğini sağladınız."
                : "You successfully built the Nordic Retail Co. 3-statement model, classified trial balances, rolled forward retained earnings, and verified balance sheet equilibrium."}
            </p>
          </div>

          <div className="flex items-center gap-6 py-3 px-8 rounded-2xl bg-surface-secondary/70 border border-border font-mono text-xs">
            <div className="flex flex-col items-center">
              <span className="text-foreground-muted text-[10px] uppercase">Score</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-base font-bold">100/100</strong>
            </div>
            <span className="text-border-strong">|</span>
            <div className="flex flex-col items-center">
              <span className="text-foreground-muted text-[10px] uppercase">Status</span>
              <strong className="text-accent text-base font-bold">MASTERED</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
