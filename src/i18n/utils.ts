import { ui, defaultLang, languages } from './ui';

export type Language = (typeof languages)[number];

export const routeMap = {
  home: { es: '/', ca: '/ca', en: '/en' },
  company: { es: '/empresa', ca: '/ca/empresa', en: '/en/company' },
  services: { es: '/servicios', ca: '/ca/serveis', en: '/en/services' },
  'services.portMaintenance': { es: '/servicios/mantenimiento-portuario', ca: '/ca/serveis/manteniment-portuari', en: '/en/services/port-maintenance' },
  'services.underwaterWorks': { es: '/servicios/trabajos-subacuaticos', ca: '/ca/serveis/treballs-subaquatics', en: '/en/services/underwater-works' },
  'services.maritimeEngineering': { es: '/servicios/ingenieria-maritima', ca: '/ca/serveis/enginyeria-maritima', en: '/en/services/maritime-engineering' },
  'services.coastalEngineering': { es: '/servicios/ingenieria-costera', ca: '/ca/serveis/enginyeria-costera', en: '/en/services/coastal-engineering' },
  'services.hydraulicInfrastructure': { es: '/servicios/actuaciones-hidraulicas', ca: '/ca/serveis/actuacions-hidrauliques', en: '/en/services/hydraulic-infrastructure' },
  'services.underwaterInspections': { es: '/servicios/inspecciones-subacuaticas', ca: '/ca/serveis/inspeccions-subaquatiques', en: '/en/services/underwater-inspections' },
  projects: { es: '/proyectos', ca: '/ca/projectes', en: '/en/projects' },
  projectDetail: { es: '/proyectos/[slug]', ca: '/ca/projectes/[slug]', en: '/en/projects/[slug]' },
  blog: { es: '/blog', ca: '/ca/blog', en: '/en/blog' },
  blogPost: { es: '/blog/[slug]', ca: '/ca/blog/[slug]', en: '/en/blog/[slug]' },
  certifications: { es: '/certificaciones', ca: '/ca/certificacions', en: '/en/certifications' },
  contact: { es: '/contacto', ca: '/ca/contacte', en: '/en/contact' },
  privacy: { es: '/privacidad', ca: '/ca/privadesa', en: '/en/privacy' },
  cookies: { es: '/cookies', ca: '/ca/cookies', en: '/en/cookies' },
  legal: { es: '/aviso-legal', ca: '/ca/aviso-legal-catala', en: '/en/legal-notice' },
} as const satisfies Record<string, Record<Language, string>>;

export type RouteId = keyof typeof routeMap;

export function getLocalizedPath(routeId: RouteId, lang: Language, params: Record<string, string> = {}): string {
  let path = routeMap[routeId][lang];
  for (const [key, value] of Object.entries(params)) path = path.replace(`[${key}]`, value);
  return path;
}

export function getRouteIdFromPath(path: string): { routeId: RouteId; params: Record<string, string> } | undefined {
  for (const [routeId, paths] of Object.entries(routeMap) as [RouteId, Record<Language, string>][]) {
    for (const routePath of Object.values(paths)) {
      const pattern = new RegExp(`^${routePath.replace(/\/\[slug\]/, '/([^/]+)').replace(/\//g, '\\/')}/?$`);
      const match = path.match(pattern);
      if (match) return { routeId, params: match[1] ? { slug: match[1] } : {} };
    }
  }
  return undefined;
}

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  return languages.includes(lang as Language) ? lang as Language : defaultLang;
}

export function useTranslatedPath(lang: Language) {
  return function translatePath(routeId: RouteId, params?: Record<string, string>): string {
    return getLocalizedPath(routeId, lang, params);
  };
}

export function getRouteFromUrl(url: URL): string { return url.pathname; }

export function t(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: unknown = ui[lang];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) value = (value as Record<string, unknown>)[k];
    else { value = undefined; break; }
  }
  if (typeof value === 'string') return value;
  if (lang !== defaultLang) {
    let fallback: unknown = ui[defaultLang];
    for (const k of keys) {
      if (fallback && typeof fallback === 'object' && k in fallback) fallback = (fallback as Record<string, unknown>)[k];
      else { fallback = undefined; break; }
    }
    if (typeof fallback === 'string') return fallback;
  }
  return key;
}
