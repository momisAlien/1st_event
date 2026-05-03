import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const variants = {
  primary: "bg-[#ff5fa2] text-white shadow-[0_18px_40px_rgba(255,95,162,0.38)] hover:bg-[#ff438f]",
  soft: "bg-white/92 text-inkWarm shadow-soft hover:bg-white",
  ghost: "bg-white/32 text-inkWarm hover:bg-white/60",
};

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      className={`inline-flex min-h-14 items-center justify-center rounded-full px-7 py-4 text-base font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
