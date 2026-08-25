import { NextRequest, NextResponse } from "next/server";
import { aiProvider } from "@/lib/ai/gemini";
import { FallbackAIProvider } from "@/lib/ai/fallback";
import { GenerateHintParams } from "@/lib/ai/provider";

const fallback = new FallbackAIProvider();

export async function POST(req: NextRequest) {
  try {
    const body: GenerateHintParams = await req.json();
    if (!body.task || !body.expectedConcept) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const result = await aiProvider.generateHint(body);
      return NextResponse.json(result);
    } catch {
      const fallbackResult = fallback.generateHint(body);
      return NextResponse.json(fallbackResult);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate hint" },
      { status: 500 }
    );
  }
}
