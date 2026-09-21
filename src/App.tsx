import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { FloatingHelp } from './components/common/FloatingHelp.tsx';
import { QuickViewModal } from './components/common/QuickViewModal.tsx';
import { ToastContainer } from './components/common/Toast.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { HelpPage } from './pages/HelpPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

const AppContent: React.FC = () => {
  const { currentPath } = useShop();

  // Scroll to top on path change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  // Route resolver
  const renderCurrentView = () => {
    const path = currentPath.split('?')[0];

    if (path === '/') return <HomePage />;
    if (path === '/shop') return <ShopPage />;
    if (path === '/categories') return <CategoriesPage />;
    if (path.startsWith('/product/')) {
      const productId = path.split('/product/')[1];
      return <ProductDetailPage productId={productId} />;
    }
    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/wishlist') return <WishlistPage />;
    if (path === '/orders') return <OrdersPage />;
    if (path === '/login') return <LoginPage />;
    if (path === '/register') return <RegisterPage />;
    if (path === '/account') return <AccountPage />;
    if (path === '/help') return <HelpPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/admin') return <AdminPage />;

    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main Content View */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Support Drawer & Floating Trigger */}
      <FloatingHelp />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
