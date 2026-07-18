'use client';

import { Phone } from 'lucide-react';
import type { WizardData } from '../types';

export function WhatsAppStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-3 py-8 text-center">
      <div className="flex justify-center">
        <div className="bg-emerald-50 p-4 rounded-full">
          <Phone className="w-8 h-8 text-emerald-500" />
        </div>
      </div>
      <h2 className="text-lg font-black text-slate-900">رقم واتساب للتواصل مع الزبائن</h2>
      <p className="text-xs text-slate-400">اختياري — يظهر كخيار تواصل إضافي في صفحتك</p>
      <input
        type="tel"
        dir="ltr"
        value={data.whatsapp}
        onChange={(e) => update({ whatsapp: e.target.value })}
        placeholder="+213XXXXXXXXX"
        className="w-full max-w-xs mx-auto text-center border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
      />
    </div>
  );
}
