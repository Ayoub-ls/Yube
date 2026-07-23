import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { checkIsAdmin } from '../../lib/data';
import { logout } from '../auth/actions';
import Link from 'next/link';
import { ShieldAlert, LogOut, LayoutGrid, FileText, Users } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white p-1.5 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">Yube لوحة الإدارة</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold">المشرف العام</span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 -mb-px overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
          <Link href="/admin" className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>نظرة عامة</span>
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0">
            <FileText className="w-3.5 h-3.5" />
            <span>مراجعة الصفحات</span>
          </Link>
          <Link href="/admin/clients" className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 border-b-2 border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0">
            <Users className="w-3.5 h-3.5" />
            <span>العملاء</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
