export const NOTIFICATIONS_SERVICE_CLIENT = 'NOTIFICATIONS_SERVICE_CLIENT';

export const MAIN_EXCHANGE = 'main.exchange';
export const RETRY_EXCHANGE = 'retry.exchange';
export const DLQ_EXCHANGE = 'dlq.exchange';

export const MAIN_QUEUE = 'notifications.queue';
export const RETRY_QUEUE = 'notifications.retry.queue';
export const DLQ_QUEUE = 'notifications.dlq';

export const RETRY_TTL_MS = 10_000; // базова затримка 10с
