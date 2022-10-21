import clsx from 'clsx';
import { Recipe } from '../../types';
import { formatDateToHuman } from '../../utils/date';
import { InlineCategoryList } from '../CategoryList';
import { MetadataItem } from './MetadataItem';

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
                <MetadataItem title="Publicada">
                    {formatDateToHuman(recipe.createdAt)}
                </MetadataItem>
                {recipe.createdAt !== recipe.lastEditedAt && (
                    <MetadataItem title="Actualizada">
                        {formatDateToHuman(recipe.lastEditedAt)}
                    </MetadataItem>
                )}
                {recipe.categories.length > 0 && (
                    <MetadataItem title="Categorías">
                        <InlineCategoryList categories={recipe.categories} />
                    </MetadataItem>
                )}
            </ul>
        </section>
    );
};

export { RecipeMetadata };
