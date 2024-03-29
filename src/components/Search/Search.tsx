import clsx from 'clsx';
import { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

import { SearchModal } from './SearchModal';

import { withStrictMode } from '@components/strict-mode';

interface Props {
    className?: string;
}

const Search = ({ className }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => {
        document.querySelector('body')?.classList.remove('search-opened');
        setIsOpen(false);
    };

    const open = () => {
        document.querySelector('body')?.classList.add('search-opened');
        setIsOpen(true);
    };

    return (
        <>
            <button
                id="search"
                className={clsx(
                    'inline-flex flex-row gap-2 items-center text-2xl font-bold px-2 py-1 border border-gray-200 rounded text-theme-grey-700 transition',
                    'sm:text-base sm:font-normal sm:w-44 sm:bg-white sm:shadow-inner',
                    'md:w-52',
                    'lg:w-64',
                    className,
                )}
                onClick={open}
            >
                <IoIosSearch />
                <span className="hidden sm:inline text-sm">Buscar</span>
            </button>
            {isOpen && <SearchModal close={close} />}
        </>
    );
};

export default withStrictMode(Search);
