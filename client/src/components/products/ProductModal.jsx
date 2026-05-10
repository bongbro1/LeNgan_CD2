import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Save } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const ProductModal = ({ isOpen, onClose, onSave, categories, initialData, isViewOnly = false }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        categoryId: initialData.categoryId ? String(initialData.categoryId) : '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || ''
      });
    } else {
      setFormData({
        name: '',
        categoryId: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageClick = () => {
    if (isViewOnly || isUploading) return;
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setIsUploading(true);
    try {
      const res = await axiosClient.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Vì axiosClient interceptor đã trả về response.data, nên ta dùng res.imageUrl
      if (res && res.imageUrl) {
        setFormData(prev => ({ ...prev, imageUrl: res.imageUrl }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewOnly) return;

    // Log để kiểm tra dữ liệu trước khi gửi
    console.log('Gửi dữ liệu sản phẩm:', formData);

    // Đảm bảo các giá trị số được chuyển đổi đúng và không bị NaN
    const submissionData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : 0,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
    };

    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>

      <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300 z-10 border border-white/20">
        {/* Left Side: Image Preview */}
        <div className="w-full md:w-5/12 bg-surface-container-low relative group flex flex-col items-center justify-center p-8 border-r border-outline-variant/30">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />

          <div className="absolute top-6 left-6 z-20">
            <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${formData.stock > 0 ? 'bg-primary text-white' : 'bg-error text-white'}`}>
              {formData.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <div
            onClick={handleImageClick}
            className={`relative w-full aspect-square rounded-[32px] overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 ${!isViewOnly ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''}`}
          >
            {isUploading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Uploading...</p>
              </div>
            ) : formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[64px] opacity-20">add_a_photo</span>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center px-8">Click to upload image</p>
              </div>
            )}

            {!isViewOnly && !isUploading && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Thay đổi ảnh
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 w-full p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest text-center mb-1">Mẹo nhỏ</p>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-70 italic text-center">Ảnh vuông (1:1) sẽ hiển thị đẹp nhất trên Dashboard.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col h-full bg-white">
          <div className="p-8 pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight">
                {isViewOnly ? 'Thông tin sản phẩm' : (initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới')}
              </h3>
              <p className="text-[11px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest mt-1">ID: {initialData?.id || 'NEW_PRODUCT'}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-error hover:text-white transition-all group">
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-10 pt-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block opacity-40 px-2">Tên sản phẩm</label>
                <input
                  readOnly={isViewOnly}
                  className={`w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-6 py-3 text-sm font-bold text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all ${isViewOnly ? 'bg-surface-container-lowest cursor-default' : ''}`}
                  placeholder="VD: Apple iPhone 15 Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block opacity-40 px-2">Danh mục</label>
                  <select
                    disabled={isViewOnly}
                    className={`w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-6 py-3 text-sm font-bold text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none ${isViewOnly ? 'bg-surface-container-lowest cursor-default' : ''}`}
                    value={formData.categoryId}
                    onChange={(e) => {
                      console.log('Đã chọn Danh mục ID:', e.target.value);
                      setFormData({ ...formData, categoryId: e.target.value });
                    }}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block opacity-40 px-2">Giá bán (VNĐ)</label>
                  <input
                    readOnly={isViewOnly}
                    type="number"
                    className={`w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-6 py-3 text-sm font-black text-primary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all ${isViewOnly ? 'bg-surface-container-lowest cursor-default' : ''}`}
                    placeholder="10.000.000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block opacity-40 px-2">Số lượng tồn kho</label>
                  <input
                    readOnly={isViewOnly}
                    type="number"
                    className={`w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-6 py-3 text-sm font-bold text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all ${isViewOnly ? 'bg-surface-container-lowest cursor-default' : ''}`}
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-[20px]">analytics</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Gợi ý AI</p>
                      <p className="text-[10px] font-bold text-on-surface-variant opacity-70 italic line-clamp-1">Mẫu này đang hot, nên nhập thêm.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block opacity-40 px-2">Mô tả sản phẩm</label>
                <textarea
                  readOnly={isViewOnly}
                  className={`w-full bg-surface-container-low border border-outline-variant/50 rounded-[32px] px-6 py-4 text-sm font-bold text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none h-32 ${isViewOnly ? 'bg-surface-container-lowest cursor-default' : ''}`}
                  placeholder="Nhập thông tin chi tiết về sản phẩm..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {!isViewOnly && (
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-black text-on-surface-variant bg-surface-container hover:bg-surface-variant transition-all uppercase tracking-widest text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 rounded-2xl font-black text-white bg-primary hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
                >
                  {initialData ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm ngay'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
