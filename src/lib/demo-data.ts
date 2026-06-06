import { createStyleRecommendation } from "./recommendations";
import type { CommunityPost } from "./types";

export const demoRecommendation = createStyleRecommendation({
  gender: "female",
  ageRange: "25-34",
  bodyType: "高挑偏瘦",
  height: "172",
  stylePreference: "通勤、轻熟、干净利落",
  occasion: "工作日约会",
  avoid: "过度甜美和复杂花纹",
  photoLabel: "demo",
});

export const demoPosts: CommunityPost[] = [
  {
    id: "post-amber",
    title: "琥珀通勤的一周主造型",
    author: "Mia",
    caption: "AI 建议把暖色放在上半身，今天试了奶白西装，确实更精神。",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    tags: ["通勤", "暖色", "显高"],
    planTitle: "Amber Core 通勤高光",
    createdAt: "2026-06-06T08:00:00.000Z",
    aiScore: 94,
    averageUserScore: 4.8,
    commentCount: 42,
  },
  {
    id: "post-violet",
    title: "紫色 Tee 也能穿得很干净",
    author: "Sean",
    caption: "以前不敢穿亮色，降低其它单品存在感以后舒服很多。",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    tags: ["街头", "亮色", "周末"],
    planTitle: "Violet Motion 轻街头",
    createdAt: "2026-06-05T11:30:00.000Z",
    aiScore: 89,
    averageUserScore: 4.6,
    commentCount: 31,
  },
  {
    id: "post-soft",
    title: "不甜腻的约会感",
    author: "Luna",
    caption: "微卷发和银色细链真的会让整套搭配更轻。",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    tags: ["约会", "轻熟", "层次"],
    planTitle: "Soft Gallery 约会廓形",
    createdAt: "2026-06-01T09:00:00.000Z",
    aiScore: 87,
    averageUserScore: 4.7,
    commentCount: 18,
  },
];
