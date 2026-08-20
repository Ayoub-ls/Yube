'use client';

import { useState } from 'react';
import { activateSubscription } from '../actions';
import { Check, Loader2 } from 'lucide-react';

export function ActivateButton({ clientId, businessName }: { clientId: string; businessName: string }) {
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    const confirmed = window.confirm(`Activate this customer's 30-day Yube subscription?\n\nتفعيل اشتراك متجر: ${businessName} لمدة 30 يوماً؟`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await activateSubscription(clientId);
      if (res?.error) {
        alert(res.error);
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ غير متوقع أثناء تفعيل الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleActivate}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 shadow-sm"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري التفعيل...</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4" />
          <span>تفعيل الاشتراك</span>
        </>
      )}
    </button>
  );
}
