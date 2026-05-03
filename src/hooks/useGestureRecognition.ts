import { useEffect, useRef, useState } from "react";
import type { GestureName, Landmark } from "../lib/gestureUtils";
import { isFingerHeart, isFist, isOpenPalm, isPinch, isPointing, palmCenter } from "../lib/gestureUtils";

type Point = { x: number; y: number; t: number };

function recentRange(history: Point[], key: "x" | "y") {
  if (history.length < 4) return 0;
  const values = history.map((item) => item[key]);
  return Math.max(...values) - Math.min(...values);
}

function directionChanges(history: Point[], key: "x" | "y") {
  let changes = 0;
  let lastSign = 0;
  for (let index = 1; index < history.length; index += 1) {
    const delta = history[index][key] - history[index - 1][key];
    const sign = Math.abs(delta) < 0.012 ? 0 : Math.sign(delta);
    if (sign !== 0 && lastSign !== 0 && sign !== lastSign) changes += 1;
    if (sign !== 0) lastSign = sign;
  }
  return changes;
}

export function useGestureRecognition(landmarks: Landmark[]) {
  const [gesture, setGesture] = useState<GestureName>("none");
  const historyRef = useRef<Point[]>([]);
  const lastSwipeAt = useRef(0);

  useEffect(() => {
    if (!landmarks.length) {
      setGesture("none");
      historyRef.current = [];
      return;
    }

    const now = Date.now();
    const indexTip = landmarks[8];
    const palm = palmCenter(landmarks) ?? indexTip;
    if (!palm) {
      setGesture("none");
      return;
    }

    historyRef.current = [...historyRef.current, { x: palm.x, y: palm.y, t: now }].filter((item) => now - item.t < 950).slice(-12);
    const history = historyRef.current;
    const xRange = recentRange(history, "x");
    const yRange = recentRange(history, "y");
    const xChanges = directionChanges(history, "x");
    const yChanges = directionChanges(history, "y");
    let nextGesture: GestureName = "none";

    if (isFist(landmarks)) {
      nextGesture = "fist";
    }

    if (nextGesture === "none" && history.length >= 3 && now - lastSwipeAt.current > 850) {
      const deltaX = history[history.length - 1].x - history[0].x;
      if (Math.abs(deltaX) > 0.22 && yRange < 0.18) {
        nextGesture = deltaX > 0 ? "swipeRight" : "swipeLeft";
        lastSwipeAt.current = now;
      }
    }

    if (nextGesture === "none" && isOpenPalm(landmarks) && yRange > 0.13 && yChanges >= 1) {
      nextGesture = "petting";
    }

    if (nextGesture === "none" && isOpenPalm(landmarks) && xRange > 0.12 && xChanges >= 2) {
      nextGesture = "wave";
    }

    if (nextGesture === "none") {
      if (isFingerHeart(landmarks)) nextGesture = "fingerHeart";
      else if (isPointing(landmarks)) nextGesture = "poke";
      else if (isPinch(landmarks)) nextGesture = "pinch";
      else if (isOpenPalm(landmarks)) nextGesture = "openPalm";
    }

    setGesture(nextGesture);
  }, [landmarks]);

  return gesture;
}
