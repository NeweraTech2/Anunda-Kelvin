import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { Review } from '../types/index.ts';

const SAMPLE_REVIEWS: Record<string, Review[]> = {
  'prod-01': [
    {
      id: 'rev-01',
      productId: 'prod-01',
      userName: 'Brian Mwangi',
      rating: 5,
      comment: 'Top tier noise cancelling! I use it daily on my commute across Nairobi CBD and in the office. Battery lasts all week.',
      verifiedPurchase: true,
      createdAt: '2026-02-14T10:30:00Z',
    },
    {
      id: 'rev-02',
      productId: 'prod-01',
      userName: 'Grace Atieno',
      rating: 5,
      comment: 'Genuine product with authentic Sony warranty seal. Delivery was done under 24 hours to Westlands.',
      verifiedPurchase: true,
      createdAt: '2026-02-28T14:15:00Z',
    },
    {
      id: 'rev-03',
      productId: 'prod-01',
      userName: 'Dennis Kipchumba',
      rating: 4,
      comment: 'Super light and comfortable earcups. Audio clarity is remarkable with LDAC codec.',
      verifiedPurchase: true,
      createdAt: '2026-03-05T09:20:00Z',
    },
  ],
  'prod-02': [
    {
      id: 'rev-04',
      productId: 'prod-02',
      userName: 'Faith Wanjiku',
      rating: 5,
      comment: 'The M3 Pro chip handles 4K video editing without breaking a sweat. Battery life is easily 18+ hours.',
      verifiedPurchase: true,
      createdAt: '2026-01-20T11:00:00Z',
    },
    {
      id: 'rev-05',
      productId: 'prod-02',
      userName: 'Collins Ochieng',
      rating: 5,
      comment: 'Space Black finish looks incredible. Received in pristine condition with valid Apple care warranty in Kenya.',
      verifiedPurchase: true,
      createdAt: '2026-02-10T16:40:00Z',
    },
  ],
  'prod-03': [
    {
      id: 'rev-06',
      productId: 'prod-03',
      userName: 'Sarah Njeri',
      rating: 5,
      comment: 'Titanium design feels super light in hand. Camera zoom and Action Button are game changers.',
      verifiedPurchase: true,
      createdAt: '2026-02-18T13:22:00Z',
    },
  ],
};

export const reviewService = {
  /**
   * Get reviews for a product
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('reviews') as any)
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            productId: d.product_id,
            userName: d.user_name,
            rating: d.rating,
            comment: d.comment,
            verifiedPurchase: d.verified_purchase,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch reviews error, using local dataset:', err);
      }
    }

    return SAMPLE_REVIEWS[productId] || [
      {
        id: `rev-default-${productId}`,
        productId,
        userName: 'Customer from Nairobi',
        rating: 5,
        comment: 'Excellent build quality, genuine manufacturer warranty and speedy courier delivery.',
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  },

  /**
   * Submit a new review
   */
  async submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('reviews') as any)
          .insert({
            product_id: review.productId,
            user_name: review.userName,
            rating: review.rating,
            comment: review.comment,
            verified_purchase: review.verifiedPurchase,
          })
          .select('*')
          .single();

        if (!error && data) {
          return {
            id: data.id,
            productId: data.product_id,
            userName: data.user_name,
            rating: data.rating,
            comment: data.comment,
            verifiedPurchase: data.verified_purchase,
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.warn('Supabase submit review error:', err);
      }
    }

    if (!SAMPLE_REVIEWS[review.productId]) {
      SAMPLE_REVIEWS[review.productId] = [];
    }
    SAMPLE_REVIEWS[review.productId].unshift(newReview);

    return newReview;
  },

  /**
   * Get all reviews across the catalog for admin moderation (Section 26)
   */
  async getAllReviews(): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('reviews') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            productId: d.product_id,
            userName: d.user_name,
            rating: d.rating,
            comment: d.comment,
            verifiedPurchase: d.verified_purchase,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getAllReviews warning:', err);
      }
    }

    const all: Review[] = [];
    Object.values(SAMPLE_REVIEWS).forEach((revList) => {
      all.push(...revList);
    });
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Delete or moderate review (Section 26)
   */
  async deleteReview(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase.from('reviews') as any).delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete review error:', err);
      }
    }

    Object.keys(SAMPLE_REVIEWS).forEach((prodId) => {
      SAMPLE_REVIEWS[prodId] = SAMPLE_REVIEWS[prodId].filter((r) => r.id !== id);
    });
    return true;
  },
};
