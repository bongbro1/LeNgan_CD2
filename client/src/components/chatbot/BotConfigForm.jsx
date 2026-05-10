import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Settings, Save, Sparkles, ShoppingCart, Globe, Cpu, Zap } from 'lucide-react';

const BotConfigForm = ({ config, onChange }) => {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const configs = [
        { configKey: 'AI_BASE_URL', configValue: config.AI_BASE_URL },
        { configKey: 'DEFAULT_MODEL', configValue: config.DEFAULT_MODEL },
        { configKey: 'MAX_TOKENS', configValue: config.MAX_TOKENS },
      ];
      await axiosClient.post('/chatbot/configs', {
        configs,
        prompt: config.prompt
      });
      alert('Đã lưu cấu hình thành công! Bot sẽ sử dụng kịch bản mới từ bây giờ.');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setSaving(false);
    }
  };

  const promptTemplates = [
    {
      id: 'sales',
      name: 'Chuyên viên Bán hàng',
      icon: <ShoppingCart size={14} />,
      content: 'Bạn là một chuyên viên tư vấn bán hàng năng động và thân thiện. LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT. \n\nQuy tắc:\n1. Luôn chào khách bằng "Dạ, [Tên Shop] em chào mình ạ! ✨"\n2. Sử dụng icon sinh động trong câu trả lời.\n3. Khi khách hỏi sản phẩm, hãy nêu bật ưu điểm và hỏi khách có muốn xem ảnh thật không.\n4. Mục tiêu cuối cùng là lấy được SĐT và Địa chỉ để lên đơn.'
    },
    {
      id: 'support',
      name: 'Hỗ trợ Chuyên nghiệp',
      icon: <Settings size={14} />,
      content: 'Bạn là nhân viên hỗ trợ khách hàng chuyên nghiệp. LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT.\n\nQuy tắc:\n1. Giữ thái độ lịch sự, điềm đạm và chính xác.\n2. Tập trung giải đáp kỹ thuật, thông số sản phẩm và chính sách bảo hành.\n3. Nếu không biết câu trả lời, hãy hẹn khách chờ nhân viên kỹ thuật liên hệ lại.\n4. Luôn xác nhận lại khách đã hài lòng với câu trả lời chưa.'
    },
    {
      id: 'marketing',
      name: 'Thúc đẩy Ưu đãi',
      icon: <Zap size={14} />,
      content: 'Bạn là chuyên gia chốt đơn bằng khuyến mãi. LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT.\n\nQuy tắc:\n1. Luôn nhắc về các voucher giảm giá đang có.\n2. Tạo sự khan hiếm: "Sản phẩm này chỉ còn 2 chiếc cuối cùng thôi ạ".\n3. Thúc giục khách chốt đơn ngay trong hội thoại để nhận quà tặng kèm.\n4. Ngôn ngữ hào hứng, mạnh mẽ.'
    }
  ];

  const applyTemplate = (content) => {
    if (window.confirm('Hành động này sẽ ghi đè nội dung hiện tại. Bạn có chắc chắn muốn sử dụng mẫu này?')) {
      onChange({ prompt: content });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/50 overflow-hidden">
      <div className="p-lg border-b border-outline-variant/30 bg-surface-container-low/50 flex justify-between items-center">
        <div className="flex items-center gap-md">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Settings size={20} />
          </div>
          <h3 className="text-base font-black text-on-surface uppercase tracking-widest">Thiết lập AI & Kịch bản</h3>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
        </button>
      </div>

      <form className="p-lg space-y-xl" onSubmit={handleSave}>
        {/* Model Connection Section */}
        <div className="bg-surface-container-low/30 p-md rounded-2xl border border-outline-variant/20 space-y-md">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Kết nối Ollama / AI Service</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-on-surface-variant uppercase ml-1">Ollama API URL</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="w-full bg-white border border-outline-variant/50 rounded-xl py-2.5 pl-9 pr-md text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  type="text"
                  value={config.AI_BASE_URL}
                  onChange={(e) => onChange({ AI_BASE_URL: e.target.value })}
                  placeholder="http://localhost:11434/v1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-on-surface-variant uppercase ml-1">Model Name</label>
              <input
                className="w-full bg-white border border-outline-variant/50 rounded-xl py-2.5 px-md text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                type="text"
                value={config.DEFAULT_MODEL}
                onChange={(e) => onChange({ DEFAULT_MODEL: e.target.value })}
                placeholder="qwen2.5:3b"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">System Instruction (Cốt lõi trí tuệ)</label>
              <p className="text-[10px] text-on-surface-variant opacity-60">Chọn một mẫu kịch bản để bắt đầu nhanh:</p>
            </div>
            <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[9px] font-black uppercase flex items-center gap-1.5">
              <Sparkles size={10} /> Qwen 2.5 Optimized
            </div>
          </div>

          {/* Prompt Templates Chips */}
          <div className="flex flex-wrap gap-2">
            {promptTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.content)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant/50 rounded-xl text-[10px] font-bold text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
              >
                {template.icon}
                {template.name}
              </button>
            ))}
          </div>

          <textarea
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl py-4 px-md text-sm leading-relaxed font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-[250px] custom-scrollbar"
            value={config.prompt}
            onChange={(e) => onChange({ prompt: e.target.value })}
            placeholder="Hãy nhập hướng dẫn chi tiết cho Bot tại đây. Ví dụ: Bạn là nhân viên shop quần áo, luôn tư vấn lịch sự, ưu tiên chốt đơn..."
          ></textarea>
          <p className="text-[10px] text-on-surface-variant italic opacity-60">* Mọi câu trả lời của Bot sẽ dựa trên hướng dẫn này kết hợp với dữ liệu sản phẩm thực tế.</p>
        </div>
      </form>
    </div>
  );
};

export default BotConfigForm;
