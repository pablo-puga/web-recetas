import { ImCalendar } from 'react-icons/im';
import { formatDateToHuman } from '../../utils/date';

const PublishedDate = ({ createdAt }: { createdAt: string }) => {
    const dateFormat = formatDateToHuman(createdAt);
    return (
        <span className="flex flex-row text-gray-600 mt-1">
            <ImCalendar />
            <span className="text-sm ml-1">Publicada el {dateFormat}</span>
        </span>
    );
};

export { PublishedDate };
