import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SafeImage } from "../UI/SafeImage";

type LetterPaperProps = {
  children: ReactNode;
};

export function LetterPaper({ children }: LetterPaperProps) {
  return (
    <motion.section
      initial={{ scale: 0.65, opacity: 0, y: 38 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: "easeOut" }}
      className="paper-texture relative mx-auto flex min-h-[76dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-white/80 p-6 shadow-soft sm:p-10"
    >
      <SafeImage
        src="/assets/letter/letter-paper.png"
        alt="편지지 배경"
        fallbackLabel=""
        className="pointer-events-none absolute inset-0 h-full w-full rounded-[30px] object-cover opacity-0"
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </motion.section>
  );
}
