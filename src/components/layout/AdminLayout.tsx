import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions
}) => {
  const {
    navigation,
    navigate,
    currentUser,
    logout,
    isDark,
    toggleTheme
  } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      page: 'admin-dashboard' as const,
      label: 'لوحة التحكم',
      icon: LayoutDashboard
    },
    {
      page: 'admin-products' as const,
      label: 'إدارة المنتجات',
      icon: Package
    },
    {
      page: 'admin-categories' as const,
      label: 'إدارة التصنيفات',
      icon: Layers
    },
    {
      page: 'admin-orders' as const,
      label: 'إدارة الطلبات',
      icon: ShoppingBag
    },
    {
      page: 'admin-users' as const,
      label: 'إدارة المستخدمين',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070D19] text-slate-900 dark:text-slate-100 flex transition-colors">
      
      {/* Right-side RTL Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-l border-slate-800 shrink-0 sticky top-0 h-screen z-30">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md">
              TZ
            </div>
            <div>
              <div className="font-extrabold text-white text-base leading-tight">لوحة الإدارة</div>
              <div className="text-[11px] text-cyan-400 font-medium">TechZone Admin</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = navigation.page === item.page || (item.page === 'admin-products' && (navigation.page === 'admin-product-add' || navigation.page === 'admin-product-edit'));
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate('home')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>زيارة المتجر</span>
            </span>
            <span className="text-[10px] text-slate-400">Storefront</span>
          </button>

          <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser?.full_name || 'مدير النظام'}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'admin@techzone.demo'}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-72 bg-slate-900 text-slate-300 h-full p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  TZ
                </div>
                <div className="font-bold text-white text-sm">لوحة الإدارة</div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = navigation.page === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => {
                      navigate(item.page);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  navigate('home');
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>زيارة المتجر</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="فتح القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => navigate('home')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>المتجر</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
