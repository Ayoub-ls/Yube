// src/pages/DashboardOrders.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { Order, LandingPage } from '../types';
import OrdersTable from '../components/dashboard/OrdersTable';
import { ShoppingCart, RefreshCw } from 'lucide-react';

export default function DashboardOrders() {
  const navigate = useNavigate();
  const client = db.auth.getCurrentUser();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdersData = async () => {
    if (!client) return;
    try {
      const pList = await db.pages.list(client.id);
      const oList = await db.orders.list(client.id);
      setPages(pList);
      setOrders(oList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!client) {
      navigate('/auth/login');
      return;
    }
    fetchOrdersData();
  }, [client, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="border-4 border-emerald-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-emerald-600" />
            <span>إدارة طلبات المتجر 🛒</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">تفقد وتأكيد ومعالجة الطلبات الواردة مباشرة من استمارات صفحات الهبوط الخاصة بك.</p>
        </div>

        <button
          onClick={fetchOrdersData}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث الطلبات</span>
        </button>
      </div>

      {/* Orders Table Panel */}
      <OrdersTable 
        orders={orders} 
        pages={pages} 
        onRefresh={fetchOrdersData} 
      />
    </div>
  );
}
