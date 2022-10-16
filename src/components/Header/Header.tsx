import Image from 'next/image';

import style from './Header.module.css';

const Header = ({ isTitle = true }) => (
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
            {isTitle && (
                <h1 className={style['header-title']}>Las Recetas de Pablo</h1>
            )}
            {!isTitle && (
                <span className={style['header-title']}>
                    Las Recetas de Pablo
                </span>
            )}
        </div>
    </header>
);

export { Header };
