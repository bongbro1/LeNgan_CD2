import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import html2pdf from 'html2pdf.js';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  PieChart,
  Package,
  Users,
  Activity,
  ArrowUpRight,
  Zap,
  ShoppingCart,
  ChevronDown,
  Printer,
  CheckSquare,
  Square,
  Loader2,
  AlertTriangle,
  Globe,
  Facebook,
  MessageCircle,
  Clock
} from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [range, setRange] = useState('year');
  const reportRef = useRef(null);

  const [showOptions, setShowOptions] = useState({
    summary: true,
    charts: true,
    products: true,
    customers: true,
    inventory: true,
    ai: true
  });

  const fetchData = async (selectedRange) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/reports?range=${selectedRange || range}`);
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);
  }, [range]);

  const handleExportPDF = () => {
    if (!reportRef.current) return;

    setExporting(true);
    const element = reportRef.current;
    const rangeLabel = ranges.find(r => r.id === range)?.label || 'Bao-cao';
    const filename = `Bao_cao_kinh_doanh_${rangeLabel.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setExporting(false);
    }).catch(err => {
      console.error('Export error:', err);
      setExporting(false);
    });
  };

  const toggleOption = (opt) => {
    setShowOptions(prev => ({ ...prev, [opt]: !prev[opt] }));
  };

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[500px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const getStatusCount = (status) => {
    return data?.ordersByStatus?.find(s => s.status === status)?._count || 0;
  };

  const totalOrders = data?.ordersByStatus?.reduce((sum, s) => sum + s._count, 0) || 0;
  const successRate = totalOrders > 0 ? Math.round((getStatusCount('completed') / totalOrders) * 100) : 0;
  const maxRevenue = Math.max(...(data?.revenueHistory || [1000]), 1000);

  const ranges = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'week', label: 'Tuần này' },
    { id: 'month', label: 'Tháng này' },
    { id: 'year', label: 'Năm nay' },
    { id: 'all', label: 'Toàn thời gian' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-xl relative font-inter">

      {/* Header & Control Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md no-print">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Báo cáo & Phân tích</h2>
          <p className="text-sm font-medium text-slate-500">Thống kê kinh doanh, tồn kho và khách hàng</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 gap-3 mr-2 shadow-sm">
            <span className="text-[10px] font-black uppercase text-slate-400 mr-1">Hiển thị:</span>
            {[
              { id: 'inventory', label: 'Tồn kho' },
              { id: 'customers', label: 'Khách hàng' },
              { id: 'products', label: 'Sản phẩm' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`flex items-center gap-1.5 py-2 px-1 transition-all ${showOptions[opt.id] ? 'text-primary' : 'text-slate-300'}`}
              >
                {showOptions[opt.id] ? <CheckSquare size={14} /> : <Square size={14} />}
                <span className="text-[10px] font-bold">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none bg-white text-slate-700 border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ranges.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all text-xs font-bold active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
            {exporting ? 'Đang tạo PDF...' : 'Xuất Báo Cáo'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Tổng doanh thu', value: `${(data?.revenueHistory?.reduce((a, b) => a + b, 0) || 0).toLocaleString()}đ`, icon: <TrendingUp size={20} />, color: 'bg-emerald-500', trend: '+12%' },
            { label: 'Đơn hàng mới', value: totalOrders, icon: <ShoppingCart size={20} />, color: 'bg-indigo-500', trend: '+5%' },
            { label: 'Giá trị tồn kho', value: `${(data?.inventoryStats?.totalValue || 0).toLocaleString()}đ`, icon: <Package size={20} />, color: 'bg-amber-500', trend: 'Ổn định' },
            { label: 'AI Phản hồi', value: data?.aiPerformance?.totalRequests || 0, icon: <Zap size={20} />, color: 'bg-violet-500', trend: '98%' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${kpi.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {kpi.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-full">{kpi.trend}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Revenue Chart */}
          <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-3xl shadow-sm border border-slate-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" /> Doanh thu theo thời gian
              </h3>
            </div>
            <div className="flex flex-col h-72">
              <div className="flex-1 flex items-end justify-between gap-2 px-2">
                {(data?.revenueHistory || []).map((val, i) => {
                  const barHeight = val > 0 ? (val / maxRevenue) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                      <div className="absolute z-20 opacity-0 group-hover:opacity-100 transition-all bottom-full mb-2 pointer-events-none">
                        <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                          {val.toLocaleString()}đ
                        </div>
                      </div>
                      <div className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer ${val > 0 ? 'bg-primary' : 'bg-slate-100'} group-hover:bg-primary/80`}
                        style={{ height: val > 0 ? `${barHeight}%` : '8px' }}></div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels Row */}
              <div className="flex justify-between gap-2 px-2 mt-4 h-6 border-t border-slate-50 pt-2">
                {(data?.labels || []).map((label, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap inline-block">
                      {data.labels.length > 15 ? (i % 5 === 0 ? label : '') : label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-300">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" /> Trạng thái đơn hàng
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Hoàn thành', status: 'completed', color: 'bg-emerald-500' },
                { label: 'Đang giao', status: 'shipping', color: 'bg-blue-500' },
                { label: 'Chờ xác nhận', status: 'pending', color: 'bg-amber-500' },
                { label: 'Đã hủy', status: 'cancelled', color: 'bg-rose-500' }
              ].map((s, i) => {
                const count = getStatusCount(s.status);
                const percent = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-600">{s.label}</span>
                      <span className="text-slate-900">{count} đơn ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-around text-center">
              <div>
                <div className="text-lg font-black text-slate-900">{successRate}%</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Tỷ lệ thành công</div>
              </div>
              <div className="w-px bg-slate-100"></div>
              <div>
                <div className="text-lg font-black text-slate-900">{totalOrders}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Tổng đơn hàng</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Inventory Alerts */}
          <div className="col-span-12 lg:col-span-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-500" /> Cảnh báo tồn kho thấp
              </h3>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">Cần nhập hàng gấp</span>
            </div>
            <div className="divide-y divide-slate-50">
              {(data?.inventoryStats?.lowStock || []).map((p, i) => (
                <div key={i} className="py-3 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.category?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-rose-500">{p.stock}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Còn lại</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Platforms */}
          <div className="col-span-12 lg:col-span-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-300">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> Phân bổ khách hàng
            </h3>
            <div className="flex items-center justify-around h-48">
              {(data?.platformDistribution || []).map((p, i) => {
                const total = data.platformDistribution.reduce((acc, curr) => acc + curr._count, 0);
                const percent = Math.round((p._count / total) * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke={p.socialPlatform === 'facebook' ? '#1877F2' : '#0068FF'} strokeWidth="8"
                          strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * percent) / 100} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {p.socialPlatform === 'facebook' ? <Facebook size={24} className="text-[#1877F2]" /> : <MessageCircle size={24} className="text-[#0068FF]" />}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-900 uppercase">{p.socialPlatform}</div>
                      <div className="text-xs font-bold text-slate-400">{p._count} khách ({percent}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="col-span-12 bg-white p-5 rounded-3xl shadow-sm border border-slate-300">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={18} className="text-primary" /> Top khách hàng chi tiêu mạnh
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="text-left pb-4">Khách hàng</th>
                  <th className="text-center pb-4">Số đơn hàng</th>
                  <th className="text-right pb-4">Tổng chi tiêu</th>
                  <th className="text-right pb-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(data?.topCustomers || []).map((c, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{c.fullName}</div>
                          <div className="text-xs text-slate-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center text-sm font-bold text-slate-700">{c._count.id}</td>
                    <td className="py-4 text-right text-sm font-black text-primary">{c._sum.totalAmount.toLocaleString()}đ</td>
                    <td className="py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- HIDDEN PDF TEMPLATE --- */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none">
        <div ref={reportRef} className="bg-white p-12 w-[210mm] text-slate-900 font-sans">
          <div className="flex justify-between items-center border-b-4 border-slate-900 pb-8 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase">BÁO CÁO CHI TIẾT KINH DOANH</h1>
              <p className="text-xs text-slate-500 font-bold mt-2">Thời gian: {ranges.find(r => r.id === range)?.label} | Xuất ngày: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black">AURA SALES PRO</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Management System</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5 mb-12">
            {[
              { label: 'Tổng doanh thu', value: `${(data?.revenueHistory?.reduce((a, b) => a + b, 0) || 0).toLocaleString()}đ` },
              { label: 'Tổng đơn hàng', value: totalOrders },
              { label: 'Tỷ lệ thành công', value: `${successRate}%` },
              { label: 'Giá trị tồn kho', value: `${(data?.inventoryStats?.totalValue || 0).toLocaleString()}đ` }
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{s.label}</p>
                <p className="text-lg font-black text-slate-900">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-black uppercase mb-4 pb-2 border-b-2 border-slate-100">I. PHÂN TÍCH TỒN KHO & SẢN PHẨM</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-left">Tên sản phẩm</th>
                  <th className="p-3 text-left">Danh mục</th>
                  <th className="p-3 text-right">Tồn kho</th>
                  <th className="p-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {(data?.inventoryStats?.lowStock || []).map((p, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-3 font-bold">{p.name}</td>
                    <td className="p-3 text-slate-500">{p.category?.name}</td>
                    <td className="p-3 text-right font-black text-rose-500">{p.stock}</td>
                    <td className="p-3 text-right text-[10px] font-bold uppercase text-rose-400">Cần nhập thêm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-black uppercase mb-4 pb-2 border-b-2 border-slate-100">II. THỐNG KÊ KHÁCH HÀNG CHI TIÊU</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 text-left">Họ tên</th>
                  <th className="p-3 text-center">Số đơn hàng</th>
                  <th className="p-3 text-right">Tổng chi tiêu (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topCustomers || []).map((c, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-3 font-bold">{c.fullName}</td>
                    <td className="p-3 text-center">{c._count.id}</td>
                    <td className="p-3 text-right font-black text-primary">{c._sum.totalAmount.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-slate-900 text-white rounded-2xl">
            <h3 className="text-xs font-black uppercase mb-3 flex items-center gap-2">
              <Sparkles size={14} /> KẾT LUẬN & KHUYẾN NGHỊ TỪ AI
            </h3>
            <p className="text-xs leading-relaxed opacity-80 italic">
              "Hệ thống ghi nhận sự tăng trưởng ổn định về doanh thu trong kỳ báo cáo này. Tuy nhiên, có {data?.inventoryStats?.lowStock?.length} sản phẩm đang ở mức tồn kho báo động, cần có kế hoạch nhập hàng ngay để không gián đoạn kinh doanh. Tỷ lệ khách hàng từ Facebook ({data?.platformDistribution?.find(p => p.socialPlatform === 'facebook')?._count || 0}) đang chiếm ưu thế, khuyến nghị đẩy mạnh quảng cáo trên kênh này."
            </p>
          </div>

          <div className="mt-20 flex justify-between text-center">
            <div className="w-48">
              <div className="h-px bg-slate-200 mb-2"></div>
              <p className="text-[10px] font-bold uppercase">Người lập báo cáo</p>
            </div>
            <div className="w-48">
              <div className="h-px bg-slate-200 mb-2"></div>
              <p className="text-[10px] font-bold uppercase">Xác nhận giám đốc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
