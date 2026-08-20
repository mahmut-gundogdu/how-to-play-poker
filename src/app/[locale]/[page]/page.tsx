import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Shell from '@/components/Shell';
import DrillBoard from '@/components/Drill';
import ShowdownQuiz from '@/components/Showdown';
import PlayTable from '@/components/PlayTable';
import { getDict, isLocale } from '@/i18n';
import type { Locale } from '@/i18n/types';
import { allSubPageParams, pageForSlug } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return allSubPageParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale, page } = await params;
  if (!isLocale(locale)) return {};
  const key = pageForSlug(locale, page);
  return key ? pageMetadata(locale, key) : {};
}

export default async function SubPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  if (!isLocale(locale)) notFound();
  const key = pageForSlug(locale as Locale, page);
  if (!key || key === 'learn') notFound();

  const t = getDict(locale);

  return (
    <Shell locale={locale as Locale} page={key}>
      {key === 'drill' && <DrillBoard locale={locale as Locale} />}
      {key === 'showdown' && <ShowdownQuiz locale={locale as Locale} />}
      {key === 'play' && (
        <>
          {/* Static heading and intro so the play page has real content for crawlers. */}
          <header style={{ marginBottom: 24 }}>
            <p className="eyebrow">{t.nav.play}</p>
            <h1 className="h2">{t.pages.play.heading}</h1>
            <p className="lede" style={{ marginBottom: 0 }}>{t.pages.play.description}</p>
          </header>
          <PlayTable locale={locale as Locale} />
        </>
      )}
    </Shell>
  );
}
