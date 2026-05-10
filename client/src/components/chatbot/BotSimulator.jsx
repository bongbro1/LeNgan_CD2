import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const BotSimulator = ({ onNewLog, currentPrompt }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Xin chào! Em là trợ lý ảo của shop, em có thể giúp gì được cho mình không ạ? ✨', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await axiosClient.get('/chatbot/simulator-history');
      if (res && res.length > 0) {
        const historyMessages = [];
        res.forEach(log => {
          const time = new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          historyMessages.push({
            id: `user-${log.id}`,
            type: 'user',
            text: log.prompt,
            time: time
          });
          
          historyMessages.push({
            id: `bot-${log.id}`,
            type: 'bot',
            text: log.response,
            time: time
          });
        });
        
        setMessages(prev => [prev[0], ...historyMessages]);
      }
    } catch (err) {
      console.error('Failed to fetch simulator history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for AI (excluding the first welcome message and including the current user message)
      const historyForAI = messages
        .filter(m => m.id !== 1) // Bỏ tin nhắn chào mừng mặc định
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const data = await axiosClient.post('/chatbot/simulate', {
        query: input,
        history: historyForAI,
        customPrompt: currentPrompt // Gửi prompt hiện tại trong Form (có thể chưa Save)
      });

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response || 'Bot không trả về nội dung.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      if (onNewLog) onNewLog();
    } catch (err) {
      console.error('Error simulating bot:', err);
      const errorMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: '❌ Lỗi kết nối AI: ' + (err.response?.data?.message || err.message || 'Không thể kết nối tới Ollama'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-outline-variant/50 flex flex-col h-full max-h-[700px] overflow-hidden sticky top-lg">
      <div className="p-lg bg-gradient-to-r from-primary to-primary-container text-white flex items-center gap-md">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center relative shadow-inner border border-white/20">
          <Bot size={24} className="text-white" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <p className="font-black text-[11px] uppercase tracking-widest text-white/80">Bot Simulator</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Sparkles size={12} className="text-white animate-pulse" />
            <p className="text-sm font-bold tracking-tight">Kiểm thử kịch bản...</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-lg space-y-lg bg-surface-container-low/20 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] px-lg py-3.5 rounded-3xl text-xs leading-relaxed shadow-sm ${msg.type === 'user'
              ? 'bg-primary text-on-primary rounded-tr-none'
              : 'bg-white text-on-surface border border-outline-variant/20 rounded-tl-none'
              }`}>
              {msg.text}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mt-2 px-2">
              {msg.time}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-start">
            <div className="bg-white px-lg py-3.5 rounded-3xl rounded-tl-none text-xs border border-outline-variant/20 flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-lg bg-white border-t border-outline-variant/30">
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/20 focus-within:bg-white focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
          <input
            type="text"
            placeholder="Gửi tin nhắn thử nghiệm..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-4 py-3 outline-none font-medium"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-primary text-on-primary p-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotSimulator;
