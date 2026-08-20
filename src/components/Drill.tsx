'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getDict } from '@/i18n';
import type { Locale } from '@/i18n/types';
import { newDrill, type Drill, type DrillFormat, type HandKey } from '@/lib/poker';
import { href } from '@/lib/routes';
import PlayingCard from './PlayingCard';

export default function DrillBoard({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [format, setFormat] = useState<DrillFormat>('five');
  const [drill, setDrill] = useState<Drill | null>(null);
  const [answer, setAnswer] = useState<HandKey | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const next = useCallback((f: DrillFormat) => {
    setDrill(newDrill(f));
    setAnswer(null);
  }, []);

  // Hands are dealt after mount so the server HTML stays deterministic.
  useEffect(() => { next(format); }, [format, next]);

  const pick = (key: HandKey) => {
    if (!drill || answer) return;
    setAnswer(key);
    const ok = key === drill.correct;
    const nextStreak = ok ? streak + 1 : 0;
    setStreak(nextStreak);
    setBest((b) => Math.max(b, nextStreak));
  };

  const used = drill ? drill.e.cards : [];
  const answered = answer !== null;
  const correct = drill && answer === drill.correct;

  return (
    <div className="two-col">
      <section className="card">
        <div className="drill-head">
          <div>
            <p className="eyebrow">{t.drill.eyebrow}</p>
            <h1 className="h2" style={{ margin: '10px 0 0' }}>
              {drill?.seven ? t.drill.promptSeven : t.drill.promptFive}
            </h1>
          </div>
          <div className="streak">
            <div className="n" aria-live="polite">{streak}</div>
            <div className="l">{t.drill.streakBest(best)}</div>
          </div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>
            {t.drill.formatLabel}
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as DrillFormat)}
            >
              <option value="five">{t.drill.formatFive}</option>
              <option value="seven">{t.drill.formatSeven}</option>
            </select>
          </label>
        </div>

        <div className="drill-cards">
          {drill
            ? drill.cards.map((c, i) => (
                <PlayingCard
                  key={`${c.r}${c.s}${i}`}
                  card={c}
                  size="xl"
                  locale={locale}
                  dim={answered && !used.includes(c)}
                />
              ))
            : <span className="drill-hint">{t.drill.loading}</span>}
        </div>
        <p className="drill-hint">{drill?.seven ? t.drill.hintSeven : ''}</p>

        <div className="options">
          {drill?.options.map((key) => {
            let cls = 'opt';
            if (answered) {
              if (key === drill.correct) cls += ' opt--right';
              else if (key === answer) cls += ' opt--wrong';
              else cls += ' opt--muted';
            }
            return (
              <button key={key} className={cls} onClick={() => pick(key)} disabled={answered}>
                {t.hands[key].name}
              </button>
            );
          })}
        </div>

        {drill && answered && (
          <div className="verdict">
            <h2 className={`h2 ${correct ? 'ok' : 'bad'}`} style={{ margin: 0, fontSize: 15 }}>
              {correct ? t.drill.right(t.hands[drill.correct].name) : t.drill.wrong(t.hands[drill.correct].name)}
            </h2>
            <p>{t.drill.why(t.describe(drill.e), t.hands[drill.correct].tip)}</p>
            <p className="sub-label">{t.drill.theFive}</p>
            <div className="hand" style={{ gap: 6 }}>
              {used.map((c, i) => (
                <PlayingCard key={`${c.r}${c.s}${i}`} card={c} size="md" locale={locale} />
              ))}
            </div>
            <button className="btn" style={{ marginTop: 22 }} onClick={() => next(format)}>
              {t.drill.next}
            </button>
          </div>
        )}
      </section>

      <section className="card howto">
        <p className="eyebrow">{t.drill.howToRead}</p>
        <ol>
          {t.drill.readSteps.map((s) => <li key={s}>{s}</li>)}
        </ol>
        <p className="foot">
          {t.drill.stuck}{' '}
          <Link href={href(locale, 'learn')}>{t.drill.stuckLink}</Link>.
        </p>
      </section>
    </div>
  );
}
