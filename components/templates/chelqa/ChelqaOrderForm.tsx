'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitOrder, type OrderState } from '../../../app/[clientSlug]/[pageSlug]/actions';
import { WILAYAS } from '../../../lib/wilayas';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

interface ChelqaOrderFormProps {
  pageId: string;
  clientId: string;
  pageSlug: string;
  productName: string;
  price: number;
  sizes: string[];
}

const initialState: OrderState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="submit-btn cta-btn" disabled={pending}>
      {pending ? '⏳ جاري إرسال الطلب...' : '🛍️ تأكيدي الطلب — الدفع عند الاستلام'}
    </button>
  );
}

export function ChelqaOrderForm({ pageId, clientId, pageSlug, productName, price, sizes }: ChelqaOrderFormProps) {
  const [state, formAction] = useFormState(submitOrder, initialState);
  const [city, setCity] = useState(WILAYAS[15]?.nameAr || 'الجزائر');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const wilaya = WILAYAS.find((w) => w.nameAr === city) || WILAYAS[15];
  const totalPrice = price * quantity + (wilaya?.shippingFee || 0);
  const sizeText = selectedSizes.map((s) => `${s}`).join(' + ');

  const handleSizeClick = (size: string) => {
    setSelectedSizes((prev) => {
      const next = prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size];
      setQuantity(next.length > 0 ? next.length : 1);
      return next;
    });
  };

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
      <section className="order-section" id="order">
        <div className="order-form-wrap reveal">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ marginBottom: '12px' }}>تهانينا! تم تسجيل طلبك بنجاح ✅</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
              سيتصل بك فريقنا هاتفياً في أقرب وقت لتأكيد الطلب.
            </p>
            {state.summary && (
              <div className="order-summary">
                <div className="summary-row">
                  <span>الكمية</span>
                  <span>{state.summary.quantity}</span>
                </div>
                <div className="summary-row">
                  <span>ولاية التوصيل</span>
                  <span>{state.summary.city}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-total">
                  <span>المجموع</span>
                  <span>{state.summary.totalPrice.toLocaleString('ar-DZ')} دج</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-section" id="order">
      <div className="section-header reveal">
        <div className="section-tag">🛒 اطلبي الآن</div>
        <h2 className="section-title">أكملي <span>طلبك</span> بسهولة</h2>
        <p className="section-desc">عبّئي المعلومات وسنتصل بك لتأكيد الطلب — الدفع عند الاستلام</p>
      </div>
      <div className="order-form-wrap reveal">
        <form action={formAction}>
          <input type="hidden" name="page_id" value={pageId} />
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="page_slug" value={pageSlug} />
          <input type="hidden" name="product_name" value={productName} />
          <input type="hidden" name="city" value={city} />
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="size" value={sizeText} />

          {state.error && (
            <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px' }}>
              ⚠️ {state.error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="f-name">الاسم الكامل <span className="req">*</span></label>
              <input type="text" name="name" placeholder="مثال: فاطمة بن عمر" id="f-name" required />
            </div>
            <div className="form-group">
              <label htmlFor="f-phone">رقم الهاتف <span className="req">*</span></label>
              <input type="tel" name="phone" placeholder="0561 03 98 51" id="f-phone" dir="ltr" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="f-wilaya">الولاية <span className="req">*</span></label>
              <select id="f-wilaya" value={city} onChange={(e) => setCity(e.target.value)}>
                {WILAYAS.map((w) => (
                  <option key={w.id} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                ))}
              </select>
            </div>
          </div>

          {sizes.length > 0 && (
            <div className="form-size-row">
              <label>المقاس المطلوب <span className="req">*</span></label>
              <div className="form-sizes">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`form-size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => handleSizeClick(size)}
                    aria-label={`مقاس ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-qty-row">
            <label>الكمية <span className="req">*</span></label>
            <div className="qty-wrap">
              <button type="button" className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span className="qty-value">{quantity}</span>
              <button type="button" className="qty-btn" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>سعر القطعة</span>
              <span>{price.toLocaleString('ar-DZ')} دج</span>
            </div>
            <div className="summary-row">
              <span>سعر التوصيل ({city})</span>
              <span>{wilaya?.shippingFee.toLocaleString('ar-DZ')} دج</span>
            </div>
            <div className="summary-row">
              <span>الكمية</span>
              <span>× {quantity}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>المجموع</span>
              <span>{totalPrice.toLocaleString('ar-DZ')} دج</span>
            </div>
          </div>

          <SubmitButton />
        </form>
        <div className="form-assurance">
          <span className="assurance-item">🔒 بياناتك آمنة معنا</span>
          <span className="assurance-item">💳 دفع عند الاستلام</span>
          <span className="assurance-item">🚚 توصيل سريع</span>
          <span className="assurance-item">✅ ضمان الجودة</span>
        </div>
      </div>
    </section>
  );
}
