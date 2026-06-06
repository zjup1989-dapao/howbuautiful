"use client";

import { useState } from "react";
import { Clock, KeyRound, Mail } from "lucide-react";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      setMessage("当前未配置 Supabase 环境变量。复制 .env.example 到 .env.local 后即可启用邮箱验证码登录。");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      },
    });

    setLoading(false);
    setMessage(error ? error.message : "验证码链接已发送，请查看邮箱。只使用最新收到的那一封邮件。");
  }

  async function devLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDevLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/dev-password-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: devEmail,
        password: devPassword,
      }),
    });
    const data = await response.json();
    setDevLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "开发登录失败。");
      return;
    }

    window.location.href = "/profile";
  }

  return (
    <div className="mx-auto max-w-md space-y-5 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Magic Link</p>
          <h1 className="mt-2 text-3xl font-black">邮箱验证码登录</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            浏览内容无需登录，发布搭配、评论和评分时需要登录。{isSupabaseConfigured ? "" : "当前为未配置演示模式。"}
          </p>
        </div>
        <div className="rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          <p className="flex items-center gap-2 font-black">
            <Clock size={16} />
            如果出现 email rate limit exceeded
          </p>
          <p className="mt-1">先等待一段时间再发送。不要连续点击发送按钮，也不要使用旧邮件链接。</p>
        </div>
        <label className="block">
          <span className="text-sm font-bold">邮箱</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            className="mt-2 h-12 w-full rounded-md border border-black/15 px-4 outline-none transition focus:border-black"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Mail size={16} />
          {loading ? "发送中..." : "发送登录链接"}
        </button>
      </form>

      {process.env.NODE_ENV !== "production" ? (
        <form onSubmit={devLogin} className="space-y-3 border-t border-black/10 pt-5">
          <p className="flex items-center gap-2 text-sm font-black">
            <KeyRound size={16} />
            本地开发备用登录
          </p>
          <p className="text-xs leading-5 text-zinc-500">
            邮箱链接限流时使用。仅本地开发环境显示，会创建或更新一个已确认的测试用户。
          </p>
          <input
            value={devEmail}
            onChange={(event) => setDevEmail(event.target.value)}
            type="email"
            required
            placeholder="dev@example.com"
            className="h-11 w-full rounded-md border border-black/15 px-4 text-sm outline-none transition focus:border-black"
          />
          <input
            value={devPassword}
            onChange={(event) => setDevPassword(event.target.value)}
            type="password"
            required
            minLength={8}
            placeholder="至少 8 位密码"
            className="h-11 w-full rounded-md border border-black/15 px-4 text-sm outline-none transition focus:border-black"
          />
          <button
            type="submit"
            disabled={devLoading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <KeyRound size={16} />
            {devLoading ? "登录中..." : "创建/登录测试账号"}
          </button>
        </form>
      ) : null}

      {message ? <p className="rounded-md bg-zinc-100 p-3 text-sm font-semibold text-zinc-700">{message}</p> : null}
    </div>
  );
}
