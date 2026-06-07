import Link from "next/link";
import { PenLine } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { PostCard } from "@/components/post-card";
import { getCommunityPosts } from "@/lib/posts-data";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function CommunityPage() {
  const [posts, user] = await Promise.all([getCommunityPosts(), getCurrentUser()]);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 rounded-lg bg-black p-6 text-white md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Lookbook</p>
            <h1 className="mt-3 text-5xl font-black leading-none md:text-7xl">社区广场</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
              {user
                ? "浏览真实搭配灵感，也可以从搭配工作室发布你的方案，让其他用户评分和评论。"
                : "未登录也能浏览搭配灵感。真实数据库为空时会先展示示例内容，登录发布后这里会自动切换为真实帖子。"}
            </p>
          </div>
          <Link
            href={user ? "/studio" : "/login"}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-black"
          >
            <PenLine size={16} />
            {user ? "发布搭配" : "登录后发布"}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
