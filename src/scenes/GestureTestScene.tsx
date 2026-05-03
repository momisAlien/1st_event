import { useEffect, useMemo, useRef, useState } from "react";
import { DogAvatar } from "../components/Dog/DogAvatar";
import type { DogMotionState } from "../components/Dog/DogMotion";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { CameraPreview } from "../components/MotionTracking/CameraPreview";
import { GestureDebugPanel } from "../components/MotionTracking/GestureDebugPanel";
import { HandCursor } from "../components/MotionTracking/HandCursor";
import { Button } from "../components/UI/Button";
import { dogGestureReactions } from "../content/dogGestureReactions";
import { useGestureRecognition } from "../hooks/useGestureRecognition";
import { useHandTracking } from "../hooks/useHandTracking";
import { loadSavedHandPoses, matchSavedHandPose, rankSavedHandPoses, saveHandPoses, type SavedHandPose } from "../lib/customGestureStorage";
import { distance, type GestureName, type Landmark } from "../lib/gestureUtils";

type GestureTestSceneProps = {
  onBack: () => void;
};

const testGestures: GestureName[] = ["petting", "fingerHeart", "poke", "wave", "fist", "swipeLeft", "swipeRight", "openPalm", "pinch", "point"];
const trainingGestures: GestureName[] = ["petting", "fingerHeart", "poke", "wave", "fist", "swipeLeft", "swipeRight"];
const trainingSecondsPerGesture = 10;
const trainingSampleIntervalMs = 520;
const maxSavedPoses = 240;

function speechPreview(speech?: string | string[]) {
  if (!speech) return "손 추적을 켜고 직접 포즈를 만들어봐. 손가락 관절이 보이면 원하는 행동 이름으로 저장할 수 있어.";
  return Array.isArray(speech) ? speech[0] : speech;
}

function copyLandmarks(landmarks: Landmark[]) {
  return landmarks.map((point) => ({ x: point.x, y: point.y, z: point.z }));
}

function gestureLabel(gesture: GestureName) {
  return dogGestureReactions[gesture]?.label ?? gesture;
}

