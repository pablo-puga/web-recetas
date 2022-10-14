import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { getRecipe } from '../../data/get-recipe';
import { getRecipes } from '../../data/get-recipes-list';
import { RecipeWithBody } from '../../types';
import { None, Option, Some } from '../../utils/option';

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
        paths: recipesSearch.value.map((recipe) => ({
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
            revalidate: 3600,
            props: {
                error: true,
            },
        };
    }
    if (!recipeSearch.value.has) {
        return {
            revalidate: 3600,
            notFound: true,
        };
    }

    return {
        revalidate: 3600 * 6,
        props: {
            error: false,
            recipe: recipeSearch.value.some,
        },
    };
};

const RecipePage: NextPage<Props> = (props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (props.error) {
        return <h1>Unexpected error</h1>;
    }

    const recipe = props.recipe;
    return (
        <>
            <h1>{recipe.title}</h1>
            <pre>{JSON.stringify(recipe, null, 2)}</pre>
        </>
    );
};

export default RecipePage;
