"use client";

import React, { useState } from "react";
import { FormulaAnatomyPart } from "@/lib/content/types";
import { useI18n } from "@/lib/i18n/I18nContext";
import { HelpCircle, ChevronRight } from "lucide-react";

interface FormulaAnatomyProps {
  formula: string;
  parts: FormulaAnatomyPart[];
  onHoverColumn?: (columnLetter: string | null) => void;
}

export const FormulaAnatomy: React.FC<FormulaAnatomyProps> = ({
  formula,
  parts,
  onHoverColumn,
}) => {
  const { interfaceLocale, t } = useI18n();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleMouseEnter = (idx: number, colLetter?: string) => {
    setHoveredIdx(idx);
    if (onHoverColumn && colLetter) {
      onHoverColumn(colLetter);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
    if (onHoverColumn) {
      onHoverColumn(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t.learnStage.formulaAnatomy}
          </h4>
        </div>
        <span className="text-[11px] text-foreground-muted flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          {t.learnStage.anatomyTip}
        </span>
      </div>

      {/* Formula Code Highlighting Bar */}
      <div className="p-3 bg-surface-secondary rounded-lg border border-border font-mono text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
        <span className="text-foreground-muted font-bold">=</span>
        {parts.map((part, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <span
              key={idx}
              onMouseEnter={() => handleMouseEnter(idx, part.targetColumnLetter)}
              onMouseLeave={handleMouseLeave}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                isHovered
                  ? "bg-accent text-accent-foreground font-bold shadow-sm scale-105"
                  : "bg-surface text-foreground hover:bg-accent/15 hover:text-accent font-medium"
              }`}
            >
              {part.code}
            </span>
          );
        })}
      </div>

      {/* Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {parts.map((part, idx) => {
          const isHovered = hoveredIdx === idx;
          const label = interfaceLocale === "tr" ? part.labelTr : part.labelEn;
          const desc = interfaceLocale === "tr" ? part.descTr : part.descEn;

          return (
            <div
              key={idx}
              onMouseEnter={() => handleMouseEnter(idx, part.targetColumnLetter)}
              onMouseLeave={handleMouseLeave}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isHovered
                  ? "border-accent bg-accent-subtle/30 shadow-sm translate-y-[-2px]"
                  : "border-border bg-surface-secondary/40 hover:border-border-strong hover:bg-surface-secondary/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {label}
                </span>
                <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-surface border border-border/80 text-foreground">
                  {part.code}
                </span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
