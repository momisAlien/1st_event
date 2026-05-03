import type { DogMotionState } from "../components/Dog/DogMotion";
import type { GestureName } from "../lib/gestureUtils";

export type DogReaction = {
  gesture: GestureName;
  dogState: DogMotionState;
  label: string;
  speech: string | string[];
  image: string;
  effect: "heart" | "petal";
};

export const dogGestureReactions: Partial<Record<GestureName, DogReaction>> = {
  petting: {
    gesture: "petting",
    dogState: "petting",
    label: "쓰담쓰담",
    image: "/assets/dog/dog-petting.png",
    speech: ["오이오이 더 잘 쓰담아보라구~", "기분 좋아! 더 쓰다듬어줘"],
    effect: "heart",
  },
  fingerHeart: {
    gesture: "fingerHeart",
    dogState: "fingerHeart",
    label: "손가락하트",
    image: "/assets/dog/dog-heart.png",
    speech: ["누나 나도 사랑해~", "내 하트도 받아줘!"],
    effect: "heart",
  },
  poke: {
    gesture: "poke",
    dogState: "poke",
    label: "콕콕 찌르기",
    image: "/assets/dog/dog-poke.png",
    speech: ["찌르지 마라잉~", "포도 화나면 무섭다~"],
    effect: "heart",
  },
  wave: {
    gesture: "wave",
    dogState: "wave",
    label: "인사",
    image: "/assets/dog/dog-wave.png",
    speech: ["안녕~ 나는 포도야!", "소담이누나 안녕~"],
    effect: "petal",
  },
  openPalm: {
    gesture: "openPalm",
    dogState: "happy",
    label: "손바닥 인사",
    image: "/assets/dog/dog-happy.png",
    speech: ["안녕~ 나는 포도야!", "소담이누나 안녕~"],
    effect: "petal",
  },
  pinch: {
    gesture: "pinch",
    dogState: "fingerHeart",
    label: "작은 하트",
    image: "/assets/dog/dog-heart.png",
    speech: ["누나 나도 사랑해~", "내 하트도 받아줘!"],
    effect: "heart",
  },
  point: {
    gesture: "point",
    dogState: "poke",
    label: "가리키기",
    image: "/assets/dog/dog-poke.png",
    speech: ["찌르지 마라잉~", "포도 화나면 무섭다~"],
    effect: "heart",
  },
  fist: {
    gesture: "fist",
    dogState: "thinking",
    label: "주먹",
    image: "/assets/dog/dog-punch.png",
    speech: ["아아 때리지 말라구 (크앙)", "누나!! 주먹은 반칙이지!"],
    effect: "heart",
  },
  swipeLeft: {
    gesture: "swipeLeft",
    dogState: "happy",
    label: "간지럽히기",
    image: "/assets/dog/dog-sleep.png",
    speech: ["하하하하하하 누나 너무 간지러워", "누나 그만해줘 ~"],
    effect: "petal",
  },
  swipeRight: {
    gesture: "swipeRight",
    dogState: "happy",
    label: "브이",
    image: "/assets/dog/dog-v.png",
    speech: ["이렇게하는거 마자?", "브--이~"],
    effect: "petal",
  },
};

export const defaultMotionPlaySpeech = "소담이 누나! 포도랑 놀자~";

