// Poker engine: deck, hand evaluation, drill/showdown generators and bot policy.
// Ported from the `Holdem Coach.dc.html` design source.

export type SuitId = 's' | 'h' | 'd' | 'c';

export interface Card {
  /** Rank label, e.g. "A", "10", "7". */
  r: string;
  /** Rank value, 2..14. */
  v: number;
  s: SuitId;
  /** Suit glyph. */
  g: string;
  /** Ink colour for the glyph and rank. */
  color: string;
}

export interface Eval {
  /** 0 = high card ... 8 = straight flush (a royal flush is cat 8 with a 14 kicker). */
  cat: number;
  score: number[];
  cards: Card[];
}

export const RANKS: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const SUITS: [string, SuitId, string][] = [
  ['♠', 's', '#1A1816'],
  ['♥', 'h', '#9B2C2C'],
  ['♦', 'd', '#9B2C2C'],
  ['♣', 'c', '#1A1816'],
];

export function card(v: number, si: number): Card {
  const [g, s, color] = SUITS[si];
  return { r: RANKS[v - 2], v, s, g, color };
}

/** Deterministic-friendly shuffle: pass an rng to make results reproducible. */
export function shuffle<T>(a: readonly T[], rng: () => number = Math.random): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function newDeck(rng: () => number = Math.random): Card[] {
  const d: Card[] = [];
  for (let v = 2; v <= 14; v++) for (let si = 0; si < 4; si++) d.push(card(v, si));
  return shuffle(d, rng);
}

function distinctRanks(n: number, exclude: number[] = [], rng: () => number = Math.random): number[] {
  const pool: number[] = [];
  for (let v = 2; v <= 14; v++) if (!exclude.includes(v)) pool.push(v);
  return shuffle(pool, rng).slice(0, n);
}

function isStraightDesc(vs: number[]): boolean {
  return vs[0] - vs[4] === 4 || (vs[0] === 14 && vs[1] === 5 && vs[4] === 2);
}

export function eval5(cs: Card[]): Eval {
  const vs = cs.map((c) => c.v).sort((a, b) => b - a);
  const flush = cs.every((c) => c.s === cs[0].s);
  const uniq = [...new Set(vs)];
  let sh = 0;
  if (uniq.length === 5) {
    if (uniq[0] - uniq[4] === 4) sh = uniq[0];
    else if (uniq[0] === 14 && uniq[1] === 5) sh = 5;
  }
  const cnt: Record<number, number> = {};
  vs.forEach((v) => {
    cnt[v] = (cnt[v] || 0) + 1;
  });
  const groups = Object.keys(cnt)
    .map(Number)
    .sort((a, b) => cnt[b] - cnt[a] || b - a);
  const shape = groups.map((g) => cnt[g]).join('');

  let cat: number;
  let tb: number[];
  if (flush && sh) { cat = 8; tb = [sh]; }
  else if (shape === '41') { cat = 7; tb = groups; }
  else if (shape === '32') { cat = 6; tb = groups; }
  else if (flush) { cat = 5; tb = vs; }
  else if (sh) { cat = 4; tb = [sh]; }
  else if (shape === '311') { cat = 3; tb = groups; }
  else if (shape === '221') { cat = 2; tb = groups; }
  else if (shape === '2111') { cat = 1; tb = groups; }
  else { cat = 0; tb = vs; }

  return { cat, score: [cat, ...tb], cards: cs.slice().sort((a, b) => b.v - a.v) };
}

function combos<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  const rec = (start: number, cur: T[]) => {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = start; i < arr.length; i++) { cur.push(arr[i]); rec(i + 1, cur); cur.pop(); }
  };
  rec(0, []);
  return out;
}

