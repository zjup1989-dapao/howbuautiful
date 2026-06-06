import { describe, expect, it } from "vitest";
import { validateOutfitPlanPayload, validatePostPayload } from "./payload-validation";

describe("validateOutfitPlanPayload", () => {
  it("accepts a complete outfit plan payload", () => {
    const result = validateOutfitPlanPayload({
      title: "Amber Core 通勤高光",
      aiScore: 94,
      recommendation: { strengths: ["线条清晰"] },
      selectedAssets: { hair: "hair-sleek-bob" },
      tuning: { saturation: 72 },
    });

    expect(result.ok).toBe(true);
  });

  it("rejects invalid outfit scores", () => {
    const result = validateOutfitPlanPayload({
      title: "Invalid",
      aiScore: 120,
      recommendation: {},
      selectedAssets: {},
      tuning: {},
    });

    expect(result).toEqual({ ok: false, error: "AI 评分需要在 0 到 100 之间。" });
  });
});

describe("validatePostPayload", () => {
  it("requires title and caption before publishing", () => {
    expect(validatePostPayload({ title: "", caption: "不错", aiScore: 88 })).toEqual({
      ok: false,
      error: "发布内容需要标题和文案。",
    });
  });

  it("accepts valid post content", () => {
    expect(validatePostPayload({ title: "通勤搭配", caption: "今天的搭配灵感", aiScore: 88 }).ok).toBe(true);
  });
});
