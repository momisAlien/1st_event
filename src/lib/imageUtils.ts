export function assetLabelFromPath(src: string) {
  const file = src.split("/").filter(Boolean).pop() ?? "이미지";
  return file.replace(/[-_]/g, " ").replace(/\.[a-zA-Z0-9]+$/, "");
}