export function cmpScore(a: number[], b: number[]): number {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

export function best7(cs: Card[]): Eval {
  if (cs.length <= 5) return eval5(cs);
  let best: Eval | null = null;
  for (const c of combos(cs, 5)) {
    const e = eval5(c);
    if (!best || cmpScore(e.score, best.score) > 0) best = e;
  }
  return best as Eval;
}

/** Category key used to look up localised names/tips. Royal flush gets its own key. */
export type HandKey =
  | 'highCard' | 'onePair' | 'twoPair' | 'threeOfAKind' | 'straight'
  | 'flush' | 'fullHouse' | 'fourOfAKind' | 'straightFlush' | 'royalFlush';

export const HAND_KEYS: HandKey[] = [
  'highCard', 'onePair', 'twoPair', 'threeOfAKind', 'straight',
  'flush', 'fullHouse', 'fourOfAKind', 'straightFlush',
];

/** All ten chart entries, strongest first. */
export const CHART_KEYS: HandKey[] = [
  'royalFlush', 'straightFlush', 'fourOfAKind', 'fullHouse', 'flush',
  'straight', 'threeOfAKind', 'twoPair', 'onePair', 'highCard',
];

export function handKey(e: Eval): HandKey {
  if (e.cat === 8 && e.score[1] === 14) return 'royalFlush';
  return HAND_KEYS[e.cat];
}

// ---------- drills ----------

export interface Drill {
  cards: Card[];
  e: Eval;
  correct: HandKey;
  options: HandKey[];
  seven: boolean;
}

function buildHand(cat: number, rng: () => number = Math.random): Card[] {
  for (let attempt = 0; attempt < 40; attempt++) {
    const S = shuffle([0, 1, 2, 3], rng);
    const c = (v: number, si: number) => card(v, si);
    const run = () => {
      const hi = 5 + Math.floor(rng() * 10);
      return [0, 1, 2, 3, 4].map((i) => { const v = hi - i; return v < 2 ? v + 13 : v; });
    };
    let h: Card[];
    if (cat === 8) h = run().map((v) => c(v, S[0]));
    else if (cat === 7) { const d = distinctRanks(2, [], rng); h = [c(d[0], 0), c(d[0], 1), c(d[0], 2), c(d[0], 3), c(d[1], S[0])]; }
    else if (cat === 6) { const d = distinctRanks(2, [], rng); h = [c(d[0], S[0]), c(d[0], S[1]), c(d[0], S[2]), c(d[1], S[0]), c(d[1], S[1])]; }
    else if (cat === 5) { const vs = distinctRanks(5, [], rng).sort((a, b) => b - a); if (isStraightDesc(vs)) continue; h = vs.map((v) => c(v, S[0])); }
    else if (cat === 4) { const mix = [S[0], S[1], S[0], S[1], S[2]]; h = run().map((v, i) => c(v, mix[i])); }
    else if (cat === 3) { const d = distinctRanks(3, [], rng); h = [c(d[0], S[0]), c(d[0], S[1]), c(d[0], S[2]), c(d[1], S[0]), c(d[2], S[1])]; }
    else if (cat === 2) { const d = distinctRanks(3, [], rng); h = [c(d[0], S[0]), c(d[0], S[1]), c(d[1], S[0]), c(d[1], S[1]), c(d[2], S[2])]; }
    else if (cat === 1) { const d = distinctRanks(4, [], rng); h = [c(d[0], S[0]), c(d[0], S[1]), c(d[1], S[0]), c(d[2], S[1]), c(d[3], S[2])]; }
    else { const vs = distinctRanks(5, [], rng).sort((a, b) => b - a); if (isStraightDesc(vs)) continue; const mix = [S[0], S[1], S[0], S[1], S[2]]; h = vs.map((v, i) => c(v, mix[i])); }
    if (eval5(h).cat === cat) return shuffle(h, rng);
  }
  return shuffle(newDeck(rng).slice(0, 5), rng);
}

function pickCat(rng: () => number = Math.random): number {
  const w = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8];
  return w[Math.floor(rng() * w.length)];
}

export type DrillFormat = 'five' | 'seven';

export function newDrill(format: DrillFormat = 'five', rng: () => number = Math.random): Drill {
  const seven = format === 'seven';
  let cards: Card[];
  let e: Eval;
  if (seven) { cards = newDeck(rng).slice(0, 7); e = best7(cards); }
  else { cards = buildHand(pickCat(rng), rng); e = eval5(cards); }

  const correct = handKey(e);
  // Distractors: the chart neighbours of the right answer, so the choice is
  // between hands that actually look alike.
  const pool: HandKey[] = [...HAND_KEYS, 'royalFlush'];
  const ci = pool.indexOf(correct);
  const near = pool
    .map((n, i) => ({ n, d: Math.abs(i - ci) }))
    .filter((x) => x.n !== correct)
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);
  const options = shuffle([correct, ...shuffle(near, rng).slice(0, 3).map((x) => x.n)], rng);
  return { cards, e, correct, options, seven };
}

// ---------- showdown quiz ----------

export type Seat = 'A' | 'B' | 'T';

export interface Showdown {
  board: Card[];
  a: Card[];
  b: Card[];
  ea: Eval;
  eb: Eval;
  winner: Seat;
}

export function newShowdown(rng: () => number = Math.random): Showdown {
  const d = newDeck(rng);
  const board = d.slice(0, 5);
  const a = d.slice(5, 7);
  const b = d.slice(7, 9);
  const ea = best7([...a, ...board]);
  const eb = best7([...b, ...board]);
  const c = cmpScore(ea.score, eb.score);
  return { board, a, b, ea, eb, winner: c > 0 ? 'A' : c < 0 ? 'B' : 'T' };
}

// ---------- table play ----------

