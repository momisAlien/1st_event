import type { TarotCardData } from "../content/tarotCards";

const keywordReplies = [
  {
    keys: ["사랑", "여자친구", "좋아", "마음"],
    reply: "멍! 사랑은 멋진 말보다 자주 건네는 다정함에 더 가까워. 오늘은 눈을 보고 천천히 좋아한다고 말해줘.",
  },
  {
    keys: ["고마워", "감사", "기념일"],
    reply: "기념일 카드는 반짝반짝이야. 고마웠던 순간 하나를 콕 집어서 말하면 마음이 훨씬 따뜻하게 닿을 거야.",
  },
  {
    keys: ["미안", "화해", "싸웠"],
    reply: "멍... 미안한 마음은 빨리 숨기지 말고 부드럽게 꺼내는 게 좋아. 변명보다 안아주고 싶은 마음을 먼저 말해봐.",
  },
  {
    keys: ["오늘", "운세", "하루"],
    reply: "오늘의 운세는 촛불이 천천히 밝아지는 모양이야. 작은 농담 하나랑 따뜻한 말 한마디가 행운을 데려와.",
  },
  {
    keys: ["선물", "편지"],
    reply: "멍! 선물은 크기보다 마음을 알아본 흔적이 중요해. 편지에 둘만 아는 장면을 넣으면 꼬리가 절로 흔들릴걸.",
  },
];

export function makeTarotHint(selectedTarotCards: TarotCardData[] = []) {
  if (!selectedTarotCards.length) return "";
  return `카드 리딩: ${selectedTarotCards.map((card) => `No.${card.number} ${card.title}(${card.keyword})`).join(" + ")}`;
}

export function generateLoveTarotResult(selectedTarotCards: TarotCardData[] = []) {
  if (selectedTarotCards.length < 2) {
    return "카드 결과: 아직 두 장의 카드가 완성되지 않았어. 하지만 오늘의 연애운은 솔직한 표현을 기다리는 중이야.";
  }

  const [first, second] = selectedTarotCards;
  const pairKey = [first.number, second.number].sort((a, b) => a - b).join("-");
  const custom: Record<string, string> = {
    "1-6": "카드 결과: 마법사의 표현력과 연인의 선택이 만났어. 오늘의 연애운은 마음을 숨기지 않고 직접 말할수록 강해져. 다정한 말 한마디가 둘 사이를 다시 반짝이게 할 거야.",
    "1-17": "카드 결과: 마법사의 용기와 별의 위로가 함께 떠올랐어. 네가 먼저 따뜻한 말을 꺼내면 상대 마음에 오래 남는 안정감이 생겨. 사랑은 오늘 작은 고백처럼 움직여.",
    "3-14": "카드 결과: 여황제의 애정과 절제의 균형이 만났어. 오늘은 과한 이벤트보다 편안하게 챙겨주는 마음이 연애운을 가장 좋게 만들어. 서로의 속도를 맞추는 말이 필요해.",
    "6-19": "카드 결과: 연인의 카드와 태양의 카드가 함께 나왔어. 서로를 선택하는 마음과 환한 기쁨이 겹쳐서, 오늘은 기념일처럼 밝은 연애운이야. 좋아하는 마음을 환하게 보여줘도 좋은 날이야.",
    "10-21": "카드 결과: 운명의 수레바퀴와 세계의 카드가 만났어. 둘이 함께 지나온 시간이 하나의 예쁜 장면으로 완성되는 흐름이야. 오늘은 앞으로의 약속을 말하기에 좋은 타이밍이야.",
    "17-19": "카드 결과: 별의 위로와 태양의 기쁨이 같이 빛나. 상대에게 네가 얼마나 큰 힘이 되는지 말해주면, 오늘의 연애운은 아주 따뜻하게 열린다. 웃음과 진심이 동시에 필요한 날이야.",
  };

  return custom[pairKey] ?? `카드 결과: ${first.title}의 '${first.keyword}'와 ${second.title}의 '${second.keyword}'가 함께 나왔어. 오늘의 연애운은 서로의 마음을 확인하고 더 다정하게 맞춰가는 흐름이야. 거창한 말보다 "네가 있어서 좋다"는 진심이 가장 크게 닿을 거야.`;
}

export function generateDogReply(input: string, selectedTarotCards: TarotCardData[] = []): string {
  const trimmed = input.trim();
  const found = keywordReplies.find((item) => item.keys.some((key) => trimmed.includes(key)));
  const tarotHint = selectedTarotCards.length
    ? ` 방금 뽑은 ${selectedTarotCards.map((card) => card.title).join("와 ")}도 ${selectedTarotCards.map((card) => card.keyword).join(", ")}을 말하고 있어.`
    : "";

  if (!trimmed) {
    return `멍? 마음속 질문을 아주 작게라도 적어줘. 내가 귀를 쫑긋 세우고 들어볼게.${tarotHint}`;
  }

  if (found) {
    return `${found.reply}${tarotHint}`;
  }

  return `멍! 지금 질문에는 솔직함을 조금 섞은 다정한 말이 제일 잘 어울려. 너무 멋지게 하려고 하지 말고, 같이 있어서 좋은 이유를 하나만 말해줘.${tarotHint}`;
}
