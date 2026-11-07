import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { LightboxModal } from '../../components/common/Modal';
import {
  ShoppingBag,
  ArrowRight,
  Maximize2,
  AlertTriangle,
  Layers,
  ChevronLeft
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const {
    navigation,
    navigate,
    products,
    categories,
    variants,
    images,
    addToCart,
    cart
  } = useStore();

  const productId = navigation.params?.productId;
  const product = products.find(p => p.product_id === productId);

  // Images for this product
  const productImages = images.filter(img => img.product_id === productId);
  const primaryImg = productImages.find(img => img.is_primary) || productImages[0];

  const [activeImage, setActiveImage] = useState<string>(primaryImg?.image_path || '');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Color variants for this product
  const productVariants = variants.filter(v => v.product_id === productId);

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [stockWarning, setStockWarning] = useState<string>('');

  // Update active image and default variant when product changes
  useEffect(() => {
    if (productImages.length > 0) {
      const pImg = productImages.find(img => img.is_primary) || productImages[0];
      setActiveImage(pImg.image_path);
    }
    if (productVariants.length > 0) {
      // Pick first in-stock variant by default if available
      const available = productVariants.filter(v => v.stock_quantity > 0);
      setSelectedVariantId(available.length > 0 ? available[0].variant_id : productVariants[0].variant_id);
      setQuantity(1);
      setStockWarning('');
    }
  }, [productId, products, variants]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold mb-3">عذراً، المنتج المطلوب غير موجود</h2>
        <p className="text-xs text-slate-500 mb-6">قد يكون المنتج تم نقله أو إخفاؤه من قبل الإدارة.</p>
        <button
          onClick={() => navigate('products')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          العودة إلى المنتجات
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.category_id === product.category_id);
  const selectedVariant = productVariants.find(v => v.variant_id === selectedVariantId);
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : 0;
  const isOutOfStock = currentStock <= 0;

  // Existing quantity in cart for this variant
  const inCartItem = cart.find(c => c.variant_id === selectedVariantId);
  const qtyInCart = inCartItem ? inCartItem.quantity : 0;

  // Handle color change
  const handleSelectColor = (vId: string) => {
    setSelectedVariantId(vId);
    setQuantity(1);
    setStockWarning('');
  };

  // Quantity stepper logic with strict inventory bounds
  const handleQuantityChange = (newQty: number) => {
    if (!selectedVariant) return;

    if (newQty < 1) {
      setQuantity(1);
      return;
    }

    if (newQty > currentStock) {
      if (currentStock === 1) {
        setStockWarning('الكمية المطلوبة غير متوفرة. المتوفر حاليًا قطعة واحدة فقط.');
      } else {
        setStockWarning(`الكمية المطلوبة غير متوفرة. المتوفر حاليًا (${currentStock}) قطع فقط.`);
      }
      setQuantity(currentStock);
      return;
    }

    // Check with in-cart quantity as well
    if (newQty + qtyInCart > currentStock) {
      const remaining = currentStock - qtyInCart;
      if (remaining <= 0) {
        setStockWarning(`لديك بالفعل (${qtyInCart}) قطع في السلة، وهو كامل المخزون المتوفر.`);
      } else {
        setStockWarning(`لديك بالفعل (${qtyInCart}) قطع في السلة، يمكنك إضافة (${remaining}) قطعة كحد أقصى.`);
      }
    } else {
      setStockWarning('');
    }

    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setStockWarning('يرجى اختيار لون متوفر أولاً.');
      return;
    }

    if (isOutOfStock) {
      setStockWarning('هذا اللون غير متوفر في المخزون حالياً.');
      return;
    }

    const res = addToCart(product.product_id, selectedVariant.variant_id, quantity);
    if (!res.success) {
      setStockWarning(res.message);
    } else {
      setStockWarning('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 text-right">
          <button onClick={() => navigate('home')} className="hover:text-blue-600 dark:hover:text-cyan-400">
            الرئيسية
          </button>
          <ChevronLeft className="w-3.5 h-3.5" />
          <button onClick={() => navigate('products')} className="hover:text-blue-600 dark:hover:text-cyan-400">
            المنتجات
          </button>
          {category && (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <button
                onClick={() => navigate('products', { categoryId: category.category_id })}
                className="hover:text-blue-600 dark:hover:text-cyan-400"
              >
                {category.category_name}
              </button>
            </>
          )}
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">
            {product.product_name}
          </span>
        </nav>

        {/* Product Details Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Gallery Column (Right on RTL) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Display with zoom trigger */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 group">
                <img
                  src={activeImage || primaryImg?.image_path}
                  alt={product.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                  title="تكبير الصورة"
                  aria-label="تكبير الصورة"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails Gallery */}
              {productImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {productImages.map(img => {
                    const isSelected = activeImage === img.image_path;
                    return (
                      <button
                        key={img.image_id}
                        type="button"
                        onClick={() => setActiveImage(img.image_path)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          isSelected
                            ? 'border-blue-600 dark:border-cyan-400 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.image_path}
                          alt="صورة مصغرة"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Information & Purchase Module (Left on RTL) */}
            <div className="lg:col-span-6 text-right space-y-6">
              
              {/* Brand & Category badges */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 text-xs font-bold">
                  {category?.category_name}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  العلامة التجارية: <strong className="text-slate-800 dark:text-slate-200">{product.brand}</strong>
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
                {product.product_name}
              </h1>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">السعر الإجمالي</div>
                  <div className="text-3xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                    {product.price} د.أ
                  </div>
                </div>
                <div className="text-left text-xs text-slate-500 dark:text-slate-400">
                  <div>الدفع: <strong>عند الاستلام</strong></div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">شحن مجاني</div>
                </div>
              </div>

              {/* Color Selection with independent variant stock */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    الألوان المتاحة ({productVariants.length}):
                  </span>
                  {selectedVariant && (
                    <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400">
                      اللون المحدد: {selectedVariant.color_name}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {productVariants.map(v => {
                    const isSelected = selectedVariantId === v.variant_id;
                    const isZeroStock = v.stock_quantity <= 0;

                    return (
                      <button
                        key={v.variant_id}
                        type="button"
                        onClick={() => handleSelectColor(v.variant_id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 ring-2 ring-blue-500/20'
                            : isZeroStock
                            ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 opacity-50'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: v.color_hex || '#334155' }}
                          />
                          <span className="truncate">{v.color_name}</span>
                        </div>
                        <div className="tabular-nums shrink-0 mr-2">
                          {isZeroStock ? (
                            <span className="text-rose-500 font-bold">غير متوفر</span>
                          ) : v.stock_quantity <= 5 ? (
                            <span className="text-amber-600 dark:text-amber-400">متبقي {v.stock_quantity}</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">متوفر ({v.stock_quantity})</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart button */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-white dark:bg-slate-800">
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-base tabular-nums">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= currentStock}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      isOutOfStock
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-[1.01]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'اللون المحدد غير متوفر' : 'أضف إلى سلة التسوق'}</span>
                  </button>
                </div>

                {/* Stock Warning Box */}
                {stockWarning && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{stockWarning}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-400">الوصف</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400">المواصفات التقنية</h3>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <div
                        key={key}
                        className={`grid grid-cols-3 p-2.5 ${
                          idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-900'
                        }`}
                      >
                        <span className="font-bold text-slate-700 dark:text-slate-300 col-span-1">{key}</span>
                        <span className="text-slate-600 dark:text-slate-400 col-span-2">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          isOpen={lightboxOpen}
          imageSrc={activeImage || primaryImg?.image_path}
          altText={product.product_name}
          onClose={() => setLightboxOpen(false)}
        />

      </div>
    </div>
  );
};
