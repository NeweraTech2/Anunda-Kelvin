import { isSupabaseConfigured, supabase } from '../lib/supabase/client.ts';
import { User } from '../types/index.ts';

export const authService = {
  /**
   * Register a new customer
   */
  async register(fullName: string, email: string, phone: string = '', password?: string): Promise<User> {
    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Insert or upsert user profile into public.users
          await (supabase.from('users') as any).upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            phone,
            role: 'customer',
          });

          return {
            id: data.user.id,
            email,
            fullName,
            phone,
            role: 'customer',
            createdAt: new Date().toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Supabase auth signUp error:', err);
        throw new Error(err.message || 'Registration failed');
      }
    }

    // Fallback registration
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('newera_user', JSON.stringify(newUser));
    } catch {
      // ignore
    }

    return newUser;
  },

  /**
   * Log in customer or admin
   */
  async login(email: string, passwordOrRole?: string): Promise<User> {
    // If Supabase is configured and a password was passed (not just a role shortcut)
    if (isSupabaseConfigured && supabase && passwordOrRole && passwordOrRole !== 'admin' && passwordOrRole !== 'customer') {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: passwordOrRole,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Fetch role from public.users table
          const { data: profile } = await (supabase.from('users') as any)
            .select('*')
            .eq('id', data.user.id)
            .single();

          const role = profile?.role || 'customer';
          const fullName = profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0];

          const authedUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            fullName,
            phone: profile?.phone || data.user.user_metadata?.phone,
            role,
            createdAt: data.user.created_at || new Date().toISOString(),
          };

          return authedUser;
        }
      } catch (err: any) {
        console.warn('Supabase auth signIn error:', err);
        throw new Error(err.message || 'Invalid email or password');
      }
    }

    // Role-based or local fallback
    const isAdmin = email.toLowerCase().includes('admin') || passwordOrRole === 'admin';
    const fallbackUser: User = {
      id: isAdmin ? 'usr-admin-01' : 'usr-customer-01',
      email,
      fullName: isAdmin ? 'Store Administrator' : 'Kelvin Anunda',
      phone: '+254 705 629 522',
      role: isAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('newera_user', JSON.stringify(fallbackUser));
    } catch {
      // ignore
    }

    return fallbackUser;
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        return true;
      } catch (err: any) {
        console.warn('Supabase reset password error:', err);
        throw new Error(err.message || 'Password reset request failed');
      }
    }

    // Fallback
    return true;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload: any = {};
        if (updates.fullName !== undefined) payload.full_name = updates.fullName;
        if (updates.phone !== undefined) payload.phone = updates.phone;

        await (supabase.from('users') as any).update(payload).eq('id', userId);
      } catch (err: any) {
        console.warn('Supabase updateProfile error:', err);
      }
    }

    const currentRaw = localStorage.getItem('newera_user');
    let current: User = currentRaw ? JSON.parse(currentRaw) : { id: userId, email: '', fullName: '', role: 'customer', createdAt: new Date().toISOString() };
    const updated: User = { ...current, ...updates };

    try {
      localStorage.setItem('newera_user', JSON.stringify(updated));
    } catch {
      // ignore
    }

    return updated;
  },

  /**
   * Log out
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }

    try {
      localStorage.removeItem('newera_user');
    } catch {
      // ignore
    }
  },
};
