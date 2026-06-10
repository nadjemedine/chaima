import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Types ───

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  features: string[];
  popular: boolean;
  active: boolean;
  created_at: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_urls: string[];
  file_url: string;
  features: string[];
  active: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  product_title: string;
  amount: number;
  payment_mode: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}
