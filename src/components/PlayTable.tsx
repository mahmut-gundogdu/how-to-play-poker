'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDict } from '@/i18n';
import type { Locale } from '@/i18n/types';
import {
  applyAction, best7, botDecision, deal as dealHand, findNext, finish, handKey,
  nextStreet, roundDone, strength,
  BIG_BLIND, type ActionKind, type PlayState,
} from '@/lib/poker';
import PlayingCard, { CardBack, CardSlot } from './PlayingCard';

const BOT_DELAY = 800;
const STREET_DELAY = 650;

export default function PlayTable({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  const [opponents, setOpponents] = useState(3);
  const [coachOn, setCoachOn] = useState(true);
  const [revealBots, setRevealBots] = useState(true);

  // The hand is a mutable state machine driven by timers; a version counter
  // pushes each mutation to the view without deep-cloning every frame.
  const play = useRef<PlayState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, bump] = useState(0);
  const render = useCallback(() => bump((n) => n + 1), []);

  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => clear, []);

  const step = useCallback(() => {
    const p = play.current;
    if (!p || p.over) return;
    if (p.players.filter((x) => !x.folded).length < 2) { finish(p); render(); return; }
    if (roundDone(p)) {
      if (p.street >= 3) { finish(p); render(); return; }
      advanceStreet();
      return;
    }
    const i = findNext(p, p.turn);
    if (i === -1) {
      if (p.street >= 3) { finish(p); render(); return; }
      advanceStreet();
      return;
    }
    p.turn = i;
    p.awaiting = p.players[i].isYou;
    render();
    if (!p.awaiting) timer.current = setTimeout(() => botAct(i), BOT_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  const advanceStreet = useCallback(() => {
    const p = play.current;
    if (!p) return;
    nextStreet(p);
    if (p.street > 3) { finish(p); render(); return; }
    render();
    timer.current = setTimeout(step, STREET_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, step]);

  const botAct = useCallback((i: number) => {
    const p = play.current;
    if (!p || p.over) return;
    const pl = p.players[i];
    if (!pl || pl.folded || pl.allin) { step(); return; }
    const { kind, to } = botDecision(p, i);
    applyAction(p, i, kind, to);
    render();
    step();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, step]);

  const userAct = (kind: ActionKind, to = 0) => {
    const p = play.current;
    if (!p || !p.awaiting || p.over) return;
    clear();
    p.awaiting = false;
    applyAction(p, p.turn, kind, to);
    render();
    step();
  };

  const deal = () => {
    clear();
    play.current = dealHand(opponents);
    render();
    step();
  };

  const p = play.current;
  const you = p?.players[0];
  const reveal = p ? p.reveal || revealBots : revealBots;

  const toCall = p && you ? p.currentBet - you.bet : 0;
  const raiseTo = p ? (p.currentBet === 0 ? Math.max(BIG_BLIND, Math.round((p.pot * 0.5) / 10) * 10) : p.currentBet * 2) : 0;

  const showDeal = !p || p.over;
  const showActions = !!(p && p.awaiting && !p.over);
  const showWaiting = !!(p && !p.awaiting && !p.over);

  let coachTitle = '';
  let coachText = '';
  let yourRead = '';
  if (p && you) {
    coachTitle = p.over ? t.play.coachFinished : t.play.coachTitles[Math.min(4, p.street)];
    if (p.over) coachText = t.play.coachOver;
    else {
      const s = strength(p, you);
      coachText = p.street === 0
        ? (s > 0.62 ? t.play.coachPre[0] : s > 0.42 ? t.play.coachPre[1] : t.play.coachPre[2])
        : (s > 0.8 ? t.play.coachPost[0] : s > 0.55 ? t.play.coachPost[1] : s > 0.33 ? t.play.coachPost[2] : t.play.coachPost[3]);
    }
    if (p.board.length >= 3) {
      const e = best7([...you.hole, ...p.board]);
      yourRead = `${t.hands[handKey(e)].name} — ${t.short(e)}`;
    } else {
      const [a, b] = you.hole;
      yourRead = a.v === b.v
        ? t.play.pocketPair(a.r)
        : a.s === b.s ? t.play.suited(a.r, b.r) : t.play.offsuit(a.r, b.r);
    }
  }

  return (
    <>
      <div className={`play-grid${p && coachOn ? '' : ' play-grid--solo'}`}>
        <div style={{ display: 'grid', gap: 14 }}>
          {p && you && (
            <div className="table">
              <div className="bots">
                {p.players.slice(1).map((b, idx) => {
                  const active = p.turn === idx + 1 && !p.over && !b.folded;
                  const hidden = (b.folded && !p.reveal) || !reveal;
                  return (
                    <div
                      key={b.id}
                      className={`bot${b.folded ? ' bot--folded' : ''}${active ? ' bot--active' : ''}`}
                    >
                      <div className="seat-top">
                        <span className="seat-name">{b.name}</span>
                        <span className="seat-chips">{t.common.chips(b.chips)}</span>
                      </div>
                      <div className="hand" style={{ marginTop: 9 }}>
                        {hidden
                          ? [0, 1].map((k) => <CardBack key={k} size="sm" />)
                          : b.hole.map((c, k) => <PlayingCard key={k} card={c} size="sm" locale={locale} />)}
                      </div>
                      <div className={`seat-status${b.folded ? ' seat-status--folded' : ''}`}>
                        {b.folded
                          ? t.play.folded
                          : b.last ? t.status(b.last, false) : active ? t.play.thinking : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="board-wrap">
                <div className="board-label">
                  {t.play.potLabel(t.play.streets[Math.min(4, p.street)], p.pot)}
                </div>
                <div className="board">
                  {p.board.map((c, i) => <PlayingCard key={i} card={c} size="table" locale={locale} />)}
                  {Array.from({ length: Math.max(0, 5 - p.board.length) }, (_, i) => <CardSlot key={`s${i}`} />)}
                </div>
              </div>

              <div className="you-row">
                <div className={`you-seat${p.awaiting ? ' you-seat--active' : ''}`}>
                  <div className="seat-top">
                    <span className="seat-name">{t.play.you}</span>
                    <span className="seat-chips">{t.common.chips(you.chips)}</span>
                  </div>
                  <div className="hand" style={{ gap: 7, marginTop: 10 }}>
                    {you.hole.map((c, i) => <PlayingCard key={i} card={c} size="you" locale={locale} />)}
                  </div>
                  <div className="you-status">
                    {you.folded
                      ? t.play.youFolded
                      : you.last ? t.status(you.last, true) : p.awaiting ? t.play.yourTurn : ''}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card card--tight">
            {showActions && you && (
              <div>
                <p className="eyebrow">{t.play.yourMove}</p>
                <div className="actions">
                  <button className="btn btn--fold" onClick={() => userAct('fold')}>{t.play.fold}</button>
                  <button className="btn btn--ghost" onClick={() => userAct('call')}>
                    {toCall > 0 ? t.play.call(Math.min(toCall, you.chips)) : t.play.check}
                  </button>
                  <button className="btn" onClick={() => userAct('raise', raiseTo)}>
                    {p!.currentBet === 0
                      ? t.play.bet(Math.min(raiseTo, you.bet + you.chips))
                      : t.play.raiseTo(Math.min(raiseTo, you.bet + you.chips))}
                  </button>
                  <button className="btn btn--quiet" onClick={() => userAct('raise', you.bet + you.chips)}>
                    {t.play.allIn}
                  </button>
                </div>
              </div>
            )}

            {showWaiting && (
              <p className="waiting" aria-live="polite">
                {p!.players[p!.turn] ? t.play.deciding(p!.players[p!.turn].isYou ? t.play.you : p!.players[p!.turn].name) : t.play.dealing}
              </p>
            )}

            {showDeal && (
              <div className="deal-row">
                <button className="btn" onClick={deal}>{p ? t.play.dealAgain : t.play.dealFirst}</button>
                <span className="note">{t.play.stakes}</span>
              </div>
            )}
          </div>

          <div className="card card--tight">
            <p className="eyebrow">{t.play.settings}</p>
            <div className="field" style={{ marginTop: 12, gap: 18 }}>
              <label>
                {t.play.opponents}
                <select value={opponents} onChange={(e) => setOpponents(Number(e.target.value))}>
                  {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label>
                <input type="checkbox" checked={coachOn} onChange={(e) => setCoachOn(e.target.checked)} />
                {t.play.coachPanel}
              </label>
              <label>
                <input type="checkbox" checked={revealBots} onChange={(e) => setRevealBots(e.target.checked)} />
                {t.play.revealBots}
              </label>
            </div>
          </div>
        </div>

        {p && coachOn && (
          <div style={{ display: 'grid', gap: 14 }}>
            <section className="card coach" style={{ padding: 22 }}>
              <p className="eyebrow">{t.play.coach}</p>
              <h2 className="h2" style={{ margin: '10px 0 0', fontSize: 15 }}>{coachTitle}</h2>
              <p>{coachText}</p>
              <div className="have">
                <p className="eyebrow">{t.play.youCurrentlyHave}</p>
                <div className="v">{yourRead}</div>
              </div>
            </section>
            <section className="card" style={{ padding: 22 }}>
              <p className="eyebrow">{t.play.tableTalk}</p>
              <div className="log" aria-live="polite">
                {p.log.slice(-6).map((entry, i) => <div key={i}>{t.log(entry, t.play.you)}</div>)}
              </div>
            </section>
          </div>
        )}
      </div>

      {p?.result && (
        <section className="card" style={{ marginTop: 24 }}>
          <p className="eyebrow">{t.play.handOver}</p>
          {(() => {
            const r = p.result!;
            const youWon = r.winners.includes('You');
            const title = youWon
              ? (r.winners.length > 1 ? t.play.youSplit(r.share) : t.play.youWin(r.share))
              : t.play.theyTake(r.winners.map((n) => (n === 'You' ? t.play.you : n)).join(' & '), r.pot);
            const lines = r.detail.length
              ? r.detail.map((d) => ({
                  name: d.name === 'You' ? t.play.you : d.name,
                  raw: d.name,
                  cards: d.cards,
                  read: `${t.hands[handKey(d.e)].name} — ${t.short(d.e)}`,
                }))
              : [{
                  name: r.winners[0] === 'You' ? t.play.you : r.winners[0],
                  raw: r.winners[0],
                  cards: [],
                  read: `${t.play.wonUncontested} — ${t.play.everyoneFolded}`,
                }];
            return (
              <>
                <h2 className={`h2 ${youWon ? 'ok' : 'bad'}`}>{title}</h2>
                <p className="lede" style={{ marginBottom: 18 }}>
                  {r.how === 'fold' ? t.play.whyFold : t.play.whyShowdown}
                </p>
                <div className="result-lines">
                  {lines.map((line) => (
                    <div
                      key={line.raw}
                      className={`result-line${r.winners.includes(line.raw) ? ' result-line--win' : ''}`}
                    >
                      <span className="nm">{line.name}</span>
                      <div className="hand">
                        {line.cards.map((c, i) => <PlayingCard key={i} card={c} size="xs" locale={locale} />)}
                      </div>
                      <span className="rd">{line.read}</span>
                    </div>
                  ))}
                </div>
                <button className="btn" style={{ marginTop: 22 }} onClick={deal}>{t.play.dealAgain}</button>
              </>
            );
          })()}
        </section>
      )}
    </>
  );
}
