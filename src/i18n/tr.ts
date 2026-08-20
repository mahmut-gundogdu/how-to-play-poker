import type { Eval, LogEntry } from '@/lib/poker';
import type { Dict } from './types';

/** Kart adları (tekil). Türkçede çoğul ek yerine sayı + tekil kullanılır. */
const R1: Record<number, string> = {
  2: 'ikili', 3: 'üçlü', 4: 'dörtlü', 5: 'beşli', 6: 'altılı', 7: 'yedili', 8: 'sekizli',
  9: 'dokuzlu', 10: 'onlu', 11: 'vale', 12: 'kız', 13: 'papaz', 14: 'as',
};
/** Yönelme hâli: "…-e kadar kent" kalıbı için. */
const RDat: Record<number, string> = {
  2: 'ikiliye', 3: 'üçlüye', 4: 'dörtlüye', 5: 'beşliye', 6: 'altılıya', 7: 'yediliye',
  8: 'sekizliye', 9: 'dokuzluya', 10: 'onluya', 11: 'valeye', 12: 'kıza', 13: 'papaza', 14: 'asa',
};

const describe = (e: Eval): string => {
  const s = e.score;
  switch (e.cat) {
    case 0: return `${R1[s[1]]} yüksek kartı`;
    case 1: return `${R1[s[1]]} çifti`;
    case 2: return `iki çift: ${R1[s[1]]} ve ${R1[s[2]]}`;
    case 3: return `üç ${R1[s[1]]}`;
    case 4: return `${RDat[s[1]]} kadar kent`;
    case 5: return `${R1[s[1]]} yükseklikli floş`;
    case 6: return `${R1[s[1]]} üzerine ${R1[s[2]]} full house`;
    case 7: return `dört ${R1[s[1]]} (kare)`;
    default: return s[1] === 14 ? 'royal floş' : `${RDat[s[1]]} kadar renkli kent`;
  }
};

const short = (e: Eval): string => {
  const s = e.score;
  switch (e.cat) {
    case 0: return `${R1[s[1]]} yüksek`;
    case 1: return R1[s[1]];
    case 2: return `${R1[s[1]]} ve ${R1[s[2]]}`;
    case 3: return `üç ${R1[s[1]]}`;
    case 4: return `${RDat[s[1]]} kadar`;
    case 5: return `${R1[s[1]]} yüksek`;
    case 6: return `${R1[s[1]]} üzerine ${R1[s[2]]}`;
    case 7: return `dört ${R1[s[1]]}`;
    default: return s[1] === 14 ? 'onludan asa' : `${RDat[s[1]]} kadar`;
  }
};

