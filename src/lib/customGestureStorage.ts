import type { GestureName, Landmark } from "./gestureUtils";
import { distance } from "./gestureUtils";

export type SavedHandPose = {
  id: string;
  name: string;
  targetGesture: GestureName;
  detectedGesture: GestureName;
  landmarks: Landmark[];
  createdAt: string;
};

export type MatchedHandPose = SavedHandPose & { score: number };

export const CUSTOM_HAND_POSES_STORAGE_KEY = "dog-tarot-custom-hand-poses";

const palmIndexes = [0, 5, 9, 13, 17];
const weightedIndexes = [
  { index: 0, weight: 0.7 },
  { index: 1, weight: 0.45 },
  { index: 2, weight: 0.55 },
  { index: 3, weight: 0.8 },
  { index: 4, weight: 1.35 },
  { index: 5, weight: 0.75 },
  { index: 6, weight: 0.85 },
  { index: 7, weight: 1.0 },
  { index: 8, weight: 1.45 },
  { index: 9, weight: 0.75 },
  { index: 10, weight: 0.85 },
  { index: 11, weight: 1.0 },
  { index: 12, weight: 1.35 },
  { index: 13, weight: 0.75 },
  { index: 14, weight: 0.85 },
  { index: 15, weight: 1.0 },
  { index: 16, weight: 1.25 },
  { index: 17, weight: 0.75 },
  { index: 18, weight: 0.85 },
  { index: 19, weight: 1.0 },
  { index: 20, weight: 1.25 },
];

const pairFeatures: Array<[number, number]> = [
  [4, 8],
  [4, 12],
  [8, 12],
  [8, 20],
  [12, 20],
  [0, 4],
  [0, 8],
  [0, 12],
  [0, 16],
  [0, 20],
  [5, 17],
  [5, 9],
  [9, 13],
  [13, 17],
];

export function loadSavedHandPoses(): SavedHandPose[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_HAND_POSES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedHandPose[];
    return Array.isArray(parsed) ? parsed.filter((pose) => pose.landmarks?.length >= 21) : [];
  } catch {
    return [];
  }
}

export function saveHandPoses(poses: SavedHandPose[]) {
  window.localStorage.setItem(CUSTOM_HAND_POSES_STORAGE_KEY, JSON.stringify(poses));
}

function centerOf(points: Landmark[]) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
    z: points.reduce((sum, point) => sum + (point.z ?? 0), 0) / points.length,
  };
}

function handScale(landmarks: Landmark[]) {
  const wrist = landmarks[0];
  const middleBase = landmarks[9];
  const indexBase = landmarks[5];
  const pinkyBase = landmarks[17];
  if (!wrist || !middleBase || !indexBase || !pinkyBase) return 0;
  return Math.max(
    0.001,
    distance(wrist, middleBase),
    distance(indexBase, pinkyBase) * 0.82,
    distance(wrist, landmarks[12] ?? middleBase) * 0.55,
  );
}

function normalizePose(landmarks: Landmark[], mirror = false) {
  if (landmarks.length < 21 || !landmarks[0] || !landmarks[9]) return [];
  const palm = centerOf(palmIndexes.map((index) => landmarks[index]).filter(Boolean));
  const scale = handScale(landmarks);
  if (!scale) return [];

  const wrist = landmarks[0];
  const middleBase = landmarks[9];
  const angle = Math.atan2(middleBase.y - wrist.y, middleBase.x - wrist.x);
  const targetAngle = -Math.PI / 2;
  const rotation = targetAngle - angle;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  return landmarks.map((point) => {
    const rawX = (point.x - palm.x) / scale;
    const rawY = (point.y - palm.y) / scale;
    const rotatedX = rawX * cos - rawY * sin;
    const rotatedY = rawX * sin + rawY * cos;
    return {
      x: mirror ? -rotatedX : rotatedX,
      y: rotatedY,
      z: ((point.z ?? 0) - palm.z) / scale,
    };
  });
}

function weightedLandmarkScore(a: Landmark[], b: Landmark[]) {
  let total = 0;
  let weightTotal = 0;
  weightedIndexes.forEach(({ index, weight }) => {
    const dz = ((a[index].z ?? 0) - (b[index].z ?? 0)) * 0.35;
    total += Math.hypot(a[index].x - b[index].x, a[index].y - b[index].y, dz) * weight;
    weightTotal += weight;
  });
  return total / Math.max(0.001, weightTotal);
}

function featureScore(a: Landmark[], b: Landmark[]) {
  const total = pairFeatures.reduce((sum, [first, second]) => {
    const currentDistance = distance(a[first], a[second]);
    const savedDistance = distance(b[first], b[second]);
    return sum + Math.abs(currentDistance - savedDistance);
  }, 0);
  return total / pairFeatures.length;
}

function scoreNormalizedPose(current: Landmark[], saved: Landmark[]) {
  if (current.length < 21 || saved.length < 21) return Number.POSITIVE_INFINITY;
  const landmark = weightedLandmarkScore(current, saved);
  const feature = featureScore(current, saved);
  return landmark * 0.72 + feature * 0.28;
}

export function scorePose(current: Landmark[], saved: Landmark[]) {
  if (current.length < 21 || saved.length < 21) return Number.POSITIVE_INFINITY;
  const currentPose = normalizePose(current);
  const currentMirroredPose = normalizePose(current, true);
  const savedPose = normalizePose(saved);
  if (currentPose.length < 21 || savedPose.length < 21) return Number.POSITIVE_INFINITY;
  return Math.min(scoreNormalizedPose(currentPose, savedPose), scoreNormalizedPose(currentMirroredPose, savedPose));
}

function thresholdForPoseCount(count: number) {
  if (count >= 8) return 0.62;
  if (count >= 4) return 0.68;
  return 0.74;
}

export function rankSavedHandPoses(current: Landmark[], savedPoses: SavedHandPose[]): MatchedHandPose[] {
  if (current.length < 21 || savedPoses.length === 0) return [];
  return savedPoses
    .map((pose) => ({ ...pose, score: scorePose(current, pose.landmarks) }))
    .filter((pose) => Number.isFinite(pose.score))
    .sort((a, b) => a.score - b.score);
}

export function matchSavedHandPose(current: Landmark[], savedPoses: SavedHandPose[], threshold?: number): MatchedHandPose | null {
  const ranked = rankSavedHandPoses(current, savedPoses);
  const best = ranked[0];
  const finalThreshold = threshold ?? thresholdForPoseCount(savedPoses.length);
  return best && best.score <= finalThreshold ? best : null;
}
