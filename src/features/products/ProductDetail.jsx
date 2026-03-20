import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchProductById } from './useProducts';
import { addToCart } from '../cart/useCart';
import { getOrCreateConversation } from '../messages/useMessages';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [cartMsg, setCartMsg] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isMessagingSeller, setIsMessagingSeller] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      try {
        const item = await fetchProductById(id);

        if (!ignore) {
          setProduct(item);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load this product right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  const isOwner = user && product && user.id === product.seller_id;

  const handleAddToCart = async () => {
    setErrorMsg('');
    setCartMsg('');

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (isOwner) {
      setErrorMsg('You cannot add your own listing to your cart.');
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart({
        userId: user.id,
        productId: product.id,
        sellerId: product.seller_id,
      });
      setCartMsg('Added to cart.');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to add this listing to your cart right now.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleMessageSeller = async () => {
    setErrorMsg('');
    setCartMsg('');

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (isOwner) {
      setErrorMsg('You cannot message yourself about your own listing.');
      return;
    }

    setIsMessagingSeller(true);

    try {
      const conversation = await getOrCreateConversation({
        buyerId: user.id,
        sellerId: product.seller_id,
        productId: product.id,
      });

      navigate(`/messages/${conversation.id}`);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to open a conversation right now.');
    } finally {
      setIsMessagingSeller(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      {loading && <p className="text-gray-600">Loading product...</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {!loading && !errorMsg && product && (
        <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-lg bg-gray-200">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-sm text-gray-500">No image available</div>
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Neighborhood listing</p>
            {product.category?.name && (
              <p className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                {product.category.name}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-blue-700">${Number(product.price ?? 0).toFixed(2)}</p>
            <p className="mt-6 whitespace-pre-line text-gray-700">
              {product.description || 'No description provided.'}
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>Seller: {product.seller?.full_name || 'Unknown seller'}</p>
              <p>Posted: {new Date(product.created_at).toLocaleDateString()}</p>
            </div>
            {cartMsg && <p className="mt-6 text-sm font-medium text-emerald-700">{cartMsg}</p>}
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {!isOwner && (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {isAddingToCart ? 'Adding...' : 'Add to cart'}
                  </button>
                  <button
                    type="button"
                    onClick={handleMessageSeller}
                    disabled={isMessagingSeller}
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70"
                  >
                    {isMessagingSeller ? 'Opening chat...' : 'Message seller'}
                  </button>
                </>
              )}
              {isOwner && (
                <Link
                  to={`/products/edit/${product.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                  Edit listing
                </Link>
              )}
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Back to products
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
