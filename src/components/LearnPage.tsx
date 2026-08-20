import Link from 'next/link';
import { getDict } from '@/i18n';
import type { Locale } from '@/i18n/types';
import { CHART } from '@/lib/chart';
import { href } from '@/lib/routes';
import PlayingCard from './PlayingCard';

/**
 * Fully server-rendered: the ranking chart and FAQ are the SEO surface of the
 * site, so they ship as static HTML with no client JavaScript at all.
 */
export default function LearnPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{t.learn.flowEyebrow}</p>
        <h2 className="h2">{t.learn.flowTitle}</h2>
        <p className="lede">{t.learn.flowIntro}</p>
        <ol className="steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {t.learn.steps.map((s) => (
            <li className="step" key={s.label}>
              <div className="n">{s.label}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <div className="chart-head">
          <div>
            <p className="eyebrow">{t.learn.chartEyebrow}</p>
            <h1 className="h2" style={{ margin: '10px 0 0' }}>{t.pages.learn.heading}</h1>
          </div>
          <p className="note">{t.learn.chartNote}</p>
        </div>

        <div className="chart">
          {CHART.map((row, i) => {
            const hand = t.hands[row.key];
            return (
              <article className="rank-row" key={row.key}>
                <div className="idx">{String(i + 1).padStart(2, '0')}</div>
                <div className="rank-body">
                  <div className="hand">
                    {row.cards.map((c) => (
                      <PlayingCard key={`${c.r}${c.s}`} card={c} size="sm" locale={locale} />
                    ))}
                  </div>
                  <div>
                    <h3>{hand.name}</h3>
                    <p>{hand.blurb}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="cta-row">
          <Link className="btn" href={href(locale, 'drill')} style={{ display: 'inline-block' }}>
            {t.learn.cta}
          </Link>
          <span className="note">{t.learn.ctaNote}</span>
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">{t.learn.faqTitle}</p>
        <div className="faq">
          {t.learn.faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
