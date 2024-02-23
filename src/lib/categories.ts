import type { CollectionEntry } from 'astro:content';

type CategoryWithCount = {
    name: string;
    count: number;
};

export const getCategoriesFromRecipes = (
    recipes: CollectionEntry<'recipes'>[],
): CategoryWithCount[] => {
    const categoriesMap: Record<string, number> = {};

    recipes.forEach((recipe) => {
        recipe.data.categories.forEach((c) => {
            if (categoriesMap[c]) categoriesMap[c]++;
            else categoriesMap[c] = 1;
        });
    });

    const categories: CategoryWithCount[] = [];

    Object.keys(categoriesMap).forEach((categoryName) =>
        categories.push({
            name: categoryName,
            count: categoriesMap[categoryName],
        }),
    );

    categories.sort((a, b) => a.name.localeCompare(b.name));

    return categories;
};
