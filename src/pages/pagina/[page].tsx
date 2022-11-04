import Head from 'next/head';
import { useRouter } from 'next/router';

import { CategoryList } from '../../components/CategoryList';
import { PageLayout } from '../../components/PageLayout';
import { PaginatedRecipeList } from '../../components/RecipeList/PaginatedRecipeList';
import { RecipeListSkeleton } from '../../components/Skeleton';
import { getCategories } from '../../data/get-categories';
import { getAllRecipes } from '../../data/get-recipes-list';
import { getIntEnvVar } from '../../utils/env';
import { None, Some } from '../../utils/option';

import type { Category, Recipe } from '../../types';
import type { Option } from '../../utils/option';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
    page: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
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

interface Props {
    categoryList: Category[];
    recipeList: Recipe[];
    totalRecipes: number;
    pageSize: number;
    currentPage: number;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
    context,
) => {
    const currentPage = getPageFromParams(context.params);
    if (!currentPage.has) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    // if (currentPage.some === 1) {
    //     return {
    //         redirect: {
    //             destination: '/',
    //             permanent: true,
    //         },
    //     };
    // }

    const PAGE_SIZE = getIntEnvVar('PAGE_SIZE', 10);
    const REVALIDATE_NOTFOUND_TTL = getIntEnvVar(
        'REVALIDATE_NOTFOUND_TTL',
        3600,
    );
    const REVALIDATE_TTL = getIntEnvVar('REVALIDATE_TTL', 3600 * 6);

    const allRecipesSearch = await getAllRecipes();
    if (allRecipesSearch.error) {
        throw allRecipesSearch.value.source;
    }

    const displayedRecipes = allRecipesSearch.value.slice(
        PAGE_SIZE * (currentPage.some - 1),
        PAGE_SIZE * currentPage.some,
    );

    if (displayedRecipes.length === 0) {
        return {
            revalidate: REVALIDATE_NOTFOUND_TTL,
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
        revalidate: REVALIDATE_TTL,
        props: {
            categoryList: categoryListSearch.value,
            recipeList: displayedRecipes,
            pageSize: PAGE_SIZE,
            totalRecipes: allRecipesSearch.value.length,
            currentPage: currentPage.some,
        },
    };
};

const Page: NextPage<Props> = ({
    categoryList,
    recipeList,
    totalRecipes,
    pageSize,
    currentPage,
}) => {
    const router = useRouter();

    return (
        <>
            <PageLayout title="Las Recetas de Pablo">
                {router.isFallback && <RecipeListSkeleton />}
                {!router.isFallback && (
                    <>
                        <PaginatedRecipeList
                            recipeList={recipeList}
                            totalRecipes={totalRecipes}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            baseUrl=""
                        />
                        <CategoryList categoryList={categoryList} />
                    </>
                )}
            </PageLayout>
            <Head>
                <meta name="description" content="Las Recetas de Pablo" />
                <meta name="robots" content="noindex, noarchive" />
            </Head>
        </>
    );
};

export default Page;
