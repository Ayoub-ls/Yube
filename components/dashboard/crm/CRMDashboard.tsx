'use client';

import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, FilterOptions, StatsSummary, ReminderItem } from '@/src/types/crm';
import { INITIAL_ORDERS } from './mockData';
import CRMStats from './CRMStats';
import CRMFilters from './CRMFilters';
import CRMKanban from './CRMKanban';
import CRMOrderDetails from './CRMOrderDetails';
import CRMReminderModal from './CRMReminderModal';
import { createClient } from '@/lib/supabase/client';
import { WILAYAS } from '@/lib/wilayas';
import {
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Plus,
  RefreshCw,
  Bell,
  Sparkles,
  Zap,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface CRMDashboardProps {
  initialOrders: any[];
  clientId: string;
  landingPages: any[];
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({
  initialOrders,
  clientId,
  landingPages
}) => {
  const extractWilayaCode = (cityName: string): string => {
    const wilaya = WILAYAS.find(w => w.nameAr === cityName);
    return wilaya ? wilaya.code : '';
  };

  const mapDbOrder = (item: any): Order => {
    const images = item.landing_pages?.product_images || [];
    const productImage = images.length > 0 ? images[0] : '';
    const price = item.landing_pages?.price || 0;
    const quantity = item.quantity || 1;
    const shippingFee = item.shipping_fee || 0;

    return {
      id: item.id,
      orderNumber: `#DZ-${item.id.slice(0, 4).toUpperCase()}`,
      customerName: item.name,
      phone: item.phone,
      altPhone: item.alt_phone || undefined,
      productName: item.product_name || '',
      productImage: productImage,
      color: item.color || '',
      colorHex: undefined,
      size: item.size || 'Standard',
      quantity: quantity,
      price: price,
      shippingFee: shippingFee,
      totalAmount: (price * quantity) + shippingFee,
      city: item.city || '',
      wilayaCode: item.city ? extractWilayaCode(item.city) : '',
      address: item.address || '',
      deliveryType: item.delivery_type || 'home',
      creationDate: item.created_at,
      status: item.status || 'pending',
      priority: item.priority || 'normal',
      notes: Array.isArray(item.notes) ? item.notes : [],
      activities: Array.isArray(item.activities) ? item.activities : [],
      reminder: item.reminder || undefined,
      callAttempts: item.call_attempts || 0,
      lastCallAt: item.last_call_at || undefined,
      landingPage: item.source || ''
    };
  };

  // Map initial orders on mount
  const mappedInitialOrders = useMemo(() => {
    return initialOrders.map(mapDbOrder);
  }, [initialOrders]);

  const [orders, setOrders] = useState<Order[]>(mappedInitialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [reminderOrder, setReminderOrder] = useState<Order | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filter State
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    city: 'الكل',
    dateRange: 'all',
    product: 'الكل',
    sortBy: 'newest'
  });

  // Dynamically compute product and city lists for filters
  const uniqueProducts = useMemo(() => {
    const prods = orders.map(o => o.productName).filter(Boolean);
    return ['الكل', ...Array.from(new Set(prods))];
  }, [orders]);

  const uniqueCities = useMemo(() => {
    const cities = orders.map(o => o.city).filter(Boolean);
    return ['الكل', ...Array.from(new Set(cities))];
  }, [orders]);

  // Calculate Dynamic Stats Summary
  const statsSummary: StatsSummary = useMemo(() => {
    const totalOrders = orders.length;
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const callingCount = orders.filter((o) => o.status === 'calling').length;
    const callLaterCount = orders.filter((o) => o.status === 'call_later').length;
    const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
    const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

    // Closing Rate % = (Confirmed + Delivered) / Total * 100
    const successful = confirmedCount + deliveredCount;
    const closingRate = totalOrders > 0 ? Math.round((successful / totalOrders) * 100) : 0;

    // Total Confirmed Revenue
    const totalRevenue = orders
      .filter((o) => o.status === 'confirmed' || o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Pending Follow-ups (reminders or call_later)
    const pendingFollowUps = orders.filter(
      (o) => o.status === 'call_later' || (o.reminder && !o.reminder.completed)
    ).length;

    return {
      totalOrders,
      pendingCount,
      callingCount,
      callLaterCount,
      confirmedCount,
      cancelledCount,
      deliveredCount,
      closingRate,
      totalRevenue,
      pendingFollowUps,
      avgConfirmationTimeMinutes: 18
    };
  }, [orders]);

  // Filter and Sort Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Search Filter
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const matchesName = order.customerName.toLowerCase().includes(query);
          const matchesPhone = order.phone.includes(query);
          const matchesCity = order.city.toLowerCase().includes(query);
          const matchesNum = order.orderNumber.toLowerCase().includes(query);
          const matchesProd = order.productName.toLowerCase().includes(query);
          if (!matchesName && !matchesPhone && !matchesCity && !matchesNum && !matchesProd) {
            return false;
          }
        }

        // Status Filter
        if (filters.status !== 'all' && order.status !== filters.status) {
          return false;
        }

        // City Filter
        if (filters.city !== 'الكل' && order.city !== filters.city) {
          return false;
        }

        // Product Filter
        if (filters.product !== 'الكل' && order.productName !== filters.product) {
          return false;
        }

        // Date Filter
        if (filters.dateRange !== 'all') {
          const orderDate = new Date(order.creationDate);
          const now = new Date();
          if (filters.dateRange === 'today') {
            const isToday = orderDate.toDateString() === now.toDateString();
            if (!isToday) return false;
          } else if (filters.dateRange === 'yesterday') {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const isYesterday = orderDate.toDateString() === yesterday.toDateString();
            if (!isYesterday) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        } else if (filters.sortBy === 'oldest') {
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
        } else if (filters.sortBy === 'highest_price') {
          return b.totalAmount - a.totalAmount;
        } else if (filters.sortBy === 'lowest_price') {
          return a.totalAmount - b.totalAmount;
        }
        return 0;
      });
  }, [orders, filters]);

  // Handler: Select order to view details
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // Handler: Change status of order
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const statusLabels: Record<OrderStatus, string> = {
      pending: 'قيد الانتظار',
      calling: 'جاري الاتصال',
      call_later: 'الاتصال لاحقاً',
      confirmed: 'تأكيد الطلب',
      cancelled: 'إلغاء الطلب',
      delivered: 'تم التوصيل'
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      type: (newStatus === 'confirmed'
        ? 'confirmed'
        : newStatus === 'cancelled'
          ? 'cancelled'
          : newStatus === 'delivered'
            ? 'delivered'
            : 'called') as any,
      title: `تغيير الحالة إلى ${statusLabels[newStatus]}`,
      description: `تم تغيير حالة الطلب من قِبل موظف الخدمة إلى (${statusLabels[newStatus]})`,
      timestamp: new Date().toISOString(),
      actor: 'سارة - موظف التأكيد'
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status: newStatus,
            activities: [newActivity, ...ord.activities]
          };

          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder) {
      const updatedActivities = [newActivity, ...currentOrder.activities];
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          activities: updatedActivities
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating status in DB:', error);
        alert('فشل تحديث الحالة في قاعدة البيانات: ' + error.message);
      }
    }
  };

  // Handler: Add note to order
  const handleAddNote = async (orderId: string, noteText: string, tag?: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'موظف التأكيد',
      text: noteText,
      timestamp: new Date().toISOString(),
      tag
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'note_added' as const,
      title: 'إضافة ملاحظة جديدة',
      description: noteText,
      timestamp: new Date().toISOString(),
      actor: 'موظف التأكيد'
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            notes: [newNote, ...ord.notes],
            activities: [newActivity, ...ord.activities]
          };

          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder) {
      const updatedNotes = [newNote, ...currentOrder.notes];
      const updatedActivities = [newActivity, ...currentOrder.activities];
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({
          notes: updatedNotes,
          activities: updatedActivities
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error adding note in DB:', error);
        alert('فشل إضافة الملاحظة في قاعدة البيانات: ' + error.message);
      }
    }
  };

  // Handler: Open reminder modal
  const handleOpenReminderModal = (order: Order) => {
    setReminderOrder(order);
    setIsReminderOpen(true);
  };

  // Handler: Save reminder
  const handleSaveReminder = async (reminder: ReminderItem) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'reminder_set' as const,
      title: 'جدولة تذكير بالاتصال',
      description: `تذكير بتاريخ ${reminder.date} الساعة ${reminder.time} - السبب: ${reminder.reason}`,
      timestamp: new Date().toISOString(),
      actor: 'موظف التأكيد'
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === reminder.orderId) {
          const updated = {
            ...ord,
            status: 'call_later' as OrderStatus,
            reminder,
            activities: [newActivity, ...ord.activities]
          };

          if (selectedOrder?.id === ord.id) {
            setSelectedOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    const currentOrder = orders.find(o => o.id === reminder.orderId);
    if (currentOrder) {
      const updatedActivities = [newActivity, ...currentOrder.activities];
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'call_later',
          reminder,
          activities: updatedActivities
        })
        .eq('id', reminder.orderId);

      if (error) {
        console.error('Error saving reminder in DB:', error);
        alert('فشل حفظ التذكير في قاعدة البيانات: ' + error.message);
      }
    }
  };

  // Quick Action: Add New Mock Order from landing page
  const handleCreateMockOrder = async () => {
    if (!landingPages || landingPages.length === 0) {
      alert('يرجى إنشاء صفحة هبوط أولاً لمحاكاة الطلبات');
      return;
    }

    const lp = landingPages[Math.floor(Math.random() * landingPages.length)];
    const names = ['عمر فاروق', 'حمزة بلمختار', 'نسرين السعيد', 'ليلى دراجي'];
    const cities = ['الجزائر العاصمة', 'وهران', 'سطيف', 'البليدة'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    // Find wilaya shipping fee
    const wilaya = WILAYAS.find(w => w.nameAr === randomCity) || WILAYAS[15];
    const shippingFee = wilaya.shippingFee;

    const dbOrder = {
      landing_page_id: lp.id,
      client_id: clientId,
      name: randomName,
      phone: `05${Math.floor(10000000 + Math.random() * 90000000)}`,
      product_name: lp.product_name,
      city: randomCity,
      size: 'L',
      quantity: 1,
      source: 'simulated',
      status: 'pending',
      // CRM extra fields:
      delivery_type: 'home',
      priority: 'urgent',
      call_attempts: 0,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'النظام',
          text: 'تم محاكاة الطلب بنجاح في قاعدة البيانات',
          timestamp: new Date().toISOString(),
          tag: 'محاكاة'
        }
      ],
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'created',
          title: 'طلب محاكاة',
          description: 'تم إنشاء الطلب لأغراض الاختبار',
          timestamp: new Date().toISOString(),
          actor: 'النظام'
        }
      ],
      shipping_fee: shippingFee,
      color: 'أسود'
    };

    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .insert(dbOrder)
      .select('*, landing_pages(price, product_images)')
      .single();

    if (error) {
      console.error('Error creating mock order in DB:', error);
      alert('فشل إنشاء طلب محاكاة: ' + error.message);
      return;
    }

    if (data) {
      const mapped = mapDbOrder(data);
      setOrders(prev => [mapped, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-12 font-sans selection:bg-emerald-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 md:py-0 md:h-14 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Logo & Top Nav */}
          <div className="flex items-center justify-between md:justify-start gap-6 w-full md:w-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white shadow-xs">
                <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight font-mono">
                  CONFIRM.DZ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  تأكيد 🇩🇿
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-500">
              <a href="#" className="text-slate-900 border-b-2 border-slate-900 pb-0.5 font-bold">لوحة التحكم</a>
              <a href="#" className="hover:text-slate-900 transition-colors">الطلبات</a>
              <a href="#" className="hover:text-slate-900 transition-colors">العملاء</a>
              <a href="#" className="hover:text-slate-900 transition-colors">التقارير الإحصائية</a>
            </nav>
          </div>

          {/* Quick Actions & User Profile */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <button
              onClick={handleCreateMockOrder}
              className="px-3 py-2 md:py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 flex-1 md:flex-none"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>محاكاة طلب جديد</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setFilters({ ...filters, status: 'call_later' });
                }}
                className="p-2 md:p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors relative"
                title="التذكيرات والمتابعات المعلقة"
              >
                <Bell className="w-4 h-4" />
                {statsSummary.pendingFollowUps > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {statsSummary.pendingFollowUps}
                  </span>
                )}
              </button>

              <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                ي
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPI Stats Bar */}
        <section className="w-full">
          <CRMStats
            stats={statsSummary}
            onFilterStatus={(st) => setFilters({ ...filters, status: st as any })}
          />
        </section>

        {/* Filter Bar & View Switcher */}
        <section className="w-full">
          <CRMFilters
            filters={filters}
            onFilterChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFilteredCount={filteredOrders.length}
            cities={uniqueCities}
            products={uniqueProducts}
          />
        </section>

        {/* Kanban Board / List View */}
        <section className="w-full">
          <CRMKanban
            orders={filteredOrders}
            onSelectOrder={handleSelectOrder}
            onQuickStatusChange={handleUpdateStatus}
            onOpenReminder={handleOpenReminderModal}
            viewMode={viewMode}
          />
        </section>
      </main>

      {/* Slide-over Order Details Drawer */}
      <CRMOrderDetails
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onOpenReminderModal={handleOpenReminderModal}
      />

      {/* Reminder Schedule Modal */}
      {reminderOrder && (
        <CRMReminderModal
          order={reminderOrder}
          isOpen={isReminderOpen}
          onClose={() => setIsReminderOpen(false)}
          onSaveReminder={handleSaveReminder}
        />
      )}
    </div>
  );
};

export default CRMDashboard;
