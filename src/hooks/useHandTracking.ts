import { useCallback, useEffect, useRef, useState } from "react";
import { appConfig } from "../content/appConfig";
import type { Landmark } from "../lib/gestureUtils";
import { normalizedToScreen } from "../lib/gestureUtils";

export type HandTrackingStatus = "idle" | "loading" | "tracking" | "error";

export function useHandTracking() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<HandTrackingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    rafRef.current = null;
    streamRef.current = null;
    setStatus((current) => (current === "error" ? current : "idle"));
  }, []);

  const loop = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) {
      rafRef.current = window.requestAnimationFrame(loop);
      return;
    }

    const result = landmarker.detectForVideo(video, performance.now());
    const firstHand = result.landmarks?.[0] as Landmark[] | undefined;
    if (firstHand?.length) {
      setLandmarks(firstHand);
      setCursor(normalizedToScreen(firstHand[8]));
    } else {
      setLandmarks([]);
      setCursor(null);
    }
    rafRef.current = window.requestAnimationFrame(loop);
  }, []);

  const startTracking = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("카메라를 사용할 수 없어요.");

      const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(appConfig.mediapipeWasmBaseUrl);
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: appConfig.handLandmarkerModelUrl, delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 1,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("tracking");
      rafRef.current = window.requestAnimationFrame(loop);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "손 추적을 시작하지 못했어요.";
      setError(message);
      setStatus("error");
      stop();
    }
  }, [loop, stop]);

  useEffect(() => stop, [stop]);

  return { videoRef, status, error, landmarks, cursor, startTracking, stop };
}
