import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ideas' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { ideas };
