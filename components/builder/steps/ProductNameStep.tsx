'use client';

import type { WizardData } from '../types';

export function ProductNameStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-4 text-center py-6">
      <h2 className="text-lg font-black text-slate-900">ما اسم منتجك؟</h2>
      <input
        autoFocus
        value={data.productName}
        onChange={(e) => update({ productName: e.target.value.slice(0, 100) })}
        maxLength={100}
        placeholder="مثال: طقم أطفال الربيع"
        className="w-full text-center text-lg font-bold border-b-2 border-slate-200 focus:border-emerald-500 focus:outline-none py-3 transition"
      />
      <p className="text-[11px] text-slate-400">{data.productName.length} / 100</p>
    </div>
  );
}
