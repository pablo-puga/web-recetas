import { ImCalendar } from 'react-icons/im';

const PublishedDate = ({ createdAt }: { createdAt: string }) => {
    const date = new Date(createdAt);
    let dateFormat = `${date.getDay()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;
    if (Intl && Intl.DateTimeFormat) {
        dateFormat = new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    }
    return (
        <span className="flex flex-row text-gray-600 mt-1">
            <ImCalendar />
            <span className="text-sm ml-1">Publicado el {dateFormat}</span>
        </span>
    );
};

export { PublishedDate };
