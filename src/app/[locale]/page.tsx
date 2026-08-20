import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Shell from '@/components/Shell';
import LearnPage from '@/components/LearnPage';
import { getDict, isLocale } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/types';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const base = pageMetadata(locale, 'learn');
  // The locale index is the site root for that language, so it keeps the
  // untemplated site title rather than "page · site".
  return { ...base, title: { absolute: getDict(locale).pages.learn.title } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Shell locale={locale as Locale} page="learn">
      <LearnPage locale={locale as Locale} />
    </Shell>
  );
}
