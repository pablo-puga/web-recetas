import Link from 'next/link';
import { ReactNode } from 'react';
import { Category, Recipe } from '../../types';
import { CategoryBadge } from '../CategoryBadge';
import { PublishedDate } from './PublishedDate';

interface Props {
    recipe: Recipe;
}

const Title = ({ children }: { children: ReactNode }) => (
    <h1 className="font-medium text-lg md:text-xl">{children}</h1>
);

const CategoryList = ({ categories }: { categories: Category[] }) => (
    <ul className="flex flex-row flex-wrap mt-2 mb-1">
        {categories.map((category) => (
            <li key={category.id} className="ml-3 first:ml-0">
                <CategoryBadge category={category} />
            </li>
        ))}
    </ul>
);

const RecipeDisplay = ({ recipe }: Props) => (
    <article className="bg-gray-50 drop-shadow shadow-theme-grey-dark rounded-sm px-3 py-2">
        <Title>
            <Link href={`/receta/${recipe.slug}`}>
                <a className="transition-colors duration-150 hover:!text-theme-red visited:text-gray-500">
                    {recipe.title}
                </a>
            </Link>
        </Title>
        <PublishedDate createdAt={recipe.createdAt} />
        {recipe.categories.length > 0 && (
            <CategoryList categories={recipe.categories} />
        )}
    </article>
);

export { RecipeDisplay };
