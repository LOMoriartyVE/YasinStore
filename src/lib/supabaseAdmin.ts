import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isPlaceholder = !serviceKey || serviceKey === 'your_service_role_key_here';

// Server-only Supabase client using the Service Role Key.
// Falls back to the Anon Key during local development if Service Role Key is not configured.
export const supabaseAdmin = createClient(
  supabaseUrl,
  isPlaceholder ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : serviceKey
);
