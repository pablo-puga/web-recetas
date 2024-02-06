import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
    return new Response(
        JSON.stringify({
            message: 'Got a GET!',
        }),
    );
};
