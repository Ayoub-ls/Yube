// src/components/templates/OrderForm.tsx
import React, { useState } from 'react';
import { LandingPage, Client } from '../../types';
import { WILAYAS } from '../../lib/wilayas';
import { db } from '../../lib/db';
import { COLOR_PRESETS } from '../../lib/colors';
import { ShoppingCart, CheckCircle, Truck, Phone } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface OrderFormProps {
  page: LandingPage;
  client: Client;
  selectedVariant?: string;
  selectedSize?: string;
}

export default function OrderForm({ page, client, selectedVariant, selectedSize }: OrderFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(WILAYAS[15].nameAr); // Default to Alger
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const theme = COLOR_PRESETS[page.color_theme] || COLOR_PRESETS.green;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!/^0[567][0-9]{8}$/.test(cleanedPhone) && !/^\+213[567][0-9]{8}$/.test(cleanedPhone)) {
      setError('يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0555123456 أو 0666987654)');
      return;
    }

    setLoading(true);

    try {
      const selectedWilayaObj = WILAYAS.find(w => w.nameAr === city) || WILAYAS[15];
      const totalPrice = (page.price * quantity) + selectedWilayaObj.shippingFee;

      // Facebook Pixel InitiateCheckout event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          value: totalPrice,
          currency: 'DZD',
          num_items: quantity,
          content_type: 'product',
        });
      }

      // GA4 Order Submitted event
      trackEvent('order_submitted', {
        client_slug: client.slug,
        page_slug: page.slug,
        value: totalPrice,
        currency: 'DZD',
        quantity: quantity,
      });

      // Create order
      await db.orders.create({
        landing_page_id: page.id,
        client_id: client.id,
        name: name.trim(),
        phone: cleanedPhone,
        city,
        size: selectedSize || undefined,
        quantity,
        product_name: page.product_name,
        source: page.slug,
        status: 'pending'
      });

      setSuccess(true);
      // Reset form
      setName('');
      setPhone('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const selectedWilayaObj = WILAYAS.find(w => w.nameAr === city) || WILAYAS[15];
  const totalPrice = (page.price * quantity) + selectedWilayaObj.shippingFee;

  if (success) {
    return (
      <div id="checkout-form" className="bg-white border-2 border-green-500 rounded-3xl p-8 text-center shadow-xl max-w-xl mx-auto my-8 animate-fade-in" dir="rtl">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">تهانينا! تم تسجيل طلبك بنجاح ✅</h3>
        <p className="text-gray-600 mb-6">
          لقد تلقينا طلبك لـ <span className="font-bold text-gray-800">{page.product_name}</span>.
          سيتصل بك فريق العمل هاتفياً في أقرب وقت لتأكيد الطلب وترتيب شحنه إليك.
        </p>
        <div className="bg-slate-50 rounded-2xl p-4 text-right mb-6 border border-slate-100">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>الكمية المطلوبة:</span>
            <span className="font-bold text-gray-800">{quantity}</span>
          </div>
          {selectedSize && (
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>المقاس المختار:</span>
              <span className="font-bold text-gray-800">{selectedSize}</span>
            </div>
          )}
          {selectedVariant && (
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>الخيار المحدد:</span>
              <span className="font-bold text-gray-800">{selectedVariant}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>ولاية التوصيل:</span>
            <span className="font-bold text-gray-800">{city}</span>
          </div>
          <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-lg text-green-700">
            <span>المبلغ الإجمالي (مع التوصيل):</span>
            <span>{totalPrice.toLocaleString()} دج</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">يرجى إبقاء هاتفك مشتغلاً وقريباً منك لتلقي مكالمة التأكيد.</p>
      </div>
    );
  }

  return (
    <div id="checkout-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-xl max-w-xl mx-auto border border-slate-100" dir="rtl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <ShoppingCart className="w-6 h-6" style={{ color: theme.primary }} />
          <span>استمارة طلب الشراء السريع</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">الدفع عند الاستلام والتوصيل متوفر لجميع الولايات 🇩🇿</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل (الثنائي):</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': theme.primary } as any}
            placeholder="مثال: محمد بلقاسم"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف (الجزائر):</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm" dir="ltr">🇩🇿</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 text-right"
              style={{ '--tw-ring-color': theme.primary } as any}
              placeholder="05XXXXXXXX أو 06XXXXXXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الولاية:</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': theme.primary } as any}
            >
              {WILAYAS.map((w) => (
                <option key={w.id} value={w.nameAr}>
                  {w.code} - {w.nameAr} ({w.nameFr})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الكمية:</label>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-[46px]">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-full bg-slate-50 text-gray-600 font-bold hover:bg-slate-100 transition"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-gray-800">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                className="w-12 h-full bg-slate-50 text-gray-600 font-bold hover:bg-slate-100 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary Panel */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>سعر المنتج:</span>
            <span className="font-bold text-gray-800">{page.price.toLocaleString()} دج</span>
          </div>
          <div className="flex justify-between">
            <span>سعر التوصيل للولاية ({city}):</span>
            <span className="font-bold text-gray-800">{selectedWilayaObj.shippingFee.toLocaleString()} دج</span>
          </div>
          <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-base" style={{ color: theme.primary }}>
            <span>السعر الإجمالي عند الاستلام:</span>
            <span>{totalPrice.toLocaleString()} دج</span>
          </div>
        </div>

        {/* Reassurance Indicators */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 py-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>شحن سريع للباب أو للمكتب</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>الدفع عند معاينة السلعة</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg text-lg flex items-center justify-center gap-2 transform active:scale-95 duration-150 cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: theme.primary }}
        >
          {loading ? (
            <span className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>اضغط هنا لتأكيد الطلب الآن</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
