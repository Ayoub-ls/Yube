'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateClientSettings } from '../actions';

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-black px-5 py-2.5 rounded-xl transition"
    >
      {pending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
    </button>
  );
}

export function SettingsForm({ client }: { client: any }) {
  const [state, formAction] = useFormState(updateClientSettings, initialState);

  return (
    <form action={formAction} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-800">معلومات المتجر</h2>

      {state.error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-4 py-2.5 rounded-xl">
          تم حفظ التغييرات بنجاح ✅
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="business_name" className="text-xs font-bold text-slate-700">اسم المتجر</label>
        <input
          id="business_name"
          name="business_name"
          defaultValue={client.business_name}
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="whatsapp" className="text-xs font-bold text-slate-700">رقم واتساب</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          dir="ltr"
          defaultValue={client.whatsapp || ''}
          placeholder="+213XXXXXXXXX"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left focus:outline-none focus:border-emerald-400"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="pixel_id" className="text-xs font-bold text-slate-700">Facebook Pixel ID</label>
        <input
          id="pixel_id"
          name="pixel_id"
          dir="ltr"
          defaultValue={client.pixel_id || ''}
          placeholder="مثال: 938366407778561"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left focus:outline-none focus:border-emerald-400"
        />
        <p className="text-[10px] text-slate-400">اختياري — يستخدم لقياس نتائج إعلاناتك على فيسبوك</p>
      </div>

      <SaveButton />
    </form>
  );
}
