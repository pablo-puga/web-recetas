import Head from 'next/head';
import { ReactNode } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';

interface Props {
    title: string;
    children: ReactNode | ReactNode[];
}

const PageLayout = ({ title, children }: Props) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Header title={title} />
            <main className="w-full px-2 sm:px-3 md:px-4 lg:px-0 flex flex-col items-center lg:flex-row lg:justify-center lg:items-start">
                {children}
            </main>
            <Footer />
        </>
    );
};

export { PageLayout };
