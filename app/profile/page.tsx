"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LEVELS } from "@/lib/content/levels";
import { progressService, UserStats } from "@/lib/services/progress";
import {
  User,
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  RotateCcw,
  BarChart2,
  Shield,
  Layers,
} from "lucide-react";

export default function ProfilePage() {
  const { interfaceLocale, t } = useI18n();
  const [stats, setStats] = useState<UserStats>(progressService.getStats());
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateStats = () => setStats({ ...progressService.getStats() });
    window.addEventListener("excel_arena_progress_updated", updateStats);
    return () => window.removeEventListener("excel_arena_progress_updated", updateStats);
  }, []);

  const handleResetProgress = () => {
    progressService.resetAll();
    setStats(progressService.getStats());
    setResetConfirmOpen(false);
  };

  return (
    <AppLayout showLeftNav={false}>
      <div className="flex flex-col gap-8 pb-16 animate-fade-in">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground font-black text-2xl flex items-center justify-center font-mono shadow-md">
              EA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                  Practitioner
                </span>
                <span className="text-foreground-muted">|</span>
                <span className="text-xs font-mono text-foreground-muted">
                  {stats.completedTopicsCount}/{stats.totalTopicsCount} Topics Mastered
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                {t.profile.userTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:border-rose-300 text-xs font-semibold text-foreground-secondary hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.profile.resetProgress}</span>
            </button>
          </div>
        </div>

        {/* Analytics Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Mastery */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.totalMastery}</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black font-mono text-foreground">
              {stats.overallMastery}%
            </div>
            <span className="text-[11px] text-foreground-muted">Consolidated Learning</span>
          </div>

          {/* Accuracy Rate */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.accuracy}</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black font-mono text-foreground">
              {stats.accuracyRate}%
            </div>
            <span className="text-[11px] text-foreground-muted">Formula First-Pass Rate</span>
          </div>

          {/* Solved Challenges */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.solved}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black font-mono text-foreground">
              {stats.challengesSolved}
            </div>
            <span className="text-[11px] text-foreground-muted">Practice & Solves</span>
          </div>

          {/* Day Streak */}
          <div className="p-5 rounded-xl bg-surface border border-border shadow-2xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-foreground-muted">
              <span className="text-xs font-mono uppercase tracking-wider">{t.common.streak}</span>
              <Flame className="w-4 h-4 text-accent" />
            </div>
            <div className="text-3xl font-black font-mono text-accent">
              {stats.currentStreak} Days
            </div>
            <span className="text-[11px] text-foreground-muted">Best: {stats.bestStreak} Days</span>
          </div>
        </div>

        {/* Topic Skills Breakdown Matrix */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {t.profile.topicSkills}
            </h3>
            <span className="text-xs font-mono text-foreground-muted">
              Mastery Calculation Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LEVELS.slice(0, 3).flatMap((lvl) =>
              lvl.topics.map((top) => {
                const prog = progressService.getTopicProgress(top.id, lvl.id);
                const title = interfaceLocale === "tr" ? top.titleTr : top.titleEn;

                return (
                  <div
                    key={top.id}
                    className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-accent">
                          L{lvl.code}
                        </span>
                        <span className="font-mono text-[10px] text-foreground-muted">
                          {top.canonicalFunction}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-foreground truncate mt-0.5">
                        {title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <div className="w-20 h-2 bg-surface-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${prog.masteryPercentage}%` }}
                        />
                      </div>
                      <span className="font-bold w-9 text-right text-foreground">
                        {prog.masteryPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Confirmation Modal for Reset Data */}
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-2xl bg-surface border border-border shadow-2xl flex flex-col gap-4 animate-scale-up">
              <h4 className="text-lg font-bold text-foreground">
                {t.profile.resetProgress}
              </h4>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {t.profile.resetConfirm}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-surface-secondary"
                >
                  {t.common.close}
                </button>
                <button
                  onClick={handleResetProgress}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                >
                  {t.common.reset}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
