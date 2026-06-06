import { NextResponse } from "next/server";
import { demoComments, mapCommentRow, type CommentRow } from "@/lib/comment-mappers";
import { ensureProfileForUser } from "@/lib/profile-helpers";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ comments: demoComments });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id,body,created_at,profiles(display_name)")
    .eq("post_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: (data as unknown as CommentRow[]).map(mapCommentRow) });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body?.body || String(body.body).trim().length < 2) {
    return NextResponse.json({ error: "评论至少需要 2 个字。" }, { status: 400 });
  }

  const sessionClient = await createSupabaseServerClient();
  const adminClient = createServerSupabaseClient();
  if (!sessionClient || !adminClient) {
    return NextResponse.json(
      { comment: { id: `demo-${Date.now()}`, author: "演示用户", body: body.body, createdAt: new Date().toISOString() } },
      { status: 201 },
    );
  }

  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "请先登录后再评论。" }, { status: 401 });
  }

  const { error: profileError } = await ensureProfileForUser(adminClient, user);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { data, error } = await adminClient
    .from("comments")
    .insert({ post_id: id, user_id: user.id, body: String(body.body).trim() })
    .select("id,body,created_at,profiles(display_name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comment: mapCommentRow(data as unknown as CommentRow) }, { status: 201 });
}
