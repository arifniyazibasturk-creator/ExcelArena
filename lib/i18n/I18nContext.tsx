"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { InterfaceLocale, FormulaLocaleSetting, ResolvedFormulaLocale, CanonicalFunctionId } from "./types";
import { TRANSLATIONS, TranslationStrings } from "./translations";
import { getLocalizedFunctionName, getLocalizedSyntax, resolveToCanonicalFunction, FORMULA_DEFINITIONS } from "./formulaLocale";

interface I18nContextType {
  interfaceLocale: InterfaceLocale;
  formulaLocaleSetting: FormulaLocaleSetting;
  resolvedFormulaLocale: ResolvedFormulaLocale;
  t: TranslationStrings;
  setInterfaceLocale: (locale: InterfaceLocale) => void;
  setFormulaLocaleSetting: (setting: FormulaLocaleSetting) => void;
  getLocalizedFunction: (canonical: CanonicalFunctionId) => string;
  getSyntaxExample: (canonical: CanonicalFunctionId) => string;
  resolveFunction: (name: string) => CanonicalFunctionId | null;
  localizeFormulaString: (formula: string, targetLocale?: ResolvedFormulaLocale) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [interfaceLocale, setInterfaceLocaleState] = useState<InterfaceLocale>("en");
  const [formulaLocaleSetting, setFormulaLocaleSettingState] = useState<FormulaLocaleSetting>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedUi = localStorage.getItem("excel_arena_ui_lang") as InterfaceLocale | null;
      if (storedUi === "en" || storedUi === "tr") {
        setInterfaceLocaleState(storedUi);
      } else {
        // Detect browser language
        const navLang = navigator.language?.toLowerCase() || "";
        if (navLang.startsWith("tr")) {
          setInterfaceLocaleState("tr");
        }
      }

      const storedFormula = localStorage.getItem("excel_arena_formula_lang") as FormulaLocaleSetting | null;
      if (storedFormula === "auto" || storedFormula === "en" || storedFormula === "tr") {
        setFormulaLocaleSettingState(storedFormula);
      }
    } catch {
      // Ignore storage errors
    }
    setMounted(true);
  }, []);

  const setInterfaceLocale = (locale: InterfaceLocale) => {
    setInterfaceLocaleState(locale);
    try {
      localStorage.setItem("excel_arena_ui_lang", locale);
    } catch {}
  };

  const setFormulaLocaleSetting = (setting: FormulaLocaleSetting) => {
    setFormulaLocaleSettingState(setting);
    try {
      localStorage.setItem("excel_arena_formula_lang", setting);
    } catch {}
  };

  const resolvedFormulaLocale: ResolvedFormulaLocale = useMemo(() => {
    if (formulaLocaleSetting === "auto") {
      return interfaceLocale;
    }
    return formulaLocaleSetting;
  }, [formulaLocaleSetting, interfaceLocale]);

  const t = useMemo(() => {
    return TRANSLATIONS[interfaceLocale] || TRANSLATIONS.en;
  }, [interfaceLocale]);

  const getLocalizedFunction = (canonical: CanonicalFunctionId): string => {
    return getLocalizedFunctionName(canonical, resolvedFormulaLocale);
  };

  const getSyntaxExample = (canonical: CanonicalFunctionId): string => {
    return getLocalizedSyntax(canonical, resolvedFormulaLocale);
  };

  const resolveFunction = (name: string): CanonicalFunctionId | null => {
    return resolveToCanonicalFunction(name);
  };

  /**
   * Helper that replaces canonical or opposite-locale function names in a formula with the user's active formula locale
   */
  const localizeFormulaString = (formula: string, targetLocale?: ResolvedFormulaLocale): string => {
    const loc = targetLocale || resolvedFormulaLocale;
    let result = formula;

    // Iterate through formula definitions and replace tokens
    Object.values(FORMULA_DEFINITIONS).forEach((def) => {
      const targetName = loc === "tr" ? def.tr : def.en;
      const sourceName = loc === "tr" ? def.en : def.tr;

      // Replace function calls e.g. "SUM(" or "=SUM("
      const regex = new RegExp(`([=\\s(,]|^)${sourceName}\\s*\\(`, "gi");
      result = result.replace(regex, `$1${targetName}(`);

      // Also replace canonical if different
      if (def.canonical !== sourceName && def.canonical !== targetName) {
        const canRegex = new RegExp(`([=\\s(,]|^)${def.canonical}\\s*\\(`, "gi");
        result = result.replace(canRegex, `$1${targetName}(`);
      }
    });

    // Replace argument separator if converting to Turkish (`,` to `;`) inside function parens
    if (loc === "tr") {
      // Intelligently convert comma outside quotes
      let inQuote = false;
      let chars = result.split("");
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '"') inQuote = !inQuote;
        else if (chars[i] === "," && !inQuote) {
          chars[i] = ";";
        }
      }
      result = chars.join("");
    }

    return result;
  };

  return (
    <I18nContext.Provider
      value={{
        interfaceLocale,
        formulaLocaleSetting,
        resolvedFormulaLocale,
        t,
        setInterfaceLocale,
        setFormulaLocaleSetting,
        getLocalizedFunction,
        getSyntaxExample,
        resolveFunction,
        localizeFormulaString,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
