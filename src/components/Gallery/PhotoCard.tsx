import { motion } from "motion/react";
import { SafeImage } from "../UI/SafeImage";

type PhotoCardProps = {
  src: string;
  caption: string;
  index: number;
};

export function PhotoCard({ src, caption, index }: PhotoCardProps) {
  const tilt = index % 2 === 0 ? -2.5 : 2.5;

  return (
    <motion.article
      key={src}
      initial={{ opacity: 0, y: 24, rotate: tilt * 1.8 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="mx-auto w-full max-w-sm rounded-[18px] bg-white p-4 shadow-soft"
    >
      <SafeImage
        src={src}
        alt={caption}
        fallbackLabel="여기에 둘만의 사진을 넣어주세요."
        className="aspect-[4/5] w-full rounded-[12px] object-cover"
      />
      <p className="mt-4 min-h-8 text-center text-base font-black text-inkWarm">{caption}</p>
    </motion.article>
  );
}
