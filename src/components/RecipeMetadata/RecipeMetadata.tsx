import clsx from 'clsx';
import { Category, Recipe } from '../../types';
import { formatDateToHuman } from '../../utils/date';
import { CategoryBadge } from '../CategoryBadge';

const CategoryList = ({ categories }: { categories: Category[] }) => (
    <ul className="inline-flex flex-row flex-wrap">
        {categories.map((category) => (
            <li key={category.id} className="ml-3 first:ml-0">
                <CategoryBadge category={category} />
            </li>
        ))}
    </ul>
);

interface Props {
    recipe: Recipe;
}

const RecipeMetadata = ({ recipe }: Props) => {
    return (
        <section
            className={clsx(
                '-mt-20 sm:-mt-16 mb-8',
                'w-full max-w-3xl lg:max-w-3xl',
                'z-50 px-3 pt-1 pb-3',
                'bg-gray-50 shadow shadow-theme-grey-light rounded-sm',
                'text-sm sm:text-base',
            )}
        >
            <h1
                className="font-medium mt-3 mb-2 tracking-wide"
                style={{ fontSize: '1.75rem', lineHeight: '2.2rem' }}
            >
                Información
            </h1>
            <ul>
                <li>
                    <span className="mr-2 font-medium">Publicada:</span>
                    <span>{formatDateToHuman(recipe.createdAt)}</span>
                </li>
                {recipe.createdAt !== recipe.lastEditedAt && (
                    <li className="mt-2">
                        <span className="mr-2 font-medium">Actualizada:</span>
                        <span>{formatDateToHuman(recipe.lastEditedAt)}</span>
                    </li>
                )}
                {recipe.categories.length > 0 && (
                    <li className="mt-2">
                        <span className="mr-2 font-medium">Categorías:</span>
                        <span>
                            <CategoryList categories={recipe.categories} />
                        </span>
                    </li>
                )}
            </ul>
        </section>
    );
};

export { RecipeMetadata };
