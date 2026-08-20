import crypto from 'crypto';

const REDOTPAY_SANDBOX_URL = 'https://acquirersandbox.rp-2023app.com';
const REDOTPAY_PROD_URL = 'https://acquirer.redotpay.com';

const REDOTPAY_SANDBOX_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuctrVK3eP8hpoJf7FMet
lcR77FYcj9HtrkySyGDRt5HHwdwgM8jK0kfE4ag/zI8goe8M0iJ2o7n3VCfTzn8O
yfU0bu6KzDti1WOJV9fv4XtSmhm9W4WKjIc8uDQViR7E8trzcrbKFVbKVGng1+z0
KobQBDtWhjUeXKktUq1lpiejTS+XjXej26ANPfwbqbY+/6kBB3sWbt9BLDI/WhPY
XnFV9oJWod9I/dYUgUUA/b/+bI1wlobNntBDxiNmX0kbqpGZbzO6l9wWFXZiFCD2
5QtBOZlMbn9noH4KW3DnKGc2nKNz/f2FEM9DJKn3P7NGFVy6O/Q5NzcbFs+DI6nT
ywIDAQAB
-----END PUBLIC KEY-----`;

const REDOTPAY_PROD_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgQEAzMn4r06M/cp2amkbCxIs
PSr030JoCFeymwjTZrBnI8kW4mtL6JtUPYpJTFgCB8ZQoV75lEmUw8gSLbN770Cc
5EOi1dF4ekmLQ7Ez0SFUbQgJa7Vg5wBdSKcbUmkKGviJt+iZRJ0tZsPpXMPqIo9Y
OWJagfPbDhEwT2t1ANP4ou98sCqLqELI80iYm8+W4B9IvBW4lc+H5BAPtXpYMtlZ
6stCnvHXd1EjvlTak25v5xJ8AInEeAy8/D2glunmz/VfPyoB5OHPgnYVU66HyeQc
O1ZY/jzB5d6I/zX4JENG1xrP8ThPZ9qMWtmputJ0XYKymiZgZP6vh0L+G6P/Z98v
lQIDAQAB
-----END PUBLIC KEY-----`;

export interface RedotPayGoods {
  goodsType: '01' | '02'; // '01' tangible, '02' virtual
  goodsCategory: string; // e.g. 'Z000'
  goodsCode: string;
  goodsName: string;
  goodsCount: number;
  goodsAmount: number;
  goodsCoin: string;
}

export interface RedotPayCreateOrderParams {
  outerOrderSn: string;
  outerUid: string;
  orderAmount: number;
  orderCurrency: string;
  env: 'WEB' | 'H5' | 'APP';
  orderDesc: string;
  goods: RedotPayGoods[];
  buyer: {
    email: string;
    country: string;
  };
  redirectUrl: string;
}

/**
 * Returns configuration properties for RedotPay
 */
export function getRedotPayConfig() {
  return {
    appKey: process.env.REDOTPAY_APP_KEY || 'MOCK_APP_KEY',
    privateKey: process.env.REDOTPAY_PRIVATE_KEY || '',
    keyVersion: process.env.REDOTPAY_KEY_VERSION || '1',
    environment: process.env.REDOTPAY_ENV || 'sandbox',
  };
}

/**
 * Generates RedotPay signature for outgoing API requests
 */
export function generateRequestSignature(
  httpMethod: string,
  httpUri: string,
  appKey: string,
  timestamp: number,
  requestBody: string,
  privateKeyPem: string
): string {
  if (!privateKeyPem) {
    console.warn('[RedotPay SDK] No private key provided, using dummy signature.');
    return 'DUMMY_SIGNATURE';
  }

  try {
    const stringToSign = `${httpMethod.toUpperCase()} ${httpUri}\n${appKey}.${timestamp}.${requestBody}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(stringToSign, 'utf8');
    return signer.sign(privateKeyPem, 'base64');
  } catch (error) {
    console.error('[RedotPay SDK] Error generating request signature:', error);
    throw error;
  }
}

/**
 * Verifies the incoming webhook signature
 */
export function verifyWebhookSignature(
  headers: { [key: string]: string | undefined },
  rawBody: string
): boolean {
  const { appKey, environment } = getRedotPayConfig();

  const timestamp = headers['x-r-ts'];
  const signature = headers['x-r-signature'];
  const keyVersion = headers['x-r-key-version'] || '1';

  if (!timestamp || !signature) {
    console.error('[RedotPay Webhook] Missing required signature headers.');
    return false;
  }

  // In sandbox, if we do not have a private key set, we might want to bypass signature verification
  // for easy local simulation testing.
  if (environment === 'sandbox' && !process.env.REDOTPAY_PRIVATE_KEY) {
    console.warn('[RedotPay Webhook] Sandbox mode and REDOTPAY_PRIVATE_KEY not set. Bypassing signature verification.');
    return true;
  }

  try {
    // Construct the verification string
    const stringToVerify = `${appKey}.${timestamp}.${rawBody}`;

    // Select the public key based on environment and keyVersion (RedotPay's public key)
    const publicKeyPem = environment === 'production' ? REDOTPAY_PROD_PUBLIC_KEY : REDOTPAY_SANDBOX_PUBLIC_KEY;
    const publicKey = crypto.createPublicKey(publicKeyPem);

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(stringToVerify, 'utf8');
    
    return verifier.verify(publicKey, Buffer.from(signature, 'base64'));
  } catch (error) {
    console.error('[RedotPay Webhook] Verification error:', error);
    return false;
  }
}

/**
 * Creates a prepayment order in RedotPay
 */
export async function createRedotPayOrder(params: RedotPayCreateOrderParams) {
  const { appKey, privateKey, keyVersion, environment } = getRedotPayConfig();
  const baseUrl = environment === 'production' ? REDOTPAY_PROD_URL : REDOTPAY_SANDBOX_URL;
  const path = '/openapi/v2/order/create';

  const timestamp = Date.now();
  const requestBody = JSON.stringify(params);

  const signature = generateRequestSignature(
    'POST',
    path,
    appKey,
    timestamp,
    requestBody,
    privateKey
  );

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-R-Ak': appKey,
    'X-R-Ts': timestamp.toString(),
    'X-R-Signature': signature,
  };

  if (keyVersion) {
    headers['X-R-Key-Version'] = keyVersion;
  }

  console.log(`[RedotPay SDK] Creating order: outerOrderSn=${params.outerOrderSn}, baseUrl=${baseUrl}`);

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: requestBody,
  });

  const responseData = await response.json();

  if (!response.ok || responseData.code !== 'SUCCESS') {
    throw new Error(
      `RedotPay API error: ${responseData.msg || responseData.message || response.statusText}`
    );
  }

  return responseData.data; // { orderSn, outerOrderSn, webUrl, h5Url, appUrl }
}
