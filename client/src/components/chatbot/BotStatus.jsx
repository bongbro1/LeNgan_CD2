import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Bot, RefreshCcw, TrendingUp as TrendingUpIcon, Sparkles, Activity } from 'lucide-react';

const BotStatus = () => {
  const [status, setStatus] = useState({ isAlive: false, modelFound: false, provider: 'Loading...', baseURL: '' });
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/chatbot/status');
      setStatus(res);
      setLastChecked(new Date().toLocaleTimeString());

    } catch (err) {
      console.error('Status check failed:', err);
      alert('❌ Lỗi hệ thống khi kiểm tra kết nối.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      {/* Bot Status Card */}
      <div className="bg-white p-lg rounded-3xl shadow-sm border border-outline-variant/50 col-span-1 flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <Bot size={28} />
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${status.isAlive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-error/5 text-error border-error/10'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${status.isAlive ? 'bg-emerald-500 animate-pulse' : 'bg-error'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{status.isAlive ? 'Hệ thống Online' : 'Hệ thống Offline'}</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-black text-on-surface tracking-tight">Qwen 2.5:3b</h3>
          <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60 mt-1">
            {status.provider} • {status.modelFound ? 'Model đã sẵn sàng' : 'Không tìm thấy model'}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="w-full py-4 bg-on-surface text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <RefreshCcw size={16} className="animate-spin" /> : <Activity size={16} />}
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra kết nối Ollama'}
          </button>
          {lastChecked && (
            <p className="text-[10px] text-center text-on-surface-variant font-bold opacity-40 italic">
              Cập nhật lần cuối: {lastChecked}
            </p>
          )}
        </div>
      </div>

      {/* Quick Guide Card */}
      <div className="bg-gradient-to-br from-surface-container-high to-surface-container-low p-lg rounded-3xl border border-outline-variant/30 col-span-1 flex flex-col justify-center">
        <h4 className="text-sm font-black text-on-surface uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-primary" /> Hướng dẫn vận hành
        </h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Đảm bảo ứng dụng <b>Ollama</b> đã được khởi động trên máy của bạn.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Kiểm tra tên model trong cấu hình phải khớp với <b>qwen2.5:3b</b>.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</div>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Sử dụng <b>Bot Simulator</b> bên dưới để thử nghiệm kịch bản trước khi chạy thật.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BotStatus;
