import { NextResponse } from "next/server";
import { getCommunityPosts } from "@/lib/posts-data";
import { rankPosts } from "@/lib/rankings";
import type { RankingMetric, RankingPeriod } from "@/lib/types";

const periods = new Set(["day", "week", "month"]);
const metrics = new Set(["ai", "user", "hot"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "week";
  const metric = searchParams.get("metric") ?? "user";

  if (!periods.has(period) || !metrics.has(metric)) {
    return NextResponse.json({ error: "排行榜参数无效。" }, { status: 400 });
  }

  const posts = await getCommunityPosts();
  const ranked = rankPosts(posts, {
    period: period as RankingPeriod,
    metric: metric as RankingMetric,
    now: new Date(),
  });

  return NextResponse.json({ posts: ranked });
}
