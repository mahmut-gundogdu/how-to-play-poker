import type { Eval, LogEntry } from '@/lib/poker';
import type { Dict } from './types';

const RN: Record<number, string> = {
  2: 'twos', 3: 'threes', 4: 'fours', 5: 'fives', 6: 'sixes', 7: 'sevens', 8: 'eights',
  9: 'nines', 10: 'tens', 11: 'jacks', 12: 'queens', 13: 'kings', 14: 'aces',
};
const R1: Record<number, string> = {
  2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight',
  9: 'nine', 10: 'ten', 11: 'jack', 12: 'queen', 13: 'king', 14: 'ace',
};

const describe = (e: Eval): string => {
  const s = e.score;
  switch (e.cat) {
    case 0: return `high card ${R1[s[1]]}`;
    case 1: return `a pair of ${RN[s[1]]}`;
    case 2: return `two pair, ${RN[s[1]]} and ${RN[s[2]]}`;
    case 3: return `three ${RN[s[1]]}`;
    case 4: return `a straight to the ${R1[s[1]]}`;
    case 5: return `a flush, ${R1[s[1]]} high`;
    case 6: return `${RN[s[1]]} full of ${RN[s[2]]}`;
    case 7: return `four ${RN[s[1]]}`;
    default: return s[1] === 14 ? 'a royal flush' : `a straight flush to the ${R1[s[1]]}`;
  }
};

const short = (e: Eval): string => {
  const s = e.score;
  switch (e.cat) {
    case 0: return `${R1[s[1]]} high`;
    case 1: return RN[s[1]];
    case 2: return `${RN[s[1]]} and ${RN[s[2]]}`;
    case 3: return RN[s[1]];
    case 4: return `to the ${R1[s[1]]}`;
    case 5: return `${R1[s[1]]} high`;
    case 6: return `${RN[s[1]]} full of ${RN[s[2]]}`;
    case 7: return RN[s[1]];
    default: return s[1] === 14 ? 'ten to ace' : `to the ${R1[s[1]]}`;
  }
};

