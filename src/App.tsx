import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { SceneTransition } from "./components/Layout/SceneTransition";
import type { TarotCardData } from "./content/tarotCards";
import { useSceneMachine } from "./hooks/useSceneMachine";
import DogConsultScene from "./scenes/DogConsultScene";
import FinaleScene from "./scenes/FinaleScene";
import GestureTestScene from "./scenes/GestureTestScene";
import IntroScene from "./scenes/IntroScene";
import LetterDeliveryScene from "./scenes/LetterDeliveryScene";
import LetterScene from "./scenes/LetterScene";
import MotionPlayScene from "./scenes/MotionPlayScene";
import PhotoGalleryScene from "./scenes/PhotoGalleryScene";
import TarotScene from "./scenes/TarotScene";

export default function App() {
  const sceneMachine = useSceneMachine();
  const [selectedTarotCards, setSelectedTarotCards] = useState<TarotCardData[]>([]);

  const reset = () => {
    setSelectedTarotCards([]);
    sceneMachine.reset();
  };

  return (
    <AnimatePresence mode="wait">
      <SceneTransition key={sceneMachine.scene}>
        {sceneMachine.scene === "intro" && <IntroScene onStart={() => sceneMachine.goTo("tarot")} />}
        {sceneMachine.scene === "tarot" && (
          <TarotScene
            onSelectCard={setSelectedTarotCards}
            onNext={() => sceneMachine.goTo("consult")}
          />
        )}
        {sceneMachine.scene === "consult" && (
          <DogConsultScene
            selectedTarotCards={selectedTarotCards}
            onNext={() => sceneMachine.goTo("motionPlay")}
          />
        )}
        {sceneMachine.scene === "motionPlay" && <MotionPlayScene onNext={() => sceneMachine.goTo("letterDelivery")} onTest={() => sceneMachine.goTo("gestureTest")} />}
        {sceneMachine.scene === "gestureTest" && <GestureTestScene onBack={() => sceneMachine.goTo("motionPlay")} />}
        {sceneMachine.scene === "letterDelivery" && <LetterDeliveryScene onOpen={() => sceneMachine.goTo("letter")} />}
        {sceneMachine.scene === "letter" && <LetterScene onNext={() => sceneMachine.goTo("gallery")} />}
        {sceneMachine.scene === "gallery" && <PhotoGalleryScene onNext={() => sceneMachine.goTo("finale")} />}
        {sceneMachine.scene === "finale" && <FinaleScene onRestart={reset} />}
      </SceneTransition>
    </AnimatePresence>
  );
}
