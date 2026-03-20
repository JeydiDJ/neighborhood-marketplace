import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { createProduct, fetchCategories, uploadProductImage } from './useProducts';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function ProductCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();

        if (!ignore) {
          setCategories(categoryList);
          setCategoryError('');
        }
      } catch (error) {
        if (!ignore) {
          setCategoryError(error.message || 'Unable to load categories right now.');
        }
      } finally {
        if (!ignore) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const imagePreview = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return formData.image_url.trim() || null;
  }, [formData.image_url, imageFile]);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(current => ({ ...current, [name]: value }));
  };

  const handleImageChange = event => {
    const file = event.target.files?.[0] ?? null;
    setErrorMsg('');

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrorMsg('Please upload a JPG, PNG, or WEBP image.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMsg('Please upload an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You need to be logged in to create a product.');
      return;
    }

    if (!formData.name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('Enter a valid price greater than zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url.trim() || null;

      if (imageFile) {
        imageUrl = await uploadProductImage({
          file: imageFile,
          userId: user.id,
        });
      }

      const product = await createProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image_url: imageUrl,
        seller_id: user.id,
        category_id: formData.category_id || null,
      });

      navigate(`/products/${product.id}`);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to create product right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="ambient-shell bg-[linear-gradient(180deg,_#fff7ed_0%,_#f9fafb_22%,_#f9fafb_100%)]">
      <div className="ambient-orb ambient-orb-orange" />
      <div className="ambient-orb ambient-orb-gold" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="animate-fade-up rounded-[2rem] bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 p-6 text-white shadow-lg sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-100">Create Listing</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Make your next neighborhood listing easy to spot
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-orange-50 sm:text-base">
              A clear title, the right category, and a good photo are usually enough to help local buyers trust the listing quickly.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-orange-100">Step 1</p>
                <p className="mt-2 text-sm font-semibold">Add the essentials</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-orange-100">Step 2</p>
                <p className="mt-2 text-sm font-semibold">Choose a category</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-orange-100">Step 3</p>
                <p className="mt-2 text-sm font-semibold">Upload a good image</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="animate-fade-up-delayed rounded-[2rem] border border-white/70 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Listing details</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Tell buyers what you&apos;re selling</h2>
              </div>
              <div className="hidden rounded-2xl bg-gray-50 px-4 py-3 text-right text-sm text-gray-500 sm:block">
                Mobile-first
                <p className="mt-1 text-xs text-gray-400">Built to post quickly on smaller screens</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="mt-6 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Product name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Vintage lamp, bike helmet, indoor plant..."
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Description</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Condition, pickup details, size, brand, or anything else buyers should know."
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Category</span>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    disabled={loadingCategories}
                  >
                    <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categoryError && <p className="mt-2 text-sm text-red-500">{categoryError}</p>}
                  {!categoryError && !loadingCategories && categories.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600">No categories were returned from Supabase yet.</p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Price</span>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-orange-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="25.00"
                    required
                  />
                </label>
              </div>

              <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50/70 p-4 sm:p-5">
                <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-gray-700">Upload image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <p className="mt-2 text-xs text-gray-500">JPG, PNG, or WEBP up to 5 MB.</p>

                    <label className="mt-5 block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Or paste image URL</span>
                      <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="https://example.com/item.jpg"
                      />
                    </label>

                    {imageFile && <p className="mt-3 text-sm text-gray-600">Selected file: {imageFile.name}</p>}
                  </div>

                  <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Preview</p>
                    <div className="mt-4 overflow-hidden rounded-[1.25rem] bg-gray-100">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Product preview" className="aspect-[4/3] w-full object-cover" />
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm text-gray-500">
                          Your product preview will appear here once you upload an image or paste a URL.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">Listings work best with a clear title, fair price, and one clean image.</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-70"
              >
                {isSubmitting ? 'Creating...' : 'Create product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
