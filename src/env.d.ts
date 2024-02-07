// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly APP_URL: string;
    readonly RECIPES_PER_PAGE: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
