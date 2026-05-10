import React from 'react';
import { X, User, MapPin, CreditCard, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, Package, ReceiptText, Phone, Mail } from 'lucide-react';

const OrderDetailModal = ({ isOpen, onClose, order, loading, onUpdateStatus }) => {
  if (!isOpen) return null;

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-md"></div>
      <div className="bg-white p-xl rounded-3xl shadow-2xl flex flex-col items-center z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Đang tải chi tiết...</p>
      </div>
    </div>
  );

  if (!order) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Chờ xử lý', border: 'border-amber-200' };
      case 'confirmed': return { icon: Package, color: 'text-primary', bg: 'bg-primary/10', label: 'Đã xác nhận', border: 'border-primary/20' };
      case 'shipping': return { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Đang giao hàng', border: 'border-blue-200' };
      case 'completed': return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Đã hoàn thành', border: 'border-emerald-200' };
      case 'cancelled': return { icon: XCircle, color: 'text-error', bg: 'bg-error/10', label: 'Đã hủy', border: 'border-error/20' };
      default: return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Không xác định', border: 'border-gray-200' };
    }
  };

  const status = getStatusConfig(order.status);
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 fade-in duration-300 border border-outline-variant/30">
        {/* Header with Status Banner */}
        <div className={`p-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-md ${status.bg} border-b ${status.border}`}>
          <div className="flex items-center gap-md">
            <div className={`w-12 h-12 rounded-2xl ${status.color.replace('text-', 'bg-').replace('600', '100')} flex items-center justify-center shadow-sm`}>
              <StatusIcon className={status.color} size={28} />
            </div>
            <div>
              <div className="flex items-center gap-sm">
                <h3 className="text-2xl font-bold text-on-surface">#ORD-{order.id.toString().padStart(4, '0')}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${status.bg.replace('bg-', 'bg-white/80 ')} ${status.color} border ${status.border}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium mt-1">Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 md:static text-on-surface-variant hover:text-error transition-all p-2 rounded-full hover:bg-white/50">
            <X size={24} />
          </button>
        </div>

        <div className="p-lg overflow-y-auto max-h-[75vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
            {/* Customer Information Card */}
            <div className="bg-surface-container-low p-md rounded-2xl border border-outline-variant/50 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-sm text-primary font-bold text-xs uppercase tracking-tighter mb-4">
                <User size={16} />
                <span>Thông tin khách hàng</span>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-on-surface text-lg">{order.customer?.fullName}</p>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Phone size={14} className="text-primary" />
                  <span>{order.customer?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Mail size={14} className="text-primary" />
                  <span className="truncate">{order.customer?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information Card */}
            <div className="bg-surface-container-low p-md rounded-2xl border border-outline-variant/50 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-sm text-primary font-bold text-xs uppercase tracking-tighter mb-4">
                <MapPin size={16} />
                <span>Địa chỉ giao hàng</span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-on-surface leading-relaxed min-h-[40px]">
                  {order.customer?.address || 'Chưa cập nhật địa chỉ giao hàng'}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant pt-2 border-t border-outline-variant/30">
                  <Truck size={14} className="text-primary" />
                  <span>GIAO HÀNG TIÊU CHUẨN</span>
                </div>
              </div>
            </div>

            {/* Payment & Summary Card */}
            <div className="bg-surface-container-low p-md rounded-2xl border border-outline-variant/50 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-sm text-primary font-bold text-xs uppercase tracking-tighter mb-4">
                <CreditCard size={16} />
                <span>Thanh toán</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Phương thức:</span>
                  <span className="text-sm font-bold">Chuyển khoản</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Trạng thái:</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.paymentStatus === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                  </span>
                </div>
                <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="text-sm font-bold">Tổng cộng:</span>
                  <span className="text-lg font-black text-primary">{parseFloat(order.totalAmount).toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table Section */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm text-on-surface font-bold">
                <ShoppingBag size={20} className="text-primary" />
                <span>Sản phẩm trong đơn ({order.items?.length || 0})</span>
              </div>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <ReceiptText size={14} />
                In hóa đơn
              </button>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant uppercase text-[10px] font-black tracking-widest">
                    <th className="px-lg py-4">Sản phẩm</th>
                    <th className="px-md py-4 text-center">Số lượng</th>
                    <th className="px-md py-4 text-right">Đơn giá</th>
                    <th className="px-lg py-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="px-lg py-5">
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant/30 overflow-hidden shrink-0">
                            {item.product?.imageUrl ? (
                              <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={20} className="text-outline" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{item.product?.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-bold">SKU: {item.product?.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-md py-5 text-center font-medium">{item.quantity}</td>
                      <td className="px-md py-5 text-right text-on-surface-variant">{parseFloat(item.price).toLocaleString()}đ</td>
                      <td className="px-lg py-5 text-right font-bold text-on-surface">{(item.quantity * item.price).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-lg bg-surface-container-low border-t border-outline-variant/50 flex flex-col sm:flex-row justify-between items-center gap-md">
           <div className="flex items-center gap-2 text-xs text-on-surface-variant">
             <Clock size={14} />
             <span>Cập nhật lần cuối: {new Date().toLocaleTimeString()}</span>
           </div>
            <div className="flex gap-md w-full sm:w-auto">
              <select 
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-outline-variant font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <button onClick={onClose} className="px-xl py-3 rounded-xl bg-on-surface text-white font-bold hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-widest">
                Đóng
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
