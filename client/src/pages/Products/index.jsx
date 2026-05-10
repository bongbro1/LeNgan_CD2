import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import ProductTable from '../../components/products/ProductTable';
import ProductFilter from '../../components/products/ProductFilter';
import ProductModal from '../../components/products/ProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const { category, status } = filters;
      let query = `page=${page}&limit=10&categoryId=${category}&status=${status}`;

      if (sortConfig.key) {
        query += `&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}`;
      }

      const [prodRes, catRes] = await Promise.all([
        axiosClient.get(`/products?${query}`),
        axiosClient.get('/categories')
      ]);

      // Backend trả về { products, pagination }
      setProducts(prodRes.products || []);
      setPagination(prodRes.pagination || { totalPages: 1, total: 0 });
      setCategories(catRes);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, filters, sortConfig]);

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await axiosClient.put(`/products/${editingProduct.id}`, formData);
      } else {
        await axiosClient.post('/products', formData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setIsViewOnly(false);
      setCurrentPage(1); // Quay về trang 1
      fetchData(1);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi lưu sản phẩm';
      alert(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await axiosClient.delete(`/products/${id}`);
        fetchData(currentPage);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Lỗi khi xóa sản phẩm';
        alert(errorMsg);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1); // Reset trang khi lọc
  };

  const handleReset = () => {
    setFilters({ category: '', status: '' });
    setCurrentPage(1);
    fetchData(1);
  };

  const filteredProducts = products; // Phân trang đã làm ở Backend nên không cần filter ở Frontend nữa nếu muốn chính xác



  return (
    <div className="p-8 space-y-8 bg-surface-container-lowest min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight">Sản phẩm</h1>
          <p className="text-on-surface-variant font-medium mt-1">Quản lý kho hàng và danh mục của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditingProduct(null); setIsViewOnly(false); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-black hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
          >
            <Plus size={18} strokeWidth={3} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <ProductFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        categories={categories}
      />

      {/* Main Content Card (Table Only) */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <ProductTable
          products={filteredProducts}
          onEdit={(p) => { setEditingProduct(p); setIsViewOnly(false); setIsModalOpen(true); }}
          onDelete={handleDelete}
          onView={(p) => { setEditingProduct(p); setIsViewOnly(true); setIsModalOpen(true); }}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setIsViewOnly(false); }}
        onSave={handleSave}
        categories={categories}
        initialData={editingProduct}
        isViewOnly={isViewOnly}
      />
    </div>
  );
};

export default Products;
