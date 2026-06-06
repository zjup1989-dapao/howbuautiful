import { describe, expect, it } from "vitest";
import { buildPrivateUploadPath, sanitizeUploadFileName } from "./upload-paths";

describe("sanitizeUploadFileName", () => {
  it("keeps safe ascii names and extensions", () => {
    expect(sanitizeUploadFileName("portrait 01.JPG")).toBe("portrait-01.jpg");
  });

  it("replaces unsafe characters and preserves a fallback extension", () => {
    expect(sanitizeUploadFileName("../我的照片!!.png")).toBe("file.png");
  });
});

describe("buildPrivateUploadPath", () => {
  it("places uploads under the authenticated user folder", () => {
    expect(buildPrivateUploadPath("user-123", "portrait 01.JPG", 1710000000000)).toBe(
      "user-123/1710000000000-portrait-01.jpg",
    );
  });
});
