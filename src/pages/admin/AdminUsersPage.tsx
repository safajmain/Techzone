import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { User, Order } from '../../types';
import {
  Users,
  Search,
  Eye,
  Calendar,
  Mail,
  ShoppingBag,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { users, orders } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Filter ONLY customer accounts (Exclude Admin accounts as required!)
  const customerList = useMemo(() => {
    return users.filter(u => u.role === 'customer');
  }, [users]);

  // Filtered by search query (name or email)
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customerList;
    const q = searchQuery.toLowerCase().trim();
    return customerList.filter(
      u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [customerList, searchQuery]);

  // Customer orders calculation
  const getCustomerOrders = (userId: string): Order[] => {
    return orders.filter(o => o.user_id === userId);
  };

  return (
    <AdminLayout
      title="إدارة الزبائن والمستخدمين"
      subtitle="سجل حسابات الزبائن المسجلين وإحصائيات طلباتهم (واجهة عرض وقراءة فقط)"
    >
      <div className="space-y-6 text-right">
        
        {/* Search Bar & Total Counter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="ابحث باسم الزبون أو بريده الإلكتروني..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="text-xs text-slate-500 font-semibold tabular-nums">
            إجمالي الزبائن: ({filteredCustomers.length})
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold">
                  <th className="py-3 px-6">اسم الزبون الكامل</th>
                  <th className="py-3 px-6">البريد الإلكتروني</th>
                  <th className="py-3 px-6">تاريخ التسجيل</th>
                  <th className="py-3 px-6">إجمالي الطلبات</th>
                  <th className="py-3 px-6 text-center">عرض السجل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCustomers.map(customer => {
                  const custOrders = getCustomerOrders(customer.user_id);

                  return (
                    <tr
                      key={customer.user_id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                            {customer.full_name.charAt(0)}
                          </div>
                          <span>{customer.full_name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400">
                        {customer.email}
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {new Date(customer.created_at).toLocaleDateString('ar-JO')}
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 tabular-nums">
                          <ShoppingBag className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                          <span>{custOrders.length} طلبات</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="عرض تفاصيل الزبون وسجل طلباته"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-right space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {selectedCustomer.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedCustomer.full_name}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono">{selectedCustomer.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Info Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">معرف الزبون (User ID):</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedCustomer.user_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">تاريخ الانضمام:</span>
                  <span>{new Date(selectedCustomer.created_at).toLocaleDateString('ar-JO')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">إجمالي الطلبات المسجلة:</span>
                  <span className="font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
                    {getCustomerOrders(selectedCustomer.user_id).length} طلب
                  </span>
                </div>
              </div>

              {/* Customer Orders History */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  سجل طلبات هذا الزبون:
                </h4>
                {getCustomerOrders(selectedCustomer.user_id).length === 0 ? (
                  <div className="p-4 border rounded-xl text-center text-xs text-slate-400">
                    لم يقم هذا الزبون بإنشاء أي طلبات حتى الآن.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl border-slate-100 dark:border-slate-800 overflow-hidden max-h-48 overflow-y-auto">
                    {getCustomerOrders(selectedCustomer.user_id).map(order => (
                      <div
                        key={order.order_id}
                        className="p-3 flex items-center justify-between bg-white dark:bg-slate-900 text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">#{order.order_id}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(order.created_at).toLocaleDateString('ar-JO')} — {order.city}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
                            {order.total_amount} د.أ
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
