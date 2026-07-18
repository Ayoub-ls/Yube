'use client';

import { useTransition } from 'react';
import { toggleClientStatus } from '../../admin/actions';

export function StatusToggle({ clientId, currentStatus }: { clientId: string; currentStatus: string }) {
  const [pending, startTransition] = useTransition();
  const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleClientStatus(clientId, nextStatus))}
      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
    >
      {pending ? '...' : currentStatus === 'active' ? 'إيقاف' : 'تفعيل'}
    </button>
  );
}
