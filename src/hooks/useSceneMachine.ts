import { useState } from "react";

export type SceneId = "intro" | "tarot" | "consult" | "motionPlay" | "gestureTest" | "letterDelivery" | "letter" | "gallery" | "finale";

export function useSceneMachine() {
  const [scene, setScene] = useState<SceneId>("intro");

  return {
    scene,
    goTo: setScene,
    reset: () => setScene("intro"),
  };
}
