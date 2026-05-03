import { motion } from "motion/react";
import { useState } from "react";
import type { TarotCardData } from "../../content/tarotCards";
import { SafeImage } from "../UI/SafeImage";

type OrbitPosition = { x: number; y: number; rotate: number };

type TarotCardProps = {
  card: TarotCardData;
  index: number;
  selected: boolean;
  disabled?: boolean;
  onSelect: (card: TarotCardData) => void;
  variant?: "row" | "orbit";
  orbitPosition?: OrbitPosition;
};

export function TarotCard({ card, index, selected, disabled, onSelect, variant = "row", orbitPosition }: TarotCardProps) {
  const [hovered, setHovered] = useState(false);
  const rotate = variant === "orbit" ? orbitPosition?.rotate ?? 0 : (index - 3.5) * 4.5;
  const isOrbit = variant === "orbit";

  return (
    <motion.button
      type="button"
      disabled={disabled && !selected}
      onClick={() => onSelect(card)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={
        isOrbit
          ? { opacity: 0, x: 0, y: 0, rotate: rotate + 75, scale: 0.25 }
          : { opacity: 0, y: 24, rotate }
      }
      animate={
        isOrbit
          ? {
              opacity: disabled && !selected ? 0.46 : 1,
              x: orbitPosition?.x ?? 0,
              y: orbitPosition?.y ?? 0,
              rotate: selected ? 0 : rotate,
              scale: selected ? 1.08 : hovered ? 1.04 : 1,
            }
          : { opacity: 1, y: selected || hovered ? -16 : 0, rotate: selected ? 0 : rotate, scale: selected ? 1.06 : 1 }
      }
      transition={{ delay: isOrbit ? index * 0.08 : index * 0.04, type: "spring", stiffness: 170, damping: 18 }}
      className={`${isOrbit ? "tarot-orbit-card" : "group relative h-52 w-36 shrink-0 rounded-[22px] bg-transparent p-0 text-left sm:h-64 sm:w-44"}`}
      aria-label={`${card.title} 선택`}
    >
      <div className={`absolute inset-0 rounded-[22px] bg-roseMilk blur-xl transition ${hovered || selected ? "opacity-90" : "opacity-0"}`} />
      <motion.div animate={{ rotateY: selected ? 180 : 0 }} transition={{ duration: 0.62, ease: "easeInOut" }} className="relative h-full w-full [transform-style:preserve-3d]">
        <div className="absolute inset-0 overflow-hidden rounded-[22px] border border-white/80 bg-inkWarm shadow-soft [backface-visibility:hidden]">
          <SafeImage src="/assets/tarrotcard/card-back.png" alt="타로 카드 뒷면" fallbackLabel="TAROT" className="h-full w-full rounded-[22px] object-cover" />
          <div className="absolute inset-3 rounded-[18px] border border-white/45" />
          <span className="absolute inset-x-0 bottom-6 text-center text-xs font-black tracking-[0.22em] text-white/90">DOG TAROT</span>
        </div>
        <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col overflow-hidden rounded-[22px] border border-white bg-cream shadow-soft [backface-visibility:hidden]">
          <SafeImage src={card.image} alt={card.title} fallbackLabel={card.title} className="h-28 w-full rounded-t-[22px] object-cover sm:h-36" />
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <p className="text-xs font-bold text-cocoa">No. {card.number} · {card.keyword}</p>
              <h3 className="mt-1 text-lg font-black">{card.title}</h3>
            </div>
            <p className="text-xs leading-5 text-inkWarm/78">{card.message}</p>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
