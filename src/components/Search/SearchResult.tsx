import clsx from 'clsx';

import { type Recipe } from './hooks';

interface Props {
    recipe: Recipe;
    onClick: (recipe: Recipe) => void;
}

export const SearchResult = ({ recipe, onClick }: Props) => {
    const { slug, title, description, categories, cover } = recipe;

    return (
        <a href={`/receta/${slug}`} onClick={() => onClick(recipe)}>
            <article
                className={clsx(
                    'bg-white hover:bg-theme-teal-200 shadow-sm rounded flex flex-row p-2 max-h-[125px]',
                    'sm:gap-2 sm:p-3',
                    cover && 'sm:max-h-[138px] sm:gap-4',
                )}
            >
                {cover && (
                    <div className="hidden sm:block max-w-[150px] h-full w-auto">
                        <img
                            src={cover}
                            alt={`Foto de la receta de '${title}'`}
                        />
                    </div>
                )}
                <div className="grow flex flex-col gap-1 max-w-full overflow-hidden">
                    <h2 className="text-lg font-medium overflow-hidden text-ellipsis whitespace-nowrap sm:font-semibold sm:overflow-visible sm:whitespace-normal">
                        {title}
                    </h2>
                    <p
                        className={clsx(
                            'text-sm max-h-[60px] text-ellipsis line-clamp-2',
                            cover && 'sm:max-h-[75px]',
                        )}
                    >
                        {description}
                    </p>
                    <ul className="flex flex-row gap-2 text-xs grow items-end mt-2">
                        {categories.map((c) => (
                            <li
                                key={c}
                                className="p-1 bg-theme-teal-100 font-medium rounded"
                            >
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        </a>
    );
};
