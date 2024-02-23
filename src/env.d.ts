// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly APP_URL: string;
    readonly PUBLIC_RECENT_RESULTS_LIFETIME: number;
    readonly PUBLIC_MAX_RECENT_RESULTS: number;
    readonly PUBLIC_SEARCH_DELAY: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
