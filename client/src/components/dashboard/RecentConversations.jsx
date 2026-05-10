import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Bot } from 'lucide-react';

const RecentConversations = ({ conversations }) => {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      <div className="p-8 flex justify-between items-center">
        <h3 className="text-xl font-black text-on-surface uppercase tracking-widest">Hội thoại mới</h3>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-container/10 rounded-full">
          <Zap size={14} className="text-secondary-container fill-current animate-pulse" />
          <span className="text-[10px] font-black text-secondary-container uppercase tracking-widest">AI Active</span>
        </div>
      </div>

      <div className="flex-1 divide-y divide-outline-variant/30 px-4 pb-4">
        {conversations.map(conv => (
          <Link 
            to="/chat" 
            key={conv.id} 
            className="p-4 flex items-center gap-4 hover:bg-surface-container-low rounded-[24px] transition-all duration-300 group mb-1"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
              {conv.customer?.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors truncate">
                  {conv.customer?.fullName}
                </p>
                <span className="text-[10px] font-bold text-on-surface-variant opacity-40">
                  {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-1 opacity-70 mb-2">
                {conv.lastMessage || 'Bắt đầu cuộc hội thoại...'}
              </p>
              <div className="flex gap-2">
                {conv.messages && conv.messages[conv.messages.length-1]?.senderType === 'bot' ? (
                  <span className="text-[9px] px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-black uppercase tracking-widest flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    AI đã phản hồi
                  </span>
                ) : (
                  <span className="text-[9px] px-3 py-1 bg-error/10 text-error rounded-full font-black uppercase tracking-widest">
                    Chờ trả lời
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentConversations;
