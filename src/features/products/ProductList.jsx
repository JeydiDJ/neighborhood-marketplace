import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchCategories, fetchProducts } from './useProducts';
import ProductCard from './ProductCard';

export default function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProductsAndCategories = async () => {
      try {
        const [items, categoryList] = await Promise.all([fetchProducts(), fetchCategories()]);

        if (!ignore) {
          setProducts(items);
          setCategories(categoryList);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load products right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProductsAndCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = selectedCategoryId
    ? products.filter(product => product.category_id === selectedCategoryId)
    : products;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-orange-100 via-amber-50 to-white px-6 py-10 shadow-sm sm:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Browse Listings</p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Find what people nearby are selling</h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Explore fresh neighborhood listings, compare prices quickly, and jump into item details without any clutter.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-gray-600 shadow-sm">
              {loading ? 'Loading listing count...' : `${filteredProducts.length} listing${filteredProducts.length === 1 ? '' : 's'} available`}
            </div>
            {user && (
              <Link className="inline-flex rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700" to="/products/create">
                Create listing
              </Link>
            )}
          </div>
        </div>
      </div>

      {loading && <p className="mt-8 text-gray-600">Loading products...</p>}
      {errorMsg && <p className="mt-8 text-red-500">{errorMsg}</p>}

      {!loading && !errorMsg && categories.length > 0 && (
        <div className="animate-fade-up mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategoryId === '' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
            }`}
          >
            All categories
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategoryId === category.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {!loading && !errorMsg && filteredProducts.length === 0 && (
        <div className="mt-8 rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">
            {products.length === 0 ? 'No products have been listed yet.' : 'No products match that category yet.'}
          </p>
        </div>
      )}

      {!loading && !errorMsg && filteredProducts.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
