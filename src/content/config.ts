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
            prepTime: z.number().optional(),
            cookTime: z.number().optional(),
            totalTime: z.number().optional(),
            created_at: z.date(),
            updated_at: z.date().optional(),
        }),
});

export const collections = {
    recipes: recipesCollection,
};
