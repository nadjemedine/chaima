import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';

// Get all products (public: active only, admin: all)
export async function getProducts(adminMode = false): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (!adminMode) {
    query = query.eq('active', true);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Product[]) || [];
}

// Get a single product
export async function getProduct(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Product;
}

// Create a product
export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

// Update a product
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

// Delete a product
export async function deleteProductAPI(id: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// Toggle product active status
export async function toggleProductStatus(id: number, active: boolean): Promise<Product> {
  return updateProduct(id, { active });
}
