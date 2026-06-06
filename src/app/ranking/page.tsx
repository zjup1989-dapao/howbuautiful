import { Crown } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { getCommunityPosts } from "@/lib/posts-data";
import { rankPosts } from "@/lib/rankings";
import type { RankingMetric, RankingPeriod } from "@/lib/types";

const periodLabels: Record<RankingPeriod, string> = {
  day: "日榜",
  week: "周榜",
  month: "月榜",
};

const metricLabels: Record<RankingMetric, string> = {
  ai: "AI评分",
  user: "用户均分",
  hot: "评论热度",
};

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: RankingPeriod; metric?: RankingMetric }>;
}) {
  const params = await searchParams;
  const period = params.period ?? "week";
  const metric = params.metric ?? "user";
  const posts = await getCommunityPosts();
  const ranked = rankPosts(posts, {
    period,
    metric,
    now: new Date(),
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-black p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Ranking</p>
          <h1 className="mt-3 text-5xl font-black leading-none md:text-7xl">排行榜</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
            支持日榜、周榜、月榜，以及 AI 评分、用户均分、评论热度排序。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(periodLabels).map(([key, label]) => (
              <a
                key={key}
                href={`/ranking?period=${key}&metric=${metric}`}
                className={`rounded-full px-4 py-2 text-sm font-black ${period === key ? "bg-white text-black" : "border border-white/25"}`}
              >
                {label}
              </a>
            ))}
            {Object.entries(metricLabels).map(([key, label]) => (
              <a
                key={key}
                href={`/ranking?period=${period}&metric=${key}`}
                className={`rounded-full px-4 py-2 text-sm font-black ${metric === key ? "bg-amber-300 text-black" : "border border-white/25"}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-6 divide-y divide-black/10 overflow-hidden rounded-lg border border-black/10 bg-white">
          {ranked.map((post, index) => (
            <div key={post.id} className="grid gap-4 p-4 md:grid-cols-[80px_160px_1fr_auto] md:items-center">
              <div className="flex items-center gap-2 text-4xl font-black">
                {index === 0 ? <Crown className="text-amber-500" size={28} /> : null}
                {index + 1}
              </div>
              <img src={post.image} alt={post.title} className="h-32 w-full rounded-md object-cover md:w-40" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">{post.planTitle}</p>
                <h2 className="mt-2 text-2xl font-black">{post.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{post.caption}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center md:w-64">
                <Mini label="AI" value={post.aiScore.toString()} />
                <Mini label="均分" value={post.averageUserScore.toFixed(1)} />
                <Mini label="评论" value={post.commentCount.toString()} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-100 p-3">
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs font-bold text-zinc-500">{label}</p>
    </div>
  );
}
