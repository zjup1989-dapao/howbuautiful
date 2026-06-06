import { NextResponse } from "next/server";
import { ensureProfileForUser } from "@/lib/profile-helpers";
import { validateOutfitPlanPayload } from "@/lib/payload-validation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateOutfitPlanPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const sessionClient = await createSupabaseServerClient();
  const adminClient = createServerSupabaseClient();
  if (!sessionClient || !adminClient) {
    return NextResponse.json(
      {
        plan: {
          id: `demo-plan-${Date.now()}`,
          title: body.title,
          ai_score: Number(body.aiScore),
        },
      },
      { status: 201 },
    );
  }

  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "请先登录后再保存搭配方案。" }, { status: 401 });
  }

  const { error: profileError } = await ensureProfileForUser(adminClient, user);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { data, error } = await adminClient
    .from("outfit_plans")
    .insert({
      user_id: user.id,
      upload_id: body.uploadId ?? null,
      title: body.title,
      ai_score: Number(body.aiScore),
      recommendation: body.recommendation,
      selected_assets: body.selectedAssets,
      tuning: body.tuning ?? {},
      preview_image_url: body.previewImageUrl ?? null,
    })
    .select("id,title,ai_score,preview_image_url,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: data }, { status: 201 });
}
