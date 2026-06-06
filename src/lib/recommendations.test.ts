import { describe, expect, it } from "vitest";
import { createStyleRecommendation } from "./recommendations";

describe("createStyleRecommendation", () => {
  it("returns a Chinese analysis with exactly three scored outfit candidates", () => {
    const result = createStyleRecommendation({
      gender: "female",
      ageRange: "25-34",
      bodyType: "高挑偏瘦",
      height: "172",
      stylePreference: "通勤、轻熟、干净利落",
      occasion: "工作日约会",
      avoid: "不要过于甜美",
      photoLabel: "portrait-001",
    });

    expect(result.strengths.length).toBeGreaterThanOrEqual(3);
    expect(result.improvements.length).toBeGreaterThanOrEqual(2);
    expect(result.colorAdvice).toContain("高饱和");
    expect(result.candidates).toHaveLength(3);
    expect(result.candidates[0]).toMatchObject({
      id: "look-01",
      title: expect.any(String),
      score: expect.any(Number),
    });
    expect(result.candidates.every((candidate) => candidate.score >= 80)).toBe(true);
    expect(result.candidates[0].assets.hair).toBeTruthy();
    expect(result.candidates[0].reason).toContain("通勤");
  });
});
