import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext.tsx';
import { productService } from '../../services/productService.ts';
import { Product, Category } from '../../types/index.ts';
import { formatKSh } from '../../lib/utils.ts';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  HelpCircle,
  Menu,
  X,
  Phone,
  Layers,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
  Package,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/mockData.ts';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartItemCount,
    wishlistCount,
    user,
    logout,
    searchQuery,
    setSearchQuery,
    openHelp,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Live debounced search suggestions
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<Category[]>([]);
  const [suggestedBrands, setSuggestedBrands] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const availableBrands = ['Apple', 'Samsung', 'Sony', 'Dell', 'Anker', 'Logitech', 'JBL', 'TP-Link', 'Xiaomi', 'HP', 'Lenovo'];

  // Sync external searchQuery changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Debounced suggestions fetch
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setSuggestedCategories([]);
      setSuggestedBrands([]);
      setSuggestionsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const queryLower = trimmed.toLowerCase();

        // 1. Matched Categories
        const matchedCats = INITIAL_CATEGORIES.filter(
          (c) => c.name.toLowerCase().includes(queryLower) || c.slug.toLowerCase().includes(queryLower)
        ).slice(0, 3);
        setSuggestedCategories(matchedCats);

        // 2. Matched Brands
        const matchedB = availableBrands.filter((b) => b.toLowerCase().includes(queryLower)).slice(0, 3);
        setSuggestedBrands(matchedB);

        // 3. Matched Products
        const res = await productService.getProducts({ searchQuery: trimmed, limit: 5 });
        setSuggestions(res.products);
        setSuggestionsOpen(true);
      } catch (err) {
        console.error('Search suggestions error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionsOpen(false);
    setSearchQuery(searchInput.trim());
    if (currentPath !== '/shop') {
      navigate('/shop');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSuggestionsOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSelectCategory = (catSlug: string) => {
    setSuggestionsOpen(false);
    navigate(`/shop?category=${catSlug}`);
  };

  const handleSelectBrand = (brandName: string) => {
    setSuggestionsOpen(false);
    setSearchQuery(brandName);
    navigate('/shop');
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setSuggestions([]);
    setSuggestionsOpen(false);
  };

  return (
    <header id="site-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Notification Strip */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NewEra Flash Tech Drops Live • Up to 25% Off</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-cyan-500" />
              <span>Fast Nairobi Same-Day & Countrywide Courier Dispatch</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:+254705629522"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>+254 705 629 522</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => navigate('/orders')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Package className="w-3 h-3 text-amber-400" />
              <span>Track My Order</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => openHelp()}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>Need Help?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-slate-700 hover:text-cyan-600 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* NewEra Shop Logo */}
          <div
            id="header-brand-logo"
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2.5 shrink-0 select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/20 group-hover:scale-105 transition-transform">
              <span className="font-heading font-black text-lg tracking-tighter text-cyan-400">N</span>
              <span className="font-heading font-bold text-xs text-white -ml-0.5">E</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-950">
                  NEWERA
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-1 rounded">
                  SHOP
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold -mt-1 hidden sm:block">
                KENYA TECH MARKETPLACE
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form
              id="desktop-search-form"
              onSubmit={handleSearchSubmit}
              className="w-full relative"
            >
              <div className="relative w-full flex items-center">
                <input
                  id="search-input-field"
                  type="text"
                  placeholder="Search products, brands and categories..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0 || suggestedCategories.length > 0) {
                      setSuggestionsOpen(true);
                    }
                  }}
                  className="w-full pl-11 pr-28 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-cyan-500 focus:ring-3 focus:ring-cyan-500/15 transition-all outline-hidden font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search query"
                    className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  id="desktop-search-submit-btn"
                  className="absolute right-1.5 px-4 py-1.5 bg-slate-950 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {suggestionsOpen && (
              <div
                id="search-suggestions-dropdown"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Categories & Brands shortcuts */}
                {(suggestedCategories.length > 0 || suggestedBrands.length > 0) && (
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick:</span>
                    {suggestedCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCategory(c.slug)}
                        className="px-2.5 py-1 bg-white hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-cyan-600" />
                        <span>In {c.name}</span>
                      </button>
                    ))}
                    {suggestedBrands.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleSelectBrand(b)}
                        className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Brand: {b}
                      </button>
                    ))}
                  </div>
                )}

                {/* Products matching query */}
                {isSearching ? (
                  <div className="p-6 text-center text-slate-400">
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Searching NewEra catalogue...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                      Product Matches ({suggestions.length})
                    </div>
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {suggestions.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod.id)}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase text-cyan-600 tracking-wider">
                                {prod.brand}
                              </span>
                              {prod.stockQuantity <= 5 && prod.stockQuantity > 0 && (
                                <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 rounded">
                                  Only {prod.stockQuantity} left
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-slate-900 group-hover:text-cyan-600 truncate text-xs">
                              {prod.name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-extrabold text-slate-950 block">
                              {formatKSh(prod.price)}
                            </span>
                            {prod.previousPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {formatKSh(prod.previousPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 px-4 bg-slate-950 hover:bg-cyan-600 text-white font-bold text-center text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View all results for "{searchInput}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    <p className="font-semibold text-slate-800">No exact matches found for "{searchInput}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Press Enter to search the full catalogue or check your spelling
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Customer Support */}
            <button
              id="header-help-btn"
              onClick={() => openHelp()}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-cyan-600 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>Support</span>
            </button>

            {/* Account / User Menu */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    id="user-account-dropdown-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.fullName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      id="user-dropdown-menu"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded">
                          {user.role}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/account');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        My Account
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        Orders & Tracking
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            navigate('/admin');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 text-cyan-700 font-bold"
                        >
                          Admin Console
                        </button>
                      )}
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-cyan-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigate('/wishlist')}
              aria-label="View Wishlist"
              className="relative p-2 text-slate-700 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={() => navigate('/cart')}
              aria-label="View Shopping Cart"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-slate-950 hover:bg-cyan-600 text-white rounded-xl transition-all shadow-xs"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold tracking-tight">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div ref={mobileSearchContainerRef} className="pb-3 md:hidden relative">
          <form
            id="mobile-search-form"
            onSubmit={handleSearchSubmit}
          >
            <div className="relative w-full flex items-center">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0 || suggestedCategories.length > 0) {
                    setSuggestionsOpen(true);
                  }
                }}
                className="w-full pl-9 pr-24 py-2 bg-slate-100 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg border border-transparent focus:border-cyan-500 focus:bg-white outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />

              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-16 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-slate-950 text-white text-[11px] font-bold rounded-md"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile search suggestions dropdown */}
          {suggestionsOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 text-xs">
              {suggestedCategories.length > 0 && (
                <div className="p-2 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-1.5">
                  {suggestedCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCategory(c.slug)}
                      className="px-2 py-0.5 bg-white text-slate-700 rounded border border-slate-200 text-[11px] font-medium"
                    >
                      In {c.name}
                    </button>
                  ))}
                </div>
              )}
              {suggestions.length > 0 && (
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {suggestions.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.id)}
                      className="p-2.5 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <img src={prod.images[0]} alt="" className="w-8 h-8 object-contain shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate text-[11px]">{prod.name}</p>
                        <span className="font-bold text-slate-950 text-xs">{formatKSh(prod.price)}</span>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full py-2 bg-slate-950 text-white font-bold text-center text-xs"
                  >
                    View all results →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Categories Navigation Bar (Desktop) */}
      <nav id="categories-nav-bar" className="bg-slate-50/90 border-t border-slate-200/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold py-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              <button
                id="nav-all-products"
                onClick={() => navigate('/shop')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  currentPath === '/shop'
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-700 hover:text-cyan-600 hover:bg-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Products</span>
              </button>

              <button
                id="nav-categories"
                onClick={() => navigate('/categories')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  currentPath === '/categories'
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-700 hover:text-cyan-600 hover:bg-white'
                }`}
              >
                Categories
              </button>

              {INITIAL_CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  id={`nav-cat-${cat.slug}`}
                  onClick={() => navigate(`/shop?category=${cat.slug}`)}
                  className="px-2.5 py-1.5 rounded-lg whitespace-nowrap text-slate-600 hover:text-cyan-600 hover:bg-white transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0 text-slate-500 pl-4 border-l border-slate-200">
              <button
                onClick={() => navigate('/shop?deal=flash')}
                className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Flash Deals</span>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="text-slate-500 hover:text-cyan-600 transition-colors"
              >
                Admin Area
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="fixed inset-0 top-16 z-50 bg-slate-950/60 backdrop-blur-xs md:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full overflow-y-auto p-5 space-y-6 shadow-2xl">
            {/* User status */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                {user ? user.fullName.charAt(0) : <UserIcon className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {user ? user.fullName : 'Guest Customer'}
                </p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(user ? '/account' : '/login');
                  }}
                  className="text-[11px] text-cyan-600 font-semibold hover:underline"
                >
                  {user ? 'View Profile' : 'Sign In / Register'}
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                Navigation
              </p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/shop');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                All Products
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/categories');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Categories
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/orders');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Track Orders
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/wishlist');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                Top Categories
              </p>
              {INITIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(`/shop?category=${cat.slug}`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Support info */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Customer Support
              </p>
              <a
                href="tel:+254705629522"
                className="flex items-center gap-2 text-xs font-semibold text-slate-800"
              >
                <Phone className="w-4 h-4 text-cyan-600" />
                <span>+254 705 629 522</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openHelp();
                }}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Help & FAQs
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
