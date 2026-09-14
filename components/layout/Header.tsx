"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  Target,
  Trophy,
  Globe,
  Settings as SettingsIcon,
  User,
  LayoutGrid,
  Menu,
  X,
  Code2,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { ThemeToggle } from "./ThemeToggle";
import { progressService, UserStats, DEFAULT_USER_STATS } from "@/lib/services/progress";
import { financialProgressService, DEFAULT_FINANCIAL_STATS } from "@/lib/services/financialProgress";
import { FinancialStats } from "@/lib/financial/types";
import { useLearningArea } from "@/lib/context/LearningAreaContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    interfaceLocale,
    setInterfaceLocale,
    formulaLocaleSetting,
    setFormulaLocaleSetting,
    resolvedFormulaLocale,
    t,
  } = useI18n();

  const { learningArea, setLearningArea, isFinancial } = useLearningArea();
  const isTr = interfaceLocale === "tr";

  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [finStats, setFinStats] = useState<FinancialStats>(DEFAULT_FINANCIAL_STATS);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats({ ...progressService.getStats() });
    setFinStats({ ...financialProgressService.getStats() });

    const updateStats = () => setStats({ ...progressService.getStats() });
    const updateFinStats = () => setFinStats({ ...financialProgressService.getStats() });

    window.addEventListener("excel_arena_progress_updated", updateStats);
    window.addEventListener("excel_arena_financial_progress_updated", updateFinStats);

    return () => {
      window.removeEventListener("excel_arena_progress_updated", updateStats);
      window.removeEventListener("excel_arena_financial_progress_updated", updateFinStats);
    };
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.dashboard, icon: LayoutGrid },
    { href: "/levels", label: t.nav.levels, icon: Target },
    { href: "/profile", label: t.nav.profile, icon: User },
    { href: "/settings", label: t.nav.settings, icon: SettingsIcon },
  ];

  const handleTabSwitch = (targetArea: "basic-excel" | "financial-excel") => {
    if (targetArea === learningArea) return;
    setLearningArea(targetArea);

    if (pathname.startsWith("/financial") && targetArea === "basic-excel") {
      router.push("/");
    } else if (pathname.startsWith("/arena") && targetArea === "financial-excel") {
      router.push("/financial/arena/fin-level-01");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-surface/90 backdrop-blur-md transition-colors select-none">
      <div className="max-w-7xl mx-auto h-full px-2.5 sm:px-6 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
            {/* Dynamic Geometric Arena Icon (Red in Basic, Navy in Financial) */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-black text-xs sm:text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-all shrink-0">
              <span className="font-mono">EA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-wider text-xs sm:text-sm text-foreground flex items-center gap-0.5">
                EXCEL<span className="text-accent">ARENA</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-foreground-muted uppercase hidden sm:inline">
                {isFinancial
                  ? isTr
                    ? "Finansal Modelleme"
                    : "Financial Modeling"
                  : isTr
                  ? "Ustalık Platformu"
                  : "Mastery Platform"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-surface-secondary text-foreground shadow-2xs font-bold"
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-secondary/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Main Learning Area Segmented Control (Accessible Tablist) */}
        <div
          role="tablist"
          aria-label="ExcelArena Learning Area"
          className="flex items-center p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-surface-secondary/80 border border-border shrink-0"
        >
          <button
            role="tab"
            type="button"
            id="tab-basic-excel"
            aria-selected={!isFinancial}
            aria-controls="panel-basic-excel"
            onClick={() => handleTabSwitch("basic-excel")}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              !isFinancial
                ? "bg-accent text-accent-foreground shadow-2xs"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <span className="inline min-[400px]:hidden">{isTr ? "Temel" : "Basic"}</span>
            <span className="hidden min-[400px]:inline">{isTr ? "Temel Excel" : "Basic Excel"}</span>
          </button>

          <button
            role="tab"
            type="button"
            id="tab-financial-excel"
            aria-selected={isFinancial}
            aria-controls="panel-financial-excel"
            onClick={() => handleTabSwitch("financial-excel")}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isFinancial
                ? "bg-accent text-accent-foreground shadow-2xs"
                : "text-foreground-secondary hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <span className="inline min-[400px]:hidden">{isTr ? "Finansal" : "Financial"}</span>
            <span className="hidden min-[400px]:inline">{isTr ? "Finansal Excel" : "Financial Excel"}</span>
          </button>
        </div>

        {/* Center/Right: Live Metrics Pill (Adaptive to Active Learning Area) */}
        <div
          suppressHydrationWarning
          className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-full bg-surface-secondary/60 border border-border text-xs font-mono"
        >
          {!isFinancial ? (
            <>
              {/* Basic Excel: Overall Mastery */}
              <div className="flex items-center gap-1 text-foreground" title={t.common.totalMastery}>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold">{stats.overallMastery}%</span>
                <span className="text-[10px] text-foreground-muted uppercase">Mastery</span>
              </div>

              <span className="text-border-strong">|</span>

              {/* Basic Excel: Accuracy */}
              <div className="flex items-center gap-1 text-foreground" title={t.common.accuracy}>
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-bold">{stats.accuracyRate}%</span>
                <span className="text-[10px] text-foreground-muted uppercase">Acc</span>
              </div>

              <span className="text-border-strong">|</span>

              {/* Basic Excel: Streak */}
              <div className="flex items-center gap-1 text-foreground" title={t.common.streak}>
                <Flame className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span className="font-bold text-accent">{stats.currentStreak}</span>
                <span className="text-[10px] text-foreground-muted uppercase">Streak</span>
              </div>
            </>
          ) : (
            <>
              {/* Financial Excel: Mastery */}
              <div className="flex items-center gap-1 text-foreground" title="Financial Mastery">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold">{finStats.mastery}%</span>
                <span className="text-[10px] text-foreground-muted uppercase">Mastery</span>
              </div>

              <span className="text-border-strong">|</span>

              {/* Financial Excel: Accuracy */}
              <div className="flex items-center gap-1 text-foreground" title="Financial Accuracy">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-bold">{finStats.accuracy}%</span>
                <span className="text-[10px] text-foreground-muted uppercase">Acc</span>
              </div>

              <span className="text-border-strong">|</span>

              {/* Financial Excel: Streak */}
              <div className="flex items-center gap-1 text-foreground" title="Daily Streak">
                <Flame className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span className="font-bold text-accent">{finStats.currentStreak}</span>
                <span className="text-[10px] text-foreground-muted uppercase">Streak</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Language Pill, Theme Toggle, Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
          {/* Dual Language Selector Dropdown - Desktop Only */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono text-xs uppercase">{interfaceLocale}</span>
              <span className="text-foreground-muted text-[10px]">/</span>
              <span className="font-mono text-[10px] text-accent font-bold uppercase">
                fx:{resolvedFormulaLocale}
              </span>
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-xl shadow-xl z-50 p-3 flex flex-col gap-3 animate-fade-in">
                  {/* Interface Language */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted font-bold block mb-1.5">
                      {t.settings.interfaceLanguage}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setInterfaceLocale("en");
                          setLangMenuOpen(false);
                        }}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          interfaceLocale === "en"
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-border bg-surface-secondary/50 text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setInterfaceLocale("tr");
                          setLangMenuOpen(false);
                        }}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          interfaceLocale === "tr"
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-border bg-surface-secondary/50 text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        Türkçe
                      </button>
                    </div>
                  </div>

                  {/* Formula Language */}
                  <div className="border-t border-border pt-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted font-bold">
                        {t.settings.formulaLanguage}
                      </span>
                      <Code2 className="w-3 h-3 text-accent" />
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => {
                          setFormulaLocaleSetting("auto");
                          setLangMenuOpen(false);
                        }}
                        className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          formulaLocaleSetting === "auto"
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "border-border bg-surface-secondary/50 text-foreground-secondary hover:text-foreground"
                        }`}
                      >
                        Auto
                      </button>
                      <button
                        onClick={() => {
                          setFormulaLocaleSetting("en");
                          setLangMenuOpen(false);
                        }}
                        className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          formulaLocaleSetting === "en"
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "border-border bg-surface-secondary/50 text-foreground-secondary hover:text-foreground"
                        }`}
                      >
                        =SUM
                      </button>
                      <button
                        onClick={() => {
                          setFormulaLocaleSetting("tr");
                          setLangMenuOpen(false);
                        }}
                        className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          formulaLocaleSetting === "tr"
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "border-border bg-surface-secondary/50 text-foreground-secondary hover:text-foreground"
                        }`}
                      >
                        =TOPLA
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle - Desktop Only */}
          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 rounded-lg border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-secondary/80 transition-colors shrink-0 cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 top-14 bg-black/40 backdrop-blur-xs z-20 md:hidden animate-fade-in"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="md:hidden fixed top-14 left-0 right-0 z-30 border-b border-border bg-surface p-4 flex flex-col gap-3.5 animate-slide-up shadow-xl max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {/* Learning Area Selector on Mobile */}
            <div className="flex items-center p-1 rounded-xl bg-surface-secondary border border-border">
              <button
                type="button"
                onClick={() => {
                  handleTabSwitch("basic-excel");
                  setMobileNavOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-colors cursor-pointer ${
                  !isFinancial
                    ? "bg-accent text-accent-foreground shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                {isTr ? "Temel Excel" : "Basic Excel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleTabSwitch("financial-excel");
                  setMobileNavOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-colors cursor-pointer ${
                  isFinancial
                    ? "bg-accent text-accent-foreground shadow-2xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                {isTr ? "Finansal Excel" : "Financial Excel"}
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent font-bold"
                        : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Preferences: Theme & Language Controls */}
            <div className="border-t border-border pt-3.5 flex flex-col gap-3">
              {/* Theme Toggle Row */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-foreground-secondary">
                  {isTr ? "Görünüm Teması" : "Theme"}
                </span>
                <ThemeToggle />
              </div>

              {/* Interface Language */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted font-bold px-1">
                  {t.settings.interfaceLanguage}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInterfaceLocale("en")}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      interfaceLocale === "en"
                        ? "bg-accent text-accent-foreground border-accent font-bold"
                        : "border-border bg-surface-secondary/50 text-foreground hover:bg-surface-secondary"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterfaceLocale("tr")}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      interfaceLocale === "tr"
                        ? "bg-accent text-accent-foreground border-accent font-bold"
                        : "border-border bg-surface-secondary/50 text-foreground hover:bg-surface-secondary"
                    }`}
                  >
                    Türkçe
                  </button>
                </div>
              </div>

              {/* Formula Language */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted font-bold">
                    {t.settings.formulaLanguage}
                  </span>
                  <Code2 className="w-3 h-3 text-accent" />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormulaLocaleSetting("auto")}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      formulaLocaleSetting === "auto"
                        ? "bg-accent/15 text-accent border-accent font-bold"
                        : "border-border bg-surface-secondary/50 text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormulaLocaleSetting("en")}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      formulaLocaleSetting === "en"
                        ? "bg-accent/15 text-accent border-accent font-bold"
                        : "border-border bg-surface-secondary/50 text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    =SUM
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormulaLocaleSetting("tr")}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      formulaLocaleSetting === "tr"
                        ? "bg-accent/15 text-accent border-accent font-bold"
                        : "border-border bg-surface-secondary/50 text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    =TOPLA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
