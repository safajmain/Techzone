import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CheckCircle2,
  Truck,
  ShieldCheck,
  CreditCard,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    currentUser,
    enrichedCart,
    cartTotal,
    placeOrder,
    navigate
  } = useStore();

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!currentUser) {
      navigate('login', { fromCheckout: true });
    }
  }, [currentUser, navigate]);

  // Delivery form state
  const [recipientName, setRecipientName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState('0791234567');
  const [city, setCity] = useState('عمّان');
  const [fullAddress, setFullAddress] = useState('الشميساني - شارع الأمير شاكر - بناية 12');
  const [orderNotes, setOrderNotes] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const jordanianCities = [
    'عمّان',
    'إربد',
    'الزرقاء',
    'العقبة',
    'السلط',
    'مادبا',
    'المفرق',
    'جرش',
    'عجلون',
    'الكرك',
    'الطفيلة',
    'معان'
  ];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!recipientName.trim()) {
      setFormError('يرجى إدخال اسم المستلم.');
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      setFormError('يرجى إدخال رقم هاتف صحيح للتواصل والتسليم (مثال: 0791234567).');
      return;
    }

    if (!fullAddress.trim()) {
      setFormError('يرجى إدخال العنوان التفصيلي بدقة (الشارع، الحي، المعلم القريب).');
      return;
    }

    setIsSubmitting(true);

    const result = placeOrder({
      recipient_name: recipientName,
      phone,
      city,
      full_address: fullAddress,
      order_notes: orderNotes
    });

    setIsSubmitting(false);

    if (result.success && result.orderId) {
      setCompletedOrderId(result.orderId);
    } else {
      setFormError(result.message || 'حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة ثانية.');
    }
  };

  // Confirmation Success View
  if (completedOrderId) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0B1120] text-right">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            تم استلام وتأكيد طلبك بنجاح!
          </h2>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-right">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">رقم الطلب:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-sm">
                #{completedOrderId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">حالة الطلب:</span>
              <span className="font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                قيد الانتظار (Pending)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">طريقة الدفع:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">الدفع عند الاستلام</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            سنقوم بالتواصل معك هاتفياً على الرقم <strong className="text-slate-800 dark:text-slate-200" dir="ltr">{phone}</strong> قبل إرسال المندوب لتأكيد موعد التسليم.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('my-orders')}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              عرض طلباتي (My Orders)
            </button>
            <button
              onClick={() => navigate('products')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              متابعة التسوق
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prevent accessing checkout if cart is empty
  if (enrichedCart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#0B1120]">
        <h2 className="text-xl font-bold mb-3">سلة التسوق فارغة</h2>
        <p className="text-xs text-slate-500 mb-6">يرجى إضافة منتجات إلى السلة أولاً قبل إتمام الطلب.</p>
        <button
          onClick={() => navigate('products')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          تصفح المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 text-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            إتمام الطلب وبيانات التوصيل
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            أدخل معلومات التوصيل في الأردن لتأكيد الطلب بنظام الدفع عند الاستلام
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Delivery Form (Right on RTL) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-right space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Truck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>عنوان ومعلومات المستلم</span>
            </h2>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recipient Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  اسم المستلم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="الاسم الرباعي للمستلم"
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  يمكن تعديل اسم المستلم دون التأثير على اسم حسابك الشخصي
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  رقم الهاتف (للتواصل عند التسليم) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="079XXXXXXX"
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden font-mono text-right"
                />
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المحافظة / المدينة <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
              >
                {jordanianCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                العنوان التفصيلي <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={fullAddress}
                onChange={e => setFullAddress(e.target.value)}
                placeholder="المنطقة، اسم الشارع، رقم العمارة أو الشقة، معلم مميز قريب..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
              />
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ملاحظات إضافية للتوصيل (اختياري)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الوصول بربع ساعة"
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-hidden"
              />
            </div>

            {/* Payment Method Specification */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                طريقة الدفع المعتمدة:
              </h3>
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      الدفع عند الاستلام (Cash on Delivery)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      ادفع نقداً لمندوب التوصيل بعد استلام ومعاينة أجهزتك
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  بدون رسوم إضافية
                </span>
              </div>
            </div>

          </div>

          {/* Order Summary Module (Left on RTL) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-24 text-right space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>ملخص المنتجات</span>
              <span className="text-xs font-normal text-slate-400">({enrichedCart.length}) عناصر</span>
            </h2>

            {/* Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {enrichedCart.map(item => (
                <div key={item.variant_id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.primaryImage}
                      alt={item.product.product_name}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {item.product.product_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.variant.color_name} × <strong className="tabular-nums">{item.quantity}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 tabular-nums shrink-0">
                    {item.subtotal} د.أ
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">{cartTotal} د.أ</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>أجور الشحن والتوصيل:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">0 د.أ (توصيل مجاني)</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">المجموع النهائي:</span>
                <span className="text-2xl font-black text-blue-600 dark:text-cyan-400 tabular-nums">
                  {cartTotal} د.أ
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <PackageCheck className="w-5 h-5" />
              <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب (الدفع عند الاستلام)'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('cart')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              العودة إلى سلة التسوق لتعديل الكميات
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
