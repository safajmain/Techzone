import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Order } from '../../types';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle,
  Truck,
  RotateCcw,
  X
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    orderItems,
    users,
    variants,
    navigate
  } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Statistics calculation
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;

  // IMPORTANT: Total Sales must include ONLY Delivered orders!
  const totalSales = orders
    .filter(o => o.order_status === 'Delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  // Recent 6 Orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  // Low Stock Alerts: Product variants with stock_quantity <= 5 units
  const lowStockVariants = variants
    .filter(v => v.stock_quantity <= 5)
    .map(v => {
      const p = products.find(prod => prod.product_id === v.product_id);
      return {
        variant: v,
        productName: p ? p.product_name : 'منتج غير معروف',
        productActive: p ? p.is_active : false,
        stock: v.stock_quantity
      };
    })
    .sort((a, b) => a.stock - b.stock);

  const getStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">قيد الانتظار (Pending)</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">قيد التجهيز (Processing)</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200">تم الشحن (Shipped)</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">مكتمل التسليم (Delivered)</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200">ملغي (Cancelled)</span>;
    }
  };

  return (
    <AdminLayout
      title="لوحة التحكم الرئيسية"
      subtitle="نظرة عامة حية على أداء المتجر، المبيعات الفعلية، وتنبيهات المخزون الفوري"
    >
      <div className="space-y-8 text-right">
        
        {/* KPI Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Total Sales (Delivered only) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                إجمالي المبيعات المستلمة
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {totalSales} <span className="text-base font-normal text-slate-400">د.أ</span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                (يشمل الطلبات المسلّمة فقط)
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Total Orders */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                إجمالي الطلبات
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {totalOrders}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                كافة الحالات المسجلة
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Total Products */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                إجمالي المنتجات
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {totalProducts}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {products.filter(p => p.is_active).length} نشط في الواجهة
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Total Customers */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                حسابات الزبائن
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {totalCustomers}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                زبائن مسجلين بالنظام
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* 2-Column Section: Recent Orders & Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Recent Orders Table (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                أحدث الطلبات الواردة
              </h2>
              <button
                onClick={() => navigate('admin-orders')}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                عرض كافة الطلبات
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">رقم الطلب</th>
                    <th className="py-2.5 px-3">الزبون المستلم</th>
                    <th className="py-2.5 px-3">التاريخ</th>
                    <th className="py-2.5 px-3">المبلغ</th>
                    <th className="py-2.5 px-3">الحالة</th>
                    <th className="py-2.5 px-3 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map(order => (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        #{order.order_id}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {order.recipient_name}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('ar-JO')}
                      </td>
                      <td className="py-3 px-3 font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
                        {order.total_amount} د.أ
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(order.order_status)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="عرض تفاصيل الطلب"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts (4 cols on desktop) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  تنبيهات انخفاض المخزون
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[10px] font-bold tabular-nums">
                {lowStockVariants.length} تنبيه
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              القطع المتبقية في المخزون بمقدار 5 وحدات أو أقل:
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {lowStockVariants.map(({ variant, productName, stock }) => {
                const isZero = stock === 0;

                return (
                  <div
                    key={variant.variant_id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      isZero
                        ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30'
                        : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {productName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        اللون: {variant.color_name}
                      </div>
                    </div>

                    <div className="shrink-0 text-left">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold tabular-nums ${
                        isZero
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {isZero ? 'نفد (0)' : `${stock} قطع`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Order Details Modal for Admin Dashboard */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-right space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    تفاصيل الطلب #{selectedOrder.order_id}
                  </h3>
                  {getStatusBadge(selectedOrder.order_status)}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <div>المستلم: <strong>{selectedOrder.recipient_name}</strong></div>
                  <div>الهاتف: <strong dir="ltr">{selectedOrder.phone}</strong></div>
                  <div>العنوان: <strong>{selectedOrder.city} — {selectedOrder.full_address}</strong></div>
                  {selectedOrder.order_notes && <div>ملاحظات: <em>"{selectedOrder.order_notes}"</em></div>}
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">المنتجات:</h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-xl overflow-hidden">
                    {orderItems
                      .filter(i => i.order_id === selectedOrder.order_id)
                      .map(item => (
                        <div key={item.order_item_id} className="p-2.5 flex items-center justify-between bg-white dark:bg-slate-900">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{item.product_name_snapshot}</div>
                            <div className="text-[11px] text-slate-400">{item.color_snapshot} × {item.quantity}</div>
                          </div>
                          <div className="font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
                            {item.subtotal} د.أ
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-sm font-bold">
                  <span>المبلغ الإجمالي:</span>
                  <span className="text-xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                    {selectedOrder.total_amount} د.أ
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    navigate('admin-orders');
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white"
                >
                  الذهاب إلى إدارة الطلبات لتعديل الحالة
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
