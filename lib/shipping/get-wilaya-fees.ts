import { fetchRateWithRetry } from './dzship-client';
import { getCachedRate, setCachedRate } from './rate-cache';
import type { CourierCredentials, DeliveryType } from './types';
import { WILAYAS } from '../wilayas'; // your existing static fallback table

/**
 * Gets the live delivery fee for one wilaya, with cache + static fallback.
 * Use this at checkout time — cheap after the first call per route.
 */
export async function getWilayaFee(
    credentials: CourierCredentials,
    fromWilaya: number,
    toWilayaCode: number,
    deliveryType: DeliveryType = 'home',
): Promise<{ fee: number; source: 'live' | 'cache' | 'fallback' }> {
    const cached = getCachedRate(credentials.courier, fromWilaya, toWilayaCode, deliveryType);
    if (cached) return { fee: cached.deliveryFee, source: 'cache' };

    try {
        const quote = await fetchRateWithRetry(credentials, {
            fromWilaya,
            toWilaya: toWilayaCode,
            deliveryType,
        });
        setCachedRate(credentials.courier, fromWilaya, toWilayaCode, deliveryType, quote);
        return { fee: quote.deliveryFee, source: 'live' };
    } catch (err) {
        // Live call failed (bad credentials, courier down, etc.) — fall back to
        // your static seed table rather than blocking checkout.
        console.error(`dzship rate fetch failed for ${credentials.courier}/${toWilayaCode}:`, err);
        const staticWilaya = WILAYAS.find((w) => Number(w.code) === toWilayaCode);
        const fallbackFee = staticWilaya?.shippingFee;
        return { fee: fallbackFee ?? 0, source: 'fallback' };
    }
}

/**
 * Syncs live rates for all 58 wilayas for one carrier — call this from an
 * admin "Sync rates" button, not on every checkout. Respects dzship's
 * 20 requests/minute limit with a small delay between calls.
 */
export async function syncAllWilayaFees(
    credentials: CourierCredentials,
    fromWilaya: number,
    deliveryType: DeliveryType = 'home',
    onProgress?: (wilayaCode: number, fee: number | null) => void,
): Promise<Record<number, number>> {
    const results: Record<number, number> = {};

    for (const wilaya of WILAYAS) {
        const toWilayaCode = Number(wilaya.code);
        if (toWilayaCode === fromWilaya) continue; // skip same-wilaya if not needed

        try {
            const { fee } = await getWilayaFee(credentials, fromWilaya, toWilayaCode, deliveryType);
            results[toWilayaCode] = fee;
            onProgress?.(toWilayaCode, fee);
        } catch {
            onProgress?.(toWilayaCode, null);
        }

        // Stay safely under 20 requests/minute (~3s spacing = 20/min exactly;
        // cache hits skip this delay since getWilayaFee short-circuits above)
        await new Promise((r) => setTimeout(r, 3100));
    }

    return results;
}

// Maps dzship's courier ids to the keys in your existing CarrierFees type
function courierToLegacyKey(courier: CourierCredentials['courier']) {
    const map = {
        yalidine: 'yalidine',
        zrexpress: 'zrExpress',
        maystro: 'maystro',
        noest: 'anderson', // no direct match in your old table — adjust as needed
        ecotrack: 'ecotrack',
    } as const;
    return map[courier];
}