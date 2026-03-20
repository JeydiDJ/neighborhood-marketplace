import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  subscribeToConversationMessages,
} from './useMessages';

function ConversationList({ conversations, selectedConversationId, onSelect }) {
  return (
    <div className="space-y-3">
      {conversations.map(conversation => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelect(conversation.id)}
          className={`w-full rounded-3xl border p-4 text-left transition ${
            selectedConversationId === conversation.id
              ? 'border-orange-200 bg-orange-50'
              : 'border-gray-100 bg-white hover:border-orange-100 hover:bg-orange-50/40'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-sm font-bold text-orange-700">
              {conversation.otherUser?.avatar_url ? (
                <img
                  src={conversation.otherUser.avatar_url}
                  alt={conversation.otherUser.full_name || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                (conversation.otherUser?.full_name || '?').charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {conversation.otherUser?.full_name || 'Unknown seller'}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {conversation.product?.name || 'Listing'}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-gray-400">
                  {new Date(
                    conversation.latestMessage?.created_at || conversation.created_at
                  ).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 truncate text-sm text-gray-600">
                {conversation.latestMessage?.body || 'No messages yet.'}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedConversation = useMemo(
    () => conversations.find(conversation => conversation.id === conversationId) ?? null,
    [conversationId, conversations]
  );

  useEffect(() => {
    let ignore = false;

    const loadConversations = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const items = await fetchConversations(user.id);

        if (!ignore) {
          setConversations(items);

          if (!conversationId && items.length > 0) {
            navigate(`/messages/${items[0].id}`, { replace: true });
          }
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load your conversations right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadConversations();

    return () => {
      ignore = true;
    };
  }, [conversationId, navigate, user]);

  useEffect(() => {
    let ignore = false;

    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);

      try {
        const items = await fetchMessages(conversationId);

        if (!ignore) {
          setMessages(items);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load this conversation right now.');
        }
      } finally {
        if (!ignore) {
          setLoadingMessages(false);
        }
      }
    };

    loadMessages();

    return () => {
      ignore = true;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      return undefined;
    }

    return subscribeToConversationMessages(conversationId, async () => {
      try {
        const [messageItems, conversationItems] = await Promise.all([
          fetchMessages(conversationId),
          user?.id ? fetchConversations(user.id) : Promise.resolve([]),
        ]);

        setMessages(messageItems);
        if (user?.id) {
          setConversations(conversationItems);
        }
      } catch {
        // Quietly ignore transient realtime refresh errors.
      }
    });
  }, [conversationId, user]);

  const handleSelectConversation = id => {
    navigate(`/messages/${id}`);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMsg('');

    if (!conversationId || !user?.id) {
      return;
    }

    setIsSending(true);

    try {
      await sendMessage({
        conversationId,
        senderId: user.id,
        body: draft,
      });
      setDraft('');

      const [messageItems, conversationItems] = await Promise.all([
        fetchMessages(conversationId),
        fetchConversations(user.id),
      ]);

      setMessages(messageItems);
      setConversations(conversationItems);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to send your message right now.');
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="bg-[linear-gradient(180deg,_#fffaf5_0%,_#f9fafb_30%,_#f9fafb_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-orange-100 via-white to-amber-50 px-6 py-10 shadow-sm sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Messages</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">Talk with buyers and sellers</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Keep questions, pickup details, and negotiation in one place for each listing.
          </p>
        </div>

        {errorMsg && <p className="mt-6 text-red-500">{errorMsg}</p>}
        {loading && <p className="mt-6 text-gray-600">Loading conversations...</p>}

        {!loading && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <aside className={`${conversationId ? 'hidden lg:block' : 'block'} animate-fade-up rounded-3xl bg-white p-5 shadow-sm`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Inbox</h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  {conversations.length}
                </span>
              </div>

              {conversations.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                  <p className="text-lg font-semibold text-gray-900">No conversations yet</p>
                  <p className="mt-3 text-gray-600">Start from a product page by tapping Message seller.</p>
                  <Link
                    to="/products"
                    className="mt-6 inline-flex rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                <div className="mt-6">
                  <ConversationList
                    conversations={conversations}
                    selectedConversationId={conversationId}
                    onSelect={handleSelectConversation}
                  />
                </div>
              )}
            </aside>

            <div className={`${!conversationId ? 'hidden lg:block' : 'block'} animate-fade-up-delayed rounded-3xl bg-white shadow-sm`}>
              {!conversationId && (
                <div className="flex min-h-[32rem] items-center justify-center px-6 text-center text-gray-500">
                  Select a conversation to start chatting.
                </div>
              )}

              {conversationId && (
                <div className="flex min-h-[32rem] flex-col">
                  <div className="border-b border-gray-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => navigate('/messages')}
                      className="mb-3 inline-flex rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-50 lg:hidden"
                    >
                      Back to inbox
                    </button>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold text-gray-900">
                          {selectedConversation?.otherUser?.full_name || 'Conversation'}
                        </h2>
                        <p className="truncate text-sm text-gray-500">
                          {selectedConversation?.product?.name || 'Listing'}
                        </p>
                      </div>
                      {selectedConversation?.product && (
                        <Link
                          to={`/products/${selectedConversation.product.id}`}
                          className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-700 transition hover:bg-orange-100"
                        >
                          View listing
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 px-5 py-5">
                    {loadingMessages && <p className="text-gray-600">Loading messages...</p>}
                    {!loadingMessages && messages.length === 0 && (
                      <div className="rounded-3xl bg-gray-50 px-6 py-12 text-center text-gray-500">
                        No messages yet. Start the conversation below.
                      </div>
                    )}
                    {!loadingMessages &&
                      messages.map(message => {
                        const isMine = message.sender_id === user.id;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                                isMine
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-orange-50 text-gray-800'
                              }`}
                            >
                              <p>{message.body}</p>
                              <p
                                className={`mt-2 text-xs ${
                                  isMine ? 'text-gray-300' : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <form onSubmit={handleSubmit} className="border-t border-gray-100 px-5 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <textarea
                        value={draft}
                        onChange={event => setDraft(event.target.value)}
                        rows="3"
                        className="min-h-[3.5rem] flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Ask about pickup, condition, or availability..."
                      />
                      <button
                        type="submit"
                        disabled={isSending || !draft.trim()}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50 sm:min-w-[6.5rem]"
                      >
                        {isSending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
