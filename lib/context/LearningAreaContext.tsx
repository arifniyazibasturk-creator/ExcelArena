"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export type LearningArea = "basic-excel" | "financial-excel";

interface LearningAreaContextType {
  learningArea: LearningArea;
  setLearningArea: (area: LearningArea) => void;
  isBasic: boolean;
  isFinancial: boolean;
}

const LearningAreaContext = createContext<LearningAreaContextType | undefined>(undefined);

const STORAGE_KEY = "excel_arena_active_learning_area";

export function LearningAreaProvider({ children }: { children: React.ReactNode }) {
  const [learningArea, setLearningAreaState] = useState<LearningArea>("basic-excel");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LearningArea | null;
      if (stored && (stored === "basic-excel" || stored === "financial-excel")) {
        setLearningAreaState(stored);
        document.documentElement.setAttribute("data-learning-area", stored);
      } else {
        document.documentElement.setAttribute("data-learning-area", "basic-excel");
      }
    } catch {
      document.documentElement.setAttribute("data-learning-area", "basic-excel");
    }
    setMounted(true);
  }, []);

  const setLearningArea = useCallback((area: LearningArea) => {
    setLearningAreaState(area);
    try {
      localStorage.setItem(STORAGE_KEY, area);
    } catch {
      // Ignore localStorage write error
    }
    document.documentElement.setAttribute("data-learning-area", area);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("excel_arena_learning_area_changed", { detail: { area } })
      );
    }
  }, []);

  const contextValue = useMemo(() => ({
    learningArea,
    setLearningArea,
    isBasic: learningArea === "basic-excel",
    isFinancial: learningArea === "financial-excel",
  }), [learningArea, setLearningArea]);

  return (
    <LearningAreaContext.Provider value={contextValue}>
      {children}
    </LearningAreaContext.Provider>
  );
}

export function useLearningArea() {
  const context = useContext(LearningAreaContext);
  if (!context) {
    throw new Error("useLearningArea must be used within a LearningAreaProvider");
  }
  return context;
}
