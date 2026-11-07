import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    enrichedCart,
    cartCount,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    currentUser,
    navigate
  } = useStore();

  const hasIssues = enrichedCart.some(item => item.hasStockIssue || !item.isAvailable);

  const handleProceedToCheckout = () => {
    if (hasIssues) return;
    if (!currentUser) {
      // Guest: redirect to login/register with return to checkout flag
      navigate('login', { fromCheckout: true });
    } else {
      navigate('checkout');
    }
  };

  if (enrichedCart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#0B1120]">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-5 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          سلة التسوق فارغة
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          لم تقم بإضافة أي أجهزة أو ملحقات إلى سلتك بعد. تصفح أحدث المنتجات الإلكترونية وأضف ما يناسبك!
        </p>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <span>تصفح المنتجات الآن</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              سلة التسوق
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              لديك ({cartCount}) قطع في سلتك
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>تفريغ السلة</span>
          </button>
        </div>

        {/* Global Inventory Warning Banner if any item has issues */}
        {hasIssues && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-right flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                تنبيه: تم رصد تغيير في حالة المخزون أو المنتجات بالسلة
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                يرجى تعديل الكميات أو إزالة العناصر غير المتوفرة أدناه لتتمكن من متابعة عملية الشراء وإتمام الطلب.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (Right on RTL) */}
          <div className="lg:col-span-8 space-y-4">
            {enrichedCart.map(item => {
              const itemHasIssue = item.hasStockIssue || !item.isAvailable;

              return (
                <div
                  key={item.variant_id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-right ${
                    itemHasIssue
                      ? 'border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/10'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  {/* Product Details & Thumbnail */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.primaryImage}
                      alt={item.product.product_name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-slate-400">
                        {item.product.brand}
                      </div>
                      <h3
                        onClick={() => navigate('product-details', { productId: item.product_id })}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer line-clamp-1"
                      >
                        {item.product.product_name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>اللون:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.variant.color_name}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 dark:text-cyan-400 tabular-nums">
                        سعر القطعة: {item.unit_price} د.أ
                      </div>

                      {/* Item-specific stock warning message */}
                      {item.hasStockIssue && (
                        <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {item.maxAvailable <= 0
                              ? 'هذا المنتج نفد من المخزون حالياً.'
                              : `المتوفر حالياً (${item.maxAvailable}) فقط. يرجى تعديل الكمية.`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper, Subtotal, and Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800/60">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.variant_id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm hover:bg-white dark:hover:bg-slate-700"
                        title="إنقاص الكمية"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs sm:text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.maxAvailable}
                        onClick={() => updateCartQuantity(item.variant_id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="زيادة الكمية"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-left min-w-[70px]">
                      <div className="text-[10px] text-slate-400">الإجمالي</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                        {item.subtotal} د.أ
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.variant_id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}

            {/* Navigation back */}
            <div className="pt-2">
              <button
                onClick={() => navigate('products')}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>متابعة التسوق وإضافة منتجات أخرى</span>
              </button>
            </div>
          </div>

          {/* Order Summary Card (Left on RTL) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-24 text-right space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              ملخص الطلب
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>مجموع المنتجات:</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {cartTotal} د.أ
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>رسوم التوصيل:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  0 د.أ (مجاني)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>طريقة الدفع:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  الدفع عند الاستلام
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">المبلغ الإجمالي:</span>
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                {cartTotal} د.أ
              </span>
            </div>

            {/* Checkout Action */}
            <button
              disabled={hasIssues}
              onClick={handleProceedToCheckout}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                hasIssues
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <span>إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {!currentUser && (
              <p className="text-[11px] text-center text-slate-400 leading-normal">
                سيُطلب منك تسجيل الدخول أو إنشاء حساب سريع لمتابعة الطلب.
              </p>
            )}

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>شحن وتوصيل فوري لجميع محافظات الأردن</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>معاينة المنتجات قبل الاستلام والدفع للمندوب</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
