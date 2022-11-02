import splitbee from '@splitbee/web';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { MdOutlineFoodBank } from 'react-icons/md';

import { Footer } from '../Footer';
import { Header } from '../Header';

import type { ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode | ReactNode[];
    className?: string;
    headerSize?: 'normal' | 'wide';
    showHomeLink?: boolean;
}

const PageLayout = ({
    title,
    children,
    className,
    headerSize = 'normal',
    showHomeLink = true,
}: Props) => {
    useEffect(() => {
        splitbee.init({
            scriptUrl: '/bee.js',
            apiUrl: '/_hive',
            disableCookie: true,
        });
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="robots" content="noarchive" />
            </Head>
            <Header title={title} size={headerSize} />
            <main
                className={clsx(
                    'w-full px-2 sm:px-3 md:px-4 lg:px-0 flex flex-col items-center lg:flex-row lg:justify-center lg:items-start',
                    className,
                )}
            >
                {showHomeLink && (
                    <nav className="fixed top-2 left-2 bg-theme-white/80 hover:bg-theme-orange/80 transition-colors duration-150 rounded-sm shadow-sm">
                        <Link
                            href="/"
                            className="flex flex-row items-center px-1 py-1"
                            title="Página de inicio"
                        >
                            <MdOutlineFoodBank className="text-2xl sm:text-3xl transition duration-150" />
                            <span className="px-2 hidden sm:block text-lg font-medium">
                                Inicio
                            </span>
                        </Link>
                    </nav>
                )}
                {children}
            </main>
            <Footer />
        </>
    );
};

export { PageLayout };
