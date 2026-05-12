import React, { useState } from 'react';
import { ShoppingCart, History, Info, Sparkles, ChevronRight, TrendingUp, Award, Clock } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import OrderDetailModal from '../orders/OrderDetailModal';

const ChatCustomerInsights = ({ customer, loading }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const handleViewOrder = async (order) => {
    setIsDetailLoading(true);
    setIsModalOpen(true);
    try {
      const detail = await axiosClient.get(`/orders/${order.id}`);
      setSelectedOrder(detail);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setSelectedOrder(order);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosClient.put(`/orders/${id}/status`, { status: newStatus });
      // Note: This only updates the local modal state, 
      // the parent component might need a refresh to update the list if needed
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };
  if (loading) return (
    <section className="w-80 flex flex-col border-l border-outline-variant/30 bg-surface-container-lowest h-full items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </section>
  );

  if (!customer) return null;

  return (
    <section className="w-80 flex flex-col border-l border-outline-variant/30 bg-surface-container-lowest overflow-y-auto custom-scrollbar h-full shrink-0">
      <div className="p-lg space-y-xl">

        {/* Profile Card - Premium Bento Style */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[32px] blur opacity-50 transition duration-1000"></div>
          <div className="relative bg-white rounded-[32px] p-lg shadow-sm border border-outline-variant/30 text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full animate-spin-slow opacity-20"></div>
              {customer.imageUrl ? (
                <img src={customer.imageUrl} alt="" className="w-24 h-24 rounded-full mx-auto shadow-2xl border-4 border-white object-cover relative z-10" />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto shadow-2xl border-4 border-white bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl relative z-10">
                  {customer.fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-outline-variant/20 z-20">
                <Award size={16} className="text-secondary" />
              </div>
            </div>

            <h3 className="text-lg font-black text-on-surface tracking-tight">{customer.fullName}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">
                {customer.socialPlatform || 'Khách hàng thân thiết'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-md mt-6">
              <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20">
                <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest block mb-1">Tổng mua</span>
                <span className="text-sm font-black text-primary">{parseFloat(customer.totalSpent || 0).toLocaleString()}đ</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20">
                <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest block mb-1">Số đơn hàng</span>
                <span className="text-sm font-black text-on-surface">{customer.orderCount || 0} đơn</span>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-md">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Đơn hàng gần đây</h4>
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <History size={14} />
            </div>
          </div>

          <div className="space-y-md">
            {customer?.orders && customer.orders.length > 0 ? (
              customer.orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleViewOrder(order)}
                  className="group bg-white border border-outline-variant/40 rounded-[24px] p-3 flex justify-between items-center hover:border-primary/40 transition-all duration-300 shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-black text-on-surface truncate tracking-tight block">#ORD-{order.id.toString().padStart(4, '0')}</span>
                    <span className="text-[9px] text-on-surface-variant font-medium mt-1 block">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[12px] text-primary font-black block">{parseFloat(order.totalAmount).toLocaleString()}đ</span>
                    <span className={`text-[8px] font-black uppercase tracking-tighter ${order.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {order.status === 'completed' ? 'Thành công' : 'Đang xử lý'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-outline-variant/30 rounded-[24px] opacity-40">
                <p className="text-[10px] font-bold uppercase tracking-widest">Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-md pb-lg">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Ghi chú nội bộ</h4>
            <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Sparkles size={14} />
            </div>
          </div>

          <div className="space-y-md">
            {customer.notes && customer.notes.length > 0 ? (
              customer.notes.map((note) => (
                <div key={note.id} className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10 relative overflow-hidden group">
                  <p className="text-[11px] text-on-surface leading-relaxed relative z-10 font-medium">{note.content}</p>
                  <div className="mt-3 flex items-center justify-between opacity-50 relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest">{note.staffName || 'Admin'}</span>
                    <span className="text-[8px]">{new Date(note.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 text-center opacity-40">
                <p className="text-[10px] font-bold uppercase tracking-widest">Không có ghi chú</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          loading={isDetailLoading}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </section>
  );
};

export default ChatCustomerInsights;
