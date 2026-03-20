import { supabase } from '../../api/supabaseClient';

export async function fetchCartItems(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, user_id, product_id, quantity, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const items = data ?? [];
  const productIds = [...new Set(items.map(item => item.product_id).filter(Boolean))];

  if (productIds.length === 0) {
    return [];
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, seller_id')
    .in('id', productIds);

  if (productsError) {
    throw productsError;
  }

  const productsById = new Map((products ?? []).map(product => [product.id, product]));

  return items
    .map(item => ({
      ...item,
      product: productsById.get(item.product_id) ?? null,
    }))
    .filter(item => item.product);
}

export async function fetchCartCount(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return (data ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

export async function addToCart({ userId, productId, sellerId, quantity = 1 }) {
  if (userId === sellerId) {
    throw new Error('You cannot add your own listing to your cart.');
  }

  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existingItem) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      quantity,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCartItemQuantity(id, quantity) {
  if (quantity <= 0) {
    return removeCartItem(id);
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function removeCartItem(id) {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
