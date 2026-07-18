import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getClientPages } from '../../../lib/data';
import { deleteLandingPage } from '../actions';
import { CopyLinkButton } from '../../../components/CopyLinkButton';
import { getPlanConfig, checkPlanAllowsNewPage } from '../../../lib/plans';
import { Plus, ExternalLink, Trash2, Clock, CheckCircle2, XCircle, FileEdit, Zap, Lock } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; className: string; icon: any }> = {
  pending_review: { label: 'قيد المراجعة', className: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  live: { label: 'منشورة', className: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  rejected: { label: 'مرفوضة', className: 'bg-red-50 text-red-600 border-red-100', icon: XCircle },
  draft: { label: 'مسودة', className: 'bg-slate-100 text-slate-500 border-slate-200', icon: FileEdit },
};

const TEMPLATE_LABELS: Record<string, string> = {
  simple: 'صفحة بسيطة',
  multivariant: 'منتج بخيارات',
  premium: 'صفحة متميزة',
};

export default async function DashboardPagesList({
  searchParams,
}: {
  searchParams: { created?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) redirect('/auth/login');

  const pages = await getClientPages(client.id);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const plan = getPlanConfig(client.plan);
  const blockReason = checkPlanAllowsNewPage(client, pages.length);
  const canCreate = !blockReason;

  return (
    <div className="space-y-6">
      {searchParams.created && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-3 rounded-2xl">
          تم نشر صفحتك بنجاح ✅ يمكنك مشاركة رابطها الآن مباشرة.
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${canCreate ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
            {canCreate ? <Zap className="w-4.5 h-4.5" /> : <Lock className="w-4.5 h-4.5" />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">
              خطتك: <span className="text-emerald-600">{plan.label}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {plan.maxPages === null
                ? `${pages.length} صفحة (غير محدود)`
                : `${pages.length} من ${plan.maxPages} صفحات مستخدمة`}
            </p>
          </div>
        </div>
        {!canCreate && (
          <Link href="/pricing" className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 shrink-0">
            ترقية الخطة ←
          </Link>
        )}
      </div>

      {blockReason && (
        <div className="bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-4 py-3 rounded-2xl">
          ⚠️ {blockReason}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">صفحاتي</h1>
          <p className="text-xs text-slate-400 mt-1">إدارة جميع صفحات البيع الخاصة بمتجرك</p>
        </div>
        {canCreate ? (
          <Link
            href="/dashboard/pages/new"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء صفحة جديدة</span>
          </Link>
        ) : (
          <span
            className="flex items-center gap-1.5 bg-slate-100 text-slate-400 text-xs font-black px-4 py-2.5 rounded-xl cursor-not-allowed"
            title={blockReason || ''}
          >
            <Lock className="w-4 h-4" />
            <span>إنشاء صفحة جديدة</span>
          </span>
        )}
      </div>

      {pages.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3">
          <p className="text-sm text-slate-500">لا توجد صفحات بعد</p>
          {canCreate ? (
            <Link
              href="/dashboard/pages/new"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition"
            >
              إنشاء أول صفحة بيع
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-black px-4 py-2.5 rounded-xl transition"
            >
              ترقية الخطة للبدء
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pages.map((page) => {
            const statusInfo = STATUS_LABELS[page.status] || STATUS_LABELS.draft;
            const StatusIcon = statusInfo.icon;
            const publicUrl = `${appUrl}/${client.slug}/${page.slug}`;

            return (
              <div key={page.id} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{page.product_name}</h3>
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {TEMPLATE_LABELS[page.template_id] || page.template_id} · {page.price?.toLocaleString('ar-DZ')} دج
                    </p>
                  </div>

                  {(page.status === 'draft' || page.status === 'rejected') && (
                    <form action={deleteLandingPage.bind(null, page.id)}>
                      <button
                        type="submit"
                        className="text-slate-300 hover:text-red-500 transition p-1.5"
                        title="حذف الصفحة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>

                {page.status === 'rejected' && page.rejection_reason && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] text-red-600">
                    <span className="font-bold">سبب الرفض: </span>
                    {page.rejection_reason}
                  </div>
                )}

                {page.status === 'live' && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-600 truncate" dir="ltr">
                      {publicUrl}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-emerald-500 transition"
                        title="فتح الصفحة"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <CopyLinkButton url={publicUrl} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
