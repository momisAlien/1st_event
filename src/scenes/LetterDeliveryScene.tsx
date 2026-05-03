import { useState } from "react";
import { DogAvatar } from "../components/Dog/DogAvatar";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { Envelope } from "../components/Letter/Envelope";
import { FullScreenStage } from "../components/Layout/FullScreenStage";

const letterSpeeches = [
  "멍! 이건 내가 몰래 가져온 아주 중요한 편지야.",
  "누나 이거 한 번 읽어봐!",
  "정말 정말 중요한 편지를 가져왔어!",
];

type LetterDeliverySceneProps = {
  onOpen: () => void;
};

export default function LetterDeliveryScene({ onOpen }: LetterDeliverySceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);

  const open = () => {
    if (isOpen) return;
    setIsOpen(true);
    window.setTimeout(onOpen, 1120);
  };

  const rotateSpeech = () => {
    setSpeechIndex((index) => (index + 1) % letterSpeeches.length);
  };

  return (
    <FullScreenStage>
      <section className="mx-auto grid min-h-[86dvh] max-w-3xl content-center gap-7 text-center pt-8">
        <DogSpeechBubble className="big-oracle-speech oracle-speech mx-auto w-full max-w-2xl text-lg sm:text-2xl">{letterSpeeches[speechIndex]}</DogSpeechBubble>
        <DogAvatar state="letter" className="w-72 sm:w-96" onClick={rotateSpeech} />
        <Envelope isOpen={isOpen} onOpen={open} />
      </section>
    </FullScreenStage>
  );
}
