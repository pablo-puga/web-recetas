import Head from 'next/head';

import { CategoryList } from '../components/CategoryList';
import { PageLayout } from '../components/PageLayout';
import { PaginatedRecipeList } from '../components/RecipeList/PaginatedRecipeList';
import { getCategories } from '../data/get-categories';
import { getAllRecipes } from '../data/get-recipes-list';
import { getIntEnvVar } from '../utils/env';

import type { Category, Recipe } from '../types';
import type { GetStaticProps, NextPage } from 'next';

interface Props {
    categoryList: Category[];
    recipeList: Recipe[];
    totalRecipes: number;
    pageSize: number;
}

const PAGE_SIZE = getIntEnvVar('PAGE_SIZE', 10);

export const getStaticProps: GetStaticProps = async () => {
    const initialRecipeListSearch = await getAllRecipes();
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
        revalidate: getIntEnvVar('REVALIDATE_TTL', 3600 * 6),
        props: {
            categoryList: categoryListSearch.value,
            recipeList: initialRecipeListSearch.value.slice(0, PAGE_SIZE),
            pageSize: PAGE_SIZE,
            totalRecipes: initialRecipeListSearch.value.length,
        },
    };
};

const Home: NextPage<Props> = ({
    categoryList,
    recipeList,
    totalRecipes,
    pageSize,
}) => {
    return (
        <>
            <Head>
                <meta name="description" content="Las Recetas de Pablo" />
            </Head>
            <PageLayout title="Las Recetas de Pablo" showHomeLink={false}>
                <PaginatedRecipeList
                    recipeList={recipeList}
                    totalRecipes={totalRecipes}
                    currentPage={1}
                    pageSize={pageSize}
                    baseUrl=""
                />
                <CategoryList categoryList={categoryList} />
            </PageLayout>
        </>
    );
};

export default Home;
