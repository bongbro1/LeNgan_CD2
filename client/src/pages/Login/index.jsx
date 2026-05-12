import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-background p-md">
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-[500px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-xl">
          <div className="mb-xl flex flex-col items-center">
            <div className="mb-md">
              <span className="material-symbols-outlined text-[48px] text-primary">hub</span>
            </div>
            <h1 className="text-[30px] font-bold text-on-surface mb-xs">Social Sales AI</h1>
            <p className="text-sm text-on-surface-variant">Chào mừng bạn trở lại. Vui lòng nhập thông tin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-sm" htmlFor="username">
                Tên đăng nhập
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                <input
                  className="w-full pl-[45px] pr-md py-md bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-sm">
                <label className="block text-sm font-medium text-on-surface-variant" htmlFor="password">
                  Mật khẩu
                </label>
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  className="w-full pl-[45px] pr-[45px] py-md bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="text-error text-xs bg-error-container p-sm rounded-lg flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <div className="flex items-center gap-sm">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
              <label className="text-xs text-on-surface-variant" htmlFor="remember">
                Ghi nhớ đăng nhập trong 30 ngày
              </label>
            </div>

            <button
              className="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-medium hover:bg-primary-container transition-all active:scale-95 duration-150 shadow-sm disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-xl flex flex-col gap-md">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-md text-xs text-outline uppercase">Hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <button className="flex items-center justify-center gap-sm py-sm px-md border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all">
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
                <span className="text-xs font-semibold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-sm py-sm px-md border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-[20px]">cloud</span>
                <span className="text-xs font-semibold">Doanh nghiệp</span>
              </button>
            </div>
          </div>

          <p className="mt-xl text-center text-sm text-on-surface-variant">
            Chưa có tài khoản?
            <a className="text-primary font-bold hover:underline ml-1" href="#">Yêu cầu truy cập</a>
          </p>
        </div>

        <div className="mt-lg flex items-center gap-xl text-xs text-outline justify-center">
          <a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a>
          <a className="hover:text-primary transition-colors" href="#">Điều khoản dịch vụ</a>
          <span>© 2026 Social Sales AI</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
