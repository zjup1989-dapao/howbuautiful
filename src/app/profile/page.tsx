import Link from "next/link";
import { Lock, Shirt, UserRound } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { demoRecommendation } from "@/lib/demo-data";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const emailName = user?.email?.split("@")[0] ?? "访客";

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg bg-black p-6 text-white">
            <div className="grid size-20 place-items-center rounded-full bg-white text-black">
              <UserRound size={32} />
            </div>
            <h1 className="mt-5 text-4xl font-black">{user ? emailName : "我的造型档案"}</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {user
                ? `已登录：${user.email}。这里会继续扩展真实上传记录、搭配草稿和已发布帖子。`
                : "配置 Supabase 后，这里会展示当前登录用户的上传记录、搭配草稿和已发布帖子。"}
            </p>
            {user ? null : (
              <Link href="/login" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-black">
                <Lock size={16} />
                登录查看
              </Link>
            )}
          </aside>
          <div className="grid gap-5 md:grid-cols-3">
            {demoRecommendation.candidates.map((candidate) => (
              <article key={candidate.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
                <Shirt className="text-amber-500" />
                <h2 className="mt-4 text-2xl font-black">{candidate.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{candidate.reason}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">草稿方案</span>
                  <span className="text-3xl font-black">{candidate.score}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
