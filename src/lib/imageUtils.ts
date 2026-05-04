export function assetLabelFromPath(src: string) {
  const file = src.split("/").filter(Boolean).pop() ?? "이미지";
  return file.replace(/[-_]/g, " ").replace(/\.[a-zA-Z0-9]+$/, "");
}

export function preloadImages(srcList: string[]) {
  if (typeof window === "undefined") return;
  srcList.forEach((src) => {
    if (!src) return;
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  });
}
