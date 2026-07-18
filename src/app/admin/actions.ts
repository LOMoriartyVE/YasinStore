'use server';

import { supabaseAdmin } from '../../lib/supabaseAdmin';
import type { Product } from '../gamesData';

// ────────────────────────────────────────
// Authentication — checks WS_ADMIN_PASS on the server
// ────────────────────────────────────────
export async function verifyAdminPassword(
  password: string
): Promise<{ success: boolean }> {
  const correct = process.env.WS_ADMIN_PASS;
  if (!correct) {
    console.error('WS_ADMIN_PASS env var is not set');
    return { success: false };
  }
  return { success: password === correct };
}

// ────────────────────────────────────────
// Products — all use supabaseAdmin (bypasses RLS)
// ────────────────────────────────────────
export async function getProducts(): Promise<{
  data: Product[] | null;
  error: string | null;
}> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: data || [], error: null };
}

export async function addProduct(
  product: Product
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin.from('products').insert([product]);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export async function deleteProduct(
  name: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('name', name);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ────────────────────────────────────────
// Requests — admin order management (bypasses RLS)
// ────────────────────────────────────────

interface RequestItem {
  product_name: string;
  price: number;
  asia_price: number;
  platform: number;
}

interface GameRequest {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: RequestItem[];
}

export async function getRequests(): Promise<{
  data: GameRequest[];
  error: string | null;
}> {
  const { data: reqData, error: reqErr } = await supabaseAdmin
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (reqErr || !reqData)
    return { data: [], error: reqErr?.message || 'Failed to fetch requests' };

  const { data: itemsData, error: itemsErr } = await supabaseAdmin
    .from('request_items')
    .select('*');

  if (itemsErr) console.error('Error fetching items:', itemsErr);

  const itemsByReq: Record<string, RequestItem[]> = {};
  (itemsData || []).forEach((item: any) => {
    if (!itemsByReq[item.request_id]) itemsByReq[item.request_id] = [];
    itemsByReq[item.request_id].push({
      product_name: item.product_name,
      price: item.price,
      asia_price: item.asia_price || 0,
      platform: item.platform || 1,
    });
  });

  const requests: GameRequest[] = reqData.map((r: any) => ({
    ...r,
    items: itemsByReq[r.id] || [],
  }));

  return { data: requests, error: null };
}

export async function updateRequestStatus(
  id: string,
  newStatus: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin
    .from('requests')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export async function deleteRequest(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  // Delete child items first, then the request
  await supabaseAdmin.from('request_items').delete().eq('request_id', id);
  const { error } = await supabaseAdmin
    .from('requests')
    .delete()
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export async function clearCompletedRequests(): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Get all completed IDs
  const { data } = await supabaseAdmin
    .from('requests')
    .select('id')
    .eq('status', 'COMPLETED');

  if (!data || data.length === 0)
    return { success: true, error: null };

  const ids = data.map((r: any) => r.id);

  // Delete items then requests
  for (const id of ids) {
    await supabaseAdmin.from('request_items').delete().eq('request_id', id);
  }
  const { error } = await supabaseAdmin
    .from('requests')
    .delete()
    .in('id', ids);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ────────────────────────────────────────
// User Orders — secure retrieval/deletion bypassing RLS for user dashboard
// ────────────────────────────────────────

export async function getUserOrders(
  userId: string
): Promise<{ data: any[] | null; error: string | null }> {
  const { data, error } = await supabaseAdmin
    .from('requests')
    .select('*, request_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data || [], error: null };
}

export async function deleteUserOrder(
  userId: string,
  orderId: string
): Promise<{ success: boolean; error: string | null }> {
  const { data, error: fetchError } = await supabaseAdmin
    .from('requests')
    .select('user_id')
    .eq('id', orderId)
    .single();

  if (fetchError || !data) {
    return { success: false, error: fetchError?.message || 'Order not found' };
  }

  if (data.user_id !== userId) {
    return { success: false, error: 'Unauthorized to delete this order' };
  }

  await supabaseAdmin.from('request_items').delete().eq('request_id', orderId);
  const { error } = await supabaseAdmin
    .from('requests')
    .delete()
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}
