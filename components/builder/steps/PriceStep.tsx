'use client';

import type { WizardData } from '../types';

export function PriceStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  const price = parseInt(data.price, 10) || 0;
  const originalPrice = parseInt(data.originalPrice, 10) || 0;
  const hasDiscount = originalPrice > price && price > 0;
  const savingsPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="space-y-5 py-4">
      <h2 className="text-lg font-black text-slate-900 text-center">حدد سعر منتجك</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">السعر الحالي *</label>
          <input
            type="number"
            min={1}
            value={data.price}
            onChange={(e) => update({ price: e.target.value })}
            placeholder="2900"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">السعر الأصلي (اختياري)</label>
          <input
            type="number"
            min={1}
            value={data.originalPrice}
            onChange={(e) => update({ originalPrice: e.target.value })}
            placeholder="3800"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {price > 0 && (
        <div className="bg-slate-50 rounded-2xl p-5 text-center space-y-2 border border-slate-100">
          <div className="flex items-center justify-center gap-3">
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">{originalPrice.toLocaleString('ar-DZ')} دج</span>
            )}
            <span className="text-2xl font-black text-emerald-600">{price.toLocaleString('ar-DZ')} دج</span>
          </div>
          {hasDiscount && (
            <span className="inline-block bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
              وفّر {savingsPercent}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
