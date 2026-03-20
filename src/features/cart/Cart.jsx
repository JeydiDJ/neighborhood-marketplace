import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchCartItems, removeCartItem, updateCartItemQuantity } from './useCart';

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingId, setPendingId] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const items = await fetchCartItems(user.id);

        if (!ignore) {
          setCartItems(items);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load your cart right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, [user]);

  const total = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item.product?.price ?? 0);
        return sum + price * item.quantity;
      }, 0),
    [cartItems]
  );

  const handleQuantityChange = async (itemId, nextQuantity) => {
    setErrorMsg('');
    setPendingId(itemId);

    try {
      await updateCartItemQuantity(itemId, nextQuantity);
      const items = await fetchCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to update quantity right now.');
    } finally {
      setPendingId('');
    }
  };

  const handleRemove = async itemId => {
    setErrorMsg('');
    setPendingId(itemId);

    try {
      await removeCartItem(itemId);
      setCartItems(current => current.filter(item => item.id !== itemId));
    } catch (error) {
      setErrorMsg(error.message || 'Unable to remove this item right now.');
    } finally {
      setPendingId('');
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-orange-50 px-6 py-10 shadow-sm sm:px-10">
        <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Review saved items, adjust quantities, and keep track of what you want to buy next.
        </p>
      </div>

      {loading && <p className="mt-8 text-gray-600">Loading your cart...</p>}
      {errorMsg && <p className="mt-8 text-red-500">{errorMsg}</p>}

      {!loading && !errorMsg && cartItems.length === 0 && (
        <div className="mt-8 rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-3 text-gray-600">Browse listings and save the items you want to come back to.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
          >
            Browse products
          </Link>
        </div>
      )}

      {!loading && cartItems.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {cartItems.map(item => (
              <article key={item.id} className="animate-fade-up rounded-3xl bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-32 w-full overflow-hidden rounded-2xl bg-gray-100 sm:w-36">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">No image</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">{item.product?.name}</h2>
                          <p className="mt-2 text-sm text-gray-600">
                            {item.product?.description || 'No description provided.'}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-emerald-700">
                          ${Number(item.product?.price ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-white"
                          disabled={pendingId === item.id}
                        >
                          -
                        </button>
                        <span className="min-w-10 px-3 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-white"
                          disabled={pendingId === item.id}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <Link to={`/products/${item.product_id}`} className="text-sm font-medium text-orange-700 hover:underline">
                          View listing
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="text-sm font-medium text-red-600 hover:underline"
                          disabled={pendingId === item.id}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="animate-fade-up rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-gray-900 px-5 py-3 font-semibold text-white opacity-60"
              disabled
            >
              Checkout coming soon
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
