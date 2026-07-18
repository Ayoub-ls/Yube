'use client';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
        <span>الخطوة {current + 1} من {total}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
