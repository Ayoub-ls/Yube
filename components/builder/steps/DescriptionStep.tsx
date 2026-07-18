'use client';

import type { WizardData } from '../types';

export function DescriptionStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-2 py-4">
      <h2 className="text-lg font-black text-slate-900 text-center mb-3">صفي منتجك بجملتين</h2>
      <textarea
        autoFocus
        value={data.description}
        onChange={(e) => update({ description: e.target.value.slice(0, 300) })}
        maxLength={300}
        rows={5}
        placeholder="مثال: طقم قماش تركي عالي الجودة، ناعم ومريح للأطفال من 2 إلى 16 سنة"
        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 resize-none"
      />
      <p className="text-[11px] text-slate-400 text-left">{data.description.length} / 300</p>
    </div>
  );
}
