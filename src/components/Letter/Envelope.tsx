import { motion } from "motion/react";
import { SafeImage } from "../UI/SafeImage";

type EnvelopeProps = {
  isOpen: boolean;
  onOpen: () => void;
};

export function Envelope({ isOpen, onOpen }: EnvelopeProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.96 }}
      animate={isOpen ? { y: -18, scale: 1.06 } : { rotate: [-1, 1, -1] }}
      transition={{ duration: isOpen ? 0.6 : 2.1, repeat: isOpen ? 0 : Infinity }}
      className="relative mx-auto h-40 w-64 rounded-[24px] bg-transparent p-0 sm:h-48 sm:w-80"
      aria-label="편지 열기"
    >
      <SafeImage src="/assets/letter/envelope.png" alt="편지 봉투" fallbackLabel="편지 봉투" className="envelope-css h-full w-full rounded-[24px] object-cover shadow-soft" />
      <motion.div
        animate={isOpen ? { rotateX: 68, y: -30 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-8 right-8 top-4 h-20 origin-top rounded-t-[22px] bg-white/65 shadow-soft"
      />
      <motion.div
        animate={isOpen ? { y: -88, opacity: 1 } : { y: -20, opacity: 0 }}
        className="paper-texture absolute left-10 right-10 top-10 h-36 rounded-[18px] border border-cocoa/10 shadow-soft"
      />
    </motion.button>
  );
}
