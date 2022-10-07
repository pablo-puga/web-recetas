type Result<T, E> =
    | { readonly ok: true; readonly error: false; value: T }
    | { readonly ok: false; readonly error: true; value: E };

const Ok = <T>(value: T): Result<T, never> => ({
    ok: true,
    error: false,
    value,
});

const Err = <E>(value: E): Result<never, E> => ({
    ok: false,
    error: true,
    value,
});

export type { Result };

export { Ok, Err };
