import Link from 'next/link';

import { RecipeList } from './RecipeList';

import type { Recipe } from '../../types';

interface Props {
    recipeList: Recipe[];
    totalRecipes: number;
    currentPage: number;
    pageSize: number;
    baseUrl: string;
}

const PaginatedRecipeList = ({
    recipeList,
    totalRecipes,
    currentPage,
    pageSize,
    baseUrl,
}: Props) => {
    const maxPage = Math.ceil(totalRecipes / pageSize);
    const firstItem = (currentPage - 1) * pageSize + 1;
    const lastItem = currentPage * pageSize;
    return (
        <section className="w-full max-w-xl">
            <RecipeList recipeList={recipeList} />
            <nav className="flex flex-row flex-wrap items-center justify-center sm:justify-between gap-3 mt-6 px-2">
                {currentPage > 1 && (
                    <Link
                        href={`${baseUrl}/pagina/${currentPage - 1}`}
                        className="w-24 text-center bg-theme-orange hover:bg-theme-red font-medium px-3 py-1 rounded-sm transition-colors duration-150 order-2 sm:order-1"
                    >
                        Anterior
                    </Link>
                )}
                <span className="w-full order-1 text-center sm:w-auto sm:order-2">
                    Viendo {firstItem} -{' '}
                    {lastItem > totalRecipes ? totalRecipes : lastItem} de{' '}
                    {totalRecipes}
                </span>
                {currentPage < maxPage && (
                    <Link
                        href={`${baseUrl}/pagina/${currentPage + 1}`}
                        className="w-24 text-center bg-theme-orange hover:bg-theme-red font-medium px-3 py-1 rounded-sm transition-colors duration-150 order-3"
                    >
                        Siguiente
                    </Link>
                )}
            </nav>
        </section>
    );
};

export { PaginatedRecipeList };