export default function GestureTestScene({ onBack }: GestureTestSceneProps) {
  const handTracking = useHandTracking();
  const detectedGesture = useGestureRecognition(handTracking.landmarks);
  const [activeGesture, setActiveGesture] = useState<GestureName>("none");
  const [targetGesture, setTargetGesture] = useState<GestureName>("petting");
  const [poseName, setPoseName] = useState("내 손동작 1");
  const [savedPoses, setSavedPoses] = useState<SavedHandPose[]>(() => loadSavedHandPoses());
  const [dogState, setDogState] = useState<DogMotionState>("idle");
  const [dogImageSrc, setDogImageSrc] = useState<string | undefined>(undefined);
  const [trainingActive, setTrainingActive] = useState(false);
  const [trainingIndex, setTrainingIndex] = useState(0);
  const [trainingSecondsLeft, setTrainingSecondsLeft] = useState(trainingSecondsPerGesture);
  const [trainingSampleCount, setTrainingSampleCount] = useState(0);
  const [trainingMessage, setTrainingMessage] = useState("7개 모션을 10초씩 자동 학습할 수 있어요.");
  const lastGestureRef = useRef(0);
  const landmarksRef = useRef<Landmark[]>([]);
  const trainingSamplesRef = useRef<SavedHandPose[]>([]);
  const trainingGestureStartedAtRef = useRef(0);
  const lastTrainingSampleAtRef = useRef(0);
  const candidateGestureRef = useRef<GestureName>("none");
  const candidateFrameCountRef = useRef(0);
  const matchedPose = useMemo(() => matchSavedHandPose(handTracking.landmarks, savedPoses), [handTracking.landmarks, savedPoses]);
  const rankedPoses = useMemo(() => rankSavedHandPoses(handTracking.landmarks, savedPoses).slice(0, 3), [handTracking.landmarks, savedPoses]);
  const effectiveGesture = matchedPose?.targetGesture ?? detectedGesture;
  const reaction = dogGestureReactions[activeGesture];
  const currentTrainingGesture = trainingGestures[trainingIndex] ?? trainingGestures[0];

  useEffect(() => {
    landmarksRef.current = handTracking.landmarks;
  }, [handTracking.landmarks]);

  const metrics = useMemo(() => {
    const landmarks = handTracking.landmarks;
    const pinchDistance = landmarks[4] && landmarks[8] ? distance(landmarks[4], landmarks[8]) : null;
    const indexY = landmarks[8]?.y ?? null;
    const palmX = landmarks[0]?.x ?? null;
    return { pinchDistance, indexY, palmX };
  }, [handTracking.landmarks]);

  const persistPoses = (poses: SavedHandPose[]) => {
    const limited = poses.slice(0, maxSavedPoses);
    setSavedPoses(limited);
    saveHandPoses(limited);
  };

  const saveCurrentPose = () => {
    if (handTracking.landmarks.length < 21) return;
    const nextPose: SavedHandPose = {
      id: `${Date.now()}`,
      name: poseName.trim() || `${targetGesture} pose`,
      targetGesture,
      detectedGesture,
      landmarks: copyLandmarks(handTracking.landmarks),
      createdAt: new Date().toISOString(),
    };
    persistPoses([nextPose, ...savedPoses]);
  };

  const deletePose = (id: string) => {
    persistPoses(savedPoses.filter((pose) => pose.id !== id));
  };

  const applyGesture = (gesture: GestureName) => {
    setActiveGesture(gesture);
    if (gesture !== "none") setTargetGesture(gesture);
    const nextReaction = dogGestureReactions[gesture];
    if (!nextReaction) return;
    setDogState(nextReaction.dogState);
    setDogImageSrc(nextReaction.image);
  };

  const startTraining = () => {
    trainingSamplesRef.current = [];
    setTrainingActive(true);
    setTrainingIndex(0);
    setTrainingSecondsLeft(trainingSecondsPerGesture);
    setTrainingSampleCount(0);
    setTargetGesture(trainingGestures[0]);
    applyGesture(trainingGestures[0]);
    trainingGestureStartedAtRef.current = Date.now();
    lastTrainingSampleAtRef.current = 0;
    setTrainingMessage("학습 시작! 첫 동작은 쓰담쓰담이야. 멀리/가까이/각도를 조금씩 바꿔줘.");
    if (handTracking.status !== "tracking") handTracking.startTracking();
  };

  const stopTraining = () => {
    setTrainingActive(false);
    if (trainingSamplesRef.current.length > 0) {
      persistPoses([...trainingSamplesRef.current, ...savedPoses]);
    }
    setTrainingMessage(`학습을 멈췄어요. ${trainingSamplesRef.current.length}개 샘플을 저장했어요.`);
    trainingSamplesRef.current = [];
  };

  useEffect(() => {
    if (!trainingActive) return;
    const interval = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - trainingGestureStartedAtRef.current;
      const secondsLeft = Math.max(0, trainingSecondsPerGesture - Math.floor(elapsed / 1000));
      setTrainingSecondsLeft(secondsLeft);

      const landmarks = landmarksRef.current;
      const gestureName = trainingGestures[trainingIndex];
      if (gestureName && landmarks.length >= 21 && now - lastTrainingSampleAtRef.current >= trainingSampleIntervalMs) {
        const label = gestureLabel(gestureName);
        trainingSamplesRef.current = [
          {
            id: `train-${now}-${trainingSamplesRef.current.length}`,
            name: `자동학습 ${label} ${trainingSamplesRef.current.length + 1}`,
            targetGesture: gestureName,
            detectedGesture,
            landmarks: copyLandmarks(landmarks),
            createdAt: new Date(now).toISOString(),
          },
          ...trainingSamplesRef.current,
        ];
        lastTrainingSampleAtRef.current = now;
        setTrainingSampleCount(trainingSamplesRef.current.length);
      }

      if (elapsed >= trainingSecondsPerGesture * 1000) {
        const nextIndex = trainingIndex + 1;
        if (nextIndex >= trainingGestures.length) {
          setTrainingActive(false);
          persistPoses([...trainingSamplesRef.current, ...savedPoses]);
          setTrainingMessage(`학습 완료! ${trainingSamplesRef.current.length}개 샘플을 저장했어요. 이제 손동작 놀이에서 테스트해봐요.`);
          trainingSamplesRef.current = [];
          return;
        }
        const nextGesture = trainingGestures[nextIndex];
        setTrainingIndex(nextIndex);
        setTargetGesture(nextGesture);
        applyGesture(nextGesture);
        trainingGestureStartedAtRef.current = now;
        lastTrainingSampleAtRef.current = 0;
        setTrainingSecondsLeft(trainingSecondsPerGesture);
        setTrainingMessage(`${gestureLabel(nextGesture)} 학습 중! 멀리서 한 번, 가까이서 한 번, 손을 살짝 돌려서 보여줘.`);
      }
    }, 180);

    return () => window.clearInterval(interval);
  }, [trainingActive, trainingIndex, detectedGesture, savedPoses]);

  useEffect(() => {
    if (trainingActive) return;
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
    const reactionIntervalMs = confidentSavedPose ? 90 : 240;

    if (effectiveGesture === activeGesture) return;
    if (candidateFrameCountRef.current < requiredFrames) return;
    if (now - lastGestureRef.current < reactionIntervalMs) return;

    lastGestureRef.current = now;
    applyGesture(effectiveGesture);
  }, [activeGesture, effectiveGesture, matchedPose, trainingActive]);

  return (
    <FullScreenStage>
      <HandCursor cursor={handTracking.cursor} />
      <GestureDebugPanel gesture={effectiveGesture} landmarks={handTracking.landmarks} />
      <section className="gesture-test-scene mx-auto grid min-h-[86dvh] max-w-6xl content-center gap-5 pt-8">
        <div className="gesture-test-hero grid gap-5 text-center sm:px-8">
          <div className="mx-auto rounded-full border border-[#ffe9ad]/35 bg-[#251b37]/85 px-5 py-2 text-sm font-black tracking-[0.16em] text-[#ffe9ad] shadow-glow">
            손동작 테스트 · 감지: {detectedGesture} {matchedPose ? `· 저장 포즈: ${matchedPose.name}` : ""}
          </div>
          <DogSpeechBubble className="big-oracle-speech oracle-speech mx-auto w-full max-w-3xl text-lg sm:text-2xl">
            {trainingActive ? `${gestureLabel(currentTrainingGesture)} 학습 중 · ${trainingSecondsLeft}초 남음` : speechPreview(reaction?.speech)}
          </DogSpeechBubble>
          <DogAvatar state={dogState} imageSrc={dogImageSrc} className="w-64 sm:w-80" />
        </div>

        <div className="gesture-training-panel grid gap-3 rounded-[30px] bg-white/90 p-4 text-inkWarm shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-left">
              <h2 className="text-xl font-black">7개 모션 순차 학습</h2>
              <p className="text-sm font-bold text-inkWarm/70">각 동작 10초씩, 총 70초 동안 여러 거리와 각도 샘플을 자동 저장해요.</p>
            </div>
            <Button type="button" onClick={trainingActive ? stopTraining : startTraining} className="min-w-44">
              {trainingActive ? "학습 멈추기" : "7개 모션 학습 시작"}
            </Button>
          </div>
          <p className="rounded-2xl bg-[#251b37]/10 px-4 py-3 text-sm font-black">{trainingMessage}</p>
          <div className="grid gap-2 sm:grid-cols-7">
            {trainingGestures.map((gesture, index) => (
              <div key={gesture} className={`rounded-2xl px-3 py-2 text-center text-xs font-black ${trainingActive && index === trainingIndex ? "bg-[#ff5fa2] text-white" : index < trainingIndex ? "bg-[#ffe1ef] text-[#9a2d62]" : "bg-white text-inkWarm"}`}>
                {gestureLabel(gesture)}
              </div>
            ))}
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#ff5fa2] transition-all"
              style={{ width: `${trainingActive ? ((trainingIndex * trainingSecondsPerGesture + (trainingSecondsPerGesture - trainingSecondsLeft)) / (trainingGestures.length * trainingSecondsPerGesture)) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs font-black text-inkWarm/70">이번 학습 샘플: {trainingSampleCount}개 · 총 저장된 손동작: {savedPoses.length}개</p>
        </div>

        <div className="gesture-lab-grid grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <CameraPreview
            videoRef={handTracking.videoRef}
            status={handTracking.status}
            error={handTracking.error}
            onStart={handTracking.startTracking}
            landmarks={handTracking.landmarks}
            showLandmarks
            className="gesture-camera-panel"
          />

          <div className="gesture-save-panel grid gap-4 rounded-[30px] p-5">
            <div className="gesture-readout grid gap-3 rounded-[24px] bg-white/95 p-4 text-left text-sm font-black shadow-soft sm:grid-cols-2">
              <p>landmarks: {handTracking.landmarks.length}</p>
              <p>tracking: {handTracking.status}</p>
              <p>detected: {detectedGesture}</p>
              <p>effective: {effectiveGesture}</p>
              <p>pinch: {metrics.pinchDistance === null ? "-" : metrics.pinchDistance.toFixed(4)}</p>
              <p>match: {matchedPose ? matchedPose.score.toFixed(3) : "-"}</p>
              <p>best: {rankedPoses[0] ? `${rankedPoses[0].name} ${rankedPoses[0].score.toFixed(3)}` : "-"}</p>
            </div>

            <div className="grid gap-3 rounded-[24px] bg-white/92 p-4 shadow-soft">
              <label className="grid gap-2 text-left text-sm font-black text-inkWarm">
                저장할 동작 이름
                <input value={poseName} onChange={(event) => setPoseName(event.target.value)} className="rounded-2xl bg-white px-4 py-3 outline-none ring-[#ff5fa2]/30 focus:ring-4" />
              </label>
              <label className="grid gap-2 text-left text-sm font-black text-inkWarm">
                어떤 행동으로 쓸지
                <select value={targetGesture} onChange={(event) => setTargetGesture(event.target.value as GestureName)} className="rounded-2xl bg-white px-4 py-3 outline-none ring-[#ff5fa2]/30 focus:ring-4">
                  {testGestures.map((gesture) => (
                    <option key={gesture} value={gesture}>{dogGestureReactions[gesture]?.label ?? gesture}</option>
                  ))}
                </select>
              </label>
              <Button onClick={saveCurrentPose} disabled={handTracking.landmarks.length < 21 || trainingActive} className="w-full">
                현재 손모양 저장하기
              </Button>
              <p className="text-left text-xs font-black leading-5 text-inkWarm/70">
                자동 학습 중에는 손을 멀리/가까이 움직이고, 손목을 살짝 좌우로 돌려주세요. 같은 동작을 여러 각도로 모으면 인식률이 올라가요.
              </p>
            </div>
          </div>
        </div>

        <div className="gesture-action-panel grid grid-cols-2 gap-2 sm:grid-cols-5">
          {testGestures.map((gesture) => (
            <Button key={gesture} variant={activeGesture === gesture ? "primary" : "soft"} onClick={() => applyGesture(gesture)} className="gesture-action-button px-3 text-sm">
              {dogGestureReactions[gesture]?.label ?? gesture}
            </Button>
          ))}
        </div>

        <div className="gesture-saved-list grid gap-3 rounded-[28px] p-4">
          <h2>저장된 손동작 {savedPoses.length}개</h2>
          {savedPoses.length === 0 ? (
            <p>아직 저장된 손동작이 없어요. 카메라를 켜고 포즈를 만든 다음 저장해보세요.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {savedPoses.map((pose) => (
                <article key={pose.id} className="gesture-saved-item">
                  <strong>{pose.name}</strong>
                  <span>{dogGestureReactions[pose.targetGesture]?.label ?? pose.targetGesture} · 감지값 {pose.detectedGesture}</span>
                  <small>{pose.landmarks.length} landmarks</small>
                  <button type="button" onClick={() => deletePose(pose.id)}>삭제</button>
                </article>
              ))}
            </div>
          )}
        </div>

        <Button variant="soft" onClick={onBack} className="gesture-action-button mx-auto w-full max-w-md">
          손동작 놀이로 돌아가기
        </Button>
      </section>
    </FullScreenStage>
  );
}
