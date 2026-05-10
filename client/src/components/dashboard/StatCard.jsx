import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendType, colorClass, urgent }) => {
  return (
    <div className={`p-md rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow ${urgent ? 'bg-error-container' : 'bg-surface-container-lowest'}`}>
      <div className="flex items-center justify-between mb-sm">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass || 'bg-primary-container/10 text-primary-container'}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold rounded-full px-xs ${trendType === 'up' ? 'text-on-surface-variant bg-surface-container' : 'text-error bg-error-container'}`}>
            {trend}
          </span>
        )}
        {urgent && <span className="text-[10px] font-bold text-error uppercase">Khẩn cấp</span>}
      </div>
      <p className={`text-sm font-medium ${urgent ? 'text-on-error-container' : 'text-on-surface-variant'}`}>{title}</p>
      <p className={`text-2xl font-bold ${urgent ? 'text-on-error-container' : 'text-on-surface'}`}>{value}</p>
    </div>
  );
};

export default StatCard;
