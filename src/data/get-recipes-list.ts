import { isFullPage } from '@notionhq/client';
import {
    PageObjectResponse,
    PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { Recipe } from '../types';
import { Err, Ok, Result } from '../utils/result';
import {
    getPageCategories,
    getPageSlug,
    getPageTitle,
    SLUG_PROPERTY_NAME,
} from './notion/properties';

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

const getAllRecipes = async (): Promise<Result<Recipe[], NotionError>> =>
    getRecipes(100);

const getRecipes = async (
    pageSize = 10,
    nextCursor?: string,
): Promise<Result<Recipe[], NotionError>> => {
    try {
        const pages = await notionClient.databases.query({
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

        return Ok(parseRecipeList(pages.results));
    } catch (e) {
        if (e instanceof Error) return Err(new NotionError(e));
        return Err(new NotionError(new Error(JSON.stringify(e))));
    }
};

export { getAllRecipes, getRecipes };
