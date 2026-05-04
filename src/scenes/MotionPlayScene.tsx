import { useEffect, useMemo, useRef, useState } from "react";
import { DogAvatar } from "../components/Dog/DogAvatar";
import type { DogMotionState } from "../components/Dog/DogMotion";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { HeartBurst } from "../components/Effects/HeartBurst";
import { PetalParticles } from "../components/Effects/PetalParticles";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { CameraPreview } from "../components/MotionTracking/CameraPreview";
import { GestureDebugPanel } from "../components/MotionTracking/GestureDebugPanel";
import { HandCursor } from "../components/MotionTracking/HandCursor";
import { Button } from "../components/UI/Button";
import { appConfig } from "../content/appConfig";
import { defaultMotionPlaySpeech, dogGestureReactions, type DogReaction } from "../content/dogGestureReactions";
import { useGestureRecognition } from "../hooks/useGestureRecognition";
import { useHandTracking } from "../hooks/useHandTracking";
import { loadSavedHandPoses, matchSavedHandPose } from "../lib/customGestureStorage";
import type { GestureName } from "../lib/gestureUtils";
import { preloadImages } from "../lib/imageUtils";

type MotionPlaySceneProps = {
  onNext: () => void;
  onTest: () => void;
};

const fallbackButtons: GestureName[] = ["petting", "fingerHeart", "poke", "wave", "fist", "swipeLeft", "swipeRight"];

export default function MotionPlayScene({ onNext, onTest }: MotionPlaySceneProps) {
  const handTracking = useHandTracking();
  const gesture = useGestureRecognition(handTracking.landmarks);
  const savedPoses = useMemo(() => loadSavedHandPoses(), []);
  const matchedPose = useMemo(() => matchSavedHandPose(handTracking.landmarks, savedPoses), [handTracking.landmarks, savedPoses]);
  const effectiveGesture = matchedPose?.targetGesture ?? gesture;
  const [interactionCount, setInteractionCount] = useState(0);
  const [heartTrigger, setHeartTrigger] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [dogState, setDogState] = useState<DogMotionState>("idle");
  const [dogImageSrc, setDogImageSrc] = useState<string | undefined>(undefined);
  const [speech, setSpeech] = useState(defaultMotionPlaySpeech);
  const [lastReactionLabel, setLastReactionLabel] = useState("대기 중");
  const lastGestureRef = useRef(0);
  const activeGestureRef = useRef<GestureName>("none");
  const candidateGestureRef = useRef<GestureName>("none");
  const candidateFrameCountRef = useRef(0);
  const speechCycleRef = useRef<Partial<Record<GestureName, number>>>({});
  const canReceiveLetter = interactionCount >= appConfig.requiredPlayInteractions;

  useEffect(() => {
    preloadImages(Object.values(dogGestureReactions).map((reaction) => reaction.image).concat("/assets/dog/optimized/dog-letter.png"));
  }, []);

  const pickSpeech = (reaction: DogReaction) => {
    if (!Array.isArray(reaction.speech)) return reaction.speech;
    const index = speechCycleRef.current[reaction.gesture] ?? 0;
    speechCycleRef.current[reaction.gesture] = (index + 1) % reaction.speech.length;
    return reaction.speech[index % reaction.speech.length];
  };

  const applyReaction = (reaction: DogReaction) => {
    setInteractionCount((count) => Math.min(appConfig.requiredPlayInteractions, count + 1));
    setDogState(reaction.dogState);
    setDogImageSrc(reaction.image);
    setSpeech(pickSpeech(reaction));
    setLastReactionLabel(reaction.label);
    if (reaction.effect === "heart") setHeartTrigger((value) => value + 1);
    else setBurstKey((value) => value + 1);
  };

  const applyGesture = (gestureName: GestureName) => {
    const reaction = dogGestureReactions[gestureName];
    if (!reaction) return;
    activeGestureRef.current = gestureName;
    applyReaction(reaction);
  };

  useEffect(() => {
    if (effectiveGesture === "none") {
      candidateGestureRef.current = "none";
      candidateFrameCountRef.current = 0;
      return;
    }

    const now = Date.now();
    if (candidateGestureRef.current !== effectiveGesture) {
      candidateGestureRef.current = effectiveGesture;
      candidateFrameCountRef.current = 1;
    } else {
      candidateFrameCountRef.current += 1;
    }

    const confidentSavedPose = Boolean(matchedPose && matchedPose.score <= 0.36);
    const requiredFrames = confidentSavedPose ? 1 : 2;
    const reactionIntervalMs = confidentSavedPose ? 140 : 320;

    if (effectiveGesture === activeGestureRef.current) return;
    if (candidateFrameCountRef.current < requiredFrames) return;
    if (now - lastGestureRef.current < reactionIntervalMs) return;

    lastGestureRef.current = now;
    applyGesture(effectiveGesture);
  }, [effectiveGesture, matchedPose]);

  useEffect(() => {
    if (!canReceiveLetter) return;
    setDogState("letter");
    setDogImageSrc("/assets/dog/optimized/dog-letter.png");
    setSpeech("좋아! 포도랑 충분히 놀았어. 이제 내가 숨겨둔 편지를 가져올게.");
    setLastReactionLabel("편지 준비 완료");
  }, [canReceiveLetter]);

  return (
    <FullScreenStage>
      <PetalParticles active={burstKey > 0} burstKey={burstKey} density={10} />
      <HandCursor cursor={handTracking.cursor} />
      {appConfig.showDebugGesturePanel && <GestureDebugPanel gesture={effectiveGesture} landmarks={handTracking.landmarks} />}
      <section className="mx-auto grid min-h-[86dvh] max-w-4xl content-center gap-5 pt-8">
        <div className="motion-play-natural grid gap-5 px-5 py-6 text-center sm:px-8">
          <div className="mx-auto rounded-full border border-[#ffe9ad]/35 bg-[#251b37]/85 px-5 py-2 text-sm font-black tracking-[0.16em] text-[#ffe9ad] shadow-glow">
            {matchedPose ? `${lastReactionLabel} · 저장 포즈 ${matchedPose.name}` : lastReactionLabel}
          </div>
          <DogSpeechBubble className="big-oracle-speech oracle-speech mx-auto w-full max-w-3xl text-lg sm:text-2xl">{speech}</DogSpeechBubble>
          <div className="relative mx-auto w-72 sm:w-96">
            <HeartBurst trigger={heartTrigger} />
            <DogAvatar state={dogState} imageSrc={dogImageSrc} onClick={() => applyGesture("petting")} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <CameraPreview videoRef={handTracking.videoRef} status={handTracking.status} error={handTracking.error} onStart={handTracking.startTracking} className="tarot-camera-natural" />
        </div>
        <div className="rounded-full bg-white/88 p-2 shadow-soft">
          <div className="h-4 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[#ff5fa2] transition-all" style={{ width: `${(interactionCount / appConfig.requiredPlayInteractions) * 100}%` }} />
          </div>
        </div>
        <div className="gesture-action-panel grid grid-cols-2 gap-2 sm:grid-cols-4">
          {fallbackButtons.map((name) => (
            <Button key={name} variant="soft" onClick={() => applyGesture(name)} className="gesture-action-button px-3 text-sm">
              {dogGestureReactions[name]?.label}
            </Button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="soft" onClick={onTest} className="gesture-action-button w-full">
            손동작 테스트 페이지
          </Button>
          <Button onClick={onNext} disabled={!canReceiveLetter} className="w-full text-xl">
            편지 받기
          </Button>
        </div>
      </section>
    </FullScreenStage>
  );
}
