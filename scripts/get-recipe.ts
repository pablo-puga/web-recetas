import { getRecipe } from '../src/data/get-recipe';

const run = async (slug: string) => {
    const recipeSearch = await getRecipe(slug);

    if (recipeSearch.ok) {
        if (recipeSearch.value.has) {
            const recipe = recipeSearch.value.some;
            console.log(recipe);
        } else {
            console.error(`Recipe with slug '${slug}' does not exist`);
        }
    } else {
        console.error('There was an error:');
        console.error(`  - Message: ${recipeSearch.value.message}`);
        console.error(`  - Code: ${recipeSearch.value.code}`);
    }
};

const { 2: slug } = process.argv;
if (!slug) {
    console.error('The slug must be specified');
    process.exit(1);
}
run(slug);
