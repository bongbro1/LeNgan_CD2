import React from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown 
} from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete, onView, pagination, currentPage, onPageChange, onSort, sortConfig, loading }) => {
  const getStatusBadge = (stock) => {
    if (stock <= 0) return <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold">Hết hàng</span>;
    if (stock <= 10) return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Sắp hết</span>;
    return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Đang bán</span>;
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  const getStockProgress = (stock) => {
    const percentage = Math.min((stock / 100) * 100, 100);
    let color = 'bg-primary';
    if (stock <= 10) color = 'bg-tertiary';
    if (stock <= 0) color = 'bg-error';

    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium">{stock} còn lại</span>
        <div className="w-24 h-1.5 bg-surface-variant rounded-full overflow-hidden">
          <div className={`${color} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

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
              <th className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ảnh</th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-2">Sản phẩm {renderSortIcon('name')}</div>
              </th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('categoryId')}
              >
                <div className="flex items-center gap-2">Danh mục {renderSortIcon('categoryId')}</div>
              </th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center gap-2">Giá bán {renderSortIcon('price')}</div>
              </th>
              <th 
                className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-variant transition-colors group"
                onClick={() => onSort('stock')}
              >
                <div className="flex items-center gap-2">Kho {renderSortIcon('stock')}</div>
              </th>
              <th className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">Trạng thái</th>
              <th className="px-lg py-md text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading && products.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-outline-variant/50">
                  <td className="px-lg py-md"><div className="w-12 h-12 bg-surface-variant rounded-lg"></div></td>
                  <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-32 mb-2"></div><div className="h-3 bg-surface-variant/50 rounded w-20"></div></td>
                  <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-24"></div></td>
                  <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-20"></div></td>
                  <td className="px-lg py-md"><div className="h-4 bg-surface-variant rounded w-28"></div></td>
                  <td className="px-lg py-md"><div className="h-6 bg-surface-variant rounded-full w-20"></div></td>
                  <td className="px-lg py-md text-right"><div className="h-8 bg-surface-variant rounded-lg w-20 ml-auto"></div></td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className={`hover:bg-surface-container-low transition-all group ${loading ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}>
                  <td className="px-lg py-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant group-hover:scale-105 transition-transform">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-outline">image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="font-bold text-on-surface">{product.name}</div>
                    <div className="text-xs text-on-surface-variant">SKU: {product.sku || `PRO-${product.id}`}</div>
                  </td>
                  <td className="px-lg py-md text-sm">{product.category?.name || 'Chưa phân loại'}</td>
                  <td className="px-lg py-md text-sm font-bold text-primary">
                    {parseFloat(product.price).toLocaleString()}đ
                  </td>
                  <td className="px-lg py-md">
                    {getStockProgress(product.stock)}
                  </td>
                  <td className="px-lg py-md">
                    {getStatusBadge(product.stock)}
                  </td>
                  <td className="px-lg py-md text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onView(product)} className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant" title="Xem">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => onEdit(product)} className="p-2 hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant" title="Sửa">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => onDelete(product.id)} className="p-2 hover:bg-error-container hover:text-error rounded-lg transition-colors text-on-surface-variant" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-lg py-20 text-center text-on-surface-variant italic">
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">Hiển thị {products.length} trên {pagination?.total || 0} sản phẩm</p>
        <div className="flex items-center gap-sm">
          <button
            onClick={() => onPageChange(currentPage - 1)}
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
                  onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
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

export default ProductTable;