export interface Player {
  id: number;
  name: string;
  isYou: boolean;
  hole: Card[];
  chips: number;
  bet: number;
  folded: boolean;
  acted: boolean;
  allin: boolean;
  /** Last action, as a structured token so the UI can localise it. */
  last: LogEntry | null;
}

export type LogEntry =
  | { k: 'blinds'; pot: number }
  | { k: 'smallBlind'; amount: number }
  | { k: 'bigBlind'; amount: number }
  | { k: 'flop' } | { k: 'turn' } | { k: 'river' }
  | { k: 'fold'; name: string }
  | { k: 'check'; name: string }
  | { k: 'call'; name: string; amount: number }
  | { k: 'bet'; name: string; amount: number; allin: boolean }
  | { k: 'raise'; name: string; amount: number; allin: boolean }
  | { k: 'win'; names: string[]; amount: number };

export interface HandResult {
  how: 'fold' | 'showdown';
  winners: string[];
  detail: { name: string; e: Eval; cards: Card[] }[];
  share: number;
  pot: number;
}

export interface PlayState {
  deck: Card[];
  players: Player[];
  board: Card[];
  /** 0 pre-flop, 1 flop, 2 turn, 3 river. */
  street: number;
  pot: number;
  currentBet: number;
  turn: number;
  awaiting: boolean;
  over: boolean;
  reveal: boolean;
  log: LogEntry[];
  result: HandResult | null;
}

export const BOT_NAMES = ['Rosa', 'Dev', 'Mika'];
export const START_CHIPS = 500;
export const SMALL_BLIND = 10;
export const BIG_BLIND = 20;

export function deal(opponents: number, rng: () => number = Math.random): PlayState {
  const n = 1 + Math.max(1, Math.min(3, opponents));
  const names = ['You', ...BOT_NAMES];
  const deck = newDeck(rng);
  const players: Player[] = [];
  for (let i = 0; i < n; i++) {
    players.push({
      id: i, name: names[i], isYou: i === 0,
      hole: [deck.pop()!, deck.pop()!],
      chips: START_CHIPS, bet: 0, folded: false, acted: false, allin: false, last: null,
    });
  }
  const sb = 1 % n;
  const bb = 2 % n;
  const post = (i: number, amt: number) => {
    const pl = players[i];
    const a = Math.min(amt, pl.chips);
    pl.chips -= a;
    pl.bet = a;
    return a;
  };
  const pot = post(sb, SMALL_BLIND) + post(bb, BIG_BLIND);
  players[sb].last = { k: 'smallBlind', amount: SMALL_BLIND };
  players[bb].last = { k: 'bigBlind', amount: BIG_BLIND };

  return {
    deck, players, board: [], street: 0, pot, currentBet: BIG_BLIND,
    turn: (bb + 1) % n, awaiting: false, over: false, reveal: false,
    log: [{ k: 'blinds', pot }], result: null,
  };
}

export function roundDone(p: PlayState): boolean {
  if (p.players.filter((x) => !x.folded).length < 2) return true;
  const live = p.players.filter((x) => !x.folded && !x.allin);
  if (live.length === 0) return true;
  return live.every((x) => x.acted && x.bet === p.currentBet);
}

export function findNext(p: PlayState, from: number): number {
  const n = p.players.length;
  for (let i = 0; i < n; i++) {
    const j = (from + i) % n;
    const pl = p.players[j];
    if (!pl.folded && !pl.allin && (!pl.acted || pl.bet < p.currentBet)) return j;
  }
  return -1;
}

export type ActionKind = 'fold' | 'call' | 'raise';

export function applyAction(p: PlayState, i: number, kind: ActionKind, raiseTo = 0): void {
  const pl = p.players[i];
  const wasBet = p.currentBet;
  if (kind === 'fold') {
    pl.folded = true;
    pl.acted = true;
    pl.last = { k: 'fold', name: pl.name };
    p.log.push({ k: 'fold', name: pl.name });
  } else if (kind === 'call') {
    const need = Math.min(p.currentBet - pl.bet, pl.chips);
    pl.chips -= need;
    pl.bet += need;
    p.pot += need;
    pl.acted = true;
    if (pl.chips === 0) pl.allin = true;
    const entry: LogEntry = need === 0 ? { k: 'check', name: pl.name } : { k: 'call', name: pl.name, amount: need };
    pl.last = entry;
    p.log.push(entry);
  } else {
    let to = Math.min(raiseTo, pl.bet + pl.chips);
    if (to <= p.currentBet) to = Math.min(pl.bet + pl.chips, p.currentBet + BIG_BLIND);
    const need = to - pl.bet;
    pl.chips -= need;
    pl.bet = to;
    p.pot += need;
    pl.acted = true;
    if (pl.chips === 0) pl.allin = true;
    p.currentBet = to;
    // A raise reopens the action for everyone still in the hand.
    p.players.forEach((x, j) => { if (j !== i && !x.folded && !x.allin) x.acted = false; });
    const entry: LogEntry = { k: wasBet === 0 ? 'bet' : 'raise', name: pl.name, amount: to, allin: pl.allin };
    pl.last = entry;
    p.log.push(entry);
  }
  p.turn = (i + 1) % p.players.length;
}

