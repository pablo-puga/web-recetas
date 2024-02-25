import { getCollection } from 'astro:content';

import type { APIRoute } from 'astro';

const EXPECTED_X_APP = import.meta.env.SITE;
const MIN_SEARCH_LENGTH = 3;

const buildResponse = (status: number, data: object) =>
    new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });

const postSearchEvent = (request: Request, filter: string) => {
    const headers: HeadersInit = {
        'content-type': 'application/json',
    };
    if (request.headers.get('x-forwarded-for') !== null) {
        headers['x-forwarded-for'] = request.headers.get(
            'x-forwarded-for',
        ) as string;
    }
    if (request.headers.get('host') !== null) {
        headers['host'] = request.headers.get('host') as string;
    }
    if (request.headers.get('accept-language') !== null) {
        headers['accept-language'] = request.headers.get(
            'accept-language',
        ) as string;
    }
    if (request.headers.get('referer') !== null) {
        headers['referer'] = request.headers.get('referer') as string;
    }
    if (request.headers.get('user-agent') !== null) {
        headers['user-agent'] = request.headers.get('user-agent') as string;
    }

    const url = (() => {
        const referer = request.headers.get('referer');
        if (referer === null) return undefined;
        try {
            const u = new URL(referer);
            return u.pathname;
        } catch (e) {
            return undefined;
        }
    })();

    fetch(`${import.meta.env.APP_URL}/estadisticas/api/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            type: 'event',
            payload: {
                name: 'busqueda',
                website: import.meta.env.UMAMI_WEBSITE_ID,
                language: request.headers.get('accept-language') ?? undefined,
                hostname: request.headers.get('host') ?? undefined,
                referrer: request.headers.get('referer') ?? undefined,
                url,
                data: {
                    filtro: filter,
                },
            },
        }),
    }).catch((error) => {
        console.error('Error while posting search event to Umami', error);
    });
};

export const GET: APIRoute = async ({ request, url }) => {
    const xApp = request.headers.get('x-app');
    if (!xApp || xApp !== EXPECTED_X_APP) {
        return buildResponse(403, { error: 'Operación prohibida' });
    }

    const filter = url.searchParams.get('filtro')?.trim().toLocaleLowerCase();
    if (!filter || filter.length < MIN_SEARCH_LENGTH) {
        return buildResponse(400, { error: 'Información incorrecta' });
    }

    try {
        const filteredRecipes = await getCollection('recipes', ({ data }) => {
            if (import.meta.env.PROD && data.published === false) return false;
            if (data.title.toLocaleLowerCase().includes(filter)) return true;
            if (data.description?.toLocaleLowerCase().includes(filter))
                return true;

            const foundCategory = data.categories.find((c) =>
                c.toLocaleLowerCase().includes(filter),
            );

            return foundCategory !== undefined;
        });

        postSearchEvent(request, filter);

        filteredRecipes.sort(
            (a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime(),
        );

        return buildResponse(200, {
            recipes: filteredRecipes.map(({ slug, data }) => ({
                slug,
                title: data.title,
                description: data.description || data.title,
                cover: data.cover?.src,
                categories: data.categories,
            })),
        });
    } catch (e) {
        console.error(e);
        return buildResponse(500, { error: 'Error inesperado' });
    }
};
