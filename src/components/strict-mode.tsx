import { StrictMode, type ComponentType } from 'react';

export const withStrictMode = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentType<P> => {
    const displayName =
        WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const WithStrictMode = (props: P) => (
        <StrictMode>
            <WrappedComponent {...props} />
        </StrictMode>
    );

    WithStrictMode.displayName = `withStrictMode(${displayName})`;

    return WithStrictMode;
};
