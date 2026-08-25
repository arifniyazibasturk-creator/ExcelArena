"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LEVELS, getLevelById, getTopicById } from "@/lib/content/levels";
import { progressService, UserStats } from "@/lib/services/progress";
import {
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Play,
  Layers,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const { interfaceLocale, t } = useI18n();
  const [stats, setStats] = useState<UserStats>(progressService.getStats());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateStats = () => setStats({ ...progressService.getStats() });
    window.addEventListener("excel_arena_progress_updated", updateStats);
    return () => window.removeEventListener("excel_arena_progress_updated", updateStats);
  }, []);

  const nextRec = progressService.getNextRecommendedTopic();
  const recLevel = getLevelById(nextRec.levelId) || LEVELS[0];
  const recTopic = getTopicById(nextRec.levelId, nextRec.topicId) || recLevel.topics[0];
  const recProg = progressService.getTopicProgress(recTopic.id, recLevel.id);

  return (
    <AppLayout showLeftNav={false}>
      <div className="flex flex-col gap-8 pb-12 animate-fade-in">
        {/* Top Header Title */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
            {t.common.appName}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-foreground-secondary">{t.common.tagline}</p>
        </div>

        {/* 1. Continue Training Hero Card (Where am I & What to do next) */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Background Decorative Accent Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex flex-col gap-3 max-w-xl z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent font-mono font-bold text-xs uppercase tracking-wider">
                LEVEL {recLevel.code}
              </span>
              <span className="text-xs font-mono text-foreground-muted">
                {interfaceLocale === "tr" ? recLevel.titleTr : recLevel.titleEn}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {interfaceLocale === "tr" ? recTopic.titleTr : recTopic.titleEn}
            </h2>

            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              {interfaceLocale === "tr" ? recTopic.shortDescTr : recTopic.shortDescEn}
            </p>

            {/* Topic Mastery Progress Bar */}
            <div className="w-full max-w-md pt-2">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-foreground">
                  Mastery: <strong>{recProg.masteryPercentage}%</strong>
                </span>
                <span className="text-foreground-muted">
                  {recProg.solveCompleted ? "Completed" : "In Progress"}
                </span>
              </div>
              <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${recProg.masteryPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="z-10 shrink-0 w-full md:w-auto">
            <Link
              href={`/arena/${recLevel.id}/${recTopic.id}`}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm sm:text-base rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.dashboard.continueTraining}</span>
            </Link>
          </div>
        </div>

        {/* 2. Concise Progress Summary (How am I progressing?) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Overall Mastery */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">
                {t.common.totalMastery}
              </span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {stats.overallMastery}%
            </div>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${stats.overallMastery}%` }}
              />
            </div>
          </div>

          {/* Accuracy */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.accuracy}</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {stats.accuracyRate}%
            </div>
            <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${stats.accuracyRate}%` }}
              />
            </div>
          </div>

          {/* Challenges Solved */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.solved}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {stats.challengesSolved}
            </div>
            <span className="text-[11px] text-foreground-muted">Practiced & Solved</span>
          </div>

          {/* Best & Current Streak */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.bestStreak}</span>
              <Flame className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-accent">
              {stats.currentStreak}{" "}
              <span className="text-xs font-normal text-foreground-muted">
                / Best {stats.bestStreak}
              </span>
            </div>
            <span className="text-[11px] text-foreground-muted">Consecutive Days</span>
          </div>
        </div>

        {/* 3. Arena Level Roadmap */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{t.dashboard.levelRoadmap}</h3>
            <Link
              href="/levels"
              className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
            >
              <span>{t.nav.levels}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEVELS.slice(0, 3).map((level) => {
              const lvlMastery = progressService.getLevelMastery(level.id);

              return (
                <div
                  key={level.id}
                  className="p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col justify-between gap-4 hover:border-border-strong transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-accent">
                        LEVEL {level.code}
                      </span>
                      <span className="text-xs font-mono font-semibold text-foreground-muted">
                        {lvlMastery.percentage}%
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-foreground">
                      {interfaceLocale === "tr" ? level.titleTr : level.titleEn}
                    </h4>

                    <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-2">
                      {interfaceLocale === "tr" ? level.descriptionTr : level.descriptionEn}
                    </p>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {level.topics.map((tItem) => {
                        const prog = progressService.getTopicProgress(tItem.id, level.id);
                        const isDone = prog.masteryPercentage >= 80;

                        return (
                          <span
                            key={tItem.id}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                              isDone
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                                : "bg-surface-secondary text-foreground-secondary"
                            }`}
                          >
                            {tItem.canonicalFunction}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <Link
                    href={`/arena/${level.id}/${level.topics[0]?.id}`}
                    className="flex items-center justify-between pt-3 border-t border-border text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    <span>{t.dashboard.jumpIn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
