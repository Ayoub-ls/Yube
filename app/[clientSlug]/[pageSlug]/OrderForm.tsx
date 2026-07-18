'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitOrder, type OrderState } from './actions';
import { WILAYAS } from '../../../lib/wilayas';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';
import { ShoppingCart, CheckCircle, Truck, Phone } from 'lucide-react';

interface OrderFormProps {
  pageId: string;
  clientId: string;
  pageSlug: string;
  productName: string;
  price: number;
  primaryColor: string;
}

const initialState: OrderState = {};

function SubmitButton({ primaryColor }: { primaryColor: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg text-base flex items-center justify-center gap-2 active:scale-95 duration-150 disabled:opacity-60"
      style={{ backgroundColor: primaryColor }}
    >
      {pending ? (
        <span className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>اضغط هنا لتأكيد الطلب الآن</span>
        </>
      )}
    </button>
  );
}

export function OrderForm({ pageId, clientId, pageSlug, productName, price, primaryColor }: OrderFormProps) {
  const [state, formAction] = useFormState(submitOrder, initialState);
  const [city, setCity] = useState(WILAYAS[15]?.nameAr || 'الجزائر');
  const [quantity, setQuantity] = useState(1);

  const wilaya = WILAYAS.find((w) => w.nameAr === city) || WILAYAS[15];
  const totalPrice = price * quantity + (wilaya?.shippingFee || 0);

  // Order submit = InitiateCheckout, not Purchase. Purchase only fires
  // later, when the store owner actually marks the order "delivered" in
  // their dashboard (see OrderRow.tsx) — that's the point where money
  // has actually changed hands for a COD business, and it's the signal
  // ad platforms need for accurate optimization.
  useEffect(() => {
    if (state.success) {
      trackEvent('order_submitted', {
        value: state.summary?.totalPrice,
        currency: 'DZD',
        quantity: state.summary?.quantity,
      });
      trackPixelEvent('InitiateCheckout', {
        value: state.summary?.totalPrice,
        currency: 'DZD',
        num_items: state.summary?.quantity,
        content_type: 'product',
      });
    }
  }, [state.success, state.summary]);

  if (state.success) {
    return (
      <div id="checkout-form" className="bg-white border-2 border-green-500 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">تهانينا! تم تسجيل طلبك بنجاح ✅</h3>
        <p className="text-sm text-gray-600 mb-6">
          لقد تلقينا طلبك لـ <span className="font-bold text-gray-800">{productName}</span>.
          سيتصل بك فريق العمل هاتفياً في أقرب وقت لتأكيد الطلب.
        </p>
        {state.summary && (
          <div className="bg-slate-50 rounded-2xl p-4 text-right border border-slate-100">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>الكمية المطلوبة:</span>
              <span className="font-bold text-gray-800">{state.summary.quantity}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>ولاية التوصيل:</span>
              <span className="font-bold text-gray-800">{state.summary.city}</span>
            </div>
            <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-base" style={{ color: primaryColor }}>
              <span>المبلغ الإجمالي (مع التوصيل):</span>
              <span>{state.summary.totalPrice.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="checkout-form" className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-100">
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
          <span>استمارة طلب الشراء السريع</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">الدفع عند الاستلام والتوصيل متوفر لجميع الولايات 🇩🇿</p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="page_id" value={pageId} />
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="page_slug" value={pageSlug} />
        <input type="hidden" name="product_name" value={productName} />

        {state.error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs border border-red-200">
            ⚠️ {state.error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل (الثنائي)</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="مثال: محمد بلقاسم"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
          <input
            type="tel"
            name="phone"
            required
            dir="ltr"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="05XXXXXXXX أو 06XXXXXXXX"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">الولاية</label>
            <select
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {WILAYAS.map((w) => (
                <option key={w.id} value={w.nameAr}>
                  {w.code} - {w.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">الكمية</label>
            <input type="hidden" name="quantity" value={quantity} />
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-[46px]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-full bg-slate-50 text-gray-600 font-bold hover:bg-slate-100 transition"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-gray-800 text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-12 h-full bg-slate-50 text-gray-600 font-bold hover:bg-slate-100 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>سعر المنتج:</span>
            <span className="font-bold text-gray-800">{price.toLocaleString('ar-DZ')} دج</span>
          </div>
          <div className="flex justify-between">
            <span>سعر التوصيل ({city}):</span>
            <span className="font-bold text-gray-800">{wilaya?.shippingFee.toLocaleString('ar-DZ')} دج</span>
          </div>
          <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-sm" style={{ color: primaryColor }}>
            <span>السعر الإجمالي عند الاستلام:</span>
            <span>{totalPrice.toLocaleString('ar-DZ')} دج</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 py-1 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>شحن سريع للباب أو للمكتب</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>الدفع عند معاينة السلعة</span>
          </div>
        </div>

        <SubmitButton primaryColor={primaryColor} />
      </form>
    </div>
  );
}
