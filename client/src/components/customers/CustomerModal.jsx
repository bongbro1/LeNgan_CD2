import React, { useEffect, useState } from "react";
import { X, User, Phone, Mail, MapPin, Globe, Save } from "lucide-react";

const CustomerModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    socialPlatform: "facebook",
    socialId: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        socialPlatform: "facebook",
        socialId: ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden relative animate-in zoom-in-95 duration-400 border border-outline-variant/30 flex flex-col">
        
        <div className="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              {initialData ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
            </h2>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 uppercase tracking-wider">Thông tin khách hàng</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Họ và tên</label>
              <input 
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                placeholder="Nguyễn Văn An..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Số điện thoại</label>
              <input 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                placeholder="09xx..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Nền tảng</label>
              <select 
                value={formData.socialPlatform?.toLowerCase() || "facebook"}
                onChange={(e) => setFormData({ ...formData, socialPlatform: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none font-medium appearance-none cursor-pointer"
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="zalo">Zalo</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">ID / Username Mạng xã hội</label>
            <input 
              type="text"
              value={formData.socialId}
              onChange={(e) => setFormData({ ...formData, socialId: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none font-medium"
              placeholder="Nhập ID người dùng..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Địa chỉ liên hệ</label>
            <textarea 
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none font-medium resize-none"
              placeholder="Số nhà, tên đường, thành phố..."
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end items-center">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-on-surface text-white rounded-xl text-xs font-bold hover:bg-on-surface-variant active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-on-surface/10"
            >
              <Save size={14} />
              {initialData ? "Cập nhật" : "Tạo khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
