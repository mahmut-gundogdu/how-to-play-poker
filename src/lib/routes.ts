import { LOCALES, type Locale, type PageKey } from '@/i18n/types';

export const PAGES: PageKey[] = ['learn', 'drill', 'showdown', 'play'];

/** Localised URL slugs — an empty slug means the locale index page. */
export const SLUGS: Record<Locale, Record<PageKey, string>> = {
  en: { learn: '', drill: 'drill', showdown: 'showdown', play: 'play' },
  tr: { learn: '', drill: 'eli-adlandir', showdown: 'kim-kazanir', play: 'oyna' },
};

export function href(locale: Locale, page: PageKey): string {
  const slug = SLUGS[locale][page];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function pageForSlug(locale: Locale, slug: string): PageKey | null {
  const entry = Object.entries(SLUGS[locale]).find(([, s]) => s === slug);
  return entry ? (entry[0] as PageKey) : null;
}

/** Every (locale, slug) pair for the sub-pages, used by generateStaticParams. */
export function allSubPageParams(): { locale: Locale; page: string }[] {
  return LOCALES.flatMap((locale) =>
    PAGES.filter((p) => p !== 'learn').map((p) => ({ locale, page: SLUGS[locale][p] })),
  );
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://holdem-coach.example.com';
