import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_PROMOTIONS } from '../data/mockData.ts';
import { Category, Product, ProductFilters, Promotion, CartItem } from '../types/index.ts';

export const productService = {
  /**
   * Get all categories from Supabase or catalog
   */
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('categories') as any)
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: item.description || undefined,
            iconName: item.icon_name || 'Layers',
            imageUrl: item.image_url,
            productCount: 0,
            featured: true,
          }));
        }
      } catch (err) {
        console.warn('Supabase getCategories error, falling back to local dataset:', err);
      }
    }
    return INITIAL_CATEGORIES;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  /**
   * Get filtered products with pagination, search, brand, price and sorting
   * Built for unlimited scale (5 to 5,000+ items)
   */
  async getProducts(filters: ProductFilters = {}): Promise<{ products: Product[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 12;

    if (isSupabaseConfigured && supabase) {
      try {
        let query = (supabase.from('products') as any)
          .select('*, product_images(*)', { count: 'exact' })
          .eq('active', true);

        // Filter by category
        if (filters.categorySlug && filters.categorySlug !== 'all') {
          const cat = await this.getCategoryBySlug(filters.categorySlug);
          if (cat) {
            query = query.eq('category_id', cat.id);
          }
        }

        // Filter by search query
        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.trim();
          query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`);
        }

        // Filter by brand
        if (filters.brand && filters.brand !== 'all') {
          query = query.ilike('brand', filters.brand);
        }

        // Price filters
        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        // In stock
        if (filters.inStockOnly) {
          query = query.gt('stock_quantity', 0);
        }

        // Rating
        if (filters.minRating !== undefined && filters.minRating > 0) {
          query = query.gte('rating', filters.minRating);
        }

        // Sorting
        switch (filters.sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'featured':
          default:
            query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
            break;
        }

        // Range / Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (!error && data && Array.isArray(data)) {
          const mapped: Product[] = data.map((item: any) => {
            const rawImages = (item.product_images || [])
              .sort((a: any, b: any) => a.display_order - b.display_order)
              .map((img: any) => img.url);

            return {
              id: item.id,
              name: item.name,
              slug: item.slug,
              description: item.description,
              shortDescription: item.short_description || undefined,
              price: Number(item.price),
              previousPrice: item.previous_price ? Number(item.previous_price) : undefined,
              discountPercentage: item.discount_percentage ? Number(item.discount_percentage) : undefined,
              categoryId: item.category_id,
              brand: item.brand,
              sku: item.sku,
              stockQuantity: Number(item.stock_quantity),
              rating: Number(item.rating || 5),
              reviewCount: Number(item.review_count || 0),
              featured: Boolean(item.featured),
              active: Boolean(item.active),
              images: rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800'],
              specifications: item.specifications || undefined,
              warranty: item.warranty || '1 Year Authorized Kenyan Warranty',
              createdAt: item.created_at,
              updatedAt: item.updated_at,
            };
          });

          return {
            products: mapped,
            total: count || mapped.length,
          };
        }
      } catch (err) {
        console.warn('Supabase getProducts error, falling back to local query engine:', err);
      }
    }

    // Dynamic In-Memory Query Engine
    let list = [...INITIAL_PRODUCTS];

    // Filter by category
    if (filters.categorySlug && filters.categorySlug !== 'all') {
      const cat = INITIAL_CATEGORIES.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id);
      }
    }

    // Filter by search query across name, brand, category, description, and tags
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Filter by brand
    if (filters.brand && filters.brand !== 'all') {
      list = list.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
    }

    // Filter by price
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // Filter in stock
    if (filters.inStockOnly) {
      list = list.filter((p) => p.stockQuantity > 0);
    }

    // Filter on sale
    if (filters.onSaleOnly) {
      list = list.filter((p) => (p.discountPercentage || 0) > 0);
    }

    // Filter by rating
    if (filters.minRating !== undefined && filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating!);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
    };
  },

  /**
   * Get single product by ID or Slug
   */
  async getProductById(idOrSlug: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('products') as any)
          .select('*, product_images(*)')
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
          .single();

        if (!error && data) {
          const rawImages = (data.product_images || [])
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.url);

          return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            shortDescription: data.short_description || undefined,
            price: Number(data.price),
            previousPrice: data.previous_price ? Number(data.previous_price) : undefined,
            discountPercentage: data.discount_percentage ? Number(data.discount_percentage) : undefined,
            categoryId: data.category_id,
            brand: data.brand,
            sku: data.sku,
            stockQuantity: Number(data.stock_quantity),
            rating: Number(data.rating || 5),
            reviewCount: Number(data.review_count || 0),
            featured: Boolean(data.featured),
            active: Boolean(data.active),
            images: rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800'],
            specifications: data.specifications || undefined,
            warranty: data.warranty || '1 Year Authorized Kenyan Warranty',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Supabase getProductById error:', err);
      }
    }

    const found = INITIAL_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  },

  /**
   * Get related products based on category or brand (Section 31)
   */
  async getRelatedProducts(productId: string, categoryId: string, brand?: string): Promise<Product[]> {
    const { products } = await this.getProducts({ limit: 50 });
    const related = products.filter(
      (p) => p.id !== productId && (p.categoryId === categoryId || (brand && p.brand.toLowerCase() === brand.toLowerCase()))
    );
    return related.slice(0, 4);
  },

  /**
   * Get search suggestions based on keyword (Section 8)
   */
  async getSearchSuggestions(query: string): Promise<{
    products: { id: string; name: string; brand: string; price: number; image: string }[];
    categories: { name: string; slug: string }[];
    brands: string[];
  }> {
    if (!query || query.trim().length < 2) {
      return { products: [], categories: [], brands: [] };
    }

    const q = query.toLowerCase().trim();
    const categories = await this.getCategories();
    const matchingCategories = categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => ({ name: c.name, slug: c.slug }))
      .slice(0, 3);

    const { products } = await this.getProducts({ searchQuery: q, limit: 5 });
    const matchingProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.images[0],
    }));

    const matchedBrands = Array.from(
      new Set(
        INITIAL_PRODUCTS
          .filter((p) => p.brand.toLowerCase().includes(q))
          .map((p) => p.brand)
      )
    ).slice(0, 3);

    return {
      products: matchingProducts,
      categories: matchingCategories,
      brands: matchedBrands,
    };
  },

  /**
   * Validate Cart Items against latest backend prices and stock (Sections 14 & 17)
   */
  async validateCartItems(items: CartItem[]): Promise<{
    isValid: boolean;
    issues: string[];
    validatedItems: CartItem[];
  }> {
    const issues: string[] = [];
    const validatedItems: CartItem[] = [];

    for (const item of items) {
      const freshProduct = await this.getProductById(item.product.id);

      if (!freshProduct || !freshProduct.active) {
        issues.push(`Product "${item.product.name}" is no longer available.`);
        continue;
      }

      if (freshProduct.stockQuantity < 1) {
        issues.push(`Product "${freshProduct.name}" is currently out of stock.`);
        continue;
      }

      let quantity = item.quantity;
      if (quantity > freshProduct.stockQuantity) {
        issues.push(`Quantity for "${freshProduct.name}" adjusted to available stock (${freshProduct.stockQuantity}).`);
        quantity = freshProduct.stockQuantity;
      }

      validatedItems.push({
        ...item,
        product: freshProduct, // Synchronize with canonical price and data
        quantity,
      });
    }

    return {
      isValid: issues.length === 0,
      issues,
      validatedItems,
    };
  },

  /**
   * Get flash deal products
   */
  async getFlashDeals(): Promise<Product[]> {
    return INITIAL_PRODUCTS.filter((p) => p.isFlashDeal && p.active);
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return INITIAL_PRODUCTS.filter((p) => p.featured && p.active);
  },

  /**
   * Get new arrivals
   */
  async getNewArrivals(): Promise<Product[]> {
    return INITIAL_PRODUCTS.filter((p) => p.isNewArrival && p.active);
  },

  /**
   * Get best sellers
   */
  async getBestSellers(): Promise<Product[]> {
    return INITIAL_PRODUCTS.filter((p) => p.isBestSeller && p.active);
  },

  /**
   * Get active promotional banners
   */
  async getPromotions(): Promise<Promotion[]> {
    return INITIAL_PROMOTIONS.filter((p) => p.active);
  },

  /**
   * Create a new product (Admin)
   */
  async createProduct(productData: Partial<Product> & { name: string; price: number }): Promise<Product> {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: productData.description || `${productData.name} with official warranty`,
      shortDescription: productData.shortDescription,
      previousPrice: productData.previousPrice,
      discountPercentage: productData.discountPercentage,
      categoryId: productData.categoryId || 'phones-tablets',
      brand: productData.brand || 'Generic',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      stockQuantity: productData.stockQuantity || 10,
      rating: 5.0,
      reviewCount: 0,
      featured: productData.featured || false,
      active: true,
      images: productData.images || ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800'],
      specifications: productData.specifications,
      warranty: productData.warranty || '1 Year Authorized Kenyan Warranty',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...productData,
      name: productData.name,
      price: productData.price,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase.from('products') as any).insert({
          id: newProduct.id,
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          price: newProduct.price,
          previous_price: newProduct.previousPrice,
          category_id: newProduct.categoryId,
          brand: newProduct.brand,
          sku: newProduct.sku,
          stock_quantity: newProduct.stockQuantity,
          featured: newProduct.featured,
          active: true,
        });
      } catch (err) {
        console.warn('Supabase product creation error:', err);
      }
    }

    INITIAL_PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  /**
   * Update an existing product (Admin)
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const index = INITIAL_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const updatedProduct: Product = {
      ...INITIAL_PRODUCTS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase.from('products') as any)
          .update({
            name: updatedProduct.name,
            slug: updatedProduct.slug,
            description: updatedProduct.description,
            price: updatedProduct.price,
            previous_price: updatedProduct.previousPrice,
            discount_percentage: updatedProduct.discountPercentage,
            category_id: updatedProduct.categoryId,
            brand: updatedProduct.brand,
            sku: updatedProduct.sku,
            stock_quantity: updatedProduct.stockQuantity,
            featured: updatedProduct.featured,
            active: updatedProduct.active,
            updated_at: updatedProduct.updatedAt,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase product update warning:', err);
      }
    }

    INITIAL_PRODUCTS[index] = updatedProduct;
    return updatedProduct;
  },

  /**
   * Update product stock specifically with safety check (Sections 16 & 17)
   */
  async updateStock(id: string, newStock: number): Promise<Product> {
    const safeStock = Math.max(0, Math.floor(newStock));
    return this.updateProduct(id, { stockQuantity: safeStock });
  },

  /**
   * Deactivate a product instead of hard deleting (Section 13)
   */
  async deactivateProduct(id: string): Promise<boolean> {
    await this.updateProduct(id, { active: false });
    return true;
  },

  /**
   * Create a new category (Admin Section 15)
   */
  async createCategory(categoryData: Partial<Category> & { name: string }): Promise<Category> {
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      slug,
      description: categoryData.description || `${categoryData.name} collection at NewEra Shop`,
      iconName: categoryData.iconName || 'Layers',
      imageUrl: categoryData.imageUrl || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800',
      productCount: 0,
      featured: categoryData.featured ?? true,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase.from('categories') as any).insert({
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
          icon_name: newCategory.iconName,
          image_url: newCategory.imageUrl,
          display_order: INITIAL_CATEGORIES.length + 1,
        });
      } catch (err) {
        console.warn('Supabase category insertion warning:', err);
      }
    }

    INITIAL_CATEGORIES.push(newCategory);
    return newCategory;
  },

  /**
   * Update an existing category (Admin Section 15)
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const idx = INITIAL_CATEGORIES.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const updated = {
      ...INITIAL_CATEGORIES[idx],
      ...updates,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase.from('categories') as any)
          .update({
            name: updated.name,
            slug: updated.slug,
            description: updated.description,
            icon_name: updated.iconName,
            image_url: updated.imageUrl,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase category update warning:', err);
      }
    }

    INITIAL_CATEGORIES[idx] = updated;
    return updated;
  },
};
