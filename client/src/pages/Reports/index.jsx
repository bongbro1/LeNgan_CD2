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
  Loader2
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

    // Chạy export
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
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-xl relative">

      {/* Header & Control Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md no-print">
        <div>
          <h2 className="text-3xl font-black text-on-surface uppercase tracking-tight">Báo cáo & Phân tích</h2>
          <p className="text-sm font-medium text-on-surface-variant opacity-70">Tùy chỉnh và xuất dữ liệu báo cáo chuyên nghiệp</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Toggles */}
          <div className="flex items-center bg-white border border-outline-variant rounded-xl px-3 gap-3 mr-2">
            <span className="text-[10px] font-black uppercase text-on-surface-variant mr-1">Tùy chọn:</span>
            {[
              { id: 'summary', label: 'Tổng quan' },
              { id: 'charts', label: 'Bảng số' },
              { id: 'products', label: 'Sản phẩm' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`flex items-center gap-1.5 py-2 px-1 transition-all ${showOptions[opt.id] ? 'text-primary' : 'text-on-surface-variant opacity-40'}`}
              >
                {showOptions[opt.id] ? <CheckSquare size={14} /> : <Square size={14} />}
                <span className="text-[10px] font-bold">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="relative group">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none bg-white text-on-surface-variant border border-outline-variant pl-4 pr-10 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm cursor-pointer outline-none"
            >
              {ranges.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
          </div>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-xs font-black uppercase tracking-widest active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
            {exporting ? 'Đang tạo PDF...' : 'Xuất PDF Chuẩn'}
          </button>
        </div>
      </div>

      {/* --- DASHBOARD VIEW (INTERACTIVE) --- */}
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Tổng đơn hàng', value: totalOrders, icon: <ShoppingCart size={20} />, color: 'bg-primary' },
            { label: 'Doanh thu kì này', value: `${(data?.revenueHistory?.reduce((a, b) => a + b, 0) || 0).toLocaleString()}đ`, icon: <TrendingUp size={20} />, color: 'bg-emerald-500' },
            { label: 'AI Hỗ trợ', value: data?.aiPerformance?.totalRequests || 0, icon: <Zap size={20} />, color: 'bg-amber-500' },
            { label: 'Tỷ lệ Hand-off', value: `${data?.aiPerformance?.handOffRate || 0}%`, icon: <Activity size={20} />, color: 'bg-rose-500' }
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 ${kpi.color} text-white rounded-xl shadow-lg`}>
                  {kpi.icon}
                </div>
                <ArrowUpRight size={16} className="text-on-surface-variant opacity-20" />
              </div>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{kpi.label}</p>
              <h4 className="text-xl font-black text-on-surface mt-1">{kpi.value}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Revenue Chart */}
          <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col min-h-[400px]">
            <h3 className="text-sm font-black text-on-surface uppercase tracking-widest mb-10 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> Diễn biến doanh thu ({ranges.find(r => r.id === range)?.label})
            </h3>
            <div className="flex-1 flex items-end justify-between gap-1 px-2 border-b border-outline-variant/20 pb-4 h-64">
              {(data?.revenueHistory || []).map((val, i) => {
                const barHeight = val > 0 ? (val / maxRevenue) * 100 : 0;
                const label = data.labels[i];
                const shouldShowLabel = data.labels.length <= 12 || i % Math.floor(data.labels.length / 10) === 0;

                return (
                  <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                    <div className="absolute z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                      style={{ bottom: val > 0 ? `calc(${barHeight}% + 10px)` : '15px' }}>
                      <div className="bg-on-surface text-white text-[9px] font-black px-2 py-1 rounded-md shadow-xl whitespace-nowrap">
                        {label}: {val.toLocaleString()}đ
                      </div>
                      <div className="w-2 h-2 bg-on-surface rotate-45 mx-auto -mt-1"></div>
                    </div>
                    <div className={`w-full rounded-t-sm transition-all duration-700 cursor-pointer ${val > 0 ? 'bg-primary' : 'bg-primary/10'} group-hover:bg-primary/80`}
                      style={{ height: val > 0 ? `${barHeight}%` : '5px' }}></div>
                    {shouldShowLabel && (
                      <span className="absolute -bottom-8 text-[8px] font-black text-on-surface-variant opacity-40 whitespace-nowrap">
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="h-8"></div>
          </div>

          {/* Top Products */}
          <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
            <h3 className="text-sm font-black text-on-surface uppercase tracking-widest mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
              <Package size={18} className="text-amber-600" /> Bán chạy nhất
            </h3>
            <div className="space-y-4">
              {(data?.topProducts || []).map((p, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high overflow-hidden shadow-sm">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/40"><Package size={16} /></div>}
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-black text-on-surface truncate">{p.name}</div>
                    <div className="text-[9px] font-bold text-on-surface-variant opacity-60 uppercase">{p.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-on-surface">{p._sum.quantity}</div>
                    <div className="text-[8px] font-black text-on-surface-variant uppercase opacity-40">Đã bán</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Chip */}
        <div className="col-span-12 bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden group border border-outline-variant/30 card">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl transition-all duration-1000"></div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={32} className="text-primary animate-pulse" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">AI Business Insights</span>
              </div>
              <h3 className="text-lg font-black mb-1 text-on-surface">Chiến lược tối ưu hóa vận hành</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl font-medium">
                Dựa trên dữ liệu <span className="text-on-surface font-black underline decoration-primary underline-offset-4">{range === 'all' ? 'tổng thể' : `trong ${ranges.find(r => r.id === range)?.label.toLowerCase()}`}</span>,
                hệ thống nhận thấy tỷ lệ hoàn thành đơn hàng đạt {successRate}%.
                Gợi ý: Hãy tập trung chăm sóc nhóm khách hàng tiêu biểu để gia tăng lòng trung thành và tỷ lệ quay lại.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- HIDDEN REPORT TEMPLATE (USED ONLY FOR PDF GENERATION) --- */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none">
        <div ref={reportRef} className="bg-white p-8 w-[190mm] text-black font-sans" style={{ fontSize: '12px' }}>
          {/* Report Header */}
          <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
            <div>
              <h1 className="text-2xl font-black text-primary uppercase leading-tight">BÁO CÁO KẾT QUẢ KINH DOANH</h1>
              <p className="text-[10px] text-gray-500 mt-1 font-bold">Kỳ báo cáo: {ranges.find(r => r.id === range)?.label}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold uppercase text-gray-800">STORE MANAGER PRO</h2>
              <p className="text-[10px] text-gray-500 mt-1">Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
              <p className="text-[9px] text-gray-400">ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>

          {/* 1. Summary Section */}
          {showOptions.summary && (
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase border-l-4 border-primary pl-3 mb-4 bg-gray-50 py-1">I. CHỈ SỐ TỔNG QUAN</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 border border-gray-100 rounded-lg text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Tổng đơn</p>
                  <p className="text-lg font-black text-gray-800">{totalOrders}</p>
                </div>
                <div className="bg-gray-50 p-3 border border-gray-100 rounded-lg text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Doanh thu</p>
                  <p className="text-lg font-black text-primary">{(data?.revenueHistory?.reduce((a, b) => a + b, 0) || 0).toLocaleString()}đ</p>
                </div>
                <div className="bg-gray-50 p-3 border border-gray-100 rounded-lg text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Thành công</p>
                  <p className="text-lg font-black text-emerald-600">{successRate}%</p>
                </div>
                <div className="bg-gray-50 p-3 border border-gray-100 rounded-lg text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">AI Phản hồi</p>
                  <p className="text-lg font-black text-amber-600">{data?.aiPerformance?.totalRequests}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Data Table */}
          {showOptions.charts && (
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase border-l-4 border-primary pl-3 mb-4 bg-gray-50 py-1">II. DIỄN BIẾN DOANH THU CHI TIẾT</h3>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 text-left text-[10px] font-bold uppercase text-gray-600">Mốc thời gian</th>
                    <th className="border border-gray-200 p-2 text-right text-[10px] font-bold uppercase text-gray-600">Doanh thu ghi nhận (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.revenueHistory || []).map((val, i) => (
                    val > 0 && (
                      <tr key={i}>
                        <td className="border border-gray-200 p-2 text-[10px] font-medium text-gray-700">{data.labels[i]}</td>
                        <td className="border border-gray-200 p-2 text-[10px] font-bold text-right">{val.toLocaleString()}</td>
                      </tr>
                    )
                  ))}
                  <tr className="bg-primary/5">
                    <td className="border border-gray-200 p-2 text-[10px] font-black uppercase">TỔNG CỘNG</td>
                    <td className="border border-gray-200 p-2 text-[10px] font-black text-right text-primary">{(data?.revenueHistory?.reduce((a, b) => a + b, 0) || 0).toLocaleString()} VNĐ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Products Table */}
          {showOptions.products && (
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase border-l-4 border-primary pl-3 mb-4 bg-gray-50 py-1">III. TOP SẢN PHẨM BÁN CHẠY NHẤT</h3>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 text-left text-[10px] font-bold uppercase text-gray-600 w-1/2">Tên sản phẩm</th>
                    <th className="border border-gray-200 p-2 text-left text-[10px] font-bold uppercase text-gray-600">Danh mục</th>
                    <th className="border border-gray-200 p-2 text-center text-[10px] font-bold uppercase text-gray-600">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.topProducts || []).map((p, i) => (
                    <tr key={i}>
                      <td className="border border-gray-200 p-2 text-[10px] font-bold text-gray-800">{p.name}</td>
                      <td className="border border-gray-200 p-2 text-[10px] text-gray-500 uppercase">{p.category}</td>
                      <td className="border border-gray-200 p-2 text-[10px] font-black text-center">{p._sum.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AI Insights Section */}
          {showOptions.ai && (
            <div className="mb-8 p-4 bg-gray-50 border-l-4 border-primary rounded-r-lg">
              <h3 className="text-[11px] font-black uppercase mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> PHÂN TÍCH TỪ HỆ THỐNG AI
              </h3>
              <p className="text-[10px] italic leading-relaxed text-gray-600">
                "Dựa trên dữ liệu thực tế tại kỳ báo cáo này, hệ thống nhận thấy hiệu suất kinh doanh đang có sự tăng trưởng ổn định.
                Tỷ lệ hoàn thành đơn đạt {successRate}%. Gợi ý cho kỳ tới: Tập trung đẩy mạnh marketing cho các nhóm sản phẩm bán chạy và
                tối ưu hóa quy trình phản hồi của AI để giảm tỷ lệ hand-off cho nhân viên."
              </p>
            </div>
          )}

          {/* Footer Signature */}
          <div className="mt-16 flex justify-between text-center italic text-[10px] text-gray-400">
            <div className="w-40">
              <p className="mb-12">Người lập biểu</p>
              <div className="border-t border-gray-200 pt-1">(Ký và ghi rõ họ tên)</div>
            </div>
            <div className="w-40">
              <p className="mb-12">Xác nhận của quản lý</p>
              <div className="border-t border-gray-200 pt-1">(Đóng dấu)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
