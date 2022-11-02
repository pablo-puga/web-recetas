import { useRouter } from 'next/router';

import { PageLayout } from '../../components/PageLayout';
import { RecipeDisplay } from '../../components/RecipeDisplay';
import { RecipeMetadata } from '../../components/RecipeMetadata/RecipeMetadata';
import { RecipeDisplaySkeleton } from '../../components/Skeleton';
import { getRecipe } from '../../data/get-recipe';
import { getRecipes } from '../../data/get-recipes-list';
import { getIntEnvVar } from '../../utils/env';
import { None, Some } from '../../utils/option';

import type { RecipeWithBody } from '../../types';
import type { Option } from '../../utils/option';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
    slug: string;
}

type Props =
    | {
          error: true;
      }
    | {
          error: false;
          recipe: RecipeWithBody;
      };

export const getStaticPaths: GetStaticPaths = async () => {
    const recipesSearch = await getRecipes(20);
    if (!recipesSearch.ok) {
        console.error(recipesSearch.value.source);
        return {
            paths: [],
            fallback: true,
        };
    }

    return {
        paths: recipesSearch.value.recipes.map((recipe) => ({
            params: { slug: recipe.slug },
        })),
        fallback: true,
    };
};

const getSlugFromParams = (params?: ParsedUrlQuery): Option<string> => {
    if (!params) return None;
    if (!params.slug) return None;
    if (Array.isArray(params.slug)) {
        if (params.slug.length === 0) return None;
        return Some(params.slug[0]);
    }
    return Some(params.slug);
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
    context,
) => {
    const slug = getSlugFromParams(context.params);
    if (!slug.has) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const recipeSearch = await getRecipe(slug.some);
    if (recipeSearch.error) {
        console.error(recipeSearch.value.source);
        return {
            revalidate: getIntEnvVar('REVALIDATE_ERROR_TTL', 3600),
            props: {
                error: true,
            },
        };
    }
    if (!recipeSearch.value.has) {
        return {
            revalidate: getIntEnvVar('REVALIDATE_NOTFOUND_TTL', 3600),
            notFound: true,
        };
    }

    return {
        revalidate: getIntEnvVar('REVALIDATE_TTL', 3600 * 6),
        props: {
            error: false,
            recipe: recipeSearch.value.some,
        },
    };
};

const RecipePage: NextPage<Props> = (props) => {
    const router = useRouter();

    if (props.error) {
        return <h1>Unexpected error</h1>;
    }

    const recipe = props.recipe;
    return (
        <PageLayout
            title={router.isFallback ? 'Cargando...' : recipe.title}
            className="lg:!flex-col lg:!justify-start lg:!items-center"
            headerSize="wide"
        >
            {router.isFallback && <RecipeDisplaySkeleton />}
            {!router.isFallback && (
                <>
                    <RecipeMetadata recipe={recipe} />
                    <RecipeDisplay recipe={recipe} />
                </>
            )}
        </PageLayout>
    );
};

export default RecipePage;
