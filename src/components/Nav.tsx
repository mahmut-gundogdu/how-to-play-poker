import Link from 'next/link';
import { getDict } from '@/i18n';
import { LOCALES, type Locale, type PageKey } from '@/i18n/types';
import { href, PAGES } from '@/lib/routes';

export default function Nav({ locale, current }: { locale: Locale; current: PageKey }) {
  const t = getDict(locale);
  return (
    <header className="masthead">
      <div className="wrap">
        <div className="masthead-top">
          <p className="brand">
            <Link href={href(locale, 'learn')}>{t.site.name}</Link>
          </p>
          <span className="tagline">{t.site.tagline}</span>
          <div className="masthead-lang">
            <span className="label">{t.common.switchLanguage}:</span>
            {LOCALES.map((l) => (
              <Link
                key={l}
                className="lang-link"
                href={href(l, current)}
                hrefLang={l}
                aria-current={l === locale}
              >
                {getDict(l).nativeName}
              </Link>
            ))}
          </div>
        </div>
        <nav className="tabs" aria-label={t.site.name}>
          {PAGES.map((p) => (
            <Link
              key={p}
              className="tab"
              href={href(locale, p)}
              aria-current={p === current ? 'page' : undefined}
            >
              {t.nav[p]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
