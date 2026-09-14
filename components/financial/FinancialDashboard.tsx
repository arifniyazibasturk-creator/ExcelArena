"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FINANCIAL_LEVELS } from "@/lib/financial/levels";
import {
  financialProgressService,
  DEFAULT_FINANCIAL_STATS,
  getDefaultLevelProgress,
} from "@/lib/services/financialProgress";
import { FinancialStats } from "@/lib/financial/types";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Play,
  Building2,
  TrendingUp,
} from "lucide-react";

export const FinancialDashboard: React.FC = () => {
  const router = useRouter();
  const { interfaceLocale } = useI18n();
  const isTr = interfaceLocale === "tr";

  const [stats, setStats] = useState<FinancialStats>(DEFAULT_FINANCIAL_STATS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats({ ...financialProgressService.getStats() });
    const update = () => setStats({ ...financialProgressService.getStats() });
    window.addEventListener("excel_arena_financial_progress_updated", update);
    return () => window.removeEventListener("excel_arena_financial_progress_updated", update);
  }, []);

  const defaultResume = {
    stage: "learn" as const,
    levelId: "fin-level-01",
    labelEn: "1. Three Financial Statements",
    labelTr: "1. Üç Temel Finansal Tablo",
  };
  const resume = mounted ? financialProgressService.getResumeActivity() : defaultResume;
  const level01Prog = mounted
    ? financialProgressService.getLevelProgress("fin-level-01")
    : getDefaultLevelProgress("fin-level-01");

  // Calculate current module completed activities
  const completedActivities =
    level01Prog.learnLessonsCompleted.length +
    level01Prog.practiceCompleted.length +
    level01Prog.solveCompleted.length +
    (level01Prog.testCompleted ? 1 : 0) +
    (level01Prog.projectCompleted ? 1 : 0);
  const totalActivities = 3 + 5 + 5 + 1 + 1; // 15 total activities in Level 1
  const moduleProgressPct = Math.round((completedActivities / totalActivities) * 100);

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in">
      {/* 1. Dashboard Title & Hero */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{isTr ? "FİNANSAL MODELLEME ARENASI" : "FINANCIAL MODELING ARENA"}</span>
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
          {isTr ? "Finansal Excel" : "Financial Excel"}
        </h1>
        <p className="text-sm text-foreground-secondary">
          {isTr
            ? "Gerçek iş senaryoları üzerinden Excel ile finansal analiz ve modelleme öğren."
            : "Learn financial analysis and modeling by building real Excel-based business scenarios."}
        </p>
      </div>

      {/* 2. Continue Learning Hero Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Subtle Navy Decorative Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col gap-3 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent font-mono font-bold text-xs uppercase tracking-wider">
              LEVEL 01
            </span>
            <span className="text-xs font-mono text-foreground-muted">
              {isTr ? "Finansal Tablo Temelleri" : "Financial Statement Basics"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            {isTr ? resume.labelTr : resume.labelEn}
          </h2>

          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            {isTr
              ? "Gelir tablosu, bilanço ve nakit akış tablolarının formül bağlantılarını ve model mantığını keşfedin."
              : "Explore the interconnected formulas, balance sheet checks, and cash flow dynamics of 3-statement models."}
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md pt-2">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="font-semibold text-foreground">
                Mastery: <strong suppressHydrationWarning>{level01Prog.masteryPercentage}%</strong>
              </span>
              <span className="text-foreground-muted" suppressHydrationWarning>
                {level01Prog.projectCompleted
                  ? isTr
                    ? "Tamamlandı"
                    : "Completed"
                  : isTr
                  ? "Devam Ediyor"
                  : "In Progress"}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${level01Prog.masteryPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="z-10 shrink-0 w-full md:w-auto">
          <Link
            href={`/financial/arena/${resume.levelId}`}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm sm:text-base rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isTr ? "Öğrenmeye Devam Et" : "Continue Learning"}</span>
          </Link>
        </div>
      </div>

      {/* 3. Independent Financial Excel Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Mastery */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              {isTr ? "Ustalık" : "Mastery"}
            </span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div
            suppressHydrationWarning
            className="text-2xl font-black font-mono text-foreground"
          >
            {stats.mastery}%
          </div>
          <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden mt-1">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.mastery}%` }} />
          </div>
        </div>

        {/* 2. Accuracy */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              {isTr ? "Doğruluk" : "Accuracy"}
            </span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div
            suppressHydrationWarning
            className="text-2xl font-black font-mono text-foreground"
          >
            {stats.accuracy}%
          </div>
          <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden mt-1">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.accuracy}%` }} />
          </div>
        </div>

        {/* 3. Best Streak */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              {isTr ? "Seri" : "Streak"}
            </span>
            <Flame className="w-4 h-4 text-accent" />
          </div>
          <div
            suppressHydrationWarning
            className="text-2xl font-black font-mono text-accent"
          >
            {stats.currentStreak}
            <span className="text-xs font-normal text-foreground-muted ml-1">/ {stats.bestStreak}</span>
          </div>
          <span className="text-[10px] text-foreground-muted">{isTr ? "Günlük Seri" : "Daily Streak"}</span>
        </div>

        {/* 5. Completed Levels */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              {isTr ? "Seviyeler" : "Levels"}
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div
            suppressHydrationWarning
            className="text-2xl font-black font-mono text-foreground"
          >
            {stats.completedLevels} / 12
          </div>
          <span className="text-[10px] text-foreground-muted">{isTr ? "Tamamlanan" : "Completed"}</span>
        </div>

        {/* 6. Completed Projects */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-foreground-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              {isTr ? "Projeler" : "Projects"}
            </span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <div
            suppressHydrationWarning
            className="text-2xl font-black font-mono text-foreground"
          >
            {stats.completedProjects}
          </div>
          <span className="text-[10px] text-foreground-muted">{isTr ? "Bitirme Projesi" : "Capstones Done"}</span>
        </div>
      </div>

      {/* 4. Current Module Card */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-accent uppercase">
              {isTr ? "Aktif Modül" : "Current Module"}
            </span>
            <span className="text-foreground-muted">•</span>
            <span
              suppressHydrationWarning
              className="font-mono text-xs text-foreground-muted"
            >
              {completedActivities} / {totalActivities} {isTr ? "görev tamamlandı" : "activities"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-foreground">
            {isTr ? "Seviye 01: Finansal Tablo Temelleri" : "Level 01: Financial Statement Basics"}
          </h3>

          <div className="w-full max-w-md pt-1">
            <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${moduleProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        <Link
          href="/financial/arena/fin-level-01"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-secondary/80 text-xs font-semibold text-foreground transition-colors cursor-pointer"
        >
          <span>{isTr ? "Modülü Aç" : "Open Module"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 5. 12-Level Financial Curriculum Roadmap */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-bold text-foreground">
              {isTr ? "12 Seviyeli Finansal Modelleme Müfredatı" : "12-Level Financial Curriculum"}
            </h3>
            <p className="text-xs text-foreground-muted">
              {isTr
                ? "Finansal tablo temellerinden kurumsal LBO ve DCF modellerine adım adım ilerleyin."
                : "Step-by-step path from three-statement basics to full corporate valuation models."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FINANCIAL_LEVELS.map((lvl) => {
            const isUnlocked = mounted
              ? financialProgressService.isLevelUnlocked(lvl.id)
              : lvl.id === "fin-level-01";
            const prog = mounted
              ? financialProgressService.getLevelProgress(lvl.id)
              : { masteryPercentage: 0, projectCompleted: false };
            const isDone = prog.projectCompleted || prog.masteryPercentage >= 80;

            return (
              <div
                key={lvl.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  !isUnlocked
                    ? "bg-surface/50 border-border opacity-60"
                    : "bg-surface border-border shadow-2xs hover:border-border-strong"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">
                      LEVEL {lvl.code}
                    </span>

                    {isDone ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    ) : isUnlocked ? (
                      <span
                        suppressHydrationWarning
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/10 text-accent font-bold"
                      >
                        {prog.masteryPercentage}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary text-foreground-muted flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-foreground leading-snug">
                    {isTr ? lvl.titleTr : lvl.titleEn}
                  </h4>

                  <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-2">
                    {isTr ? lvl.descriptionTr : lvl.descriptionEn}
                  </p>

                  {/* Topic Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lvl.topics.slice(0, 3).map((tItem) => (
                      <span
                        key={tItem.id}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary text-foreground-secondary"
                      >
                        {isTr ? tItem.titleTr : tItem.titleEn}
                      </span>
                    ))}
                    {lvl.topics.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted">
                        +{lvl.topics.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {isUnlocked ? (
                  <Link
                    href={`/financial/arena/${lvl.id}`}
                    className="flex items-center justify-between pt-3 border-t border-border text-xs font-semibold text-accent hover:text-accent-hover transition-colors cursor-pointer"
                  >
                    <span>{isTr ? "Eğitime Başla" : "Jump In"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs font-mono text-foreground-muted">
                    <span>{isTr ? "Kilitli (Önceki Seviye)" : "Prerequisite Required"}</span>
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
