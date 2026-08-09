'use server';

import { createClient } from '../../../lib/supabase/server';
import { WILAYAS } from '../../../lib/wilayas';

export interface OrderState {
  error?: string;
  success?: boolean;
  summary?: {
    city: string;
    quantity: number;
    totalPrice: number;
  };
}

export async function getShippingFeeAction(
  clientId: string,
  toWilayaName: string,
  deliveryType: 'home' | 'stopdesk'
): Promise<{ fee: number }> {
  let config: any = {};
  try {
    const supabase = createClient();
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .maybeSingle();

    config = client?.shipping_config || {};
    const courier = config.courier || 'custom';

    const wilaya = WILAYAS.find((w) => w.nameAr === toWilayaName) || WILAYAS[15];
    const toWilayaCode = Number(wilaya.code);

    if (courier === 'custom' || !courier) {
      const customFees = config.wilaya_fees?.[toWilayaCode];
      if (customFees) {
        const fee = deliveryType === 'home' ? Number(customFees.home) : Number(customFees.stopdesk);
        return { fee };
      }
      const homeFee = wilaya.shippingFee;
      const fee = deliveryType === 'home' ? homeFee : Math.max(300, homeFee - 200);
      return { fee };
    }

    if (courier === 'flat') {
      const homeFee = Number(config.home_fee) ?? 600;
      const stopdeskFee = Number(config.stopdesk_fee) ?? 400;
      return { fee: deliveryType === 'home' ? homeFee : stopdeskFee };
    }

    // Courier live rates
    const fromWilaya = Number(config.from_wilaya) || 16;
    let credentials: any = { courier };

    if (courier === 'yalidine') {
      credentials.apiId = config.yalidine_api_id || '';
      credentials.apiToken = config.yalidine_api_token || '';
    } else if (courier === 'zrexpress') {
      credentials.token = config.zrexpress_token || '';
      credentials.key = config.zrexpress_key || '';
    } else if (courier === 'maystro') {
      credentials.apiKey = config.maystro_api_key || '';
    } else if (courier === 'noest') {
      credentials.apiToken = config.noest_api_token || '';
      credentials.guid = config.noest_guid || '';
    } else if (courier === 'ecotrack') {
      credentials.token = config.ecotrack_token || '';
      credentials.baseUrl = config.ecotrack_base_url || '';
    }

    const { getWilayaFee } = await import('../../../lib/shipping/get-wilaya-fees');
    const result = await getWilayaFee(credentials, fromWilaya, toWilayaCode, deliveryType);
    return { fee: result.fee };
  } catch (error) {
    console.error('Error fetching shipping fee in action:', error);
    const wilaya = WILAYAS.find((w) => w.nameAr === toWilayaName) || WILAYAS[15];
    const toWilayaCode = Number(wilaya.code);
    const customFees = config.wilaya_fees?.[toWilayaCode];
    if (customFees) {
      return { fee: deliveryType === 'home' ? Number(customFees.home) : Number(customFees.stopdesk) };
    }
    return { fee: deliveryType === 'home' ? wilaya.shippingFee : Math.max(300, wilaya.shippingFee - 200) };
  }
}

export async function submitOrder(prevState: OrderState, formData: FormData): Promise<OrderState> {
  const pageId = formData.get('page_id') as string;
  const clientId = formData.get('client_id') as string;
  const name = (formData.get('name') as string || '').trim();
  const phoneRaw = (formData.get('phone') as string || '').trim();
  const city = formData.get('city') as string;
  const quantityRaw = formData.get('quantity') as string;
  const productName = formData.get('product_name') as string;
  const pageSlug = formData.get('page_slug') as string;
  const size = (formData.get('size') as string || '').trim() || null;
  const deliveryType = (formData.get('delivery_type') as string) || 'home';

  if (!pageId || !clientId) {
    return { error: 'حدث خطأ، يرجى إعادة تحميل الصفحة' };
  }

  if (!name) {
    return { error: 'يرجى إدخال الاسم الكامل' };
  }

  const cleanedPhone = phoneRaw.replace(/\s+/g, '');
  const isValidPhone =
    /^0[567][0-9]{8}$/.test(cleanedPhone) || /^\+213[567][0-9]{8}$/.test(cleanedPhone);

  if (!isValidPhone) {
    return { error: 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0555123456)' };
  }

  const quantity = Math.min(10, Math.max(1, parseInt(quantityRaw, 10) || 1));
  const wilaya = WILAYAS.find((w) => w.nameAr === city) || WILAYAS[15];

  const supabase = createClient();

  const { data: page } = await supabase
    .from('landing_pages')
    .select('id, price, status')
    .eq('id', pageId)
    .eq('client_id', clientId)
    .eq('status', 'live')
    .maybeSingle();

  if (!page) {
    return { error: 'هذه الصفحة لم تعد متوفرة حالياً' };
  }

  // Calculate secure shipping fee
  const { fee: shippingFee } = await getShippingFeeAction(clientId, city, deliveryType as any);

  const { error: insertError } = await supabase.from('orders').insert({
    landing_page_id: pageId,
    client_id: clientId,
    name,
    phone: cleanedPhone,
    city,
    size,
    quantity,
    product_name: productName,
    source: pageSlug,
    status: 'pending',
    delivery_type: deliveryType,
    shipping_fee: shippingFee,
  });

  if (insertError) {
    console.error('Error creating order:', insertError);
    return { error: 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً' };
  }

  const totalPrice = page.price * quantity + shippingFee;

  return {
    success: true,
    summary: { city, quantity, totalPrice },
  };
}
