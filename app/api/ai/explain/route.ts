import { NextRequest, NextResponse } from "next/server";
import { aiProvider } from "@/lib/ai/gemini";
import { FallbackAIProvider } from "@/lib/ai/fallback";
import { GenerateFeedbackParams } from "@/lib/ai/provider";

const fallback = new FallbackAIProvider();

export async function POST(req: NextRequest) {
  try {
    const body: GenerateFeedbackParams = await req.json();
    if (!body.task || !body.userFormula) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const result = await aiProvider.generateFeedback(body);
      return NextResponse.json(result);
    } catch {
      const fallbackResult = fallback.generateFeedback(body);
      return NextResponse.json(fallbackResult);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
