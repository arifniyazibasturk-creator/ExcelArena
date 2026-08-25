"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { FORMULA_DEFINITIONS } from "@/lib/i18n/formulaLocale";

interface FormulaBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  submitButtonText?: string;
  suggestedFormula?: string;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder,
  submitButtonText,
  suggestedFormula,
}) => {
  const { t, resolvedFormulaLocale, resolveFunction, getSyntaxExample } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeSyntaxHint, setActiveSyntaxHint] = useState<string | null>(null);

  // Live syntax helper detection as user types
  useEffect(() => {
    if (!value) {
      setActiveSyntaxHint(null);
      return;
    }

    const match = value.match(/^[=]?([A-Za-zÇĞİÖŞÜçğıöşü_]+)\(/i);
    if (match && match[1]) {
      const canonical = resolveFunction(match[1]);
      if (canonical) {
        setActiveSyntaxHint(getSyntaxExample(canonical));
        return;
      }
    }
    setActiveSyntaxHint(null);
  }, [value, resolveFunction, getSyntaxExample]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleApplySuggestion = () => {
    if (suggestedFormula) {
      onChange(suggestedFormula);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1.5 shadow-sm transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
        {/* fx symbol box */}
        <div className="flex items-center justify-center px-2.5 py-1.5 bg-surface-secondary text-foreground-muted font-mono font-bold text-xs rounded select-none border border-border/60">
          <span className="italic font-serif text-sm text-accent">fx</span>
        </div>

        {/* Input field */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t.practiceStage.formulaInputPlaceholder}
            disabled={disabled || isLoading}
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent px-2 py-1 text-sm font-mono text-foreground placeholder:text-foreground-muted focus:outline-none"
          />
        </div>

        {/* Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-secondary rounded transition-colors"
            title={t.common.reset}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Submit / Check Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isLoading || !value.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-semibold rounded-md shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>{submitButtonText || t.common.checkFormula}</span>
        </button>
      </div>

      {/* Live Syntax Helper Banner */}
      {activeSyntaxHint && (
        <div className="px-3 py-1 bg-surface-secondary/70 border border-border/80 rounded text-[11px] font-mono text-foreground-secondary flex items-center gap-2 animate-fade-in">
          <span className="text-accent font-bold">Syntax:</span>
          <span className="text-foreground">{activeSyntaxHint}</span>
        </div>
      )}
    </div>
  );
};
