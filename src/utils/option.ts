type Option<T> =
    | { readonly has: true; some: T }
    | { readonly has: false; readonly none: true };

const Some = <T>(some: T): Option<T> => ({ has: true, some });

const None = ((): Option<never> => ({ has: false, none: true }))();

export type { Option };
export { Some, None };
