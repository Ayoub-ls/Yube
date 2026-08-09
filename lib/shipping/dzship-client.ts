import type { CourierCredentials, RateQueryOptions, RateQuote } from './types';

const DZSHIP_BASE_URL = 'https://freeship.dzbuild.com';

export class DzshipError extends Error {
    constructor(
        public code: string,
        message: string,
        public httpStatus: number,
    ) {
        super(message);
        this.name = 'DzshipError';
    }
}

/**
 * Calls dzship's /v1/rates endpoint for a single route.
 * Throws DzshipError on any non-2xx response.
 */
export async function fetchRate(
    credentials: CourierCredentials,
    query: RateQueryOptions,
): Promise<RateQuote> {
    const { courier, ...creds } = credentials;

    const res = await fetch(`${DZSHIP_BASE_URL}/v1/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            courier,
            credentials: creds,
            query,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new DzshipError(
            data?.error?.code ?? 'UNKNOWN_ERROR',
            data?.error?.message ?? `Request failed with status ${res.status}`,
            res.status,
        );
    }

    return data as RateQuote;
}

/**
 * Retries once on 429 (rate limited), honoring Retry-After if present.
 * dzship's limit is 20 rate quotes/minute/IP — this makes bulk syncs resilient
 * without you having to think about it at the call site.
 */
export async function fetchRateWithRetry(
    credentials: CourierCredentials,
    query: RateQueryOptions,
    retryAfterFallbackMs = 3000,
): Promise<RateQuote> {
    try {
        return await fetchRate(credentials, query);
    } catch (err) {
        if (err instanceof DzshipError && err.httpStatus === 429) {
            await new Promise((r) => setTimeout(r, retryAfterFallbackMs));
            return fetchRate(credentials, query);
        }
        throw err;
    }
}