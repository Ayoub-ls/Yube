import type { Courier, DeliveryType, RateQuote } from './types';

// Swap this for Redis/DB in production — this in-memory version is fine for
// a single server instance and for demoing the flow. Rates rarely change,
// so a long TTL (e.g. 24h) is safe and keeps you well under dzship's limits.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
    value: RateQuote;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(
    courier: Courier,
    fromWilaya: number,
    toWilaya: number,
    deliveryType: DeliveryType,
): string {
    return `${courier}:${fromWilaya}:${toWilaya}:${deliveryType}`;
}

export function getCachedRate(
    courier: Courier,
    fromWilaya: number,
    toWilaya: number,
    deliveryType: DeliveryType,
): RateQuote | null {
    const entry = cache.get(cacheKey(courier, fromWilaya, toWilaya, deliveryType));
    if (!entry || entry.expiresAt < Date.now()) return null;
    return entry.value;
}

export function setCachedRate(
    courier: Courier,
    fromWilaya: number,
    toWilaya: number,
    deliveryType: DeliveryType,
    value: RateQuote,
): void {
    cache.set(cacheKey(courier, fromWilaya, toWilaya, deliveryType), {
        value,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });
}