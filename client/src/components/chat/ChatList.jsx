import React from 'react';
import { Search, MessageSquare, Instagram, Phone } from 'lucide-react';

const ChatList = ({ chats, activeChatId, onChatSelect }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activePlatform, setActivePlatform] = React.useState('all');

  const platforms = [
    { id: 'all', label: 'Tất cả' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'zalo', label: 'Zalo' },
    { id: 'tiktok', label: 'TikTok' },
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.customer?.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = activePlatform === 'all' || chat.customer?.socialPlatform === activePlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="w-80 flex flex-col border-r border-outline-variant bg-surface-container-lowest h-full">
      {/* Search & Filter */}
      <div className="p-md space-y-md shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Tìm kiếm hội thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-xs overflow-x-auto pb-xs no-scrollbar shrink-0">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              className={`${activePlatform === p.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                } text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full whitespace-nowrap active:scale-95 transition-all`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-md border-b border-outline-variant/30 flex gap-md cursor-pointer transition-all hover:bg-surface-container-low ${activeChatId === chat.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
            >
              <div className="relative shrink-0">
                {chat.customer?.imageUrl ? (
                  <img src={chat.customer.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {chat.customer?.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-black text-on-surface truncate">{chat.customer?.fullName}</span>
                  <span className="text-[10px] text-on-surface-variant font-medium shrink-0">
                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs truncate mt-1 text-on-surface-variant">
                  Bấm để xem hội thoại...
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  {chat.customer?.socialPlatform === 'zalo' && <MessageSquare size={12} className="text-blue-600" />}
                  {chat.customer?.socialPlatform === 'facebook' && <MessageSquare size={12} className="text-primary" />}
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                    {chat.customer?.socialPlatform || 'Platform'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant/40 animate-in fade-in duration-500">
            <MessageSquare size={48} strokeWidth={1} />
            <p className="text-xs font-black uppercase tracking-widest mt-4">Không tìm thấy hội thoại</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
