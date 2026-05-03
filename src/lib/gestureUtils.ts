export type Landmark = { x: number; y: number; z?: number };
export type GestureName =
  | "none"
  | "pinch"
  | "fingerHeart"
  | "openPalm"
  | "petting"
  | "wave"
  | "poke"
  | "fist"
  | "swipeLeft"
  | "swipeRight"
  | "point";

export function distance(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
}

export function normalizedToScreen(point: Landmark) {
  return {
    x: point.x * window.innerWidth,
    y: point.y * window.innerHeight,
  };
}

function fingerExtended(landmarks: Landmark[], tip: number, pip: number) {
  return Boolean(landmarks[tip] && landmarks[pip] && landmarks[tip].y < landmarks[pip].y - 0.015);
}

function fingerFolded(landmarks: Landmark[], tip: number, pip: number) {
  return Boolean(landmarks[tip] && landmarks[pip] && landmarks[tip].y > landmarks[pip].y - 0.01);
}

export function isPinch(landmarks: Landmark[]) {
  return landmarks[4] && landmarks[8] ? distance(landmarks[4], landmarks[8]) < 0.06 : false;
}

export function isFist(landmarks: Landmark[]) {
  if (!landmarks[0] || !landmarks[8] || !landmarks[12] || !landmarks[16] || !landmarks[20]) return false;
  const foldedFingers =
    fingerFolded(landmarks, 8, 6) &&
    fingerFolded(landmarks, 12, 10) &&
    fingerFolded(landmarks, 16, 14) &&
    fingerFolded(landmarks, 20, 18);
  const tipsCloseToPalm = [8, 12, 16, 20].every((index) => distance(landmarks[0], landmarks[index]) < 0.28);
  return foldedFingers && tipsCloseToPalm;
}

export function isFingerHeart(landmarks: Landmark[]) {
  if (!landmarks[4] || !landmarks[8]) return false;
  const thumbIndexClose = distance(landmarks[4], landmarks[8]) < 0.052;
  const middleFolded = fingerFolded(landmarks, 12, 10);
  const ringFolded = fingerFolded(landmarks, 16, 14);
  const pinkyFolded = fingerFolded(landmarks, 20, 18);
  return thumbIndexClose && (middleFolded || ringFolded || pinkyFolded);
}

export function isOpenPalm(landmarks: Landmark[]) {
  if (!landmarks[0] || !landmarks[8] || !landmarks[12] || !landmarks[16] || !landmarks[20]) return false;
  const wrist = landmarks[0];
  const spread = distance(landmarks[8], landmarks[20]) > 0.28;
  const longFingers = [8, 12, 16, 20].every((index) => distance(wrist, landmarks[index]) > 0.24);
  const extended = fingerExtended(landmarks, 8, 6) && fingerExtended(landmarks, 12, 10) && fingerExtended(landmarks, 16, 14);
  return spread && longFingers && extended;
}

export function isPointing(landmarks: Landmark[]) {
  if (!landmarks[0] || !landmarks[8] || !landmarks[12] || !landmarks[16] || !landmarks[20]) return false;
  const wrist = landmarks[0];
  const indexExtended = distance(wrist, landmarks[8]) > 0.27 && fingerExtended(landmarks, 8, 6);
  const othersFolded = fingerFolded(landmarks, 12, 10) && fingerFolded(landmarks, 16, 14) && fingerFolded(landmarks, 20, 18);
  return indexExtended && othersFolded;
}

export function palmCenter(landmarks: Landmark[]) {
  const candidates = [landmarks[0], landmarks[5], landmarks[9], landmarks[13], landmarks[17]].filter(Boolean);
  if (!candidates.length) return null;
  return {
    x: candidates.reduce((sum, item) => sum + item.x, 0) / candidates.length,
    y: candidates.reduce((sum, item) => sum + item.y, 0) / candidates.length,
  };
}
