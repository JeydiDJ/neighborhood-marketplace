import { supabase } from '../../api/supabaseClient';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, full_name, avatar_url, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchProductsBySeller(userId) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url, created_at')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    throw error;
  }

  return data ?? [];
}
