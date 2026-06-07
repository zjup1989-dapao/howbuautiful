import { describe, expect, it } from "vitest";
import { mapProfilePlanRow, mapProfilePostRow, mapProfileUploadRow } from "./profile-data";

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
});
