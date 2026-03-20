import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchProductById } from './useProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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
            {isOwner && (
              <Link
                to={`/products/edit/${product.id}`}
                className="mt-8 inline-flex rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-700"
              >
                Edit listing
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
