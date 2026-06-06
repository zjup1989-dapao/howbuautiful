import { describe, expect, it } from "vitest";
import { rankPosts } from "./rankings";

const now = new Date("2026-06-06T12:00:00.000Z");

describe("rankPosts", () => {
  it("filters posts by period and ranks by selected score", () => {
    const posts = [
      {
        id: "old",
        title: "旧内容",
        createdAt: "2026-05-01T10:00:00.000Z",
        aiScore: 98,
        averageUserScore: 4.9,
        commentCount: 50,
      },
      {
        id: "fresh-hot",
        title: "今日热门",
        createdAt: "2026-06-06T08:00:00.000Z",
        aiScore: 88,
        averageUserScore: 4.6,
        commentCount: 42,
      },
      {
        id: "fresh-ai",
        title: "AI高分",
        createdAt: "2026-06-06T09:00:00.000Z",
        aiScore: 94,
        averageUserScore: 4.4,
        commentCount: 10,
      },
    ];

    expect(rankPosts(posts, { period: "day", metric: "ai", now }).map((post) => post.id)).toEqual([
      "fresh-ai",
      "fresh-hot",
    ]);
    expect(rankPosts(posts, { period: "day", metric: "hot", now })[0].id).toBe("fresh-hot");
  });
});
