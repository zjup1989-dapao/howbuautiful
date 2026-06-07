"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export function PostOwnerActions({ postId, title, caption }: { postId: string; title: string; caption: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftCaption, setDraftCaption] = useState(caption);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<"save" | "delete" | "">("");

  async function save() {
    setLoading("save");
    setMessage("");

    const response = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, caption: draftCaption }),
    });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "保存失败，请稍后重试。");
      return;
    }

    setEditing(false);
    setMessage("帖子已更新。");
    router.refresh();
  }

  async function deletePost() {
    const confirmed = window.confirm("确定删除这条搭配帖吗？删除后评论和评分也会一起移除。");
    if (!confirmed) return;

    setLoading("delete");
    setMessage("");
    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "删除失败，请稍后重试。");
      return;
    }

    router.push("/community");
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Owner</p>
          <h2 className="text-2xl font-black">管理我的帖子</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-black transition hover:border-black"
          >
            <Pencil size={16} />
            {editing ? "收起" : "编辑"}
          </button>
          <button
            type="button"
            onClick={deletePost}
            disabled={loading === "delete"}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {loading === "delete" ? "删除中..." : "删除"}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-black text-zinc-500">帖子标题</span>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-black/15 px-3 text-sm outline-none transition focus:border-black"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black text-zinc-500">帖子文案</span>
            <textarea
              value={draftCaption}
              onChange={(event) => setDraftCaption(event.target.value)}
              className="mt-1 min-h-28 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black"
            />
          </label>
          <button
            type="button"
            onClick={save}
            disabled={loading === "save"}
            className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "save" ? "保存中..." : "保存修改"}
          </button>
        </div>
      ) : null}

      {message ? <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-900">{message}</p> : null}
    </section>
  );
}
