import { useEffect, useState } from 'react';
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
        formState: { isLoading, errors },
        getValues,
        setFocus,
    } = useForm<SearchInputs>();

    return {
        register,
        handleSubmit,
        reset,
        isLoading,
        errors,
        focusQuery: () => setFocus('query'),
        getQuery: () => getValues('query'),
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

const useDebounce = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useSearch = () => {
    const [query, setQuery] = useState<string | null>(null);
    const debouncedQuery = useDebounce(query, 1000);
    const { data, isLoading, error } = useSWR(debouncedQuery, fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 0,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
    });

    if (error) {
        console.error(error);
    }

    const errorMsg = (() => {
        if (!error) return undefined;

        if (error instanceof Error) return error.message;
        else if (typeof error === 'string') return error;
        else if (typeof error === 'object' || typeof error === 'symbol') {
            return JSON.stringify(error);
        } else return `${error}`;
    })();

    return {
        setQuery,
        recipes: data?.recipes || undefined,
        loading: isLoading,
        error: errorMsg,
    };
};
