'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
    ShoppingBag,
    User,
    Phone,
    MapPin,
    AlertCircle,
    Check,
    Home,
    Building2,
    ShieldCheck,
    Truck,
    PackageCheck,
    Sparkles,
    ArrowLeft,
} from 'lucide-react';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { useShipping } from '../../../lib/shipping/use-shipping';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface KidsOrderFormProps {
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
            style={{ backgroundColor: pending ? '#9CA3AF' : primaryColor }}
            className="w-full text-white font-black text-sm sm:text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 disabled:opacity-60 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[52px]"
        >
            <span>{pending ? 'جاري إرسال طلبك...' : 'اطلب الآن — الدفع عند الاستلام'}</span>
            {!pending && <ArrowLeft className="w-5 h-5" />}
        </button>
    );
}

export function KidsOrderForm({
    pageId, clientId, pageSlug, productName, price, primaryColor
}: KidsOrderFormProps) {
    const [state, formAction] = useFormState(submitOrder, initialState);
    const {
        city,
        setCity,
        deliveryType,
        setDeliveryType,
        quantity,
        setQuantity,
        shippingFee,
        totalPrice,
        loading
    } = useShipping({ clientId, price });

    useEffect(() => {
        if (state.success) {
            trackEvent('order_submitted', { value: state.summary?.totalPrice, currency: 'DZD', quantity: state.summary?.quantity });
            trackPixelEvent('InitiateCheckout', { value: state.summary?.totalPrice, currency: 'DZD', num_items: state.summary?.quantity, content_type: 'product' });
        }
    }, [state.success, state.summary]);

    if (state.success) {
        return (
            <div className="max-w-2xl mx-auto bg-white text-slate-800 rounded-[2rem] p-6 sm:p-8 border border-[#EAE6E1] shadow-2xl animate-fadeIn">
                <div className="flex items-center gap-3.5 text-emerald-600 mb-5 pb-5 border-b border-[#EAE6E1]">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shrink-0">
                        <PackageCheck className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">تم تسجيل طلب الحجز بنجاح! 🎉</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            سيتصل بكم فريق تأكيد الطلبات هاتفياً خلال دقائق لتأكيد العنوان وحجم السلعة.
                        </p>
                    </div>
                </div>

                {state.summary && (
                    <div className="p-4 sm:p-5 bg-[var(--color-luxury-bg)] rounded-xl border border-[#EAE6E1] text-xs sm:text-sm space-y-2.5 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span className="font-bold">المنتج:</span>
                            <span className="font-bold text-gray-900">{productName}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span className="font-bold">الكمية:</span>
                            <span className="font-bold text-gray-900">{state.summary.quantity}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span className="font-bold">الولاية:</span>
                            <span className="font-bold text-gray-900">{state.summary.city}</span>
                        </div>
                        <div className="pt-3 border-t border-[#EAE6E1] flex justify-between items-baseline">
                            <span className="text-sm font-black text-gray-900">المجموع الكلي:</span>
                            <span className="text-xl sm:text-2xl font-black" style={{ color: primaryColor }}>
                                {state.summary.totalPrice.toLocaleString('ar-DZ')} دج
                            </span>
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>الدفع عند الاستلام • لا يلزم بطاقة بنكية</span>
                </p>
            </div>
        );
    }

    return (
        <div id="checkout-form" className="order-card-container max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Recap card */}
            <div className="lg:col-span-5 space-y-3.5">
                <div className="p-5 rounded-[1.75rem] border-2 border-[#EAE6E1] bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span
                            className="text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Sparkles className="w-3 h-3" />
                            مثالي لطفلك
                        </span>
                        <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            متوفر في المخزون
                        </span>
                    </div>
                    <h3 className="font-black text-lg sm:text-xl text-gray-900 tracking-tight">{productName}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        منتج مصمم خصيصاً ليكون آمناً وممتعاً وسهل الاستخدام لطفلك.
                    </p>
                    <div className="py-3.5 my-3 border-y border-[#EAE6E1]">
                        <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
                            {price.toLocaleString('ar-DZ')} دج
                        </div>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                            <span>جودة عالية وآمنة على الأطفال</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1.5 border-t border-[#EAE6E1]">
                            <Check className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                            <span>تصميم ملون وجذاب يحبه الأطفال</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1.5 border-t border-[#EAE6E1]">
                            <Check className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                            <span>سهل الاستخدام ومناسب لجميع الأعمار</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-white border border-[#EAE6E1] rounded-2xl grid grid-cols-3 gap-1 text-center shadow-sm">
                    <div className="flex flex-col items-center justify-center p-1">
                        <Truck className="w-4 h-4 mb-1" style={{ color: primaryColor }} />
                        <span className="text-[11px] font-bold text-gray-900 leading-tight">توصيل 58 ولاية</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1 border-r border-[#EAE6E1]">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1" />
                        <span className="text-[11px] font-bold text-gray-900 leading-tight">الدفع عند الاستلام</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1 border-r border-[#EAE6E1]">
                        <PackageCheck className="w-4 h-4 text-amber-500 mb-1" />
                        <span className="text-[11px] font-bold text-gray-900 leading-tight">معاينة قبل الدفع</span>
                    </div>
                </div>
            </div>

            {/* Form card */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-[1.75rem] border border-[#EAE6E1] shadow-sm">
                <div className="text-center mb-6 pb-4 border-b border-[#EAE6E1]">
                    <div
                        className="w-12 h-12 rounded-full bg-[var(--color-luxury-bg)] border border-[#EAE6E1] flex items-center justify-center mx-auto mb-2"
                        style={{ color: primaryColor }}
                    >
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">استمارة طلب الحجز الفوري</h3>
                    <p className="text-xs font-semibold mt-1" style={{ color: primaryColor }}>
                        الدفع عند الاستلام بعد معاينة المنتج وتأكيده
                    </p>
                </div>

                <form action={formAction} className="space-y-5 text-right">
                    <input type="hidden" name="page_id" value={pageId} />
                    <input type="hidden" name="client_id" value={clientId} />
                    <input type="hidden" name="page_slug" value={pageSlug} />
                    <input type="hidden" name="product_name" value={productName} />
                    <input type="hidden" name="quantity" value={quantity} />
                    <input type="hidden" name="city" value={city} />
                    <input type="hidden" name="delivery_type" value={deliveryType} />

                    {state.error && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{state.error}</span>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="flex justify-between items-center bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-xl px-4 py-3">
                        <span className="text-xs font-bold text-gray-500">الكمية:</span>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-7 h-7 rounded-lg bg-white border border-[#EAE6E1] flex items-center justify-center text-gray-900 font-bold cursor-pointer hover:bg-[#FAF8F5]"
                            >
                                -
                            </button>
                            <span className="font-bold text-sm" style={{ color: primaryColor }}>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                                className="w-7 h-7 rounded-lg bg-white border border-[#EAE6E1] flex items-center justify-center text-gray-900 font-bold cursor-pointer hover:bg-[#FAF8F5]"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Section 1: Contact */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#EAE6E1]">
                            <div
                                className="w-5 h-5 rounded-full text-white text-[11px] font-black flex items-center justify-center shrink-0"
                                style={{ backgroundColor: primaryColor }}
                            >
                                1
                            </div>
                            <h4 className="font-black text-sm text-gray-900">معلومات الاتصال</h4>
                        </div>

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
                            <p className="text-[11px] text-gray-400">سنتصل بكم هاتفياً لتأكيد العنوان وموعد التوصيل قبل إرسال الطرد.</p>
                        </div>
                    </div>

                    {/* Section 2: Wilaya */}
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#EAE6E1]">
                            <div
                                className="w-5 h-5 rounded-full text-white text-[11px] font-black flex items-center justify-center shrink-0"
                                style={{ backgroundColor: primaryColor }}
                            >
                                2
                            </div>
                            <h4 className="font-black text-sm text-gray-900">عنوان التوصيل</h4>
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
                                    className="w-full bg-[var(--color-luxury-bg)] text-black border border-[#EAE6E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
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
                    </div>

                    {/* Section 3: Delivery type */}
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#EAE6E1]">
                            <div
                                className="w-5 h-5 rounded-full text-white text-[11px] font-black flex items-center justify-center shrink-0"
                                style={{ backgroundColor: primaryColor }}
                            >
                                3
                            </div>
                            <h4 className="font-black text-sm text-gray-900">مكان الاستلام</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => setDeliveryType('home')}
                                className={`p-3.5 rounded-xl border-2 text-right transition-all flex items-center gap-3 cursor-pointer min-h-[56px] ${deliveryType === 'home'
                                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${deliveryType === 'home' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    <Home className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-xs sm:text-sm text-gray-900">توصيل للمنزل</span>
                                        {deliveryType === 'home' && (
                                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                <Check className="w-2.5 h-2.5" />
                                            </span>
                                        )}
                                    </div>
                                    <span className="block text-[11px] text-gray-500 mt-0.5">توصيل لباب منزلك</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDeliveryType('stopdesk')}
                                className={`p-3.5 rounded-xl border-2 text-right transition-all flex items-center gap-3 cursor-pointer min-h-[56px] ${deliveryType === 'stopdesk'
                                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${deliveryType === 'stopdesk' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    <Building2 className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-xs sm:text-sm text-gray-900">استلام من المكتب</span>
                                        {deliveryType === 'stopdesk' && (
                                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                <Check className="w-2.5 h-2.5" />
                                            </span>
                                        )}
                                    </div>
                                    <span className="block text-[11px] text-gray-500 mt-0.5">استلام من وكالة التوصيل</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="pt-1">
                        <div className="p-4 sm:p-5 bg-[var(--color-luxury-bg)] border border-[#EAE6E1] rounded-xl space-y-3">
                            <div className="font-black text-xs sm:text-sm text-gray-900 pb-2 border-b border-[#EAE6E1] flex items-center justify-between">
                                <span>ملخص الطلب</span>
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                    الدفع نقداً عند الاستلام
                                </span>
                            </div>
                            <div className="space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>المنتج ({quantity}x):</span>
                                    <span className="font-bold text-gray-900">{(price * quantity).toLocaleString('ar-DZ')} دج</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>تكلفة الشحن ({city}):</span>
                                    {loading ? (
                                        <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span className="font-bold text-emerald-600">{shippingFee.toLocaleString('ar-DZ')} دج</span>
                                    )}
                                </div>
                                <div className="pt-3 mt-1 border-t-2 border-dashed border-[#EAE6E1] flex justify-between items-baseline">
                                    <span className="text-sm sm:text-base font-black text-gray-900">المجموع:</span>
                                    <span className="text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
                                        {totalPrice.toLocaleString('ar-DZ')} دج
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-1">
                        <SubmitButton primaryColor={primaryColor} />
                        <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1.5 font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>تدفع نقداً فقط عند استلام وفحص الطرد • لا يلزم بطاقة بنكية</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
