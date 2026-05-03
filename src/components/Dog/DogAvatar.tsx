import { motion } from "motion/react";
import { SafeImage } from "../UI/SafeImage";
import { DogMotion, type DogMotionState } from "./DogMotion";

const dogImageByState: Record<DogMotionState, string> = {
  idle: "/assets/dog/dog-main.png",
  happy: "/assets/dog/dog-happy.png",
  thinking: "/assets/dog/dog-main.png",
  talking: "/assets/dog/dog-main.png",
  letter: "/assets/dog/dog-letter.png",
  celebrate: "/assets/dog/dog-celebrate.png",
  petting: "/assets/dog/dog-petting.png",
  fingerHeart: "/assets/dog/dog-heart.png",
  poke: "/assets/dog/dog-poke.png",
  wave: "/assets/dog/dog-wave.png",
};

type DogAvatarProps = {
  state?: DogMotionState;
  imageSrc?: string;
  className?: string;
  onClick?: () => void;
};

export function DogAvatar({ state = "idle", imageSrc, className = "", onClick }: DogAvatarProps) {
  return (
    <DogMotion state={state} className={`relative mx-auto ${className}`}>
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.94 }}
        className="relative block w-full bg-transparent p-0 drop-shadow-[0_18px_32px_rgba(0,0,0,0.35)]"
        aria-label="포도"
      >
        <SafeImage
          src={imageSrc ?? dogImageByState[state]}
          alt="상담해주는 포도"
          fallbackLabel={`포도 ${state}`}
          className="aspect-square w-full rounded-[32px] object-contain"
        />
      </motion.button>
    </DogMotion>
  );
}


