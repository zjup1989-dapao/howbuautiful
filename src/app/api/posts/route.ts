import { NextResponse } from "next/server";
import { ensureProfileForUser } from "@/lib/profile-helpers";
import { validatePostPayload } from "@/lib/payload-validation";
import { getCommunityPosts } from "@/lib/posts-data";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const posts = await getCommunityPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validatePostPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const sessionClient = await createSupabaseServerClient();
  const adminClient = createServerSupabaseClient();
  if (sessionClient && adminClient) {
    const {
      data: { user },
      error: userError,
    } = await sessionClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "请先登录后再发布搭配帖。" }, { status: 401 });
    }

    const { error: profileError } = await ensureProfileForUser(adminClient, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const { data, error } = await adminClient
      .from("posts")
      .insert({
        user_id: user.id,
        outfit_plan_id: body.outfitPlanId ?? null,
        title: body.title,
        caption: body.caption,
        image_url: body.imageUrl ?? body.image ?? "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
        tags: Array.isArray(body.tags) ? body.tags : [],
        ai_score: Number(body.aiScore ?? 80),
      })
      .select("id,title,caption,created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data }, { status: 201 });
  }

  return NextResponse.json(
    {
      post: {
        id: `draft-${Date.now()}`,
        title: body.title,
        caption: body.caption,
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 },
  );
}
