import type { ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode;
}

const MetadataItem = ({ title, children }: Props) => {
    return (
        <li className="mt-2">
            <span
                className="mr-2 font-medium inline-block"
                style={{ minWidth: '100px' }}
            >
                {title}:
            </span>
            <span>{children}</span>
        </li>
    );
};

export { MetadataItem };
