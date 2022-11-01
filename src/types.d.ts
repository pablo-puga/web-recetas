import type { PageBlock } from './utils/page-blocks';

export interface Category {
    name: string;
    id: string;
    color: string;
}

export interface Recipe {
    id: string;
    createdAt: string;
    lastEditedAt: string;
    title: string;
    slug: string;
    categories: Category[];
}

export interface RecipeWithBody extends Recipe {
    body: PageBlock[];
}
