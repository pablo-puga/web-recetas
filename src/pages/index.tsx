import Head from 'next/head';

import type { GetStaticProps, NextPage } from 'next';
import { CategoryList } from '../components/CategoryList';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { RecipeList } from '../components/RecipeList';
import { getCategories } from '../data/get-categories';
import { getRecipes } from '../data/get-recipes-list';
import { Category, Recipe } from '../types';
import { PageLayout } from '../components/PageLayout';

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

    categoryListSearch.value.sort((a, b) => {
        if (a.name === b.name) return 0;
        return a.name < b.name ? -1 : 1;
    });

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
        <>
            <Head>
                <meta name="description" content="Las Recetas de Pablo" />
            </Head>
            <PageLayout title="Las Recetas de Pablo">
                <RecipeList recipeList={recipeList} />
                <CategoryList categoryList={categoryList} />
            </PageLayout>
        </>
    );
};

export default Home;
