import { demoPosts } from "./demo-data";
import { mapPostStatsRow, type PostStatsRow } from "./post-mappers";
import { createSupabaseServerClient } from "./supabase-server";
import type { CommunityPost } from "./types";

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoPosts;

  const { data, error } = await supabase
    .from("post_stats")
    .select(
      "id,title,caption,image_url,tags,ai_score,average_user_score,comment_count,created_at,author_name,plan_title",
    )
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data || data.length === 0) return demoPosts;
  return (data as unknown as PostStatsRow[]).map(mapPostStatsRow);
}

export async function getCommunityPost(id: string): Promise<CommunityPost | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoPosts.find((post) => post.id === id) ?? null;

  const { data, error } = await supabase
    .from("post_stats")
    .select(
      "id,user_id,title,caption,image_url,tags,ai_score,average_user_score,comment_count,created_at,author_name,plan_title",
    )
    .eq("id", id)
    .single();

  if (error || !data) return demoPosts.find((post) => post.id === id) ?? null;
  return mapPostStatsRow(data as unknown as PostStatsRow);
}
