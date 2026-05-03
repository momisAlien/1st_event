import { motion } from "motion/react";
import type { ReactNode } from "react";

type SceneTransitionProps = {
  children: ReactNode;
};

export function SceneTransition({ children }: SceneTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="min-h-dvh"
    >
      {children}
    </motion.div>
  );
}
