const formatDateToHuman = (dateStr: string): string => {
    const date = new Date(dateStr);
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
    return dateFormat;
};

export { formatDateToHuman };
