import { FaGithub } from 'react-icons/fa';

const version = process.env.version;

const Footer = () => {
    return (
        <footer className="mt-8 mb-10 text-gray-600 text-center text-sm">
            <p>
                También puedes ver mi página web en{' '}
                <a
                    className="hover:text-theme-red underline transition-colors duration-150"
                    href="https://pablopugaperalta.com"
                    title="Mi página web"
                >
                    pablopugaperalta.com
                </a>
            </p>
            <p className="mt-1">
                Version {version} hecha por{' '}
                <a
                    href="https://github.com/pablo-puga"
                    className="hover:text-theme-red underline transition-colors duration-150"
                    title="Mi página de GitHub"
                >
                    <FaGithub className="inline-block align-text-top ml-1 mr-1" />
                    pablo-puga
                </a>
            </p>
        </footer>
    );
};

export { Footer };
