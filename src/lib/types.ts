export type Gender = "female" | "male" | "non_binary";

export type StyleAssetType =
  | "hair"
  | "top"
  | "bottom"
  | "outerwear"
  | "shoes"
  | "accessory";

export type StyleAsset = {
  id: string;
  type: StyleAssetType;
  name: string;
  tone: string;
  color: string;
  image: string;
  tags: string[];
};

export type RecommendationInput = {
  gender: Gender;
  ageRange: string;
  bodyType: string;
  height: string;
  stylePreference: string;
  occasion: string;
  avoid?: string;
  photoLabel?: string;
};

export type OutfitCandidate = {
  id: string;
  title: string;
  score: number;
  reason: string;
  tags: string[];
  assets: {
    hair: string;
    top: string;
    bottom: string;
    outerwear: string;
    shoes: string;
    accessory: string;
  };
  tuning: {
    silhouette: string;
    saturation: number;
    formality: number;
  };
};

export type StyleRecommendation = {
  strengths: string[];
  improvements: string[];
  colorAdvice: string;
  styleKeywords: string[];
  overallScore: number;
  candidates: OutfitCandidate[];
};

export type RankingPeriod = "day" | "week" | "month";
export type RankingMetric = "ai" | "user" | "hot";

export type RankablePost = {
  id: string;
  title: string;
  createdAt: string;
  aiScore: number;
  averageUserScore: number;
  commentCount: number;
};

export type CommunityPost = RankablePost & {
  authorId?: string;
  author: string;
  caption: string;
  image: string;
  tags: string[];
  planTitle: string;
};
