export type Courier = 'yalidine' | 'zrexpress' | 'maystro' | 'noest' | 'ecotrack';

export type DeliveryType = 'home' | 'stopdesk';

// Each courier needs different credential shapes — this keeps that type-safe.
export type CourierCredentials =
    | { courier: 'yalidine'; apiId: string; apiToken: string }
    | { courier: 'zrexpress'; token: string; key: string }
    | { courier: 'maystro'; apiKey: string }
    | { courier: 'noest'; apiToken: string; guid: string }
    | { courier: 'ecotrack'; token: string; baseUrl: string };

export interface RateQuote {
    deliveryFee: number;
    returnFee: number;
    total: number;
    currency: string;
}

export interface RateQueryOptions {
    fromWilaya: number;
    toWilaya: number;
    deliveryType: DeliveryType;
    toCommune?: string;
}