import { supabase } from '../../api/supabaseClient';

async function fetchProfiles(userIds) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .in('id', uniqueIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function fetchProducts(productIds) {
  const uniqueIds = [...new Set(productIds.filter(Boolean))];

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url, price, seller_id')
    .in('id', uniqueIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function fetchLatestMessages(conversationIds) {
  const uniqueIds = [...new Set(conversationIds.filter(Boolean))];

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, body, sender_id, created_at')
    .in('conversation_id', uniqueIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const latestByConversation = new Map();

  for (const message of data ?? []) {
    if (!latestByConversation.has(message.conversation_id)) {
      latestByConversation.set(message.conversation_id, message);
    }
  }

  return [...latestByConversation.values()];
}

export async function fetchConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, product_id, buyer_id, seller_id, created_at')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const conversations = data ?? [];
  const productIds = conversations.map(conversation => conversation.product_id);
  const participantIds = conversations.flatMap(conversation => [conversation.buyer_id, conversation.seller_id]);

  const [products, profiles, latestMessages] = await Promise.all([
    fetchProducts(productIds),
    fetchProfiles(participantIds),
    fetchLatestMessages(conversations.map(conversation => conversation.id)),
  ]);

  const productsById = new Map(products.map(product => [product.id, product]));
  const profilesById = new Map(profiles.map(profile => [profile.id, profile]));
  const latestMessagesByConversation = new Map(
    latestMessages.map(message => [message.conversation_id, message])
  );

  return conversations.map(conversation => {
    const otherUserId =
      conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id;

    return {
      ...conversation,
      product: productsById.get(conversation.product_id) ?? null,
      otherUser: profilesById.get(otherUserId) ?? null,
      latestMessage: latestMessagesByConversation.get(conversation.id) ?? null,
    };
  });
}

export async function getOrCreateConversation({ buyerId, sellerId, productId }) {
  if (buyerId === sellerId) {
    throw new Error('You cannot message yourself about your own listing.');
  }

  const { data: existingConversation, error: fetchError } = await supabase
    .from('conversations')
    .select('id, product_id, buyer_id, seller_id, created_at')
    .eq('buyer_id', buyerId)
    .eq('product_id', productId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existingConversation) {
    return existingConversation;
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      product_id: productId,
    })
    .select('id, product_id, buyer_id, seller_id, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function sendMessage({ conversationId, senderId, body }) {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new Error('Message cannot be empty.');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body: trimmedBody,
    })
    .select('id, conversation_id, sender_id, body, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function subscribeToConversationMessages(conversationId, onChange) {
  const channel = supabase
    .channel(`conversation-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      onChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
