import clsx from 'clsx';
import Link from 'next/link';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { MdOutlineReportGmailerrorred } from 'react-icons/md';

interface Props {
    message: string;
    level: 'warning' | 'critical';
}

const ErrorDisplay = ({ message, level }: Props) => {
    const Icon =
        level === 'warning'
            ? FaRegQuestionCircle
            : MdOutlineReportGmailerrorred;
    return (
        <article
            className={clsx(
                'z-50 w-full max-w-xl flex flex-row flex-wrap gap-3 md:gap-4 lg:gap-5',
                'px-3 py-2 sm:py-3 md:py-4 lg:py-5',
                '-mt-20 sm:-mt-16',
                'bg-gray-50 shadow shadow-theme-grey-light rounded-sm',
            )}
        >
            <div className="flex justify-center items-center w-1/5">
                <Icon
                    className={clsx(
                        'block',
                        'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
                        level === 'warning'
                            ? 'text-theme-orange'
                            : 'text-theme-red',
                    )}
                />
            </div>
            <h1 className="flex w-2/4 grow justify-center items-center font-medium text-xl sm:text-3xl md:text-4xl">
                {message}
            </h1>
            <p className="w-full text-sm sm:text-base md:text-lg lg:text-xl text-center">
                Vuelve a intentarlo de nuevo en unos minutos.
                <br />
                Mientras, puedes ver nuevas recetas en{' '}
                <Link
                    href="/"
                    className="hover:text-theme-red font-medium underline transition-colors duration-150"
                >
                    nuestra web
                </Link>
                .
            </p>
        </article>
    );
};

export { ErrorDisplay };
