'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ShoppingBag, User, Phone, MapPin, AlertCircle, Check } from 'lucide-react';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface RitaOrderFormProps {
  pageId: string;
  clientId: string;
  pageSlug: string;
  productName: string;
  price: number;
  selectedColorName: string;
  selectedSize: string;
  sizes: string[];
  onSizeChange: (size: string) => void;
}

const initialState: OrderState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gold-gradient text-slate-950 font-black text-base py-4 px-4 rounded-3xl transition-all duration-300 shadow-[0_8px_30px_rgba(207,155,50,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 animate-pulse-gold"
    >
      <span>{pending ? 'جاري إرسال الطلب...' : 'اضغطي هنا لتأكيد طلبيتكِ'}</span>
      {!pending && <ShoppingBag className="w-5 h-5 stroke-[2.5]" />}
    </button>
  );
}

export function RitaOrderForm({
  pageId, clientId, pageSlug, productName, price,
  selectedColorName, selectedSize, sizes, onSizeChange,
}: RitaOrderFormProps) {
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
      <div className="bg-gradient-to-b from-[#18171f] to-[#121115] border-2 border-[#cf9b32]/40 rounded-[32px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gold-950/45 text-[#cf9b32] border border-gold-800/35 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h3 className="text-lg font-extrabold text-[#cf9b32]">تهانينا! تم تسجيل طلبيتكِ بنجاح 🎉</h3>
        <p className="text-xs text-slate-350 mt-2 leading-relaxed">
          سيتصل بك فريقنا هاتفياً خلال 24 ساعة لتأكيد طلبك.
        </p>
        {state.summary && (
          <div className="bg-[#121115] border border-gold-900/10 rounded-2xl p-4 mt-4 text-right text-xs text-slate-300 space-y-1.5">
            <div className="flex justify-between"><span>الكمية</span><span>{state.summary.quantity}</span></div>
            <div className="flex justify-between"><span>الولاية</span><span>{state.summary.city}</span></div>
            <div className="border-t border-gold-900/15 mt-2 pt-2 flex justify-between font-extrabold text-white">
              <span>المجموع</span><span className="text-[#cf9b32]">{state.summary.totalPrice.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="order-card-container bg-gradient-to-b from-[#18171f] to-[#121115] border-2 border-[#cf9b32]/40 rounded-[32px] p-5 shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-4.5 border-b border-gold-900/15 pb-3.5">
        <div className="w-12 h-12 rounded-full bg-gold-950/45 border border-gold-800/30 flex items-center justify-center mx-auto mb-2 text-[#cf9b32]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-white">سجلي طلبكِ الأن للشراء الفوري</h3>
        <p className="text-xs text-[#cf9b32] font-semibold mt-1">الدفع يد بيد بعد معاينة المنتج عند التوصيل</p>
      </div>

      {sizes.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-400 block mb-2">اختر المقاس المناسب:</span>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={`py-2 rounded-xl text-center font-bold text-sm border-2 transition-all ${
                  selectedSize === size ? 'border-[#cf9b32] bg-[#cf9b32] text-slate-950' : 'border-slate-850 bg-[#1e1d24] text-slate-300 hover:border-slate-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gold-950/15 border border-gold-900/30 rounded-2xl p-3.5 mb-4.5">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>المنتج المحدد:</span>
          <span className="font-bold text-white">{sizeAndColor || productName}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>الكمية:</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-6 h-6 rounded-full bg-[#24232a] border border-slate-800 flex items-center justify-center text-slate-300 text-xs">-</button>
            <span className="font-extrabold text-[#cf9b32]">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="w-6 h-6 rounded-full bg-[#24232a] border border-slate-800 flex items-center justify-center text-slate-300 text-xs">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 mb-3 pb-2.5 border-b border-gold-900/20">
          <span>تكلفة الشحن ({city}):</span>
          <span className="text-emerald-450 font-extrabold">{wilaya?.shippingFee.toLocaleString('ar-DZ')} دج</span>
        </div>
        <div className="flex justify-between items-center text-white font-black">
          <span className="text-sm">السعر الإجمالي:</span>
          <span className="text-lg text-[#cf9b32]">{totalPrice.toLocaleString('ar-DZ')} دج</span>
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
          <div className="p-3.5 bg-red-950/50 border border-red-900/40 text-red-300 text-xs rounded-2xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#cf9b32] shrink-0" />
            <span>الاسم الكامل <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text" name="name" required
            placeholder="مثال: جهيدة بلقاسم"
            className="w-full bg-[#1e1d24] border border-slate-800 focus:border-[#cf9b32] text-sm text-white rounded-2xl py-3 px-3.5 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#cf9b32] shrink-0" />
            <span>رقم الهاتف <span className="text-red-500">*</span></span>
          </label>
          <input
            type="tel" name="phone" required dir="ltr"
            placeholder="0550XXXXXX"
            className="w-full bg-[#1e1d24] border border-slate-800 focus:border-[#cf9b32] text-sm text-white rounded-2xl py-3 px-3.5 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#cf9b32] shrink-0" />
            <span>الولاية <span className="text-red-500">*</span></span>
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-[#1e1d24] border border-slate-800 focus:border-[#cf9b32] text-sm text-slate-250 rounded-2xl py-3 px-3.5 outline-none transition-all appearance-none"
          >
            {WILAYAS.map((w) => (
              <option key={w.id} value={w.nameAr}>{w.code} - {w.nameAr}</option>
            ))}
          </select>
        </div>

        <SubmitButton />

        <div className="flex justify-center items-center gap-2 text-[10px] text-slate-500">
          <span>🛡️ بياناتكِ محمية 100%</span>
          <span>•</span>
          <span>🤝 دفع آمن عند الاستلام</span>
        </div>
      </form>
    </div>
  );
}
