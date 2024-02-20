// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly APP_URL: string;
    readonly RECIPES_PER_PAGE: number;
    readonly PUBLIC_RECENT_RESULTS_LIFETIME: number;
    readonly PUBLIC_MAX_RECENT_RESULTS: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
