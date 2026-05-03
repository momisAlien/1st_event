import { motion } from "motion/react";
import { useMemo } from "react";
import { randomBetween } from "../../lib/particles";

type ConfettiProps = {
  count?: number;
};

export function Confetti({ count = 42 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, index) => ({
        id: index,
        left: randomBetween(0, 100),
        delay: randomBetween(0, 1.8),
        duration: randomBetween(3.5, 6),
        color: ["#ff9eb5", "#ffd166", "#95e1d3", "#b8c0ff", "#ffffff"][index % 5],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-[-20px] h-3 w-2 rounded-[3px]"
          style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
          animate={{ y: "110vh", rotate: [0, 120, 280], x: [0, 18, -14] }}
          transition={{ duration: piece.duration, delay: piece.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
