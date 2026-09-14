"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLearningArea } from "@/lib/context/LearningAreaContext";

export default function LearnFinancialPage() {
  const router = useRouter();
  const { setLearningArea } = useLearningArea();

  useEffect(() => {
    setLearningArea("financial-excel");
    router.replace("/");
  }, [router, setLearningArea]);

  return null;
}
