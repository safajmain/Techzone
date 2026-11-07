export type UserRole = 'customer' | 'admin';

export interface User {
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  password?: string; // demo only
  created_at: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  category_name_en?: string;
  icon?: string;
  description?: string;
}

export interface ProductVariant {
  variant_id: string;
  product_id: string;
  color_name: string;
  color_hex?: string;
  stock_quantity: number;
}

export interface ProductImage {
  image_id: string;
  product_id: string;
  image_path: string;
  is_primary: boolean;
  created_at?: string;
}

export interface Product {
  product_id: string;
  category_id: string;
  product_name: string;
  brand: string;
  description: string;
  specifications?: Record<string, string>;
  price: number; // In JOD
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  variant_id: string;
  product_id: string;
  product_name_snapshot: string;
  color_snapshot: string;
  image_snapshot?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  order_id: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  city: string;
  full_address: string;
  order_notes?: string;
  total_amount: number;
  payment_method: 'الدفع عند الاستلام';
  order_status: OrderStatus;
  created_at: string;
}

export interface CartItem {
  variant_id: string;
  product_id: string;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export type NavigationPage =
  | 'home'
  | 'products'
  | 'product-details'
  | 'cart'
  | 'login'
  | 'register'
  | 'checkout'
  | 'my-orders'
  | 'order-details'
  | 'my-profile'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-product-add'
  | 'admin-product-edit'
  | 'admin-categories'
  | 'admin-orders'
  | 'admin-users';

export interface NavigationState {
  page: NavigationPage;
  params?: {
    productId?: string;
    orderId?: string;
    categoryId?: string;
    searchQuery?: string;
    fromCheckout?: boolean;
  };
}
