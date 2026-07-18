'use client';

import { Layout, Award, Heart, Shirt, Gem, Headphones } from 'lucide-react';
import type { WizardData } from '../types';

const TEMPLATES = [
  { id: 'simple', name: 'صفحة بسيطة', icon: Layout, image: '../../../simple_preview.png' },
  { id: 'premium', name: 'صفحة متميزة', icon: Award, image: '../../../premium_preview.png' },
  { id: 'chelqa', name: 'أزياء وموضة', icon: Heart, image: '../../../chelqa_preview.png' },
  { id: 'pairdz', name: 'ملابس أطفال', icon: Shirt, image: '../../../pairdz_preview.png' },
  { id: 'rita', name: 'فخامة وأناقة', icon: Gem, image: '../../../rita_preview.png' },
  { id: 'gadget', name: 'أجهزة ذكية وسماعات', icon: Headphones, image: '../../../gadget_preview.png' },
];

export function TemplateStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-4 text-center">
      <div>
        <h2 className="text-lg font-black text-slate-900">اختر القالب الأنسب</h2>
        <p className="text-xs text-slate-400 mt-1">اختر من بين قوالبنا المصممة لتناسب أنواع السلع المختلفة</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          const selected = data.templateId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ templateId: t.id })}
              className={`text-right p-2 rounded-2xl border-2 transition flex flex-col items-center gap-2 justify-center ${selected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200'
                }`}
            >
              <div className={`w-full  rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                <img className='object-fill w-full h-full' src={t.image} alt="" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-slate-800">{t.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
