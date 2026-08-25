"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useI18n } from "@/lib/i18n/I18nContext";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className="flex items-center gap-1.5 p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-foreground-secondary hover:text-foreground transition-colors text-xs font-medium cursor-pointer"
      title={
        theme === "light"
          ? t.settings.themeLight
          : theme === "dark"
          ? t.settings.themeDark
          : t.settings.themeSystem
      }
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-blue-400" />}
      {theme === "system" && <Laptop className="w-4 h-4 text-foreground-muted" />}
    </button>
  );
};
