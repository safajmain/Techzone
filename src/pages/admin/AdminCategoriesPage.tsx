import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ConfirmModal } from '../../components/common/Modal';
import { Category } from '../../types';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory
  } = useStore();

  // Add Category Modal / Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [addError, setAddError] = useState('');

  // Edit Category Modal / Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatNameEn, setEditCatNameEn] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editError, setEditError] = useState('');

  // Delete Category Confirmation State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const handleOpenAddModal = () => {
    setNewCatName('');
    setNewCatNameEn('');
    setNewCatDesc('');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const res = addCategory(newCatName, newCatNameEn, newCatDesc);
    if (res.success) {
      setIsAddModalOpen(false);
    } else {
      setAddError(res.message || 'فشلت إضافة التصنيف.');
    }
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatName(cat.category_name);
    setEditCatNameEn(cat.category_name_en || '');
    setEditCatDesc(cat.description || '');
    setEditError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setEditError('');

    const res = updateCategory(
      editingCategory.category_id,
      editCatName,
      editCatNameEn,
      editCatDesc
    );

    if (res.success) {
      setEditingCategory(null);
    } else {
      setEditError(res.message || 'فشل تحديث التصنيف.');
    }
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    const res = deleteCategory(categoryToDelete.category_id);
    if (res.success) {
      setCategoryToDelete(null);
      setDeleteErrorMessage('');
    } else {
      setDeleteErrorMessage(res.message || 'لا يمكن حذف هذا التصنيف.');
    }
  };

  return (
    <AdminLayout
      title="إدارة التصنيفات"
      subtitle="إضافة، تعديل وحذف تصنيفات الأجهزة الإلكترونية وحساب المنتجات التابعة لها"
      actions={
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تصنيف جديد</span>
        </button>
      }
    >
      <div className="space-y-6 text-right">
        
        {deleteErrorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{deleteErrorMessage}</span>
            </div>
            <button
              onClick={() => setDeleteErrorMessage('')}
              className="p-1 rounded-lg text-rose-500 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Categories Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                قائمة تصنيفات المتجر
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تظهر هذه التصنيفات مباشرة في الواجهة الرئيسية، فلاتر الكتالوج، ونماذج إضافة المنتجات
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
              ({categories.length}) تصنيفات
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold">
                  <th className="py-3 px-6">اسم التصنيف (عربي)</th>
                  <th className="py-3 px-6">الاسم بالإنجليزية</th>
                  <th className="py-3 px-6">الوصف</th>
                  <th className="py-3 px-6">المنتجات المرتبطة</th>
                  <th className="py-3 px-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map(cat => {
                  // Count all products in this category including inactive
                  const linkedProducts = products.filter(p => p.category_id === cat.category_id);
                  const count = linkedProducts.length;
                  const activeCount = linkedProducts.filter(p => p.is_active).length;

                  return (
                    <tr
                      key={cat.category_id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white text-sm">
                        {cat.category_name}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400">
                        {cat.category_name_en || '—'}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 tabular-nums">
                          <Package className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                          <span>{count} منتجات</span>
                          <span className="text-[10px] text-slate-400">({activeCount} نشط)</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل التصنيف"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button (with rule: disabled or warned if linked) */}
                          <button
                            onClick={() => {
                              setDeleteErrorMessage('');
                              if (count > 0) {
                                setDeleteErrorMessage(
                                  `لا يمكن حذف تصنيف "${cat.category_name}" لأنه مرتبط بـ (${count}) منتجات (بما فيها المنتجات المخفية). يرجى نقل أو تعديل المنتجات أولاً.`
                                );
                              } else {
                                setCategoryToDelete(cat);
                              }
                            }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              count > 0
                                ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                : 'border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            }`}
                            title={count > 0 ? 'مرتبط بمنتجات - لا يمكن الحذف' : 'حذف التصنيف غير المستخدم'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-right space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  إضافة تصنيف جديد
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs font-bold text-rose-700">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    اسم التصنيف (عربي) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="مثال: شاشات الحواسيب"
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم بالإنجليزية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={newCatNameEn}
                    onChange={e => setNewCatNameEn(e.target.value)}
                    placeholder="Monitors"
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-hidden font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    وصف مختصر
                  </label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    placeholder="وصف للأجهزة المندرجة تحت هذا القسم..."
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    حفظ وإضافة التصنيف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-right space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  تعديل اسم وبيانات التصنيف
                </h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs font-bold text-rose-700">
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    اسم التصنيف (عربي) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={e => setEditCatName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم بالإنجليزية
                  </label>
                  <input
                    type="text"
                    value={editCatNameEn}
                    onChange={e => setNewCatNameEn(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-hidden font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الوصف
                  </label>
                  <textarea
                    rows={2}
                    value={editCatDesc}
                    onChange={e => setEditCatDesc(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Category Confirmation Modal */}
        <ConfirmModal
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="تأكيد حذف التصنيف"
          message={`هل أنت متأكد من حذف التصنيف "${categoryToDelete?.category_name}"؟ هذا الإجراء نهائي.`}
          confirmText="نعم، حذف التصنيف"
          cancelText="تراجع"
          isDestructive={true}
        />

      </div>
    </AdminLayout>
  );
};
