"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  Circle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Layers,
} from "lucide-react";
import { LEVELS, getLevelById } from "@/lib/content/levels";
import { progressService } from "@/lib/services/progress";
import { useI18n } from "@/lib/i18n/I18nContext";

interface LeftNavProps {
  currentLevelId: string;
  currentTopicId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  currentLevelId,
  currentTopicId,
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { interfaceLocale, t } = useI18n();
  const router = useRouter();
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [progressVersion, setProgressVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setProgressVersion((v) => v + 1);
    window.addEventListener("excel_arena_progress_updated", handleUpdate);
    return () => window.removeEventListener("excel_arena_progress_updated", handleUpdate);
  }, []);

  const currentLevel = getLevelById(currentLevelId) || LEVELS[0];
  const levelMastery = progressService.getLevelMastery(currentLevel.id);

  const getTopicStatus = (topicId: string) => {
    const prog = progressService.getTopicProgress(topicId, currentLevel.id);
    const isUnlocked = progressService.isTopicUnlocked(currentLevel.id, topicId);
    const isActive = currentTopicId === topicId;
    const isCompleted = prog.masteryPercentage >= 80 || (prog.practiceCompleted && prog.solveCompleted);

    return { prog, isUnlocked, isActive, isCompleted };
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-surface transition-all duration-300 z-20 ${
        isMobileDrawer
          ? "w-72 h-full"
          : isCollapsed
          ? "w-14"
          : "w-64 sm:w-72"
      } h-[calc(100vh-3.5rem)] select-none`}
    >
      {/* Chapter & Journey Header */}
      <div className="p-3.5 border-b border-border bg-surface-secondary/30 relative">
        {!isCollapsed ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-accent" />
                {interfaceLocale === "tr" ? "EĞİTİM YOLCULUĞUNUZ" : "YOUR JOURNEY"}
              </span>

              {/* Level Selector Button */}
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-1 text-[11px] font-mono text-foreground-secondary hover:text-foreground font-semibold px-2 py-0.5 rounded bg-surface border border-border transition-colors cursor-pointer"
              >
                <span>Level {currentLevel.number}/6</span>
                <ChevronDown className="w-3 h-3 text-foreground-muted" />
              </button>
            </div>

            {/* Current Level Title */}
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-black text-accent">
                LEVEL {currentLevel.code}
              </span>
              <h3 className="text-sm font-bold text-foreground truncate">
                {interfaceLocale === "tr" ? currentLevel.titleTr : currentLevel.titleEn}
              </h3>
            </div>

            {/* Level Topic Counter & Mastery Bar */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-foreground-secondary mb-1">
                <span>
                  {levelMastery.completedTopics} / {levelMastery.totalTopics} {interfaceLocale === "tr" ? "konu" : "topics"}
                </span>
                <span className="font-semibold text-accent">{levelMastery.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${levelMastery.percentage}%` }}
                />
              </div>
            </div>

            {/* Dropdown Menu for Level Switching */}
            {levelDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1 bg-surface border border-border rounded-xl shadow-xl z-50 p-2 flex flex-col gap-1 animate-fade-in">
                {LEVELS.map((lvl) => {
                  const lvlStat = progressService.getLevelMastery(lvl.id);
                  const isSelected = lvl.id === currentLevel.id;

                  return (
                    <button
                      key={lvl.id}
                      disabled={lvl.isLocked}
                      onClick={() => {
                        setLevelDropdownOpen(false);
                        const firstTopic = lvl.topics[0]?.id || "";
                        if (firstTopic) {
                          router.push(`/arena/${lvl.id}/${firstTopic}`);
                          if (onCloseMobileDrawer) onCloseMobileDrawer();
                        }
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                        isSelected
                          ? "bg-accent/10 text-accent font-bold"
                          : lvl.isLocked
                          ? "opacity-40 cursor-not-allowed text-foreground-muted"
                          : "hover:bg-surface-secondary text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-accent font-bold">
                          {lvl.code}
                        </span>
                        <span className="truncate max-w-[130px]">
                          {interfaceLocale === "tr" ? lvl.titleTr : lvl.titleEn}
                        </span>
                      </div>
                      {lvl.isLocked ? (
                        <Lock className="w-3 h-3 text-foreground-muted" />
                      ) : (
                        <span className="font-mono text-[10px] font-semibold text-foreground-muted">
                          {lvlStat.percentage}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <span className="font-mono text-xs font-black text-accent">L{currentLevel.code}</span>
          </div>
        )}
      </div>

      {/* Topics Navigation List */}
      <div className="flex-1 overflow-y-auto py-2.5 px-2 flex flex-col gap-1">
        {currentLevel.topics.map((topic) => {
          const { prog, isUnlocked, isActive, isCompleted } = getTopicStatus(topic.id);

          return (
            <Link
              key={topic.id}
              href={isUnlocked ? `/arena/${currentLevel.id}/${topic.id}` : "#"}
              onClick={() => {
                if (isUnlocked && onCloseMobileDrawer) onCloseMobileDrawer();
              }}
              className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                isActive
                  ? "bg-accent/10 text-accent font-bold shadow-2xs"
                  : isUnlocked
                  ? "text-foreground hover:text-foreground hover:bg-surface-secondary/70 font-medium"
                  : "text-foreground-muted/60 opacity-60 cursor-not-allowed font-normal"
              }`}
            >
              {/* Signature Red Triangular Ribbon / Bookmark Marker on Active Item */}
              {isActive && (
                <>
                  <div className="ribbon-bookmark" />
                  <div className="ribbon-triangular" />
                </>
              )}

              <div className="flex items-center gap-2.5 min-w-0">
                {/* State Icons */}
                {isCompleted ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="w-4 h-4 flex items-center justify-center shrink-0 text-accent font-mono text-xs font-black">
                    ▶
                  </div>
                ) : isUnlocked ? (
                  <Circle className="w-3 h-3 text-foreground-muted/80 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-foreground-muted/50 shrink-0" />
                )}

                {!isCollapsed && (
                  <span className="truncate">
                    {interfaceLocale === "tr" ? topic.titleTr : topic.titleEn}
                  </span>
                )}
              </div>

              {!isCollapsed && prog.masteryPercentage > 0 && !isCompleted && (
                <span className="font-mono text-[10px] text-foreground-muted font-semibold ml-2">
                  {prog.masteryPercentage}%
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse / Expand Toggle Button (Desktop Only) */}
      {!isMobileDrawer && onToggleCollapse && (
        <div className="p-2 border-t border-border bg-surface-secondary/20 flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
