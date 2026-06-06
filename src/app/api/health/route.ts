import { NextResponse } from "next/server";
import { buildHealthReport } from "@/lib/health";
import { createServerSupabaseClient, supabaseAnonKey, supabaseUrl } from "@/lib/supabase";

export async function GET() {
  const report = await buildHealthReport(
    {
      supabaseUrl,
      supabaseAnonKey,
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
      openAiKey: process.env.OPENAI_API_KEY ?? "",
    },
    async () => {
      const supabase = createServerSupabaseClient();
      if (!supabase) {
        return { reachable: false, error: "Supabase server client is not configured." };
      }

      const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      if (error) {
        return { reachable: false, error: error.message };
      }

      return { reachable: true };
    },
  );

  return NextResponse.json(report, {
    status: report.supabase.configured && !report.supabase.databaseReachable ? 503 : 200,
  });
}
