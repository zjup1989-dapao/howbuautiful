import { describe, expect, test } from "vitest";
import { buildHealthReport } from "./health";

describe("buildHealthReport", () => {
  test("reports configured environment flags without exposing secret values", async () => {
    const report = await buildHealthReport(
      {
        supabaseUrl: "https://project.supabase.co",
        supabaseAnonKey: "anon-secret",
        supabaseServiceRoleKey: "service-role-secret",
        openAiKey: "openai-secret",
      },
      async () => ({ reachable: true }),
    );

    expect(report.environment).toEqual({
      supabaseUrl: true,
      supabaseAnonKey: true,
      supabaseServiceRoleKey: true,
      openAiKey: true,
    });
    expect(report.supabase).toEqual({
      configured: true,
      databaseReachable: true,
    });
    expect(JSON.stringify(report)).not.toContain("anon-secret");
    expect(JSON.stringify(report)).not.toContain("service-role-secret");
    expect(JSON.stringify(report)).not.toContain("openai-secret");
  });

  test("does not check the database when Supabase server credentials are incomplete", async () => {
    let checkedDatabase = false;

    const report = await buildHealthReport(
      {
        supabaseUrl: "https://project.supabase.co",
        supabaseAnonKey: "anon-secret",
        supabaseServiceRoleKey: "",
        openAiKey: "",
      },
      async () => {
        checkedDatabase = true;
        return { reachable: true };
      },
    );

    expect(checkedDatabase).toBe(false);
    expect(report.supabase).toEqual({
      configured: false,
      databaseReachable: false,
    });
  });
});
