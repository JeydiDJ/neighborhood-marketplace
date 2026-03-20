import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchProfile, updateProfile } from './useProfile';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile(user.id);

        if (!ignore) {
          setFormData({
            full_name: profile?.full_name || '',
            avatar_url: profile?.avatar_url || '',
          });
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

  const avatarPreview = useMemo(() => formData.avatar_url.trim() || null, [formData.avatar_url]);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMsg('');

    if (!formData.full_name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile(user.id, {
        full_name: formData.full_name.trim(),
        avatar_url: formData.avatar_url.trim() || null,
      });
      navigate('/profile');
    } catch (error) {
      setErrorMsg(error.message || 'Unable to update your profile right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="bg-[linear-gradient(180deg,_#eefbf7_0%,_#f9fafb_30%,_#f9fafb_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="animate-fade-up rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-lg sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">Edit profile</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Keep your seller profile looking trustworthy</h1>
            <p className="mt-4 text-sm leading-7 text-emerald-50 sm:text-base">
              Buyers are more likely to trust a listing when they can see a clear seller name and profile image.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="animate-fade-up-delayed rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            {loading && <p className="text-gray-600">Loading profile...</p>}
            {!loading && (
              <>
                {errorMsg && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</div>}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Full name</span>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Avatar URL</span>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </label>

                <div className="mt-6 rounded-[1.75rem] border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Preview</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-bold text-emerald-700 shadow-sm">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                      ) : (
                        (formData.full_name || user.email || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formData.full_name || 'Your name here'}</p>
                      <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:border-gray-400"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-70"
                  >
                    {isSubmitting ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
