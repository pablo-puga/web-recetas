import { isFullPage } from '@notionhq/client';

import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { Err, Ok } from '../utils/result';

import {
    CATEGORY_PROPERTY_NAME,
    getPageCategories,
    getPageSlug,
    getPageTitle,
    SLUG_PROPERTY_NAME,
} from './notion/properties';

import type { Recipe } from '../types';
import type { Result } from '../utils/result';
import type {
    PageObjectResponse,
    PartialPageObjectResponse,
    QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

const PUBLISHED_PROPERTY_NAME = 'Publicada';

const parseRecipeList = (
    results: Array<PageObjectResponse | PartialPageObjectResponse>,
): Recipe[] => {
    const recipePages: Recipe[] = [];
    results.forEach((page) => {
        if (isFullPage(page)) {
            const title = getPageTitle(page);
            const slug = getPageSlug(page);
            if (!title.has || !slug.has) return;

            recipePages.push({
                id: page.id,
                createdAt: page.created_time,
                lastEditedAt: page.last_edited_time,
                title: title.some,
                slug: slug.some,
                categories: getPageCategories(page),
            });
        }
    });
    return recipePages;
};

interface RecipesWithMetadata {
    recipes: Recipe[];
    nextCursor?: string;
}

const getRecipes = async (
    pageSize = 10,
    category?: string | undefined,
    nextCursor?: string | undefined,
): Promise<Result<RecipesWithMetadata, NotionError>> => {
    let pages: QueryDatabaseResponse;
    try {
        if (category) {
            pages = await notionClient.databases.query({
                database_id: RECIPES_DATABASE_ID,
                filter: {
                    and: [
                        {
                            property: PUBLISHED_PROPERTY_NAME,
                            checkbox: {
                                equals: true,
                            },
                        },
                        {
                            property: SLUG_PROPERTY_NAME,
                            rich_text: {
                                is_not_empty: true,
                            },
                        },
                        {
                            property: CATEGORY_PROPERTY_NAME,
                            multi_select: {
                                contains: category,
                            },
                        },
                    ],
                },
                sorts: [
                    {
                        timestamp: 'created_time',
                        direction: 'descending',
                    },
                ],
                page_size: pageSize,
                start_cursor: nextCursor,
            });
        } else {
            pages = await notionClient.databases.query({
                database_id: RECIPES_DATABASE_ID,
                filter: {
                    and: [
                        {
                            property: PUBLISHED_PROPERTY_NAME,
                            checkbox: {
                                equals: true,
                            },
                        },
                        {
                            property: SLUG_PROPERTY_NAME,
                            rich_text: {
                                is_not_empty: true,
                            },
                        },
                    ],
                },
                sorts: [
                    {
                        timestamp: 'created_time',
                        direction: 'descending',
                    },
                ],
                page_size: pageSize,
                start_cursor: nextCursor,
            });
        }

        return Ok({
            recipes: parseRecipeList(pages.results),
            nextCursor:
                pages.has_more && pages.next_cursor
                    ? pages.next_cursor
                    : undefined,
        });
    } catch (e) {
        if (e instanceof Error) return Err(new NotionError(e));
        return Err(new NotionError(new Error(JSON.stringify(e))));
    }
};

const getAllRecipes = async (): Promise<Result<Recipe[], NotionError>> => {
    let recipes: Recipe[] = [];
    let nextCursor: string | undefined = undefined;
    do {
        const recipeSearch = await getRecipes(100, undefined, nextCursor);
        if (!recipeSearch.ok) return recipeSearch;
        recipes = recipes.concat(recipeSearch.value.recipes);

        nextCursor = recipeSearch.value.nextCursor as string;
    } while (nextCursor !== undefined);

    return Ok(recipes);
};

const getAllRecipesForCategory = async (
    category: string,
): Promise<Result<Recipe[], NotionError>> => {
    let recipes: Recipe[] = [];
    let nextCursor: string | undefined = undefined;
    do {
        const recipeSearch = await getRecipes(100, category, nextCursor);
        if (!recipeSearch.ok) return recipeSearch;
        recipes = recipes.concat(recipeSearch.value.recipes);

        nextCursor = recipeSearch.value.nextCursor as string;
    } while (nextCursor !== undefined);

    return Ok(recipes);
};

export { getAllRecipes, getRecipes, getAllRecipesForCategory };
