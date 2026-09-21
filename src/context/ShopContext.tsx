import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, WishlistItem, User, Order } from '../types/index.ts';
import { orderService } from '../services/orderService.ts';
import { authService } from '../services/authService.ts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ShopContextType {
  // Navigation / Routing
  currentPath: string;
  navigate: (path: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;

  // Authentication & User
  user: User | null;
  login: (email: string, passwordOrRole?: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (fullName: string, email: string, phone?: string, password?: string) => Promise<User>;
  updateUserProfile: (updates: Partial<User>) => Promise<User>;

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Support Drawer / Modal state
  isHelpOpen: boolean;
  openHelp: (topic?: string) => void;
  closeHelp: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  // Path navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart State (Initialized with sample or empty)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('newera_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('newera_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart storage error', e);
    }
  }, [cart]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('newera_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('newera_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Wishlist storage error', e);
    }
  }, [wishlist]);

  // User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('newera_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('newera_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'ord-84920',
        orderNumber: 'NEW-2026-8492',
        customerName: 'Kelvin Anunda',
        customerEmail: 'anundakelvin7@gmail.com',
        customerPhone: '+254 705 629 522',
        shippingAddress: {
          id: 'addr-1',
          fullName: 'Kelvin Anunda',
          phoneNumber: '+254 705 629 522',
          county: 'Nairobi',
          city: 'Nairobi',
          area: 'Westlands',
          streetAddress: 'Mpaka Road, Woodvale Grove Plaza',
          isDefault: true,
        },
        items: [
          {
            id: 'item-1',
            productId: 'prod-01',
            productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
            productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
            price: 38999,
            quantity: 1,
          },
        ],
        subtotal: 38999,
        shippingFee: 350,
        discountAmount: 0,
        total: 39349,
        status: 'shipped',
        paymentMethod: 'mpesa',
        paymentStatus: 'paid',
        mpesaReceiptNumber: 'QHK88391KZ',
        trackingNumber: 'FRG-NBO-88219',
        estimatedDeliveryDate: 'Tomorrow by 2:00 PM',
        createdAt: '2026-09-20T14:32:00Z',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('newera_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Orders storage error', e);
    }
  }, [orders]);

  useEffect(() => {
    orderService.getOrders(user?.id).then((freshOrders) => {
      if (freshOrders && freshOrders.length > 0) {
        setOrders(freshOrders);
      }
    }).catch((err) => {
      console.warn('Could not load orders:', err);
    });
  }, [user?.id]);

  // Quick View Product
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Help Drawer
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockQuantity <= 0) {
      showToast({
        type: 'error',
        title: 'Out of Stock',
        message: `${product.name} is currently out of stock.`,
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQuantity) {
          showToast({
            type: 'warning',
            title: 'Stock Limit Reached',
            message: `Only ${product.stockQuantity} units available in stock.`,
          });
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: product.stockQuantity }
              : item
          );
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      }

      const safeQty = Math.min(quantity, product.stockQuantity);
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${product.id}`,
          product,
          quantity: safeQty,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name.slice(0, 32)}... has been added to your shopping cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item has been removed from your cart.',
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stockQuantity || 99);
          if (quantity > item.product.stockQuantity) {
            showToast({
              type: 'warning',
              title: 'Stock Limit',
              message: `Only ${item.product.stockQuantity} units available.`,
            });
          }
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      if (exists) {
        showToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${product.name.slice(0, 28)} removed from saved items.`,
        });
        return prev.filter((item) => item.product.id !== product.id);
      } else {
        showToast({
          type: 'success',
          title: 'Saved to Wishlist',
          message: `${product.name.slice(0, 28)} saved to your wishlist.`,
        });
        return [
          ...prev,
          {
            id: `wish-${Date.now()}-${product.id}`,
            product,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount = wishlist.length;

  // Quick view
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Auth actions
  const login = async (email: string, passwordOrRole?: string): Promise<User> => {
    const loggedUser = await authService.login(email, passwordOrRole);
    setUser(loggedUser);
    showToast({
      type: 'success',
      title: 'Welcome Back!',
      message: `Signed in as ${loggedUser.fullName} (${loggedUser.role})`,
    });
    return loggedUser;
  };

  const register = async (fullName: string, email: string, phone?: string, password?: string): Promise<User> => {
    const newUser = await authService.register(fullName, email, phone, password);
    setUser(newUser);
    showToast({
      type: 'success',
      title: 'Account Created',
      message: `Welcome to NewEra Shop, ${fullName}!`,
    });
    return newUser;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out.',
    });
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) throw new Error('Not logged in');
    const updated = await authService.updateProfile(user.id, updates);
    setUser(updated);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your account details have been saved.',
    });
    return updated;
  };

  // Orders
  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const subtotal = orderData.subtotal !== undefined ? orderData.subtotal : cartTotal;
    const shippingFee = orderData.shippingFee !== undefined ? orderData.shippingFee : (subtotal > 50000 ? 0 : 350);
    const discountAmount = orderData.discountAmount || 0;
    const total = orderData.total !== undefined ? orderData.total : (subtotal + shippingFee - discountAmount);

    const created = await orderService.createOrder({
      userId: user?.id,
      customerName: orderData.customerName || (user ? user.fullName : 'Guest Shopper'),
      customerEmail: orderData.customerEmail || (user ? user.email : 'guest@newerashop.co.ke'),
      customerPhone: orderData.customerPhone || '+254 705 629 522',
      shippingAddress: orderData.shippingAddress || {
        id: 'addr-default',
        fullName: 'Kelvin Anunda',
        phoneNumber: '+254 705 629 522',
        county: 'Nairobi',
        city: 'Nairobi',
        area: 'CBD',
        streetAddress: 'Kenyatta Avenue, NewEra Plaza',
        isDefault: true,
      },
      items: cart,
      subtotal,
      shippingFee,
      discountAmount,
      total,
      paymentMethod: orderData.paymentMethod || 'mpesa',
    });

    setOrders((prev) => [created, ...prev]);
    clearCart();
    return created;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    await orderService.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast({
      type: 'info',
      title: 'Order Updated',
      message: `Order status updated to ${status}.`,
    });
  };

  // Help
  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);

  return (
    <ShopContext.Provider
      value={{
        currentPath,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        searchQuery,
        setSearchQuery,
        selectedCategorySlug,
        setSelectedCategorySlug,
        user,
        login,
        logout,
        register,
        updateUserProfile,
        orders,
        createOrder,
        updateOrderStatus,
        toasts,
        showToast,
        dismissToast,
        isHelpOpen,
        openHelp,
        closeHelp,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
