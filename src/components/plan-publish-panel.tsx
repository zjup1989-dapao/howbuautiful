"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export function PlanPublishPanel({
  planId,
  title,
  aiScore,
  imageUrl,
  tags,
}: {
  planId: string;
  title: string;
  aiScore: number;
  imageUrl: string;
  tags: string[];
}) {
  const router = useRouter();
  const [postTitle, setPostTitle] = useState(title);
  const [caption, setCaption] = useState("从我的保存方案继续发布，欢迎帮我看看这套搭配适不适合日常穿。");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function publish() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outfitPlanId: planId,
        title: postTitle,
        caption,
        imageUrl,
        tags,
        aiScore,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "发布失败，请稍后重试。");
      return;
    }

    router.push(`/community/${data.post.id}`);
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Publish</p>
      <h2 className="mt-1 text-2xl font-black">发布这个方案</h2>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-xs font-black text-zinc-500">帖子标题</span>
          <input
            value={postTitle}
            onChange={(event) => setPostTitle(event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-black/15 px-3 text-sm outline-none transition focus:border-black"
          />
        </label>
        <label className="block">
          <span className="text-xs font-black text-zinc-500">帖子文案</span>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="mt-1 min-h-28 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black"
          />
        </label>
        <button
          type="button"
          onClick={publish}
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {loading ? "发布中..." : "发布到社区"}
        </button>
        {message ? <p className="rounded-md bg-zinc-100 p-3 text-sm font-semibold text-zinc-700">{message}</p> : null}
      </div>
    </section>
  );
}
