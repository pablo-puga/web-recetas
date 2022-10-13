import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Category } from '../../types';
import { None, Some, Option } from '../../utils/option';

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

export {
    CATEGORY_PROPERTY_NAME,
    SLUG_PROPERTY_NAME,
    getPageCategories,
    getPageSlug,
    getPageTitle,
};
