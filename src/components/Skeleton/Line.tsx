import clsx from 'clsx';

import style from './Skeleton.module.css';

interface Props {
    isLoaded?: boolean;
    width: string;
    height: string;
    minWidth?: string;
}

const Line = ({ isLoaded = false, minWidth, width, height }: Props) => (
    <div
        className={clsx(style.line, isLoaded && style['wave-line'])}
        style={{ width, height, minWidth }}
    ></div>
);

export { Line };
