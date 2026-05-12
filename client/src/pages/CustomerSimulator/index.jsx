import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import { Send, Image, Plus, ThumbsUp, Smile, Phone, Video, Info, Search, MessageCircle, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CustomerSimulator = () => {
  const [step, setStep] = useState('login'); // login | chat
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (step === 'login') {
      fetchCustomers();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'chat' && conversation) {
      const timer = setInterval(() => {
        refreshMessages();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [step, conversation]);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 150;
      const lastMessage = messages[messages.length - 1];

      if (isAtBottom || lastMessage?.senderType === 'customer' || messages.length <= 1) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [messages]);

  const fetchCustomers = async () => {
    try {
      const res = await axiosClient.get('/customers?limit=100');
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleLogin = async (customer) => {
    setSelectedCustomer(customer);
    try {
      // Find or create conversation for this customer
      const conversations = await axiosClient.get('/conversations');
      let conv = conversations.find(c => c.customerId === customer.id);

      // If no conversation exists, it will be created by the first message
      // But for simulator, let's assume one exists or we create a dummy state
      if (conv) {
        setConversation(conv);
        const detail = await axiosClient.get(`/conversations/${conv.id}`);
        setMessages(detail.messages || []);
      } else {
        setMessages([]);
        // Create a fake conversation object for UI
        setConversation({ id: 'new', customerId: customer.id });
      }
      setStep('chat');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const refreshMessages = async () => {
    if (!conversation || conversation.id === 'new') return;
    try {
      const detail = await axiosClient.get(`/conversations/${conversation.id}`);

      // Chỉ cập nhật nếu có sự thay đổi về số lượng tin nhắn hoặc nội dung tin nhắn cuối
      const newMessages = detail.messages || [];
      const hasNewMessage = newMessages.length !== messages.length ||
        (newMessages.length > 0 && messages.length > 0 &&
          newMessages[newMessages.length - 1].id !== messages[messages.length - 1].id);

      if (hasNewMessage || detail.isTyping !== conversation.isTyping) {
        setConversation(detail);
        setMessages(newMessages);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedCustomer || !conversation) {
      console.warn('Cannot send: missing input, customer or conversation context');
      return;
    }

    const text = input;
    setInput('');

    // Optimistic update
    const tempId = Date.now();
    const optimisticMsg = { id: tempId, content: text, senderType: 'customer', createdAt: new Date() };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const convId = conversation.id;
      const isNew = convId === 'new';

      const res = await axiosClient.post(`/conversations/${isNew ? 'create-from-customer' : convId + '/messages'}`, {
        text,
        sender: 'customer',
        customerId: selectedCustomer.id
      });

      if (isNew || (res.conversation && res.conversation.id !== convId)) {
        // Nếu là hội thoại mới hoàn toàn HOẶC ID bị thay đổi (do tự tạo mới ở backend)
        setConversation(res.conversation);
        setMessages(res.conversation.messages || [res.message]);
      } else {
        // Nếu là hội thoại cũ, chỉ cần cập nhật tin nhắn thật thay cho tin nhắn tạm (optimistic)
        const msg = res.message || res;
        setMessages(prev => prev.map(m => m.id === tempId ? msg : m));
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối Server.');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center py-20">
        <div className="max-w-[400px] w-full bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/30 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0084ff] to-[#00c6ff] rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#1c1e21] mb-2">Facebook Messenger</h1>
          <p className="text-gray-500 text-sm mb-8 font-medium">Giả lập phía khách hàng để kiểm thử Bot</p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto px-2 custom-scrollbar">
            {customers.map(c => (
              <button
                key={c.id}
                onClick={() => handleLogin(c)}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all active:scale-[0.98] group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {c.fullName.substring(0, 1)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">{c.fullName}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{c.socialPlatform || 'FACEBOOK'}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button className="text-[#0084ff] font-bold text-sm hover:underline">Tạo khách hàng giả lập mới</button>
          </div>
        </div>
        <p className="mt-12 text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">Customer Simulator Mode</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col max-w-[600px] mx-auto shadow-2xl border-x border-gray-100">
      {/* Messenger Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('login')} className="p-2 hover:bg-gray-100 rounded-full text-[#0084ff]">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {selectedCustomer?.fullName.substring(0, 1)}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-bold text-[15px] leading-tight">{selectedCustomer?.fullName}</p>
            <p className="text-[11px] text-gray-500 font-medium">Đang hoạt động</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#0084ff]">
          <button className="p-2 hover:bg-gray-100 rounded-full"><Phone size={20} fill="currentColor" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full"><Video size={22} fill="currentColor" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full"><Info size={22} fill="currentColor" /></button>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar"
      >
        <div className="flex flex-col items-center py-10 opacity-30">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <MessageCircle size={40} className="text-blue-500" />
          </div>
          <p className="text-sm font-bold">Bắt đầu trò chuyện với Shop</p>
          <p className="text-xs">Facebook Messenger Simulator</p>
        </div>

        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-end gap-2 max-w-[80%]">
              {msg.senderType !== 'customer' && (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                </div>
              )}
              <div className={`px-4 py-2 rounded-[20px] text-[15px] leading-snug shadow-sm ${msg.senderType === 'customer'
                  ? 'bg-[#0084ff] text-white'
                  : 'bg-[#f0f2f5] text-black'
                }`}>
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-1" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-base font-bold mb-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-sm font-bold mb-1" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {conversation?.isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[80%]">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              </div>
              <div className="px-4 py-3 rounded-[20px] rounded-bl-none bg-[#f0f2f5] text-black shadow-sm">
                <div className="flex gap-1 h-3 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Scenarios Quick Buttons */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
        <button 
          onClick={() => setInput("Chào shop, mình cao 1m80, nặng 85kg, mình thích mặc đồ màu đen.")}
          className="whitespace-nowrap px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-[11px] font-medium hover:bg-blue-50 transition-colors shadow-sm"
        >
          📝 KB1: Ghi nhớ (1m8/85kg)
        </button>
        <button 
          onClick={() => setInput("Tư vấn cho mình mẫu áo nào phù hợp với dáng mình đi.")}
          className="whitespace-nowrap px-3 py-1 bg-white border border-purple-200 text-purple-600 rounded-full text-[11px] font-medium hover:bg-purple-50 transition-colors shadow-sm"
        >
          🧠 KB2: Ký ức (Tư vấn size)
        </button>
        <button 
          onClick={() => setInput("Bên mình có iPhone 15 Pro Max không, giá bao nhiêu?")}
          className="whitespace-nowrap px-3 py-1 bg-white border border-orange-200 text-orange-600 rounded-full text-[11px] font-medium hover:bg-orange-50 transition-colors shadow-sm"
        >
          🔍 KB3: Tìm kiếm (iPhone 15)
        </button>
        <button 
          onClick={() => setInput("Chốt 1 cái iPhone 15 Pro Max. Mình là Trần Văn Admin, SĐT 0988888888, ĐC số 1 Võ Văn Ngân, Thủ Đức.")}
          className="whitespace-nowrap px-3 py-1 bg-white border border-green-200 text-green-600 rounded-full text-[11px] font-medium hover:bg-green-50 transition-colors shadow-sm"
        >
          🛒 KB4: Chốt đơn (Auto-Order)
        </button>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-2 text-[#0084ff] hover:bg-gray-100 rounded-full"><Plus size={20} /></button>
          <button className="p-2 text-[#0084ff] hover:bg-gray-100 rounded-full"><Image size={20} /></button>
          <div className="flex-1 bg-[#f0f2f5] rounded-full px-4 py-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Aa"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-1"
            />
            <button className="text-[#0084ff]"><Smile size={20} /></button>
          </div>
          {input.trim() ? (
            <button onClick={handleSend} className="p-2 text-[#0084ff] hover:bg-gray-100 rounded-full">
              <Send size={24} fill="currentColor" />
            </button>
          ) : (
            <button className="p-2 text-[#0084ff] hover:bg-gray-100 rounded-full">
              <ThumbsUp size={24} fill="currentColor" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSimulator;
