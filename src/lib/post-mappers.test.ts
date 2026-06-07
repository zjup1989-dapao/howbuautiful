import { describe, expect, it } from "vitest";
import { mapPostStatsRow } from "./post-mappers";

describe("mapPostStatsRow", () => {
  it("converts Supabase post_stats rows into community posts", () => {
    const post = mapPostStatsRow({
      id: "post-1",
      user_id: "user-1",
      title: "真实搭配帖",
      caption: "这是一条来自数据库的搭配文案。",
      image_url: "https://example.com/look.jpg",
      tags: ["通勤", "高分"],
      ai_score: 92,
      average_user_score: "4.7",
      comment_count: "12",
      created_at: "2026-06-06T10:00:00.000Z",
      profiles: {
        display_name: "Nora",
      },
      outfit_plans: {
        title: "Amber Core 通勤高光",
      },
    });

    expect(post).toEqual({
      id: "post-1",
      authorId: "user-1",
      title: "真实搭配帖",
      author: "Nora",
      caption: "这是一条来自数据库的搭配文案。",
      image: "https://example.com/look.jpg",
      tags: ["通勤", "高分"],
      planTitle: "Amber Core 通勤高光",
      createdAt: "2026-06-06T10:00:00.000Z",
      aiScore: 92,
      averageUserScore: 4.7,
      commentCount: 12,
    });
  });

  it("also supports flattened post_stats view columns", () => {
    const post = mapPostStatsRow({
      id: "post-2",
      title: "扁平视图帖子",
      caption: "来自 post_stats 视图。",
      image_url: "https://example.com/look-2.jpg",
      tags: null,
      ai_score: 88,
      average_user_score: 0,
      comment_count: 0,
      created_at: "2026-06-06T11:00:00.000Z",
      author_name: "Ava",
      plan_title: "Violet Motion 轻街头",
    });

    expect(post.author).toBe("Ava");
    expect(post.planTitle).toBe("Violet Motion 轻街头");
    expect(post.tags).toEqual([]);
  });
});
