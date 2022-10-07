import { getCategories } from '../src/data/get-categories';

const run = async () => {
    const categories = await getCategories();

    if (categories.ok) {
        console.log('The list of categories is:');
        categories.value.map((category) => console.log(`  - ${category.name}`));
    } else {
        console.error('There was an error:');
        console.error(`  - Message: ${categories.value.message}`);
        console.error(`  - Code: ${categories.value.code}`);
    }
};

run();
