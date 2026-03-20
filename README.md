# NearBuy

NearBuy is a mobile-first neighborhood marketplace built with React and Supabase. It helps people buy and sell locally, chat with sellers, manage listings, and keep everything lightweight and community-focused.

## What NearBuy Does

- Browse local product listings with category filters and search
- Create, edit, and manage your own listings
- Upload product images with Supabase Storage
- Sign up, log in, reset passwords, and manage seller profiles
- Add listings to cart
- Message sellers in-app through conversation threads
- Browse a responsive UI designed for both mobile and desktop

## Tech Stack

- React
- React Router
- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase Realtime
- Tailwind CSS
- Create React App

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and add:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the app

```bash
npm start
```

The app runs in development mode and opens at [http://localhost:3001](http://localhost:3001).

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Scripts

### `npm start`

Runs the app locally in development mode.

### `npm run build`

Builds the app for production.

### `npm test`

Runs the test runner.

## Supabase Requirements

NearBuy expects a Supabase project with:

- `users`
- `products`
- `categories`
- `cart_items`
- `conversations`
- `messages`

It also expects a public Storage bucket:

- `product-images`

You should also have proper RLS policies in place for:

- auth/profile access
- products
- cart items
- conversations
- messages
- storage objects

## Deployment

NearBuy can be deployed to Vercel.

Important notes:

- Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in Vercel environment variables
- Redeploy after changing environment variables
- Use the current `vercel.json` so static files are served correctly and client-side routes still work

## Current Features

- Marketplace landing page with featured/latest listings
- Product list with category filter and search
- Product detail page with add-to-cart and message-seller actions
- Product creation with category selection and image upload
- Cart page with quantity controls
- Realtime-style messaging UI with inbox and conversation threads
- Profile view and edit flow
- NearBuy branding with responsive navigation and footer

## Future Improvements

- Shipping and available quantity support
- Unread message badges
- Checkout and order flow
- Better seller dashboards
- Saved/favorite listings
- Image upload for profile avatars

## Screens and Branding

The app branding uses the NearBuy logo located at:

`src/assets/site-brand/nearbuy-logo.png`

## Notes

This project started from Create React App, but the README has been updated to reflect the actual product and workflow instead of the default CRA template.
