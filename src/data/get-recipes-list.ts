import {
    isFullPage,
    isNotionClientError,
    NotionClientError,
} from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { Category, Recipe } from '../types';
import { None, Option, Some } from '../utils/option';
import { Err, Ok, Result } from '../utils/result';

const PUBLISHED_PROPERTY_NAME = 'Publicada';
const CATEGORY_PROPERTY_NAME = 'Categorias';
const SLUG_PROPERTY_NAME = 'Slug';

const getPageTitle = (page: PageObjectResponse): Option<string> => {
    const nameProperty = page.properties['Name'];
    if (nameProperty.type === 'title') {
        if (nameProperty.title[0].type === 'text') {
            return Some(nameProperty.title[0].text.content);
        }
    }

    return None;
};

const getPageCategories = (page: PageObjectResponse): Category[] => {
    const categoryProperty = page.properties[CATEGORY_PROPERTY_NAME];
    const categories: Category[] = [];

    if (categoryProperty.type === 'multi_select') {
        categoryProperty.multi_select.forEach((option) => {
            categories.push({ ...option });
        });
    }

    return categories;
};

const getPageSlug = (page: PageObjectResponse): Option<string> => {
    const slugProperty = page.properties[SLUG_PROPERTY_NAME];
    if (slugProperty.type === 'rich_text') {
        if (slugProperty.rich_text[0].type === 'text') {
            return Some(slugProperty.rich_text[0].plain_text);
        }
    }

    return None;
};

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
