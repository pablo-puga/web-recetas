import clsx from 'clsx';
import { useEffect, type ReactNode, useCallback } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { IoClose, IoInformationCircleOutline } from 'react-icons/io5';
import { MdErrorOutline } from 'react-icons/md';

import {
    useRecentResult,
    useSearch,
    useSearchForm,
    type Recipe,
} from './hooks';
import { Loader } from './Loader';
import { SearchResult } from './SearchResult';

interface Props {
    close: () => void;
}

export const SearchModal = ({ close }: Props) => {
    const { register, queryError, handleSubmit, reset, getQuery, focusQuery } =
        useSearchForm();
    const { setQuery, setDeferredQuery, loading, error, recipes } = useSearch();
    const { recentResults, addRecentResult } = useRecentResult();

    useEffect(() => {
        const keyPressHandler = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'Esc':
                case 'Escape':
                    event.preventDefault();
                    close();
                    break;
            }
        };

        document.addEventListener('keydown', keyPressHandler);

        return () => {
            document.removeEventListener('keydown', keyPressHandler);
        };
    }, [close]);

    useEffect(focusQuery, [focusQuery]);

    const handleQueryChange = useCallback(
        handleSubmit((data) => setDeferredQuery(data.query)),
        [handleSubmit, setDeferredQuery],
    );

    const clearInput = useCallback(() => {
        reset();
        setQuery(null);
    }, [reset, setQuery]);

    const resultOnClick = useCallback(
        (recipe: Recipe) => {
            addRecentResult(recipe);
        },
        [addRecentResult],
    );

    let body: ReactNode;
    if (queryError?.type === 'minLength') {
        body = (
            <span className="inline-block w-full text-center">
                Introduce al menos 3 letras para buscar más recetas
            </span>
        );
    } else if (loading) {
        body = (
            <div className="flex flex-col items-center mt-24 sm:gap-5 md:mt-0 md:gap-8 md:min-h-[300px] md:justify-center lg:gap-10 ">
                <Loader />
            </div>
        );
    } else if (error) {
        body = (
            <>
                <span className="w-full flex flex-row items-center justify-center gap-2">
                    <MdErrorOutline className="text-2xl text-theme-red-600" />
                    Ha habido un problema al hacer la búsqueda.
                </span>
                <details className="mt-4 text-sm">
                    <summary className="text-center cursor-pointer">
                        Ver detalles
                    </summary>
                    <p className="mt-2 text-base bg-white rounded p-3 shadow-sm">
                        {error}
                    </p>
                </details>
            </>
        );
    } else if (recipes && recipes.length === 0) {
        body = (
            <span className="w-full flex flex-row items-center justify-center gap-2">
                <IoInformationCircleOutline className="text-2xl text-theme-blue-500" />
                No se han encontrado resultados para la búsqueda
            </span>
        );
    } else if (recipes) {
        body = (
            <>
                <h2 className="text-theme-teal-700 text-sm font-semibold">
                    Resultados
                </h2>
                <ul
                    className="mt-2 flex flex-col gap-2 overflow-y-auto max-h-[80vh] md:max-h-[70vh]"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {recipes.map((recipe) => (
                        <li key={recipe.slug}>
                            <SearchResult
                                recipe={recipe}
                                onClick={resultOnClick}
                            />
                        </li>
                    ))}
                </ul>
            </>
        );
    } else {
        body = (
            <span className="inline-block w-full text-center">
                Por favor, introduce algún término de búsqueda
            </span>
        );
    }

    const showRecent =
        recentResults.length > 0 &&
        (!recipes || recipes.length === 0) &&
        !loading &&
        !error;

    return (
        <>
            <div
                className="bg-theme-grey-700/50 fixed z-40 top-0 left-0 h-[100vh] w-[100vw]"
                onClick={close}
                role="presentation"
            ></div>
            <article
                className={clsx(
                    'absolute z-[55] top-0 left-0 h-[100vh] w-[100vw] bg-theme-grey-200 p-3',
                    'md:w-[600px] md:h-auto md:mt-20 md:rounded md:shadow-md md:left-1/2 md:-translate-x-1/2 md:p-4',
                )}
            >
                <header className="flex flex-nowrap gap-3">
                    <form
                        className={clsx(
                            'flex items-center grow gap-2',
                            'bg-white border border-theme-teal-600 rounded px-3 py-2',
                        )}
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label htmlFor="query">
                            <IoIosSearch className="text-2xl text-theme-teal-600" />
                        </label>
                        <input
                            id="query"
                            type="text"
                            placeholder="Buscar recetas"
                            className="grow focus-visible:outline-none box-border w-[80%]"
                            aria-invalid={queryError ? 'true' : 'false'}
                            aria-autocomplete="both"
                            aria-haspopup="false"
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                            {...register('query', {
                                required: false,
                                minLength: 3,
                                onChange: handleQueryChange,
                            })}
                        />
                        {getQuery()?.length > 0 && (
                            <button onClick={clearInput}>
                                <IoClose className="text-lg text-theme-teal-600" />
                            </button>
                        )}
                    </form>
                    <button
                        onClick={close}
                        className="inline-block whitespace-nowrap select-none text-theme-teal-600 font-medium"
                    >
                        Cancelar
                    </button>
                </header>
                <section className="mt-6">{body}</section>
                {showRecent && (
                    <section className="mt-6 md:max-h-[70vh]">
                        <h2 className="text-theme-teal-700 text-sm font-semibold">
                            Recientes
                        </h2>
                        <ul className="mt-2 flex flex-col gap-2">
                            {recentResults.map(({ recipe }) => (
                                <li key={recipe.slug}>
                                    <SearchResult
                                        recipe={recipe}
                                        onClick={resultOnClick}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </article>
        </>
    );
};
