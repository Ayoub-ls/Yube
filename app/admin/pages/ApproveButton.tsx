'use client';

import { approvePage } from '../../admin/actions';
import { useFormStatus } from 'react-dom';
import { CheckCircle2 } from 'lucide-react';

function Inner() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>{pending ? 'جاري النشر...' : 'نشر'}</span>
    </button>
  );
}

export function ApproveButton({ pageId }: { pageId: string }) {
  return (
    <form action={approvePage.bind(null, pageId)}>
      <Inner />
    </form>
  );
}
