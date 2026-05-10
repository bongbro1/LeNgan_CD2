import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Search, Activity } from 'lucide-react';

const BotLogs = ({ refreshTrigger }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosClient.get('/chatbot/logs');
        setLogs(res);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/50 overflow-hidden">
      <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30">
        <div className="flex items-center gap-md">
          <div className="p-2 bg-on-surface/5 text-on-surface rounded-xl">
            <Activity size={20} />
          </div>
          <h3 className="text-base font-black text-on-surface uppercase tracking-widest">Nhật ký vận hành AI</h3>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
        <table className="w-full text-left border-collapse sticky-header">
          <thead className="sticky top-0 z-10 bg-surface-container-low">
            <tr className="bg-surface-container-low/50">
              <th className="px-lg py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Thời gian</th>
              <th className="px-lg py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Câu hỏi khách</th>
              <th className="px-lg py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Bot phản hồi</th>
              <th className="px-lg py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-center">Token</th>
              <th className="px-lg py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-20 opacity-40 italic">Đang tải nhật ký...</td></tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-lg py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-on-surface">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[9px] text-on-surface-variant font-medium">{new Date(log.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </td>
                  <td className="px-lg py-4 max-w-xs">
                    <p className="text-xs font-medium text-on-surface truncate">{log.userQuery || log.prompt}</p>
                  </td>
                  <td className="px-lg py-4 max-w-md">
                    <p className="text-xs text-on-surface-variant line-clamp-1">{log.botResponse || log.response}</p>
                  </td>
                  <td className="px-lg py-4 text-center">
                    <span className="px-2 py-1 bg-surface-container-high rounded-md text-[10px] font-bold text-on-surface-variant">
                      {log.tokensUsed || 0}
                    </span>
                  </td>
                  <td className="px-lg py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-error/5 text-error'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-20 opacity-40 italic">Chưa có nhật ký vận hành nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BotLogs;
