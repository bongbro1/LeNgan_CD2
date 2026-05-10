import React from 'react';
import { Filter, Plus, ChevronLeft, ChevronRight, Facebook, Instagram, MessageCircle, Eye, Search, Edit2, Trash2 } from 'lucide-react';

const CustomerTable = ({ customers, selectedId, onSelect, pagination, currentPage, onPageChange, onSearch, searchTerm, filters, onFilterChange, onAdd, onEdit, onDelete }) => {
  const [localSearch, setLocalSearch] = React.useState(searchTerm);

  // Cập nhật localSearch khi searchTerm từ bên ngoài thay đổi (ví dụ khi reset filter)
  React.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Xử lý Debounce: Sau 2s không gõ nữa thì mới gọi hàm onSearch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearch(localSearch);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [localSearch, onSearch, searchTerm]);

  // Xử lý khi nhấn phím Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(localSearch);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'facebook': return <Facebook size={16} className="text-blue-600" />;
      case 'instagram': return <Instagram size={16} className="text-pink-600" />;
      case 'zalo': return <MessageCircle size={16} className="text-blue-400" />;
      default: return <MessageCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex-[1.5] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
      <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-lg font-bold text-on-surface">Danh sách khách hàng</h2>
        <div className="flex items-center gap-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
            <input 
              type="text" 
              placeholder="Tìm tên, sđt... (Enter để tìm)" 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-48 md:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={18} />
            <select 
              value={filters.platform}
              onChange={(e) => onFilterChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-outline-variant rounded-lg text-sm font-medium bg-surface-container-lowest hover:bg-surface-variant transition-colors appearance-none cursor-pointer outline-none focus:border-primary"
            >
              <option value="">Tất cả nền tảng</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Zalo">Zalo</option>
            </select>
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center gap-xs px-md py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity active:scale-95 transition-all"
          >
            <Plus size={18} />
            Khách hàng mới
          </button>
        </div>
      </div>

      <div className="overflow-auto flex-grow custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-on-surface-variant text-[10px] font-black uppercase tracking-widest sticky top-0 z-20">
            <tr>
              <th className="px-lg py-4 bg-surface-container-low">Khách hàng</th>
              <th className="px-md py-4 bg-surface-container-low">Nền tảng</th>
              <th className="px-md py-4 bg-surface-container-low text-center">Đơn hàng</th>
              <th className="px-md py-4 bg-surface-container-low text-right">Tổng chi</th>
              <th className="px-lg py-4 bg-surface-container-low text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onSelect(customer)}
                className={`transition-colors cursor-pointer group ${selectedId === customer.id
                    ? 'bg-surface-container-low ring-2 ring-primary ring-inset relative z-10'
                    : 'hover:bg-surface-container-lowest'
                  }`}
              >
                <td className="px-lg py-4">
                  <div className="flex items-center gap-md">
                    {customer.imageUrl ? (
                      <img src={customer.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                        {customer.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{customer.fullName}</span>
                      <span className="text-xs text-on-surface-variant">{customer.phone || customer.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-md py-4">
                  <div className="flex items-center gap-xs text-on-surface-variant">
                    {getPlatformIcon(customer.socialPlatform)}
                    <span className="text-xs capitalize">{customer.socialPlatform || 'Facebook'}</span>
                  </div>
                </td>
                <td className="px-md py-4 text-center">
                  <span className="text-sm font-medium text-on-surface">{customer._count?.orders || 0}</span>
                </td>
                <td className="px-md py-4 text-right">
                  <span className="text-sm font-bold text-on-surface">{(customer.totalSpend || 0).toLocaleString()}đ</span>
                </td>
                <td className="px-lg py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(customer); }}
                      className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-all"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(customer.id); }}
                      className="p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                      title="Xóa khách hàng"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-lg py-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-low mt-auto">
        <span className="text-xs text-on-surface-variant font-medium">Hiển thị {customers.length} trên {pagination?.total || 0} khách hàng</span>
        <div className="flex gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onPageChange(Math.max(1, currentPage - 1)); }}
            disabled={currentPage === 1}
            className="p-1 hover:bg-surface-variant rounded border border-outline-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          {[...Array(pagination?.totalPages || 1)].map((_, i) => (
            <button 
              key={i + 1}
              onClick={(e) => { e.stopPropagation(); onPageChange(i + 1); }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                currentPage === i + 1 
                ? 'bg-primary text-on-primary' 
                : 'hover:bg-surface-variant text-on-surface'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            onClick={(e) => { e.stopPropagation(); onPageChange(Math.min(pagination?.totalPages || 1, currentPage + 1)); }}
            disabled={currentPage === (pagination?.totalPages || 1)}
            className="p-1 hover:bg-surface-variant rounded border border-outline-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
