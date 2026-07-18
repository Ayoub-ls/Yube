import { createClient } from '../../lib/supabase/server';
import { FileText, Users, CheckCircle2 } from 'lucide-react';

export default async function AdminOverview() {
  const supabase = createClient();

  // Fixed: the original query checked status === 'pending', but the
  // schema's actual value is 'pending_review' — this silently always
  // returned 0 before.
  const { count: pendingCount } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review');

  const { count: liveCount } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'live');

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">مرحباً بك في لوحة الإشراف والمراجعة!</h1>
        <p className="text-xs text-slate-500">هذه اللوحة محمية على مستوى الخادم (middleware + layout + RLS).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold block">الصفحات المعلقة بالمراجعة</span>
            <span className="text-xl font-black text-slate-800">{pendingCount || 0}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold block">صفحات منشورة حالياً</span>
            <span className="text-xl font-black text-slate-800">{liveCount || 0}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي عدد المشتركين</span>
            <span className="text-xl font-black text-slate-800">{totalClients || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