const tr: Dict = {
  locale: 'tr',
  htmlLang: 'tr',
  nativeName: 'Türkçe',

  site: {
    name: 'Sıfırdan Hold’em',
    tagline: 'Önce on eli öğren, sonra çalış, sonra gerçek fişlerle bir el oyna.',
    description:
      'Yeni başlayanlar için ücretsiz Texas Hold’em rehberi: örnek kartlarla on el sıralaması, el tanıma alıştırmaları, showdown bulmacaları ve her sokağı anlatan koçlu bir fiş masası.',
  },

  nav: { learn: '1 · On el', drill: '2 · Eli adlandır', showdown: '3 · Kim kazanır?', play: '4 · Bir el oyna' },

  pages: {
    learn: {
      title: 'Texas Hold’em el sıralaması — on elin tamamı',
      description:
        'Royal floştan yüksek karta kadar bütün Texas Hold’em elleri; örnek kartlar, sade açıklamalar ve körlemeden showdown’a tek bir elin nasıl oynandığı.',
      heading: 'On el, en güçlüden en zayıfa',
    },
    drill: {
      title: 'Eli adlandır — Texas Hold’em el sıralaması alıştırması',
      description:
        'Poker ellerini okumayı çalış. Beş ya da yedi kart dağıtılır, sen eli adlandırırsın; hangi beş kartın sayıldığını ve nedenini görürsün.',
      heading: 'Eli adlandır',
    },
    showdown: {
      title: 'Bu potu kim alır? — Texas Hold’em showdown testi',
      description:
        'İki oyuncu aynı beş ortak kartı paylaşır. Potu kimin aldığına — ya da potun bölüşülüp bölüşülmediğine — karar ver, gerekçesini kart kart gör.',
      heading: 'Kim kazanır?',
    },
    play: {
      title: 'Koç eşliğinde bir el Texas Hold’em oyna',
      description:
        'Her kararı açıklayan bir koçla, alıştırma botlarına karşı ücretsiz Texas Hold’em oyna. Sadece oyun fişi; üyelik yok, para yok.',
      heading: 'Bir el oyna',
    },
  },

  common: {
    footer: 'Sadece oyun fişi. Burası bir bahis servisi değildir.',
    chips: (n) => `${n} fiş`,
    switchLanguage: 'Dil',
    skipToContent: 'İçeriğe geç',
  },

  learn: {
    flowEyebrow: 'Ellerden önce',
    flowTitle: 'Bir el nasıl oynanır',
    flowIntro:
      'Sana iki kapalı kart verilir. Ortaya herkesin paylaştığı beş kart daha açık gelir. Elin, bu yedi karttan çıkarabildiğin en iyi beş karttır — ve kendi iki kartını kullanma zorunluluğun yoktur.',
    steps: [
      { label: 'ADIM 1', title: 'Körler', body: 'Kartlar dağıtılmadan önce iki oyuncu zorunlu bahis yatırır. Pot böyle başlar.' },
      { label: 'ADIM 2', title: 'İki kartın', body: 'Herkes iki kapalı kart alır. İlk bahis turu: pas geç, gör ya da yükselt.' },
      { label: 'ADIM 3', title: 'Flop', body: 'Ortaya üç ortak kart açılır. Artık daha çok şey gördün, yeniden bahis.' },
      { label: 'ADIM 4', title: 'Turn ve river', body: 'Birer birer iki ortak kart daha; her birinin ardından bir bahis turu.' },
      { label: 'ADIM 5', title: 'Showdown', body: 'Kartlar açılır. En iyi beş kartlı el potu alır. Kalanlar zaten pas geçmiştir.' },
    ],
    chartEyebrow: 'Bütün tablo',
    chartTitle: 'En güçlüden en zayıfa',
    chartNote: 'Renkler birbirine üstün değildir. Sadece kart değerleri sayılır.',
    cta: 'Beni bunlarla çalıştır',
    ctaNote: 'On dakika el adlandırdıktan sonra bu tablo artık tablo olmaktan çıkar.',
    faqTitle: 'Sık sorulanlar',
    faq: [
      {
        q: 'Kendi iki kartımı da kullanmak zorunda mıyım?',
        a: 'Hayır. Elin, yedi karttan çıkan en iyi beş karttır. İkisini de, birini ya da hiçbirini kullanabilirsin; ortadaki beş kart senin en iyi elinse oynadığın el odur.',
      },
      {
        q: 'Bir renk diğerini yener mi?',
        a: 'Texas Hold’em’de asla. İki floş en yüksek kartlarına göre karşılaştırılır; birebir aynı eller potu bölüşür.',
      },
      {
        q: 'Kentte as yüksek mi alçak mı?',
        a: 'İkisi de. Onludan asa en yüksek kenttir; astan beşliye ise en alçağı. As ortada duramaz, yani kız-papaz-as-ikili-üçlü kent sayılmaz.',
      },
      {
        q: 'Full house’u ne yener?',
        a: 'Kare, renkli kent ve royal floş — başka hiçbir şey. Full house ise floşu, kenti ve altındaki her şeyi yener.',
      },
    ],
  },

  drill: {
    eyebrow: 'Alıştırma',
    promptFive: 'Bu eli adlandır.',
    promptSeven: 'Buradaki en iyi el hangisi?',
    hintSeven: 'Yedi kart. En iyi beşini seç — ikisi her zaman dışarıda kalır.',
    streak: 'seri',
    streakBest: (n) => `seri · en iyi ${n}`,
    formatLabel: 'Alıştırma biçimi',
    formatFive: '5 kart',
    formatSeven: '7 kart (el + masa)',
    right: (hand) => `Doğru — ${hand.toLocaleLowerCase('tr')}.`,
    wrong: (hand) => `Bu sefer olmadı — doğrusu ${hand.toLocaleLowerCase('tr')}.`,
    why: (d, tip) => `Elinde ${d} var. ${tip}`,
    theFive: 'Sayılan beş kart',
    next: 'Sonraki el',
    howToRead: 'Bir el nasıl okunur',
    readSteps: [
      'Önce tekrarlara bak — aynı değerden dört, üç, iki tane.',
      'Sonra renklere bak. Aynı renkten beş kart floştur.',
      'Sonra art arda gelen beş değer var mı diye bak.',
      'Kent ve floş birlikteyse tablonun en tepesindesin.',
      'Bunların hiçbiri yoksa el yüksek karttır.',
    ],
    stuck: 'Takıldın mı? Tam tablo şurada:',
    stuckLink: 'birinci sekme',
    loading: 'Dağıtılıyor…',
  },

  showdown: {
    eyebrow: 'Showdown',
    title: 'Bu potu kim alır?',
    intro: 'İki oyuncu da ortadaki beş kartı paylaşır. Her biri yedi karttan en iyi beşini yapar.',
    board: 'Masa',
    seatHolds: (seat) => `${seat} koltuğunun kartları`,
    pickA: 'A kazanır',
    pickB: 'B kazanır',
    pickTie: 'Pot bölüşülür',
    correct: 'Doğru.',
    notQuite: 'Tam değil.',
    seatWins: (seat) => `${seat} koltuğu kazanır.`,
    splitPot: 'Bölünmüş pot — eller birebir aynı.',
    whyTie: (d) => `İki oyuncu da aynı beş kartla ${d} yapıyor. Pot paylaşılır.`,
    whyWin: (seat, winner, loser) => `${seat} koltuğu ${winner} yapıyor; diğer koltukta ise ${loser} var. `,
    whySameCat: 'El tipi aynı, dolayısıyla iş yüksek kartlara kalıyor.',
    whyOutranks: (w, l) => `${w}, ${l.toLocaleLowerCase('tr')} elini yener.`,
    another: 'Bir tane daha',
    loading: 'Karıştırılıyor…',
  },

  play: {
    dealFirst: 'Beni oyuna dahil et',
    dealAgain: 'Yeni el dağıt',
    stakes: 'Herkese 500 fiş. Körler 10 ve 20. Para yok, baskı yok.',
    yourMove: 'Sıra sende',
    fold: 'Pas',
    check: 'Çek',
    call: (n) => `Gör ${n}`,
    bet: (n) => `Bahis ${n}`,
    raiseTo: (n) => `${n}’e yükselt`,
    allIn: 'All in',
    you: 'Sen',
    thinking: 'düşünüyor…',
    folded: 'pas geçti',
    yourTurn: 'Sıra sende',
    youFolded: 'Bu eli pas geçtin',
    deciding: (name) => `${name} karar veriyor…`,
    dealing: 'Dağıtılıyor…',
    streets: ['Flop öncesi', 'Flop', 'Turn', 'River', 'Showdown'],
    potLabel: (street, pot) => `${street} · pot ${pot}`,
    coach: 'Koç',
    coachTitles: ['Flop öncesi', 'Flopta', 'Turn’de', 'River’da', 'Showdown’da'],
    coachFinished: 'El bitti',
    coachOver: 'Her oyuncunun gerçekten kullandığı beş karta bak. Bütün oyun tek bir karede burada.',
    coachPre: [
      'Güçlü bir başlangıç. Öndeyken yükseltmek potu büyütür.',
      'Oynanır ama güçlü değil. Görmek makul; büyük bir yükseltmeye pas geçmek de makul.',
      'Zayıf kartlar. Pas geçmek sana körden başka bir şeye mal olmaz; ellerin çoğu pas geçilmelidir.',
    ],
    coachPost: [
      'Büyük bir elin var. Bahis yap — beklemek diğerlerine bedava yetişme şansı verir.',
      'Fena değil ama güvenli de değil. Ölçülü bir bahis fazla risk almadan soru sorar.',
      'Sınırda. Çekmek, bir kart daha görürken potu küçük tutar.',
      'Geridesin. Öğrenmek için ödemek yerine ciddi her bahse pas geç.',
    ],
    youCurrentlyHave: 'Şu an elinde',
    pocketPair: (rank) => `Cepte ${rank} çifti`,
    suited: (a, b) => `${a} ve ${b}, aynı renk`,
    offsuit: (a, b) => `${a} ve ${b}, farklı renk`,
    tableTalk: 'Masa konuşmaları',
    handOver: 'El bitti',
    youWin: (n) => `${n} fiş kazandın.`,
    youSplit: (n) => `Potu bölüştün — ${n} fiş.`,
    theyTake: (names, n) => `${names} ${n} fişi alıyor.`,
    whyFold:
      'Herkes pas geçtiği için ayakta kalan son oyuncu kartını göstermeden potu alır. En iyi ele ihtiyacın yok — kimsenin görmediği son bahis yeter.',
    whyShowdown:
      'Showdown’da kalan her oyuncu yedi karttan en iyi beşini yapar. Tabloda en yüksek el kazanır; el tipi aynıysa iş yüksek kartlara kalır.',
    wonUncontested: 'Rakipsiz kazandı',
    everyoneFolded: 'herkes pas geçti',
    opponents: 'Bot rakip sayısı',
    revealBots: 'Bot kartları açık (öğretim modu)',
    coachPanel: 'Koç panelini göster',
    settings: 'Masa ayarları',
  },

  hands: {
    royalFlush: {
      name: 'Royal floş',
      blurb: 'Onludan asa, hepsi aynı renk. Pokerin en iyi eli — yıllarca oynayıp bir kez bile görmeyebilirsin.',
      tip: 'Pokerin tek en iyi eli: onludan asa, hepsi aynı renkten.',
    },
    straightFlush: {
      name: 'Renkli kent',
      blurb: 'Art arda beş değer, hepsi aynı renk. Her dizi olur; ikisi karşılaşırsa en yüksek kart karar verir.',
      tip: 'Tek renkten art arda beş kart — royal floştan sonraki en iyi el.',
    },
    fourOfAKind: {
      name: 'Kare',
      blurb: 'Aynı değerin dört kartı da elinde. Beşinci kart sadece yanında taşınır.',
      tip: 'Aynı değerden dört kart. Her birini hatırlayacak kadar nadirdir.',
    },
    fullHouse: {
      name: 'Full house',
      blurb: 'Bir değerden üç, başka bir değerden iki kart. Önce üçlü karşılaştırılır, sonra çift.',
      tip: 'Aynı beş kart içinde bir üçlü ve bir çift.',
    },
    flush: {
      name: 'Floş',
      blurb: 'Aynı renkten beş kart, sıra önemli değil. İki floşta en yüksek kart kazanır.',
      tip: 'Tek renkten beş kart. Sıra değil, yalnızca en yüksek kart önemli.',
    },
    straight: {
      name: 'Kent',
      blurb: 'Art arda beş değer, renkler karışık. As alt uçtan başlayabilir: A-2-3-4-5 geçerlidir.',
      tip: 'Art arda beş değer. Burada renklerin hiçbir önemi yok.',
    },
    threeOfAKind: {
      name: 'Üçlü',
      blurb: 'Aynı değerden üç kart. Kartların nereden geldiğine göre “set” ya da “trips” denir.',
      tip: 'Aynı değerden üç kart. Oyuncular buna set ya da trips der.',
    },
    twoPair: {
      name: 'İki çift',
      blurb: 'Birbirinden farklı iki çift. Üç çift çıkarsa yalnızca en yüksek ikisi sayılır.',
      tip: 'Birbirinden ayrı iki çift. Üç çift varsa yalnızca en üstteki ikisi sayılır.',
    },
    onePair: {
      name: 'Bir çift',
      blurb: 'Aynı değerden iki kart. En sık görülen el — ve bir sürü potu da o kazanır.',
      tip: 'Aynı değerden iki kart. En sık görülen eldir ve çok pot kazandırır.',
    },
    highCard: {
      name: 'Yüksek kart',
      blurb: 'Ne çift var ne dizi. En yüksek kartın oynar, sonra bir sonraki, böyle devam eder.',
      tip: 'Hiçbir çift yok ve beşli bir dizi de yok; yalnızca en yüksek kart sayılır.',
    },
  },

  describe,
  short,

  status: (entry: LogEntry, isYou = false): string => {
    const v = (third: string, second: string) => (isYou ? second : third);
    switch (entry.k) {
      case 'smallBlind': return `küçük kör ${entry.amount}`;
      case 'bigBlind': return `büyük kör ${entry.amount}`;
      case 'fold': return v('pas geçti', 'pas geçtin');
      case 'check': return v('çekti', 'çektin');
      case 'call': return `${entry.amount} ${v('gördü', 'gördün')}`;
      case 'bet': return `${entry.amount} bahis${entry.allin ? ' · all in' : ''}`;
      case 'raise': return `${entry.amount}’e ${v('yükseltti', 'yükselttin')}${entry.allin ? ' · all in' : ''}`;
      default: return '';
    }
  },

  log: (entry: LogEntry, you: string): string => {
    const nm = (n: string) => (n === 'You' ? you : n);
    // "Sen 20 gördün" ile "Rosa 20 gördü" — ikinci tekil şahıs eki.
    const isYou = (n: string) => n === 'You';
    const v = (n: string, third: string, second: string) => (isYou(n) ? second : third);
    switch (entry.k) {
      case 'blinds': return `Körler yatırıldı. Pot ${entry.pot}.`;
      case 'smallBlind': return `küçük kör ${entry.amount}`;
      case 'bigBlind': return `büyük kör ${entry.amount}`;
      case 'flop': return 'Flop geldi.';
      case 'turn': return 'Turn geldi.';
      case 'river': return 'River geldi.';
      case 'fold': return `${nm(entry.name)} pas ${v(entry.name, 'geçti', 'geçtin')}.`;
      case 'check': return `${nm(entry.name)} ${v(entry.name, 'çekti', 'çektin')}.`;
      case 'call': return `${nm(entry.name)} ${entry.amount} ${v(entry.name, 'gördü', 'gördün')}.`;
      case 'bet':
        return `${nm(entry.name)} ${entry.amount} bahis ${v(entry.name, 'yaptı', 'yaptın')}${
          entry.allin ? ` ve all in ${v(entry.name, 'oldu', 'oldun')}.` : '.'
        }`;
      case 'raise':
        return `${nm(entry.name)} ${entry.amount}’e ${v(entry.name, 'yükseltti', 'yükselttin')}${
          entry.allin ? ` ve all in ${v(entry.name, 'oldu', 'oldun')}.` : '.'
        }`;
      case 'win': {
        const solo = entry.names.length === 1 && isYou(entry.names[0]);
        return `${entry.names.map(nm).join(' ve ')} ${entry.amount} fiş ${solo ? 'kazandın' : 'kazandı'}.`;
      }
    }
  },
};

export default tr;
