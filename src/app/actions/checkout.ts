'use server';

import { supabase } from '../../lib/supabase';

export interface CheckoutItem {
  title: string;
  price: number;
}

export async function submitCheckout(
  items: CheckoutItem[],
  total: number
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  if (!items.length) {
    return { success: false, error: 'Your cart is empty.' };
  }

  const reqId = 'REQ-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const { error: reqError } = await supabase.from('Requests').insert([
    {
      id: reqId,
      status: 'PENDING',
      total_amounr: total,
    },
  ]);

  if (reqError) {
    return { success: false, error: reqError.message };
  }

  const requestItems = items.map((item) => ({
    request_id: reqId,
    product_name: item.title,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from('request_items').insert(requestItems);

  if (itemsError) {
    await supabase.from('Requests').delete().eq('id', reqId);
    return { success: false, error: itemsError.message };
  }

  return { success: true, requestId: reqId };
}
