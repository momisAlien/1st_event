import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DogAvatar } from "../components/Dog/DogAvatar";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { SparkleTrail } from "../components/Effects/SparkleTrail";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { CameraPreview } from "../components/MotionTracking/CameraPreview";
import { GestureDebugPanel } from "../components/MotionTracking/GestureDebugPanel";
import { HandCursor } from "../components/MotionTracking/HandCursor";
import { TarotSpread } from "../components/Tarot/TarotSpread";
import { Button } from "../components/UI/Button";
import { SafeImage } from "../components/UI/SafeImage";
import { appConfig } from "../content/appConfig";
import type { TarotCardData } from "../content/tarotCards";
import { tarotCards } from "../content/tarotCards";
import { useGestureRecognition } from "../hooks/useGestureRecognition";
import { useHandTracking } from "../hooks/useHandTracking";

type TarotSceneProps = {
  onSelectCard: (cards: TarotCardData[]) => void;
  onNext: () => void;
};

export default function TarotScene({ onSelectCard, onNext }: TarotSceneProps) {
  const [selectedCards, setSelectedCards] = useState<TarotCardData[]>([]);
  const handTracking = useHandTracking();
  const gesture = useGestureRecognition(handTracking.landmarks);
  const isComplete = selectedCards.length === 2;

  const selectCard = (card: TarotCardData) => {
    if (selectedCards.length >= 2 || selectedCards.some((selectedCard) => selectedCard.id === card.id)) return;
    const nextCards = [...selectedCards, card];
    setSelectedCards(nextCards);
    onSelectCard(nextCards);
  };

  const resetCards = () => {
    setSelectedCards([]);
    onSelectCard([]);
  };

  useEffect(() => {
    if (gesture !== "fist" || !handTracking.cursor || selectedCards.length >= 2) return;
    const roughIndex = Math.max(0, Math.min(tarotCards.length - 1, Math.floor((handTracking.cursor.x / window.innerWidth) * tarotCards.length)));
    selectCard(tarotCards[roughIndex]);
  }, [gesture, handTracking.cursor, selectedCards]);

  const readingMessage =
    selectedCards.length === 0
      ? "소담 누나! 카드 두장을 골라봐!"
      : selectedCards.length === 1
        ? `${selectedCards[0].title}이 나왔어. 한 장만 더 고르면 오늘의 리딩이 완성돼.`
        : `오늘의 두 카드는 ${selectedCards.map((card) => card.title).join(" + ")}야. 헐 대박 완전 러키비키한 카드인데?`;

  return (
    <FullScreenStage className="tarot-natural-stage">
      <SparkleTrail />
      <HandCursor cursor={handTracking.cursor} />
      {appConfig.showDebugGesturePanel && <GestureDebugPanel gesture={gesture} landmarks={handTracking.landmarks} />}
      <section className="tarot-scene-shift mx-auto grid min-h-[86dvh] content-center gap-4 pt-7 sm:gap-5 sm:pt-4">
        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="tarot-draw-result mx-auto grid w-full max-w-6xl gap-5 rounded-[38px] px-4 py-6 text-center sm:px-8 sm:py-7"
          >
            <DogAvatar state="talking" imageSrc="/assets/dog/optimized/dog-main.png" className="w-64 sm:w-96" />
            <DogSpeechBubble className="big-oracle-speech oracle-speech mx-auto w-full max-w-4xl text-lg sm:text-2xl">{readingMessage}</DogSpeechBubble>
            <div className="tarot-result-heading" aria-label="뽑은 카드">
              <span>?</span>
              <strong>뽑은 카드</strong>
              <span>?</span>
            </div>
            <div className="tarot-result-grid mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
              {selectedCards.map((card, index) => (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 36, rotate: index === 0 ? -3 : 3 }}
                  animate={{ opacity: 1, y: 0, rotate: index === 0 ? -2 : 2 }}
                  transition={{ delay: 0.15 + index * 0.14, duration: 0.55, ease: "easeOut" }}
                  className="tarot-result-card"
                >
                  <SafeImage src={card.image} alt={card.title} fallbackLabel={card.title} className="aspect-[3/4] w-full rounded-[20px] object-cover" />
                  <div className="tarot-result-copy">
                    <p>No. {card.number}</p>
                    <h3>{card.title}</h3>
                    <strong>{card.keyword}</strong>
                    <span>{card.message}</span>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="grid gap-3 sm:mx-auto sm:w-full sm:max-w-xl sm:grid-cols-2">
              <Button variant="soft" onClick={resetCards} className="tarot-readable-button w-full">
                다시 뽑기
              </Button>
              <Button onClick={onNext} className="w-full text-xl shadow-glow">
                포도 상담으로
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="tarot-natural-panel mx-auto grid w-full max-w-5xl gap-4 px-4 py-3 text-center sm:px-8">
              <DogSpeechBubble className="big-oracle-speech oracle-speech mx-auto w-full max-w-4xl text-lg sm:text-2xl">{readingMessage}</DogSpeechBubble>
            </div>

            <div className="tarot-oracle-table">
              <div className="tarot-center-dog-wrap">
                <DogAvatar state={selectedCards.length ? "talking" : "idle"} imageSrc="/assets/dog/optimized/dog-main.png" className="tarot-center-dog w-96 sm:w-[34rem]" />
              </div>
              <TarotSpread selectedCards={selectedCards} onSelect={selectCard} layout="orbit" />
            </div>

            <div className="tarot-tracking-corner">
              <CameraPreview
                videoRef={handTracking.videoRef}
                status={handTracking.status}
                error={handTracking.error}
                onStart={handTracking.startTracking}
                landmarks={handTracking.landmarks}
                showLandmarks
                className="tarot-camera-natural"
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={onNext} disabled={selectedCards.length < 2} className="w-full max-w-md text-xl shadow-glow">
                포도 상담으로
              </Button>
            </div>
          </>
        )}
      </section>
    </FullScreenStage>
  );
}


