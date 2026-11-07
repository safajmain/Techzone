import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant } from '../../types';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Headphones,
  Keyboard,
  Mouse,
  Zap,
  Watch,
  Layers,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    variants,
    getProductPrimaryImage,
    getProductVariants,
    getProductTotalStock,
    addToCart,
    navigate
  } = useStore();

  // Color selection modal for quick add-to-cart from home page
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [quickAddWarning, setQuickAddWarning] = useState<string>('');

  // Map category icons
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Headphones': return <Headphones className="w-6 h-6 text-blue-600 dark:text-cyan-400" />;
      case 'Keyboard': return <Keyboard className="w-6 h-6 text-blue-600 dark:text-cyan-400" />;
      case 'Mouse': return <Mouse className="w-6 h-6 text-blue-600 dark:text-cyan-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-blue-600 dark:text-cyan-400" />;
      case 'Watch': return <Watch className="w-6 h-6 text-blue-600 dark:text-cyan-400" />;
      default: return <Layers className="w-6 h-6 text-blue-600 dark:text-cyan-400" />;
    }
  };

  // Only active products
  const activeProducts = products.filter(p => p.is_active);
  // Pick 6 featured products
  const featuredProducts = activeProducts.slice(0, 6);

  const handleOpenQuickAdd = (product: Product) => {
    const pVariants = getProductVariants(product.product_id);
    const available = pVariants.filter(v => v.stock_quantity > 0);
    setQuickAddProduct(product);
    setSelectedVariantId(available.length > 0 ? available[0].variant_id : (pVariants[0]?.variant_id || ''));
    setSelectedQty(1);
    setQuickAddWarning('');
  };

  const handleQuickAddSubmit = () => {
    if (!quickAddProduct) return;
    const v = variants.find(variant => variant.variant_id === selectedVariantId);
    if (!v) {
      setQuickAddWarning('يرجى اختيار لون متوفر.');
      return;
    }
    if (v.stock_quantity <= 0) {
      setQuickAddWarning('هذا اللون غير متوفر حالياً.');
      return;
    }
    if (selectedQty > v.stock_quantity) {
      setQuickAddWarning(`الكمية المطلوبة غير متوفرة. المتوفر حاليًا قطعة واحدة فقط أو (${v.stock_quantity}) قطع.`);
      return;
    }

    const res = addToCart(quickAddProduct.product_id, v.variant_id, selectedQty);
    if (res.success) {
      setQuickAddProduct(null);
    } else {
      setQuickAddWarning(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900/40 dark:via-[#0B1120] dark:to-[#0B1120] border-b border-slate-200/80 dark:border-slate-800/80 pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Copy (Right on RTL) */}
            <div className="lg:col-span-7 text-right space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الوجهة الأولى للإلكترونيات وملحقات الألعاب في الأردن</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                أحدث التقنيات الإلكترونية
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-cyan-500 to-blue-700 dark:from-cyan-400 dark:to-blue-500 mt-2">
                  بأعلى معايير الجودة والأداء
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                اكتشف تشكيلتنا المختارة بعناية من أفضل سماعات الرأس، لوحات المفاتيح الميكانيكية، فأرات التحكم الدقيقة والشواحن السريعة والساعات الذكية الأصلية مع خدمة التوصيل السريع والدفع عند الاستلام.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('products')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>تسوّق الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('categories-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  استكشف التصنيفات
                </button>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">أجهزة أصلية معتمدة</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">0 د.أ</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">توصيل مجاني</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">24/7</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">دعم فني وضمان</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card (Left on RTL) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden bg-white dark:bg-slate-800/90 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 transition-all">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
                    alt="سماعات رأس لاسلكية فاخرة"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-blue-600/90 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                    الأكثر طلباً
                  </div>
                </div>

                <div className="p-4 space-y-2 text-right">
                  <div className="text-xs font-semibold text-blue-600 dark:text-cyan-400">Sony WH-1000XM5</div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    عزل ضوضاء رائد عالمياً وصوت عالي الدقة
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                      245 د.أ
                    </span>
                    <button
                      onClick={() => navigate('product-details', { productId: 'prod_sony_wh1000xm5' })}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-right">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 tracking-wider">الأقسام المتاحة</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              تصفح الأجهزة حسب التصنيف
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>جميع المنتجات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => {
            const count = products.filter(p => p.category_id === cat.category_id && p.is_active).length;
            return (
              <button
                key={cat.category_id}
                onClick={() => navigate('products', { categoryId: cat.category_id })}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-cyan-500 text-right transition-all flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {cat.category_name}
                  </h3>
                  {cat.category_name_en && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      {cat.category_name_en}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums">
                    {count} {count === 1 ? 'منتج' : 'منتجات'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-right">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 tracking-wider">مختاراتنا لك</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                المنتجات المميزة
              </h2>
            </div>
            <button
              onClick={() => navigate('products')}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>عرض الكتالوج بالكامل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map(product => {
              const primaryImg = getProductPrimaryImage(product.product_id);
              const pVariants = getProductVariants(product.product_id);
              const totalStock = getProductTotalStock(product.product_id);
              const isOutOfStock = totalStock <= 0;

              return (
                <div
                  key={product.product_id}
                  className="group rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col"
                >
                  {/* Card Image */}
                  <div
                    onClick={() => navigate('product-details', { productId: product.product_id })}
                    className="relative aspect-4/3 w-full bg-white dark:bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={primaryImg}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Stock status indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500 text-white shadow-xs">
                          غير متوفر
                        </span>
                      ) : totalStock <= 5 ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-white shadow-xs">
                          متبقي {totalStock} قطع فقط
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
                          متوفر
                        </span>
                      )}
                    </div>

                    {/* Brand Pill */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                      {product.brand}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-right">
                    <div>
                      <h3
                        onClick={() => navigate('product-details', { productId: product.product_id })}
                        className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                      >
                        {product.product_name}
                      </h3>

                      {/* Available Colors preview */}
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">الألوان:</span>
                        <div className="flex items-center gap-1">
                          {pVariants.map(v => (
                            <span
                              key={v.variant_id}
                              className={`w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 ${
                                v.stock_quantity === 0 ? 'opacity-30 line-through' : ''
                              }`}
                              style={{ backgroundColor: v.color_hex || '#334155' }}
                              title={`${v.color_name} (${v.stock_quantity > 0 ? `المتوفر: ${v.stock_quantity}` : 'غير متوفر'})`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">السعر</div>
                        <div className="text-lg font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                          {product.price} د.أ
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('product-details', { productId: product.product_id })}
                          className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          التفاصيل
                        </button>

                        <button
                          disabled={isOutOfStock}
                          onClick={() => handleOpenQuickAdd(product)}
                          className={`p-2 rounded-xl transition-colors ${
                            isOutOfStock
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                          title={isOutOfStock ? 'غير متوفر حالياً' : 'إضافة إلى السلة'}
                          aria-label="إضافة إلى السلة"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-right animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              إضافة إلى سلة التسوق
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate">
              {quickAddProduct.product_name}
            </p>

            {/* Color selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر اللون المطلوب:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getProductVariants(quickAddProduct.product_id).map(v => {
                  const isSelected = selectedVariantId === v.variant_id;
                  const isOut = v.stock_quantity <= 0;

                  return (
                    <button
                      key={v.variant_id}
                      type="button"
                      disabled={isOut}
                      onClick={() => {
                        setSelectedVariantId(v.variant_id);
                        setSelectedQty(1);
                        setQuickAddWarning('');
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isOut
                          ? 'opacity-40 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                          : isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: v.color_hex || '#334155' }}
                        />
                        <span>{v.color_name}</span>
                      </div>
                      <div className="tabular-nums">
                        {isOut ? (
                          <span className="text-rose-500 font-bold">غير متوفر</span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">
                            (المتوفر: {v.stock_quantity})
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                الكمية:
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedQty(prev => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="font-bold text-base tabular-nums w-8 text-center">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentV = variants.find(v => v.variant_id === selectedVariantId);
                    if (currentV && selectedQty < currentV.stock_quantity) {
                      setSelectedQty(prev => prev + 1);
                      setQuickAddWarning('');
                    } else if (currentV) {
                      setQuickAddWarning(`الكمية المطلوبة غير متوفرة. المتوفر حاليًا قطعة واحدة فقط أو (${currentV.stock_quantity}) قطع.`);
                    }
                  }}
                  className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Warning Message */}
            {quickAddWarning && (
              <div className="p-2.5 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
                {quickAddWarning}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickAddProduct(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleQuickAddSubmit}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>إضافة إلى السلة</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
