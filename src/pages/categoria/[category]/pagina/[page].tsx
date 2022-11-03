import Head from 'next/head';
import { useRouter } from 'next/router';

import { CategoryList } from '../../../../components/CategoryList';
import { PageLayout } from '../../../../components/PageLayout';
import { PaginatedRecipeList } from '../../../../components/RecipeList/PaginatedRecipeList';
import { RecipeListSkeleton } from '../../../../components/Skeleton';
import { getCategories } from '../../../../data/get-categories';
import { getAllRecipesForCategory } from '../../../../data/get-recipes-list';
import { getIntEnvVar } from '../../../../utils/env';
import { None, Some } from '../../../../utils/option';
import { genPages } from '../../../../utils/pagination';

import type { Recipe, Category } from '../../../../types';
import type { Option } from '../../../../utils/option';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

const PAGE_SIZE = getIntEnvVar('PAGE_SIZE', 10);
const INITIAL_PAGINATION_ISG = 2;

interface Params extends ParsedUrlQuery {
    page: string;
    category: string;
}

type Path = { params: { category: string; page: string } };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStaticPaths: GetStaticPaths = async () => {
    const categoryListSearch = await getCategories();
    if (categoryListSearch.error) {
        throw categoryListSearch.value.source;
    }

    const paths: Path[] = [];

    for (const category of categoryListSearch.value) {
        const allRecipesForCategory = await getAllRecipesForCategory(
            category.name,
        );
        if (allRecipesForCategory.error) {
            throw allRecipesForCategory.value.source;
        }

        if (allRecipesForCategory.value.length < PAGE_SIZE) {
            continue;
        }

        const totalPages = Math.ceil(
            allRecipesForCategory.value.length / PAGE_SIZE,
        );
        const maxInitialPages =
            totalPages < INITIAL_PAGINATION_ISG
                ? totalPages
                : INITIAL_PAGINATION_ISG;

        genPages(maxInitialPages).forEach((pageNumber) =>
            paths.push({
                params: {
                    category: category.name.toLowerCase(),
                    page: `${pageNumber}`,
                },
            }),
        );
        process.env.NODE_ENV === 'production' && (await sleep(500));
    }

    return {
        paths,
        fallback: true,
    };
};

const getPageFromParams = (params?: ParsedUrlQuery): Option<number> => {
    if (!params) return None;
    if (!params.page) return None;
    if (Array.isArray(params.page)) {
        if (params.page.length === 0) return None;
        return Some(parseInt(params.page[0], 10));
    }
    return Some(parseInt(params.page, 10));
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

interface Props {
    categoryList: Category[];
    recipeList: Recipe[];
    totalRecipes: number;
    pageSize: number;
    currentCategory: string;
    currentPage: number;
}

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

    const currentPage = getPageFromParams(context.params);
    if (!currentPage.has) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (currentPage.some === 1) {
        return {
            redirect: {
                destination: `/categoria/${currentCategory.some}`,
                permanent: true,
            },
        };
    }

    const allRecipesSearch = await getAllRecipesForCategory(
        currentCategoryCapitalized,
    );
    if (allRecipesSearch.error) {
        throw allRecipesSearch.value.source;
    }

    const displayedRecipes = allRecipesSearch.value.slice(
        PAGE_SIZE * (currentPage.some - 1),
        PAGE_SIZE * currentPage.some,
    );

    if (displayedRecipes.length === 0) {
        return {
            revalidate: getIntEnvVar('REVALIDATE_NOTFOUND_TTL', 3600),
            redirect: {
                destination: `/categoria/${currentCategory.some}`,
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
            currentPage: currentPage.some,
        },
    };
};

const CategoryPage: NextPage<Props> = ({
    categoryList,
    recipeList,
    totalRecipes,
    pageSize,
    currentPage,
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
                            currentPage={currentPage}
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

export default CategoryPage;
