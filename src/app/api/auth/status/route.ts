import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      configured: false,
      authenticated: false,
      email: null,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return NextResponse.json({
    configured: true,
    authenticated: Boolean(user),
    email: user?.email ?? null,
  });
}
