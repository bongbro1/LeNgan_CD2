import React, { useState, useEffect } from 'react';
import { Filter, Calendar, RotateCcw, Search } from 'lucide-react';

const OrderFilter = ({ onFilterChange, onReset, onSearch, filters }) => {
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Sync local search when filters.search changes (e.g., on reset)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    onFilterChange('search', value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-wrap gap-md items-center border border-outline-variant">
      <div className="flex-1 min-w-[200px] relative">
        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full bg-transparent border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Đang chờ xử lý</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao hàng</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="flex-1 min-w-[200px] relative">
        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <select
          value={filters.timeRange}
          onChange={(e) => onFilterChange('timeRange', e.target.value)}
          className="w-full bg-transparent border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        >
          <option value="">Tất cả thời gian</option>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
      </div>

      <div className="relative flex-1 min-w-[250px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Tìm theo mã đơn hoặc tên khách..."
          className="w-full bg-transparent border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={localSearch}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        onClick={onReset}
        className="px-md py-2 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-variant transition-colors flex items-center gap-sm"
      >
        <RotateCcw size={16} />
        Làm mới
      </button>
    </div>
  );
};

export default OrderFilter;
