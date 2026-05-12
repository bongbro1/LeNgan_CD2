import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, Plus, MessageSquare, Sparkles, User, Users, Calendar, ShoppingBag, Clock, History, FileText, X, ChevronRight, AlertTriangle, CheckCircle2, Ticket, Edit, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const CustomerProfile = ({ customer, loading, onEdit, onDelete, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [activeModal, setActiveModal] = useState(null); // 'order', 'voucher', 'rank', 'block'
  const [message, setMessage] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for Order Creation
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(30000);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [activeTab, customer?.conversations]);

  const getAIAnalysis = () => {
    if (!customer) return "Đang phân tích dữ liệu...";

    const orderCount = customer.orders?.length || 0;
    const totalSpend = customer.orders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0;
    const notesCount = customer.notes?.length || 0;

    let insights = [];

    // Analysis logic
    if (orderCount >= 3) {
      insights.push("Đây là khách hàng thân thiết với tần suất mua sắm ổn định.");
    } else if (orderCount > 0) {
      insights.push("Khách hàng đã có trải nghiệm mua sắm, cần chăm sóc thêm để tăng tỉ lệ quay lại.");
    } else {
      insights.push("Khách hàng mới tiềm năng, nên tập trung tư vấn các dòng sản phẩm bán chạy nhất.");
    }

    if (totalSpend > 2000000) {
      insights.push("Mức chi tiêu tốt, thuộc phân khúc khách hàng sẵn sàng đầu tư cho các sản phẩm cao cấp.");
    }

    // Identify top product category or interest
    const allProducts = customer.orders?.flatMap(o => o.items?.map(i => i.product?.name)).filter(Boolean) || [];
    if (allProducts.length > 0) {
      const counts = allProducts.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
      const topProduct = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (topProduct) {
        insights.push(`Sản phẩm quan tâm nhất là "${topProduct[0]}". Hãy cân nhắc giới thiệu các bộ quà tặng hoặc sản phẩm bổ trợ liên quan.`);
      }
    }

    if (notesCount > 0) {
      insights.push(`Đã có ${notesCount} ghi chú chăm sóc, hãy kiểm tra tab Ghi chú để nắm rõ các yêu cầu đặc biệt trước đó.`);
    } else {
      insights.push("Chưa có ghi chú chăm sóc chi tiết, hãy thêm thông tin sau mỗi lần tương tác để AI phân tích tốt hơn.");
    }

    return insights.join(" ");
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      setIsSubmitting(true);
      const convId = customer.conversations?.[0]?.id || 0;

      // Lấy role từ user đang login trong localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const senderRole = user?.role || 'staff';

      await axiosClient.post(`/conversations/${convId}/messages`, {
        text: message,
        sender: senderRole, // Sử dụng đúng role (admin/staff) từ bảng User
        customerId: customer.id
      });
      setMessage('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Không thể gửi tin nhắn');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeModal === 'order') {
      fetchProducts();
      // Pre-fill from customer info
      setRecipientName(customer?.fullName || '');
      setShippingAddress(customer?.address || '');
      setShippingPhone(customer?.phone || '');
    }
  }, [activeModal, customer]);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get('/products?limit=100');
      setProducts(response.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  if (loading) return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-outline-variant flex flex-col items-center justify-center p-xl h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Đang tải hồ sơ...</p>
    </div>
  );

  if (!customer) return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-outline-variant flex flex-col items-center justify-center p-xl text-on-surface-variant opacity-40 h-full">
      <Users size={48} className="mb-4" />
      <p className="font-bold">Chọn khách hàng để xem chi tiết</p>
    </div>
  );

  const handleUpdateRank = async (rank) => {
    try {
      setIsSubmitting(true);
      await axiosClient.put(`/customers/${customer.id}/rank`, { rank });
      setActiveModal(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error updating rank:', err);
      alert('Không thể cập nhật phân hạng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      setIsSubmitting(true);
      await axiosClient.post(`/customers/${customer.id}/notes`, { content: noteContent });
      setNoteContent('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Không thể thêm ghi chú');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedProductId) return alert('Vui lòng chọn sản phẩm');
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    try {
      setIsSubmitting(true);
      const items = [{
        productId: product.id,
        quantity: orderQuantity,
        price: product.price
      }];

      await axiosClient.post('/orders', {
        customerId: customer.id,
        items,
        shippingAddress,
        shippingPhone,
        note: orderNote,
        discountAmount,
        shippingFee
      });

      setActiveModal(null);
      setSelectedProductId('');
      setOrderQuantity(1);
      setOrderNote('');
      setDiscountAmount(0);

      if (onRefresh) onRefresh();
      alert('Tạo đơn hàng thành công!');
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Không thể tạo đơn hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendVoucher = async (value) => {
    try {
      setIsSubmitting(true);
      const voucherCode = `VOUCHER${value}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      // 1. Lưu vào ghi chú nội bộ
      await axiosClient.post(`/customers/${customer.id}/notes`, {
        content: `Hệ thống đã gửi mã giảm giá ${value}% (${voucherCode}) cho khách hàng.`,
        staffName: 'Hệ thống'
      });

      // 2. Gửi tin nhắn trực tiếp cho khách hàng qua Chat
      const convId = customer.conversations?.[0]?.id;
      if (convId) {
        await axiosClient.post(`/conversations/${convId}/messages`, {
          text: `🎉 Chúc mừng bạn! Shop tặng bạn mã giảm giá ${value}% cho đơn hàng tiếp theo.\n\nMã của bạn là: ${voucherCode}\n(Sử dụng mã này khi chốt đơn với nhân viên nhé!)`,
          sender: 'bot', // Gửi dưới danh nghĩa AI/Bot
          customerId: customer.id
        });
      }

      setActiveModal(null);
      if (onRefresh) onRefresh();
      alert(`Đã gửi voucher ${value}% (${voucherCode}) thành công!`);
    } catch (err) {
      console.error('Error sending voucher:', err);
      alert('Không thể gửi voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ModalHeader = ({ title, onClose, icon: Icon, color = "text-primary" }) => (
    <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
      <div className="flex items-center gap-md">
        <div className={`p-2 rounded-xl ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={color} size={20} />
        </div>
        <h3 className="text-lg font-bold text-on-surface">{title}</h3>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
        <X size={20} />
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-md min-w-0 h-full relative">
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col flex-grow min-h-0">
        <div className="p-lg flex items-start gap-lg border-b border-outline-variant shrink-0 bg-surface-container-low/30">
          <div className="w-20 h-20 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm border border-outline-variant/30 overflow-hidden">
            {customer.imageUrl ? (
              <img src={customer.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              customer.fullName.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-primary truncate">{customer.fullName}</h2>
                <span className="text-[10px] font-medium text-on-surface-variant">Khách hàng thân thiết</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest shrink-0 ${customer.rank === 'PLATINUM' ? 'bg-amber-600 text-white' :
                customer.rank === 'GOLD' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                {customer.rank || 'SILVER'}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-sm text-[11px] font-medium text-on-surface-variant">
                <Phone size={12} className="text-outline" />
                <span>{customer.phone || 'Chưa có SĐT'}</span>
              </div>
              <div className="flex items-center gap-sm text-[11px] font-medium text-on-surface-variant">
                <Mail size={12} className="text-outline" />
                <span className="truncate">{customer.email || 'Chưa có email'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-outline-variant bg-surface-container-low shrink-0">
          {['info', 'orders', 'chat', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === tab
                ? 'text-primary border-primary bg-white shadow-sm'
                : 'text-on-surface-variant border-transparent hover:bg-surface-variant'
                }`}
            >
              {tab === 'info' ? 'Thông tin' : tab === 'orders' ? 'Lịch sử' : tab === 'chat' ? 'Chat' : 'Ghi chú'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-lg custom-scrollbar bg-white">
          {activeTab === 'info' && (
            <div className="space-y-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-md">
                <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
                  <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">ĐƠN HÀNG CUỐI</span>
                  <p className="text-sm font-bold mt-1 text-on-surface">
                    {customer.orders?.[0] ? new Date(customer.orders[0].createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30">
                  <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">TỔNG CHI TIÊU</span>
                  <p className="text-sm font-bold mt-1 text-on-surface">
                    {customer.orders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0).toLocaleString()}đ
                  </p>
                </div>
              </div>

              <div className="space-y-sm">
                <div className="flex items-center gap-2">
                  <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Phân tích từ AI</h4>
                  <Sparkles size={10} className="text-primary animate-pulse" />
                </div>
                <div className="bg-primary/5 border border-primary/10 p-md rounded-2xl text-[11px] text-on-surface-variant leading-relaxed relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                  <p className="relative z-10 font-medium italic">
                    <span className="text-primary mr-1">"</span>
                    {getAIAnalysis()}
                    <span className="text-primary ml-1">"</span>
                  </p>
                </div>
              </div>

              <div className="space-y-sm">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Địa chỉ giao hàng</h4>
                <div className="flex items-start gap-sm text-xs text-on-surface-variant">
                  <MapPin size={14} className="text-outline shrink-0 mt-0.5" />
                  <span>{customer.address || 'Chưa cập nhật địa chỉ'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-md animate-in fade-in duration-300">
              <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Lịch sử giao dịch</h4>
              {customer.orders && customer.orders.length > 0 ? (
                customer.orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setActiveModal('orderDetail');
                    }}
                    className="flex items-center justify-between p-md border border-outline-variant/50 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">#ORD-{order.id.toString().padStart(4, '0')}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{parseFloat(order.totalAmount).toLocaleString()}đ</p>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${order.status === 'completed' ? 'text-emerald-600 bg-emerald-50' :
                        order.status === 'pending' ? 'text-amber-600 bg-amber-50' :
                          'text-error bg-error/5'
                        }`}>
                        {order.status === 'completed' ? 'Hoàn thành' :
                          order.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-3 opacity-20">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant opacity-40 uppercase">Chưa có đơn hàng nào</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="flex-1 space-y-md overflow-y-auto custom-scrollbar pr-1">
                {customer.conversations?.[0]?.messages?.length > 0 ? (
                  customer.conversations[0].messages.map((msg, idx) => {
                    const isStaff = ['staff', 'admin', 'bot'].includes(msg.senderType);
                    const senderLabel = msg.senderType === 'admin' ? 'QUẢN TRỊ' :
                      msg.senderType === 'bot' ? 'AI PHẢN HỒI' : 'NHÂN VIÊN';

                    return (
                      <div key={idx} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'} gap-1 max-w-[90%] ${isStaff ? 'ml-auto' : ''}`}>
                        {isStaff && (
                          <span className="text-[8px] font-black text-on-surface-variant opacity-50 uppercase tracking-widest mr-1">
                            {senderLabel}
                          </span>
                        )}
                        <div className={`p-3 rounded-2xl text-xs shadow-sm ${isStaff ? 'bg-primary text-on-primary rounded-tr-none shadow-md' : 'bg-surface-container-low text-on-surface rounded-tl-none'
                          }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center opacity-40">
                    <MessageSquare size={32} className="mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase">Chưa có tin nhắn</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="mt-lg flex gap-sm border-t border-outline-variant pt-md shrink-0">
                <input
                  className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-md py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSubmitting || !message.trim()}
                  className="p-2 bg-primary text-white rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-lg animate-in fade-in duration-300 h-full flex flex-col">
              <div className="flex justify-between items-center shrink-0">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Nhật ký chăm sóc</h4>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar relative border-l-2 border-outline-variant/30 ml-2 pl-6 space-y-lg py-2">
                {customer.notes && customer.notes.length > 0 ? (
                  customer.notes.map((note) => (
                    <div key={note.id} className="relative animate-in slide-in-from-left-4 duration-300">
                      <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                      <div className="bg-surface-container-low p-md rounded-xl text-xs border border-outline-variant/50 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-primary">{note.staffName || 'Nhân viên'}</span>
                          <span className="opacity-60 text-[9px] uppercase font-bold">{new Date(note.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-on-surface leading-relaxed">{note.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center opacity-40">
                    <FileText size={32} className="mx-auto mb-2" />
                    <p className="text-[10px] font-bold uppercase">Chưa có ghi chú</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleAddNote} className="mt-4 shrink-0">
                <div className="relative">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 pr-12 text-xs outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Thêm ghi chú chăm sóc mới..."
                    rows="2"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !noteContent.trim()}
                    className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-md shrink-0">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Thao tác nhanh</h3>
        <div className="grid grid-cols-4 gap-xs">
          <button onClick={() => setActiveModal('order')} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-outline-variant hover:bg-surface-variant transition-all text-[9px] font-black active:scale-95 group uppercase tracking-tighter">
            <Plus size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="truncate w-full text-center">Lên đơn</span>
          </button>
          <button onClick={() => setActiveModal('voucher')} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-outline-variant hover:bg-surface-variant transition-all text-[9px] font-black active:scale-95 group uppercase tracking-tighter">
            <MessageSquare size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="truncate w-full text-center">Voucher</span>
          </button>
          <button onClick={() => setActiveModal('rank')} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-outline-variant hover:bg-surface-variant transition-all text-[9px] font-black active:scale-95 group uppercase tracking-tighter">
            <History size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="truncate w-full text-center">Phân hạng</span>
          </button>
          <button onClick={() => onDelete()} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-outline-variant hover:bg-error-container text-error transition-all text-[9px] font-black active:scale-95 group uppercase tracking-tighter">
            <Trash2 size={16} className="text-error group-hover:scale-110 transition-transform" />
            <span className="truncate w-full text-center text-error">Xóa khách</span>
          </button>
        </div>
      </div>

      {activeModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-lg">
          <div className="absolute inset-0 bg-on-background/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setActiveModal(null)}></div>
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-outline-variant/30 max-h-[65vh]">
            {activeModal === 'order' && (
              <>
                <ModalHeader title="Lên đơn mới" onClose={() => setActiveModal(null)} icon={Plus} />
                <div className="p-md space-y-sm overflow-y-auto custom-scrollbar">
                  {/* Customer Info Section */}
                  <div className="p-md bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Thông tin nhận hàng</span>
                    </div>
                    <div className="space-y-sm">
                      <div className="grid grid-cols-2 gap-sm">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-on-surface-variant opacity-50 uppercase tracking-widest ml-1">Tên nhận</label>
                          <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-black text-on-surface-variant opacity-50 uppercase tracking-widest ml-1">Số điện thoại</label>
                          <input
                            type="text"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-on-surface-variant opacity-50 uppercase tracking-widest ml-1">Địa chỉ giao hàng</label>
                        <textarea
                          rows="1"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="w-full bg-white border border-outline-variant rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Selection Section */}
                  <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block">Sản phẩm & Số lượng</span>
                    <div className="flex gap-sm">
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="flex-1 bg-white border border-outline-variant rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Chọn sản phẩm...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {parseFloat(p.price).toLocaleString()}đ</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                        className="w-20 bg-white border border-outline-variant rounded-lg p-2 text-xs font-bold text-center outline-none"
                      />
                    </div>
                  </div>

                  {/* Financial Section */}
                  <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block">Chi phí & Giảm giá</span>
                    <div className="grid grid-cols-2 gap-sm">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[9px] font-bold text-on-surface-variant opacity-50 uppercase">Phí Ship</span>
                        <input
                          type="number"
                          value={shippingFee}
                          onChange={(e) => setShippingFee(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-outline-variant rounded-lg pl-16 pr-3 py-2 text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[9px] font-bold text-on-surface-variant opacity-50 uppercase">Giảm giá</span>
                        <input
                          type="number"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-outline-variant rounded-lg pl-16 pr-3 py-2 text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Note */}
                  <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Ghi chú đơn hàng</span>
                    <input
                      type="text"
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none"
                    />
                  </div>

                  {/* Summary Section */}
                  <div className="p-lg bg-surface-container-highest rounded-2xl border-2 border-primary/20 space-y-2">
                    <div className="flex justify-between text-xs opacity-60 font-bold uppercase tracking-wider">
                      <span>Tạm tính:</span>
                      <span>
                        {((products.find(p => p.id === parseInt(selectedProductId))?.price || 0) * orderQuantity).toLocaleString()}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-xs opacity-60 font-bold uppercase tracking-wider">
                      <span>Phí vận chuyển:</span>
                      <span className="text-emerald-600">+{shippingFee.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-xs opacity-60 font-bold uppercase tracking-wider">
                      <span>Giảm giá:</span>
                      <span className="text-error">-{discountAmount.toLocaleString()}đ</span>
                    </div>
                    <div className="pt-2 border-t border-outline-variant flex justify-between items-center">
                      <span className="text-sm font-black uppercase text-primary">Tổng cộng:</span>
                      <span className="text-xl font-black text-primary">
                        {(
                          ((products.find(p => p.id === parseInt(selectedProductId))?.price || 0) * orderQuantity)
                          + shippingFee
                          - discountAmount
                        ).toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateOrder}
                    disabled={isSubmitting || !selectedProductId}
                    className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50 uppercase tracking-widest"
                  >
                    {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN CHỐT ĐƠN'}
                  </button>
                </div>
              </>
            )}

            {activeModal === 'voucher' && (
              <>
                <ModalHeader title="Gửi Voucher" onClose={() => setActiveModal(null)} icon={Ticket} color="text-secondary" />
                <div className="p-lg space-y-sm max-h-[350px] overflow-y-auto custom-scrollbar">
                  {[10, 20, 50].map((val) => (
                    <div
                      key={val}
                      onClick={() => !isSubmitting && handleSendVoucher(val)}
                      className={`p-md border border-outline-variant/50 rounded-2xl flex items-center justify-between hover:bg-secondary/5 transition-colors cursor-pointer group ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Ticket size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Giảm {val}% đơn từ 0đ</p>
                          <p className="text-[10px] text-on-surface-variant uppercase">HSD: 31/12/2023</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  {isSubmitting && <p className="text-center text-[10px] font-bold text-secondary animate-pulse uppercase mt-4">Đang gửi...</p>}
                </div>
              </>
            )}

            {activeModal === 'rank' && (
              <>
                <ModalHeader title="Đổi phân hạng" onClose={() => setActiveModal(null)} icon={History} color="text-amber-600" />
                <div className="p-lg space-y-md">
                  <div className="grid grid-cols-1 gap-sm">
                    {['SILVER', 'GOLD', 'PLATINUM'].map((r) => (
                      <label
                        key={r}
                        onClick={() => !isSubmitting && handleUpdateRank(r)}
                        className={`flex items-center justify-between p-md rounded-2xl border-2 transition-all cursor-pointer ${customer.rank === r ? 'border-amber-600 bg-amber-50' : 'border-outline-variant/30 hover:border-amber-200'}`}
                      >
                        <div className="flex items-center gap-md">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${r === 'PLATINUM' ? 'bg-amber-600 text-white' : r === 'GOLD' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                            {r[0]}
                          </div>
                          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">{r}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${customer.rank === r ? 'border-amber-600' : 'border-outline-variant'}`}>
                          {customer.rank === r && <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-in zoom-in duration-200"></div>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeModal === 'block' && (
              <>
                <ModalHeader title="Xác nhận chặn" onClose={() => setActiveModal(null)} icon={AlertTriangle} color="text-error" />
                <div className="p-lg space-y-lg text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error animate-bounce">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">Bạn có chắc chắn?</h4>
                    <p className="text-sm text-on-surface-variant mt-1">Hành động này sẽ ngăn khách hàng liên hệ và đặt hàng từ hệ thống.</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Lý do chặn</p>
                    <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-md text-sm outline-none focus:ring-2 focus:ring-error/20" placeholder="Nhập lý do..."></textarea>
                  </div>
                  <div className="flex gap-md pt-2">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold text-on-surface-variant hover:bg-surface-variant transition-all text-[14px]">Hủy</button>
                    <button className="flex-1 py-3 bg-error text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all text-[13px]">XÁC NHẬN CHẶN</button>
                  </div>
                </div>
              </>
            )}

            {activeModal === 'orderDetail' && selectedOrder && (
              <>
                <div className="flex flex-col h-full bg-white">
                  {/* Compact Header */}
                  <div className="px-md py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/30">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-on-surface leading-tight">#{selectedOrder.id.toString().padStart(4, '0')}</h2>
                        <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">
                          {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${selectedOrder.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        selectedOrder.status === 'cancelled' ? 'bg-error/5 border-error/10 text-error' :
                          'bg-amber-50 border-amber-100 text-amber-600'
                        }`}>
                        {selectedOrder.status === 'pending' ? 'Chờ duyệt' :
                          selectedOrder.status === 'confirmed' ? 'Đã duyệt' :
                            selectedOrder.status === 'shipping' ? 'Đang giao' :
                              selectedOrder.status === 'completed' ? 'Hoàn tất' : 'Đã hủy'}
                      </span>
                      <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-md py-md space-y-md">
                    {/* Customer & Address Grid */}
                    <div className="grid grid-cols-2 gap-md p-md bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Khách nhận</span>
                        <p className="text-xs font-black text-on-surface truncate">{selectedOrder.recipientName || customer.fullName}</p>
                        <p className="text-[11px] font-bold text-primary">{selectedOrder.shippingPhone || customer.phone || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Địa chỉ</span>
                        <p className="text-[11px] font-medium text-on-surface-variant leading-tight line-clamp-2">
                          {selectedOrder.shippingAddress || customer.address || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Compact Items List */}
                    <div className="p-md bg-surface-container-low/30 rounded-2xl border border-outline-variant/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Sản phẩm</span>
                        <span className="text-[10px] font-bold opacity-40">{selectedOrder.items?.length || 0} món</span>
                      </div>
                      <div className="space-y-2">
                        {selectedOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded bg-white border border-outline-variant/30 flex items-center justify-center text-[10px] font-black text-primary">
                                {item.quantity}
                              </span>
                              <span className="text-xs font-bold text-on-surface truncate max-w-[180px]">
                                {item.product?.name || 'Sản phẩm'}
                              </span>
                            </div>
                            <span className="text-xs font-black text-on-surface">
                              {(item.price * item.quantity).toLocaleString()}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note if any */}
                    {selectedOrder.note && (
                      <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl">
                        <p className="text-[10px] font-medium text-amber-900 leading-relaxed italic">
                          <span className="font-black uppercase text-[8px] not-italic mr-2 opacity-50">Ghi chú:</span>
                          "{selectedOrder.note}"
                        </p>
                      </div>
                    )}

                    {/* Summary Section - Compact */}
                    <div className="p-md bg-surface-container-highest rounded-2xl border border-outline-variant space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/70">
                        <span>TẠM TÍNH</span>
                        <span>{(parseFloat(selectedOrder.totalAmount) - parseFloat(selectedOrder.shippingFee || 0) + parseFloat(selectedOrder.discountAmount || 0)).toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/70">
                        <span>PHÍ SHIP</span>
                        <span className="text-emerald-600">+{parseFloat(selectedOrder.shippingFee || 0).toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/70">
                        <span>GIẢM GIÁ</span>
                        <span className="text-error">-{parseFloat(selectedOrder.discountAmount || 0).toLocaleString()}đ</span>
                      </div>
                      <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <span className="text-xs font-black text-primary">TỔNG CỘNG</span>
                        <span className="text-xl font-black text-primary tracking-tighter">
                          {parseFloat(selectedOrder.totalAmount).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
