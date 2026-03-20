import { supabase } from '../../api/supabaseClient';

const PRODUCT_IMAGES_BUCKET = 'product-images';

function attachRelatedData(products, profiles, categories) {
  const profilesById = new Map(profiles.map(profile => [profile.id, profile]));
  const categoriesById = new Map(categories.map(category => [category.id, category]));

  return products.map(product => ({
    ...product,
    seller: product.seller_id ? profilesById.get(product.seller_id) ?? null : null,
    category: product.category_id ? categoriesById.get(product.category_id) ?? null : null,
  }));
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchProducts(options = {}) {
  const { limit } = options;

  let query = supabase
    .from('products')
    .select('id, name, description, price, image_url, created_at, category_id, seller_id')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const sellerIds = [...new Set((data ?? []).map(product => product.seller_id).filter(Boolean))];
  const categoryIds = [...new Set((data ?? []).map(product => product.category_id).filter(Boolean))];

  let profiles = [];
  let categories = [];

  if (sellerIds.length > 0) {
    const { data: profileData, error: profilesError } = await supabase
      .from('users')
      .select('id, full_name, avatar_url')
      .in('id', sellerIds);

    if (profilesError) {
      throw profilesError;
    }

    profiles = profileData ?? [];
  }

  if (categoryIds.length > 0) {
    const { data: categoryData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .in('id', categoryIds);

    if (categoriesError) {
      throw categoriesError;
    }

    categories = categoryData ?? [];
  }

  return attachRelatedData(data ?? [], profiles, categories);
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, created_at, category_id, seller_id')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  let profile = null;
  let category = null;

  if (data?.seller_id) {
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('id, full_name, avatar_url')
      .eq('id', data.seller_id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    profile = profileData ?? null;
  }

  if (data?.category_id) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', data.category_id)
      .maybeSingle();

    if (categoryError) {
      throw categoryError;
    }

    category = categoryData ?? null;
  }

  return {
    ...data,
    seller: profile,
    category,
  };
}

export async function createProduct(product) {
  const { data, error } = await supabase.from('products').insert(product).select().single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadProductImage({ file, userId }) {
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
  const filePath = `${userId}/${Date.now()}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}
