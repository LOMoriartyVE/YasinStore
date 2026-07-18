'use server';

import { randomUUID } from 'crypto';
import { supabase } from '../../lib/supabase';

export interface CheckoutItem {
  title: string;
  price: number;
  asiaPrice: number | null;
  platform: number;
}

export async function submitCheckout(
  items: CheckoutItem[],
  total: number
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  if (!items.length) {
    return { success: false, error: 'Your cart is empty.' };
  }

  // Generate a proper UUID v4 for the order ID
  const reqId = randomUUID();

  const { error: reqError } = await supabase.from('requests').insert([
    {
      id: reqId,
      status: 'PENDING',
      total_amount: total,
    },
  ]);

  if (reqError) {
    return { success: false, error: reqError.message };
  }

  const requestItems = items.map((item) => ({
    request_id: reqId,
    product_name: item.title,
    price: item.price,
    asia_price: item.asiaPrice || 0,
    platform: item.platform,
  }));

  const { error: itemsError } = await supabase
    .from('request_items')
    .insert(requestItems);

  if (itemsError) {
    await supabase.from('requests').delete().eq('id', reqId);
    return { success: false, error: itemsError.message };
  }

  return { success: true, requestId: reqId };
}
