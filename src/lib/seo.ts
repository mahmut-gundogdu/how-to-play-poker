import type { Metadata } from 'next';
import { getDict } from '@/i18n';
import { LOCALES, type Locale, type PageKey } from '@/i18n/types';
import { SITE_URL, href } from './routes';

/** Canonical URL plus hreflang alternates for one page in one locale. */
export function alternates(locale: Locale, page: PageKey): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}${href(l, page)}`;
  languages['x-default'] = `${SITE_URL}${href('en', page)}`;
  return { canonical: `${SITE_URL}${href(locale, page)}`, languages };
}

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const t = getDict(locale);
  const meta = t.pages[page];
  return {
    title: meta.title,
    description: meta.description,
    alternates: alternates(locale, page),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${href(locale, page)}`,
      siteName: t.site.name,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  };
}
