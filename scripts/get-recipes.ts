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
        console.error('There was an error:');
        console.error(`  - Message: ${pages.value.message}`);
        console.error(`  - Code: ${pages.value.code}`);
    }
};

run();
