import Head from 'next/head';

import type { GetStaticProps, NextPage } from 'next';
import { getRecipes } from '../data/get-recipes-list';
import { Category, Recipe } from '../types';
import { getCategories } from '../data/get-categories';
import { Header } from '../components/Header';

interface Props {
    categoryList: Category[];
    recipeList: Recipe[];
}

export const getStaticProps: GetStaticProps = async () => {
    const initialRecipeListSearch = await getRecipes(10);
    if (initialRecipeListSearch.error) {
        throw initialRecipeListSearch.value.source;
    }

    const categoryListSearch = await getCategories();
    if (categoryListSearch.error) {
        throw categoryListSearch.value.source;
    }

    return {
        revalidate: 3600 * 6,
        props: {
            categoryList: categoryListSearch.value,
            recipeList: initialRecipeListSearch.value,
        },
    };
};

const Home: NextPage<Props> = ({ categoryList, recipeList }) => {
    return (
        <div>
            <Head>
                <title>Las Recetas de Pablo</title>
                <meta name="description" content="Las Recetas de Pablo" />
            </Head>

            <Header />

            <main className="w-full px-2 sm:px-3 md:px-4 lg:px-0 flex flex-row justify-center">
                <ul className="bg-gray-50 shadow rounded-sm -mt-16 z-50 w-full max-w-xl">
                    {recipeList.map((recipe) => (
                        <li key={recipe.id}>
                            <article>
                                <h1>{recipe.title}</h1>
                                {recipe.categories.length > 0 && (
                                    <ul>
                                        {recipe.categories.map((category) => (
                                            <li key={category.id}>
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </article>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default Home;
