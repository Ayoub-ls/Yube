const PLAN_LABELS: Record<string, { label: string; className: string }> = {
  trial: { label: 'تجريبي', className: 'bg-slate-100 text-slate-500' },
  basic: { label: 'أساسي', className: 'bg-blue-50 text-blue-600' },
  pro: { label: 'احترافي', className: 'bg-emerald-50 text-emerald-600' },
  agency: { label: 'وكالة', className: 'bg-purple-50 text-purple-600' },
};

export function PlanBadge({ plan }: { plan: string }) {
  const info = PLAN_LABELS[plan] || PLAN_LABELS.trial;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${info.className}`}>
      {info.label}
    </span>
  );
}
