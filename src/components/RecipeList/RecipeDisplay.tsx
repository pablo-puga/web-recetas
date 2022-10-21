import Link from 'next/link';
import { ReactNode } from 'react';
import { Recipe } from '../../types';
import { InlineCategoryList } from '../CategoryList';
import { PublishedDate } from './PublishedDate';

interface Props {
    recipe: Recipe;
}

const Title = ({ children }: { children: ReactNode }) => (
    <h1 className="font-medium text-lg md:text-xl">{children}</h1>
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
            <InlineCategoryList categories={recipe.categories} />
        )}
    </article>
);

export { RecipeDisplay };
