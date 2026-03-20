import React, { useState } from 'react';
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
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();

        if (!ignore) {
          setCategories(categoryList);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMsg(error.message || 'Unable to load categories right now.');
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
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Create Product</h1>
      <p className="mt-3 text-gray-600">Create a new listing for your neighborhood marketplace.</p>
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        {errorMsg && <p className="mb-4 text-sm text-red-500">{errorMsg}</p>}
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Product name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Category</span>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loadingCategories}
          >
            <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Price</span>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Upload image</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="mt-2 text-xs text-gray-500">JPG, PNG, or WEBP up to 5 MB.</p>
        </label>
        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Or paste image URL</span>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="https://example.com/item.jpg"
          />
        </label>
        {imageFile && (
          <p className="mb-6 text-sm text-gray-600">Selected file: {imageFile.name}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {isSubmitting ? 'Creating...' : 'Create product'}
        </button>
      </form>
    </section>
  );
}
