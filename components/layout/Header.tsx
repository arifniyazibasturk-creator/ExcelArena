"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { ThemeToggle } from "./ThemeToggle";
import { progressService, UserStats } from "@/lib/services/progress";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const {
    interfaceLocale,
    setInterfaceLocale,
    formulaLocaleSetting,
    setFormulaLocaleSetting,
    resolvedFormulaLocale,
    t,
  } = useI18n();

  const [stats, setStats] = useState<UserStats>(progressService.getStats());
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const updateStats = () => setStats({ ...progressService.getStats() });
    window.addEventListener("excel_arena_progress_updated", updateStats);
    return () => window.removeEventListener("excel_arena_progress_updated", updateStats);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.dashboard, icon: LayoutGrid },
    { href: "/levels", label: t.nav.levels, icon: Target },
    { href: "/profile", label: t.nav.profile, icon: User },
    { href: "/settings", label: t.nav.settings, icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-surface/90 backdrop-blur-md transition-colors select-none">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Geometric Arena Icon */}
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-black text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-mono">EA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-wider text-sm text-foreground flex items-center gap-1">
                EXCEL<span className="text-accent">ARENA</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-foreground-muted uppercase hidden sm:inline">
                Mastery Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
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

        {/* Center/Right: Live Metrics Pill (Zero XP, Clean Mastery) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-full bg-surface-secondary/60 border border-border text-xs font-mono">
          {/* Overall Mastery */}
          <div className="flex items-center gap-1 text-foreground" title={t.common.totalMastery}>
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">{stats.overallMastery}%</span>
            <span className="text-[10px] text-foreground-muted uppercase">Mastery</span>
          </div>

          <span className="text-border-strong">|</span>

          {/* Accuracy */}
          <div className="flex items-center gap-1 text-foreground" title={t.common.accuracy}>
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold">{stats.accuracyRate}%</span>
            <span className="text-[10px] text-foreground-muted uppercase">Acc</span>
          </div>

          <span className="text-border-strong">|</span>

          {/* Day Streak */}
          <div className="flex items-center gap-1 text-foreground" title={t.common.streak}>
            <Flame className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="font-bold text-accent">{stats.currentStreak}</span>
            <span className="text-[10px] text-foreground-muted uppercase">Streak</span>
          </div>
        </div>

        {/* Right: Language Pill, Theme Toggle, Mobile Menu */}
        <div className="flex items-center gap-2 relative">
          {/* Dual Language Selector Dropdown */}
          <div className="relative">
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
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-1.5 rounded-lg border border-border text-foreground-secondary hover:text-foreground"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-border bg-surface p-4 flex flex-col gap-3 animate-slide-up shadow-xl">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "bg-accent/10 text-accent font-bold"
                    : "text-foreground-secondary hover:bg-surface-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
