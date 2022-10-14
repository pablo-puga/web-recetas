import '../../styles/globals.css';
import type { AppProps } from 'next/app';

const RecipesApplication = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default RecipesApplication;
