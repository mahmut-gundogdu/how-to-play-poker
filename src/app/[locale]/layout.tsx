import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getDict, isLocale } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/types';
import { SITE_URL, href } from '@/lib/routes';
import '@/styles/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.pages.learn.title, template: `%s · ${t.site.name}` },
    description: t.site.description,
    applicationName: t.site.name,
    openGraph: { siteName: t.site.name, locale: locale === 'tr' ? 'tr_TR' : 'en_US', type: 'website' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t.site.name,
    description: t.site.description,
    inLanguage: t.htmlLang,
    url: `${SITE_URL}${href(locale as Locale, 'learn')}`,
  };

  return (
    <html lang={t.htmlLang}>
      <body>
        <a className="skip-link" href="#content">{t.common.skipToContent}</a>
        <div className="page">{children}</div>
        <script
          type="application/ld+json"
          // Static, build-time JSON built from our own dictionary.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
