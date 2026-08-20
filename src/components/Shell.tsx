import type { ReactNode } from 'react';
import { getDict } from '@/i18n';
import type { Locale, PageKey } from '@/i18n/types';
import Nav from './Nav';

/** Masthead + tabs + footer around a page's content. */
export default function Shell({
  locale, page, children,
}: {
  locale: Locale;
  page: PageKey;
  children: ReactNode;
}) {
  const t = getDict(locale);
  return (
    <>
      <Nav locale={locale} current={page} />
      <main className="main" id="content">
        <div className="wrap">{children}</div>
      </main>
      <footer className="foot">
        <div className="wrap">
          <p className="rule">{t.common.footer}</p>
        </div>
      </footer>
    </>
  );
}
