import { describe, expect, it } from "vitest";
import { mapProfilePlanDetailRow, mapProfilePlanRow, mapProfilePostRow, mapProfileUploadRow } from "./profile-data";

describe("profile data mappers", () => {
  it("maps upload rows for the profile archive", () => {
    expect(
      mapProfileUploadRow({
        id: "upload-1",
        original_filename: "portrait.png",
        storage_path: "user-1/2026-06-07/portrait.png",
        created_at: "2026-06-07T09:00:00.000Z",
      }),
    ).toEqual({
      id: "upload-1",
      fileName: "portrait.png",
      storagePath: "user-1/2026-06-07/portrait.png",
      createdAt: "2026-06-07T09:00:00.000Z",
    });
  });

  it("maps outfit plan rows with numeric scores", () => {
    expect(
      mapProfilePlanRow({
        id: "plan-1",
        title: "Amber Core 通勤高光",
        ai_score: "94",
        preview_image_url: "https://example.com/plan.jpg",
        created_at: "2026-06-07T10:00:00.000Z",
      }),
    ).toEqual({
      id: "plan-1",
      title: "Amber Core 通勤高光",
      aiScore: 94,
      previewImage: "https://example.com/plan.jpg",
      createdAt: "2026-06-07T10:00:00.000Z",
    });
  });

  it("maps published post rows with rating and comment stats", () => {
    expect(
      mapProfilePostRow({
        id: "post-1",
        title: "我的第一套搭配",
        image_url: "https://example.com/post.jpg",
        ai_score: 91,
        average_user_score: "4.6",
        comment_count: "8",
        created_at: "2026-06-07T11:00:00.000Z",
      }),
    ).toEqual({
      id: "post-1",
      title: "我的第一套搭配",
      image: "https://example.com/post.jpg",
      aiScore: 91,
      averageUserScore: 4.6,
      commentCount: 8,
      createdAt: "2026-06-07T11:00:00.000Z",
    });
  });

  it("maps plan detail rows into a preview candidate", () => {
    const detail = mapProfilePlanDetailRow({
      id: "plan-1",
      title: "Amber Core 通勤高光",
      ai_score: 94,
      preview_image_url: "https://example.com/plan.jpg",
      selected_assets: {
        hair: "hair-sleek-bob",
        top: "top-amber-knit",
        bottom: "bottom-ink-trousers",
        outerwear: "outer-cream-blazer",
        shoes: "shoes-black-loafer",
        accessory: "acc-silver-chain",
      },
      tuning: {
        silhouette: "修身直线",
        saturation: 86,
        formality: 42,
      },
      recommendation: {
        strengths: ["肩颈线条清晰"],
        improvements: ["增加层次"],
        colorAdvice: "琥珀色更提气色。",
        styleKeywords: ["通勤", "轻熟"],
        overallScore: 94,
        candidates: [
          {
            id: "look-01",
            title: "Amber Core 通勤高光",
            score: 94,
            reason: "用琥珀色提升亲和力。",
            tags: ["通勤"],
            assets: {
              hair: "hair-sleek-bob",
              top: "top-amber-knit",
              bottom: "bottom-ink-trousers",
              outerwear: "outer-cream-blazer",
              shoes: "shoes-black-loafer",
              accessory: "acc-silver-chain",
            },
            tuning: {
              silhouette: "修身直线",
              saturation: 72,
              formality: 82,
            },
          },
        ],
      },
      created_at: "2026-06-07T12:00:00.000Z",
    });

    expect(detail.previewCandidate).toMatchObject({
      id: "plan-1",
      title: "Amber Core 通勤高光",
      score: 94,
      reason: "用琥珀色提升亲和力。",
      tags: ["通勤", "轻熟"],
      tuning: {
        silhouette: "修身直线",
        saturation: 86,
        formality: 42,
      },
    });
    expect(detail.selectedAssetIds.top).toBe("top-amber-knit");
  });
});
