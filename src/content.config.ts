import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.coerce.date(),
		updated: z.coerce.date().optional(),
		readingTime: z.string(),
		tags: z.array(z.string()).default([])
	})
});

export const collections = { articles };
