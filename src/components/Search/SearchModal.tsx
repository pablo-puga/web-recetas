import clsx from 'clsx';
import { useEffect, type ReactNode } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

import { useSearch, useSearchForm } from './hooks';
import { Loader } from './Loader';
import { SearchResult } from './SearchResult';

interface Props {
    close: () => void;
}

export const SearchModal = ({ close }: Props) => {
    const { register, errors, handleSubmit, reset, getQuery } = useSearchForm();
    const { setQuery, loading, error, recipes } = useSearch();

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

        return () => document.removeEventListener('keydown', keyPressHandler);
    }, [close]);

    const handleQueryChange = handleSubmit((data) => {
        setQuery(data.query);
    });

    let body: ReactNode;
    if (errors.query?.type === 'minLength') {
        body = <span>Introduce al menos 3 letras para buscar más recetas</span>;
    } else if (loading) {
        body = (
            <div className="flex flex-col items-center mt-24 sm:gap-5 md:mt-0 md:gap-8 md:min-h-[300px] md:justify-center lg:gap-10 ">
                <Loader />
            </div>
        );
    } else if (error) {
        body = <span>Error: {error}</span>;
    } else if (recipes && recipes.length === 0) {
        body = <span>No se han encontrado resultados para la búsqueda</span>;
    } else if (recipes) {
        body = (
            <>
                <h1 className="text-theme-teal-700 text-sm font-semibold">
                    Resultados
                </h1>
                <ul className="mt-2 flex flex-col gap-2">
                    {recipes.map((recipe) => (
                        <li key={recipe.slug}>
                            <SearchResult recipe={recipe} />
                        </li>
                    ))}
                </ul>
            </>
        );
    } else {
        body = <span>Por favor, introduce algún término de búsqueda</span>;
    }

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
                            aria-invalid={errors.query ? 'true' : 'false'}
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
                            <button onClick={() => reset()}>
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
                <section className="mt-6 md:max-h-[70vh]">{body}</section>
            </article>
        </>
    );
};
