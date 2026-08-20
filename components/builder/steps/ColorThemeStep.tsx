'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { getPresetsForTemplate } from '../types';
import type { WizardData } from '../types';

export function ColorThemeStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  const presets = getPresetsForTemplate(data.templateId);

  // If the current selection doesn't belong to this template's preset
  // list — first time through, or the user went back and switched
  // templates — snap to that template's first preset instead of leaving
  // an invalid/stale id in state.
  useEffect(() => {
    if (!presets.some((p) => p.id === data.colorTheme)) {
      update({ colorTheme: presets[0]?.id || '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.templateId]);

  return (
    <div className="space-y-4 py-2">
      <h2 className="text-lg font-black text-slate-900 text-center mb-1">اختر لون صفحتك</h2>
      <p className="text-xs text-slate-400 text-center -mt-2 mb-2">اختر التركيبة اللونية التي تناسب منتجك</p>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((c) => {
          const selected = data.colorTheme === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ colorTheme: c.id })}
              className={`rounded-2xl overflow-hidden border-2 transition text-right ${
                selected ? 'border-slate-900 scale-[1.02]' : 'border-slate-100'
              }`}
            >
              {/* Visual preview only — primary as the main block, accent
                  as a stripe, so the pairing is legible without any hex
                  text ever being shown to the user. */}
              <div className="h-16 flex">
                <div
                  className="flex-[3] flex items-center justify-center"
                  style={{ backgroundColor: c.primary }}
                >
                  <span
                    className="text-[11px] font-bold truncate px-2"
                    style={{ color: c.accent }}
                  >
                    {data.productName || 'منتجك'}
                  </span>
                </div>
                <div className="flex-1" style={{ backgroundColor: c.accent }} />
              </div>

              <div className="py-2 px-2 bg-white flex items-center justify-center gap-1.5">
                {selected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                <span className="text-[11px] font-bold text-slate-600">{c.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
