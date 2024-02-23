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
