'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ShoppingBag, User, Phone, MapPin, AlertCircle, Check } from 'lucide-react';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface GadgetOrderFormProps {
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
      className="w-full btn-electric-gradient font-bold text-base py-4 px-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 animate-pulse-electric cursor-pointer"
    >
      <span>{pending ? 'جاري إرسال طلبك...' : 'أكد الطلب الآن'}</span>
      {!pending && <ShoppingBag className="w-5 h-5 stroke-[2.5]" />}
    </button>
  );
}

export function GadgetOrderForm({
  pageId, clientId, pageSlug, productName, price,
  selectedColorName, selectedSize, sizes, onSizeChange,
}: GadgetOrderFormProps) {
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
      <div className="bg-[#ffffff] border border-[#eeedf3] rounded-[24px] p-6 text-center shadow-ambient">
        <div className="w-16 h-16 rounded-full bg-[#d2f4e8] text-[#006b54] border border-[#a3e9d1] flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h3 className="text-lg font-bold text-[#006b54]">تهانينا! تم تسجيل طلبك بنجاح 🎉</h3>
        <p className="text-xs text-[#414755] mt-2 leading-relaxed">
          سيتصل بك فريقنا هاتفياً خلال 24 ساعة لتأكيد طلبك وتجهيز الشحن.
        </p>
        {state.summary && (
          <div className="bg-[#f4f3f8] border border-[#eeedf3] rounded-2xl p-4 mt-4 text-right text-xs text-[#1a1b1f] space-y-2">
            <div className="flex justify-between"><span>المنتج:</span><span className="font-semibold">{productName}</span></div>
            {sizeAndColor && <div className="flex justify-between"><span>الخيار المحدد:</span><span>{sizeAndColor}</span></div>}
            <div className="flex justify-between"><span>الكمية:</span><span>{state.summary.quantity}</span></div>
            <div className="flex justify-between"><span>الولاية:</span><span>{state.summary.city}</span></div>
            <div className="border-t border-[#eeedf3] mt-2 pt-2 flex justify-between font-bold text-base text-[#1a1b1f]">
              <span>المجموع الكلي:</span><span className="text-[#0058bc]">{state.summary.totalPrice.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="checkout-form" className="order-card-container bg-[#ffffff] border border-[#eeedf3] rounded-[24px] p-5 shadow-ambient">
      <div className="text-center mb-5 border-b border-[#eeedf3] pb-4">
        <div className="w-12 h-12 rounded-full bg-[#d8e2ff] border border-[#c1c6d7] flex items-center justify-center mx-auto mb-2 text-[#0058bc]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#1a1b1f]">أكد طلبك الآن</h3>
        <p className="text-xs text-[#0058bc] font-semibold mt-1">الدفع نقداً عند استلام المنتج لباب منزلك</p>
      </div>

      {sizes.length > 0 && (
        <div className="mb-4.5">
          <span className="text-xs font-bold text-[#414755] block mb-2">اختر المقاس المناسب:</span>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={`py-2 rounded-xl text-center font-bold text-sm border transition-all cursor-pointer ${
                  selectedSize === size ? 'border-[#0058bc] bg-[#0058bc] text-white' : 'border-[#c1c6d7] bg-[#f4f3f8] text-[#1a1b1f] hover:border-[#717786]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#f4f3f8] border border-[#eeedf3] rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center text-xs text-[#414755] mb-2.5">
          <span>المنتج المحدد:</span>
          <span className="font-bold text-[#1a1b1f]">{sizeAndColor || productName}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#414755] mb-2.5">
          <span>الكمية:</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-7 h-7 rounded-lg bg-white border border-[#c1c6d7] flex items-center justify-center text-[#1a1b1f] font-bold cursor-pointer hover:bg-[#eeedf3]">-</button>
            <span className="font-bold text-[#0058bc] text-sm">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="w-7 h-7 rounded-lg bg-white border border-[#c1c6d7] flex items-center justify-center text-[#1a1b1f] font-bold cursor-pointer hover:bg-[#eeedf3]">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-[#414755] mb-3 pb-2.5 border-b border-[#eeedf3]">
          <span>تكلفة التوصيل ({city}):</span>
          <span className="text-[#006b54] font-bold">{wilaya?.shippingFee.toLocaleString('ar-DZ')} دج</span>
        </div>
        <div className="flex justify-between items-center text-[#1a1b1f] font-bold">
          <span className="text-sm">السعر الإجمالي:</span>
          <span className="text-xl text-[#0058bc]">{totalPrice.toLocaleString('ar-DZ')} دج</span>
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
          <div className="p-3.5 bg-red-50 border border-red-200 text-[#ba1a1a] text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#414755] mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#0058bc] shrink-0" />
            <span>الاسم الكامل <span className="text-[#ba1a1a]">*</span></span>
          </label>
          <input
            type="text" name="name" required
            placeholder="مثال: خالد محمد"
            className="w-full gadget-input text-sm text-[#1a1b1f] rounded-xl py-3 px-3.5 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#414755] mb-1.5 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#0058bc] shrink-0" />
            <span>رقم الهاتف <span className="text-[#ba1a1a]">*</span></span>
          </label>
          <input
            type="tel" name="phone" required dir="ltr"
            placeholder="0550XXXXXX"
            className="w-full gadget-input text-sm text-[#1a1b1f] rounded-xl py-3 px-3.5 outline-none text-right"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#414755] mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0058bc] shrink-0" />
            <span>الولاية <span className="text-[#ba1a1a]">*</span></span>
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full gadget-input text-sm text-[#1a1b1f] rounded-xl py-3 px-3.5 outline-none appearance-none cursor-pointer"
            >
              {WILAYAS.map((w) => (
                <option key={w.id} value={w.nameAr}>{w.code} - {w.nameAr}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#414755]">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>

        <SubmitButton />

        <div className="flex justify-center items-center gap-2.5 text-[10px] text-[#414755] pt-2">
          <span>🛡️ التسوق آمن 100%</span>
          <span>•</span>
          <span>🤝 الدفع يد بيد عند الاستلام</span>
        </div>
      </form>
    </div>
  );
}
