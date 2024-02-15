import { useEffect } from 'react';

interface Props {
    close: () => void;
}

export const SearchModal = ({ close }: Props) => {
    useEffect(() => {
        const keyPressHandler = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'Esc':
                case 'Escape':
                    event.preventDefault();
                    close();
                    break;
            }
        };

        document.addEventListener('keydown', keyPressHandler);

        return () => document.removeEventListener('keydown', keyPressHandler);
    }, [close]);

    return (
        <>
            <div
                className="bg-theme-grey-700/50 fixed z-40 top-0 left-0 h-[100vh] w-[100vw]"
                onClick={close}
                role="presentation"
            ></div>
        </>
    );
};
