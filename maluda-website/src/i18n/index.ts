import ru from '../../public/locales/ru.json';
import en from '../../public/locales/en.json';

export const defaultLocale = 'ru' as const;
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];

const translations: Record<Locale, Record<string, string>> = { ru, en };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'ru' || value === 'en';
}

export function t(key: string, locale: Locale = defaultLocale): string {
  return translations[locale]?.[key] || translations[defaultLocale]?.[key] || key;
}
