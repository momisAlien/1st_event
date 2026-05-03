import type { TarotCardData } from "../../content/tarotCards";
import { tarotCards } from "../../content/tarotCards";
import { TarotCard } from "./TarotCard";

type TarotSpreadProps = {
  selectedCards: TarotCardData[];
  onSelect: (card: TarotCardData) => void;
  layout?: "row" | "orbit";
};

const orbitPositions = [
  { x: -360, y: -54, rotate: -24 },
  { x: -270, y: -198, rotate: -14 },
  { x: -96, y: -266, rotate: -5 },
  { x: 92, y: -266, rotate: 5 },
  { x: 270, y: -198, rotate: 14 },
  { x: 360, y: -54, rotate: 24 },
  { x: -246, y: 174, rotate: -20 },
  { x: 246, y: 174, rotate: 20 },
];

export function TarotSpread({ selectedCards, onSelect, layout = "row" }: TarotSpreadProps) {
  const isComplete = selectedCards.length >= 2;

  if (layout === "orbit") {
    return (
      <div className="tarot-orbit-spread" aria-label="원형 타로 카드 선택">
        {tarotCards.map((card, index) => {
          const isSelected = selectedCards.some((selectedCard) => selectedCard.id === card.id);
          const position = orbitPositions[index % orbitPositions.length];
          return (
            <TarotCard
              key={card.id}
              card={card}
              index={index}
              selected={isSelected}
              disabled={isComplete || isSelected}
              onSelect={onSelect}
              variant="orbit"
              orbitPosition={position}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-5 pt-10 sm:mx-0 sm:justify-center sm:overflow-visible">
      {tarotCards.map((card, index) => {
        const isSelected = selectedCards.some((selectedCard) => selectedCard.id === card.id);
        return (
          <div className="snap-center" key={card.id}>
            <TarotCard card={card} index={index} selected={isSelected} disabled={isComplete || isSelected} onSelect={onSelect} />
          </div>
        );
      })}
    </div>
  );
}

