import en from './en';
import tr from './tr';
import { DEFAULT_LOCALE, LOCALES, type Dict, type Locale } from './types';

const DICTS: Record<Locale, Dict> = { en, tr };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDict(locale: string): Dict {
  return isLocale(locale) ? DICTS[locale] : DICTS[DEFAULT_LOCALE];
}

export { LOCALES, DEFAULT_LOCALE };
export type { Dict, Locale, PageKey } from './types';
