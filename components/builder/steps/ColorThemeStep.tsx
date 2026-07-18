'use client';

import { COLOR_THEMES } from '../types';
import type { WizardData } from '../types';

export function ColorThemeStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-4 py-2">
      <h2 className="text-lg font-black text-slate-900 text-center mb-1">اختر لون صفحتك</h2>

      <div className="grid grid-cols-3 gap-3">
        {COLOR_THEMES.map((c) => {
          const selected = data.colorTheme === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ colorTheme: c.id })}
              className={`rounded-2xl overflow-hidden border-2 transition ${selected ? 'border-slate-900 scale-105' : 'border-slate-100'}`}
            >
              <div className="h-14 flex items-center justify-center" style={{ backgroundColor: c.hex }}>
                <span className="text-white text-[10px] font-bold">{data.productName || 'منتجك'}</span>
              </div>
              <div className="py-2 text-center bg-white">
                <span className="text-[10px] font-bold text-slate-600">{c.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
