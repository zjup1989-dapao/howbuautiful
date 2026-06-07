import { NextResponse } from "next/server";
import { validatePostUpdatePayload } from "@/lib/payload-validation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validation = validatePostUpdatePayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const auth = await requirePostOwner(id);
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.adminClient
    .from("posts")
    .update({
      title: body.title.trim(),
      caption: body.caption.trim(),
    })
    .eq("id", id)
    .select("id,title,caption,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requirePostOwner(id);
  if ("response" in auth) return auth.response;

  const { error } = await auth.adminClient.from("posts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function requirePostOwner(postId: string) {
  const sessionClient = await createSupabaseServerClient();
  const adminClient = createServerSupabaseClient();

  if (!sessionClient || !adminClient) {
    return { response: NextResponse.json({ error: "Supabase 未配置。" }, { status: 503 }) };
  }

  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return { response: NextResponse.json({ error: "请先登录后再管理帖子。" }, { status: 401 }) };
  }

  const { data: post, error: postError } = await adminClient.from("posts").select("id,user_id").eq("id", postId).single();
  if (postError || !post) {
    return { response: NextResponse.json({ error: "帖子不存在。" }, { status: 404 }) };
  }

  if (post.user_id !== user.id) {
    return { response: NextResponse.json({ error: "只能管理自己发布的帖子。" }, { status: 403 }) };
  }

  return { adminClient, user };
}
