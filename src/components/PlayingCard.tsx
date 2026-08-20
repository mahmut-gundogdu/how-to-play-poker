import type { Card } from '@/lib/poker';

export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'table' | 'you';

const SUIT_NAME: Record<string, { en: string; tr: string }> = {
  s: { en: 'spades', tr: 'maça' },
  h: { en: 'hearts', tr: 'kupa' },
  d: { en: 'diamonds', tr: 'karo' },
  c: { en: 'clubs', tr: 'sinek' },
};

export function cardLabel(c: Card, locale: string): string {
  const suit = SUIT_NAME[c.s]?.[locale === 'tr' ? 'tr' : 'en'] ?? c.s;
  return `${c.r} ${suit}`;
}

export default function PlayingCard({
  card, size = 'sm', dim = false, locale = 'en',
}: {
  card: Card;
  size?: CardSize;
  dim?: boolean;
  locale?: string;
}) {
  return (
    <div
      className={`pc pc--${size}${dim ? ' pc--dim' : ''}`}
      role="img"
      aria-label={cardLabel(card, locale)}
    >
      <span className="r" style={{ color: card.color }} aria-hidden="true">{card.r}</span>
      <span className="g" style={{ color: card.color }} aria-hidden="true">{card.g}</span>
    </div>
  );
}

/** Face-down card, for opponents when teaching mode is off. */
export function CardBack({ size = 'sm' }: { size?: CardSize }) {
  return <div className={`pc pc--${size} pc--back`} aria-hidden="true" />;
}

/** Dashed placeholder for a community card not yet dealt. */
export function CardSlot({ size = 'table' }: { size?: CardSize }) {
  return <div className={`pc pc--${size} pc--slot`} aria-hidden="true" />;
}
