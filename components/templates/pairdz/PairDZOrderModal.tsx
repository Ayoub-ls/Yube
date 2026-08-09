'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { X, User, Phone, MapPin, Check, BadgeCheck } from 'lucide-react';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { useShipping } from '../../../lib/shipping/use-shipping';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface PairDZOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  clientId: string;
  pageSlug: string;
  productName: string;
  totalPrice: number;
  selectedSummary: string;
  totalQuantity: number;
  onOrderSuccess: () => void;
}

const initialState: OrderState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full initiate bg-algeria-green hover:bg-emerald-800 text-white py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all border-b-2 border-emerald-950 active:scale-[0.99] focus:outline-none disabled:opacity-60"
    >
      <Check className="w-5 h-5" />
      <span>{pending ? 'جاري الإرسال...' : 'تأكيد وشراء الطلب الآن'}</span>
    </button>
  );
}

export function PairDZOrderModal({
  isOpen, onClose, pageId, clientId, pageSlug, productName,
  totalPrice, selectedSummary, totalQuantity, onOrderSuccess,
}: PairDZOrderModalProps) {
  const [state, formAction] = useFormState(submitOrder, initialState);
  const {
    city,
    setCity,
    deliveryType,
    setDeliveryType,
    shippingFee,
    totalPrice: finalTotalPrice,
    loading
  } = useShipping({
    clientId,
    price: totalPrice / (totalQuantity || 1),
    initialQuantity: totalQuantity
  });

  useEffect(() => {
    if (state.success) {
      trackEvent('order_submitted', { value: state.summary?.totalPrice, currency: 'DZD', quantity: state.summary?.quantity });
      trackPixelEvent('InitiateCheckout', { value: state.summary?.totalPrice, currency: 'DZD', num_items: state.summary?.quantity, content_type: 'product' });
    }
  }, [state.success, state.summary]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-l from-algeria-green to-emerald-800 p-5 text-white flex justify-between items-center shrink-0 sticky top-0 z-10">
          <div className="space-y-1">
            <h3 className="font-extrabold text-xl flex items-center gap-2">
              <span>تأكيد الطلب السريع 🇩🇿</span>
            </h3>
            <p className="text-xs text-white/80">يرجى ملأ الاستمارة بدقة لتجهيز طرودكم بالسرعة القصوى</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-slate-200 transition-all focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-center relative">
          {!state.success ? (
            <form action={formAction} className="space-y-4 w-full">
              <input type="hidden" name="page_id" value={pageId} />
              <input type="hidden" name="client_id" value={clientId} />
              <input type="hidden" name="page_slug" value={pageSlug} />
              <input type="hidden" name="product_name" value={productName} />
              <input type="hidden" name="quantity" value={totalQuantity} />
              <input type="hidden" name="size" value={selectedSummary} />
              <input type="hidden" name="delivery_type" value={deliveryType} />

              <div className="bg-emerald-50 border border-emerald-100 text-algeria-green p-4 rounded-2xl space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-bold block text-xs text-emerald-700 mb-0.5">الطلبية:</span>
                    <span className="font-black text-sm leading-tight block text-emerald-900">{selectedSummary}</span>
                  </div>
                  <div className="text-left shrink-0 ml-3">
                    <span className="font-bold block text-xs text-emerald-700 mb-0.5">سعر المنتجات:</span>
                    <span className="font-extrabold text-emerald-800 text-sm">{totalPrice.toLocaleString('ar-DZ')} د.ج</span>
                  </div>
                </div>
                <div className="border-t border-emerald-250/40 pt-2 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">سعر الشحن ({city}):</span>
                  <span className="font-black text-emerald-800">
                    {loading ? (
                      <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      `${shippingFee.toLocaleString('ar-DZ')} د.ج`
                    )}
                  </span>
                </div>
                <div className="border-t-2 border-emerald-250/60 pt-2 flex justify-between items-center">
                  <span className="font-black text-emerald-950 text-sm">الإجمالي عند الاستلام:</span>
                  <span className="font-black text-amber-700 text-lg">{finalTotalPrice.toLocaleString('ar-DZ')} د.ج</span>
                </div>
              </div>

              {state.error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">⚠️ {state.error}</div>
              )}

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 text-sm">الأسم الكامل للـمستلم *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-2 focus:ring-algeria-green focus:border-algeria-green outline-none transition-all font-semibold"
                    placeholder="أدخل اسمك الثلاثي الكامل"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 text-sm">رقم الهاتف الجوال *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-2 focus:ring-algeria-green focus:border-algeria-green outline-none transition-all font-mono font-bold tracking-wider text-left"
                    placeholder="05 / 06 / 07 XXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 text-sm">الولاية (58 ولاية متوفرة) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <select
                    required
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-2 focus:ring-algeria-green focus:border-algeria-green outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" disabled dir="rtl">-- اختر ولايتك من القائمة --</option>
                    {WILAYAS.map((w) => (
                      <option key={w.id} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 text-sm">نوع التوصيل *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('home')}
                    className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      deliveryType === 'home'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-extrabold shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    توصيل للمنزل
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('stopdesk')}
                    className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      deliveryType === 'stopdesk'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-extrabold shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    استلام من المكتب
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <SubmitButton />
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl font-bold transition-all text-sm focus:outline-none"
                >
                  إلغاء وتعديل المقاس
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-algeria-green flex items-center justify-center mb-5 shadow-inner">
                <BadgeCheck className="w-12 h-12" />
              </div>
              <h4 className="font-black text-2xl text-slate-950">تم تسجيل طلبك بنجاح! 🇩🇿</h4>
              <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm max-w-sm">
                <p className="text-slate-600 font-bold leading-relaxed">✅ تم تسجيل طلبك! سنتصل بك قريباً</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  سيتصل بكم قسم تأكيد الطلبيات والشحن هاتفياً في غضون 24 ساعة لتجهيز شحنتكم.
                </p>
              </div>
              <button
                onClick={() => { onOrderSuccess(); onClose(); }}
                className="bg-algeria-green hover:bg-emerald-800 text-white font-extrabold px-8 py-3.5 rounded-2xl transition-all shadow-md active:scale-95 focus:outline-none"
              >
                إغلاق والعودة للمتجر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
