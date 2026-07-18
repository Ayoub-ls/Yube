// src/components/dashboard/Sidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../lib/db';
import { 
  Home, FileText, ShoppingCart, Settings, LogOut, ShieldAlert, Store
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const client = db.auth.getCurrentUser();
  const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';

  const handleSignOut = async () => {
    await db.auth.signOut();
    navigate('/auth/login');
  };

  const menuItems = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: Home },
    { name: 'صفحات الهبوط', path: '/dashboard/pages', icon: FileText },
    { name: 'إدارة الطلبيات', path: '/dashboard/orders', icon: ShoppingCart },
    { name: 'إعدادات المتجر', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between h-screen sticky top-0 border-l border-slate-800" dir="rtl">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-2 rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">Yube</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full block mt-0.5">منصة الهبوط الأولى</span>
          </div>
        </div>

        {/* Client Account Info Card */}
        {client && (
          <div className="p-4 mx-4 my-4 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">المتجر الحالي:</span>
            <h4 className="font-bold text-sm text-slate-200 truncate">{client.business_name}</h4>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800 text-[10px]">
              <span className="text-slate-400">الاشتراك الحالي:</span>
              <span className="bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full capitalize">{client.plan}</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 ${
                  Active 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Super Admin Panel Access */}
          {client?.email.toLowerCase() === adminEmail.toLowerCase() && (
            <Link
              to="/admin"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 ${
                location.pathname.startsWith('/admin')
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-amber-500 hover:text-white hover:bg-amber-950/20'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>إدارة المنصة (Super Admin)</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-red-400 hover:text-white hover:bg-red-950/20 rounded-xl text-sm font-bold transition duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
