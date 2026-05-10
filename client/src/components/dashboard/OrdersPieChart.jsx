import React from 'react';

const OrdersPieChart = ({ total, stats }) => {
  // stats: [{ label: 'Hoàn thành', value: 70, color: 'bg-primary', percent: 70, hex: '#004ac6' }, ...]
  
  // Calculate cumulative offset for each segment
  let currentOffset = 0;

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-outline-variant/30 flex flex-col h-full animate-in fade-in zoom-in-95 duration-700">
      <h3 className="text-xl font-black text-on-surface uppercase tracking-widest mb-8">Trạng thái đơn hàng</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-56 h-56 mb-8 group">
          {/* Main SVG Chart */}
          <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 42 42">
            {/* Background Circle */}
            <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="6"></circle>
            
            {stats.map((s, i) => {
              const dashArray = `${s.percent} ${100 - s.percent}`;
              const dashOffset = 100 - currentOffset;
              currentOffset += s.percent;

              // Convert Tailwind color classes to Hex for SVG stroke (approximate matching)
              let strokeColor = '#004ac6'; // Default primary
              if (s.color.includes('secondary')) strokeColor = '#8a4cfc';
              if (s.color.includes('error')) strokeColor = '#ba1a1a';
              if (s.color.includes('tertiary')) strokeColor = '#943700';

              return (
                <circle
                  key={i}
                  cx="21"
                  cy="21"
                  r="15.9155"
                  fill="transparent"
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-out cursor-pointer hover:stroke-[7]"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-on-surface tracking-tighter">{total}</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Đơn hàng</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="w-full grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-2xl group hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${s.color} shadow-sm group-hover:scale-150 transition-transform`}></div>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{s.label}</span>
              </div>
              <span className="text-sm font-black text-on-surface">{s.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPieChart;
