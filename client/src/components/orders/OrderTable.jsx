import React from 'react';
import { 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Package,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const OrderTable = ({ orders, onView, onDelete, pagination, currentPage, onPageChange, onSort, sortConfig, loading }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold"><Clock size={12} /> Chờ xử lý</span>;
      case 'confirmed':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold"><Package size={12} /> Đã xác nhận</span>;
      case 'shipping':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold"><Truck size={12} /> Đang giao</span>;
      case 'completed':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"><CheckCircle2 size={12} /> Hoàn thành</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error text-xs font-bold"><XCircle size={12} /> Đã hủy</span>;
      default: return null;
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-outline-variant/50">
      <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-16"></div></td>
      <td className="px-lg py-md">
        <div className="h-4 bg-surface-variant rounded w-32 mb-2"></div>
        <div className="h-3 bg-surface-variant/50 rounded w-24"></div>
      </td>
      <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-20"></div></td>
      <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-24"></div></td>
      <td className="px-lg py-md"><div className="h-3 bg-surface-variant rounded w-20"></div></td>
      <td className="px-lg py-md"><div className="h-6 bg-surface-variant rounded-full w-24"></div></td>
      <td className="px-lg py-md text-right"><div className="h-8 bg-surface-variant rounded-lg w-8 ml-auto"></div></td>
    </tr>
  );

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant relative">
      {/* Loading Bar at the top of the table */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-20">
          <div className="h-full bg-primary animate-progress-loop shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"></div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant">
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('id')}
              >
                <div className="flex items-center gap-2">Mã đơn {renderSortIcon('id')}</div>
              </th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('customer')}
              >
                <div className="flex items-center gap-2">Khách hàng {renderSortIcon('customer')}</div>
              </th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('createdAt')}
              >
                <div className="flex items-center gap-2">Ngày đặt {renderSortIcon('createdAt')}</div>
              </th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('totalAmount')}
              >
                <div className="flex items-center gap-2">Tổng tiền {renderSortIcon('totalAmount')}</div>
              </th>
              <th className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">Thanh toán</th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center gap-2">Trạng thái {renderSortIcon('status')}</div>
              </th>
              <th className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-outline-variant transition-opacity duration-300 ${loading && orders.length === 0 ? 'opacity-0' : 'opacity-100'}`}>
            {loading && orders.length === 0 ? (
              // Chỉ hiện Skeleton khi KHÔNG có dữ liệu nào (lần đầu load)
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onView(order)}
                  className={`hover:bg-primary/5 transition-all cursor-pointer group border-b border-outline-variant/50 last:border-0 ${loading ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}
                >
                  <td className="px-lg py-md font-bold text-primary">
                    #ORD-{order.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-lg py-md">
                    <div className="font-bold text-on-surface">{order.customer?.fullName}</div>
                    <div className="text-xs text-on-surface-variant">{order.customer?.phone || 'N/A'}</div>
                  </td>
                  <td className="px-lg py-md text-sm">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-lg py-md text-sm font-bold text-on-surface">
                    {parseFloat(order.totalAmount).toLocaleString()}đ
                  </td>
                  <td className="px-lg py-md">
                    <span className={`text-[10px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>
                  <td className="px-lg py-md">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-lg py-md text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onView(order); }}
                        className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant"
                        title="Chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}
                        className="p-2 hover:bg-error-container hover:text-error rounded-lg transition-colors text-on-surface-variant"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-lg py-20 text-center text-on-surface-variant italic">
                  Không tìm thấy đơn hàng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">Hiển thị {orders.length} trên {pagination?.total || 0} đơn hàng</p>
        <div className="flex items-center gap-sm">
          <button
            onClick={(e) => { e.stopPropagation(); onPageChange(currentPage - 1); }}
            disabled={currentPage === 1}
            className="p-1 border border-outline-variant rounded hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {[...Array(pagination?.totalPages || 1)].map((_, i) => {
            const page = i + 1;
            const totalPages = pagination?.totalPages || 1;
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <button
                  key={page}
                  onClick={(e) => { e.stopPropagation(); onPageChange(page); }}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${currentPage === page ? 'bg-primary text-on-primary shadow-sm' : 'hover:bg-surface-variant text-on-surface'}`}
                >
                  {page}
                </button>
              );
            }
            if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
              return <span key={page} className="text-xs text-on-surface-variant px-1">...</span>;
            }
            return null;
          })}

          <button
            onClick={(e) => { e.stopPropagation(); onPageChange(currentPage + 1); }}
            disabled={currentPage === (pagination?.totalPages || 1)}
            className="p-1 border border-outline-variant rounded hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
