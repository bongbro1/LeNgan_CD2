import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Bot,
  LogOut,
  Search,
  Bell,
  Menu,
  ChevronRight,
  Settings,
  BarChart3,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 ${active
      ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1'
      }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ customers: [], orders: [] });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setIsSearchOpen(true);
    setSearching(true);

    try {
      const res = await axiosClient.get(`/dashboard/search?query=${query}`);
      setSearchResults(res);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{"fullName": "Admin", "role": "Quản trị viên"}');

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-inter">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col h-screen w-[280px] sticky top-0 bg-surface border-r border-outline-variant py-lg px-md gap-xs shadow-sm overflow-hidden">
        <div className="mb-md px-md shrink-0">
          <span className="text-2xl font-bold text-primary">Social Sales AI</span>
        </div>

        <nav className="flex flex-col gap-xs flex-grow overflow-y-auto pr-1">
          <SidebarItem to="/" icon={LayoutDashboard} label="Tổng quan" active={location.pathname === '/'} />
          <SidebarItem to="/products" icon={Package} label="Sản phẩm" active={location.pathname === '/products'} />
          <SidebarItem to="/customers" icon={Users} label="Khách hàng" active={location.pathname === '/customers'} />
          <SidebarItem to="/orders" icon={ShoppingCart} label="Đơn hàng" active={location.pathname === '/orders'} />
          <SidebarItem to="/chat" icon={MessageSquare} label="Hội thoại" active={location.pathname === '/chat'} />
          <SidebarItem to="/chatbot" icon={Bot} label="Chatbot AI" active={location.pathname === '/chatbot'} />
          <SidebarItem to="/reports" icon={BarChart3} label="Báo cáo" active={location.pathname === '/reports'} />
          <SidebarItem to="/settings" icon={Settings} label="Cài đặt" active={location.pathname === '/settings'} />
        </nav>

        <div className="mt-auto pt-lg border-t border-outline-variant flex flex-col gap-xs shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-md px-md py-sm rounded-lg text-error hover:bg-error-container/10 transition-all w-full group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col w-full min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full h-16 flex justify-between items-center px-lg bg-surface-container-low border-b border-outline-variant shadow-sm">
          <div className="flex items-center gap-md flex-1">
            <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-surface-container-lowest rounded-full px-md py-sm border border-outline-variant w-96 group transition-all relative">
              <Search size={18} className="text-on-surface-variant" />
              <input
                className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full ml-2"
                placeholder="Tìm kiếm đơn hàng, khách hàng..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                onFocus={() => searchQuery && setIsSearchOpen(true)}
              />

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 min-h-[100px]">
                  <div className="p-4 space-y-4">
                    {searching ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-primary animate-pulse">Đang tìm kiếm...</p>
                      </div>
                    ) : (
                      <>
                        {searchResults.customers.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 px-2">Khách hàng</p>
                            <div className="space-y-1">
                              {searchResults.customers.map(c => (
                                <div 
                                  key={c.id} 
                                  onClick={() => {
                                    navigate('/chat', { state: { selectCustomerId: c.id, customer: c } });
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-xl cursor-pointer transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                    {c.fullName.substring(0, 1)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold">{c.fullName}</p>
                                    <p className="text-[10px] text-on-surface-variant">{c.phone || c.email}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.orders.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 px-2">Đơn hàng</p>
                            <div className="space-y-1">
                              {searchResults.orders.map(o => (
                                <div 
                                  key={o.id} 
                                  onClick={() => {
                                    navigate('/orders');
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-xl cursor-pointer transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                                    <ShoppingBag size={14} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold">Đơn hàng #{o.id}</p>
                                    <p className="text-[10px] text-on-surface-variant">{o.customer?.fullName} • {parseFloat(o.totalAmount).toLocaleString()}đ</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.customers.length === 0 && searchResults.orders.length === 0 && (
                          <div className="py-8 text-center">
                            <p className="text-sm text-on-surface-variant font-medium">Không tìm thấy kết quả nào cho "{searchQuery}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-md">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant"></div>
            <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-variant p-1 rounded-lg transition-colors">
              <span className="text-sm font-medium text-on-surface hidden sm:inline">{user.fullName}</span>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
                {user.fullName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-lg max-w-[1600px] mx-auto w-full flex-grow">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
