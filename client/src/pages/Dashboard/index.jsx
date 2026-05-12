import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Download,
  Calendar,
  Plus,
  FileText,
  FileSpreadsheet,
  FileJson,
  Check
} from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import OrdersPieChart from '../../components/dashboard/OrdersPieChart';
import LatestOrdersTable from '../../components/dashboard/LatestOrdersTable';
import RecentConversations from '../../components/dashboard/RecentConversations';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [recentConvs, setRecentConvs] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Popups
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('30 ngày qua');

  const calendarRef = useRef(null);
  const downloadRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, convsRes] = await Promise.all([
        axiosClient.get(`/dashboard/stats?range=${selectedRange}`),
        axiosClient.get('/orders'),
        axiosClient.get('/conversations')
      ]);
      setStats(statsRes);
      // Fix: /orders trả về { orders: [...], stats: ..., pagination: ... }
      if (ordersRes && ordersRes.orders) {
        setLatestOrders(ordersRes.orders.slice(0, 4));
      } else if (Array.isArray(ordersRes)) {
        setLatestOrders(ordersRes.slice(0, 4));
      }
      
      // Fix: /conversations trả về mảng trực tiếp
      if (Array.isArray(convsRes)) {
        setRecentConvs(convsRes.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRange]);

  useEffect(() => {
    // Click outside to close
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setIsCalendarOpen(false);
      if (downloadRef.current && !downloadRef.current.contains(event.target)) setIsDownloadOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const pieStats = stats.ordersByStatus.map(item => {
    const total = stats.totalOrders || 1;
    let color = 'bg-surface-variant';
    if (item.status === 'completed') color = 'bg-primary';
    if (item.status === 'pending') color = 'bg-secondary-container';
    if (item.status === 'cancelled') color = 'bg-error';

    return {
      label: item.status === 'completed' ? 'Hoàn thành' : item.status === 'pending' ? 'Đang chờ' : 'Đã hủy',
      value: item._count,
      percent: Math.round((item._count / total) * 100),
      color: color
    };
  });

  const rangeOptions = ['Hôm nay', '7 ngày qua', '30 ngày qua', 'Quý này', 'Năm nay'];

  return (
    <div className="space-y-lg animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md relative">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Tổng quan hệ thống</h1>
          <p className="text-sm text-on-surface-variant">Số liệu hiệu suất thời gian thực và phân tích từ AI.</p>
        </div>

        <div className="flex gap-sm">
          {/* Calendar Dropdown */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`flex items-center gap-xs px-md py-sm rounded-lg font-bold transition-all ${isCalendarOpen ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-high text-primary hover:bg-surface-variant'
                }`}
            >
              <Calendar size={18} />
              <span className="text-sm">{selectedRange}</span>
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-outline-variant bg-surface-container-low">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase px-2">Chọn khoảng thời gian</span>
                </div>
                {rangeOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => { setSelectedRange(option); setIsCalendarOpen(false); }}
                    className="w-full flex items-center justify-between px-md py-3 text-sm hover:bg-primary/10 transition-colors text-left"
                  >
                    <span className={selectedRange === option ? 'text-primary font-bold' : 'text-on-surface'}>{option}</span>
                    {selectedRange === option && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative" ref={downloadRef}>
            <button
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              <Download size={18} />
              <span className="text-sm">Xuất báo cáo</span>
            </button>

            {isDownloadOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-outline-variant bg-surface-container-low">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase px-2">Định dạng file</span>
                </div>
                <button className="w-full flex items-center gap-md px-md py-4 text-left hover:bg-surface-container-high transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center group-hover:bg-error group-hover:text-white transition-all shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-on-surface text-sm">Báo cáo PDF</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Xuất định dạng tài liệu để in ấn hoặc gửi email.</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-md px-md py-4 text-left hover:bg-surface-container-high transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-on-surface text-sm">Bảng tính Excel</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Phù hợp để tính toán và quản lý dữ liệu kho.</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-md px-md py-4 text-left hover:bg-surface-container-high transition-colors group border-t border-outline-variant/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <FileJson size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-on-surface text-sm">Dữ liệu JSON / CSV</p>
                    <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">Dành cho việc tích hợp hệ thống hoặc kỹ thuật.</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-md">
        <StatCard title="Sản phẩm" value={stats.totalProducts} icon={Package} trend="+2.4%" trendType="up" colorClass="bg-secondary-container/10 text-secondary-container" />
        <StatCard title="Khách hàng" value={stats.totalCustomers} icon={Users} trend="-1.2%" trendType="down" colorClass="bg-primary-container/10 text-primary-container" />
        <StatCard title="Đơn hàng" value={stats.totalOrders} icon={ShoppingCart} trend="+12%" trendType="up" colorClass="bg-tertiary-container/10 text-tertiary-container" />
        <StatCard title="Doanh thu" value={`${stats.totalRevenue.toLocaleString()} đ`} icon={DollarSign} trend="+5.7%" trendType="up" colorClass="bg-primary/10 text-primary" />
        <StatCard title="Đang xử lý" value={stats.ordersByStatus.find(s => s.status === 'pending')?._count || 0} icon={TrendingUp} colorClass="bg-tertiary/10 text-tertiary" />
        <StatCard title="Chưa trả lời" value={stats.activeConversations} icon={MessageSquare} urgent={stats.activeConversations > 0} colorClass="bg-error/10 text-error" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <RevenueChart data={stats.revenueTrends} />
        <OrdersPieChart total={stats.totalOrders} stats={pieStats} />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <LatestOrdersTable orders={latestOrders} />
        <RecentConversations conversations={recentConvs} />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Dashboard;
