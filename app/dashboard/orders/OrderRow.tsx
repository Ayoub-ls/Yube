'use client';

import { useEffect, useRef, useTransition } from 'react';
import { updateOrderStatus } from '../actions';
import { trackEvent, trackPixelEvent } from '../../../lib/analytics';

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'تم التأكيد',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغاة',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  confirmed: 'text-blue-600 bg-blue-50',
  shipped: 'text-purple-600 bg-purple-50',
  delivered: 'text-emerald-600 bg-emerald-50',
  cancelled: 'text-red-600 bg-red-50',
};

export function OrderRow({ order, highlighted = false }: { order: any; highlighted?: boolean }) {
  const [pending, startTransition] = useTransition();
  const rowRef = useRef<HTMLTableRowElement>(null);

  // Came here from a "عرض الطلب" notification click — scroll it into
  // view once, on mount. Only ever runs for the one row whose id
  // matches ?order=, so this can't fight with normal page scrolling.
  useEffect(() => {
    if (highlighted && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (newStatus: string) => {
    // Purchase only fires here — the moment a store owner confirms an
    // order actually delivered — not on order submission (see
    // OrderForm.tsx, which fires InitiateCheckout instead). For a COD
    // business, "delivered" is the point money has actually changed
    // hands, which is the signal ad platforms needs.
    if (newStatus === 'delivered' && order.status !== 'delivered') {
      const price = order.landing_pages?.price || 0;
      const value = price * (order.quantity || 1);

      trackEvent('order_delivered', {
        value,
        currency: 'DZD',
        source: order.source,
      });
      trackPixelEvent('Purchase', {
        value,
        currency: 'DZD',
        content_ids: [order.id],
        content_type: 'product',
      });
    }

    startTransition(() => updateOrderStatus(order.id, newStatus));
  };

  return (
    <tr ref={rowRef} className={`${pending ? 'opacity-50' : ''} ${highlighted ? 'bg-amber-50' : ''}`}>
      <td className="px-4 py-3 font-bold text-slate-800">{order.name}</td>
      <td className="px-4 py-3 font-bold text-green-700" dir="ltr">{order.phone}</td>
      <td className="px-4 py-3 font-bold text-purple-700">{order.size || '—'}</td>
      <td className="px-4 py-3 font-bold text-slate-600">{order.product_name}</td>
      <td className="px-4 py-3 font-bold text-slate-500">{order.city || '—'}</td>
      <td className="px-4 py-3 font-bold text-blue-500">{order.quantity}</td>
      <td className="px-4 py-3 font-bold text-slate-400">
        {new Date(order.created_at).toLocaleDateString('ar-DZ')}
      </td>
      <td className="px-4 py-3">
        <select
          value={order.status}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value)}
          className={`text-xs text-black font-bold px-3 py-2 sm:text-[10px] sm:px-2 sm:py-1 rounded-lg border border-slate-100 rounded-sm focus:outline-none cursor-pointer max-w-[100px] sm:max-w-none truncate ${STATUS_COLORS[order.status] || 'bg-slate-50'}`}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}
