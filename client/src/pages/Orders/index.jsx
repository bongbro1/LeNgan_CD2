import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import { ShoppingCart, Download, Plus, FileText, FileSpreadsheet, FileJson, Check } from 'lucide-react';

import OrderTable from '../../components/orders/OrderTable';
import OrderFilter from '../../components/orders/OrderFilter';
import OrderDetailModal from '../../components/orders/OrderDetailModal';
import OrderModal from '../../components/orders/OrderModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', search: '', timeRange: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [stats, setStats] = useState({ totalPending: 0, totalShipping: 0, totalRevenue: 0 });

  const exportRef = useRef(null);

  const fetchData = async (page = 1, customFilters = null) => {
    try {
      setLoading(true);
      const { status, search, timeRange } = customFilters || filters;
      let query = `/orders?page=${page}&limit=10`;
      if (status) query += `&status=${status}`;
      if (search) query += `&search=${search}`;
      if (timeRange) query += `&timeRange=${timeRange}`;

      // Add sorting params
      if (sortConfig.key) {
        query += `&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}`;
      }

      const response = await axiosClient.get(query);
      setOrders(response.orders || []);
      setPagination(response.pagination || { totalPages: 1, total: 0 });
      setStats(response.stats || { totalPending: 0, totalShipping: 0, totalRevenue: 0 });
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [filters.status, filters.timeRange, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) setIsExportOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format) => {
    const data = orders.map(o => ({
      ID: `#ORD-${o.id.toString().padStart(4, '0')}`,
      Customer: o.customer?.fullName || 'N/A',
      Total: `${parseFloat(o.totalAmount).toLocaleString()}đ`,
      Status: o.status === 'completed' ? 'Hoàn thành' : o.status === 'pending' ? 'Chờ xử lý' : 'Khác',
      Date: new Date(o.createdAt).toLocaleDateString('vi-VN')
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order_report_${new Date().getTime()}.json`;
      a.click();
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      const html = `
        <html>
          <head>
            <title>Báo cáo đơn hàng</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .logo-section h1 { margin: 0; color: #6200EE; font-size: 28px; }
              .info-section { text-align: right; font-size: 12px; }
              .report-title { text-align: center; text-transform: uppercase; margin-bottom: 40px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th { background-color: #f5f5f5; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
              td { border: 1px solid #ddd; padding: 12px; font-size: 13px; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; }
              .signature { text-align: center; width: 200px; }
              .signature-space { height: 80px; }
              .total-section { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-section">
                <h1>SOCIAL SALES PRO</h1>
                <p>Hệ thống quản lý bán hàng thông minh</p>
              </div>
              <div class="info-section">
                <p>Ngày xuất: ${new Date().toLocaleString('vi-VN')}</p>
                <p>Người xuất: Admin System</p>
              </div>
            </div>
            
            <div class="report-title">
              <h2>Báo Cáo Danh Sách Đơn Hàng</h2>
              <p>Số lượng: ${orders.length} đơn hàng</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th style="text-align: right;">Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(o => `
                  <tr>
                    <td><b>${o.ID}</b></td>
                    <td>${o.Customer}</td>
                    <td>${o.Date}</td>
                    <td>${o.Status}</td>
                    <td style="text-align: right;">${o.Total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-section">
              Tổng doanh thu: ${orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0).toLocaleString()}đ
            </div>

            <div class="footer">
              <div class="signature">
                <p>Người lập biểu</p>
                <div class="signature-space"></div>
                <p>(Ký và ghi rõ họ tên)</p>
              </div>
              <div class="signature">
                <p>Xác nhận quản lý</p>
                <div class="signature-space"></div>
                <p>(Ký và đóng dấu)</p>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else if (format === 'excel') {
      const csvContent = "\uFEFF" + [
        ['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'],
        ...data.map(row => Object.values(row))
      ].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order_report_${new Date().getTime()}.csv`;
      a.click();
    }
    setIsExportOpen(false);
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };

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
      // Update local state
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    // fetchData() is now handled by filters change effects
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleReset = () => {
    const defaultFilters = { status: '', search: '', timeRange: '' };
    const defaultSort = { key: 'createdAt', direction: 'desc' };
    setFilters(defaultFilters);
    setSortConfig(defaultSort);
    fetchData(1, defaultFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await axiosClient.delete(`/orders/${id}`);
        fetchData();
      } catch (err) {
        alert('Lỗi khi xóa đơn hàng');
      }
    }
  };

  // Server-side filtering is now used, so we use orders directly

  return (
    <div className="flex flex-col gap-lg animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="text-3xl font-bold text-on-background">Quản lý đơn hàng</h2>
          <p className="text-sm text-on-surface-variant">Theo dõi lịch sử mua hàng và cập nhật trạng thái vận chuyển.</p>
        </div>
        <div className="flex gap-sm">
          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-xs px-md py-sm rounded-lg border border-outline-variant font-bold text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              <Download size={18} />
              <span className="text-sm">Xuất báo cáo</span>
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-outline-variant bg-surface-container-low text-left">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase px-2">Định dạng file</span>
                </div>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-md px-md py-4 text-left hover:bg-surface-container-high transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center group-hover:bg-error group-hover:text-white transition-all shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-on-surface text-sm">Báo cáo PDF</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Xuất định dạng tài liệu để in ấn.</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full flex items-center gap-md px-md py-4 text-left hover:bg-surface-container-high transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-on-surface text-sm">Bảng tính Excel</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Phù hợp để quản lý dữ liệu.</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-md px-md py-4 text-left hover:bg-surface-container-high transition-colors group border-t border-outline-variant/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <FileJson size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-on-surface text-sm">Dữ liệu JSON</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Dành cho tích hợp hệ thống.</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <Plus size={18} />
            <span className="text-sm">Tạo đơn mới</span>
          </button>
        </div>
      </div>

      {/* Stats Quick View (Optional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-on-surface">{pagination.total}</p>
        </div>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Chờ xử lý</p>
          <p className="text-2xl font-bold text-amber-600">{stats.totalPending}</p>
        </div>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Đang giao</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalShipping}</p>
        </div>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Doanh thu</p>
          <p className="text-2xl font-bold text-primary">{parseFloat(stats.totalRevenue).toLocaleString()}đ</p>
        </div>
      </div>

      {/* Filter Bar */}
      <OrderFilter
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSearch={() => fetchData(1)}
        filters={filters}
      />

      {/* Orders Table Section */}
      <div className="relative">
        <OrderTable
          orders={orders}
          onView={handleViewOrder}
          onDelete={handleDelete}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortConfig={sortConfig}
          loading={loading}
        />
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        loading={isDetailLoading}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* New Order Creation Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSuccess={() => fetchData(currentPage)}
      />
    </div>
  );
};

export default Orders;
