import { getAllPages } from '../src/data/get-pages';

const run = async () => {
    const pages = await getAllPages();

    if (pages.ok) {
        console.log('The list of recipes is:');
        pages.value.forEach((page) => {
            console.log(
                `  - ${page.title} (${page.slug}): ${page.categories
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
