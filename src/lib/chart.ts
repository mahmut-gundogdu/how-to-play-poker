import { card, type Card, type HandKey } from './poker';

const S = 0, H = 1, D = 2, C = 3;

/** The example five-card hands shown on the ranking chart, strongest first. */
export const CHART: { key: HandKey; cards: Card[] }[] = [
  { key: 'royalFlush', cards: [card(14, S), card(13, S), card(12, S), card(11, S), card(10, S)] },
  { key: 'straightFlush', cards: [card(9, H), card(8, H), card(7, H), card(6, H), card(5, H)] },
  { key: 'fourOfAKind', cards: [card(7, C), card(7, D), card(7, H), card(7, S), card(13, D)] },
  { key: 'fullHouse', cards: [card(11, S), card(11, H), card(11, D), card(4, C), card(4, S)] },
  { key: 'flush', cards: [card(14, D), card(11, D), card(8, D), card(6, D), card(3, D)] },
  { key: 'straight', cards: [card(10, C), card(9, D), card(8, S), card(7, H), card(6, C)] },
  { key: 'threeOfAKind', cards: [card(12, S), card(12, H), card(12, C), card(9, D), card(2, S)] },
  { key: 'twoPair', cards: [card(13, H), card(13, S), card(5, D), card(5, C), card(8, H)] },
  { key: 'onePair', cards: [card(4, D), card(4, S), card(14, C), card(9, H), card(2, D)] },
  { key: 'highCard', cards: [card(14, H), card(12, C), card(9, D), card(6, S), card(3, C)] },
];
