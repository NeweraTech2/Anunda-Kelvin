import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  History,
  Database,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'promotions'
  | 'reviews'
  | 'inquiries'
  | 'analytics'
  | 'settings'
  | 'audit'
  | 'database';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateStorefront: () => void;
  counts: {
    products: number;
    orders: number;
    lowStock: number;
    inquiries: number;
    reviews: number;
  };
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigateStorefront,
  counts,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      group: 'Core Operations',
      items: [
        { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products' as AdminTab, label: 'Products', icon: Package, badge: counts.products },
        { id: 'categories' as AdminTab, label: 'Categories', icon: Layers },
        {
          id: 'inventory' as AdminTab,
          label: 'Inventory',
          icon: Boxes,
          badge: counts.lowStock > 0 ? `${counts.lowStock} Low` : undefined,
          badgeColor: 'bg-red-500 text-white',
        },
        { id: 'orders' as AdminTab, label: 'Orders & Dispatch', icon: ShoppingCart, badge: counts.orders },
      ],
    },
    {
      group: 'Customer & Growth',
      items: [
        { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
        { id: 'promotions' as AdminTab, label: 'Promotions & Coupons', icon: Tag },
        { id: 'reviews' as AdminTab, label: 'Reviews Moderation', icon: Star, badge: counts.reviews },
        {
          id: 'inquiries' as AdminTab,
          label: 'Customer Inquiries',
          icon: MessageSquare,
          badge: counts.inquiries > 0 ? counts.inquiries : undefined,
          badgeColor: 'bg-cyan-500 text-white',
        },
      ],
    },
    {
      group: 'Intelligence & Config',
      items: [
        { id: 'analytics' as AdminTab, label: 'Business Analytics', icon: BarChart3 },
        { id: 'settings' as AdminTab, label: 'Store Settings', icon: Settings },
        { id: 'audit' as AdminTab, label: 'Audit Logs', icon: History },
        { id: 'database' as AdminTab, label: 'Supabase Architecture', icon: Database },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
              N
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-sm">
                NewEra <span className="text-cyan-400">Admin</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Business Control v3.0</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-white font-bold shadow-sm shadow-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.badgeColor ||
                          (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Storefront switch */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
          <button
            onClick={onNavigateStorefront}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Storefront</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </aside>
    </>
  );
};
