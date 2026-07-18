// src/lib/db.ts - Unified Supabase & Local Database Provider
import { createClient } from '@supabase/supabase-js';
import { Client, LandingPage, Order, Review, SocialProof } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Initialize real Supabase client only if configured to prevent crashes on startup
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial seeds for local Fallback store
const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'c1-demo',
    user_id: 'u1-demo',
    business_name: 'أنصار ستور - Ansar Store',
    slug: 'ansar-store',
    email: 'demo@yube.dz',
    whatsapp: '+213555123456',
    plan: 'pro',
    status: 'active',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'c2-demo',
    user_id: 'u2-demo',
    business_name: 'الملكة فاشن - Queen Fashion',
    slug: 'queen-fashion',
    email: 'queen@yube.dz',
    whatsapp: '+213666987654',
    plan: 'basic',
    status: 'active',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  }
];

const DEFAULT_PAGES: LandingPage[] = [
  {
    id: 'p1-demo',
    client_id: 'c1-demo',
    slug: 'kids-set',
    template_id: 'simple',
    status: 'live',
    product_name: 'طقم أطفال الربيع الفاخر',
    price: 3900,
    original_price: 5500,
    description: 'طقم ملابس أطفال قطني 100% عالي الجودة مستورد من تركيا. ناعم ولطيف على بشرة الأطفال ومناسب لجميع المناسبات والطلعات اليومية.',
    whatsapp: '+213555123456',
    color_theme: 'green',
    product_images: [
      'https://images.unsplash.com/photo-1519704961756-de6fda49f943?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600'
    ],
    social_proof: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=600',
        caption: 'زبائننا يشاركونا صور أطفالهم بالطقم'
      }
    ],
    reviews: [
      { name: 'أم ريان', location: 'الجزائر العاصمة', rating: 5, text: 'القمة في الروعة القماش بزاف هايل وبنتي فرحت بيه بزاف شكراً ليكم والتوصيل سريع' },
      { name: 'سليم. ب', location: 'وهران', rating: 5, text: 'طقم ممتاز مطابق تماماً للصورة والتوصيل لولاية وهران كان في يومين فقط' },
      { name: 'أمينة', location: 'قسنطينة', rating: 4, text: 'جودة ممتازة وخدمة عملاء راقية جداً وسريع في الرد' }
    ],
    page_config: {
      pain_points: [
        'هل تعبت من البحث عن ملابس أطفال تجمع بين الأناقة والراحة؟',
        'هل تخاف من شراء ملابس وتتغير جودتها بعد الغسل الأول؟',
        'هل مللت من الملابس العادية التي لا تدوم طويلاً؟'
      ]
    },
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    published_at: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'p2-demo',
    client_id: 'c2-demo',
    slug: 'steam-iron',
    template_id: 'premium',
    status: 'pending_review',
    product_name: 'مكواة البخار المحمولة الذكية',
    price: 4900,
    original_price: 7900,
    description: 'المكواة البخارية العمودية المحمولة الأسرع والأقوى لكي جميع أنواع الأقمشة والستائر في ثوانٍ معدودة. مثالية للسفر والتنقل اليومي وتغنيك عن المكواة التقليدية الثقيلة.',
    whatsapp: '+213666987654',
    color_theme: 'blue',
    product_images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=600'
    ],
    social_proof: [],
    reviews: [
      { name: 'عبد الرزاق', location: 'سطيف', rating: 5, text: 'تغني عن المكواة العادية ممتازة في السفر خفيفة وسريعة التسخين' }
    ],
    page_config: {
      features: [
        { icon: 'Zap', title: 'تسخين سريع في 15 ثانية', desc: 'تنتج بخاراً مستمراً بقوة عالية لفك التجاعيد بلمسة واحدة' },
        { icon: 'Shield', title: 'آمنة على جميع الأقمشة', desc: 'لا تسبب الحرق للحرير أو الصوف أو الجينز' },
        { icon: 'Plane', title: 'تصميم مدمج وخفيف الوزن', desc: 'مثالية للحقائب والرحلات والاستخدام السريع في المكتب' }
      ]
    },
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

