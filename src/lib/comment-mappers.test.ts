import { describe, expect, it } from "vitest";
import { mapCommentRow } from "./comment-mappers";

describe("mapCommentRow", () => {
  it("maps Supabase comment rows to display comments", () => {
    expect(
      mapCommentRow({
        id: "comment-1",
        body: "颜色很提气。",
        created_at: "2026-06-06T10:00:00.000Z",
        profiles: { display_name: "Nora" },
      }),
    ).toEqual({
      id: "comment-1",
      body: "颜色很提气。",
      createdAt: "2026-06-06T10:00:00.000Z",
      author: "Nora",
    });
  });

  it("uses an anonymous fallback author", () => {
    expect(
      mapCommentRow({
        id: "comment-2",
        body: "不错。",
        created_at: "2026-06-06T10:00:00.000Z",
        profiles: null,
      }).author,
    ).toBe("匿名用户");
  });
});
