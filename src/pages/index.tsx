import Head from 'next/head';

import { PageLayout } from '../components/PageLayout';
import { RecipeListSkeleton } from '../components/Skeleton';

import type { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {},
        redirect: {
            permantent: true,
            destination: '/pagina/1',
        },
    };
};

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <meta name="description" content="Las Recetas de Pablo" />
            </Head>
            <PageLayout title="Las Recetas de Pablo" showHomeLink={false}>
                <RecipeListSkeleton />
            </PageLayout>
        </>
    );
};

export default Home;
