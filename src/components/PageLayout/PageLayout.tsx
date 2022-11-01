import splitbee from '@splitbee/web';
import clsx from 'clsx';
import Head from 'next/head';
import { useEffect } from 'react';

import { Footer } from '../Footer';
import { Header } from '../Header';

import type { ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode | ReactNode[];
    className?: string;
    headerSize?: 'normal' | 'wide';
}

const PageLayout = ({
    title,
    children,
    className,
    headerSize = 'normal',
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
                {children}
            </main>
            <Footer />
        </>
    );
};

export { PageLayout };
