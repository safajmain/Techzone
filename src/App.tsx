import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailsPage } from './pages/customer/ProductDetailsPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderDetailsPage } from './pages/customer/OrderDetailsPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

const AppRouter: React.FC = () => {
  const { navigation, currentUser, navigate, addToast } = useStore();

  const isAdminPage = navigation.page.startsWith('admin-');

  // Route protection for Admin pages
  useEffect(() => {
    if (isAdminPage && currentUser?.role !== 'admin') {
      addToast({
        type: 'warning',
        title: 'منطقة إدارية مقيدة',
        message: 'يجب تسجيل الدخول كمدير نظام (Admin) للوصول إلى لوحة التحكم.'
      });
      navigate('login');
    }
  }, [navigation.page, currentUser, isAdminPage]);

  // Route protection: Admin cannot access Customer Checkout as Admin
  useEffect(() => {
    if (navigation.page === 'checkout' && currentUser?.role === 'admin') {
      addToast({
        type: 'info',
        title: 'تنبيه الحساب',
        message: 'أنت مسجل كمدير نظام. لإتمام طلبات الشراء، يرجى التبديل إلى حساب زبون.'
      });
      navigate('home');
    }
  }, [navigation.page, currentUser]);

  // Render current active page
  const renderPage = () => {
    switch (navigation.page) {
      // Customer Storefront
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'my-orders':
        return <MyOrdersPage />;
      case 'order-details':
        return <OrderDetailsPage />;
      case 'my-profile':
        return <ProfilePage />;

      // Auth
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;

      // Admin Panel
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-products':
        return <AdminProductsPage />;
      case 'admin-product-add':
      case 'admin-product-edit':
        return <AdminProductFormPage />;
      case 'admin-categories':
        return <AdminCategoriesPage />;
      case 'admin-orders':
        return <AdminOrdersPage />;
      case 'admin-users':
        return <AdminUsersPage />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Render Storefront Header & Footer only when NOT on Admin pages */}
      {!isAdminPage && <Navbar />}

      {/* Main Page Area */}
      <div className="flex-1">
        {renderPage()}
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}
