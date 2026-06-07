"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, Star } from "lucide-react";
import type { DisplayComment } from "@/lib/comment-mappers";

type AuthStatus = {
  configured: boolean;
  authenticated: boolean;
  email: string | null;
};

export function PostInteractions({
  postId,
  initialComments,
  initialAuthStatus,
}: {
  postId: string;
  initialComments: DisplayComment[];
  initialAuthStatus?: AuthStatus;
}) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    initialAuthStatus ?? { configured: false, authenticated: false, email: null },
  );
  const [comments, setComments] = useState(initialComments);
  const [commentBody, setCommentBody] = useState("");
  const [score, setScore] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<"comment" | "rating" | "">("");

  useEffect(() => {
    fetch("/api/auth/status")
      .then((response) => response.json())
      .then(setAuthStatus)
      .catch(() => setAuthStatus({ configured: false, authenticated: false, email: null }));
  }, []);

  async function submitRating(nextScore: number) {
    setScore(nextScore);

    if (!authStatus.authenticated) {
      setMessage("当前为演示模式。登录后可以提交真实评分。");
      return;
    }

    setLoading("rating");
    const response = await fetch(`/api/posts/${postId}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: nextScore }),
    });
    const data = await response.json();
    setLoading("");

    setMessage(response.ok ? "评分已提交。" : data.error ?? "评分失败，请稍后重试。");
  }

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authStatus.authenticated) {
      setMessage("当前为演示模式。登录后可以提交真实评论。");
      return;
    }

    setLoading("comment");
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: commentBody }),
    });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "评论失败，请稍后重试。");
      return;
    }

    setComments((current) => [data.comment, ...current]);
    setCommentBody("");
    setMessage("评论已发布。");
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">评价与评论</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {authStatus.authenticated ? `已登录：${authStatus.email}` : "未登录也能浏览评论，登录后可以评分和评论。"}
          </p>
        </div>
        {!authStatus.authenticated ? (
          <Link href="/login" className="inline-flex h-10 items-center rounded-full bg-black px-4 text-sm font-black text-white">
            前往登录
          </Link>
        ) : null}
      </div>

      <div className="mt-5 rounded-lg bg-zinc-100 p-4">
        <p className="text-sm font-black">给这套搭配评分</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => submitRating(value)}
              disabled={loading === "rating"}
              className={`inline-flex h-10 items-center gap-1 rounded-full px-4 text-sm font-black transition ${
                value <= score ? "bg-amber-300 text-black" : "bg-white text-zinc-500"
              }`}
            >
              <Star size={15} className={value <= score ? "fill-black" : ""} />
              {value}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submitComment} className="mt-5 space-y-3">
        <label className="block">
          <span className="text-sm font-black">写一条评论</span>
          <textarea
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            minLength={2}
            placeholder="说说这套搭配哪里打动你..."
            className="mt-2 min-h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black"
          />
        </label>
        <button
          type="submit"
          disabled={loading === "comment"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {loading === "comment" ? "发布中..." : "发布评论"}
        </button>
      </form>

      {message ? <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-900">{message}</p> : null}

      <div className="mt-5 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-md bg-zinc-100 p-4">
            <p className="flex items-center gap-2 text-sm font-black">
              <MessageCircle size={14} />
              {comment.author}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{comment.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
