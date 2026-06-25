import { getLocalizedPath, getRouteIdFromPath, type Language } from '@/i18n/utils';

export const SITE_URL = 'https://iteraqua.com';
export const SITE_NAME = 'Iteraqua';
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

const langLocales: Record<Language, string> = {
  es: 'es_ES',
  ca: 'ca_ES',
  en: 'en_GB',
};

const langRoutes: Record<Language, string> = {
  es: '',
  ca: '/ca',
  en: '/en',
};

export function generateCanonicalURL(path: string, lang: Language): string {
  const prefix = langRoutes[lang];
  return `${SITE_URL}${prefix}${path}`;
}

function getLocalizedUrls(path: string, lang: Language): Record<Language, string> {
  const localizedPath = `${langRoutes[lang]}${path}`.replace(/\/+$/, '');
  const route = getRouteIdFromPath(localizedPath || '/');

  if (!route) {
    return Object.fromEntries(
      (Object.entries(langRoutes) as [Language, string][]).map(([targetLang, prefix]) => [
        targetLang,
        `${SITE_URL}${prefix}${path}`,
      ])
    ) as Record<Language, string>;
  }

  return Object.fromEntries(
    (Object.keys(langRoutes) as Language[]).map((targetLang) => [
      targetLang,
      `${SITE_URL}${getLocalizedPath(route.routeId, targetLang, route.params)}`,
    ])
  ) as Record<Language, string>;
}

export function generateHreflangTags(path: string, lang: Language): { lang: string; url: string }[] {
  const localizedUrls = getLocalizedUrls(path, lang);

  return (Object.keys(langRoutes) as Language[]).map((targetLang) => ({
    lang: langLocales[targetLang],
    url: localizedUrls[targetLang],
  }));
}

export function generateXDefaultURL(path: string, lang: Language): string {
  return getLocalizedUrls(path, lang).es;
}

interface OpenGraphParams {
  title: string;
  description: string;
  image?: string;
  url: string;
  type: 'website' | 'article';
  locale?: Language;
}

export function generateOpenGraphTags(params: OpenGraphParams): Record<string, string> {
  const image = params.image ? `${SITE_URL}${params.image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const locale = params.locale ?? 'es';

  return {
    'og:title': params.title,
    'og:description': params.description,
    'og:image': image,
    'og:url': params.url,
    'og:type': params.type,
    'og:locale': langLocales[locale],
    'og:site_name': SITE_NAME,
  };
}

interface TwitterCardParams {
  title: string;
  description: string;
  image?: string;
}

export function generateTwitterCardTags(params: TwitterCardParams): Record<string, string> {
  const image = params.image ? `${SITE_URL}${params.image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': params.title,
    'twitter:description': params.description,
    'twitter:image': image,
  };
}

interface OrganizationParams {
  name?: string;
  url?: string;
  logo?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

export function generateOrganizationSchema(params: OrganizationParams = {}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: params.name ?? SITE_NAME,
    url: params.url ?? SITE_URL,
    logo: params.logo ? `${SITE_URL}${params.logo}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    telephone: params.telephone,
    email: params.email,
    address: params.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: params.address.streetAddress,
          addressLocality: params.address.addressLocality,
          addressRegion: params.address.addressRegion,
          postalCode: params.address.postalCode,
          addressCountry: params.address.addressCountry,
        }
      : undefined,
    sameAs: params.sameAs ?? [],
  };
}

interface LocalBusinessParams extends OrganizationParams {
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string;
  areaServed?: string;
}

export function generateLocalBusinessSchema(params: LocalBusinessParams = {}): object {
  const { geo, openingHours, areaServed, ...orgParams } = params;
  return {
    ...generateOrganizationSchema(orgParams),
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    geo: geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: geo.latitude,
          longitude: geo.longitude,
        }
      : undefined,
    openingHours,
    areaServed,
  };
}

interface ServiceParams {
  name: string;
  description: string;
  url?: string;
  areaServed?: string;
  provider?: string;
}

export function generateServiceSchema(params: ServiceParams): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    url: params.url ?? SITE_URL,
    areaServed: params.areaServed ?? 'Spain',
    provider: {
      '@type': 'Organization',
      name: params.provider ?? SITE_NAME,
      url: SITE_URL,
    },
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

interface ArticleParams {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogo?: string;
}

export function generateArticleSchema(params: ArticleParams): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: params.url,
    image: params.image ? `${SITE_URL}${params.image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: {
      '@type': 'Person',
      name: params.authorName ?? SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: params.publisherName ?? SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: params.publisherLogo
          ? `${SITE_URL}${params.publisherLogo}`
          : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      },
    },
  };
}

interface ProjectParams {
  name: string;
  description: string;
  url?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  client?: string;
  category?: string;
}

export function generateProjectSchema(params: ProjectParams): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: params.name,
    description: params.description,
    url: params.url ?? SITE_URL,
    location: params.location
      ? {
          '@type': 'Place',
          name: params.location,
        }
      : undefined,
    startDate: params.startDate,
    endDate: params.endDate,
    contractor: params.client
      ? {
          '@type': 'Organization',
          name: params.client,
        }
      : undefined,
    category: params.category,
  };
}
