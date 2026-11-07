import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ConfirmModal } from '../../components/common/Modal';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Layers,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    categories,
    variants,
    getProductPrimaryImage,
    getProductCategory,
    getProductVariants,
    getProductTotalStock,
    toggleProductActive,
    navigate
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Confirmation modal for hiding/reactivating
  const [toggleProduct, setToggleProduct] = useState<Product | null>(null);

  // Stock inspection modal
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.product_name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }

      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }

      if (statusFilter === 'active' && !p.is_active) return false;
      if (statusFilter === 'inactive' && p.is_active) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  const handleConfirmToggle = () => {
    if (!toggleProduct) return;
    toggleProductActive(toggleProduct.product_id);
    setToggleProduct(null);
  };

  return (
    <AdminLayout
      title="إدارة المنتجات والمخزون"
      subtitle="إضافة، تعديل، إخفاء وتنشيط المنتجات ومراقبة المخزون حسب الألوان"
      actions={
        <button
          onClick={() => navigate('admin-product-add')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      }
    >
      <div className="space-y-6 text-right">
        
        {/* Search & Filters Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="ابحث باسم المنتج أو الماركة..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="all">كافة التصنيفات</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="all">كافة الحالات (النشط والمخفي)</option>
              <option value="active">نشط في المتجر فقط</option>
              <option value="inactive">مخفي من الواجهة فقط</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-semibold tabular-nums">
            إجمالي النتائج: ({filteredProducts.length})
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold">
                  <th className="py-3 px-4">الصورة الرئيسية</th>
                  <th className="py-3 px-4">اسم المنتج</th>
                  <th className="py-3 px-4">التصنيف</th>
                  <th className="py-3 px-4">الماركة</th>
                  <th className="py-3 px-4">السعر</th>
                  <th className="py-3 px-4">إجمالي المخزون</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map(product => {
                  const primaryImg = getProductPrimaryImage(product.product_id);
                  const cat = getProductCategory(product.category_id);
                  const totalStock = getProductTotalStock(product.product_id);
                  const pVariants = getProductVariants(product.product_id);

                  return (
                    <tr
                      key={product.product_id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Image */}
                      <td className="py-3 px-4">
                        <img
                          src={primaryImg}
                          alt={product.product_name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                          referrerPolicy="no-referrer"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-[220px]">
                        <div className="line-clamp-2">{product.product_name}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {cat?.category_name || '—'}
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {product.brand}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
                        {product.price} د.أ
                      </td>

                      {/* Total Stock */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setInspectProduct(product)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-400 transition-colors"
                          title="عرض تفاصيل الألوان والمخزون"
                        >
                          <span className={`font-black tabular-nums ${
                            totalStock === 0 ? 'text-rose-500' : totalStock <= 5 ? 'text-amber-500' : 'text-emerald-600'
                          }`}>
                            {totalStock} وحدة
                          </span>
                          <span className="text-[10px] text-slate-400">({pVariants.length} ألوان)</span>
                        </button>
                      </td>

                      {/* Active Status */}
                      <td className="py-3 px-4">
                        {product.is_active ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                            نشط بالمتجر
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            مخفي من الواجهة
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => navigate('admin-product-edit', { productId: product.product_id })}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل بيانات المنتج"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active / Hide with confirmation */}
                          <button
                            onClick={() => setToggleProduct(product)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              product.is_active
                                ? 'border-amber-200 dark:border-amber-800 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={product.is_active ? 'إخفاء المنتج من المتجر' : 'إعادة تنشيط المنتج في المتجر'}
                          >
                            {product.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Inspection Modal */}
        {inspectProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-right space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    مخزون الألوان المستقل
                  </h3>
                  <div className="text-xs text-slate-500 truncate max-w-xs">{inspectProduct.product_name}</div>
                </div>
                <button
                  onClick={() => setInspectProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getProductVariants(inspectProduct.product_id).map(v => (
                  <div
                    key={v.variant_id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: v.color_hex || '#334155' }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{v.color_name}</span>
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-md font-extrabold tabular-nums text-[11px] ${
                        v.stock_quantity === 0
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                          : v.stock_quantity <= 5
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                      }`}>
                        المتوفر: {v.stock_quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  إجمالي المخزون لجميع الألوان:
                </span>
                <span className="text-base font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                  {getProductTotalStock(inspectProduct.product_id)} وحدة
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hide / Reactivate Confirmation Modal */}
        <ConfirmModal
          isOpen={!!toggleProduct}
          onClose={() => setToggleProduct(null)}
          onConfirm={handleConfirmToggle}
          title={toggleProduct?.is_active ? 'تأكيد إخفاء المنتج' : 'تأكيد إعادة تنشيط المنتج'}
          message={
            toggleProduct?.is_active
              ? `هل تريد إخفاء المنتج "${toggleProduct?.product_name}" من متجر الزبائن؟ سيتوقف ظهوره في الكتالوج والبحث، مع الاحتفاظ بكافة بياناته وسجل طلباته في لوحة الإدارة.`
              : `هل تريد إعادة تنشيط المنتج "${toggleProduct?.product_name}" ليظهر فوراً للزبائن في المتجر؟`
          }
          confirmText={toggleProduct?.is_active ? 'نعم، إخفاء المنتج' : 'نعم، تنشيط المنتج'}
          cancelText="تراجع"
          isDestructive={toggleProduct?.is_active}
        />

      </div>
    </AdminLayout>
  );
};