const DEFAULT_ORDERS: Order[] = [
  { id: 'o-1', landing_page_id: 'p1-demo', client_id: 'c1-demo', name: 'أحمد مرابط', phone: '0771234567', city: 'الجزائر العاصمة', quantity: 1, product_name: 'طقم أطفال الربيع الفاخر', source: 'kids-set', status: 'delivered', created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
  { id: 'o-2', landing_page_id: 'p1-demo', client_id: 'c1-demo', name: 'فريد بلقاسم', phone: '0662345678', city: 'وهران', quantity: 2, product_name: 'طقم أطفال الربيع الفاخر', source: 'kids-set', status: 'delivered', created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString() },
  { id: 'o-3', landing_page_id: 'p1-demo', client_id: 'c1-demo', name: 'مريم حداد', phone: '0553456789', city: 'قسنطينة', quantity: 1, product_name: 'طقم أطفال الربيع الفاخر', source: 'kids-set', status: 'confirmed', created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() },
  { id: 'o-4', landing_page_id: 'p1-demo', client_id: 'c1-demo', name: 'ياسين زيري', phone: '0794567890', city: 'سطيف', quantity: 1, product_name: 'طقم أطفال الربيع الفاخر', source: 'kids-set', status: 'pending', created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() },
  { id: 'o-5', landing_page_id: 'p1-demo', client_id: 'c1-demo', name: 'نوال سليماني', phone: '0655678901', city: 'البليدة', quantity: 1, product_name: 'طقم أطفال الربيع الفاخر', source: 'kids-set', status: 'cancelled', created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() }
];

// LocalStorage helpers
const loadLocal = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const saveLocal = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Main unified DB class
class DatabaseService {
  // Get active clients
  private getClients(): Client[] {
    return loadLocal<Client[]>('yube_clients', DEFAULT_CLIENTS);
  }

  private saveClients(clients: Client[]) {
    saveLocal('yube_clients', clients);
  }

  // Get pages
  private getPages(): LandingPage[] {
    return loadLocal<LandingPage[]>('yube_pages', DEFAULT_PAGES);
  }

  private savePages(pages: LandingPage[]) {
    saveLocal('yube_pages', pages);
  }

  // Get orders
  private getOrders(): Order[] {
    return loadLocal<Order[]>('yube_orders', DEFAULT_ORDERS);
  }

  private saveOrders(orders: Order[]) {
    saveLocal('yube_orders', orders);
  }

  // Auth Operations
  auth = {
    signUp: async (businessName: string, email: string, password: string, whatsapp?: string) => {
      if (isSupabaseConfigured) {
        try {
          const { data: authData, error: authErr } = await supabase!.auth.signUp({
            email,
            password,
          });
          if (authErr) throw authErr;
          if (authData.user) {
            const clientSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const newClient: Client = {
              id: crypto.randomUUID(),
              user_id: authData.user.id,
              business_name: businessName,
              slug: clientSlug || `store-${Math.floor(Math.random() * 1000)}`,
              email,
              whatsapp,
              plan: 'trial',
              status: 'active',
              created_at: new Date().toISOString()
            };
            
            const { error: clientErr } = await supabase!.from('clients').insert([newClient]);
            if (clientErr) throw clientErr;
            
            // Log in locally too
            localStorage.setItem('yube_current_user', JSON.stringify(newClient));
            return { user: authData.user, client: newClient, error: null };
          }
        } catch (err: any) {
          return { user: null, client: null, error: err.message };
        }
      }

      // Mock Sign Up
      const clients = this.getClients();
      if (clients.some(c => c.email.toLowerCase() === email.toLowerCase())) {
        return { user: null, client: null, error: 'البريد الإلكتروني مستخدم بالفعل' };
      }

      const clientSlug = businessName.toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, '-').replace(/(^-|-$)/g, '');
      const mockUserId = `u-${crypto.randomUUID()}`;
      const mockClient: Client = {
        id: `c-${crypto.randomUUID()}`,
        user_id: mockUserId,
        business_name: businessName,
        slug: clientSlug || `store-${Math.floor(Math.random() * 1000)}`,
        email,
        whatsapp,
        plan: 'trial',
        status: 'active',
        created_at: new Date().toISOString()
      };

      clients.push(mockClient);
      this.saveClients(clients);
      
      localStorage.setItem('yube_current_user', JSON.stringify(mockClient));
      return { user: { id: mockUserId, email }, client: mockClient, error: null };
    },

    signIn: async (email: string, password: string) => {
      if (isSupabaseConfigured) {
        try {
          const { data: authData, error: authErr } = await supabase!.auth.signInWithPassword({
            email,
            password
          });
          if (authErr) throw authErr;
          if (authData.user) {
            // Get client profile
            const { data: clientData, error: clientErr } = await supabase!
              .from('clients')
              .select('*')
              .eq('user_id', authData.user.id)
              .single();
            
            if (clientErr) throw clientErr;
            
            localStorage.setItem('yube_current_user', JSON.stringify(clientData));
            return { user: authData.user, client: clientData, error: null };
          }
        } catch (err: any) {
          return { user: null, client: null, error: err.message };
        }
      }

      // Mock Sign In
      // NOTE: This entire mock/localStorage sign-in path is DEAD CODE —
      // this file (src/lib/db.ts) is excluded from the Next.js build via
      // tsconfig.json's "exclude": ["src"], and app/auth/actions.ts uses
      // real Supabase auth exclusively. This file is kept only as a
      // reference while porting Stage 2+ features from the old Vite
      // prototype.
      //
      // A hardcoded admin password bypass (email + 'admin123') used to
      // live here. It has been removed rather than left as dead code,
      // since dead code that grants admin access on a fixed password is
      // exactly the kind of thing that becomes a live vulnerability if
      // this file is ever accidentally imported or copied forward during
      // Stage 2-4 porting. Do NOT re-add a hardcoded credential bypass
      // when porting this logic — use real Supabase auth + the is_admin
      // column/RPC, as app/auth/actions.ts already does.
      const clients = this.getClients();
      const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (!client) {
        return { user: null, client: null, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      localStorage.setItem('yube_current_user', JSON.stringify(client));
      return { user: { id: client.user_id, email: client.email }, client, error: null };
    },

    signOut: async () => {
      if (isSupabaseConfigured) {
        await supabase!.auth.signOut();
      }
      localStorage.removeItem('yube_current_user');
    },

    getCurrentUser: (): Client | null => {
      const stored = localStorage.getItem('yube_current_user');
      return stored ? JSON.parse(stored) : null;
    },

    updateProfile: async (clientId: string, data: Partial<Client>) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase!
          .from('clients')
          .update(data)
          .eq('id', clientId);
        if (error) throw error;
      }
      
      const clients = this.getClients();
      const updated = clients.map(c => c.id === clientId ? { ...c, ...data } : c);
      this.saveClients(updated);

      // Update active user in storage if they are the current logged-in client
      const current = localStorage.getItem('yube_current_user');
      if (current) {
        const parsed = JSON.parse(current) as Client;
        if (parsed.id === clientId) {
          localStorage.setItem('yube_current_user', JSON.stringify({ ...parsed, ...data }));
        }
      }
      return { success: true };
    }
  };

  // Pages Operations
  pages = {
    list: async (clientId?: string): Promise<LandingPage[]> => {
      if (isSupabaseConfigured) {
        let query = supabase!.from('landing_pages').select('*');
        if (clientId) {
          query = query.eq('client_id', clientId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      }

      const pages = this.getPages();
      if (clientId) {
        return pages.filter(p => p.client_id === clientId).sort((a,b) => b.created_at.localeCompare(a.created_at));
      }
      return pages.sort((a,b) => b.created_at.localeCompare(a.created_at));
    },

    get: async (id: string): Promise<LandingPage | null> => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase!
          .from('landing_pages')
          .select('*')
          .eq('id', id)
          .single();
        if (error) return null;
        return data;
      }

      const pages = this.getPages();
      return pages.find(p => p.id === id) || null;
    },

    getBySlug: async (clientSlug: string, pageSlug: string): Promise<{ page: LandingPage; client: Client } | null> => {
      if (isSupabaseConfigured) {
        const { data: clientData, error: clientErr } = await supabase!
          .from('clients')
          .select('*')
          .eq('slug', clientSlug)
          .single();
        
        if (clientErr || !clientData) return null;

        const { data: pageData, error: pageErr } = await supabase!
          .from('landing_pages')
          .select('*')
          .eq('client_id', clientData.id)
          .eq('slug', pageSlug)
          .single();

        if (pageErr || !pageData) return null;

        return { page: pageData, client: clientData };
      }

      const clients = this.getClients();
      const client = clients.find(c => c.slug === clientSlug);
      if (!client) return null;

      const pages = this.getPages();
      const page = pages.find(p => p.client_id === client.id && p.slug === pageSlug);
      if (!page) return null;

      return { page, client };
    },

    create: async (pageData: Omit<LandingPage, 'id' | 'created_at' | 'updated_at'>): Promise<LandingPage> => {
      const nowStr = new Date().toISOString();
      const newPage: LandingPage = {
        ...pageData,
        id: `p-${crypto.randomUUID()}`,
        created_at: nowStr,
        updated_at: nowStr
      };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase!
          .from('landing_pages')
          .insert([newPage])
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const pages = this.getPages();
      // Enforce unique slug for client
      if (pages.some(p => p.client_id === pageData.client_id && p.slug === pageData.slug)) {
        throw new Error('رابط الصفحة مستخدم بالفعل لهذا المتجر. يرجى اختيار رابط آخر.');
      }
      pages.push(newPage);
      this.savePages(pages);
      return newPage;
    },

    update: async (id: string, pageData: Partial<LandingPage>): Promise<LandingPage> => {
      const nowStr = new Date().toISOString();
      
      if (isSupabaseConfigured) {
        const { data, error } = await supabase!
          .from('landing_pages')
          .update({ ...pageData, updated_at: nowStr })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const pages = this.getPages();
      const idx = pages.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('الصفحة غير موجودة');
      
      const updatedPage = { ...pages[idx], ...pageData, updated_at: nowStr };
      pages[idx] = updatedPage;
      this.savePages(pages);
      return updatedPage;
    },

    delete: async (id: string): Promise<boolean> => {
      if (isSupabaseConfigured) {
        const { error } = await supabase!
          .from('landing_pages')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      }

      const pages = this.getPages();
      const filtered = pages.filter(p => p.id !== id);
      this.savePages(filtered);
      return true;
    },

    listPendingReview: async (): Promise<(LandingPage & { client_business_name: string })[]> => {
      const currentUser = this.auth.getCurrentUser();
      const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';
      if (!currentUser || currentUser.email.toLowerCase() !== adminEmail.toLowerCase()) {
        throw new Error('Unauthorized admin access');
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase!
          .from('landing_pages')
          .select('*, clients(business_name)')
          .eq('status', 'pending_review')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []).map(p => ({
          ...p,
          client_business_name: p.clients?.business_name || 'عميل مجهول'
        }));
      }

      const pages = this.getPages().filter(p => p.status === 'pending_review');
      const clients = this.getClients();
      return pages.map(p => {
        const client = clients.find(c => c.id === p.client_id);
        return {
          ...p,
          client_business_name: client?.business_name || 'عميل مجهول'
        };
      }).sort((a,b) => b.created_at.localeCompare(a.created_at));
    },

    approve: async (id: string): Promise<void> => {
      const currentUser = this.auth.getCurrentUser();
      const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';
      if (!currentUser || currentUser.email.toLowerCase() !== adminEmail.toLowerCase()) {
        throw new Error('Unauthorized admin access');
      }

      const nowStr = new Date().toISOString();
      if (isSupabaseConfigured) {
        const { error } = await supabase!
          .from('landing_pages')
          .update({ status: 'live', published_at: nowStr, updated_at: nowStr })
          .eq('id', id);
        if (error) throw error;
        return;
      }

      const pages = this.getPages();
      const updated = pages.map(p => p.id === id ? { ...p, status: 'live' as const, published_at: nowStr, updated_at: nowStr } : p);
      this.savePages(updated);
    },

    reject: async (id: string, reason: string): Promise<void> => {
      const currentUser = this.auth.getCurrentUser();
      const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';
      if (!currentUser || currentUser.email.toLowerCase() !== adminEmail.toLowerCase()) {
        throw new Error('Unauthorized admin access');
      }

      const nowStr = new Date().toISOString();
      if (isSupabaseConfigured) {
        const { error } = await supabase!
          .from('landing_pages')
          .update({ status: 'rejected', rejection_reason: reason, updated_at: nowStr })
          .eq('id', id);
        if (error) throw error;
        return;
      }

      const pages = this.getPages();
      const updated = pages.map(p => p.id === id ? { ...p, status: 'rejected' as const, rejection_reason: reason, updated_at: nowStr } : p);
      this.savePages(updated);
    }
  };

  // Orders Operations
  orders = {
    list: async (clientId?: string): Promise<Order[]> => {
      if (isSupabaseConfigured) {
        let query = supabase!.from('orders').select('*');
        if (clientId) {
          query = query.eq('client_id', clientId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      }

      const orders = this.getOrders();
      if (clientId) {
        return orders.filter(o => o.client_id === clientId).sort((a,b) => b.created_at.localeCompare(a.created_at));
      }
      return orders.sort((a,b) => b.created_at.localeCompare(a.created_at));
    },

    create: async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
      const newOrder: Order = {
        ...orderData,
        id: `o-${crypto.randomUUID()}`,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase!
          .from('orders')
          .insert([newOrder])
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const orders = this.getOrders();
      orders.push(newOrder);
      this.saveOrders(orders);
      return newOrder;
    },

    updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase!
          .from('orders')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const orders = this.getOrders();
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) throw new Error('الطلب غير موجود');
      
      const updatedOrder = { ...orders[idx], status };
      orders[idx] = updatedOrder;
      this.saveOrders(orders);
      return updatedOrder;
    }
  };

  // System clients access for Admin Panel
  clients = {
    list: async (): Promise<(Client & { pages_count: number; orders_count: number })[]> => {
      const currentUser = this.auth.getCurrentUser();
      const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';
      if (!currentUser || currentUser.email.toLowerCase() !== adminEmail.toLowerCase()) {
        throw new Error('Unauthorized admin access');
      }

      if (isSupabaseConfigured) {
        // In real Supabase, we would fetch count or join
        const { data: clientsData, error: clientErr } = await supabase!.from('clients').select('*');
        if (clientErr) throw clientErr;

        const { data: pagesData } = await supabase!.from('landing_pages').select('client_id');
        const { data: ordersData } = await supabase!.from('orders').select('client_id');

        return (clientsData || []).map(client => {
          const pagesCount = (pagesData || []).filter(p => p.client_id === client.id).length;
          const ordersCount = (ordersData || []).filter(o => o.client_id === client.id).length;
          return {
            ...client,
            pages_count: pagesCount,
            orders_count: ordersCount
          };
        });
      }

      const clients = this.getClients();
      const pages = this.getPages();
      const orders = this.getOrders();

      return clients.map(client => {
        const pagesCount = pages.filter(p => p.client_id === client.id).length;
        const ordersCount = orders.filter(o => o.client_id === client.id).length;
        return {
          ...client,
          pages_count: pagesCount,
          orders_count: ordersCount
        };
      });
    },

    updateStatus: async (id: string, status: Client['status']): Promise<void> => {
      const currentUser = this.auth.getCurrentUser();
      const adminEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'ayoublamara52@gmail.com';
      if (!currentUser || currentUser.email.toLowerCase() !== adminEmail.toLowerCase()) {
        throw new Error('Unauthorized admin access');
      }

      if (isSupabaseConfigured) {
        const { error } = await supabase!
          .from('clients')
          .update({ status })
          .eq('id', id);
        if (error) throw error;
        return;
      }

      const clients = this.getClients();
      const updated = clients.map(c => c.id === id ? { ...c, status } : c);
      this.saveClients(updated);
    },

    getStats: async (clientId: string) => {
      const orders = await this.orders.list(clientId);
      const pages = await this.pages.list(clientId);

      const totalOrders = orders.length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
      
      // Calculate conversion rate: delivered / total
      const conversionRate = totalOrders > 0 
        ? parseFloat(((deliveredOrders / totalOrders) * 100).toFixed(1)) 
        : 0;

      // Calculate total sales
      // Each page has its own price, let's map order to product price
      let totalSales = 0;
      orders.forEach(o => {
        if (o.status !== 'cancelled') {
          const page = pages.find(p => p.id === o.landing_page_id);
          const price = page ? page.price : 3000; // fallback default price
          totalSales += price * (o.quantity || 1);
        }
      });

      return {
        totalOrders,
        deliveredOrders,
        confirmedOrders,
        totalSales,
        conversionRate,
        pagesCount: pages.length
      };
    }
  };
}

export const db = new DatabaseService();
