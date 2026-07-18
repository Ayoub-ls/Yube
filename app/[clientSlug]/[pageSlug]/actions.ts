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

export async function submitOrder(prevState: OrderState, formData: FormData): Promise<OrderState> {
  const pageId = formData.get('page_id') as string;
  const clientId = formData.get('client_id') as string;
  const name = (formData.get('name') as string || '').trim();
  const phoneRaw = (formData.get('phone') as string || '').trim();
  const city = formData.get('city') as string;
  const quantityRaw = formData.get('quantity') as string;
  const productName = formData.get('product_name') as string;
  const pageSlug = formData.get('page_slug') as string;
  // Optional: only themes with a size/variant selector (like the Chelqa
  // theme) will send this. Stored as-is (e.g. "10" or "8 + 10" for a
  // multi-size order) — orders.size already existed in the schema but
  // was never actually wired up to anything until now.
  const size = (formData.get('size') as string || '').trim() || null;

  if (!pageId || !clientId) {
    return { error: 'حدث خطأ، يرجى إعادة تحميل الصفحة' };
  }

  if (!name) {
    return { error: 'يرجى إدخال الاسم الكامل' };
  }

  // Algerian mobile number: 05/06/07 + 8 digits, or +213 equivalent.
  const cleanedPhone = phoneRaw.replace(/\s+/g, '');
  const isValidPhone =
    /^0[567][0-9]{8}$/.test(cleanedPhone) || /^\+213[567][0-9]{8}$/.test(cleanedPhone);

  if (!isValidPhone) {
    return { error: 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0555123456)' };
  }

  const quantity = Math.min(10, Math.max(1, parseInt(quantityRaw, 10) || 1));
  const wilaya = WILAYAS.find((w) => w.nameAr === city) || WILAYAS[15];

  const supabase = createClient();

  // Re-verify the page is still live and belongs to this client before
  // accepting an order — prevents orders being submitted against a page
  // that was rejected/unpublished after the visitor loaded it.
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
  });

  if (insertError) {
    console.error('Error creating order:', insertError);
    return { error: 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً' };
  }

  const totalPrice = page.price * quantity + wilaya.shippingFee;

  return {
    success: true,
    summary: { city, quantity, totalPrice },
  };
}
