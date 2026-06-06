import { NextResponse } from "next/server";
import { ensureProfileForUser } from "@/lib/profile-helpers";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "开发登录仅允许在本地环境使用。" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || password.length < 8) {
    return NextResponse.json({ error: "请输入邮箱和至少 8 位密码。" }, { status: 400 });
  }

  const admin = createServerSupabaseClient();
  const supabase = await createSupabaseServerClient();

  if (!admin || !supabase) {
    return NextResponse.json({ error: "Supabase 环境变量未配置完整。" }, { status: 503 });
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError && !/already|registered|exists|duplicate/i.test(createError.message)) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  if (createError) {
    const { data: users, error: listError } = await admin.auth.admin.listUsers();
    const existing = users?.users.find((user) => user.email?.toLowerCase() === email);

    if (listError || !existing) {
      return NextResponse.json({ error: listError?.message ?? "无法定位已有用户。" }, { status: 500 });
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "登录失败。" }, { status: 401 });
  }

  const { error: profileError } = await ensureProfileForUser(admin, data.user);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
}
