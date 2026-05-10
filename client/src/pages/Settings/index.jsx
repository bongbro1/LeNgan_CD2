import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  User,
  Lock,
  Store,
  Cpu,
  Share2,
  Mail,
  MapPin,
  Camera,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Zap,
  Key,
  Database,
  ChevronRight,
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'success' | 'error'

  // States for data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    designation: '',
    timezone: 'Asia/Ho_Chi_Minh',
    bioAiContext: ''
  });

  const [store, setStore] = useState({
    name: '',
    phone: '',
    address: '',
    currency: 'VND',
    language: 'vi'
  });

  const [aiConfig, setAiConfig] = useState({
    OPENAI_API_KEY: '',
    DEFAULT_MODEL: 'qwen2.5:3b',
    MAX_TOKENS: 4096,
    AI_BASE_URL: 'http://localhost:11434/v1'
  });

  const [socials, setSocials] = useState([]);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'account') {
        const res = await axiosClient.get('/settings/profile');
        setProfile(res);
      } else if (activeTab === 'store') {
        const res = await axiosClient.get('/settings/store');
        setStore(res);
      } else if (activeTab === 'ai') {
        const res = await axiosClient.get('/settings/ai-config');
        setAiConfig({ ...aiConfig, ...res });
      } else if (activeTab === 'social') {
        const res = await axiosClient.get('/settings/social-integrations');
        setSocials(res);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosClient.put('/settings/profile', profile);
      alert('Cập nhật hồ sơ thành công!');
    } catch (err) {
      alert('Lỗi khi lưu hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosClient.put('/settings/store', store);
      alert('Cập nhật thông tin cửa hàng thành công!');
    } catch (err) {
      alert('Lỗi khi lưu thông tin cửa hàng');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAI = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosClient.put('/settings/ai-config', aiConfig);
      alert('Cấu hình AI đã được lưu!');
    } catch (err) {
      alert('Lỗi khi lưu cấu hình AI');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    setSaving(true);
    try {
      await axiosClient.put('/settings/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      alert('Đổi mật khẩu thành công!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể đổi mật khẩu'));
    } finally {
      setSaving(false);
    }
  };

  const handleTestAI = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await axiosClient.post('/settings/test-ai', aiConfig);
      if (res.success) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (err) {
      setTestStatus('error');
      alert('Lỗi kết nối: ' + (err.response?.data?.message || err.message));
    } finally {
      setTesting(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Thông tin cá nhân', icon: User },
    { id: 'password', label: 'Mật khẩu', icon: Lock },
    { id: 'store', label: 'Thông tin cửa hàng', icon: Store },
    { id: 'ai', label: 'Cấu hình AI API', icon: Cpu, badge: 'AI' },
    { id: 'social', label: 'Kết nối mạng xã hội', icon: Share2 },
  ];

  return (
    <div className="flex flex-col gap-lg animate-in fade-in slide-in-from-bottom-4 duration-700 pb-xl">
      {/* Page Header */}
      <div className="mb-md">
        <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-sm font-medium text-on-surface-variant opacity-70 mt-1">Quản lý định danh, mật khẩu và cấu hình bộ não AI của bạn.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 border-b border-outline-variant overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 px-1 whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id
              ? 'text-primary'
              : 'text-on-surface-variant opacity-50 hover:opacity-100'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge && (
              <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] rounded font-black tracking-tighter">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(0,74,198,0.3)]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-lg">
        {/* Left Side: Main Form Content */}
        <div className="col-span-12 lg:col-span-8 space-y-lg">

          {activeTab === 'account' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-on-surface uppercase tracking-widest">Hồ sơ định danh</h2>
                <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Cập nhật lần cuối: 2 ngày trước</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Họ và tên</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                    placeholder="VD: Nguyễn Văn A"
                    value={profile.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Địa chỉ Email</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                    placeholder="email@example.com"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Chức danh</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                    placeholder="VD: Quản lý cửa hàng"
                    value={profile.designation || ''}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Múi giờ</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all appearance-none cursor-pointer"
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  >
                    <option value="Asia/Ho_Chi_Minh">Vietnam (UTC+7)</option>
                    <option value="US/Pacific">Pacific Time (UTC-8)</option>
                    <option value="Europe/Paris">Central European Time (UTC+1)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Tiểu sử & Ngữ cảnh AI</label>
                <textarea
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all h-32 resize-none"
                  placeholder="Mô tả phong cách trả lời của AI, ví dụ: 'Thân thiện, tư vấn nhiệt tình, sử dụng icon vui nhộn...'"
                  value={profile.bioAiContext || ''}
                  onChange={(e) => setProfile({ ...profile, bioAiContext: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-outline-variant/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-on-surface text-white px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-on-surface uppercase tracking-widest">Bảo mật tài khoản</h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                    placeholder="••••••••••••"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                      placeholder="••••••••••••"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                      placeholder="••••••••••••"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 flex items-start gap-3">
                  <div className="p-1 bg-amber-500/10 text-amber-600 rounded-lg mt-0.5">
                    <Zap size={14} />
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant/70 leading-relaxed uppercase tracking-wider">
                    Lưu ý: Mật khẩu mới nên bao gồm ít nhất 8 ký tự, bao gồm cả chữ cái và số để đảm bảo tính bảo mật cao nhất.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-outline-variant/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-on-surface text-white px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'store' && (
            <form onSubmit={handleSaveStore} className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-on-surface uppercase tracking-widest">Thông tin cửa hàng</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Đang hoạt động
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Tên cửa hàng / Thương hiệu</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                    placeholder="VD: Social Sales Premium Store"
                    value={store.name || ''}
                    onChange={(e) => setStore({ ...store, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Số điện thoại hỗ trợ</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                    placeholder="VD: 0987 654 321"
                    value={store.phone || ''}
                    onChange={(e) => setStore({ ...store, phone: e.target.value })}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Địa chỉ trụ sở</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-3.5 pl-12 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                      placeholder="VD: 123 Đường AI, Quận 1, TP.HCM"
                      value={store.address || ''}
                      onChange={(e) => setStore({ ...store, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Tiền tệ mặc định</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all appearance-none cursor-pointer"
                    value={store.currency}
                    onChange={(e) => setStore({ ...store, currency: e.target.value })}
                  >
                    <option value="VND">VNĐ (Việt Nam Đồng)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Ngôn ngữ hệ thống</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl border border-outline-variant/50 p-3.5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all appearance-none cursor-pointer"
                    value={store.language}
                    onChange={(e) => setStore({ ...store, language: e.target.value })}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-outline-variant/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-on-surface text-white px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thông tin cửa hàng'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-on-surface uppercase tracking-widest">Kết nối đa kênh</h2>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Quản lý Webhooks</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socials.map((channel, i) => (
                  <div key={i} className="p-5 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/10 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 ${channel.platform === 'facebook' ? 'bg-blue-600' : channel.platform === 'zalo' ? 'bg-sky-500' : 'bg-pink-600'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Share2 size={24} />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${channel.status === 'connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-on-surface-variant/10 text-on-surface-variant'
                        }`}>
                        {channel.status}
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-on-surface">{channel.platformName}</h4>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-50 mt-1">{channel.accountInfo || 'Chưa cấu hình'}</p>
                    <button className={`mt-6 w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${channel.status === 'connected' ? 'bg-white text-error border border-error/20 hover:bg-error hover:text-white' : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:opacity-90'
                      }`}>
                      {channel.status === 'connected' ? 'Ngắt kết nối' : 'Kết nối ngay'}
                    </button>
                  </div>
                ))}
                {socials.length === 0 && !loading && <p className="text-xs text-on-surface-variant col-span-2 text-center py-8">Chưa có kết nối nào được thiết lập.</p>}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <form onSubmit={handleSaveAI} className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-on-surface uppercase tracking-widest">Cấu hình Local AI</h2>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Sử dụng mô hình Qwen qua Ollama (Local)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                  <Zap size={12} /> Tốc độ cao
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Địa chỉ Ollama Server</label>
                    <div className="relative">
                      <Database size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                      <input
                        type="text"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-3.5 pl-12 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all"
                        placeholder="http://localhost:11434/v1"
                        value={aiConfig.AI_BASE_URL || ''}
                        onChange={(e) => setAiConfig({ ...aiConfig, AI_BASE_URL: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Mô hình AI sử dụng</label>
                    <div className="relative">
                      <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                      <select
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-3.5 pl-12 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:shadow-sm outline-none transition-all appearance-none cursor-pointer"
                        value={aiConfig.DEFAULT_MODEL}
                        onChange={(e) => setAiConfig({ ...aiConfig, DEFAULT_MODEL: e.target.value })}
                      >
                        <option value="qwen2.5:3b">Qwen 2.5:3b (Tối ưu nhất)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 px-1">Giới hạn Tokens phản hồi</label>
                  <div className="flex items-center gap-6 p-1">
                    <input
                      type="range"
                      min="512"
                      max="8192"
                      step="512"
                      className="flex-1 h-2 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-primary"
                      value={aiConfig.MAX_TOKENS}
                      onChange={(e) => setAiConfig({ ...aiConfig, MAX_TOKENS: parseInt(e.target.value) })}
                    />
                    <span className="min-w-[80px] text-center bg-primary text-on-primary py-1.5 rounded-xl text-xs font-black">{aiConfig.MAX_TOKENS}</span>
                  </div>
                  <p className="text-[9px] text-on-surface-variant opacity-50 font-bold uppercase tracking-widest mt-2 px-1">* Giới hạn này giúp kiểm soát độ dài câu trả lời của Bot.</p>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6 border-t border-outline-variant/10">
                {testStatus === 'success' && (
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={14} /> Kết nối tốt
                  </span>
                )}
                {testStatus === 'error' && (
                  <span className="text-[10px] font-black text-error uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={14} /> Lỗi kết nối
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleTestAI}
                  disabled={testing || saving}
                  className="bg-surface-container-high text-on-surface px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-highest transition-all disabled:opacity-50"
                >
                  {testing ? 'Đang thử...' : 'Kiểm tra kết nối'}
                </button>
                <button
                  type="submit"
                  disabled={saving || testing}
                  className="bg-on-surface text-white px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu cấu hình AI'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Profile & Insights */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 flex flex-col items-center text-center group">
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full p-1 border-2 border-dashed border-primary/30 group-hover:rotate-180 transition-all duration-1000">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Profile" className="w-full h-full rounded-full object-cover group-hover:-rotate-180 transition-all duration-1000" />
              </div>
              <button className="absolute bottom-2 right-2 bg-primary text-on-primary p-2.5 rounded-2xl shadow-xl border-4 border-white active:scale-90 transition-all">
                <Camera size={18} />
              </button>
            </div>
            <h3 className="text-lg font-black text-on-surface">{profile.fullName || 'Người dùng'}</h3>
            <p className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">{profile.designation || 'Chưa thiết lập'}</p>

            <div className="mt-4 w-full pt-4 border-t border-outline-variant/10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="text-on-surface-variant opacity-50">Hoàn thiện hồ sơ</span>
                <span className="text-primary">{
                  Math.round(
                    ((profile.fullName ? 1 : 0) +
                      (profile.email ? 1 : 0) +
                      (profile.designation ? 1 : 0) +
                      (profile.bioAiContext ? 1 : 0) +
                      (profile.timezone ? 1 : 0)) / 5 * 100
                  )
                }%</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(0,74,198,0.5)] transition-all duration-1000"
                  style={{ width: `${Math.round(((profile.fullName ? 1 : 0) + (profile.email ? 1 : 0) + (profile.designation ? 1 : 0) + (profile.bioAiContext ? 1 : 0) + (profile.timezone ? 1 : 0)) / 5 * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
              <Sparkles size={64} className="text-primary" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20">
                <Sparkles size={18} />
              </div>
              <h4 className="text-xs font-black text-primary uppercase tracking-widest">AI Insights</h4>
            </div>
            <p className="text-sm font-bold text-on-surface leading-relaxed relative z-10">
              Persona của bạn đã được tinh chỉnh dựa trên <span className="text-primary">452 hội thoại thành công</span> tuần này. Hãy xem xét cập nhật "Ngữ cảnh AI" để phản ánh các chiến dịch mới.
            </p>
            <button className="mt-6 w-full py-3.5 bg-on-surface text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all relative z-10">
              Xem chiến lược AI
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Settings;
