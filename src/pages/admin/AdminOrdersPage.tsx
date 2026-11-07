import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ConfirmModal } from '../../components/common/Modal';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  User,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    orderItems,
    updateOrderStatus,
    cancelOrder
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected order for details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update confirmation modal
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    order: Order;
    nextStatus: OrderStatus;
  } | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (statusFilter !== 'all' && order.order_status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.order_id.toLowerCase().includes(q);
        const matchesName = order.recipient_name.toLowerCase().includes(q);
        const matchesPhone = order.phone.includes(q);
        const matchesCity = order.city.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesPhone && !matchesCity) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
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

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;
    updateOrderStatus(pendingStatusChange.order.order_id, pendingStatusChange.nextStatus);
    // If the modal was currently viewing this order, update it too
    if (selectedOrder?.order_id === pendingStatusChange.order.order_id) {
      setSelectedOrder(prev => (prev ? { ...prev, order_status: pendingStatusChange.nextStatus } : null));
    }
    setPendingStatusChange(null);
  };

  return (
    <AdminLayout
      title="إدارة كافة طلبات المتجر"
      subtitle="متابعة وتحديث حالات الطلبات، إلغاء الطلبات وإرجاع المخزون، وأرشفة الطلبات المسلمة"
    >
      <div className="space-y-6 text-right">
        
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                placeholder="ابحث برقم الطلب، اسم المستلم، أو الهاتف..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              />
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden font-semibold"
            >
              <option value="all">كافة الحالات (All Orders)</option>
              <option value="Pending">قيد الانتظار (Pending)</option>
              <option value="Processing">قيد التجهيز (Processing)</option>
              <option value="Shipped">تم الشحن (Shipped)</option>
              <option value="Delivered">مكتمل التسليم (Delivered)</option>
              <option value="Cancelled">ملغي (Cancelled)</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-semibold tabular-nums">
            إجمالي الطلبات المعروضة: ({filteredOrders.length})
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold">
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">الزبون المستلم</th>
                  <th className="py-3 px-4">المدينة والهاتف</th>
                  <th className="py-3 px-4">تاريخ الطلب</th>
                  <th className="py-3 px-4">المبلغ الإجمالي</th>
                  <th className="py-3 px-4">الحالة الحالية</th>
                  <th className="py-3 px-4 text-center">ترقية الحالة / إلغاء</th>
                  <th className="py-3 px-4 text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map(order => {
                  const isPending = order.order_status === 'Pending';
                  const isProcessing = order.order_status === 'Processing';
                  const isShipped = order.order_status === 'Shipped';
                  const isFinal = order.order_status === 'Delivered' || order.order_status === 'Cancelled';

                  return (
                    <tr
                      key={order.order_id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        #{order.order_id}
                      </td>

                      {/* Recipient */}
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {order.recipient_name}
                      </td>

                      {/* City & Phone */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <div>{order.city}</div>
                        <div className="font-mono text-[11px]" dir="ltr">{order.phone}</div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500">
                        <div>{new Date(order.created_at).toLocaleDateString('ar-JO')}</div>
                        <div className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleTimeString('ar-JO')}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                        {order.total_amount} د.أ
                      </td>

                      {/* Current Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(order.order_status)}
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() =>
                                  setPendingStatusChange({
                                    order,
                                    nextStatus: 'Processing'
                                  })
                                }
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                                title="تحويل الطلب إلى قيد التجهيز (Processing)"
                              >
                                تجهيز الطلب
                              </button>
                              <button
                                onClick={() =>
                                  setPendingStatusChange({
                                    order,
                                    nextStatus: 'Cancelled'
                                  })
                                }
                                className="px-2 py-1 text-[11px] font-bold rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="إلغاء الطلب من قبل الإدارة وإرجاع المخزون"
                              >
                                إلغاء
                              </button>
                            </>
                          )}

                          {isProcessing && (
                            <button
                              onClick={() =>
                                setPendingStatusChange({
                                  order,
                                  nextStatus: 'Shipped'
                                })
                              }
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-xs"
                              title="تسليم الشحنة لمندوب التوصيل (Shipped)"
                            >
                              شحن مع المندوب
                            </button>
                          )}

                          {isShipped && (
                            <button
                              onClick={() =>
                                setPendingStatusChange({
                                  order,
                                  nextStatus: 'Delivered'
                                })
                              }
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                              title="تأكيد اكتمال التسليم للزبون واستلام المبلغ (Delivered)"
                            >
                              تأكيد التسليم
                            </button>
                          )}

                          {isFinal && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              حالة نهائية
                            </span>
                          )}
                        </div>
                      </td>

                      {/* View Details Modal Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="عرض تفاصيل الطلب كاملة"
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

        {/* Order Full Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-right space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    #{selectedOrder.order_id}
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

              {/* Delivery Data */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                <div>الزبون المستلم: <strong>{selectedOrder.recipient_name}</strong></div>
                <div>رقم الهاتف: <strong dir="ltr">{selectedOrder.phone}</strong></div>
                <div>العنوان: <strong>{selectedOrder.city} — {selectedOrder.full_address}</strong></div>
                {selectedOrder.order_notes && <div>ملاحظات الزبون: <em>"{selectedOrder.order_notes}"</em></div>}
                <div>طريقة الدفع: <strong>الدفع عند الاستلام (COD)</strong></div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  عناصر الطلب وسجل الأسعار المحفوظ (Snapshots):
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl border-slate-100 dark:border-slate-800 overflow-hidden max-h-48 overflow-y-auto">
                  {orderItems
                    .filter(i => i.order_id === selectedOrder.order_id)
                    .map(item => (
                      <div key={item.order_item_id} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900 text-xs">
                        <div className="flex items-center gap-2.5">
                          {item.image_snapshot && (
                            <img
                              src={item.image_snapshot}
                              alt={item.product_name_snapshot}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{item.product_name_snapshot}</div>
                            <div className="text-[11px] text-slate-400">اللون: {item.color_snapshot} × {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-bold text-blue-600 dark:text-cyan-400 tabular-nums">
                          {item.subtotal} د.أ
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">المجموع الكلي:</span>
                <span className="text-xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                  {selectedOrder.total_amount} د.أ
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Transition Confirmation Modal */}
        <ConfirmModal
          isOpen={!!pendingStatusChange}
          onClose={() => setPendingStatusChange(null)}
          onConfirm={handleConfirmStatusChange}
          title="تأكيد تحديث حالة الطلب"
          message={
            pendingStatusChange?.nextStatus === 'Cancelled'
              ? `هل أنت متأكد من إلغاء الطلب #${pendingStatusChange?.order.order_id}؟ سيتم إرجاع كافة الكميات المحجوزة تلقائياً إلى المخزون المتاح.`
              : `هل تريد تغيير حالة الطلب #${pendingStatusChange?.order.order_id} إلى "${pendingStatusChange?.nextStatus}"؟`
          }
          confirmText="تأكيد التحديث"
          cancelText="تراجع"
          isDestructive={pendingStatusChange?.nextStatus === 'Cancelled'}
        />

      </div>
    </AdminLayout>
  );
};
