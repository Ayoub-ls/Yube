'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateClientPlan } from '../../admin/actions';

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
    >
      {pending ? '...' : 'حفظ'}
    </button>
  );
}

export function PlanEditor({ clientId, currentPlan }: { clientId: string; currentPlan: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(updateClientPlan, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
      >
        تعديل الخطة
      </button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-1.5">
      <input type="hidden" name="client_id" value={clientId} />
      <select
        name="plan"
        defaultValue={currentPlan}
        className="text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
      >
        <option value="trial">تجريبي</option>
        <option value="basic">أساسي</option>
        <option value="pro">احترافي</option>
        <option value="agency">وكالة</option>
      </select>
      <select
        name="extend_days"
        defaultValue="30"
        className="text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
      >
        <option value="0">بدون تمديد</option>
        <option value="7">+7 أيام</option>
        <option value="30">+30 يوم</option>
        <option value="365">+سنة</option>
      </select>
      <SaveButton />
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-[11px] text-slate-400 hover:text-slate-600 px-1"
      >
        ✕
      </button>
    </form>
  );
}
