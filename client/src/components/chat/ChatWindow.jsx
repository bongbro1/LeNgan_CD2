import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, MoreVertical, Paperclip, Smile, Sparkles, Check, Edit2, MessageSquare, ShieldCheck, Zap, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ chat, loading, onSendMessage, onDeleteConversation, aiAssistEnabled, onToggleAiAssist }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleFileUpload = () => fileInputRef.current?.click();
  const toggleAiAssist = () => onToggleAiAssist();
  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return (
    <div className="flex-grow flex flex-col items-center justify-center bg-surface-container-low/30 h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Đang tải cuộc hội thoại...</p>
    </div>
  );

  if (!chat) return (
    <div className="flex-grow flex flex-col items-center justify-center bg-surface-container-low/30 text-on-surface-variant/40 animate-in fade-in duration-700 h-full">
      <div className="relative">
        <MessageSquare size={120} strokeWidth={1} />
        <Zap className="absolute top-0 -right-2 text-primary animate-bounce" size={40} />
      </div>
      <p className="text-2xl font-black uppercase tracking-[0.3em] mt-8">Chọn hội thoại</p>
    </div>
  );

  return (
    <div className="flex-grow flex flex-col bg-white h-full min-w-0 relative">
      {/* Header Profile - Premium Glass Effect */}
      <div className="px-lg h-20 border-b border-outline-variant/30 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-lg">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
            {chat.customer?.imageUrl ? (
              <img src={chat.customer.imageUrl} alt="" className="w-12 h-12 rounded-full relative border-2 border-white shadow-sm object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full relative border-2 border-white shadow-sm bg-primary/10 text-primary flex items-center justify-center font-bold">
                {chat.customer?.fullName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-black text-on-surface tracking-tight flex items-center gap-2">
              {chat.customer?.fullName}
              <ShieldCheck size={16} className="text-primary" />
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Đang trực tuyến</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 mr-3 rounded-xl border border-outline-variant/30">
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">Đang xử lý bởi AI</span>
          </div>
          <button className="p-2 hover:bg-surface-container-low rounded-xl transition-all text-on-surface-variant hover:text-primary active:scale-90">
            <Phone size={18} />
          </button>
          
          <div className="relative" ref={moreMenuRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-2 rounded-xl transition-all active:scale-90 ${showMoreMenu ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
            >
              <MoreVertical size={18} />
            </button>

            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-on-surface-variant hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors">
                  <Edit2 size={14} /> Đánh dấu chưa đọc
                </button>
                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-on-surface-variant hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors">
                  <MessageSquare size={14} /> Chuyển tiếp cho AI
                </button>
                <div className="my-1 border-t border-outline-variant/20"></div>
                <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-error hover:bg-error/5 flex items-center gap-3 transition-colors">
                  <ShieldCheck size={14} /> Chặn khách hàng
                </button>
                <button 
                  onClick={() => {
                    onDeleteConversation(chat.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-error hover:bg-error/5 flex items-center gap-3 transition-colors"
                >
                   <Trash2 size={14} /> Xóa cuộc hội thoại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area - Advanced Layout */}
      <div className="flex-1 overflow-y-auto p-lg space-y-md custom-scrollbar bg-[radial-gradient(#f3f4f6_1px,transparent_1px)] [background-size:20px_20px]">
        {chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-md max-w-[85%] lg:max-w-[70%] animate-in duration-300 ${
                ['staff', 'bot'].includes(msg.senderType) ? 'flex-row-reverse ml-auto slide-in-from-right-4' : 'slide-in-from-left-4'
              }`}
            >
              <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-md border ${
                ['staff', 'bot'].includes(msg.senderType) 
                ? 'bg-primary text-on-primary rounded-br-none border-primary/20' 
                : 'bg-white text-on-surface rounded-bl-none border-outline-variant/30'
              }`}>
                <div className="markdown-body">
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-normal" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-xl font-black mb-2 mt-1 border-b border-current/20 pb-1" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-1" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold mb-1 mt-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-black text-inherit underline decoration-2 decoration-current/30 underline-offset-2" {...props} />,
                      code: ({node, ...props}) => <code className="bg-black/10 px-1.5 py-0.5 rounded font-mono text-[12px]" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <div className={`mt-2 flex items-center justify-end gap-2 ${['staff', 'bot'].includes(msg.senderType) ? 'text-on-primary/60' : 'text-on-surface/40'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {['staff', 'bot'].includes(msg.senderType) && <ShieldCheck size={12} className="opacity-80" />}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
             <MessageSquare size={64} />
             <p className="text-xs font-black uppercase tracking-widest mt-4">Chưa có tin nhắn</p>
          </div>
        )}
        {chat?.isTyping && (
          <div className="flex items-start gap-3 flex-row-reverse ml-auto slide-in-from-right-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <Sparkles size={16} className="text-primary animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-br-none bg-primary text-on-primary border border-primary/10 shadow-sm">
              <div className="flex gap-1 h-3 items-center">
                <div className="w-1.5 h-1.5 bg-on-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-on-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-on-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field - Refined & Integrated Design */}
      <div className="p-md bg-white border-t border-outline-variant/20 shrink-0">
        <div className="max-w-5xl mx-auto">

          <div className="bg-surface-container-low/50 rounded-[28px] border border-outline-variant/30 p-2 focus-within:bg-white focus-within:border-primary/30 focus-within:shadow-xl focus-within:shadow-primary/5 transition-all duration-300">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm p-3 resize-none custom-scrollbar min-h-[60px] font-medium text-on-surface"
              placeholder="Nhập nội dung tư vấn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            ></textarea>

            <div className="flex justify-between items-center pl-2 pr-1 pb-1">
              <div className="flex items-center gap-1 relative">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => console.log('File selected:', e.target.files[0])}
                />

                <button
                  onClick={handleFileUpload}
                  className="p-2.5 hover:bg-white hover:text-primary rounded-full transition-all text-on-surface-variant/60 active:scale-90"
                >
                  <Paperclip size={20} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2.5 hover:bg-white rounded-full transition-all active:scale-90 ${showEmojiPicker ? 'bg-white text-primary' : 'text-on-surface-variant/60'}`}
                  >
                    <Smile size={20} />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-4 p-3 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 flex gap-2 z-50 animate-in zoom-in-95 duration-200">
                      {['😊', '❤️', '👍', '🔥', '😂', '👋'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="text-xl hover:scale-125 transition-transform p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>

                {/* Minimal AI Toggle */}
                <button
                  onClick={toggleAiAssist}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-white rounded-full transition-all group ${aiAssistEnabled ? 'text-secondary' : 'text-on-surface-variant/40 grayscale'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${aiAssistEnabled ? 'bg-secondary animate-pulse' : 'bg-outline-variant'}`}></div>
                  <span className="text-[9px] font-black uppercase tracking-widest transition-colors">
                    {aiAssistEnabled ? 'Smart Assist On' : 'Smart Assist Off'}
                  </span>
                </button>
              </div>

              <button 
                onClick={() => {
                  if (message.trim()) {
                    onSendMessage(message);
                    setMessage('');
                  }
                }}
                className="bg-primary text-on-primary rounded-full px-8 py-3.5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Gửi ngay
                <Send size={16} />
              </button>
            </div>
          </div>
          <p className="text-[9px] text-center text-on-surface-variant/40 mt-3 font-medium uppercase tracking-widest">Nhấn Enter để gửi • Shift + Enter để xuống dòng</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
