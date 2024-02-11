import { defineCollection, z } from 'astro:content';

const recipesCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            categories: z.array(z.string()),
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
