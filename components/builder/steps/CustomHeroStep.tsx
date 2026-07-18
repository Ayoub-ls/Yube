'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { SIZE_SUGGESTIONS } from '../types';
import type { WizardData } from '../types';

export function CustomHeroStep({ data, update }: { data: WizardData; update: (patch: Partial<WizardData>) => void }) {
  const [newSize, setNewSize] = useState('');
  const suggestions = (SIZE_SUGGESTIONS[data.templateId] || []).filter((s) => !data.sizes.includes(s));

  const addSize = () => {
    const trimmed = newSize.trim();
    if (!trimmed) return;
    if (data.sizes.includes(trimmed)) {
      setNewSize('');
      return;
    }
    if (data.sizes.length >= 15) return; // sanity cap
    update({ sizes: [...data.sizes, trimmed] });
    setNewSize('');
  };

  const removeSize = (size: string) => {
    update({ sizes: data.sizes.filter((s) => s !== size) });
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="text-lg font-black text-slate-900 text-center">العنوان الرئيسي والمقاسات</h2>
        <p className="text-[11px] text-slate-400 text-center mt-1">
          خاص بهذا القالب — يظهر في أعلى الصفحة وفي استمارة الطلب
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">العنوان الرئيسي (اختياري)</label>
        <input
          value={data.headline}
          onChange={(e) => update({ headline: e.target.value.slice(0, 80) })}
          maxLength={80}
          placeholder={`مثال: أناقة تبدأ من متجرك`}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
        />
        <p className="text-[10px] text-slate-400">إذا تُرك فارغاً، سيُستخدم اسم المتجر تلقائياً</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">العنوان الفرعي (اختياري)</label>
        <textarea
          value={data.subheadline}
          onChange={(e) => update({ subheadline: e.target.value.slice(0, 160) })}
          maxLength={160}
          rows={2}
          placeholder="جملة قصيرة تشرح ما يميز منتجك"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none"
        />
        <p className="text-[10px] text-slate-400">إذا تُرك فارغاً، سيُستخدم وصف المنتج من الخطوة السابقة</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">المقاسات المتوفرة</label>
        <div className="flex flex-wrap gap-2">
          {data.sizes.map((size) => (
            <span
              key={size}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold pl-2 pr-3 py-1.5 rounded-full"
            >
              {size}
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="hover:text-red-500 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {data.sizes.length === 0 && (
            <span className="text-[11px] text-slate-400">لا توجد مقاسات — سيتم إخفاء اختيار المقاس في الصفحة</span>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] text-slate-400">اقتراحات سريعة:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => update({ sizes: [...data.sizes, size] })}
                  className="text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 px-2.5 py-1 rounded-full transition"
                >
                  + {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSize();
              }
            }}
            placeholder="أضف مقاس (مثال: S أو 38 أو 10 سنوات)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
          <button
            type="button"
            onClick={addSize}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-400">
          احذفي كل المقاسات إذا كان منتجك لا يحتاج اختيار مقاس
        </p>
      </div>
    </div>
  );
}
