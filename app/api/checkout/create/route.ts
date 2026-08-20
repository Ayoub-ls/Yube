import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { generateUniqueClientSlug } from '../../../../lib/data';
import { createRedotPayOrder, RedotPayCreateOrderParams } from '../../../../lib/redotpay';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح به. يرجى تسجيل الدخول.' }, { status: 401 });
    }

    // 2. Fetch client store profile
    let { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('id, email, business_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (clientErr) {
      console.error('[Checkout API] Error loading client profile:', clientErr);
      return NextResponse.json({ error: 'حدث خطأ أثناء تحميل بيانات المتجر.' }, { status: 500 });
    }

    // Auto-create client profile if missing (self-healing database fallback)
    if (!client) {
      const adminSupabase = createAdminClient();
      const rawPhone = user.email ? user.email.split('@')[0] : 'user';
      const businessName = `متجر ${rawPhone}`;
      const slug = await generateUniqueClientSlug(adminSupabase as any, businessName);

      const { data: newClient, error: insertErr } = await adminSupabase
        .from('clients')
        .insert({
          user_id: user.id,
          email: user.email,
          business_name: businessName,
          slug,
          whatsapp: rawPhone.startsWith('213') ? rawPhone : null,
          plan: 'pending_payment',
          plan_expires_at: null,
          status: 'active',
        })
        .select('id, email, business_name')
        .single();

      if (insertErr || !newClient) {
        console.error('[Checkout API] Auto-creation failed:', insertErr);
        return NextResponse.json({ error: 'فشل تهيئة ملف التعريف الخاص بك.' }, { status: 500 });
      }

      client = newClient;
    }

    // 3. Create a unique checkout order identifier
    const outerOrderSn = `YUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Get origin for callbacks
    const origin = req.nextUrl.origin || 'http://localhost:3000';

    // 4. Configure RedotPay Connect parameters
    const paymentParams: RedotPayCreateOrderParams = {
      outerOrderSn,
      outerUid: client.id,
      orderAmount: 1.00,
      orderCurrency: 'USD',
      env: 'WEB',
      orderDesc: `تفعيل منصة يوب - متجر ${client.business_name}`,
      goods: [
        {
          goodsType: '02',
          goodsCategory: 'Z000',
          goodsCode: 'yube-intro-30',
          goodsName: 'Yube 30 Days Access',
          goodsCount: 1,
          goodsAmount: 1.00,
          goodsCoin: 'USD',
        },
      ],
      buyer: {
        email: client.email || user.email || 'buyer@yube.dz',
        country: 'DZ',
      },
      redirectUrl: `${origin}/checkout/result`,
    };

    // 5. Call RedotPay Connect API
    let rpOrder;
    try {
      rpOrder = await createRedotPayOrder(paymentParams);
    } catch (rpErr: any) {
      console.error('[Checkout API] RedotPay order creation failure:', rpErr);
      return NextResponse.json({ 
        error: `بوابة الدفع غير متاحة حالياً: ${rpErr.message || 'خطأ في الاتصال'}` 
      }, { status: 502 });
    }

    // 6. Record the pending payment in the database
    const { error: insertErr } = await supabase
      .from('payments')
      .insert({
        client_id: client.id,
        provider: 'redotpay',
        provider_payment_id: rpOrder.orderSn, // RedotPay's order serial number
        amount: 1.00,
        currency: 'USD',
        status: 'pending',
      });

    if (insertErr) {
      console.error('[Checkout API] Database insert payment error:', insertErr);
      // We don't block the redirect since the webhook will resolve it anyway, but log it.
    }

    // Return the checkout URL
    return NextResponse.json({
      checkoutUrl: rpOrder.webUrl || rpOrder.h5Url,
    });

  } catch (err: any) {
    console.error('[Checkout API] Unexpected error:', err);
    return NextResponse.json({ error: 'حدث خطأ داخلي في الخادم.' }, { status: 500 });
  }
}
