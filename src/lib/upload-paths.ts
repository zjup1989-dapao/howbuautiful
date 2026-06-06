export function sanitizeUploadFileName(fileName: string) {
  const extension = extensionFrom(fileName);
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${baseName || "file"}${extension}`;
}

export function buildPrivateUploadPath(userId: string, fileName: string, timestamp = Date.now()) {
  return `${userId}/${timestamp}-${sanitizeUploadFileName(fileName)}`;
}

function extensionFrom(fileName: string) {
  const match = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  const extension = match?.[1];
  if (!extension) return ".jpg";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return extension === "jpeg" ? ".jpg" : `.${extension}`;
  }
  return ".jpg";
}
