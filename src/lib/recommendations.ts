import type { RecommendationInput, StyleRecommendation } from "./types";

export function createStyleRecommendation(input: RecommendationInput): StyleRecommendation {
  const prefersWork = /通勤|工作|职场/.test(input.stylePreference + input.occasion);
  const wantsSoft = /约会|温柔|轻熟/.test(input.stylePreference + input.occasion);
  const avoid = input.avoid ? `，同时避开${input.avoid}` : "";

  return {
    strengths: [
      `${input.bodyType || "自然体型"}适合用清晰纵向线条放大精神感`,
      `${input.occasion || "日常"}场景下可以用一处高饱和色建立记忆点`,
      "五官和轮廓建议通过发型蓬松度与领口留白来平衡",
    ],
    improvements: [
      "避免全身同一明度，容易让层次变平",
      "上半身重点不要过多，发型、领口和配饰保留一个主视觉即可",
    ],
    colorAdvice: "建议以黑白灰或奶白做底，用琥珀橙、紫调蓝等高饱和点缀提亮气色。",
    styleKeywords: [prefersWork ? "利落通勤" : "日常精致", wantsSoft ? "轻熟柔和" : "现代极简", "高饱和点睛"],
    overallScore: prefersWork ? 91 : 88,
    candidates: [
      {
        id: "look-01",
        title: "Amber Core 通勤高光",
        score: 94,
        reason: `用琥珀针织和奶白西装制造高级通勤感，黑色长裤压住比例，适合${input.occasion || "日常"}${avoid}。`,
        tags: ["通勤", "显高", "暖色提气"],
        assets: {
          hair: "hair-sleek-bob",
          top: "top-amber-knit",
          bottom: "bottom-ink-trousers",
          outerwear: "outer-cream-blazer",
          shoes: "shoes-black-loafer",
          accessory: "acc-silver-chain",
        },
        tuning: {
          silhouette: "上短下长",
          saturation: 72,
          formality: 82,
        },
      },
      {
        id: "look-02",
        title: "Violet Motion 轻街头",
        score: 89,
        reason: "紫调上衣提供年轻感，搭配黑色下装保留干净边界，适合想要更有个性的日常造型。",
        tags: ["街头", "亮色", "年轻"],
        assets: {
          hair: "hair-soft-wave",
          top: "top-violet-tee",
          bottom: "bottom-ink-trousers",
          outerwear: "outer-cream-blazer",
          shoes: "shoes-black-loafer",
          accessory: "acc-silver-chain",
        },
        tuning: {
          silhouette: "松紧对比",
          saturation: 84,
          formality: 56,
        },
      },
      {
        id: "look-03",
        title: "Soft Gallery 约会廓形",
        score: 87,
        reason: "微卷发型降低距离感，奶白外套和银色配饰让视觉更轻，适合轻熟但不甜腻的约会穿搭。",
        tags: ["轻熟", "约会", "柔和"],
        assets: {
          hair: "hair-soft-wave",
          top: "top-amber-knit",
          bottom: "bottom-ink-trousers",
          outerwear: "outer-cream-blazer",
          shoes: "shoes-black-loafer",
          accessory: "acc-silver-chain",
        },
        tuning: {
          silhouette: "柔和廓形",
          saturation: 64,
          formality: 68,
        },
      },
    ],
  };
}
