import React from 'react';
import { Filter, Info, RotateCcw } from 'lucide-react';

const ProductFilter = ({ categories, filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-md shadow-sm flex flex-wrap gap-md items-center border border-outline-variant">
      <div className="flex-1 min-w-[200px] relative">
        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <select 
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full bg-transparent border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 min-w-[200px] relative">
        <Info size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <select 
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full bg-transparent border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="out_of_stock">Hết hàng</option>
          <option value="inactive">Ngừng kinh doanh</option>
        </select>
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

export default ProductFilter;
