'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { updateLandingPageInfo } from '@/app/dashboard/actions';
import { ArrowRight } from 'lucide-react';

const initialState = { error: undefined as string | undefined };

interface PageData {
  id: string;
  product_name: string;
  price: number;
  original_price: number | null;
  description: string | null;
  whatsapp: string | null;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl transition"
    >
      {pending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
    </button>
  );
}

export function EditPageForm({ page }: { page: PageData }) {
  const [state, formAction] = useFormState(updateLandingPageInfo, initialState);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Link href="/dashboard/pages" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition w-fit">
        <ArrowRight className="w-3.5 h-3.5" />
        <span>رجوع لصفحاتي</span>
      </Link>

      <div>
        <h1 className="text-xl font-black text-slate-900">تعديل الصفحة</h1>
        <p className="text-xs text-slate-400 mt-1">
          لتعديل القالب أو الصور أو التقييمات، استخدم الخيارات في صفحاتي — هذا النموذج للمعلومات الأساسية فقط
        </p>
      </div>

      <form action={formAction} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
        <input type="hidden" name="page_id" value={page.id} />

        {state.error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="product_name" className="text-xs font-bold text-slate-700">اسم المنتج</label>
          <input
            id="product_name"
            name="product_name"
            defaultValue={page.product_name}
            required
            maxLength={100}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="price" className="text-xs font-bold text-slate-700">السعر الحالي (دج)</label>
            <input
              id="price"
              name="price"
              type="number"
              min={1}
              defaultValue={page.price}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="original_price" className="text-xs font-bold text-slate-700">السعر الأصلي (اختياري)</label>
            <input
              id="original_price"
              name="original_price"
              type="number"
              min={1}
              defaultValue={page.original_price || ''}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-bold text-slate-700">وصف المنتج</label>
          <textarea
            id="description"
            name="description"
            defaultValue={page.description || ''}
            maxLength={300}
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="whatsapp" className="text-xs font-bold text-slate-700">رقم واتساب (اختياري)</label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            dir="ltr"
            defaultValue={page.whatsapp || ''}
            placeholder="+213XXXXXXXXX"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left focus:outline-none focus:border-emerald-400"
          />
        </div>

        <SaveButton />
      </form>
    </div>
  );
}