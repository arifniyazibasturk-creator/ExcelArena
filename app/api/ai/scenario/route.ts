import { NextRequest, NextResponse } from "next/server";
import { aiProvider } from "@/lib/ai/gemini";
import { FallbackAIProvider } from "@/lib/ai/fallback";
import { GenerateScenarioParams } from "@/lib/ai/provider";

const fallback = new FallbackAIProvider();

export async function POST(req: NextRequest) {
  try {
    const body: GenerateScenarioParams = await req.json();
    if (!body.topic) {
      return NextResponse.json({ error: "Missing required topic field" }, { status: 400 });
    }

    try {
      const result = await aiProvider.generateScenario(body);
      return NextResponse.json(result);
    } catch {
      const fallbackResult = fallback.generateScenario(body);
      return NextResponse.json(fallbackResult);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate scenario" },
      { status: 500 }
    );
  }
}
