import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { ConfirmModal } from '../../components/common/Modal';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  ArrowLeft,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const {
    currentUser,
    orders,
    orderItems,
    cancelOrder,
    isOrderCancellableByCustomer,
    navigate
  } = useStore();

  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Authenticated customer check
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#0B1120]">
        <h2 className="text-xl font-bold mb-3">يجب تسجيل الدخول لمشاهدة طلباتك</h2>
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  // Active customer orders ONLY: Pending, Processing, Shipped (Delivered and Cancelled are hidden)
  const activeOrders = orders.filter(
    o => o.user_id === currentUser.user_id &&
         (o.order_status === 'Pending' || o.order_status === 'Processing' || o.order_status === 'Shipped')
  );

  const getStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>قيد الانتظار</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>قيد التجهيز</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-900 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>تم الشحن للمندوب</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleConfirmCancel = () => {
    if (!orderToCancel) return;
    cancelOrder(orderToCancel.order_id, 'customer');
    setOrderToCancel(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              طلباتي النشطة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              متابعة حالة الطلبات الحالية قيد التجهيز والشحن
            </p>
          </div>
          <button
            onClick={() => navigate('products')}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            تصفح المتجر
          </button>
        </div>

        {/* Orders list or empty state */}
        {activeOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              لا توجد لديك طلبات نشطة حاليًا
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              تظهر هنا الطلبات الجارية فقط (قيد الانتظار، قيد التجهيز، أو تم الشحن). عند اكتمال تسليم الطلب يتم أرشفته بنجاح.
            </p>
            <button
              onClick={() => navigate('products')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
            >
              <span>تصفح المنتجات والتسوق</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOrders.map(order => {
              const items = orderItems.filter(i => i.order_id === order.order_id);
              const isCancellable = isOrderCancellableByCustomer(order);

              // Calculate time remaining for cancellation if Pending
              const orderTime = new Date(order.created_at).getTime();
              const elapsedMinutes = Math.floor((Date.now() - orderTime) / (60 * 1000));
              const remainingMinutes = Math.max(0, 120 - elapsedMinutes);

              return (
                <div
                  key={order.order_id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden text-right"
                >
                  {/* Order Card Header */}
                  <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">رقم الطلب</div>
                        <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                          #{order.order_id}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-[11px] text-slate-400">تاريخ الطلب</div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {new Date(order.created_at).toLocaleDateString('ar-JO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div className="mr-2">
                        {getStatusBadge(order.order_status)}
                      </div>
                    </div>
                  </div>

                  {/* Order Preview Items */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {items.map(item => (
                        <div key={item.order_item_id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {item.image_snapshot && (
                              <img
                                src={item.image_snapshot}
                                alt={item.product_name_snapshot}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {item.product_name_snapshot}
                              </h4>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                اللون: {item.color_snapshot} | الكمية: <strong className="tabular-nums">{item.quantity}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                            {item.subtotal} د.أ
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Address Snapshot */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        المستلم: <strong>{order.recipient_name}</strong> ({order.phone}) — {order.city}، {order.full_address}
                      </div>
                      <div className="text-[11px] text-slate-400 font-semibold">
                        طريقة الدفع: الدفع عند الاستلام
                      </div>
                    </div>
                  </div>

                  {/* Order Card Footer & Actions */}
                  <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400">المجموع الكلي:</span>
                      <span className="text-xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                        {order.total_amount} د.أ
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Cancellation eligibility button */}
                      {isCancellable ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setOrderToCancel(order)}
                            className="px-4 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>إلغاء الطلب</span>
                          </button>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            (متاح لمدة {remainingMinutes} دقيقة)
                          </span>
                        </div>
                      ) : order.order_status === 'Pending' ? (
                        <span className="text-[11px] text-slate-400">
                          انتهت مهلة الإلغاء (أكثر من ساعتين)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          لا يمكن إلغاء الطلب بعد دخوله مرحلة المعالجة
                        </span>
                      )}

                      <button
                        onClick={() => navigate('order-details', { orderId: order.order_id })}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>تفاصيل كاملة</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Cancel Order Confirmation Modal */}
      <ConfirmModal
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="تأكيد إلغاء الطلب"
        message={`هل أنت متأكد من رغبتك في إلغاء الطلب #${orderToCancel?.order_id}؟ سيتم إرجاع جميع القطع المحجوزة فوراً إلى مخزون المتجر وإلغاء إرسال الشحنة.`}
        confirmText="نعم، إلغاء الطلب الآن"
        cancelText="تراجع"
        isDestructive={true}
      />
    </div>
  );
};
