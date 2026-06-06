import { NextResponse } from "next/server";
import { ensureProfileForUser } from "@/lib/profile-helpers";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { buildPrivateUploadPath } from "@/lib/upload-paths";

const maxUploadBytes = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const sessionClient = await createSupabaseServerClient();
  const adminClient = createServerSupabaseClient();

  if (!sessionClient || !adminClient) {
    return NextResponse.json({ error: "Supabase 未配置，当前只能本地预览照片。" }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "请先登录后再上传照片。" }, { status: 401 });
  }

  const { error: profileError } = await ensureProfileForUser(adminClient, user);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择要上传的照片。" }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "仅支持 JPG、PNG、WEBP 或 GIF 图片。" }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: "图片不能超过 8MB。" }, { status: 400 });
  }

  const storagePath = buildPrivateUploadPath(user.id, file.name);
  const { error: uploadError } = await adminClient.storage.from("private-uploads").upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error: insertError } = await adminClient
    .from("uploads")
    .insert({
      user_id: user.id,
      storage_path: storagePath,
      original_filename: file.name,
      is_private: true,
    })
    .select("id,storage_path,original_filename,created_at")
    .single();

  if (insertError) {
    await adminClient.storage.from("private-uploads").remove([storagePath]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ upload: data }, { status: 201 });
}
