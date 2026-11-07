import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Order,
  OrderItem,
  CartItem,
  NavigationState,
  NavigationPage,
  OrderStatus,
  ToastMessage
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_VARIANTS,
  INITIAL_IMAGES,
  INITIAL_ORDERS,
  INITIAL_ORDER_ITEMS
} from '../data/initialData';

export interface EnrichedCartItem {
  variant_id: string;
  product_id: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
  primaryImage: string;
  unit_price: number;
  subtotal: number;
  isAvailable: boolean;
  maxAvailable: number;
  hasStockIssue: boolean;
}

interface StoreContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Navigation
  navigation: NavigationState;
  navigate: (page: NavigationPage, params?: NavigationState['params']) => void;

  // Auth
  currentUser: User | null;
  login: (email: string, password?: string) => { success: boolean; message?: string; role?: string };
  register: (fullName: string, email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (fullName: string, email: string) => { success: boolean; message?: string };
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message?: string };

  // Data collections
  products: Product[];
  categories: Category[];
  variants: ProductVariant[];
  images: ProductImage[];
  orders: Order[];
  orderItems: OrderItem[];
  users: User[];

  // Admin Product Actions
  addProduct: (
    productData: Omit<Product, 'product_id' | 'created_at' | 'updated_at'>,
    images: { image_path: string; is_primary: boolean }[],
    variants: { color_name: string; color_hex?: string; stock_quantity: number }[]
  ) => { success: boolean; productId?: string; message?: string };
  updateProduct: (
    productId: string,
    productData: Partial<Product>,
    images: { image_id?: string; image_path: string; is_primary: boolean }[],
    variants: { variant_id?: string; color_name: string; color_hex?: string; stock_quantity: number }[]
  ) => { success: boolean; message?: string };
  toggleProductActive: (productId: string) => void;

  // Admin Category Actions
  addCategory: (categoryName: string, categoryNameEn?: string, description?: string) => { success: boolean; message?: string };
  updateCategory: (categoryId: string, categoryName: string, categoryNameEn?: string, description?: string) => { success: boolean; message?: string };
  deleteCategory: (categoryId: string) => { success: boolean; message?: string };

  // Cart Actions
  cart: CartItem[];
  addToCart: (productId: string, variantId: string, quantity: number) => { success: boolean; message: string };
  updateCartQuantity: (variantId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  enrichedCart: EnrichedCartItem[];
  cartCount: number;
  cartTotal: number;

  // Order Actions
  placeOrder: (deliveryData: {
    recipient_name: string;
    phone: string;
    city: string;
    full_address: string;
    order_notes?: string;
  }) => { success: boolean; orderId?: string; message?: string };
  cancelOrder: (orderId: string, byRole: 'customer' | 'admin') => { success: boolean; message?: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => { success: boolean; message?: string };

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Helpers
  getProductPrimaryImage: (productId: string) => string;
  getProductImages: (productId: string) => ProductImage[];
  getProductVariants: (productId: string) => ProductVariant[];
  getProductCategory: (categoryId: string) => Category | undefined;
  getProductTotalStock: (productId: string) => number;
  isOrderCancellableByCustomer: (order: Order) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Storage helper functions
const getStored = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const setStored = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('techzone_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('techzone_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('techzone_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Navigation state (stored in sessionStorage for clean reload)
  const [navigation, setNavigationState] = useState<NavigationState>(() => {
    try {
      const saved = sessionStorage.getItem('techzone_nav');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { page: 'home' };
  });

  const navigate = (page: NavigationPage, params?: NavigationState['params']) => {
    const newState: NavigationState = { page, params };
    setNavigationState(newState);
    sessionStorage.setItem('techzone_nav', JSON.stringify(newState));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Master demo data persistence
  const [users, setUsers] = useState<User[]>(() => getStored('techzone_users', INITIAL_USERS));
  const [categories, setCategories] = useState<Category[]>(() => getStored('techzone_categories', INITIAL_CATEGORIES));
  const [products, setProducts] = useState<Product[]>(() => getStored('techzone_products', INITIAL_PRODUCTS));
  const [variants, setVariants] = useState<ProductVariant[]>(() => getStored('techzone_variants', INITIAL_VARIANTS));
  const [images, setImages] = useState<ProductImage[]>(() => getStored('techzone_images', INITIAL_IMAGES));
  const [orders, setOrders] = useState<Order[]>(() => getStored('techzone_orders', INITIAL_ORDERS));
  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => getStored('techzone_order_items', INITIAL_ORDER_ITEMS));

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('techzone_current_user', null));

  // Cart state (session/local persistent)
  const [cart, setCart] = useState<CartItem[]>(() => getStored('techzone_cart', []));

  // Sync state to localStorage whenever it changes
  useEffect(() => { setStored('techzone_users', users); }, [users]);
  useEffect(() => { setStored('techzone_categories', categories); }, [categories]);
  useEffect(() => { setStored('techzone_products', products); }, [products]);
  useEffect(() => { setStored('techzone_variants', variants); }, [variants]);
  useEffect(() => { setStored('techzone_images', images); }, [images]);
  useEffect(() => { setStored('techzone_orders', orders); }, [orders]);
  useEffect(() => { setStored('techzone_order_items', orderItems); }, [orderItems]);
  useEffect(() => { setStored('techzone_current_user', currentUser); }, [currentUser]);
  useEffect(() => { setStored('techzone_cart', cart); }, [cart]);

  // Helpers
  const getProductPrimaryImage = (productId: string): string => {
    const productImgs = images.filter(img => img.product_id === productId);
    const primary = productImgs.find(img => img.is_primary);
    if (primary) return primary.image_path;
    if (productImgs.length > 0) return productImgs[0].image_path;
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  };

  const getProductImages = (productId: string): ProductImage[] => {
    return images.filter(img => img.product_id === productId);
  };

  const getProductVariants = (productId: string): ProductVariant[] => {
    return variants.filter(v => v.product_id === productId);
  };

  const getProductCategory = (categoryId: string): Category | undefined => {
    return categories.find(c => c.category_id === categoryId);
  };

  const getProductTotalStock = (productId: string): number => {
    const vars = variants.filter(v => v.product_id === productId);
    return vars.reduce((sum, v) => sum + v.stock_quantity, 0);
  };

  const isOrderCancellableByCustomer = (order: Order): boolean => {
    if (order.order_status !== 'Pending') return false;
    const createdAtTime = new Date(order.created_at).getTime();
    const now = Date.now();
    const diffHours = (now - createdAtTime) / (1000 * 60 * 60);
    return diffHours <= 2;
  };

  // Auth operations
  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'البريد الإلكتروني غير مسجل لدينا.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, message: 'كلمة المرور غير صحيحة.' };
    }

    setCurrentUser(user);
    addToast({
      type: 'success',
      title: 'تم تسجيل الدخول بنجاح',
      message: `مرحباً بك مجدداً، ${user.full_name}`
    });

    return { success: true, role: user.role };
  };

  const register = (fullName: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!fullName.trim() || !cleanEmail || !password) {
      return { success: false, message: 'يرجى تعبئة جميع الحقول المطلوبة.' };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'صيغة البريد الإلكتروني غير صحيحة.' };
    }

    if (password.length < 8) {
      return { success: false, message: 'يجب ألا تقل كلمة المرور عن 8 أحرف.' };
    }

    const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول.' };
    }

    const newUser: User = {
      user_id: 'usr_' + Date.now(),
      role: 'customer',
      full_name: fullName.trim(),
      email: cleanEmail,
      password: password,
      created_at: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    addToast({
      type: 'success',
      title: 'تم إنشاء الحساب بنجاح',
      message: `أهلاً بك في تيك زون، ${newUser.full_name}`
    });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'تم تسجيل الخروج',
      message: 'نراك قريباً في تيك زون!'
    });
    navigate('home');
  };

  const updateProfile = (fullName: string, email: string) => {
    if (!currentUser) return { success: false, message: 'غير مسجل الدخول' };
    const cleanEmail = email.trim().toLowerCase();

    if (!fullName.trim() || !cleanEmail) {
      return { success: false, message: 'جميع الحقول مطلوبة.' };
    }

    // Check email uniqueness excluding self
    const conflict = users.find(u => u.user_id !== currentUser.user_id && u.email.toLowerCase() === cleanEmail);
    if (conflict) {
      return { success: false, message: 'هذا البريد الإلكتروني مستخدم من قبل حساب آخر.' };
    }

    const updated = { ...currentUser, full_name: fullName.trim(), email: cleanEmail };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.user_id === currentUser.user_id ? updated : u));

    addToast({
      type: 'success',
      title: 'تم تحديث البيانات',
      message: 'تم حفظ بياناتك الشخصية بنجاح.'
    });

    return { success: true };
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!currentUser) return { success: false, message: 'غير مسجل الدخول' };

    if (currentUser.password && currentUser.password !== currentPassword) {
      return { success: false, message: 'كلمة المرور الحالية غير صحيحة.' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.' };
    }

    const updated = { ...currentUser, password: newPassword };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.user_id === currentUser.user_id ? updated : u));

    addToast({
      type: 'success',
      title: 'تم تغيير كلمة المرور',
      message: 'تم تحديث كلمة المرور بنجاح.'
    });

    return { success: true };
  };

  // Cart operations
  const addToCart = (productId: string, variantId: string, quantity: number) => {
    const product = products.find(p => p.product_id === productId);
    const variant = variants.find(v => v.variant_id === variantId);

    if (!product || !product.is_active) {
      return { success: false, message: 'هذا المنتج غير متاح للشراء حالياً.' };
    }

    if (!variant) {
      return { success: false, message: 'يرجى اختيار لون متوفر أولاً.' };
    }

    if (variant.stock_quantity <= 0) {
      return { success: false, message: 'هذا اللون غير متوفر في المخزون حالياً.' };
    }

    const existingIndex = cart.findIndex(c => c.variant_id === variantId);
    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const requestedTotal = currentQtyInCart + quantity;

    if (requestedTotal > variant.stock_quantity) {
      const remainingAddable = variant.stock_quantity - currentQtyInCart;
      if (remainingAddable <= 0) {
        return {
          success: false,
          message: `لديك بالفعل ${currentQtyInCart} قطع في السلة، وهو كامل المخزون المتوفر.`
        };
      }
      return {
        success: false,
        message: `الكمية المطلوبة غير متوفرة. المتوفر حالياً ${variant.stock_quantity} فقط.`
      };
    }

    setCart(prev => {
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], quantity: requestedTotal };
        return next;
      } else {
        return [...prev, { variant_id: variantId, product_id: productId, quantity }];
      }
    });

    addToast({
      type: 'success',
      title: 'أضيف إلى سلة التسوق',
      message: `تمت إضافة ${product.product_name} (${variant.color_name}) إلى سلتك.`
    });

    return { success: true, message: 'تمت الإضافة بنجاح' };
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    const variant = variants.find(v => v.variant_id === variantId);
    if (!variant) return { success: false, message: 'المنتج غير موجود' };

    if (quantity <= 0) {
      removeFromCart(variantId);
      return { success: true };
    }

    if (quantity > variant.stock_quantity) {
      return {
        success: false,
        message: `الكمية المطلوبة غير متوفرة. المتوفر حالياً ${variant.stock_quantity} فقط.`
      };
    }

    setCart(prev => prev.map(item => item.variant_id === variantId ? { ...item, quantity } : item));
    return { success: true };
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variant_id !== variantId));
    addToast({
      type: 'info',
      title: 'تم الحذف',
      message: 'تمت إزالة المنتج من سلة التسوق.'
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Enriched Cart computation
  const enrichedCart: EnrichedCartItem[] = cart.map(item => {
    const product = products.find(p => p.product_id === item.product_id) || {
      product_id: item.product_id,
      category_id: '',
      product_name: 'منتج غير معروف',
      brand: '',
      description: '',
      price: 0,
      is_active: false,
      created_at: '',
      updated_at: ''
    };

    const variant = variants.find(v => v.variant_id === item.variant_id) || {
      variant_id: item.variant_id,
      product_id: item.product_id,
      color_name: 'غير محدد',
      stock_quantity: 0
    };

    const primaryImage = getProductPrimaryImage(item.product_id);
    const unit_price = product.price;
    const subtotal = unit_price * item.quantity;
    const isAvailable = product.is_active && variant.stock_quantity > 0;
    const hasStockIssue = item.quantity > variant.stock_quantity || !product.is_active;

    return {
      variant_id: item.variant_id,
      product_id: item.product_id,
      quantity: item.quantity,
      product,
      variant,
      primaryImage,
      unit_price,
      subtotal,
      isAvailable,
      maxAvailable: variant.stock_quantity,
      hasStockIssue
    };
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = enrichedCart.reduce((sum, item) => sum + item.subtotal, 0);

  // Orders operations
  const placeOrder = (deliveryData: {
    recipient_name: string;
    phone: string;
    city: string;
    full_address: string;
    order_notes?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول لإتمام الطلب.' };
    }

    if (cart.length === 0) {
      return { success: false, message: 'سلة التسوق فارغة!' };
    }

    // Comprehensive Atomic recheck of stock and product visibility
    for (const item of cart) {
      const product = products.find(p => p.product_id === item.product_id);
      const variant = variants.find(v => v.variant_id === item.variant_id);

      if (!product || !product.is_active) {
        return {
          success: false,
          message: `عذراً، المنتج "${product ? product.product_name : 'غير محدد'}" لم يعد متاحاً حالياً.`
        };
      }

      if (!variant || variant.stock_quantity < item.quantity) {
        return {
          success: false,
          message: `عذراً، الكمية المتوفرة من "${product.product_name} - ${variant ? variant.color_name : ''}" غير كافية (المتوفر: ${variant ? variant.stock_quantity : 0}).`
        };
      }
    }

    // Atomic order creation
    const newOrderId = 'ord_' + Math.floor(1000 + Math.random() * 9000);
    const calculatedTotal = enrichedCart.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder: Order = {
      order_id: newOrderId,
      user_id: currentUser.user_id,
      recipient_name: deliveryData.recipient_name.trim(),
      phone: deliveryData.phone.trim(),
      city: deliveryData.city.trim(),
      full_address: deliveryData.full_address.trim(),
      order_notes: deliveryData.order_notes?.trim() || '',
      total_amount: calculatedTotal,
      payment_method: 'الدفع عند الاستلام',
      order_status: 'Pending',
      created_at: new Date().toISOString()
    };

    const newItems: OrderItem[] = enrichedCart.map((item, index) => ({
      order_item_id: `item_${newOrderId}_${index + 1}`,
      order_id: newOrderId,
      variant_id: item.variant_id,
      product_id: item.product_id,
      product_name_snapshot: item.product.product_name,
      color_snapshot: item.variant.color_name,
      image_snapshot: item.primaryImage,
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    // Atomically decrease stock for each purchased variant
    setVariants(prevVariants =>
      prevVariants.map(v => {
        const purchased = cart.find(c => c.variant_id === v.variant_id);
        if (purchased) {
          return {
            ...v,
            stock_quantity: Math.max(0, v.stock_quantity - purchased.quantity)
          };
        }
        return v;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    setOrderItems(prev => [...prev, ...newItems]);

    // Clear cart only after successful order creation
    clearCart();

    addToast({
      type: 'success',
      title: 'تم تأكيد طلبك بنجاح!',
      message: `رقم طلبك هو #${newOrderId}. سنقوم بالتواصل معك لتسليم الطلب.`
    });

    return { success: true, orderId: newOrderId };
  };

  const cancelOrder = (orderId: string, byRole: 'customer' | 'admin') => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) return { success: false, message: 'الطلب غير موجود.' };

    if (order.order_status !== 'Pending') {
      return { success: false, message: 'لا يمكن إلغاء الطلب بعد دخوله مرحلة المعالجة أو الشحن.' };
    }

    if (byRole === 'customer') {
      if (!isOrderCancellableByCustomer(order)) {
        return { success: false, message: 'انتهت المهلة المحددة لإلغاء الطلب (ساعتان من وقت الإنشاء).' };
      }
    }

    // Restore stock to all purchased variants exactly once
    const itemsToRestore = orderItems.filter(item => item.order_id === orderId);
    setVariants(prevVariants =>
      prevVariants.map(v => {
        const item = itemsToRestore.find(i => i.variant_id === v.variant_id);
        if (item) {
          return {
            ...v,
            stock_quantity: v.stock_quantity + item.quantity
          };
        }
        return v;
      })
    );

    // Update order status to Cancelled
    setOrders(prev =>
      prev.map(o => (o.order_id === orderId ? { ...o, order_status: 'Cancelled' } : o))
    );

    addToast({
      type: 'info',
      title: 'تم إلغاء الطلب',
      message: `تم إلغاء الطلب #${orderId} وإعادة الكميات إلى المخزون بنجاح.`
    });

    return { success: true };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) return { success: false, message: 'الطلب غير موجود.' };

    // Prevent changing final statuses
    if (order.order_status === 'Delivered' || order.order_status === 'Cancelled') {
      return { success: false, message: 'لا يمكن تعديل حالة طلب مكتمل أو ملغي نهائياً.' };
    }

    // Cancellation flow
    if (newStatus === 'Cancelled') {
      return cancelOrder(orderId, 'admin');
    }

    // Strict workflow validation: Pending -> Processing -> Shipped -> Delivered
    const validFlow: Record<OrderStatus, OrderStatus[]> = {
      Pending: ['Processing', 'Cancelled'],
      Processing: ['Shipped'],
      Shipped: ['Delivered'],
      Delivered: [],
      Cancelled: []
    };

    if (!validFlow[order.order_status]?.includes(newStatus)) {
      return {
        success: false,
        message: `تسلسل الحالة غير صحيح (لا يمكن الانتقال من ${order.order_status} إلى ${newStatus}).`
      };
    }

    setOrders(prev =>
      prev.map(o => (o.order_id === orderId ? { ...o, order_status: newStatus } : o))
    );

    addToast({
      type: 'success',
      title: 'تم تحديث حالة الطلب',
      message: `تم تغيير حالة الطلب #${orderId} إلى: ${newStatus}`
    });

    return { success: true };
  };

  // Admin Product Management
  const addProduct = (
    productData: Omit<Product, 'product_id' | 'created_at' | 'updated_at'>,
    newImages: { image_path: string; is_primary: boolean }[],
    newVariants: { color_name: string; color_hex?: string; stock_quantity: number }[]
  ) => {
    const productId = 'prod_' + Date.now();
    const now = new Date().toISOString();

    const createdProduct: Product = {
      ...productData,
      product_id: productId,
      created_at: now,
      updated_at: now
    };

    const createdImages: ProductImage[] = newImages.map((img, idx) => ({
      image_id: `img_${productId}_${idx + 1}`,
      product_id: productId,
      image_path: img.image_path,
      is_primary: img.is_primary,
      created_at: now
    }));

    const createdVariants: ProductVariant[] = newVariants.map((v, idx) => ({
      variant_id: `var_${productId}_${idx + 1}`,
      product_id: productId,
      color_name: v.color_name.trim(),
      color_hex: v.color_hex || '#334155',
      stock_quantity: Math.max(0, Number(v.stock_quantity) || 0)
    }));

    setProducts(prev => [createdProduct, ...prev]);
    setImages(prev => [...prev, ...createdImages]);
    setVariants(prev => [...prev, ...createdVariants]);

    addToast({
      type: 'success',
      title: 'تمت إضافة المنتج',
      message: `تمت إضافة المنتج "${createdProduct.product_name}" بنجاح.`
    });

    return { success: true, productId };
  };

  const updateProduct = (
    productId: string,
    productData: Partial<Product>,
    updatedImages: { image_id?: string; image_path: string; is_primary: boolean }[],
    updatedVariants: { variant_id?: string; color_name: string; color_hex?: string; stock_quantity: number }[]
  ) => {
    const now = new Date().toISOString();

    setProducts(prev =>
      prev.map(p => (p.product_id === productId ? { ...p, ...productData, updated_at: now } : p))
    );

    // Update images for this product
    const otherImages = images.filter(img => img.product_id !== productId);
    const newImagesList: ProductImage[] = updatedImages.map((img, idx) => ({
      image_id: img.image_id || `img_${productId}_${Date.now()}_${idx}`,
      product_id: productId,
      image_path: img.image_path,
      is_primary: img.is_primary,
      created_at: now
    }));
    setImages([...otherImages, ...newImagesList]);

    // Update variants, preserving existing variant_ids for order history integrity
    const otherVariants = variants.filter(v => v.product_id !== productId);
    const newVariantsList: ProductVariant[] = updatedVariants.map((v, idx) => ({
      variant_id: v.variant_id || `var_${productId}_${Date.now()}_${idx}`,
      product_id: productId,
      color_name: v.color_name.trim(),
      color_hex: v.color_hex || '#334155',
      stock_quantity: Math.max(0, Number(v.stock_quantity) || 0)
    }));
    setVariants([...otherVariants, ...newVariantsList]);

    addToast({
      type: 'success',
      title: 'تم تحديث المنتج',
      message: 'تم حفظ تعديلات المنتج بنجاح.'
    });

    return { success: true };
  };

  const toggleProductActive = (productId: string) => {
    const prod = products.find(p => p.product_id === productId);
    if (!prod) return;
    const newStatus = !prod.is_active;

    setProducts(prev =>
      prev.map(p => (p.product_id === productId ? { ...p, is_active: newStatus } : p))
    );

    addToast({
      type: 'info',
      title: newStatus ? 'تم تنشيط المنتج' : 'تم إخفاء المنتج',
      message: newStatus
        ? `المنتج "${prod.product_name}" يظهر الآن في المتجر.`
        : `المنتج "${prod.product_name}" تم إخفاؤه من واجهة الزبائن.`
    });
  };

  // Category management
  const addCategory = (categoryName: string, categoryNameEn?: string, description?: string) => {
    const cleanName = categoryName.trim();
    if (!cleanName) return { success: false, message: 'اسم التصنيف مطلوب.' };

    const exists = categories.find(c => c.category_name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      return { success: false, message: 'يوجد تصنيف بهذا الاسم مسبقاً.' };
    }

    const newCat: Category = {
      category_id: 'cat_' + Date.now(),
      category_name: cleanName,
      category_name_en: categoryNameEn?.trim() || cleanName,
      description: description?.trim() || ''
    };

    setCategories(prev => [...prev, newCat]);
    addToast({
      type: 'success',
      title: 'تمت إضافة التصنيف',
      message: `تمت إضافة التصنيف "${cleanName}" بنجاح.`
    });

    return { success: true };
  };

  const updateCategory = (categoryId: string, categoryName: string, categoryNameEn?: string, description?: string) => {
    const cleanName = categoryName.trim();
    if (!cleanName) return { success: false, message: 'اسم التصنيف مطلوب.' };

    const conflict = categories.find(
      c => c.category_id !== categoryId && c.category_name.toLowerCase() === cleanName.toLowerCase()
    );
    if (conflict) {
      return { success: false, message: 'هذا الاسم مستخدم لتصنيف آخر.' };
    }

    setCategories(prev =>
      prev.map(c =>
        c.category_id === categoryId
          ? {
              ...c,
              category_name: cleanName,
              category_name_en: categoryNameEn?.trim() || c.category_name_en,
              description: description?.trim() || c.description
            }
          : c
      )
    );

    addToast({
      type: 'success',
      title: 'تم تحديث التصنيف',
      message: 'تم تحديث بيانات التصنيف بنجاح.'
    });

    return { success: true };
  };

  const deleteCategory = (categoryId: string) => {
    // Check if ANY products belong to this category (including inactive products!)
    const linkedProducts = products.filter(p => p.category_id === categoryId);
    if (linkedProducts.length > 0) {
      return {
        success: false,
        message: `لا يمكن حذف هذا التصنيف لأنه مرتبط بـ (${linkedProducts.length}) منتجات. يجب نقل المنتجات أو تعديلها أولاً.`
      };
    }

    setCategories(prev => prev.filter(c => c.category_id !== categoryId));
    addToast({
      type: 'info',
      title: 'تم حذف التصنيف',
      message: 'تم حذف التصنيف بنجاح.'
    });

    return { success: true };
  };

  return (
    <StoreContext.Provider
      value={{
        isDark,
        toggleTheme,
        navigation,
        navigate,
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        products,
        categories,
        variants,
        images,
        orders,
        orderItems,
        users,
        addProduct,
        updateProduct,
        toggleProductActive,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        enrichedCart,
        cartCount,
        cartTotal,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        toasts,
        addToast,
        removeToast,
        getProductPrimaryImage,
        getProductImages,
        getProductVariants,
        getProductCategory,
        getProductTotalStock,
        isOrderCancellableByCustomer
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
