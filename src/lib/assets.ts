import type { StyleAsset } from "./types";

export const styleAssets: StyleAsset[] = [
  {
    id: "hair-sleek-bob",
    type: "hair",
    name: "利落锁骨短发",
    tone: "clean",
    color: "#111111",
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80",
    tags: ["通勤", "轻熟", "修饰脸型"],
  },
  {
    id: "hair-soft-wave",
    type: "hair",
    name: "空气感微卷",
    tone: "soft",
    color: "#5d4037",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    tags: ["约会", "温柔", "显发量"],
  },
  {
    id: "top-amber-knit",
    type: "top",
    name: "琥珀针织上衣",
    tone: "warm",
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    tags: ["暖色", "提气色", "通勤"],
  },
  {
    id: "top-violet-tee",
    type: "top",
    name: "紫调极简 Tee",
    tone: "active",
    color: "#6d5dfc",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    tags: ["亮色", "街头", "年轻"],
  },
  {
    id: "bottom-ink-trousers",
    type: "bottom",
    name: "墨黑垂坠长裤",
    tone: "tailored",
    color: "#111827",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    tags: ["显高", "利落", "百搭"],
  },
  {
    id: "outer-cream-blazer",
    type: "outerwear",
    name: "奶白廓形西装",
    tone: "polished",
    color: "#f4eee6",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    tags: ["职场", "精致", "层次"],
  },
  {
    id: "shoes-black-loafer",
    type: "shoes",
    name: "黑色乐福鞋",
    tone: "classic",
    color: "#111111",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
    tags: ["舒适", "通勤", "稳定"],
  },
  {
    id: "acc-silver-chain",
    type: "accessory",
    name: "银色细链",
    tone: "sharp",
    color: "#cbd5e1",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    tags: ["提亮", "轻量", "精致"],
  },
];

export function getAsset(id: string) {
  return styleAssets.find((asset) => asset.id === id);
}

export function getAssetsByType(type: StyleAsset["type"]) {
  return styleAssets.filter((asset) => asset.type === type);
}
