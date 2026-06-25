import { ui, defaultLang, languages } from './ui';

export type Language = (typeof languages)[number];

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (languages.includes(lang as Language)) {
    return lang as Language;
  }
  return defaultLang;
}

export function useTranslatedPath(lang: Language) {
  return function translatePath(path: string): string {
    return lang === defaultLang ? path : `/${lang}${path}`;
  };
}

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  const [, possibleLang, ...rest] = pathname.split('/');

  if (languages.includes(possibleLang as Language)) {
    return '/' + rest.join('/');
  }

  return pathname;
}

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: unknown = ui[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
      break;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  if (lang !== defaultLang) {
    let fallback: unknown = ui[defaultLang];
    for (const k of keys) {
      if (fallback && typeof fallback === 'object' && k in fallback) {
        fallback = (fallback as Record<string, unknown>)[k];
      } else {
        fallback = undefined;
        break;
      }
    }
    if (typeof fallback === 'string') {
      return fallback;
    }
  }

  return key;
}
