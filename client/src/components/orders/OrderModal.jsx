import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, ShoppingBag, User, Package } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const OrderModal = ({ isOpen, onClose, onSuccess, initialCustomerId = null }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, custRes] = await Promise.all([
        axiosClient.get('/products?limit=100'),
        axiosClient.get('/customers?limit=100')
      ]);
      setProducts(prodRes.products || []);
      const allCustomers = custRes.customers || [];
      setCustomers(allCustomers);

      if (initialCustomerId) {
        const found = allCustomers.find(c => c.id === parseInt(initialCustomerId));
        if (found) setSelectedCustomer(found);
      }
    } catch (err) {
      console.error('Error fetching modal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (product) => {
    const existing = selectedItems.find(item => item.productId === product.id);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || selectedItems.length === 0) {
      alert('Vui lòng chọn khách hàng và ít nhất một sản phẩm');
      return;
    }

    setSubmitting(true);
    try {
      await axiosClient.post('/orders', {
        customerId: selectedCustomer.id,
        items: selectedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });
      onSuccess();
      onClose();
      // Reset state
      setSelectedCustomer(null);
      setSelectedItems([]);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Không thể tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.phone?.includes(searchCustomer)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-outline-variant">
        {/* Header */}
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Tạo đơn hàng mới</h3>
              <p className="text-xs text-on-surface-variant font-medium">Chọn khách hàng và thêm sản phẩm vào giỏ hàng.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-error-container hover:text-error rounded-full transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Selection */}
          <div className="flex-1 p-lg overflow-y-auto custom-scrollbar border-r border-outline-variant/50 space-y-lg">
            {/* Customer Selection */}
            <section>
              <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-md flex items-center gap-2">
                <User size={16} /> Khách hàng
              </h4>
              {!selectedCustomer ? (
                <div className="space-y-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                    <input 
                      type="text"
                      placeholder="Tìm khách hàng..."
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-outline-variant rounded-xl divide-y divide-outline-variant/30">
                    {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedCustomer(c)}
                        className="p-md hover:bg-primary/5 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-on-surface">{c.fullName}</p>
                          <p className="text-[10px] text-on-surface-variant">{c.phone || c.email}</p>
                        </div>
                        <Plus size={16} className="text-primary" />
                      </div>
                    )) : (
                      <p className="p-md text-xs text-center text-on-surface-variant">Không tìm thấy khách hàng</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-md bg-primary/5 border border-primary/20 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      {selectedCustomer.fullName.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{selectedCustomer.fullName}</p>
                      <p className="text-[10px] text-on-surface-variant">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="text-xs font-bold text-primary hover:underline">Thay đổi</button>
                </div>
              )}
            </section>

            {/* Product Selection */}
            <section>
              <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-md flex items-center gap-2">
                <Package size={16} /> Sản phẩm
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                {products.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => addItem(p)}
                    className="p-md border border-outline-variant/50 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-on-surface-variant">{parseFloat(p.price).toLocaleString()}đ</p>
                      <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded-full font-bold">Kho: {p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Cart Summary */}
          <div className="w-full md:w-80 p-lg bg-surface-container-low flex flex-col gap-lg">
            <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={16} /> Giỏ hàng
            </h4>
            
            <div className="flex-1 overflow-y-auto space-y-md pr-2 custom-scrollbar">
              {selectedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant/40">
                  <ShoppingBag size={48} className="mb-md opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Chưa có sản phẩm</p>
                </div>
              ) : (
                selectedItems.map(item => (
                  <div key={item.productId} className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-sm animate-in slide-in-from-right-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs font-bold text-on-surface leading-tight pr-4">{item.name}</p>
                      <button onClick={() => removeItem(item.productId)} className="text-on-surface-variant hover:text-error">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-sm bg-surface-container-high rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-surface-variant rounded-md transition-colors"><Minus size={12} /></button>
                        <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-surface-variant rounded-md transition-colors"><Plus size={12} /></button>
                      </div>
                      <p className="text-xs font-bold text-primary">{(item.price * item.quantity).toLocaleString()}đ</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-lg border-t border-outline-variant space-y-md">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tổng cộng</span>
                <span className="text-2xl font-black text-primary leading-none">{calculateTotal().toLocaleString()}đ</span>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={submitting || !selectedCustomer || selectedItems.length === 0}
                className="w-full py-4 bg-primary text-on-primary rounded-[20px] font-black uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
              >
                {submitting ? 'Đang xử lý...' : 'Xác nhận lên đơn'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
