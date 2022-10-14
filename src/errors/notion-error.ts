import { isNotionClientError, NotionClientError } from '@notionhq/client';

interface NotionError extends Error {
    readonly type: 'NotionError';
    code: string;
    source: NotionClientError | Error;
}

class NotionError extends Error implements NotionError {
    readonly type = 'NotionError';
    code: string;
    source: NotionClientError | Error;

    constructor(error: NotionClientError | Error) {
        super(error.message);
        if (isNotionClientError(error)) {
            this.code = error.code;
        } else {
            this.code = 'Unknown';
        }
        this.source = error;
    }
}

export { NotionError };