const en: Dict = {
  locale: 'en',
  htmlLang: 'en',
  nativeName: 'English',

  site: {
    name: "Hold'em, from scratch",
    tagline: 'Learn the ten hands, drill them, then play one for real chips.',
    description:
      "A free Texas Hold'em course for complete beginners: the ten hand rankings with example cards, a naming drill, showdown puzzles, and a play-chip table with a coach explaining every street.",
  },

  nav: { learn: '1 · The ten hands', drill: '2 · Name the hand', showdown: '3 · Who wins?', play: '4 · Play a hand' },

  pages: {
    learn: {
      title: "Texas Hold'em hand rankings — all ten hands explained",
      description:
        "Every Texas Hold'em hand from royal flush down to high card, with example cards and plain-English explanations, plus how a single hand plays out from blinds to showdown.",
      heading: 'The ten hands, strongest to weakest',
    },
    drill: {
      title: "Name the hand — Texas Hold'em ranking drill",
      description:
        'Practise reading poker hands. Five or seven cards are dealt, you name the hand, and you get told exactly which five cards count and why.',
      heading: 'Name the hand',
    },
    showdown: {
      title: "Who wins this pot? — Texas Hold'em showdown quiz",
      description:
        'Two players share the same five community cards. Decide who takes the pot — or whether it is a split — and see the reasoning card by card.',
      heading: 'Who takes this pot?',
    },
    play: {
      title: "Play a hand of Texas Hold'em with a coach",
      description:
        "Play free Texas Hold'em against practice bots with a coach explaining every decision, street by street. Play chips only, no sign-up, no money.",
      heading: 'Play a hand',
    },
  },

  common: {
    footer: 'Play chips only. Nothing here is a betting service.',
    chips: (n) => `${n} chips`,
    switchLanguage: 'Language',
    skipToContent: 'Skip to content',
  },

  learn: {
    flowEyebrow: 'Before the hands',
    flowTitle: 'How one hand plays out',
    flowIntro:
      'You get two private cards. Five more are dealt face up in the middle for everyone to share. Your hand is the best five cards you can make out of those seven — and you never have to use both of your own.',
    steps: [
      { label: 'STEP 1', title: 'Blinds', body: 'Two players pay a forced bet before any cards. That seeds the pot.' },
      { label: 'STEP 2', title: 'Your two cards', body: 'Everyone gets two face down. First round of betting: fold, call, or raise.' },
      { label: 'STEP 3', title: 'The flop', body: 'Three shared cards land face up. Bet again now that you can see more.' },
      { label: 'STEP 4', title: 'Turn & river', body: 'Two more shared cards, one at a time, with a betting round after each.' },
      { label: 'STEP 5', title: 'Showdown', body: 'Cards up. Best five-card hand takes the pot. Everyone else folded already.' },
    ],
    chartEyebrow: 'The whole chart',
    chartTitle: 'Strongest to weakest',
    chartNote: 'Suits never outrank each other. Only the ranks matter.',
    cta: 'Drill me on these',
    ctaNote: 'Ten minutes of naming hands and this chart stops being a chart.',
    faqTitle: 'Common questions',
    faq: [
      {
        q: 'Do I have to use both of my own cards?',
        a: 'No. Your hand is the best five cards out of the seven available. You can use both, one, or neither — if the five community cards are the best hand you have, that is what you play.',
      },
      {
        q: 'Does one suit beat another?',
        a: 'Never in Texas Hold\'em. Two flushes are compared by their highest cards, and identical hands split the pot.',
      },
      {
        q: 'Is an ace high or low in a straight?',
        a: 'Both. Ten through ace is the highest straight; ace through five is the lowest. An ace cannot sit in the middle, so queen-king-ace-two-three is not a straight.',
      },
      {
        q: 'What beats a full house?',
        a: 'Four of a kind, a straight flush, and a royal flush — nothing else. A full house beats a flush, a straight, and everything below them.',
      },
    ],
  },

  drill: {
    eyebrow: 'Drill',
    promptFive: 'Name this hand.',
    promptSeven: 'What is the best hand here?',
    hintSeven: 'Seven cards. Pick the best five — two are always left out.',
    streak: 'streak',
    streakBest: (n) => `streak · best ${n}`,
    formatLabel: 'Drill format',
    formatFive: '5 cards',
    formatSeven: '7 cards (hole + board)',
    right: (hand) => `Right — ${hand.toLowerCase()}.`,
    wrong: (hand) => `Not this time — it is ${hand.toLowerCase()}.`,
    why: (d, tip) => `You are looking at ${d}. ${tip}`,
    theFive: 'The five that count',
    next: 'Next hand',
    howToRead: 'How to read a hand',
    readSteps: [
      'Look for repeats first — four, three, two of a rank.',
      'Then check suits. Five of one suit is a flush.',
      'Then check for a run of five ranks.',
      'Straight and flush together is the top of the chart.',
      "If none of that, it's high card.",
    ],
    stuck: 'Stuck? The full chart lives on',
    stuckLink: 'tab one',
    loading: 'Dealing…',
  },

  showdown: {
    eyebrow: 'Showdown',
    title: 'Who takes this pot?',
    intro: 'Both players share the five cards in the middle. Each makes their best five out of seven.',
    board: 'The board',
    seatHolds: (seat) => `Seat ${seat} holds`,
    pickA: 'Seat A wins',
    pickB: 'Seat B wins',
    pickTie: "It's a split pot",
    correct: 'Correct.',
    notQuite: 'Not quite.',
    seatWins: (seat) => `Seat ${seat} wins.`,
    splitPot: 'Split pot — identical hands.',
    whyTie: (d) => `Both players end up with ${d}, using the same five cards. The pot is shared.`,
    whyWin: (seat, winner, loser) => `Seat ${seat} makes ${winner}; the other seat has ${loser}. `,
    whySameCat: 'Same hand type, so it comes down to the higher cards.',
    whyOutranks: (w, l) => `${w} outranks ${l.toLowerCase()}.`,
    another: 'Another one',
    loading: 'Shuffling…',
  },

  play: {
    dealFirst: 'Deal me in',
    dealAgain: 'Deal a new hand',
    stakes: '500 chips each. Blinds 10 and 20. No money, no pressure.',
    yourMove: 'Your move',
    fold: 'Fold',
    check: 'Check',
    call: (n) => `Call ${n}`,
    bet: (n) => `Bet ${n}`,
    raiseTo: (n) => `Raise to ${n}`,
    allIn: 'All in',
    you: 'You',
    thinking: 'thinking…',
    folded: 'folded',
    yourTurn: 'Your turn',
    youFolded: 'You folded this hand',
    deciding: (name) => `${name} is deciding…`,
    dealing: 'Dealing…',
    streets: ['Pre-flop', 'Flop', 'Turn', 'River', 'Showdown'],
    potLabel: (street, pot) => `${street} · pot ${pot}`,
    coach: 'Coach',
    coachTitles: ['Pre-flop', 'On the flop', 'On the turn', 'On the river', 'Showdown'],
    coachFinished: 'Hand finished',
    coachOver: 'Look at the five cards each player actually used. That is the whole game in one picture.',
    coachPre: [
      'Strong start. Raising here builds the pot while you are ahead.',
      'Playable, not powerful. Calling is fine; folding to a big raise is fine too.',
      'Weak cards. Folding costs you nothing but the blind, and most hands should be folded.',
    ],
    coachPost: [
      'You have a big hand. Bet it — waiting lets the others catch up for free.',
      'Decent but not safe. A modest bet asks a question without risking much.',
      'Marginal. Checking keeps the pot small while you see one more card.',
      'You are behind. Fold to any real bet rather than paying to find out.',
    ],
    youCurrentlyHave: 'You currently have',
    pocketPair: (rank) => `A pocket pair of ${rank}`,
    suited: (a, b) => `${a} and ${b}, suited`,
    offsuit: (a, b) => `${a} and ${b}, offsuit`,
    tableTalk: 'Table talk',
    handOver: 'Hand over',
    youWin: (n) => `You win ${n} chips.`,
    youSplit: (n) => `You split the pot — ${n} chips.`,
    theyTake: (names, n, many) => `${names} ${many ? 'take' : 'takes'} ${n}.`,
    whyFold:
      'Everyone else folded, so the last player standing takes the pot without showing a card. You do not need the best hand — just the last bet nobody called.',
    whyShowdown:
      'At showdown every remaining player makes their best five out of seven. Highest hand on the chart wins; same hand type goes to the higher cards.',
    wonUncontested: 'Won uncontested',
    everyoneFolded: 'everyone folded',
    opponents: 'Bot opponents',
    revealBots: 'Bot cards face up (teaching mode)',
    coachPanel: 'Show coach panel',
    settings: 'Table settings',
  },

  hands: {
    royalFlush: {
      name: 'Royal flush',
      blurb: 'Ten through ace, all one suit. The best hand in poker — you may play for years without one.',
      tip: 'The single best hand in poker: ten to ace, all one suit.',
    },
    straightFlush: {
      name: 'Straight flush',
      blurb: 'Five ranks in a row, all one suit. Any run works; the highest card decides between two of them.',
      tip: 'A run of five in a single suit — second only to the royal flush.',
    },
    fourOfAKind: {
      name: 'Four of a kind',
      blurb: 'All four cards of one rank. Often called quads. The fifth card is just along for the ride.',
      tip: 'All four cards of one rank. Rare enough that you remember each one.',
    },
    fullHouse: {
      name: 'Full house',
      blurb: 'Three of one rank plus a pair of another. Compare the three-of-a-kind first, then the pair.',
      tip: 'Three of a kind plus a pair, in the same five cards.',
    },
    flush: {
      name: 'Flush',
      blurb: 'Five cards of the same suit, in any order. Highest card wins between two flushes.',
      tip: 'Five cards of one suit. Order does not matter, only the highest card.',
    },
    straight: {
      name: 'Straight',
      blurb: 'Five ranks in a row, suits mixed. An ace can start the low end: A-2-3-4-5 counts.',
      tip: 'Five ranks in a row. Suits do not matter at all here.',
    },
    threeOfAKind: {
      name: 'Three of a kind',
      blurb: 'Three cards of one rank. A set or trips, depending on where the cards came from.',
      tip: 'Three cards of one rank. Players call it a set or trips.',
    },
    twoPair: {
      name: 'Two pair',
      blurb: 'Two different pairs. If you somehow have three pairs, only the top two count.',
      tip: 'Two separate pairs. If three pairs are available, only the top two count.',
    },
    onePair: {
      name: 'One pair',
      blurb: 'Two cards of the same rank. The most common made hand — and it wins plenty of pots.',
      tip: 'Two cards of the same rank. It is the most common made hand, and it wins a lot of pots.',
    },
    highCard: {
      name: 'High card',
      blurb: 'Nothing pairs and nothing runs. Your highest card plays, then the next, and so on.',
      tip: 'Nothing pairs up and there is no run of five, so only the highest card counts.',
    },
  },

  describe,
  short,

  status: (entry: LogEntry): string => {
    switch (entry.k) {
      case 'smallBlind': return `small blind ${entry.amount}`;
      case 'bigBlind': return `big blind ${entry.amount}`;
      case 'fold': return 'folded';
      case 'check': return 'checked';
      case 'call': return `called ${entry.amount}`;
      case 'bet': return `bet ${entry.amount}${entry.allin ? ' · all in' : ''}`;
      case 'raise': return `raised to ${entry.amount}${entry.allin ? ' · all in' : ''}`;
      default: return '';
    }
  },

  log: (entry: LogEntry, you: string): string => {
    const nm = (n: string) => (n === 'You' ? you : n);
    // "You call" vs "Rosa calls" — second person takes the bare verb.
    const isYou = (n: string) => n === 'You';
    const v = (n: string, third: string, second: string) => (isYou(n) ? second : third);
    const allIn = (n: string) => v(n, ' and is all in.', ' and are all in.');
    switch (entry.k) {
      case 'blinds': return `Blinds are in. Pot is ${entry.pot}.`;
      case 'smallBlind': return `small blind ${entry.amount}`;
      case 'bigBlind': return `big blind ${entry.amount}`;
      case 'flop': return 'The flop.';
      case 'turn': return 'The turn.';
      case 'river': return 'The river.';
      case 'fold': return `${nm(entry.name)} ${v(entry.name, 'folds', 'fold')}.`;
      case 'check': return `${nm(entry.name)} ${v(entry.name, 'checks', 'check')}.`;
      case 'call': return `${nm(entry.name)} ${v(entry.name, 'calls', 'call')} ${entry.amount}.`;
      case 'bet':
        return `${nm(entry.name)} ${v(entry.name, 'bets', 'bet')} ${entry.amount}${entry.allin ? allIn(entry.name) : '.'}`;
      case 'raise':
        return `${nm(entry.name)} ${v(entry.name, 'raises', 'raise')} to ${entry.amount}${entry.allin ? allIn(entry.name) : '.'}`;
      case 'win': {
        const names = entry.names.map(nm).join(' and ');
        const plural = entry.names.length > 1 || entry.names.some(isYou);
        return `${names} ${plural ? 'win' : 'wins'} ${entry.amount}.`;
      }
    }
  },
};

export default en;
