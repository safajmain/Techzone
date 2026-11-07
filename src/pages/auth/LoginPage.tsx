import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, LogIn, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigation, navigate } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fromCheckout = navigation.params?.fromCheckout;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = login(email, password);
    if (res.success) {
      if (res.role === 'admin') {
        navigate('admin-dashboard');
      } else {
        if (fromCheckout) {
          navigate('checkout');
        } else {
          navigate('home');
        }
      }
    } else {
      setErrorMessage(res.message || 'بيانات الدخول غير صحيحة.');
    }
  };

  // Quick One-Click Demo Switcher
  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const res = login(demoEmail, demoPass);
    if (res.success) {
      if (res.role === 'admin') {
        navigate('admin-dashboard');
      } else {
        if (fromCheckout) {
          navigate('checkout');
        } else {
          navigate('home');
        }
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-right space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md shadow-blue-500/20">
            TZ
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            تسجيل الدخول
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fromCheckout
              ? 'يرجى تسجيل الدخول لمتابعة تأكيد وإتمام طلبك'
              : 'أهلاً بك مجدداً في متجر تيك زون'}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden font-mono text-right"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
        </form>

        {/* Demo Quick Login Test Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            حسابات تجريبية سريعة (One-Click Testing):
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@techzone.demo', 'Admin123!')}
              className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-between hover:scale-[1.01] transition-transform"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>مدير النظام (Admin)</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">admin@techzone.demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ahmad@techzone.demo', 'Customer123!')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 flex items-center justify-between hover:scale-[1.01] transition-transform"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>زبون تجريبي (أحمد المجالي)</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">ahmad@techzone.demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('layla@techzone.demo', 'Customer123!')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 flex items-center justify-between hover:scale-[1.01] transition-transform"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>زبونة تجريبية (ليلى خريس)</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">layla@techzone.demo</span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          ليس لديك حساب بعد؟{' '}
          <button
            onClick={() => navigate('register', { fromCheckout })}
            className="text-blue-600 dark:text-cyan-400 font-bold hover:underline"
          >
            إنشاء حساب جديد
          </button>
        </div>

      </div>
    </div>
  );
};
