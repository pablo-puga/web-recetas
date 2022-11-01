import clsx from 'clsx';
import Image from 'next/legacy/image';

import style from './Header.module.css';

interface Props {
    title: string;
    size?: 'normal' | 'wide';
}

const Header = ({ title, size = 'normal' }: Props) => (
    <header className={style.header}>
        <div className={style['header-img-container']}>
            <Image
                src="/img/cabecera-mediana.jpg"
                layout="responsive"
                alt="Cabecera de la web"
                width={1920}
                height={1080}
                priority={true}
                style={{ zIndex: -50 }}
                objectFit="cover"
                objectPosition="center"
            />
        </div>
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-0 flex flex-row justify-center">
            <h1
                className={clsx(
                    style['header-title'],
                    size === 'wide' && '!max-w-3xl',
                )}
            >
                {title}
            </h1>
        </div>
    </header>
);

export { Header };
