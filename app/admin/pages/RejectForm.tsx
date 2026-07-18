'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { rejectPage } from '../../admin/actions';
import { XCircle } from 'lucide-react';

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined };

function SubmitRejectButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs font-black px-4 py-2 rounded-xl transition"
    >
      {pending ? 'جاري الرفض...' : 'تأكيد الرفض'}
    </button>
  );
}

export function RejectForm({ pageId }: { pageId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(rejectPage, initialState);

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
        className="flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-500 text-xs font-black px-4 py-2 rounded-xl transition"
      >
        <XCircle className="w-3.5 h-3.5" />
        <span>رفض</span>
      </button>
    );
  }

  return (
    <form action={formAction} className="flex-1 flex items-center gap-2">
      <input type="hidden" name="page_id" value={pageId} />
      <input
        type="text"
        name="reason"
        required
        placeholder="سبب الرفض..."
        className="flex-1 border border-red-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-400"
        autoFocus
      />
      <SubmitRejectButton />
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-[11px] text-slate-400 hover:text-slate-600 px-2"
      >
        إلغاء
      </button>
      {state.error && (
        <span className="text-[11px] text-red-500 font-bold">{state.error}</span>
      )}
    </form>
  );
}
