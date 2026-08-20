'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDict } from '@/i18n';
import type { Locale } from '@/i18n/types';
import { handKey, newShowdown, type Seat, type Showdown } from '@/lib/poker';
import PlayingCard from './PlayingCard';

export default function ShowdownQuiz({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [hand, setHand] = useState<Showdown | null>(null);
  const [pick, setPick] = useState<Seat | null>(null);

  const next = useCallback(() => { setHand(newShowdown()); setPick(null); }, []);
  useEffect(() => { next(); }, [next]);

  const answered = pick !== null;
  const winner = hand?.winner;
  const seatWon = (seat: 'A' | 'B') => answered && (winner === seat || winner === 'T');

  let why = '';
  if (hand && answered) {
    if (winner === 'T') {
      why = t.showdown.whyTie(t.describe(hand.ea));
    } else {
      const wE = winner === 'A' ? hand.ea : hand.eb;
      const lE = winner === 'A' ? hand.eb : hand.ea;
      const wName = t.hands[handKey(wE)].name;
      const lName = t.hands[handKey(lE)].name;
      why =
        t.showdown.whyWin(winner as 'A' | 'B', t.describe(wE), t.describe(lE)) +
        (wE.cat === lE.cat ? t.showdown.whySameCat : t.showdown.whyOutranks(wName, lName));
    }
  }

  const readFor = (which: 'A' | 'B') => {
    if (!hand || !answered) return '';
    const e = which === 'A' ? hand.ea : hand.eb;
    return `${t.hands[handKey(e)].name} — ${t.short(e)}`;
  };

  return (
    <section className="card" style={{ maxWidth: 760 }}>
      <p className="eyebrow">{t.showdown.eyebrow}</p>
      <h1 className="h2">{t.showdown.title}</h1>
      <p className="lede" style={{ marginBottom: 0 }}>{t.showdown.intro}</p>

      <div className="felt" style={{ marginTop: 24 }}>
        <p className="eyebrow">{t.showdown.board}</p>
        <div className="hand" style={{ gap: 8, marginTop: 12 }}>
          {hand
            ? hand.board.map((c, i) => <PlayingCard key={i} card={c} size="lg" locale={locale} />)
            : <span style={{ color: 'rgba(255,253,249,.6)', fontSize: 13 }}>{t.showdown.loading}</span>}
        </div>
      </div>

      <div className="seats">
        {(['A', 'B'] as const).map((seat) => (
          <div key={seat} className={`seat${seatWon(seat) ? ' seat--win' : ''}`}>
            <p className="label">{t.showdown.seatHolds(seat)}</p>
            <div className="hand" style={{ gap: 8, marginTop: 10 }}>
              {hand && (seat === 'A' ? hand.a : hand.b).map((c, i) => (
                <PlayingCard key={i} card={c} size="lg" locale={locale} />
              ))}
            </div>
            <p className="read">{readFor(seat)}</p>
          </div>
        ))}
      </div>

      <div className="answers">
        <button className="btn btn--ghost" onClick={() => hand && !answered && setPick('A')} disabled={answered || !hand}>{t.showdown.pickA}</button>
        <button className="btn btn--ghost" onClick={() => hand && !answered && setPick('B')} disabled={answered || !hand}>{t.showdown.pickB}</button>
        <button className="btn btn--ghost" onClick={() => hand && !answered && setPick('T')} disabled={answered || !hand}>{t.showdown.pickTie}</button>
      </div>

      {hand && answered && (
        <div className="verdict">
          <h2 className={`h2 ${pick === winner ? 'ok' : 'bad'}`} style={{ margin: 0, fontSize: 15 }}>
            {`${pick === winner ? t.showdown.correct : t.showdown.notQuite} ${
              winner === 'T' ? t.showdown.splitPot : t.showdown.seatWins(winner as 'A' | 'B')
            }`}
          </h2>
          <p>{why}</p>
          <button className="btn" style={{ marginTop: 20 }} onClick={next}>{t.showdown.another}</button>
        </div>
      )}
    </section>
  );
}
