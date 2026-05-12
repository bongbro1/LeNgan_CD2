import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Verify Username, 2: Reset Password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerifyUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await axiosClient.post('/auth/forgot-password', { username });
      if (response.canReset) {
        setStep(2);
        setMessage(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axiosClient.post('/auth/reset-password', { username, newPassword });
      setMessage(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] font-inter">
      <div className="w-full max-w-[450px] px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <span className="material-symbols-outlined text-[32px] text-primary">
                {step === 1 ? 'lock_reset' : 'lock_open'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {step === 1
                ? 'Nhập tên đăng nhập của bạn để bắt đầu khôi phục.'
                : 'Vui lòng nhập mật khẩu mới cho tài khoản ' + username}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleVerifyUsername} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="username">
                  Tên đăng nhập
                </label>
                <div className="relative group/input">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 animate-shake">
                  <span className="material-symbols-outlined text-rose-500 text-[20px]">error</span>
                  <span className="text-sm text-rose-600">{error}</span>
                </div>
              )}

              <button
                className="w-full relative overflow-hidden rounded-xl bg-primary py-4 px-6 font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang kiểm tra...' : 'Tiếp tục'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="newPassword">
                    Mật khẩu mới
                  </label>
                  <div className="relative group/input">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      id="newPassword"
                      placeholder="••••••••"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="confirmPassword">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative group/input">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
                      check_circle
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      id="confirmPassword"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 animate-shake">
                  <span className="material-symbols-outlined text-rose-500 text-[20px]">error</span>
                  <span className="text-sm text-rose-600">{error}</span>
                </div>
              )}

              {message && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                  <span className="text-sm text-emerald-600">{message}</span>
                </div>
              )}

              <button
                className="w-full relative overflow-hidden rounded-xl bg-primary py-4 px-6 font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => step === 1 ? navigate('/login') : setStep(1)}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-container transition-all group/back"
            >
              <span className="material-symbols-outlined text-[18px] group-hover/back:-translate-x-1 transition-transform">arrow_back</span>
              {step === 1 ? 'Quay lại đăng nhập' : 'Quay lại bước trước'}
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default ForgotPassword;
