import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const CustomerStats = ({ total, returnRate, topChannel }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {/* Thẻ Tổng khách hàng */}
      <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-xs">
        <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">TỔNG KHÁCH HÀNG</span>
        <div className="flex items-end gap-sm">
          <span className="text-4xl font-bold text-primary tracking-tight">{total.toLocaleString()}</span>
          <span className="text-primary text-xs font-bold mb-2">+12%</span>
        </div>
      </div>

      {/* Thẻ Tỷ lệ quay lại */}
      <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-xs">
        <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">TỶ LỆ QUAY LẠI</span>
        <div className="flex items-end gap-sm">
          <span className="text-4xl font-bold text-secondary tracking-tight">{returnRate}%</span>
          <span className="text-secondary text-xs font-bold mb-2">ổn định</span>
        </div>
      </div>

      {/* Thẻ Kênh hiệu quả */}
      <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-xs">
        <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">KÊNH HIỆU QUẢ</span>
        <div className="flex items-center gap-sm mt-sm">
          <div className="bg-primary-container text-on-primary-container px-2 py-1 rounded text-xs font-bold">Facebook</div>
          <span className="text-on-surface-variant text-xs">65% traffic</span>
        </div>
      </div>

    </div>
  );
};

export default CustomerStats;
