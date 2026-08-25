"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getLevelById, getTopicById, getNextTopic } from "@/lib/content/levels";
import { StageType } from "@/lib/content/types";
import { LearnStage } from "@/components/stages/LearnStage";
import { PracticeStage } from "@/components/stages/PracticeStage";
import { TestStage } from "@/components/stages/TestStage";
import { SolveStage } from "@/components/stages/SolveStage";
import { useI18n } from "@/lib/i18n/I18nContext";
import { progressService, TopicProgress } from "@/lib/services/progress";
import {
  BookOpen,
  Code2,
  Zap,
  Briefcase,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function ArenaTopicPage() {
  const params = useParams();
  const router = useRouter();
  const { interfaceLocale, t } = useI18n();

  const levelId = (params?.levelId as string) || "level-01";
  const topicId = (params?.topicId as string) || "sumif";

  const level = getLevelById(levelId);
  const topic = getTopicById(levelId, topicId);

  const [activeStage, setActiveStage] = useState<StageType>("learn");
  const [topicProgress, setTopicProgress] = useState<TopicProgress>(
    progressService.getTopicProgress(topicId, levelId)
  );

  const prevTopicIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (topic) {
      const currentProg = progressService.getTopicProgress(topic.id, levelId);
      setTopicProgress(currentProg);

      // Only reset active stage when switching to a different topic
      if (prevTopicIdRef.current !== topic.id) {
        prevTopicIdRef.current = topic.id;
        setActiveStage("learn");
      }
    }
  }, [levelId, topicId, topic]);

  if (!level || !topic) {
    return (
      <AppLayout showLeftNav={false}>
        <div className="p-12 text-center text-foreground-muted">
          <h2 className="text-xl font-bold">Topic Not Found</h2>
          <p className="text-sm mt-2">The requested topic could not be located.</p>
        </div>
      </AppLayout>
    );
  }

  const topicTitle = interfaceLocale === "tr" ? topic.titleTr : topic.titleEn;
  const levelTitle = interfaceLocale === "tr" ? level.titleTr : level.titleEn;

  // Stages tabs configuration
  const stageTabs: {
    id: StageType;
    label: string;
    icon: React.ElementType;
    isCompleted: boolean;
    desc: string;
  }[] = [
    {
      id: "learn",
      label: t.stages.learn,
      icon: BookOpen,
      isCompleted: topicProgress.learnCompleted,
      desc: t.stages.stage1Desc,
    },
    {
      id: "practice",
      label: t.stages.practice,
      icon: Code2,
      isCompleted: topicProgress.practiceCompleted,
      desc: t.stages.stage2Desc,
    },
    {
      id: "test",
      label: t.stages.test,
      icon: Zap,
      isCompleted: topicProgress.testCompleted,
      desc: t.stages.stage3Desc,
    },
    {
      id: "solve",
      label: t.stages.solve,
      icon: Briefcase,
      isCompleted: topicProgress.solveCompleted,
      desc: t.stages.stage4Desc,
    },
  ];

  // Stage Transitions
  const handleLearnComplete = () => {
    progressService.markStageCompleted(topic.id, level.id, "learn");
    setTopicProgress({ ...progressService.getTopicProgress(topic.id, level.id) });
    setActiveStage("practice");
  };

  const handlePracticeComplete = () => {
    progressService.markStageCompleted(topic.id, level.id, "practice");
    setTopicProgress({ ...progressService.getTopicProgress(topic.id, level.id) });
    setActiveStage("test");
  };

  const handleTestComplete = () => {
    setTopicProgress({ ...progressService.getTopicProgress(topic.id, level.id) });
    setActiveStage("solve");
  };

  const handleSolveComplete = () => {
    setTopicProgress({ ...progressService.getTopicProgress(topic.id, level.id) });
    const next = getNextTopic(level.id, topic.id);
    if (next) {
      router.push(`/arena/${next.levelId}/${next.topicId}`);
    } else {
      router.push("/levels");
    }
  };

  return (
    <AppLayout showLeftNav={true} currentLevelId={levelId} currentTopicId={topicId}>
      <div className="flex flex-col gap-6 pb-16">
        {/* Breadcrumb & Topic Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-foreground-muted">
              <span>LEVEL {level.code}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{levelTitle}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent font-bold">{topic.canonicalFunction}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground">{topicTitle}</h1>
          </div>

          {/* Topic Mastery Score Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono">
            <span className="text-foreground-muted">Mastery:</span>
            <strong className="text-accent text-sm font-bold">
              {topicProgress.masteryPercentage}%
            </strong>
          </div>
        </div>

        {/* 4-Stage Continuous Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-secondary/60 p-1.5 rounded-xl border border-border">
          {stageTabs.map((tab, idx) => {
            const isActive = activeStage === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStage(tab.id)}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-surface text-accent shadow-xs border border-border/80 font-bold"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/50"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {tab.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-accent" : ""}`} />
                  )}
                  <span className="font-mono text-[10px] text-foreground-muted hidden md:inline">
                    {idx + 1}.
                  </span>
                  <span className="truncate">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Persistent Active Stages: Preserves all in-progress answers and inputs across tab clicks */}
        <div className="pt-2">
          <div className={activeStage === "learn" ? "block" : "hidden"}>
            <LearnStage topic={topic} onComplete={handleLearnComplete} />
          </div>

          <div className={activeStage === "practice" ? "block" : "hidden"}>
            <PracticeStage topic={topic} onComplete={handlePracticeComplete} />
          </div>

          <div className={activeStage === "test" ? "block" : "hidden"}>
            <TestStage topic={topic} onComplete={handleTestComplete} />
          </div>

          <div className={activeStage === "solve" ? "block" : "hidden"}>
            <SolveStage topic={topic} onComplete={handleSolveComplete} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
