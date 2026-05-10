import React from 'react';

const RevenueChart = ({ data = [] }) => {
  const maxRevenue = data.length > 0 ? Math.max(...data.map(d => d.revenue)) : 1;

  const displayData = data.length > 0 ? data : [
    { date: 'N/A', revenue: 0 },
    { date: 'N/A', revenue: 0 },
    { date: 'N/A', revenue: 0 },
    { date: 'N/A', revenue: 0 },
    { date: 'N/A', revenue: 0 },
    { date: 'N/A', revenue: 0 },
  ];

  return (
    <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col relative group">
      {/* Header section with padding */}
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-black text-on-surface uppercase tracking-widest">Xu hướng doanh thu</h3>
            <p className="text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-wider">Doanh số thực tế dựa trên các đơn hàng đã hoàn thành</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>

      {/* Scrollable Chart Area */}
      <div className="mt-auto overflow-x-auto custom-scrollbar">
        <div
          className="h-64 flex items-end justify-between gap-4 px-8 pb-2 relative"
          style={{ minWidth: `${Math.max(displayData.length * 60, 600)}px` }}
        >
          {/* Grid Lines (now inside scroll area to align with bars) */}
          <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none opacity-5 px-8">
            <div className="border-t border-outline-variant w-full"></div>
            <div className="border-t border-outline-variant w-full"></div>
            <div className="border-t border-outline-variant w-full"></div>
          </div>

          {displayData.map((d, idx) => {
            const height = d.revenue > 0 ? (d.revenue / maxRevenue) * 100 : 5;
            const dateLabel = d.date !== 'N/A' ? new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '---';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group/bar relative shrink-0">
                <div
                  style={{
                    height: `${height}%`,
                    animationDelay: `${idx * 0.05}s`
                  }}
                  className={`w-10 rounded-t-xl transition-all relative 
                    bg-gradient-to-t from-primary/10 to-primary/60 
                    group-hover/bar:from-primary/30 group-hover/bar:to-primary
                    animate-in slide-in-from-bottom-full duration-700 ease-out fill-mode-backwards`}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap z-10 shadow-xl pointer-events-none">
                    {d.revenue.toLocaleString()}đ
                  </div>
                </div>
                <span className="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-tighter mb-1">{dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
