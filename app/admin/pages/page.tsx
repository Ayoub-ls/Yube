import { getPendingReviewPages } from '../../../lib/data';
import { ApproveButton } from './ApproveButton';
import { RejectForm } from './RejectForm';
import { ExternalLink } from 'lucide-react';

const TEMPLATE_LABELS: Record<string, string> = {
  simple: 'صفحة بسيطة',
  multivariant: 'منتج بخيارات',
  premium: 'صفحة متميزة',
};

export default async function AdminPagesReview() {
  const pages = await getPendingReviewPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">مراجعة الصفحات</h1>
        <p className="text-xs text-slate-400 mt-1">
          {pages.length > 0
            ? `يوجد ${pages.length} صفحة بانتظار المراجعة`
            : 'لا توجد صفحات بانتظار المراجعة حالياً'}
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <p className="text-sm text-slate-400">كل الصفحات تمت مراجعتها ✅</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page: any) => {
            const clientInfo = page.clients;
            return (
              <div key={page.id} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">{page.product_name}</h3>
                    <p className="text-[11px] text-slate-400">
                      المتجر: <span className="font-bold text-slate-600">{clientInfo?.business_name || 'غير معروف'}</span>
                      {' · '}
                      القالب: {TEMPLATE_LABELS[page.template_id] || page.template_id}
                      {' · '}
                      السعر: {page.price?.toLocaleString('ar-DZ')} دج
                    </p>
                    {page.description && (
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{page.description}</p>
                    )}
                  </div>

                  {clientInfo?.slug && (
                    <a
                      href={`/${encodeURIComponent(clientInfo.slug)}/${encodeURIComponent(page.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 px-3 py-2 rounded-xl transition shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>معاينة</span>
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                  <ApproveButton pageId={page.id} />
                  <RejectForm pageId={page.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
