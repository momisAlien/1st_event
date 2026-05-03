import { useCallback, useState } from "react";
import { PetalParticles } from "../components/Effects/PetalParticles";
import { LetterPaper } from "../components/Letter/LetterPaper";
import { TypewriterLetter } from "../components/Letter/TypewriterLetter";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { Button } from "../components/UI/Button";
import { letterContent } from "../content/letterContent";

type LetterSceneProps = {
  onNext: () => void;
};

export default function LetterScene({ onNext }: LetterSceneProps) {
  const [done, setDone] = useState(false);
  const [petalKey, setPetalKey] = useState(0);
  const step = useCallback(() => setPetalKey((value) => value + 1), []);
  const complete = useCallback(() => setDone(true), []);

  return (
    <FullScreenStage className="py-4">
      <PetalParticles active={!done} burstKey={petalKey} density={3} />
      <LetterPaper>
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-cocoa/10 pb-4">
          <p className="text-sm font-black text-cocoa">너에게 보내는 편지</p>
          <p className="text-xs font-bold text-cocoa/65">오늘의 마음</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <TypewriterLetter content={letterContent} onComplete={complete} onStep={step} />
        </div>
        {done && (
          <div className="mt-6 flex justify-center">
            <Button onClick={onNext} className="w-full max-w-xs">
              우리 사진 보러가기
            </Button>
          </div>
        )}
      </LetterPaper>
    </FullScreenStage>
  );
}
