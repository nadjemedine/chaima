import { supabase } from '../lib/supabase';
import type { Program } from '../lib/supabase';

// Get all programs (public: active only, admin: all)
export async function getPrograms(adminMode = false): Promise<Program[]> {
  let query = supabase.from('programs').select('*').order('created_at', { ascending: false });
  if (!adminMode) {
    query = query.eq('active', true);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Program[]) || [];
}

// Create a program
export async function createProgram(program: Omit<Program, 'id' | 'created_at'>): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .insert([program])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Program;
}

// Update a program
export async function updateProgram(id: number, updates: Partial<Program>): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Program;
}

// Delete a program
export async function deleteProgramAPI(id: number): Promise<void> {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// Toggle program active status
export async function toggleProgramStatus(id: number, active: boolean): Promise<Program> {
  return updateProgram(id, { active });
}
