import { demoComments, mapCommentRow, type CommentRow, type DisplayComment } from "./comment-mappers";
import { createSupabaseServerClient } from "./supabase-server";

export async function getPostComments(postId: string): Promise<DisplayComment[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoComments;

  const { data, error } = await supabase
    .from("comments")
    .select("id,body,created_at,profiles(display_name)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return demoComments;
  return (data as unknown as CommentRow[]).map(mapCommentRow);
}
