import { useState } from "react";
import { DogAvatar } from "../components/Dog/DogAvatar";
import { DogSpeechBubble } from "../components/Dog/DogSpeechBubble";
import { PetalParticles } from "../components/Effects/PetalParticles";
import { FullScreenStage } from "../components/Layout/FullScreenStage";
import { Button } from "../components/UI/Button";
import { SafeImage } from "../components/UI/SafeImage";
import type { TarotCardData } from "../content/tarotCards";
import { generateLoveTarotResult, makeTarotHint } from "../lib/dogConsultEngine";

type DogConsultSceneProps = {
  selectedTarotCards: TarotCardData[];
  onNext: () => void;
};

const birthdayCode = "03.04.08";
const highlightWords = [
  "사랑운",
  "연인의 카드",
  "6번",
  "생일 숫자",
  "03.04.08",
  "마음을 전하는 힘",
  "따뜻한 애정",
  "서로를 선택하는 마음",
  "좋은 타이밍",
  "서로 맞춰가는 균형",
  "희망과 위로",
  "환한 기쁨",
  "완성되는 마음",
  "고마웠던 순간",
  "작은 행동",
  "다정한 말",
  "진심",
  "우리",
  "같은 방향",
];

function HighlightedText({ text }: { text: string }) {
  let parts = [{ text, highlight: false }];
  highlightWords.forEach((word) => {
    parts = parts.flatMap((part) => {
      if (part.highlight || !part.text.includes(word)) return [part];
      return part.text.split(word).flatMap((chunk, index, chunks) => {
        const next = [];
        if (chunk) next.push({ text: chunk, highlight: false });
        if (index < chunks.length - 1) next.push({ text: word, highlight: true });
        return next;
      });
    });
  });
  return <>{parts.map((part, index) => (part.highlight ? <mark key={`${part.text}-${index}`}>{part.text}</mark> : part.text))}</>;
}

function cleanResultText(text: string) {
  return text.replace(/^카드 결과:\s*/, "");
}
function makeCombinationTitle(cards: TarotCardData[]) {
  if (cards.length < 2) return "아직 완성되지 않은 리딩이야.";
  return `이 조합은 ${cards[0].keyword}과 ${cards[1].keyword}가 만나, 표현하고 싶은 마음을 포근하게 받아주는 흐름을 보여줘.`;
}

function makeLoveMessage(cards: TarotCardData[]) {
  if (cards.length < 2) return "두 장의 카드가 모이면 더 자세한 사랑 메시지가 열려요.";
  const [first, second] = cards;
  return `${first.title}은 관계 안에서 먼저 움직이는 에너지, ${second.title}은 그 마음이 상대에게 어떤 온도로 닿는지를 보여줘요. 그래서 오늘의 사랑운은 거창한 이벤트보다 '${first.keyword}'을 담은 말과 '${second.keyword}'을 보여주는 태도가 중요해요. 특히 서로 예쁘게 불러주는 작은 말, 고마웠던 순간을 구체적으로 말하는 표현이 둘 사이의 안정감을 크게 밝혀줘요.`;
}

function makeAnniversaryMessage(cards: TarotCardData[]) {
  if (cards.length < 2) return "오늘의 기념일 메시지가 기다리고 있어요.";
  const [first, second] = cards;
  return `기념일의 의미는 완벽한 장면을 만드는 것보다, 둘이 쌓아온 시간을 다시 알아봐 주는 데 가까워요. ${first.title}가 지금까지의 마음을 꺼내는 문이라면, ${second.title}는 앞으로도 같은 편이 되어주겠다는 약속의 색이에요. 오늘은 추억을 하나 고르고, 그때 왜 좋았는지 말해주면 리딩의 흐름이 가장 따뜻하게 열려요.`;
}

function makeBirthdayMessage(cards: TarotCardData[]) {
  const hasLovers = cards.some((card) => card.number === 6);
  const loversNote = hasLovers ? " 이번 리딩에 6번 연인의 카드가 함께 있다면, 생일 숫자와 카드가 서로 같은 주파수로 울리는 셈이라 더 강한 애정 확인의 신호로 볼 수 있어요." : " 그래서 오늘의 카드가 어떤 조합이든, 마지막 결론은 둘이 같은 방향을 바라보는지 확인하는 쪽으로 모여요.";
  return `${birthdayCode}의 숫자를 모두 더하면 15, 다시 1과 5를 더해 6이 돼요. 타로에서 6은 연인의 카드와 연결되고, 관계를 선택하고 서로의 마음을 맞춰가는 숫자예요. 4월 8일의 봄 기운은 솔직함과 생동감을 가지고 있어서, 말보다 분위기로 마음을 읽는 감각도 강하게 보여요.${loversNote}`;
}

