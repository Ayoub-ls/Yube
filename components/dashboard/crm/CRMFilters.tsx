import React from 'react';
import { FilterOptions, OrderStatus } from '@/src/types/crm';
import { ALGERIAN_WILAYAS, PRODUCT_LIST } from './mockData';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  Calendar,
  MapPin,
  ShoppingBag
} from 'lucide-react';

interface CRMFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
  totalFilteredCount: number;
  cities?: string[];
  products?: string[];
}

const CRMFilters: React.FC<CRMFiltersProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  cities,
  products
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: OrderStatus | 'all') => {
    onFilterChange({ ...filters, status });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, city: e.target.value });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, product: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      dateRange: e.target.value as FilterOptions['dateRange']
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterOptions['sortBy']
    });
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      city: 'الكل',
      dateRange: 'all',
      product: 'الكل',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.city !== 'الكل' ||
    filters.dateRange !== 'all' ||
    filters.product !== 'الكل' ||
    filters.sortBy !== 'newest';

  const statusOptions: { id: OrderStatus | 'all'; label: string; countColor?: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'pending', label: 'قيد الانتظار' },
    { id: 'calling', label: 'جاري الاتصال' },
    { id: 'call_later', label: 'الاتصال لاحقاً' },
    { id: 'confirmed', label: 'مؤكد' },
    { id: 'cancelled', label: 'ملغى' },
    { id: 'delivered', label: 'تم التوصيل' }
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3.5">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="بحث بالاسم، رقم الهاتف، الولاية، أو رقم الطلب (#DZ-)..."
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Filter Count */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5">
          <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-lg">
            تم العثور على <span className="font-bold text-slate-900">{totalFilteredCount}</span> طلب
          </span>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>لوحة كانبان</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>قائمة الطلبات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Dropdowns & Status Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
        {/* Status Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5 overflow-x-auto py-1">
          {statusOptions.map((opt) => {
            const isActive = filters.status === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleStatusChange(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap ${isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Select Dropdowns */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
          {/* City Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.city}
              onChange={handleCityChange}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              {(cities || ALGERIAN_WILAYAS).map((w) => (
                <option key={w} value={w}>
                  {w === 'الكل' ? 'كل الولايات' : w}
                </option>
              ))}
            </select>
          </div>

          {/* Product Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.product}
              onChange={handleProductChange}
              className="bg-transparent focus:outline-none font-medium cursor-pointer max-w-[130px] truncate"
            >
              {(products || PRODUCT_LIST).map((p) => (
                <option key={p} value={p}>
                  {p === 'الكل' ? 'كل المنتجات' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.dateRange}
              onChange={handleDateChange}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">كل الأوقات</option>
              <option value="today">اليوم</option>
              <option value="yesterday">الأمس</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="highest_price">الأعلى سعراً</option>
              <option value="lowest_price">الأقل سعراً</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء الفلاتر</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMFilters;
