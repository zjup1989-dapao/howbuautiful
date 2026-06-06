import type { RankablePost, RankingMetric, RankingPeriod } from "./types";

type RankingOptions = {
  period: RankingPeriod;
  metric: RankingMetric;
  now?: Date;
};

const periodDays: Record<RankingPeriod, number> = {
  day: 1,
  week: 7,
  month: 30,
};

export function rankPosts<T extends RankablePost>(posts: T[], options: RankingOptions): T[] {
  const now = options.now ?? new Date();
  const windowStart = now.getTime() - periodDays[options.period] * 24 * 60 * 60 * 1000;

  return posts
    .filter((post) => {
      const createdAt = new Date(post.createdAt).getTime();
      return createdAt >= windowStart && createdAt <= now.getTime();
    })
    .toSorted((left, right) => metricValue(right, options.metric) - metricValue(left, options.metric));
}

function metricValue(post: RankablePost, metric: RankingMetric) {
  if (metric === "ai") return post.aiScore;
  if (metric === "user") return post.averageUserScore;
  return post.commentCount;
}
