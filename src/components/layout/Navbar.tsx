import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Sun,
  Moon,
  Search,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    navigation,
    navigate,
    currentUser,
    logout,
    cartCount,
    isDark,
    toggleTheme
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate('products', { searchQuery: searchInput.trim() });
      setMobileMenuOpen(false);
    }
  };

  const isCustomer = currentUser?.role === 'customer';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 text-right focus:outline-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-lg tracking-wider">TZ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  تيك زون <span className="text-blue-600 dark:text-cyan-400 text-sm font-semibold">TechZone</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">متجر الإلكترونيات الذكية</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-4">
              <button
                onClick={() => navigate('home')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  navigation.page === 'home'
                    ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                الرئيسية
              </button>
              <button
                onClick={() => navigate('products')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  navigation.page === 'products'
                    ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                المنتجات
              </button>
            </nav>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن منتج، علامة تجارية (مثل Sony, Logitech)..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 dark:focus:border-cyan-400 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
              aria-label="تبديل المظهر"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => navigate('cart')}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="سلة التسوق"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-blue-600 dark:bg-cyan-500 rounded-full shadow-xs tabular-nums animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Menu - Logged In vs Guest */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 flex items-center justify-center font-bold text-xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                    {currentUser.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-right animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.full_name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>

                    {isCustomer && (
                      <>
                        <button
                          onClick={() => navigate('my-profile')}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                          حسابي
                        </button>
                        <button
                          onClick={() => navigate('my-orders')}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Package className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                          طلباتي
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => navigate('admin-dashboard')}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        لوحة تحكم المدير
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  إنشاء حساب
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-150">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <input
              type="text"
              placeholder="ابحث عن منتج، علامة تجارية..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                navigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                navigation.page === 'home'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                navigate('products');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                navigation.page === 'products'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              المنتجات
            </button>
            <button
              onClick={() => {
                navigate('cart');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>سلة التسوق</span>
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 dark:bg-cyan-500 rounded-full tabular-nums">
                {cartCount}
              </span>
            </button>

            {currentUser ? (
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                {isCustomer && (
                  <>
                    <button
                      onClick={() => {
                        navigate('my-profile');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      حسابي
                    </button>
                    <button
                      onClick={() => {
                        navigate('my-orders');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      طلباتي
                    </button>
                  </>
                )}
                {isAdmin && (
                  <button
                    onClick={() => {
                      navigate('admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                  >
                    لوحة تحكم المدير
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => {
                    navigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
