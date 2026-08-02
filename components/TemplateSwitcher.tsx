'use client';

import { useState, useTransition } from 'react';
import { updateLandingPageTemplate } from '../app/dashboard/actions';
import { TEMPLATES } from './builder/templateCatalog';
import { Loader2 } from 'lucide-react';

export function TemplateSwitcher({ pageId, currentTemplateId }: { pageId: string; currentTemplateId: string }) {
    const [pending, startTransition] = useTransition();
    const [value, setValue] = useState(currentTemplateId);

    const handleChange = (newTemplateId: string) => {
        setValue(newTemplateId); // optimistic — reverts automatically on next server render if the update silently no-ops
        startTransition(() => updateLandingPageTemplate(pageId, newTemplateId));
    };

    return (
        <div className="flex items-center gap-1.5">
            <select
                value={value}
                disabled={pending}
                onChange={(e) => handleChange(e.target.value)}
                className="text-[11px] font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 border-0 rounded-lg px-2 py-1 focus:outline-none"
            >
                {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
            {pending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
        </div>
    );
}