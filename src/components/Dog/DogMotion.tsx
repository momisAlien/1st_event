import { motion } from "motion/react";
import type { TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference";

export type DogMotionState =
  | "idle"
  | "happy"
  | "thinking"
  | "talking"
  | "letter"
  | "celebrate"
  | "petting"
  | "fingerHeart"
  | "poke"
  | "wave";

type DogMotionProps = {
  state: DogMotionState;
  children: ReactNode;
  className?: string;
};

const animationByState: Record<DogMotionState, TargetAndTransition> = {
  idle: { y: [0, -8, 0], rotate: [0, 0.5, 0] },
  happy: { y: [0, -10, 0], rotate: [-2, 2, -2] },
  thinking: { rotate: [0, -6, 4, 0], y: [0, -4, 0] },
  talking: { y: [0, -5, 0], scale: [1, 1.025, 1] },
  letter: { x: [-8, 8, -4, 0], y: [0, -6, 0, -3] },
  celebrate: { y: [0, -14, 0], rotate: [-4, 4, -4] },
  petting: { y: [0, 5, -4, 0], rotate: [0, -2, 2, 0], scale: [1, 0.985, 1.02, 1] },
  fingerHeart: { y: [0, -8, 0], scale: [1, 1.04, 1], rotate: [-1, 1, -1] },
  poke: { x: [0, 5, -4, 0], scale: [1, 0.97, 1.03, 1] },
  wave: { rotate: [-3, 4, -3], y: [0, -6, 0] },
};

export function DogMotion({ state, children, className = "" }: DogMotionProps) {
  const reduced = useReducedMotionPreference();

  return (
    <motion.div
      animate={reduced ? undefined : animationByState[state]}
      transition={{ duration: state === "celebrate" ? 1.1 : 2.1, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
