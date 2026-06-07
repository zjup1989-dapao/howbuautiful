"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, CloudUpload, Lock, RefreshCcw, Save, Send, SlidersHorizontal, Upload } from "lucide-react";
import { getAsset, styleAssets } from "@/lib/assets";
import { demoRecommendation } from "@/lib/demo-data";
import type { OutfitCandidate, RecommendationInput, StyleRecommendation } from "@/lib/types";
import { AssetCard } from "./asset-card";
import { LookPreview } from "./look-preview";

type AuthStatus = {
  configured: boolean;
  authenticated: boolean;
  email: string | null;
};

export function StudioClient() {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState("");
  const [activeLook, setActiveLook] = useState(0);
  const [recommendation, setRecommendation] = useState<StyleRecommendation>(demoRecommendation);
  const [form, setForm] = useState<RecommendationInput>({
    gender: "female",
    ageRange: "25-34",
    bodyType: "高挑偏瘦",
    height: "172",
    stylePreference: "通勤、轻熟、干净利落",
    occasion: "工作日约会",
    avoid: "过度甜美和复杂花纹",
  });
  const [selectedAssets, setSelectedAssets] = useState(demoRecommendation.candidates[0].assets);
  const [message, setMessage] = useState("AI 已根据示例资料生成 3 套搭配方案。");
  const [postTitle, setPostTitle] = useState(demoRecommendation.candidates[0].title);
  const [postCaption, setPostCaption] = useState("今天想试试这套 AI 推荐搭配，欢迎给我评分和建议。");
  const [savedPlanId, setSavedPlanId] = useState("");
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    configured: false,
    authenticated: false,
    email: null,
  });
  const [loading, setLoading] = useState<"analyze" | "upload" | "save" | "publish" | "">("");

  const activeCandidate = useMemo<OutfitCandidate>(() => {
    return {
      ...recommendation.candidates[activeLook],
      assets: selectedAssets,
    };
  }, [activeLook, recommendation.candidates, selectedAssets]);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/status")
      .then((response) => response.json())
      .then((data) => {
        if (active) setAuthStatus(data);
      })
      .catch(() => {
        if (active) setAuthStatus({ configured: false, authenticated: false, email: null });
      });

    return () => {
      active = false;
    };
  }, []);

  function updateForm(key: keyof RecommendationInput, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleFile(file?: File) {
    if (!file) return;
    setPhotoFile(file);
    setUploadId("");
    setPhotoUrl(URL.createObjectURL(file));
    setMessage(
      authStatus.authenticated
        ? "照片已加载到本地预览。点击“上传到私密库”后会保存到 private-uploads。"
        : "照片已加载到本地预览。当前未登录，不会上传原始照片。",
    );
  }

  async function uploadPhoto() {
    if (!photoFile) {
      setMessage("请先选择一张头像或全身照片。");
      return;
    }

    if (!authStatus.authenticated) {
      setMessage("当前为演示模式。登录后照片会上传到 private-uploads，并写入 uploads 表。");
      return;
    }

    const formData = new FormData();
    formData.append("file", photoFile);

    setLoading("upload");
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "照片上传失败，请稍后重试。");
      return;
    }

    setUploadId(data.upload.id);
    setMessage("照片已上传到 private-uploads，原图仅当前账号可读取。");
  }

  async function analyze() {
    setLoading("analyze");
    setMessage("");
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "AI 分析失败，请稍后重试。");
      return;
    }

    setRecommendation(data.recommendation);
    setActiveLook(0);
    setSelectedAssets(data.recommendation.candidates[0].assets);
    setPostTitle(data.recommendation.candidates[0].title);
    setMessage("已生成新的 AI 分析和 3 套候选方案。");
  }

  async function savePlan() {
    if (!authStatus.authenticated) {
      setMessage("当前为演示模式。登录后可以把搭配方案保存到 Supabase。");
      return;
    }

    setLoading("save");
    const response = await fetch("/api/outfit-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: activeCandidate.title,
        aiScore: activeCandidate.score,
        recommendation,
        selectedAssets,
        tuning: activeCandidate.tuning,
        uploadId: uploadId || undefined,
        previewImageUrl: getPreviewImage(activeCandidate),
      }),
    });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "保存失败，请稍后重试。");
      return;
    }

    setSavedPlanId(data.plan.id);
    setMessage("搭配方案已保存。你现在可以把它发布到社区。");
  }

  async function publishPost() {
    if (!authStatus.authenticated) {
      setMessage("当前为演示模式。登录后可以发布到社区并参与排行榜。");
      return;
    }

    setLoading("publish");
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: postTitle || activeCandidate.title,
        caption: postCaption,
        outfitPlanId: savedPlanId || undefined,
        imageUrl: getPreviewImage(activeCandidate),
        tags: activeCandidate.tags,
        aiScore: activeCandidate.score,
      }),
    });
    const data = await response.json();
    setLoading("");

    if (!response.ok) {
      setMessage(data.error ?? "发布失败，请稍后重试。");
      return;
    }

    setMessage(`发布成功：${data.post.title ?? postTitle}，正在打开帖子详情。`);
    router.push(`/community/${data.post.id}`);
  }

  function chooseLook(index: number) {
    setActiveLook(index);
    setSelectedAssets(recommendation.candidates[index].assets);
    setPostTitle(recommendation.candidates[index].title);
  }

  function selectAsset(id: string) {
    const asset = styleAssets.find((item) => item.id === id);
    if (!asset) return;
    setSelectedAssets((current) => ({ ...current, [asset.type]: id }));
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
      <aside className="space-y-5">
        <section className={`rounded-lg border p-4 shadow-sm ${authStatus.authenticated ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
          <p className="flex items-center gap-2 text-sm font-black">
            <Lock size={16} />
            {authStatus.authenticated ? "已连接真实账号" : "当前为演示模式"}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-700">
            {authStatus.authenticated
              ? `已登录：${authStatus.email}，可以上传照片、保存方案和发布帖子。`
              : authStatus.configured
                ? "Supabase 已配置，但你还未登录。邮箱限流恢复后登录即可真实写入。"
                : "Supabase 未配置，当前只能预览示例体验。"}
          </p>
          {!authStatus.authenticated ? (
            <Link href="/login" className="mt-3 inline-flex h-9 items-center rounded-full bg-black px-4 text-xs font-black text-white">
              前往登录
            </Link>
          ) : null}
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Upload</p>
          <h1 className="mt-2 text-3xl font-black leading-none">AI 搭配工作室</h1>
          <label className="mt-5 grid aspect-[4/5] cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-black/25 bg-zinc-100">
            {photoUrl ? (
              <img src={photoUrl} alt="上传照片预览" className="size-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-3 text-sm font-bold text-zinc-500">
                <Camera size={32} />
                上传头像或全身照片
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
          </label>
          <p className="mt-3 text-xs leading-5 text-zinc-500">原图默认私密。公开帖子只展示你选择发布的搭配方案图。</p>
          <button
            type="button"
            onClick={uploadPhoto}
            disabled={loading === "upload"}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 text-sm font-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "upload" ? <RefreshCcw size={16} className="animate-spin" /> : <CloudUpload size={16} />}
            {loading === "upload" ? "上传中..." : authStatus.authenticated ? "上传到私密库" : "登录后上传"}
          </button>
          {uploadId ? <p className="mt-3 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800">已保存上传记录：{uploadId}</p> : null}
        </section>

        <section className="space-y-4 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <Input label="年龄段" value={form.ageRange} onChange={(value) => updateForm("ageRange", value)} />
            <Input label="身高" value={form.height} onChange={(value) => updateForm("height", value)} />
          </div>
          <Input label="体型描述" value={form.bodyType} onChange={(value) => updateForm("bodyType", value)} />
          <Input label="风格偏好" value={form.stylePreference} onChange={(value) => updateForm("stylePreference", value)} />
          <Input label="使用场景" value={form.occasion} onChange={(value) => updateForm("occasion", value)} />
          <Input label="不喜欢/避雷" value={form.avoid ?? ""} onChange={(value) => updateForm("avoid", value)} />
          <button
            type="button"
            onClick={analyze}
            disabled={loading === "analyze"}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "analyze" ? <RefreshCcw size={16} className="animate-spin" /> : <Upload size={16} />}
            {loading === "analyze" ? "分析中..." : "生成 AI 推荐"}
          </button>
          {message ? <p className="rounded-md bg-zinc-100 p-3 text-sm font-semibold text-zinc-700">{message}</p> : null}
        </section>
      </aside>

      <section className="min-w-0 space-y-6">
        <LookPreview candidate={activeCandidate} />
        <div className="grid gap-4 md:grid-cols-3">
          {recommendation.candidates.map((candidate, index) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => chooseLook(index)}
              className={`rounded-lg border p-4 text-left transition ${
                activeLook === index ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] opacity-70">方案 0{index + 1}</p>
              <h3 className="mt-2 text-lg font-black">{candidate.title}</h3>
              <p className="mt-2 text-sm leading-6 opacity-75">{candidate.reason}</p>
            </button>
          ))}
        </div>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Tune</p>
              <h2 className="text-2xl font-black">预设单品微调</h2>
            </div>
            <button
              type="button"
              onClick={savePlan}
              disabled={loading === "save"}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {loading === "save" ? "保存中..." : authStatus.authenticated ? "保存方案" : "登录后保存"}
            </button>
          </div>
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
            {styleAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={Object.values(selectedAssets).includes(asset.id)}
                onSelect={selectAsset}
              />
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Range label="色彩饱和度" value={activeCandidate.tuning.saturation} />
            <Range label="正式度" value={activeCandidate.tuning.formality} />
          </div>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Publish</p>
              <h2 className="text-2xl font-black">发布到社区</h2>
            </div>
            <button
              type="button"
              onClick={publishPost}
              disabled={loading === "publish"}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {loading === "publish" ? "发布中..." : authStatus.authenticated ? "发布帖子" : "登录后发布"}
            </button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[0.55fr_1fr]">
            <Input label="帖子标题" value={postTitle} onChange={setPostTitle} />
            <label className="block">
              <span className="text-xs font-black text-zinc-500">帖子文案</span>
              <textarea
                value={postCaption}
                onChange={(event) => setPostCaption(event.target.value)}
                className="mt-1 min-h-24 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-black"
              />
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">发布和保存都需要登录。当前邮箱限流恢复后，登录即可测试真实写入。</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <AnalysisBlock title="样貌优势" items={recommendation.strengths} />
          <AnalysisBlock title="可优化点" items={recommendation.improvements} />
        </section>
      </section>
    </div>
  );
}

function getPreviewImage(candidate: OutfitCandidate) {
  return getAsset(candidate.assets.top)?.image ?? getAsset(candidate.assets.outerwear)?.image ?? "";
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-black text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-black/15 px-3 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function Range({ label, value }: { label: string; value: number }) {
  return (
    <label className="block rounded-lg bg-zinc-100 p-4">
      <span className="flex items-center gap-2 text-sm font-black">
        <SlidersHorizontal size={16} />
        {label}
      </span>
      <input type="range" defaultValue={value} min={0} max={100} className="mt-3 w-full accent-black" />
    </label>
  );
}

function AnalysisBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-black">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
