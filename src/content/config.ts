import { defineCollection, z } from 'astro:content';

const recipesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        categories: z.array(z.string()),
        published: z.boolean(),
        created_at: z.date(),
        updated_at: z.date().optional(),
    }),
});

export const collections = {
    recipes: recipesCollection,
};
