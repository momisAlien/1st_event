import type { ReactNode } from "react";
import { MagicCursor } from "../Effects/MagicCursor";
import { MysticTarotRoom } from "./MysticTarotRoom";

type FullScreenStageProps = {
  children: ReactNode;
  className?: string;
};

export function FullScreenStage({ children, className = "" }: FullScreenStageProps) {
  return (
    <main className={`stage-bg cinematic-stage relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 text-inkWarm ${className}`}>
      <MysticTarotRoom />
      <div className="cinematic-aurora" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,245,214,0.22)_1px,transparent_0)] [background-size:34px_34px]" />
      <MagicCursor />
      <div className="stage-content relative z-10 w-full max-w-6xl">{children}</div>
    </main>
  );
}
