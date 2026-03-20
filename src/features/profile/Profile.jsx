import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchProductsBySeller, fetchProfile } from './useProfile';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const [profileData, productData] = await Promise.all([
          fetchProfile(user.id),
          fetchProductsBySeller(user.id),
        ]);

        if (!ignore) {
          setProfile(profileData);
          setProducts(productData);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load your profile right now.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="bg-[linear-gradient(180deg,_#fffaf5_0%,_#f9fafb_25%,_#f9fafb_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="animate-fade-up rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            {loading && <p className="text-gray-600">Loading profile...</p>}
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}

            {!loading && !errorMsg && (
              <>
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-2xl font-bold text-orange-700">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name || 'Profile'} className="h-full w-full object-cover" />
                    ) : (
                      (profile?.full_name || user.email || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Your profile</p>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                      {profile?.full_name || 'Set your profile name'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-orange-700">Listings posted</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{products.length}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-emerald-700">Member since</p>
                    <p className="mt-2 text-base font-semibold text-gray-900">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently joined'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Full name</p>
                    <p className="mt-2 font-semibold text-gray-900">{profile?.full_name || 'Not set yet'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Avatar URL</p>
                    <p className="mt-2 break-all text-sm text-gray-700">{profile?.avatar_url || 'Not set yet'}</p>
                  </div>
                </div>

                <Link
                  to="/profile/edit"
                  className="mt-8 inline-flex rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
                >
                  Edit profile
                </Link>
              </>
            )}
          </div>

          <div className="animate-fade-up-delayed rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Your listings</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Recent products you posted</h2>
              </div>
              <Link to="/products/create" className="text-sm font-semibold text-orange-700 hover:underline">
                New listing
              </Link>
            </div>

            {!loading && products.length === 0 && (
              <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                <p className="text-lg font-semibold text-gray-900">No listings yet</p>
                <p className="mt-3 text-gray-600">Create your first product to start building your profile.</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="mt-8 space-y-4">
                {products.map(product => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="flex items-center gap-4 rounded-3xl border border-gray-100 p-4 transition hover:border-orange-200 hover:bg-orange-50/50"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Posted {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-base font-bold text-emerald-700">${Number(product.price ?? 0).toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
