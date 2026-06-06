import { NextResponse } from "next/server";
import { ensureProfileForUser } from "@/lib/profile-helpers";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const score = Number(body?.score);

  if (!Number.isFinite(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "评分需要在 1 到 5 之间。" }, { status: 400 });
  }

  const sessionClient = await createSupabaseServerClient();
  const adminClient = createServerSupabaseClient();
  if (!sessionClient || !adminClient) {
    return NextResponse.json({ rating: { post_id: id, score } }, { status: 201 });
  }

  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "请先登录后再评分。" }, { status: 401 });
  }

  const { error: profileError } = await ensureProfileForUser(adminClient, user);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { data, error } = await adminClient
    .from("ratings")
    .upsert({ post_id: id, user_id: user.id, score }, { onConflict: "post_id,user_id" })
    .select("id,post_id,score")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rating: data }, { status: 201 });
}
