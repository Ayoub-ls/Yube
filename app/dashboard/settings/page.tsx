import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from './SettingsForm';
import { PasswordForm } from './PasswordForm';

export default async function DashboardSettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) redirect('/auth/login');

  const expiryLabel = client.plan_expires_at
    ? new Date(client.plan_expires_at).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'غير محدد';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">الإعدادات</h1>
        <p className="text-xs text-slate-400 mt-1">إدارة معلومات متجرك وحسابك</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">الخطة الحالية</span>
          <span className="text-sm font-black text-slate-800 capitalize">{client.plan}</span>
        </div>
        <div className="text-left">
          <span className="text-[10px] text-slate-400 font-bold block">تنتهي في</span>
          <span className="text-xs font-bold text-slate-600">{expiryLabel}</span>
        </div>
      </div>

      <SettingsForm client={client} />
      <PasswordForm />
    </div>
  );
}
