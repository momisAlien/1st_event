import { motion } from "motion/react";
import type { ReactNode } from "react";

type DogSpeechBubbleProps = {
  children: ReactNode;
  className?: string;
};

export function DogSpeechBubble({ children, className = "" }: DogSpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-[28px] bg-white/88 px-5 py-4 text-sm font-semibold leading-7 text-inkWarm shadow-soft backdrop-blur ${className}`}
    >
      {children}
      <span className="absolute -bottom-2 left-10 h-5 w-5 rotate-45 bg-white/88" />
    </motion.div>
  );
}
