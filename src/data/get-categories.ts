import { notionClient, RECIPES_DATABASE_ID } from '../clients/notion';
import { NotionError } from '../errors/notion-error';
import { Err, Ok } from '../utils/result';

import type { Category } from '../types';
import type { Result } from '../utils/result';

const getDatabaseInformation = () =>
    notionClient.databases.retrieve({
        database_id: RECIPES_DATABASE_ID,
    });

const getCategories = async (): Promise<Result<Category[], NotionError>> => {
    try {
        const databaseInformation = await getDatabaseInformation();
        const categories: Category[] = [];

        const categoriesInformation =
            databaseInformation.properties['Categorias'];
        if (categoriesInformation.type === 'multi_select') {
            categoriesInformation.multi_select.options.forEach((option) => {
                categories.push({ ...option });
            });
        }

        return Ok(categories);
    } catch (e) {
        if (e instanceof Error) return Err(new NotionError(e));
        return Err(new NotionError(new Error(JSON.stringify(e))));
    }
};

export { getCategories };
