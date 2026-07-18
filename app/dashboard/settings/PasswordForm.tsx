'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { changePassword } from '../actions';

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-black px-5 py-2.5 rounded-xl transition"
    >
      {pending ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useFormState(changePassword, initialState);

  return (
    <form action={formAction} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-800">تغيير كلمة المرور</h2>

      {state.error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-4 py-2.5 rounded-xl">
          تم تحديث كلمة المرور بنجاح ✅
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="new_password" className="text-xs font-bold text-slate-700">كلمة المرور الجديدة</label>
          <input
            id="new_password"
            name="new_password"
            type="password"
            required
            minLength={6}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirm_password" className="text-xs font-bold text-slate-700">تأكيد كلمة المرور</label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            minLength={6}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      <SaveButton />
    </form>
  );
}
