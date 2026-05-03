import { motion } from "motion/react";

type HandCursorProps = {
  cursor: { x: number; y: number } | null;
};

export function HandCursor({ cursor }: HandCursorProps) {
  if (!cursor) return null;
  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-9 w-9 rounded-full border-2 border-white bg-roseMilk/65 shadow-glow"
      animate={{ x: cursor.x - 18, y: cursor.y - 18 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    />
  );
}
