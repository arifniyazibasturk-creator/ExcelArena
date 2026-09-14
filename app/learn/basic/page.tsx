"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLearningArea } from "@/lib/context/LearningAreaContext";

export default function LearnBasicPage() {
  const router = useRouter();
  const { setLearningArea } = useLearningArea();

  useEffect(() => {
    setLearningArea("basic-excel");
    router.replace("/");
  }, [router, setLearningArea]);

  return null;
}
