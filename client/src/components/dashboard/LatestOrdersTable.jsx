import React from 'react';
import { Link } from 'react-router-dom';

const LatestOrdersTable = ({ orders }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed': return { label: 'Hoàn thành', class: 'bg-green-100 text-green-700' };
      case 'shipping': return { label: 'Đang giao', class: 'bg-blue-100 text-blue-700' };
      case 'confirmed': return { label: 'Đã xác nhận', class: 'bg-primary/10 text-primary' };
      case 'pending': return { label: 'Chờ xử lý', class: 'bg-orange-100 text-orange-700' };
      case 'cancelled': return { label: 'Đã hủy', class: 'bg-error/10 text-error' };
      default: return { label: status, class: 'bg-surface-variant text-on-surface-variant' };
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-8 flex justify-between items-center">
        <h3 className="text-xl font-black text-on-surface uppercase tracking-widest">Đơn hàng mới nhất</h3>
        <Link to="/orders" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all group">
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-45 transition-transform">arrow_outward</span>
        </Link>
      </div>

      <div className="flex-1 overflow-hidden px-2 pb-2">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">
            <tr>
              <th className="px-6 py-2">Mã đơn</th>
              <th className="px-6 py-2">Khách hàng</th>
              <th className="px-6 py-2 text-right">Tổng tiền</th>
              <th className="px-6 py-2 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map(order => {
              const status = getStatusInfo(order.status);
              return (
                <tr key={order.id} className="group hover:bg-surface-container-low transition-all duration-300">
                  <td className="px-6 py-4 rounded-l-2xl font-black text-primary">#ORD-{order.id}</td>
                  <td className="px-6 py-4 font-bold text-on-surface">{order.customer?.fullName}</td>
                  <td className="px-6 py-4 text-right font-black text-on-surface">{parseFloat(order.totalAmount).toLocaleString()}đ</td>
                  <td className="px-6 py-4 rounded-r-2xl text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.class}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestOrdersTable;
