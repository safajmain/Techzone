import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    variants,
    navigation,
    navigate,
    getProductPrimaryImage,
    getProductVariants,
    getProductCategory,
    getProductTotalStock
  } = useStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>(navigation.params?.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(navigation.params?.categoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name_asc'>('newest');

  // Pagination state (12 per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sync navigation params when changed
  useEffect(() => {
    if (navigation.params?.categoryId) {
      setSelectedCategory(navigation.params.categoryId);
    }
    if (navigation.params?.searchQuery) {
      setSearchQuery(navigation.params.searchQuery);
    }
  }, [navigation.params]);

  // Derive unique brands
  const brandsList = useMemo(() => {
    const set = new Set<string>();
    products.filter(p => p.is_active).forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Derive unique colors
  const colorsList = useMemo(() => {
    const map = new Map<string, string>();
    variants.forEach(v => {
      // Map base color name without parentheses if needed
      const simpleName = v.color_name.split('(')[0].trim();
      if (!map.has(simpleName)) {
        map.set(simpleName, v.color_hex || '#475569');
      }
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [variants]);

  // Reset filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColor('all');
    setAvailability('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Hide inactive products from customer view
      if (!product.is_active) return false;

      // Search Query filter (checks product_name and brand in both Arabic and English)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.product_name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category_id !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Price range filters
      const min = minPrice ? parseFloat(minPrice) : null;
      const max = maxPrice ? parseFloat(maxPrice) : null;
      if (min !== null && product.price < min) return false;
      if (max !== null && product.price > max) return false;

      // Product Variants inspection for Color & Availability combined filtering
      const pVariants = variants.filter(v => v.product_id === product.product_id);
      const totalStock = pVariants.reduce((sum, v) => sum + v.stock_quantity, 0);

      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = pVariants.some(v => v.color_name.includes(selectedColor));
        if (!hasColor) return false;
      }

      // Availability filter
      if (availability === 'in_stock') {
        if (selectedColor !== 'all') {
          // Must have stock for the selected color!
          const matchingColorVar = pVariants.find(v => v.color_name.includes(selectedColor));
          if (!matchingColorVar || matchingColorVar.stock_quantity <= 0) return false;
        } else {
          if (totalStock <= 0) return false;
        }
      } else if (availability === 'out_of_stock') {
        if (selectedColor !== 'all') {
          const matchingColorVar = pVariants.find(v => v.color_name.includes(selectedColor));
          if (!matchingColorVar || matchingColorVar.stock_quantity > 0) return false;
        } else {
          if (totalStock > 0) return false;
        }
      }

      return true;
    });
  }, [products, variants, searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, selectedColor, availability]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.product_name.localeCompare(b.product_name, 'ar');
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedBrand !== 'all',
    minPrice !== '',
    maxPrice !== '',
    selectedColor !== 'all',
    availability !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              كتالوج المنتجات الإلكترونية
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              عرض ({sortedProducts.length}) منتج متاح ضمن المتجر
            </p>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الموديل..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:border-blue-500 dark:focus:border-cyan-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="newest">الترتيب: الأحدث</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
              <option value="name_asc">الاسم: أ إلى ي</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>الفلاتر ({activeFiltersCount})</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs sticky top-24 space-y-6 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">تصفية المنتجات</h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>مسح الكل</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="all">كافة التصنيفات</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                العلامة التجارية (Brand)
              </label>
              <select
                value={selectedBrand}
                onChange={e => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden font-mono"
              >
                <option value="all">كافة الماركات (All Brands)</option>
                {brandsList.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                نطاق السعر (د.أ)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="الحد الأدنى"
                  value={minPrice}
                  onChange={e => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
                <input
                  type="number"
                  placeholder="الحد الأعلى"
                  value={maxPrice}
                  onChange={e => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اللون المتاح
              </label>
              <select
                value={selectedColor}
                onChange={e => {
                  setSelectedColor(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="all">كافة الألوان</option>
                {colorsList.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                حالة التوفر
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'all'}
                    onChange={() => {
                      setAvailability('all');
                      setCurrentPage(1);
                    }}
                    className="accent-blue-600"
                  />
                  <span>الكل (All)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'in_stock'}
                    onChange={() => {
                      setAvailability('in_stock');
                      setCurrentPage(1);
                    }}
                    className="accent-blue-600"
                  />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">متوفر فقط (In Stock)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === 'out_of_stock'}
                    onChange={() => {
                      setAvailability('out_of_stock');
                      setCurrentPage(1);
                    }}
                    className="accent-blue-600"
                  />
                  <span className="text-rose-500 font-semibold">غير متوفر (Out of Stock)</span>
                </label>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                إلغاء جميع الفلاتر
              </button>
            )}
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map(product => {
                    const primaryImg = getProductPrimaryImage(product.product_id);
                    const category = getProductCategory(product.category_id);
                    const pVariants = getProductVariants(product.product_id);
                    const totalStock = getProductTotalStock(product.product_id);
                    const isOutOfStock = totalStock <= 0;

                    return (
                      <div
                        key={product.product_id}
                        className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Image */}
                          <div
                            onClick={() => navigate('product-details', { productId: product.product_id })}
                            className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800/80 cursor-pointer overflow-hidden"
                          >
                            <img
                              src={primaryImg}
                              alt={product.product_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />

                            <div className="absolute top-3 right-3">
                              {isOutOfStock ? (
                                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500 text-white shadow-xs">
                                  غير متوفر
                                </span>
                              ) : totalStock <= 5 ? (
                                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-white shadow-xs">
                                  متبقي {totalStock} قطع
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
                                  متوفر
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                              {product.brand}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4 text-right">
                            <div className="text-[11px] font-semibold text-slate-400 mb-1">
                              {category?.category_name}
                            </div>
                            <h3
                              onClick={() => navigate('product-details', { productId: product.product_id })}
                              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                            >
                              {product.product_name}
                            </h3>

                            {/* Color variant dots */}
                            <div className="flex items-center gap-1.5 mt-3">
                              <span className="text-[11px] text-slate-400">الألوان:</span>
                              <div className="flex items-center gap-1">
                                {pVariants.map(v => (
                                  <span
                                    key={v.variant_id}
                                    className={`w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 ${
                                      v.stock_quantity === 0 ? 'opacity-30' : ''
                                    }`}
                                    style={{ backgroundColor: v.color_hex || '#334155' }}
                                    title={`${v.color_name} (${v.stock_quantity > 0 ? `المتوفر: ${v.stock_quantity}` : 'غير متوفر'})`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer & Actions */}
                        <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-base font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                              {product.price} د.أ
                            </span>
                          </div>
                          <button
                            onClick={() => navigate('product-details', { productId: product.product_id })}
                            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-500 text-slate-800 dark:text-slate-200 transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                              isCurrent
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  لم يتم العثور على أي منتجات مطابقة للبحث
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  يرجى تجربة تعديل الفلاتر المحددة أو تغيير معايير البحث والأسعار للوصول إلى المنتجات المطلوبة.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>مسح جميع الفلاتر</span>
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="w-80 bg-white dark:bg-slate-900 h-full p-6 flex flex-col shadow-2xl overflow-y-auto text-right animate-in slide-in-from-right duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">تصفية المنتجات</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Same filter inputs for mobile */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  التصنيف
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="all">كافة التصنيفات</option>
                  {categories.map(c => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  العلامة التجارية
                </label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="all">كافة الماركات</option>
                  {brandsList.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  اللون
                </label>
                <select
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="all">كافة الألوان</option>
                  {colorsList.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  حالة التوفر
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={availability === 'all'}
                      onChange={() => setAvailability('all')}
                    />
                    <span>الكل</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={availability === 'in_stock'}
                      onChange={() => setAvailability('in_stock')}
                    />
                    <span>متوفر فقط</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={availability === 'out_of_stock'}
                      onChange={() => setAvailability('out_of_stock')}
                    />
                    <span>غير متوفر</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                تطبيق الفلاتر
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
