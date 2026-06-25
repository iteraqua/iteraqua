import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    description: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    category: z.enum([
      'port_maintenance',
      'underwater_works',
      'maritime_engineering',
      'coastal_engineering',
      'hydraulic_infrastructure',
      'underwater_inspections',
    ]),
    location: z.string(),
    year: z.number(),
    client: z.string().optional(),
    image: z.string(),
    gallery: z.array(z.string()).default([]),
    challenge: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    solution: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    results: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    description: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    category: z.enum([
      'maritime_engineering',
      'coastal_infrastructure',
      'underwater_inspections',
      'hydraulic_engineering',
      'port_maintenance',
      'marine_infrastructure',
    ]),
    author: z.string().default('Iteraqua'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    id: z.string(),
    slug: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    title: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    shortDescription: z.object({
      es: z.string(),
      ca: z.string(),
      en: z.string(),
    }),
    icon: z.string(),
    order: z.number(),
    heroImage: z.string().default('/images/services-default.jpg'),
    gallery: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

export const collections = { projects, blog, services };
