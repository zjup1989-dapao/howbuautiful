import { createServerSupabaseClient } from "./supabase";
import type { OutfitCandidate, StyleRecommendation } from "./types";

export type ProfileUploadRow = {
  id: string;
  original_filename: string | null;
  storage_path: string;
  created_at: string;
};

export type ProfilePlanRow = {
  id: string;
  title: string;
  ai_score: number | string;
  preview_image_url: string | null;
  created_at: string;
};

export type ProfilePostRow = {
  id: string;
  title: string;
  image_url: string;
  ai_score: number | string;
  average_user_score: number | string | null;
  comment_count: number | string | null;
  created_at: string;
};

export type ProfilePlanDetailRow = ProfilePlanRow & {
  selected_assets: unknown;
  tuning: unknown;
  recommendation: unknown;
};

export type ProfileArchive = {
  uploads: ProfileUpload[];
  plans: ProfilePlan[];
  posts: ProfilePost[];
};

export type ProfileUpload = {
  id: string;
  fileName: string;
  storagePath: string;
  createdAt: string;
};

export type ProfilePlan = {
  id: string;
  title: string;
  aiScore: number;
  previewImage: string | null;
  createdAt: string;
};

export type ProfilePost = {
  id: string;
  title: string;
  image: string;
  aiScore: number;
  averageUserScore: number;
  commentCount: number;
  createdAt: string;
};

export type ProfilePlanDetail = ProfilePlan & {
  selectedAssetIds: OutfitCandidate["assets"];
  tuning: OutfitCandidate["tuning"];
  recommendation: StyleRecommendation | null;
  previewCandidate: OutfitCandidate;
};

const fallbackAssets: OutfitCandidate["assets"] = {
  hair: "hair-sleek-bob",
  top: "top-amber-knit",
  bottom: "bottom-ink-trousers",
  outerwear: "outer-cream-blazer",
  shoes: "shoes-black-loafer",
  accessory: "acc-silver-chain",
};

export function mapProfileUploadRow(row: ProfileUploadRow): ProfileUpload {
  return {
    id: row.id,
    fileName: row.original_filename || "未命名照片",
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

export function mapProfilePlanRow(row: ProfilePlanRow): ProfilePlan {
  return {
    id: row.id,
    title: row.title,
    aiScore: Number(row.ai_score),
    previewImage: row.preview_image_url,
    createdAt: row.created_at,
  };
}

export function mapProfilePostRow(row: ProfilePostRow): ProfilePost {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    aiScore: Number(row.ai_score),
    averageUserScore: Number(row.average_user_score ?? 0),
    commentCount: Number(row.comment_count ?? 0),
    createdAt: row.created_at,
  };
}

export function mapProfilePlanDetailRow(row: ProfilePlanDetailRow): ProfilePlanDetail {
  const plan = mapProfilePlanRow(row);
  const selectedAssetIds = parseSelectedAssets(row.selected_assets);
  const tuning = parseTuning(row.tuning);
  const recommendation = parseRecommendation(row.recommendation);
  const firstCandidate = recommendation?.candidates[0];

  return {
    ...plan,
    selectedAssetIds,
    tuning,
    recommendation,
    previewCandidate: {
      id: row.id,
      title: row.title,
      score: Number(row.ai_score),
      reason: firstCandidate?.reason || recommendation?.colorAdvice || "这套方案来自你的 AI 搭配草稿。",
      tags: recommendation?.styleKeywords?.length ? recommendation.styleKeywords : (firstCandidate?.tags ?? []),
      assets: selectedAssetIds,
      tuning,
    },
  };
}

export async function getProfileArchive(userId: string): Promise<ProfileArchive> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return { uploads: [], plans: [], posts: [] };
  }

  const [uploadsResult, plansResult, postsResult] = await Promise.all([
    supabase
      .from("uploads")
      .select("id,original_filename,storage_path,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("outfit_plans")
      .select("id,title,ai_score,preview_image_url,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("post_stats")
      .select("id,title,image_url,ai_score,average_user_score,comment_count,created_at,user_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    uploads: uploadsResult.error ? [] : ((uploadsResult.data ?? []) as ProfileUploadRow[]).map(mapProfileUploadRow),
    plans: plansResult.error ? [] : ((plansResult.data ?? []) as ProfilePlanRow[]).map(mapProfilePlanRow),
    posts: postsResult.error ? [] : ((postsResult.data ?? []) as ProfilePostRow[]).map(mapProfilePostRow),
  };
}

export async function getProfilePlanDetail(userId: string, planId: string): Promise<ProfilePlanDetail | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("outfit_plans")
    .select("id,title,ai_score,preview_image_url,selected_assets,tuning,recommendation,created_at")
    .eq("id", planId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return mapProfilePlanDetailRow(data as ProfilePlanDetailRow);
}

function parseSelectedAssets(value: unknown): OutfitCandidate["assets"] {
  if (!value || typeof value !== "object") return fallbackAssets;
  const record = value as Partial<Record<keyof OutfitCandidate["assets"], unknown>>;

  return {
    hair: readString(record.hair, fallbackAssets.hair),
    top: readString(record.top, fallbackAssets.top),
    bottom: readString(record.bottom, fallbackAssets.bottom),
    outerwear: readString(record.outerwear, fallbackAssets.outerwear),
    shoes: readString(record.shoes, fallbackAssets.shoes),
    accessory: readString(record.accessory, fallbackAssets.accessory),
  };
}

function parseTuning(value: unknown): OutfitCandidate["tuning"] {
  if (!value || typeof value !== "object") {
    return { silhouette: "自定义", saturation: 50, formality: 50 };
  }
  const record = value as Partial<Record<keyof OutfitCandidate["tuning"], unknown>>;

  return {
    silhouette: readString(record.silhouette, "自定义"),
    saturation: readNumber(record.saturation, 50),
    formality: readNumber(record.formality, 50),
  };
}

function parseRecommendation(value: unknown): StyleRecommendation | null {
  if (!value || typeof value !== "object") return null;
  const recommendation = value as StyleRecommendation;
  if (!Array.isArray(recommendation.strengths) || !Array.isArray(recommendation.improvements)) return null;
  if (!Array.isArray(recommendation.styleKeywords) || !Array.isArray(recommendation.candidates)) return null;
  return recommendation;
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function readNumber(value: unknown, fallback: number) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}
