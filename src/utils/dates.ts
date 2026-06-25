import type { Language } from '@/i18n/utils';

const localeMap: Record<Language, Intl.Locale['baseName'] | string> = {
  es: 'es-ES',
  ca: 'ca-ES',
  en: 'en-GB',
};

export function formatDate(date: Date, lang: Language): string {
  return new Intl.DateTimeFormat(localeMap[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

const wordsPerMinute: Record<Language, number> = {
  es: 239,
  ca: 239,
  en: 200,
};

const readingTimeLabels: Record<Language, string> = {
  es: 'min de lectura',
  ca: 'min de lectura',
  en: 'min read',
};

export function getReadingTime(content: string, lang: Language): string {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute[lang]));
  return `${minutes} ${readingTimeLabels[lang]}`;
}
