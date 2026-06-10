import { supabase } from '../lib/supabase';
import type { Order } from '../lib/supabase';

// Get all orders
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Order[]) || [];
}

// Get orders filtered by status
export async function getOrdersByStatus(status: 'completed' | 'pending' | 'failed'): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Order[]) || [];
}

// Create an order (called after payment)
export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Order;
}

// Update order status
export async function updateOrderStatus(id: number, status: 'completed' | 'pending' | 'failed'): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Order;
}
