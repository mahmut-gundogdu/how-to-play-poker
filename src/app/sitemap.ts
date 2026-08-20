import type { MetadataRoute } from 'next';
import { LOCALES, type PageKey } from '@/i18n/types';
import { PAGES, SITE_URL, href } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    PAGES.map((page: PageKey) => ({
      url: `${SITE_URL}${href(locale, page)}`,
      changeFrequency: 'monthly' as const,
      priority: page === 'learn' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${href(l, page)}`])),
      },
    })),
  );
}
