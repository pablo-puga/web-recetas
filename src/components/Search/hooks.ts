import { parseJSON } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { type Fetcher } from 'swr';

type SearchInputs = {
    query: string;
};

export const useSearchForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        getValues,
        setFocus,
    } = useForm<SearchInputs>();

    const focusQuery = useCallback(() => setFocus('query'), [setFocus]);
    const getQuery = useCallback(() => getValues('query'), [getValues]);
    const queryError = useMemo(() => errors.query, [errors]);

    return {
        register,
        handleSubmit,
        reset,
        queryError,
        focusQuery,
        getQuery,
    };
};

export type Recipe = {
    slug: string;
    title: string;
    description: string;
    categories: string[];
    cover?: string;
};

const fetcher: Fetcher<{ recipes: Recipe[] }, string> = async (
    query: string,
) => {
    const res = await fetch(`/a/buscar?filtro=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'X-APP': `${window.location.protocol}//${window.location.host}`,
        },
    });

    if (!res.ok) {
        let msg = 'Error inesperado';
        try {
            const response = await res.json();
            if (response?.error) msg = response.error;
        } catch (e) {
            console.error(e);
        }

        throw new Error(msg);
    }

    return res.json();
};

const useTimeoutCallback = () => {
    const timeoutIdRef = useRef<NodeJS.Timeout | null>();

    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
        };
    }, []);

    const update = useCallback((cb: () => void, delay: number) => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }

        timeoutIdRef.current = setTimeout(cb, delay);
    }, []);

    return update;
};

export const useSearch = () => {
    const [query, setQuery] = useState<string | null>(null);
    const updateTimeout = useTimeoutCallback();
    const { data, isLoading, error } = useSWR(query, fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 0,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
    });

    const errorMsg = useMemo(() => {
        if (!error) return undefined;

        console.error(error);
        if (error instanceof Error) return error.message;
        else if (typeof error === 'string') return error;
        else if (typeof error === 'object' || typeof error === 'symbol') {
            return JSON.stringify(error);
        } else return `${error}`;
    }, error);

    const setDeferredQuery = useCallback(
        (newQuery: string) => {
            updateTimeout(
                () => setQuery(newQuery),
                import.meta.env.PUBLIC_SEARCH_DELAY,
            );
        },
        [setQuery, updateTimeout],
    );

    return {
        setQuery,
        setDeferredQuery,
        recipes: data?.recipes || undefined,
        loading: isLoading,
        error: errorMsg,
    };
};

type RecentSearchResult = {
    recipe: Recipe;
    searchDate: Date;
};

const RESULT_LIFETIME_MS =
    (import.meta.env.PUBLIC_RECENT_RESULTS_LIFETIME || 604800) * 1000;
const MAX_RECENT_RESULTS = import.meta.env.PUBLIC_MAX_RECENT_RESULTS || 3;

export const useRecentResult = () => {
    const [results, setResults] = useState<RecentSearchResult[]>([]);

    const updateResults = (results: RecentSearchResult[]) => {
        if (window.localStorage) {
            window.localStorage.setItem(
                'recent-results',
                JSON.stringify(results),
            );
        }
        setResults(results);
    };

    useEffect(() => {
        if (window.localStorage) {
            const stored = window.localStorage.getItem('recent-results');
            if (stored) {
                try {
                    const now = new Date();
                    const storedResults = (
                        JSON.parse(stored) as RecentSearchResult[]
                    )
                        .map((r) => {
                            const newResult = r;
                            newResult.searchDate = parseJSON(
                                newResult.searchDate as unknown as string,
                            );
                            return newResult;
                        })
                        .filter(
                            (r) =>
                                r.searchDate.getTime() - now.getTime() <=
                                RESULT_LIFETIME_MS,
                        );
                    updateResults(storedResults);
                } catch (e) {
                    console.error('Unable to parse stored recent results', e);
                }
            }
        }
    }, []);

    const addRecent = useCallback(
        (recipe: Recipe) => {
            const oldEntry = results.find((r) => r.recipe.slug === recipe.slug);
            let newResults: RecentSearchResult[];
            if (oldEntry) {
                oldEntry.searchDate = new Date();
                newResults = [
                    oldEntry,
                    ...results.filter((r) => r.recipe.slug !== recipe.slug),
                ];
            } else {
                newResults = [
                    { recipe, searchDate: new Date() },
                    ...results.slice(0, MAX_RECENT_RESULTS - 1),
                ];
            }
            updateResults(newResults);
        },
        [results],
    );

    return {
        recentResults: results,
        addRecentResult: addRecent,
    };
};
