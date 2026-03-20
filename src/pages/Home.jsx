import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import ProductCard from '../features/products/ProductCard';
import { fetchProducts } from '../features/products/useProducts';
import nearbuyLogo from '../assets/site-brand/nearbuy-logo.png';

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadLatestProducts = async () => {
      try {
        const items = await fetchProducts({ limit: 6 });

        if (!ignore) {
          setProducts(items);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load the latest listings right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadLatestProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main>
      <section className="ambient-shell overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.35),_transparent_30%),linear-gradient(135deg,_#fff7ed,_#ffffff_45%,_#fef3c7)]">
        <div className="ambient-orb ambient-orb-orange" />
        <div className="ambient-orb ambient-orb-rose" />
        <div className="ambient-orb ambient-orb-gold" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3">
              <img src={nearbuyLogo} alt="NearBuy" className="h-14 w-14 rounded-2xl object-cover shadow-sm sm:h-16 sm:w-16" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">NearBuy</p>
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Buy nearby, sell faster, and discover useful things around the corner
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Keep listings local, move items faster, and make your marketplace feel like a real part of the community.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700"
              >
                Browse listings
              </Link>
              <Link
                to={user ? '/products/create' : '/signup'}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 hover:border-gray-400"
              >
                {user ? 'Post a listing' : 'Join and start selling'}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="animate-fade-up-delayed rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Recent Activity</p>
              <p className="mt-4 text-4xl font-bold text-gray-900">{loading ? '...' : products.length}</p>
              <p className="mt-2 text-sm text-gray-600">Fresh listings featured on the home page.</p>
            </div>
            <div className="animate-fade-up-delayed rounded-3xl bg-gray-900 p-6 text-white shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Easy Selling</p>
              <p className="mt-4 text-2xl font-bold">List an item in minutes</p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Add a photo, set your price, and let nearby buyers find you.
              </p>
            </div>
            <div className="animate-fade-up-delayed rounded-3xl bg-orange-500 p-6 text-white shadow-sm sm:col-span-2">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-100">Why local works</p>
              <p className="mt-3 text-2xl font-bold">Less shipping, faster pickup, better trust.</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">
                The best marketplace home page should do two things well: show that real listings exist and make posting your own item feel easy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ambient-shell mx-auto max-w-6xl px-4 py-14">
        <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Latest Listings</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Fresh from your neighborhood</h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              Start with the newest listings here, then jump to the full products page when you want to browse everything.
            </p>
          </div>
          <Link className="inline-flex rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700" to="/products">
            View all products
          </Link>
        </div>

        {loading && <p className="mt-8 text-gray-600">Loading latest listings...</p>}
        {errorMsg && <p className="mt-8 text-red-500">{errorMsg}</p>}

        {!loading && !errorMsg && products.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">No listings yet</h3>
            <p className="mt-3 text-gray-600">
              Be the first person in your neighborhood to post something for sale.
            </p>
            <Link
              to={user ? '/products/create' : '/signup'}
              className="mt-6 inline-flex rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
            >
              {user ? 'Create the first listing' : 'Create an account'}
            </Link>
          </div>
        )}

        {!loading && !errorMsg && products.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
