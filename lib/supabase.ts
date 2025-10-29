import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Gracefully handle refresh token errors
    storageKey: 'supabase-auth',
  },
});

// Types voor de database
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
};

// Helper functie om te checken of een user admin is
// Deze functie haalt de role op van de ingelogde gebruiker
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    console.log('Checking admin status for user:', userId);
    
    // Haal de current session op
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session');
      return false;
    }
    
    console.log('Session user ID:', session.user.id);
    console.log('Requested user ID:', userId);
    
    if (session.user.id !== userId) {
      console.log('User ID mismatch');
      return false;
    }

    // Haal de user's eigen data op (dit werkt altijd door de "view own profile" policy)
    // Gebruik maybeSingle() in plaats van single() om geen error te krijgen bij 0 rows
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    console.log('Query result:', { data, error });

    if (error) {
      console.error('Error checking admin status:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return false;
    }

    if (!data) {
      console.log('No user data found in users table for userId:', userId);
      console.log('User may not have a profile yet. Treating as non-admin.');
      return false;
    }

    console.log('User role:', data.role);
    return data?.role === 'admin';
  } catch (err) {
    console.error('Error in isAdmin:', err);
    return false;
  }
}


