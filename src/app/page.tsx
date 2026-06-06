import Link from "next/link";
import { ArrowUpRight, MessageCircle, Sparkles, Star } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { PostCard } from "@/components/post-card";
import { demoPosts, demoRecommendation } from "@/lib/demo-data";

export default function Home() {
  const heroLook = demoRecommendation.candidates[0];

  return (
    <PageShell>
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="flex flex-col justify-between rounded-lg bg-white p-5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.18em]">
            <span>Male / Female</span>
            <span>AI Style Lab</span>
          </div>
          <div className="py-8">
            <h1 className="max-w-5xl text-[clamp(4rem,14vw,10.5rem)] font-black leading-[0.82] tracking-normal">
              AI STYLE
            </h1>
            <div className="mt-6 grid gap-6 md:grid-cols-[0.55fr_0.45fr]">
              <p className="max-w-sm text-sm font-semibold leading-6 text-zinc-700">
                上传头像或照片，获得样貌优缺点分析、发型服装推荐、AI 评分和社区反馈。第一版先跑通完整搭配闭环。
              </p>
              <div className="justify-self-start md:justify-self-end">
                <Link
                  href="/studio"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-800"
                >
                  开始搭配
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-amber-300">
            <div className="grid gap-px bg-black/10 md:grid-cols-3">
              {demoPosts.map((post) => (
                <img key={post.id} src={post.image} alt={post.title} className="h-56 w-full object-cover" />
              ))}
            </div>
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="overflow-hidden rounded-lg bg-black text-white">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
              alt="时尚搭配视觉"
              className="h-72 w-full object-cover opacity-90"
            />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Recommended</p>
                <span className="text-4xl font-black">{heroLook.score}</span>
              </div>
              <h2 className="text-4xl font-black leading-none">{heroLook.title}</h2>
              <p className="text-sm leading-6 text-zinc-300">{heroLook.reason}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-black text-white">
            <Metric icon={<Sparkles size={18} />} label="AI 方案" value="3" />
            <Metric icon={<Star size={18} />} label="用户评分" value="4.8" />
            <Metric icon={<MessageCircle size={18} />} label="热门评论" value="42" />
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Community</p>
            <h2 className="text-4xl font-black">今日搭配灵感</h2>
          </div>
          <Link href="/community" className="text-sm font-black underline underline-offset-4">
            查看全部
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {demoPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-3 bg-black p-4">
      <div className="text-amber-300">{icon}</div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">{label}</p>
    </div>
  );
}
