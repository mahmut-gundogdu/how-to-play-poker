import type { Eval, HandKey, LogEntry } from '@/lib/poker';

export const LOCALES = ['en', 'tr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type PageKey = 'learn' | 'drill' | 'showdown' | 'play';

export interface PageMeta {
  title: string;
  description: string;
  /** <h1> / tab label copy. */
  heading: string;
}

export interface Dict {
  locale: Locale;
  htmlLang: string;
  /** Language name in its own language, for the switcher. */
  nativeName: string;

  site: { name: string; tagline: string; description: string };

  nav: Record<PageKey, string>;
  pages: Record<PageKey, PageMeta>;

  common: {
    footer: string;
    chips: (n: number) => string;
    switchLanguage: string;
    skipToContent: string;
  };

  learn: {
    flowEyebrow: string;
    flowTitle: string;
    flowIntro: string;
    steps: { label: string; title: string; body: string }[];
    chartEyebrow: string;
    chartTitle: string;
    chartNote: string;
    cta: string;
    ctaNote: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
  };

  drill: {
    eyebrow: string;
    promptFive: string;
    promptSeven: string;
    hintSeven: string;
    streak: string;
    streakBest: (n: number) => string;
    formatLabel: string;
    formatFive: string;
    formatSeven: string;
    right: (hand: string) => string;
    wrong: (hand: string) => string;
    why: (describe: string, tip: string) => string;
    theFive: string;
    next: string;
    howToRead: string;
    readSteps: string[];
    stuck: string;
    stuckLink: string;
    loading: string;
  };

  showdown: {
    eyebrow: string;
    title: string;
    intro: string;
    board: string;
    seatHolds: (seat: 'A' | 'B') => string;
    pickA: string;
    pickB: string;
    pickTie: string;
    correct: string;
    notQuite: string;
    seatWins: (seat: 'A' | 'B') => string;
    splitPot: string;
    whyTie: (describe: string) => string;
    whyWin: (seat: 'A' | 'B', winner: string, loser: string) => string;
    whySameCat: string;
    whyOutranks: (winner: string, loser: string) => string;
    another: string;
    loading: string;
  };

  play: {
    dealFirst: string;
    dealAgain: string;
    stakes: string;
    yourMove: string;
    fold: string;
    check: string;
    call: (n: number) => string;
    bet: (n: number) => string;
    raiseTo: (n: number) => string;
    allIn: string;
    you: string;
    thinking: string;
    folded: string;
    yourTurn: string;
    youFolded: string;
    deciding: (name: string) => string;
    dealing: string;
    streets: string[];
    potLabel: (street: string, pot: number) => string;
    coach: string;
    coachTitles: string[];
    coachFinished: string;
    coachOver: string;
    coachPre: [string, string, string];
    coachPost: [string, string, string, string];
    youCurrentlyHave: string;
    pocketPair: (rank: string) => string;
    suited: (a: string, b: string) => string;
    offsuit: (a: string, b: string) => string;
    tableTalk: string;
    handOver: string;
    youWin: (n: number) => string;
    youSplit: (n: number) => string;
    theyTake: (names: string, n: number) => string;
    whyFold: string;
    whyShowdown: string;
    wonUncontested: string;
    everyoneFolded: string;
    opponents: string;
    revealBots: string;
    coachPanel: string;
    settings: string;
  };

  hands: Record<HandKey, { name: string; blurb: string; tip: string }>;

  /** "a pair of aces" — used inside sentences. */
  describe: (e: Eval) => string;
  /** "aces" / "ace high" — used as a short badge. */
  short: (e: Eval) => string;
  /** Table-talk line for one log entry. */
  log: (entry: LogEntry, you: string) => string;
  /** Short badge under a seat, e.g. "called 30". `isYou` picks second person. */
  status: (entry: LogEntry, isYou?: boolean) => string;
}
