import { motion } from "motion/react";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { Confetti } from "../components/Effects/Confetti";
import { PetalParticles } from "../components/Effects/PetalParticles";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { Button } from "../components/UI/Button";
import { SafeImage } from "../components/UI/SafeImage";
import { characterMessages } from "../content/characterMessages";

type FinaleSceneProps = {
  onRestart: () => void;
};

const positions = [
  "left-[21%] top-[8%] sm:left-[23%] sm:top-[9%]",
  "right-[21%] top-[9%] sm:right-[24%] sm:top-[10%]",
  "left-1/2 bottom-[4%] -translate-x-1/2 sm:bottom-[5%]",
];

export default function FinaleScene({ onRestart }: FinaleSceneProps) {
  return (
    <FullScreenStage className="finale-anniversary-stage">
      <Confetti />
      <PetalParticles density={22} />
      <section className="finale-stage anniversary-finale-stage relative min-h-dvh w-screen overflow-hidden p-4 text-center sm:p-8">
        <div className="anniversary-cake-glow" aria-hidden="true" />
        <div className="anniversary-fireworks" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="anniversary-heart-rain" aria-hidden="true">
          <span>♥</span><span>✦</span><span>♥</span><span>✧</span><span>♥</span><span>✦</span><span>♥</span>
        </div>
        <div className="anniversary-light-rays" aria-hidden="true"><span /><span /><span /></div>

        <div className="relative z-10 mx-auto flex min-h-[88dvh] max-w-5xl flex-col items-center justify-center gap-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="anniversary-kicker"
          >
            1주년 축하 편지
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="finale-title"
          >
            1주년 축하해!
            <br />
            앞으로도 잘 지내자
            <br />
            사랑해♥
          </motion.h1>
          <div className="finale-subtitle rounded-full px-6 py-4 text-base font-black shadow-soft sm:text-xl">준서오빠가</div>
          <Button onClick={onRestart} className="w-full max-w-sm text-xl shadow-glow">
            처음부터 다시 보기
          </Button>
        </div>

        {characterMessages.map((character, index) => (
          <motion.div
            key={character.id}
            className={`absolute z-20 w-36 sm:w-52 lg:w-60 ${positions[index]}`}
            animate={{ y: [0, -14, 0], rotate: index % 2 === 0 ? [-2, 2, -2] : [2, -2, 2] }}
            transition={{ duration: 2.2 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <DogSpeechBubble className="finale-character-speech mb-3 px-3 py-2 text-xs leading-5 sm:text-sm">{character.message}</DogSpeechBubble>
            <SafeImage src={character.src} alt={character.name} fallbackLabel={character.fallbackLabel} className="aspect-square w-full rounded-[28px] object-contain shadow-soft" />
          </motion.div>
        ))}
      </section>
    </FullScreenStage>
  );
}
