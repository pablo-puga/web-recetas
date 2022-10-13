import {
    isFullPage,
    isNotionClientError,
    NotionClientError,
} from '@notionhq/client';
import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { Recipe } from '../types';
import { Err, Ok, Result } from '../utils/result';
import {
    getPageCategories,
    getPageSlug,
    getPageTitle,
} from './notion/properties';

const PUBLISHED_PROPERTY_NAME = 'Publicada';

const getAllRecipes = async (): Promise<Result<Recipe[], NotionError>> => {
    try {
        const pages = await notionClient.databases.query({
            database_id: RECIPES_DATABASE_ID,
            filter: {
                property: PUBLISHED_PROPERTY_NAME,
                checkbox: {
                    equals: true,
                },
            },
            sorts: [
                {
                    timestamp: 'created_time',
                    direction: 'descending',
                },
            ],
        });

        const recipePages: Recipe[] = [];
        pages.results.forEach((page) => {
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

        return Ok(recipePages);
    } catch (e) {
        if (isNotionClientError(e)) return Err(new NotionError(e));
        return Err(
            new NotionError({
                message: e instanceof Error ? e.message : e,
            } as NotionClientError),
        );
    }
};

export { getAllRecipes };