function makeLuckyAction(cards: TarotCardData[]) {
  if (cards.length < 2) return "손을 꼭 잡고 마음속 질문을 떠올려보기.";
  return `오늘은 손을 꼭 잡고 ${cards.map((card) => card.keyword).join("과 ")}에 대해 한마디씩 말해보기. 가능하면 "그때 네가 이렇게 해줘서 좋았어"처럼 장면이 떠오르는 문장으로 말해줘요. 카드 흐름상 짧고 솔직한 문장이 긴 설명보다 훨씬 강하게 닿아요.`;
}

function makeDogLines(cards: TarotCardData[]) {
  const names = cards.map((card) => card.title).join("와 ") || "두 장의 카드";
  return [
    "포도가 보기엔... 오늘은 말 한마디만 잘해도 분위기가 촛불처럼 따뜻해질 것 같아. 멍.",
    `${names}가 같이 나오면 마음을 숨기기보다 예쁘게 꺼내는 쪽이 훨씬 좋아. 오늘은 다정함을 아끼지 마, 멍!`,
    `생일 숫자 ${birthdayCode}의 흐름은 사랑을 선택하는 6번 에너지랑 닿아 있어. 그래서 오늘은 '우리'라는 말이 특히 잘 어울려.`,
    "내가 수정구로 봤는데, 큰 이벤트보다 같이 웃었던 장면을 말해주는 게 더 강력한 주문이야.",
    "마지막 조언! 너무 완벽하게 말하려고 하지 말고, 고마웠던 순간 하나를 콕 집어서 말해줘. 그게 제일 반짝여.",
  ];
}

export default function DogConsultScene({ selectedTarotCards, onNext }: DogConsultSceneProps) {
  const [dogLineIndex, setDogLineIndex] = useState(0);
  const loveResult = cleanResultText(generateLoveTarotResult(selectedTarotCards));
  const cardHint = makeTarotHint(selectedTarotCards);
  const [firstCard, secondCard] = selectedTarotCards;
  const dogLines = makeDogLines(selectedTarotCards);
  const nextDogLine = () => setDogLineIndex((index) => (index + 1) % dogLines.length);

  return (
    <FullScreenStage className="consult-natural-stage consult-reading-stage">
      <PetalParticles density={10} />
      <section className="consult-reading-layout mx-auto grid min-h-[86dvh] w-full max-w-6xl content-center gap-8 px-4 py-8">
        <div className="consult-reading-grid">
          <div className="consult-picked-cards" aria-label="뽑은 카드 요약">
            {[firstCard, secondCard].map((card, index) => (
              <article key={card?.id ?? index} className={`consult-mini-card consult-mini-card-${index + 1}`}>
                <div className="consult-mini-card-face consult-mini-card-front">
                  <SafeImage src={card?.image ?? "/assets/tarrotcard/card-back.png"} alt={card?.title ?? `${index + 1}번 카드`} fallbackLabel={card ? card.title : `${index + 1}번 카드`} className="h-full w-full rounded-[18px] object-contain" />
                </div>
                <strong>{card?.title ?? "카드"}</strong>
              </article>
            ))}
          </div>

          <div className="consult-dog-reading">
            <DogSpeechBubble className="consult-reading-speech">
              {dogLines[dogLineIndex]}
            </DogSpeechBubble>
            <DogAvatar state="talking" imageSrc="/assets/dog/optimized/dog-main.png" className="consult-reading-dog w-80 sm:w-[27rem]" onClick={nextDogLine} />
            <button type="button" onClick={nextDogLine} className="consult-dog-hint">포도를 눌러봐</button>
          </div>

          <article className="consult-reading-panel">
            <h1><HighlightedText text={makeCombinationTitle(selectedTarotCards)} /></h1>
            <div className="consult-reading-divider" />
            <section>
              <h2>사랑 메시지</h2>
              <p><HighlightedText text={makeLoveMessage(selectedTarotCards)} /></p>
            </section>
            <section>
              <h2>기념일 메시지</h2>
              <p><HighlightedText text={makeAnniversaryMessage(selectedTarotCards)} /></p>
            </section>
            <section>
              <h2>생일 수비학 · {birthdayCode}</h2>
              <p><HighlightedText text={makeBirthdayMessage(selectedTarotCards)} /></p>
            </section>
            <section>
              <h2>오늘의 행운 행동</h2>
              <p><HighlightedText text={makeLuckyAction(selectedTarotCards)} /></p>
            </section>
            <strong className="consult-reading-final">둘의 밤에는 이미 작은 마법이 켜져 있어요.</strong>
          </article>
        </div>

        <p className="consult-reading-summary">{loveResult}</p>
        {selectedTarotCards.length > 0 && <p className="consult-reading-hint">{cardHint}</p>}

        <div className="consult-result-actions consult-reading-actions mx-auto grid w-full max-w-2xl gap-3 px-4 sm:grid-cols-2">
          <Button type="button" onClick={onNext} className="w-full text-lg">
            손동작으로 놀기
          </Button>
          <Button type="button" variant="soft" onClick={onNext} className="gesture-action-button w-full text-lg">
            포도와 반응 보기
          </Button>
        </div>
      </section>
    </FullScreenStage>
  );
}




