"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import { progressService } from "@/lib/services/progress";
import {
  Globe,
  Code2,
  Sun,
  Moon,
  Laptop,
  Trash2,
  Check,
  Settings as SettingsIcon,
} from "lucide-react";

export default function SettingsPage() {
  const {
    interfaceLocale,
    setInterfaceLocale,
    formulaLocaleSetting,
    setFormulaLocaleSetting,
    t,
  } = useI18n();
  const { theme, setTheme } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppLayout showLeftNav={false}>
      <div className="flex flex-col gap-8 pb-16 max-w-3xl mx-auto animate-fade-in">
        {/* Page Title */}
        <div className="flex flex-col gap-1 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-accent">
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">
              Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {t.settings.title}
          </h1>
        </div>

        {/* 1. Interface Language Setting */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <Globe className="w-4 h-4 text-accent" />
                <span>{t.settings.interfaceLanguage}</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {t.settings.interfaceLanguageDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                setInterfaceLocale("en");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                interfaceLocale === "en"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <div>
                <span className="block text-sm font-bold">English</span>
                <span className="text-[11px] text-foreground-muted font-normal">
                  Standard International
                </span>
              </div>
              {interfaceLocale === "en" && <Check className="w-4 h-4 text-accent" />}
            </button>

            <button
              onClick={() => {
                setInterfaceLocale("tr");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                interfaceLocale === "tr"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <div>
                <span className="block text-sm font-bold">Türkçe</span>
                <span className="text-[11px] text-foreground-muted font-normal">
                  Yerel Dil Desteği
                </span>
              </div>
              {interfaceLocale === "tr" && <Check className="w-4 h-4 text-accent" />}
            </button>
          </div>
        </div>

        {/* 2. Excel Formula Language Setting */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <Code2 className="w-4 h-4 text-accent" />
                <span>{t.settings.formulaLanguage}</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {t.settings.formulaLanguageDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => {
                setFormulaLocaleSetting("auto");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                formulaLocaleSetting === "auto"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <div>
                <span className="block text-sm font-bold">Auto</span>
                <span className="text-[11px] text-foreground-muted font-normal">
                  {t.settings.autoFormulaDesc}
                </span>
              </div>
              {formulaLocaleSetting === "auto" && <Check className="w-4 h-4 text-accent" />}
            </button>

            <button
              onClick={() => {
                setFormulaLocaleSetting("en");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                formulaLocaleSetting === "en"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <div>
                <span className="block text-sm font-bold font-mono">=SUM()</span>
                <span className="text-[11px] text-foreground-muted font-normal">
                  English Syntax
                </span>
              </div>
              {formulaLocaleSetting === "en" && <Check className="w-4 h-4 text-accent" />}
            </button>

            <button
              onClick={() => {
                setFormulaLocaleSetting("tr");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                formulaLocaleSetting === "tr"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <div>
                <span className="block text-sm font-bold font-mono">=TOPLA()</span>
                <span className="text-[11px] text-foreground-muted font-normal">
                  Türkçe Sözdizimi
                </span>
              </div>
              {formulaLocaleSetting === "tr" && <Check className="w-4 h-4 text-accent" />}
            </button>
          </div>
        </div>

        {/* 3. Appearance / Theme */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-base text-foreground">{t.settings.appearance}</span>
            <p className="text-xs text-foreground-secondary">{t.settings.appearanceDesc}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => {
                setTheme("light");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                theme === "light"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span>{t.settings.themeLight}</span>
            </button>

            <button
              onClick={() => {
                setTheme("dark");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <Moon className="w-5 h-5 text-blue-400" />
              <span>{t.settings.themeDark}</span>
            </button>

            <button
              onClick={() => {
                setTheme("system");
                showToast(t.settings.savedToast);
              }}
              className={`p-3.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                theme === "system"
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-xs"
                  : "border-border bg-surface-secondary/40 hover:bg-surface-secondary text-foreground"
              }`}
            >
              <Laptop className="w-5 h-5 text-foreground-muted" />
              <span>{t.settings.themeSystem}</span>
            </button>
          </div>
        </div>

        {/* 4. Danger Zone Data Management */}
        <div className="p-5 rounded-2xl bg-surface border border-rose-200 dark:border-rose-900/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-rose-600 dark:text-rose-400">
              {t.settings.dangerZone}
            </span>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              {t.settings.resetDataDesc}
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm(t.profile.resetConfirm)) {
                progressService.resetAll();
                showToast("Local progress reset.");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-300 dark:border-rose-800 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.settings.resetData}</span>
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-slide-up">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
