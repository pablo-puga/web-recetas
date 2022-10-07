import type { NotionClientError } from '@notionhq/client';

interface NotionError extends Error {
    readonly type: 'NotionError';
    code: string;
    source: NotionClientError;
}

class NotionError extends Error implements NotionError {
    readonly type = 'NotionError';
    code: string;
    source: NotionClientError;

    constructor(error: NotionClientError) {
        super(error.message);
        this.code = error?.code || 'Unknown';
        this.source = error;
    }
}

export { NotionError };
