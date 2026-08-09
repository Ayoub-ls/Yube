'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteLandingPage } from '@/app/dashboard/actions';

export function DeletePageButton({ pageId, productName }: { pageId: string; productName: string }) {
    const [confirming, setConfirming] = useState(false);
    const [pending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(() => deleteLandingPage(pageId));
    };

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2 py-1">
                <span className="text-[10px] font-bold text-red-600">حذف نهائياً؟</span>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={pending}
                    className="text-[10px] font-black text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-1"
                >
                    {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'نعم'}
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={pending}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                >
                    إلغاء
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-slate-300 hover:text-red-500 transition p-1.5"
            title={`حذف "${productName}"`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}