import { defineCollection, z } from 'astro:content';

const recipesCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            categories: z.array(z.string()),
            published: z.boolean(),
            description: z.string().optional(),
            picture: image().optional(),
            created_at: z.date(),
            updated_at: z.date().optional(),
        }),
});

export const collections = {
    recipes: recipesCollection,
};
