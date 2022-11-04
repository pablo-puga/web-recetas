import Head from 'next/head';
import { useRouter } from 'next/router';

import { CategoryList } from '../../../components/CategoryList';
import { PageLayout } from '../../../components/PageLayout';
import { PaginatedRecipeList } from '../../../components/RecipeList/PaginatedRecipeList';
import { RecipeListSkeleton } from '../../../components/Skeleton';
import { getCategories } from '../../../data/get-categories';
import { getAllRecipesForCategory } from '../../../data/get-recipes-list';
import { Category } from '../../../types';
import { getIntEnvVar } from '../../../utils/env';
import { None, Some } from '../../../utils/option';

import type { Recipe } from '../../../types';
import type { Option } from '../../../utils/option';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

const PAGE_SIZE = getIntEnvVar('PAGE_SIZE', 10);

interface Params extends ParsedUrlQuery {
    category: string;
}

interface Props {
    categoryList: Category[];
    recipeList: Recipe[];
    totalRecipes: number;
    pageSize: number;
    currentCategory: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

const getCategoryFromParams = (params?: ParsedUrlQuery): Option<string> => {
    if (!params) return None;
    if (!params.category) return None;
    if (Array.isArray(params.category)) {
        if (params.category.length === 0) return None;
        return Some(params.category[0]);
    }
    return Some(params.category);
};

const capitalizeString = (str: string): string =>
    str
        .split(' ')
        .map((word) => {
            const letters = word.split('');
            letters[0] = letters[0].toUpperCase();
            return letters.join('');
        })
        .join(' ');

export const getStaticProps: GetStaticProps<Props, Params> = async (
    context,
) => {
    const currentCategory = getCategoryFromParams(context.params);
    if (!currentCategory.has) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    const currentCategoryCapitalized = capitalizeString(currentCategory.some);

    const allRecipesSearch = await getAllRecipesForCategory(
        currentCategoryCapitalized,
    );
    if (allRecipesSearch.error) {
        throw allRecipesSearch.value.source;
    }

    const displayedRecipes = allRecipesSearch.value.slice(0, PAGE_SIZE);

    if (displayedRecipes.length === 0) {
        return {
            revalidate: getIntEnvVar('REVALIDATE_NOTFOUND_TTL', 3600),
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
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
            recipeList: displayedRecipes,
            pageSize: PAGE_SIZE,
            totalRecipes: allRecipesSearch.value.length,
            currentCategory: currentCategoryCapitalized,
        },
    };
};

const Category: NextPage<Props> = ({
    categoryList,
    recipeList,
    totalRecipes,
    pageSize,
    currentCategory,
}) => {
    const router = useRouter();

    return (
        <>
            <PageLayout
                title={
                    router.isFallback
                        ? 'Cargando...'
                        : `Categoría: ${currentCategory}`
                }
            >
                {router.isFallback && <RecipeListSkeleton />}
                {!router.isFallback && (
                    <>
                        <PaginatedRecipeList
                            recipeList={recipeList}
                            totalRecipes={totalRecipes}
                            currentPage={1}
                            pageSize={pageSize}
                            baseUrl={`/categoria/${currentCategory.toLowerCase()}`}
                        />
                        <CategoryList categoryList={categoryList} />
                    </>
                )}
            </PageLayout>
            <Head>
                <meta
                    name="description"
                    content={`Las Recetas de Pablo. Recetas de la categoría '${currentCategory}'.`}
                />
                <meta name="robots" content="noindex, noarchive" />
            </Head>
        </>
    );
};

export default Category;
