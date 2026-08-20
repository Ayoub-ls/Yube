import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { verifyWebhookSignature } from '../../../../lib/redotpay';

export async function POST(req: NextRequest) {
  const adminSupabase = createAdminClient();
  
  // 1. Extract request headers
  const headersObj: { [key: string]: string } = {};
  req.headers.forEach((value, key) => {
    headersObj[key.toLowerCase()] = value;
  });

  const requestId = headersObj['x-r-request-id'] || crypto.randomUUID();

  // 2. Extract raw body text
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err: any) {
    console.error('[RedotPay Webhook] Failed to read body:', err);
    return NextResponse.json({
      code: 'FAIL',
      requestId,
      msg: 'failed to read request body',
    }, { status: 400 });
  }

  // 3. Verify webhook signature
  const isVerified = verifyWebhookSignature(headersObj, rawBody);
  if (!isVerified) {
    console.error('[RedotPay Webhook] Signature verification failed.', headersObj);
    return NextResponse.json({
      code: 'FAIL',
      requestId,
      msg: 'invalid signature',
    }, { status: 401 });
  }

  // 4. Parse payload details
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (err) {
    console.error('[RedotPay Webhook] JSON parse error:', err);
    return NextResponse.json({
      code: 'FAIL',
      requestId,
      msg: 'invalid json format',
    }, { status: 400 });
  }

  console.log('[RedotPay Webhook] Received verified payload:', body);

  const orderSn = body.orderSn || body.preSn;
  const outerOrderSn = body.outerOrderSn || body.outerOrder;
  const clientId = body.outerUid;
  const orderStatus = body.orderStatus; // 2 = Success, 3 = Failed, 4 = Closed
  const amount = body.orderAmount || 1.00;
  const currency = body.orderCurrency || 'USD';
  const paymentSerial = body.sn; // transaction ID

  if (!orderSn) {
    return NextResponse.json({
      code: 'FAIL',
      requestId,
      msg: 'missing order identification fields',
    }, { status: 400 });
  }

  try {
    // 5. Look up the matching pending payment
    const { data: payment, error: paymentError } = await adminSupabase
      .from('payments')
      .select('*')
      .eq('provider_payment_id', orderSn)
      .maybeSingle();

    if (paymentError) {
      console.error('[RedotPay Webhook] Error fetching payment:', paymentError);
      return NextResponse.json({
        code: 'FAIL',
        requestId,
        msg: 'database lookup error',
      }, { status: 500 });
    }

    // 6. Handle idempotency: if payment is already processed as paid, return SUCCESS
    if (payment && payment.status === 'paid') {
      console.log(`[RedotPay Webhook] Payment ${orderSn} already processed. Skipping.`);
      return NextResponse.json({ code: 'SUCCESS', requestId });
    }

    // 7. Process payment success
    if (orderStatus === 2) {
      console.log(`[RedotPay Webhook] Processing successful payment for client=${clientId || payment?.client_id}`);
      
      const resolvedClientId = clientId || payment?.client_id;
      if (!resolvedClientId) {
        return NextResponse.json({
          code: 'FAIL',
          requestId,
          msg: 'could not resolve client id for subscription',
        }, { status: 400 });
      }

      // Define subscription dates: 30 days of access
      const startedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Create new subscription record (admin client bypasses RLS)
      const { data: subscription, error: subError } = await adminSupabase
        .from('subscriptions')
        .insert({
          client_id: resolvedClientId,
          plan: 'introductory',
          status: 'active',
          amount,
          currency,
          started_at: startedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_provider: 'redotpay',
          payment_id: paymentSerial || orderSn,
        })
        .select()
        .single();

      if (subError) {
        console.error('[RedotPay Webhook] Subscription insert error:', subError);
        return NextResponse.json({
          code: 'FAIL',
          requestId,
          msg: 'failed to record subscription',
        }, { status: 500 });
      }

      // Update payment record to paid and attach subscription id
      if (payment) {
        const { error: updatePayError } = await adminSupabase
          .from('payments')
          .update({
            status: 'paid',
            subscription_id: subscription.id,
          })
          .eq('id', payment.id);

        if (updatePayError) {
          console.error('[RedotPay Webhook] Payment update error:', updatePayError);
        }
      } else {
        // If the payment record wasn't found (e.g. out of sync checkout), insert it directly as paid
        const { error: insertPayError } = await adminSupabase
          .from('payments')
          .insert({
            client_id: resolvedClientId,
            provider: 'redotpay',
            provider_payment_id: orderSn,
            amount,
            currency,
            status: 'paid',
            subscription_id: subscription.id,
          });

        if (insertPayError) {
          console.error('[RedotPay Webhook] Backup payment insert error:', insertPayError);
        }
      }

      // Update client store details: plan, expiry, active status
      const { error: clientUpdateError } = await adminSupabase
        .from('clients')
        .update({
          plan: 'introductory',
          plan_expires_at: expiresAt.toISOString(),
          status: 'active',
        })
        .eq('id', resolvedClientId);

      if (clientUpdateError) {
        console.error('[RedotPay Webhook] Client profile update error:', clientUpdateError);
        return NextResponse.json({
          code: 'FAIL',
          requestId,
          msg: 'failed to activate client store plan',
        }, { status: 500 });
      }

      console.log(`[RedotPay Webhook] Client ${resolvedClientId} successfully activated until ${expiresAt.toISOString()}`);

    } else if (orderStatus === 3 || orderStatus === 4) {
      // 8. Process payment failure or cancellation
      const targetStatus = orderStatus === 3 ? 'failed' : 'cancelled';
      console.log(`[RedotPay Webhook] Payment ${orderSn} status updated to ${targetStatus}`);

      if (payment) {
        await adminSupabase
          .from('payments')
          .update({ status: targetStatus })
          .eq('id', payment.id);
      }
    }

    // Return success to RedotPay
    return NextResponse.json({ code: 'SUCCESS', requestId });

  } catch (err: any) {
    console.error('[RedotPay Webhook] Critical error:', err);
    return NextResponse.json({
      code: 'FAIL',
      requestId,
      msg: 'internal server error: ' + (err.message || 'unknown'),
    }, { status: 500 });
  }
}
