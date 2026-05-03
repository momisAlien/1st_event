import type { RefObject } from "react";
import type { HandTrackingStatus } from "../../hooks/useHandTracking";
import type { Landmark } from "../../lib/gestureUtils";
import { Button } from "../UI/Button";

const handConnections = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const fingertipIndexes = new Set([4, 8, 12, 16, 20]);

type CameraPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: HandTrackingStatus;
  error: string | null;
  onStart: () => void;
  landmarks?: Landmark[];
  showLandmarks?: boolean;
  className?: string;
};

export function CameraPreview({ videoRef, status, error, onStart, landmarks = [], showLandmarks = false, className = "" }: CameraPreviewProps) {
  return (
    <div className={`camera-preview-panel overflow-hidden rounded-[28px] p-4 ${className}`}>
      <div className="relative aspect-video overflow-hidden rounded-[20px] bg-inkWarm/12 ring-2 ring-[#ff5fa2]/20">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        {showLandmarks && landmarks.length > 0 && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="handGlow">
                <feGaussianBlur stdDeviation="0.9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {handConnections.map(([from, to]) => {
              const a = landmarks[from];
              const b = landmarks[to];
              if (!a || !b) return null;
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x * 100}
                  y1={a.y * 100}
                  x2={b.x * 100}
                  y2={b.y * 100}
                  stroke="rgba(255, 95, 162, 0.92)"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  filter="url(#handGlow)"
                />
              );
            })}
            {landmarks.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x * 100}
                  cy={point.y * 100}
                  r={fingertipIndexes.has(index) ? 1.65 : 1.05}
                  fill={fingertipIndexes.has(index) ? "#ffffff" : "#ff5fa2"}
                  stroke="#ff5fa2"
                  strokeWidth="0.45"
                  filter="url(#handGlow)"
                />
                {fingertipIndexes.has(index) && (
                  <text x={point.x * 100 + 1.6} y={point.y * 100 - 1.2} fill="#fff" fontSize="3" fontWeight="900">
                    {index}
                  </text>
                )}
              </g>
            ))}
          </svg>
        )}
        {status !== "tracking" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-4 text-center text-base font-black text-inkWarm">
            카메라가 없어도 터치로 진행할 수 있어요.
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="rounded-full bg-cream px-4 py-2 text-sm font-black text-cocoa">상태: {status === "tracking" ? "손 추적 중" : status === "loading" ? "준비 중" : "대기"}</p>
        <Button onClick={onStart} disabled={status === "loading" || status === "tracking"} className="min-w-44">
          손 추적 켜기
        </Button>
      </div>
      {error && <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{error}</p>}
    </div>
  );
}

