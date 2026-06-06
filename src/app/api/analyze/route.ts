import { NextResponse } from "next/server";
import { createStyleRecommendation } from "@/lib/recommendations";
import type { RecommendationInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RecommendationInput>;
    const recommendation = createStyleRecommendation({
      gender: body.gender ?? "female",
      ageRange: body.ageRange ?? "25-34",
      bodyType: body.bodyType ?? "自然体型",
      height: body.height ?? "168",
      stylePreference: body.stylePreference ?? "通勤、轻熟、干净利落",
      occasion: body.occasion ?? "日常",
      avoid: body.avoid,
      photoLabel: body.photoLabel,
    });

    return NextResponse.json({ recommendation });
  } catch {
    return NextResponse.json({ error: "无法解析请求，请检查输入信息。" }, { status: 400 });
  }
}
