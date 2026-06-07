import { createServerSupabaseClient } from "./supabase";

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
