import { Heart, MoonStar, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { DogAvatar } from "../components/Dog/DogAvatar";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { HeartBurst } from "../components/Effects/HeartBurst";
import { PetalParticles } from "../components/Effects/PetalParticles";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { Button } from "../components/UI/Button";
import { preloadImages } from "../lib/imageUtils";

const floatingCards = [
  { label: "LOVE", rotate: -11, x: "8%", y: "22%" },
  { label: "MOON", rotate: 8, x: "78%", y: "18%" },
  { label: "STAR", rotate: 14, x: "12%", y: "68%" },
  { label: "FATE", rotate: -8, x: "82%", y: "66%" },
];

const podoImages = [
  "/assets/dog/optimized/dog-happy.png",
  "/assets/dog/optimized/dog-heart.png",
  "/assets/dog/optimized/dog-v.png",
  "/assets/dog/optimized/dog-wave.png",
  "/assets/dog/optimized/dog-thinking.png",
];

type IntroSceneProps = {
  onStart: () => void;
};

export default function IntroScene({ onStart }: IntroSceneProps) {
  const [podoImageIndex, setPodoImageIndex] = useState(0);
  const [heartTrigger, setHeartTrigger] = useState(0);
  const [speech, setSpeech] = useState("쉿... 오늘은 포도의 비밀 타로 상담소 문이 열린 날이야.");

  useEffect(() => {
    preloadImages(podoImages);
  }, []);

  const petPodo = () => {
    setPodoImageIndex((index) => (index + 1) % podoImages.length);
    setHeartTrigger((value) => value + 1);
    setSpeech("멍! 방금 손끝에서 반짝이는 마음이 감지됐어. 이제 카드를 펼쳐볼까?");
  };

  return (
    <FullScreenStage className="intro-motion-stage">
      <PetalParticles density={8} />
      <section className="motion-hero mx-auto grid min-h-[86dvh] w-full max-w-6xl content-center gap-7 py-8 text-center">
        <div className="motion-hero-orbit" aria-hidden="true">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              className="floating-tarot-card"
              style={{ left: card.x, top: card.y, rotate: `${card.rotate}deg` }}
              animate={{ y: [0, -18, 0], rotate: [card.rotate, card.rotate + 4, card.rotate] }}
              transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={18} />
              <span>{card.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="motion-hero-panel mx-auto grid w-full max-w-5xl gap-7 px-5 py-7 sm:px-9 sm:py-9"
        >
          <div className="mx-auto flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-5 py-2 text-sm font-black tracking-[0.24em] text-white/85 shadow-glow">
            <MoonStar size={18} />
            PODO TAROT ORACLE
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:text-left">
            <div className="grid gap-6">
              <motion.h1
                className="motion-hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.58 }}
              >
                <span className="podo-title-line">포도의</span><span className="podo-heart-title podo-title-line">두근두근</span><span className="podo-title-line">비밀 타로</span><span className="podo-title-line">상담소</span>
              </motion.h1>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-start">
                <Button onClick={onStart} className="motion-start-button text-xl">
                  카드 펼치기
                </Button>
                <button type="button" onClick={petPodo} className="motion-secondary-button rounded-full px-7 py-4 text-base font-black text-white">
                  포도 쓰담하기
                </button>
              </div>
            </div>

            <div className="motion-dog-stage mx-auto w-full max-w-md">
              <div className="motion-dog-halo" />
              <DogSpeechBubble className="motion-dog-speech oracle-speech mb-4 text-base sm:text-xl">{speech}</DogSpeechBubble>
              <div className="relative mx-auto w-72 sm:w-96">
                <HeartBurst trigger={heartTrigger} />
                <DogAvatar state="thinking" imageSrc={podoImages[podoImageIndex]} onClick={petPodo} />
              </div>
              <button type="button" onClick={petPodo} className="motion-touch-hint">
                <Heart size={16} />
                <span>포도를 만져봐!</span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </FullScreenStage>
  );
}


