import { describe, expect, it } from "vitest";
import { applyTuningToCandidate } from "./studio-state";
import type { OutfitCandidate } from "./types";

const candidate: OutfitCandidate = {
  id: "look-01",
  title: "Amber Core 通勤高光",
  score: 94,
  reason: "测试方案",
  tags: ["通勤"],
  assets: {
    hair: "soft-waves",
    top: "amber-knit",
    bottom: "black-tailored-trouser",
    outerwear: "cream-overshirt",
    shoes: "white-sneaker",
    accessory: "silver-hoops",
  },
  tuning: {
    silhouette: "修身直线",
    saturation: 62,
    formality: 70,
  },
};

describe("applyTuningToCandidate", () => {
  it("merges selected assets and user-controlled tuning into the active candidate", () => {
    const result = applyTuningToCandidate(candidate, {
      assets: {
        ...candidate.assets,
        top: "violet-tee",
      },
      tuning: {
        saturation: 88,
        formality: 35,
      },
    });

    expect(result.assets.top).toBe("violet-tee");
    expect(result.tuning).toEqual({
      silhouette: "修身直线",
      saturation: 88,
      formality: 35,
    });
  });
});
