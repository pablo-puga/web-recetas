import { defineCollection, z } from 'astro:content';

import { capitalize } from '@lib/transforms';

const recipesCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            categories: z
                .array(z.string())
                .transform((categories) => categories.map(capitalize)),
            keywords: z.array(z.string()).optional(),
            published: z.boolean(),
            description: z.string().optional(),
            cover: image().optional(),
            recipeYield: z
                .object({ portions: z.number(), units: z.string().optional() })
                .optional(),
            prepTime: z.number().optional(),
            cookTime: z.number().optional(),
            totalTime: z.number().optional(),
            createdAt: z.date(),
            updatedAt: z.date().optional(),
        }),
});

export const collections = {
    recipes: recipesCollection,
};
