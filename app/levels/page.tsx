"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { LEVELS } from "@/lib/content/levels";
import { useI18n } from "@/lib/i18n/I18nContext";
import { progressService } from "@/lib/services/progress";
import {
  Lock,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Target,
  Layers,
  Sparkles,
} from "lucide-react";

export default function LevelsPage() {
  const { interfaceLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppLayout showLeftNav={false}>
      <div className="flex flex-col gap-8 pb-16 animate-fade-in">
        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
            Curriculum
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground">
            {t.dashboard.levelRoadmap}
          </h1>
          <p className="text-xs sm:text-sm text-foreground-secondary">
            Master Excel step-by-step from core foundations through complex multi-condition analysis.
          </p>
        </div>

        {/* Level Cards List */}
        <div className="flex flex-col gap-6">
          {LEVELS.map((level) => {
            const mastery = progressService.getLevelMastery(level.id);
            const isLevelLocked = level.isLocked;

            return (
              <div
                key={level.id}
                className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                  isLevelLocked
                    ? "bg-surface/50 border-border opacity-60"
                    : "bg-surface border-border shadow-xs hover:border-border-strong"
                }`}
              >
                {/* Level Title & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent font-mono font-black text-sm flex items-center justify-center shrink-0">
                      {level.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-accent uppercase">
                          LEVEL {level.code}
                        </span>
                        {isLevelLocked && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary text-foreground-muted flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Coming Soon
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">
                        {interfaceLocale === "tr" ? level.titleTr : level.titleEn}
                      </h2>
                    </div>
                  </div>

                  {!isLevelLocked && (
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-foreground-secondary font-semibold">
                        {mastery.percentage}% Mastered
                      </span>
                      <div className="w-24 h-2 bg-surface-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${mastery.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-foreground-secondary mb-5 leading-relaxed">
                  {interfaceLocale === "tr" ? level.descriptionTr : level.descriptionEn}
                </p>

                {/* Topics Grid */}
                {level.topics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {level.topics.map((topic) => {
                      const prog = progressService.getTopicProgress(topic.id, level.id);
                      const isUnlocked = progressService.isTopicUnlocked(level.id, topic.id);
                      const isCompleted =
                        prog.masteryPercentage >= 80 ||
                        (prog.practiceCompleted && prog.solveCompleted);

                      return (
                        <Link
                          key={topic.id}
                          href={isUnlocked ? `/arena/${level.id}/${topic.id}` : "#"}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                            isCompleted
                              ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900 hover:border-emerald-400"
                              : isUnlocked
                              ? "bg-surface-secondary/40 border-border hover:border-accent hover:bg-surface-secondary/80"
                              : "bg-surface-secondary/20 border-border/60 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-[10px] font-bold text-accent">
                                {topic.canonicalFunction}
                              </span>
                              <h3 className="text-sm font-bold text-foreground mt-0.5">
                                {interfaceLocale === "tr" ? topic.titleTr : topic.titleEn}
                              </h3>
                            </div>

                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : isUnlocked ? (
                              <ArrowRight className="w-4 h-4 text-foreground-muted shrink-0" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted pt-1 border-t border-border/50">
                            <span>Difficulty: {topic.difficulty}/5</span>
                            <span className="font-bold text-foreground">
                              {prog.masteryPercentage}%
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
