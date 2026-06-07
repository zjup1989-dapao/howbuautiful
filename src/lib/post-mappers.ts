import type { CommunityPost } from "./types";

export type PostStatsRow = {
  id: string;
  user_id?: string | null;
  title: string;
  caption: string;
  image_url: string;
  tags: string[] | null;
  ai_score: number;
  average_user_score: number | string | null;
  comment_count: number | string | null;
  created_at: string;
  author_name?: string | null;
  plan_title?: string | null;
  profiles?: { display_name?: string | null } | null;
  outfit_plans?: { title?: string | null } | null;
};

export function mapPostStatsRow(row: PostStatsRow): CommunityPost {
  return {
    id: row.id,
    authorId: row.user_id ?? undefined,
    title: row.title,
    author: row.author_name || row.profiles?.display_name || "匿名用户",
    caption: row.caption,
    image: row.image_url,
    tags: row.tags ?? [],
    planTitle: row.plan_title || row.outfit_plans?.title || "AI 搭配方案",
    createdAt: row.created_at,
    aiScore: row.ai_score,
    averageUserScore: Number(row.average_user_score ?? 0),
    commentCount: Number(row.comment_count ?? 0),
  };
}
