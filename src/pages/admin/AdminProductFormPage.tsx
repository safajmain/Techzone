import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import {
  Save,
  Plus,
  Trash2,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Check,
  Star,
  AlertTriangle
} from 'lucide-react';

export const AdminProductFormPage: React.FC = () => {
  const {
    navigation,
    navigate,
    products,
    categories,
    variants,
    images,
    addProduct,
    updateProduct
  } = useStore();

  const isEditMode = navigation.page === 'admin-product-edit';
  const editingProductId = navigation.params?.productId;
  const existingProduct = isEditMode ? products.find(p => p.product_id === editingProductId) : null;

  // Form Fields
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Images state: { image_id?, image_path, is_primary }
  const [imageList, setImageList] = useState<
    { image_id?: string; image_path: string; is_primary: boolean }[]
  >([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants state: { variant_id?, color_name, color_hex?, stock_quantity }
  const [variantList, setVariantList] = useState<
    { variant_id?: string; color_name: string; color_hex?: string; stock_quantity: number }[]
  >([
    { color_name: 'أسود (Black)', color_hex: '#111827', stock_quantity: 5 }
  ]);

  const [formError, setFormError] = useState('');

  // Load existing product data when editing
  useEffect(() => {
    if (isEditMode && existingProduct) {
      setProductName(existingProduct.product_name);
      setCategoryId(existingProduct.category_id);
      setBrand(existingProduct.brand);
      setPrice(existingProduct.price.toString());
      setDescription(existingProduct.description);
      setIsActive(existingProduct.is_active);

      // Load images
      const existingImgs = images
        .filter(img => img.product_id === existingProduct.product_id)
        .map(img => ({
          image_id: img.image_id,
          image_path: img.image_path,
          is_primary: img.is_primary
        }));
      setImageList(existingImgs.length > 0 ? existingImgs : []);

      // Load variants
      const existingVars = variants
        .filter(v => v.product_id === existingProduct.product_id)
        .map(v => ({
          variant_id: v.variant_id,
          color_name: v.color_name,
          color_hex: v.color_hex || '#334155',
          stock_quantity: v.stock_quantity
        }));
      setVariantList(existingVars.length > 0 ? existingVars : []);
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].category_id);
    }
  }, [isEditMode, existingProduct, categories]);

  // Image helpers
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = imageList.length === 0;
    setImageList(prev => [...prev, { image_path: newImageUrl.trim(), is_primary: isFirst }]);
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setImageList(prev => [
            ...prev,
            { image_path: base64, is_primary: prev.length === 0 }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setImageList(prev =>
      prev.map((img, idx) => ({ ...img, is_primary: idx === index }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImageList(prev => {
      const next = prev.filter((_, idx) => idx !== index);
      // Ensure there's still a primary image
      if (next.length > 0 && !next.some(img => img.is_primary)) {
        next[0].is_primary = true;
      }
      return next;
    });
  };

  // Color variant helpers
  const handleAddVariantRow = () => {
    setVariantList(prev => [
      ...prev,
      { color_name: '', color_hex: '#2563EB', stock_quantity: 1 }
    ]);
  };

  const handleUpdateVariant = (
    index: number,
    field: 'color_name' | 'color_hex' | 'stock_quantity',
    value: any
  ) => {
    setVariantList(prev =>
      prev.map((v, idx) => (idx === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariantRow = (index: number) => {
    if (variantList.length <= 1) {
      setFormError('يجب أن يحتوي المنتج على لون واحد على الأقل.');
      return;
    }
    setVariantList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!productName.trim()) {
      setFormError('اسم المنتج مطلوب.');
      return;
    }

    if (!categoryId) {
      setFormError('يرجى اختيار تصنيف للمنتج.');
      return;
    }

    if (!brand.trim()) {
      setFormError('العلامة التجارية (Brand) مطلوبة.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('يرجى إدخال سعر صحيح أكبر من الصفر.');
      return;
    }

    if (!description.trim()) {
      setFormError('وصف المنتج مطلوب.');
      return;
    }

    if (imageList.length === 0) {
      setFormError('يجب إضافة صورة واحدة على الأقل للمنتج.');
      return;
    }

    if (variantList.length === 0) {
      setFormError('يجب إضافة لون واحد على الأقل للمنتج.');
      return;
    }

    // Check color names and negative stocks
    const colorNames = new Set<string>();
    for (const v of variantList) {
      if (!v.color_name.trim()) {
        setFormError('يرجى إدخال اسم لجميع صفوف الألوان.');
        return;
      }
      const lower = v.color_name.trim().toLowerCase();
      if (colorNames.has(lower)) {
        setFormError(`اللون "${v.color_name}" مكرر لهذا المنتج. يرجى دمج المخزون في صف واحد.`);
        return;
      }
      colorNames.add(lower);

      if (v.stock_quantity < 0 || isNaN(Number(v.stock_quantity))) {
        setFormError(`الكمية في المخزون لا يمكن أن تكون سالبة للون "${v.color_name}".`);
        return;
      }
    }

    // Ensure one primary image
    const sanitizedImages = imageList.map((img, idx) => ({
      ...img,
      is_primary: idx === 0 ? true : img.is_primary
    }));

    if (isEditMode && existingProduct) {
      updateProduct(
        existingProduct.product_id,
        {
          product_name: productName.trim(),
          category_id: categoryId,
          brand: brand.trim(),
          price: numPrice,
          description: description.trim(),
          is_active: isActive
        },
        sanitizedImages,
        variantList
      );
      navigate('admin-products');
    } else {
      const res = addProduct(
        {
          product_name: productName.trim(),
          category_id: categoryId,
          brand: brand.trim(),
          price: numPrice,
          description: description.trim(),
          is_active: isActive
        },
        sanitizedImages,
        variantList
      );

      if (res.success) {
        navigate('admin-products');
      } else {
        setFormError(res.message || 'حدث خطأ أثناء حفظ المنتج.');
      }
    }
  };

  return (
    <AdminLayout
      title={isEditMode ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
      subtitle={
        isEditMode
          ? `تعديل تفاصيل وأسعار وصور وألوان ومخزون: ${existingProduct?.product_name || ''}`
          : 'أدخل تفاصيل الجهاز أو الملحق الإلكتروني الجديد وألوانه ومخزونه'
      }
      actions={
        <button
          onClick={() => navigate('admin-products')}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة للمنتجات</span>
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 text-right">
        
        {formError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            المعلومات الأساسية للمنتج
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المنتج بالكامل (عربي / إنجليزي) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="سماعة سوني اللاسلكية Sony WH-1000XM5"
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                التصنيف <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
              >
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                العلامة التجارية (Brand) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Sony, Logitech, Apple, Razer..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden font-mono"
              />
            </div>

            {/* Price (JOD) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                السعر بالدينار الأردني (د.أ / JOD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="45"
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden tabular-nums font-bold text-blue-600 dark:text-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                تتشارك جميع ألوان هذا المنتج نفس السعر المحدد أعلاه
              </span>
            </div>

            {/* Active Status Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                حالة ظهور المنتج في المتجر
              </label>
              <div className="flex items-center gap-4 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="radio"
                    name="is_active"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="accent-blue-600"
                  />
                  <span className="text-emerald-600 dark:text-emerald-400">نشط (يظهر للزبائن)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="radio"
                    name="is_active"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="accent-blue-600"
                  />
                  <span className="text-slate-500">مخفي (مسودة للإدارة)</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                وصف المنتج ومميزاته <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="اكتب مواصفات وتفاصيل الجهاز الفنية..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Product Images Management */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                معرض صور المنتج (Multiple Images)
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                الصور تتبع المنتج ككل وليس الألوان الفردية. يجب تحديد صورة رئيسية واحدة.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
              ({imageList.length}) صور مضافة
            </span>
          </div>

          {/* Add Image Controls: URL or File Upload */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="أدخل رابط صورة مباشر (URL)..."
                className="flex-1 w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-left"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                إضافة الرابط
              </button>

              <label className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl border border-blue-300 dark:border-blue-800 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>رفع من الجهاز</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Images Grid & Primary selection */}
          {imageList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imageList.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-4/3 rounded-2xl overflow-hidden border-2 transition-all group ${
                    img.is_primary
                      ? 'border-blue-600 dark:border-cyan-400 ring-4 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img
                    src={img.image_path}
                    alt={`صورة ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Primary Badge */}
                  {img.is_primary && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-white" />
                      <span>الرئيسية</span>
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!img.is_primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="p-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                        title="تعيين كصورة رئيسية"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400">
              لم تتم إضافة أي صور للمنتج بعد. يرجى إضافة صورة واحدة على الأقل.
            </div>
          )}
        </div>

        {/* Section 3: Colors and Independent Stock Variants */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                ألوان المنتج والمخزون المستقل (Variants & Stock)
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                كل لون يملك مخزوناً خاصاً به ومعرفاً مستقلاً.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariantRow}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 hover:bg-blue-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة لون جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {variantList.map((v, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                {/* Color hex picker indicator */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={v.color_hex || '#2563EB'}
                    onChange={e => handleUpdateVariant(idx, 'color_hex', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    title="تحديد درجة اللون"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {v.color_hex || '#2563EB'}
                  </span>
                </div>

                {/* Color Name */}
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    value={v.color_name}
                    onChange={e => handleUpdateVariant(idx, 'color_name', e.target.value)}
                    placeholder="اسم اللون، مثل: أسود فاحم (Black)..."
                    className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                {/* Stock Quantity */}
                <div className="w-full sm:w-36 flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                    المخزون:
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={v.stock_quantity}
                    onChange={e =>
                      handleUpdateVariant(idx, 'stock_quantity', Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden tabular-nums font-bold"
                  />
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  disabled={variantList.length <= 1}
                  onClick={() => handleRemoveVariantRow(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-colors self-end sm:self-auto"
                  title="حذف هذا اللون"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Sum of total stock */}
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              إجمالي المخزون التراكمي المحسوب تلقائياً:
            </span>
            <span className="font-black text-blue-600 dark:text-cyan-400 tabular-nums text-sm">
              {variantList.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0)} قطعة
            </span>
          </div>
        </div>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('admin-products')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            إلغاء والعودة
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'حفظ تعديلات المنتج' : 'إضافة ونشر المنتج'}</span>
          </button>
        </div>

      </form>
    </AdminLayout>
  );
};
