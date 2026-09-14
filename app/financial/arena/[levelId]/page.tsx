"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getFinancialLevelById, FINANCIAL_LEVELS } from "@/lib/financial/levels";
import { FinancialArena } from "@/components/financial/FinancialArena";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Lock, ArrowLeft, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function FinancialArenaPage() {
  const params = useParams();
  const router = useRouter();
  const { interfaceLocale } = useI18n();
  const isTr = interfaceLocale === "tr";

  const levelId = (params?.levelId as string) || "fin-level-01";
  const level = getFinancialLevelById(levelId) || FINANCIAL_LEVELS[0];

  if (!level) {
    return (
      <AppLayout showLeftNav={false}>
        <div className="p-12 text-center text-foreground-muted">
          <h2 className="text-xl font-bold">Level Not Found</h2>
          <Link href="/" className="text-accent underline text-sm mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Structured Coming Soon view for Levels 2-12
  if (level.isLocked && level.id !== "fin-level-01") {
    return (
      <AppLayout showLeftNav={false}>
        <div className="max-w-2xl mx-auto py-12 flex flex-col gap-6 animate-fade-in text-center items-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center text-foreground-muted shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
              LEVEL {level.code} • {isTr ? "YAKINDA" : "COMING SOON"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {isTr ? level.titleTr : level.titleEn}
            </h1>
            <p className="text-sm text-foreground-secondary leading-relaxed max-w-lg mx-auto">
              {isTr ? level.descriptionTr : level.descriptionEn}
            </p>
          </div>

          <div className="w-full p-5 rounded-2xl bg-surface border border-border text-left flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground-muted">
              {isTr ? "Bu Seviyede Neler Öğreneceksiniz?" : "Curriculum Topics in this Level"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {level.topics.map((top) => (
                <div
                  key={top.id}
                  className="p-3 rounded-xl bg-surface-secondary/50 border border-border/70 flex flex-col gap-1"
                >
                  <span className="text-xs font-bold text-foreground">
                    {isTr ? top.titleTr : top.titleEn}
                  </span>
                  <span className="text-[11px] text-foreground-muted leading-relaxed">
                    {isTr ? top.descTr : top.descEn}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-surface-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isTr ? "Ana Ekrana Dön" : "Back to Dashboard"}</span>
            </Link>

            <Link
              href="/financial/arena/fin-level-01"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs sm:text-sm shadow-sm hover:bg-accent-hover transition-all"
            >
              <span>{isTr ? "Seviye 1'e Git (Aktif)" : "Open Level 1 (Playable)"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Active Playable Level (Level 1)
  return (
    <AppLayout showLeftNav={false}>
      <FinancialArena level={level} />
    </AppLayout>
  );
}
