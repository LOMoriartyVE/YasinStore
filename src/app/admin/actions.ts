'use server';

import { supabase } from '../../lib/supabase';
import type { Product } from '../gamesData';

export async function getProducts(): Promise<{ data: Product[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data || [], error: null };
}

export async function addProduct(product: Product): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.from('product').insert([product]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteProduct(name: string): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.from('product').delete().eq('name', name);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
