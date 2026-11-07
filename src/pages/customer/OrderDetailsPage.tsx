import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../../components/common/Modal';
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  FileText
} from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const {
    navigation,
    navigate,
    currentUser,
    orders,
    orderItems,
    cancelOrder,
    isOrderCancellableByCustomer
  } = useStore();

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const orderId = navigation.params?.orderId;
  const order = orders.find(o => o.order_id === orderId);

  // Security check: Must be authenticated customer, must own the order, and must be ACTIVE order
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#0B1120]">
        <h2 className="text-xl font-bold mb-3">يجب تسجيل الدخول لمشاهدة تفاصيل الطلب</h2>
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  // If order not found, or not owned by user, or inactive (Delivered/Cancelled) for customer
  const isOwner = order && order.user_id === currentUser.user_id;
  const isActiveStatus = order && (order.order_status === 'Pending' || order.order_status === 'Processing' || order.order_status === 'Shipped');

  if (!order || !isOwner || !isActiveStatus) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#0B1120]">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
          الطلب غير متاح للعرض
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          وفقاً لقواعد النظام، تقتصر شاشة تفاصيل الطلبات للزبائن على الطلبات النشطة فقط. الطلبات المكتملة أو الملغية يتم حفظها في أرشيف الإدارة.
        </p>
        <button
          onClick={() => navigate('my-orders')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          العودة إلى طلباتي النشطة
        </button>
      </div>
    );
  }

  const items = orderItems.filter(i => i.order_id === order.order_id);
  const isCancellable = isOrderCancellableByCustomer(order);

  const handleConfirmCancel = () => {
    cancelOrder(order.order_id, 'customer');
    setConfirmCancelOpen(false);
    navigate('my-orders');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <div className="mb-6 text-right">
          <button
            onClick={() => navigate('my-orders')}
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى قائمة طلباتي</span>
          </button>
        </div>

        {/* Order Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs mb-8 text-right space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-400">تفاصيل الطلب</div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                #{order.order_id}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.order_status === 'Pending'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                  : order.order_status === 'Processing'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
                  : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200'
              }`}>
                {order.order_status === 'Pending' ? 'قيد الانتظار' : order.order_status === 'Processing' ? 'قيد التجهيز' : 'تم الشحن'}
              </span>

              {isCancellable && (
                <button
                  onClick={() => setConfirmCancelOpen(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إلغاء الطلب</span>
                </button>
              )}
            </div>
          </div>

          {/* Meta details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>تاريخ الطلب: <strong>{new Date(order.created_at).toLocaleDateString('ar-JO')}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>الوقت: <strong>{new Date(order.created_at).toLocaleTimeString('ar-JO')}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <CreditCard className="w-4 h-4 text-cyan-500" />
              <span>طريقة الدفع: <strong>الدفع عند الاستلام</strong></span>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              المنتجات المطلوبة ({items.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl border-slate-100 dark:border-slate-800 overflow-hidden">
              {items.map(item => (
                <div key={item.order_item_id} className="p-4 flex items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-800/20">
                  <div className="flex items-center gap-3">
                    {item.image_snapshot && (
                      <img
                        src={item.image_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.product_name_snapshot}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        اللون المختار: <strong>{item.color_snapshot}</strong>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        سعر الوحدة: <span className="tabular-nums font-semibold">{item.unit_price} د.أ</span> × <span className="tabular-nums font-semibold">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                    {item.subtotal} د.أ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Recipient Details Box */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              بيانات التوصيل والمستلم
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>اسم المستلم: <strong>{order.recipient_name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>رقم الهاتف: <strong dir="ltr">{order.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>العنوان: <strong>{order.city} — {order.full_address}</strong></span>
              </div>
              {order.order_notes && (
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>ملاحظات الطلب: <em>"{order.order_notes}"</em></span>
                </div>
              )}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">المبلغ الإجمالي المستحق عند الاستلام</span>
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                {order.total_amount} د.أ
              </span>
            </div>
            <div className="text-left text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              شحن مجاني (0 د.أ)
            </div>
          </div>

        </div>

      </div>

      <ConfirmModal
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="تأكيد إلغاء الطلب"
        message={`هل أنت متأكد من إلغاء الطلب #${order.order_id}؟ سيتم إرجاع كميات المنتجات إلى المخزون تلقائياً.`}
        confirmText="تأكيد الإلغاء"
        cancelText="تراجع"
        isDestructive={true}
      />
    </div>
  );
};
