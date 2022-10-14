import { getAllRecipes } from '../src/data/get-recipes-list';

const run = async () => {
    const pages = await getAllRecipes();

    if (pages.ok) {
        console.log('The list of recipes is:');
        pages.value.forEach((recipe) => {
            console.log(
                `  - ${recipe.title} (${recipe.slug}): ${recipe.categories
                    .map((category) => category.name)
                    .join(',')}`,
            );
        });
    } else {
        console.error(pages.value.source);
    }
};

run();
