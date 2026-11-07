import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Mail, MapPin, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, categories } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-[#070D19] border-t border-slate-800 transition-colors">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-right">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="p-3 rounded-2xl bg-blue-600/10 text-cyan-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">توصيل مجاني لجميع مناطق المملكة</h4>
                <p className="text-xs text-slate-400 mt-0.5">الدفع عند الاستلام مع إمكانية المعاينة</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="p-3 rounded-2xl bg-blue-600/10 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">منتجات أصلية 100%</h4>
                <p className="text-xs text-slate-400 mt-0.5">ضمان وكيل معتمد على كافة الأجهزة</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="p-3 rounded-2xl bg-blue-600/10 text-cyan-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">إلغاء مرن خلال ساعتين</h4>
                <p className="text-xs text-slate-400 mt-0.5">إلغاء فوري بضغطة زر وإرجاع المخزون</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-sm">
                TZ
              </div>
              <span className="font-extrabold text-xl text-white">
                تيك زون <span className="text-cyan-400 text-sm font-normal">TechZone</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              متجر أردني رائد متخصص في أحدث الإلكترونيات وملحقات الحواسيب والسماعات والساعات الذكية الأصلية بأفضل الأسعار.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>الدفع: <strong>الدفع نقداً عند الاستلام (COD)</strong></span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('products')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  كافة المنتجات
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('cart')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  سلة التسوق
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('my-orders')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  متابعة طلباتي
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">أقسام المنتجات</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.category_id}>
                  <button
                    onClick={() => navigate('products', { categoryId: cat.category_id })}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {cat.category_name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">تواصل معنا</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>عمّان، شارع الجاردنز، المملكة الأردنية الهاشمية</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span dir="ltr" className="text-right font-mono">+962 6 555 8899</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono">support@techzone.jo</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} تيك زون (TechZone Jordan). نموذج مشروع إلكتروني متكامل.
          </div>
          <div className="text-[11px] text-slate-400">
            العملة المعتمدة: الدينار الأردني (د.أ / JOD)
          </div>
        </div>
      </div>
    </footer>
  );
};
