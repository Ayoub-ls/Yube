// src/components/dashboard/KPICards.tsx
import { ShoppingBag, CheckCircle, TrendingUp, CreditCard } from 'lucide-react';

interface KPICardsProps {
  stats: {
    totalOrders: number;
    deliveredOrders: number;
    confirmedOrders: number;
    totalSales: number;
    conversionRate: number;
  };
}

export default function KPICards({ stats }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-right">
      {/* Total Orders Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">إجمالي الطلبيات</span>
          <h3 className="text-xl md:text-2xl font-black text-gray-800">{stats.totalOrders}</h3>
        </div>
      </div>

      {/* Confirmed Orders Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">الطلبيات المؤكدة</span>
          <h3 className="text-xl md:text-2xl font-black text-gray-800">{stats.confirmedOrders}</h3>
        </div>
      </div>

      {/* Delivered Orders Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">الطلبيات المسلمة</span>
          <h3 className="text-xl md:text-2xl font-black text-gray-800">{stats.deliveredOrders}</h3>
        </div>
      </div>

      {/* Total Sales Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-medium">إجمالي المبيعات</span>
          <h3 className="text-xl md:text-2xl font-black text-gray-800">{stats.totalSales.toLocaleString()} دج</h3>
        </div>
      </div>

      {/* Conversion Rate Alert Panel */}
      <div className="col-span-2 lg:col-span-4 bg-emerald-50 border border-emerald-100/50 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs py-1 px-3 rounded-full">أداء ممتاز</span>
          <p className="text-xs md:text-sm text-emerald-800 font-medium">معدل تحويل الطلبات المسلمة الحالي هو <strong className="font-extrabold">{stats.conversionRate}%</strong> مقارنة بإجمالي الطلبات الواردة.</p>
        </div>
      </div>
    </div>
  );
}
