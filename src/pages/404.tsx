import Head from 'next/head';

import { ErrorDisplay } from '../components/ErrorDisplay';
import { PageLayout } from '../components/PageLayout';

const Error404 = () => {
    return (
        <>
            <Head>
                <meta name="description" content="Las Recetas de Pablo" />
            </Head>
            <PageLayout title="Las Recetas de Pablo">
                <ErrorDisplay
                    message="Ups! No hemos podido encontrar lo que buscas."
                    level="warning"
                />
            </PageLayout>
        </>
    );
};

export default Error404;