/** Rough 0..1 read on how good a holding is right now — drives the bots and the coach. */
export function strength(p: PlayState, pl: Player): number {
  if (p.street === 0) {
    const [a, b] = pl.hole;
    const hi = Math.max(a.v, b.v);
    const lo = Math.min(a.v, b.v);
    let s: number;
    if (a.v === b.v) s = 0.52 + (a.v - 2) / 26;
    else {
      s = (hi - 2) / 30 + (lo - 2) / 70;
      if (a.s === b.s) s += 0.08;
      if (hi - lo <= 2) s += 0.06;
    }
    return Math.max(0.05, Math.min(0.97, s));
  }
  const e = best7([...pl.hole, ...p.board]);
  if (e.cat === 0) return Math.min(0.3, 0.13 + (e.score[1] - 2) / 60);
  if (e.cat === 1) {
    const top = Math.max(...p.board.map((c) => c.v));
    let s = 0.33 + (e.score[1] - 2) / 44;
    if (e.score[1] >= top) s += 0.12;
    return Math.min(0.62, s);
  }
  return [0, 0, 0.7, 0.83, 0.87, 0.9, 0.95, 0.98, 0.99][e.cat];
}

export function botDecision(p: PlayState, i: number, rng: () => number = Math.random): { kind: ActionKind; to: number } {
  const pl = p.players[i];
  const toCall = p.currentBet - pl.bet;
  const s = strength(p, pl);
  const r = rng();
  const round = (x: number) => Math.max(BIG_BLIND, Math.round(x / 10) * 10);
  let kind: ActionKind = 'call';
  let to = 0;
  if (toCall === 0) {
    if (s > 0.72 && r < 0.8) { kind = 'raise'; to = round(p.pot * 0.6); }
    else if (s > 0.5 && r < 0.35) { kind = 'raise'; to = round(p.pot * 0.4); }
  } else {
    const price = toCall / (p.pot + toCall);
    if (s > 0.86 && r < 0.55) { kind = 'raise'; to = round(p.currentBet * 2 + p.pot * 0.25); }
    else if (s < 0.3 || (s < 0.42 && price > 0.3) || (s < 0.55 && price > 0.5 && r < 0.7)) kind = 'fold';
  }
  return { kind, to };
}

export function nextStreet(p: PlayState): void {
  p.players.forEach((x) => { x.bet = 0; x.acted = false; x.last = null; });
  p.currentBet = 0;
  p.street += 1;
  if (p.street === 1) { p.board = [p.deck.pop()!, p.deck.pop()!, p.deck.pop()!]; p.log.push({ k: 'flop' }); }
  else if (p.street === 2) { p.board = [...p.board, p.deck.pop()!]; p.log.push({ k: 'turn' }); }
  else if (p.street === 3) { p.board = [...p.board, p.deck.pop()!]; p.log.push({ k: 'river' }); }
  p.turn = 1 % p.players.length;
}

export function finish(p: PlayState): void {
  p.over = true;
  p.awaiting = false;
  p.reveal = true;
  const live = p.players.filter((x) => !x.folded);
  let winners: Player[] = [];
  let detail: HandResult['detail'] = [];
  let how: HandResult['how'] = 'showdown';
  if (live.length === 1) { winners = [live[0]]; how = 'fold'; }
  else {
    detail = live.map((x) => {
      const e = best7([...x.hole, ...p.board]);
      return { name: x.name, e, cards: e.cards };
    });
    let bs: number[] | null = null;
    detail.forEach((d) => { if (!bs || cmpScore(d.e.score, bs) > 0) bs = d.e.score; });
    winners = detail
      .filter((d) => cmpScore(d.e.score, bs as unknown as number[]) === 0)
      .map((d) => p.players.find((x) => x.name === d.name)!);
  }
  const share = Math.floor(p.pot / winners.length);
  // Odd chips cannot be split, so they go to the first winner — as at a real table.
  let remainder = p.pot - share * winners.length;
  winners.forEach((w) => { w.chips += share + (remainder-- > 0 ? 1 : 0); });
  p.result = { how, winners: winners.map((w) => w.name), detail, share, pot: p.pot };
  p.log.push({ k: 'win', names: winners.map((w) => w.name), amount: share });
}
