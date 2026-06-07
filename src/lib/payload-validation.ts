type ValidationResult = { ok: true } | { ok: false; error: string };

export function validateOutfitPlanPayload(payload: Record<string, unknown> | null): ValidationResult {
  if (!payload?.title || typeof payload.title !== "string") {
    return { ok: false, error: "保存方案需要标题。" };
  }

  const score = Number(payload.aiScore);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return { ok: false, error: "AI 评分需要在 0 到 100 之间。" };
  }

  if (!payload.recommendation || typeof payload.recommendation !== "object") {
    return { ok: false, error: "保存方案需要 AI 推荐结果。" };
  }

  if (!payload.selectedAssets || typeof payload.selectedAssets !== "object") {
    return { ok: false, error: "保存方案需要已选单品。" };
  }

  return { ok: true };
}

export function validatePostPayload(payload: Record<string, unknown> | null): ValidationResult {
  if (!payload?.title || !payload.caption || typeof payload.title !== "string" || typeof payload.caption !== "string") {
    return { ok: false, error: "发布内容需要标题和文案。" };
  }

  const score = Number(payload.aiScore ?? 80);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return { ok: false, error: "AI 评分需要在 0 到 100 之间。" };
  }

  return { ok: true };
}

export function validatePostUpdatePayload(payload: Record<string, unknown> | null): ValidationResult {
  if (
    !payload?.title ||
    !payload.caption ||
    typeof payload.title !== "string" ||
    typeof payload.caption !== "string" ||
    !payload.title.trim() ||
    !payload.caption.trim()
  ) {
    return { ok: false, error: "更新帖子需要标题和文案。" };
  }

  return { ok: true };
}
