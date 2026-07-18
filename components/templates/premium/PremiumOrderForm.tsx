'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ShoppingBag, User, Phone, MapPin, AlertCircle, Check } from 'lucide-react';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface PremiumOrderFormProps {
  pageId: string;
  clientId: string;
  pageSlug: string;
  productName: string;
  price: number;
  selectedColorName: string;
  selectedSize: string;
  sizes: string[];
  onSizeChange: (size: string) => void;
  primaryColor: string;
}

const initialState: OrderState = {};

function SubmitButton({ primaryColor }: { primaryColor: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ backgroundColor: pending ? '#9CA3AF' : primaryColor }}
      className="w-full text-white font-bold text-base py-4 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all transform active:scale-[0.98] cursor-pointer shadow-md hover:brightness-105"
    >
      <span>{pending ? 'جاري إرسال طلبك...' : 'تأكيد الطلب'}</span>
      {!pending && <ShoppingBag className="w-5 h-5 stroke-[2.5]" />}
    </button>
  );
}

export function PremiumOrderForm({
  pageId, clientId, pageSlug, productName, price,
  selectedColorName, selectedSize, sizes, onSizeChange, primaryColor
}: PremiumOrderFormProps) {
  const [state, formAction] = useFormState(submitOrder, initialState);
  const [city, setCity] = useState(WILAYAS[15]?.nameAr || 'الجزائر');
  const [quantity, setQuantity] = useState(1);

  const wilaya = WILAYAS.find((w) => w.nameAr === city) || WILAYAS[15];
  const totalPrice = price * quantity + (wilaya?.shippingFee || 0);
  const sizeAndColor = [selectedSize, selectedColorName].filter(Boolean).join(' - ');

  useEffect(() => {
    if (state.success) {
      trackEvent('order_submitted', { value: state.summary?.totalPrice, currency: 'DZD', quantity: state.summary?.quantity });
      trackPixelEvent('InitiateCheckout', { value: state.summary?.totalPrice, currency: 'DZD', num_items: state.summary?.quantity, content_type: 'product' });
    }
  }, [state.success, state.summary]);

  if (state.success) {
    return (
      <div className="bg-white border border-[#EAE6E1] rounded-[2rem] p-8 text-center shadow-sm animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h3 className="text-xl font-bold text-emerald-700">تم تسجيل طلب الحجز بنجاح! 🎉</h3>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
          شكراً لاختيارك. تم حفظ طلبك وسيقوم موظف تأكيد الطلبات بالاتصال بك هاتفياً خلال دقائق معدودة لتأكيد العنوان وحجم السلعة.
        </p>
        {state.summary && (
          <div className="bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-2xl p-4 mt-6 text-right text-xs text-gray-700 space-y-2.5">
            <div className="flex justify-between"><span>المنتج:</span><span className="font-semibold">{productName}</span></div>
            {sizeAndColor && <div className="flex justify-between"><span>الخيار المحدد:</span><span>{sizeAndColor}</span></div>}
            <div className="flex justify-between"><span>الكمية:</span><span>{state.summary.quantity}</span></div>
            <div className="flex justify-between"><span>الولاية:</span><span>{state.summary.city}</span></div>
            <div className="border-t border-[#EAE6E1] mt-2 pt-2 flex justify-between font-bold text-base text-gray-900">
              <span>المجموع الكلي:</span>
              <span style={{ color: primaryColor }}>{state.summary.totalPrice.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="checkout-form" className="order-card-container bg-white border border-[#EAE6E1] rounded-[2rem] p-6 md:p-8 shadow-sm">
      <div className="text-center mb-6 border-b border-[#EAE6E1] pb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-luxury-bg)] border border-[#EAE6E1] flex items-center justify-center mx-auto mb-2 text-gray-800" style={{ color: primaryColor }}>
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">استمارة طلب الحجز الفوري</h3>
        <p className="text-xs font-semibold mt-1" style={{ color: primaryColor }}>الدفع عند الاستلام بعد معاينة المنتج وتأكيده</p>
      </div>

      {sizes.length > 0 && (
        <div className="mb-5">
          <span className="text-xs font-bold text-gray-500 block mb-2">اختر المقاس المناسب:</span>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`py-2 px-1 rounded-xl text-center font-bold text-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                      : 'bg-[var(--color-luxury-bg)] border-[#EAE6E1] text-gray-900 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2.5">
          <span>المنتج المحدد:</span>
          <span className="font-bold text-gray-900">{sizeAndColor || productName}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2.5">
          <span>الكمية:</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-7 h-7 rounded-lg bg-white border border-[#EAE6E1] flex items-center justify-center text-gray-900 font-bold cursor-pointer hover:bg-[#FAF8F5]">-</button>
            <span className="font-bold text-gray-900 text-sm" style={{ color: primaryColor }}>{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="w-7 h-7 rounded-lg bg-white border border-[#EAE6E1] flex items-center justify-center text-gray-900 font-bold cursor-pointer hover:bg-[#FAF8F5]">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3 pb-2.5 border-b border-[#EAE6E1]">
          <span>تكلفة الشحن ({city}):</span>
          <span className="text-emerald-600 font-bold">{wilaya?.shippingFee.toLocaleString('ar-DZ')} دج</span>
        </div>
        <div className="flex justify-between items-center text-gray-900 font-bold">
          <span className="text-sm">السعر الإجمالي:</span>
          <span className="text-xl" style={{ color: primaryColor }}>{totalPrice.toLocaleString('ar-DZ')} دج</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4 text-right">
        <input type="hidden" name="page_id" value={pageId} />
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="page_slug" value={pageSlug} />
        <input type="hidden" name="product_name" value={productName} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="size" value={sizeAndColor} />
        <input type="hidden" name="city" value={city} />

        {state.error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span>الاسم الكامل <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text" name="name" required
            placeholder="مثال: محمد بن عبد الله"
            className="w-full bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span>رقم الهاتف <span className="text-red-500">*</span></span>
          </label>
          <input
            type="tel" name="phone" required dir="ltr"
            placeholder="0550XXXXXX"
            className="w-full bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-xl px-4 py-3 text-sm text-right focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span>الولاية <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
            >
              {WILAYAS.map((w) => (
                <option key={w.id} value={w.nameAr}>{w.code} - {w.nameAr}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>

        <SubmitButton primaryColor={primaryColor} />

        <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 pt-2">
          <span>🛡️ التسوق آمن 100%</span>
          <span>•</span>
          <span>🤝 الدفع عند الاستلام</span>
        </div>
      </form>
    </div>
  );
}
