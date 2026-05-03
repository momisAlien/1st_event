import type { TarotCardData } from "../content/tarotCards";

export function getFortuneFromCard(card: TarotCardData) {
  return `${card.keyword}: ${card.message}`;
}
