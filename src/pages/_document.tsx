import { Head, Html, Main, NextScript } from 'next/document';

import { getStringEnvVar } from '../utils/env';

const BASE_URL = getStringEnvVar('BASE_URL', 'http://localhost:3000');

const Document = () => {
    return (
        <Html lang="en-US" className="theme-dark">
            <Head>
                <meta
                    property="og:image"
                    content={`${BASE_URL}/img/icon/icon512x512.png`}
                />
                <link
                    rel="icon"
                    href={`${BASE_URL}/img/icon/favicon.ico`}
                    type="image/x-icon"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
