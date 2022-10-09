export interface Category {
    name: string;
    id: string;
    color: string;
}

export interface RecipePage {
    id: string;
    createdAt: string;
    lastEditedAt: string;
    title: string;
    slug: string;
    categories: Category[];
}
