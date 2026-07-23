'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ShoppingBag, User, Phone, MapPin, AlertCircle, Check } from 'lucide-react';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface SimpleOrderFormProps {
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
      style={{ backgroundColor: primaryColor }}
      className="w-full text-white font-bold text-base py-4 px-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-95 active:scale-[0.98] cursor-pointer"
    >
      <span>{pending ? 'جاري إرسال الطلب...' : 'اضغط هنا لتأكيد طلبك الآن'}</span>
      {!pending && <ShoppingBag className="w-5 h-5" />}
    </button>
  );
}

export function SimpleOrderForm({
  pageId, clientId, pageSlug, productName, price,
  selectedColorName, selectedSize, sizes, onSizeChange, primaryColor
}: SimpleOrderFormProps) {
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
      <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h3 className="text-lg font-extrabold text-emerald-650">تم تسجيل طلبك بنجاح! 🎉</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          سيتصل بك فريق العمل هاتفياً خلال 24 ساعة لتأكيد عنوان الشحن.
        </p>
        {state.summary && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-4 text-right text-xs text-slate-650 space-y-1.5">
            <div className="flex justify-between"><span>المنتج</span><span className="font-bold text-slate-800">{productName}</span></div>
            {sizeAndColor && (
              <div className="flex justify-between"><span>الخيارات</span><span className="font-bold text-slate-800">{sizeAndColor}</span></div>
            )}
            <div className="flex justify-between"><span>الكمية</span><span>{state.summary.quantity}</span></div>
            <div className="flex justify-between"><span>الولاية</span><span>{state.summary.city}</span></div>
            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-extrabold text-base">
              <span>المبلغ الإجمالي عند الاستلام</span>
              <span style={{ color: primaryColor }}>{state.summary.totalPrice.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="checkout-form" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md">
      <div className="text-center mb-5 border-b border-slate-150 pb-4">
        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-2" style={{ color: primaryColor }}>
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">سجل معلوماتك لإتمام الطلب</h3>
        <p className="text-xs text-slate-500 mt-1">التوصيل متوفر لجميع الولايات والدفع عند الاستلام 🇩🇿</p>
      </div>

      {sizes.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-600 block mb-2">المقاس المتوفر:</span>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => {
              const selected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`py-2 rounded-xl text-center font-bold text-sm border-2 transition-all ${
                    selected 
                      ? 'text-white' 
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-350'
                  }`}
                  style={selected ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
          <span>المنتج:</span>
          <span className="font-bold text-slate-800">{productName}</span>
        </div>
        {sizeAndColor && (
          <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
            <span>الخيارات المحددة:</span>
            <span className="font-bold text-slate-800">{sizeAndColor}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
          <span>الكمية:</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold hover:bg-slate-50">-</button>
            <span className="font-extrabold text-slate-900">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold hover:bg-slate-50">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500 mb-3 pb-2.5 border-b border-slate-200/60">
          <span>تكلفة الشحن ({city}):</span>
          <span className="font-bold text-emerald-600">{wilaya?.shippingFee.toLocaleString('ar-DZ')} دج</span>
        </div>
        <div className="flex justify-between items-center text-slate-900 font-extrabold">
          <span className="text-sm">المجموع الإجمالي:</span>
          <span className="text-lg" style={{ color: primaryColor }}>{totalPrice.toLocaleString('ar-DZ')} دج</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="page_id" value={pageId} />
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="page_slug" value={pageSlug} />
        <input type="hidden" name="product_name" value={productName} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="size" value={sizeAndColor} />
        <input type="hidden" name="city" value={city} />

        {state.error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
            <span>الاسم الكامل <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text" name="name" required
            placeholder="مثال: أمين بلقاسم"
            className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-400 text-sm text-slate-900 rounded-xl py-3 px-3.5 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
            <span>رقم الهاتف <span className="text-red-500">*</span></span>
          </label>
          <input
            type="tel" name="phone" required dir="ltr"
            placeholder="05XXXXXXXX / 06XXXXXXXX"
            className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-400 text-sm text-slate-900 rounded-xl py-3 px-3.5 outline-none transition-all text-right"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
            <span>الولاية <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-400 text-sm text-slate-900 rounded-xl py-3 px-3.5 outline-none transition-all appearance-none"
            >
              {WILAYAS.map((w) => (
                <option key={w.id} value={w.nameAr}>{w.code} - {w.nameAr}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-500">
              ▼
            </div>
          </div>
        </div>

        <SubmitButton primaryColor={primaryColor} />

        <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 mt-2">
          <span>🛡️ بياناتك محمية تماماً</span>
          <span>•</span>
          <span>🤝 الدفع عند الاستلام</span>
        </div>
      </form>
    </div>
  );
}
