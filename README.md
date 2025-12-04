# K-imprint E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 16, React 19, TypeScript, and Supabase. This application provides a complete online store solution with product management, collections, shopping cart, user authentication, and an admin dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Storage Setup](#storage-setup)
- [Development](#development)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## Features

### Customer-Facing Features

- **Product Catalog**: Browse products by category (T-shirts, Hoodies, Rompers, Bags)
- **Collections System**: Featured collections with hero images and product grouping
- **Product Search**: Real-time search functionality with debounced queries
- **Shopping Cart**: Persistent cart with localStorage, supports color and size variants
- **Checkout Process**: Multi-step checkout with form validation (customer info, payment method selection)
- **User Accounts**: Registration, login, and account dashboard
- **Photo Gallery**: Custom photo book section for showcasing products
- **Product Details**: Detailed product pages with image galleries, color variants, size selection, and related products
- **Responsive Design**: Mobile-first design optimized for all screen sizes

### Admin Features

- **Product Management**: Create, read, update, and delete products with image uploads
- **Category Management**: Create and manage product categories
- **Collection Management**: Organize products into collections with featured collections
- **Order Management**: View and manage customer orders with status tracking
- **User Management**: View and manage user accounts
- **Image Upload**: Upload product images to Supabase Storage
- **Admin Dashboard**: Overview of store statistics and management tools
- **Product Variants**: Support for multiple colors and sizes per product

### Technical Features

- **Server-Side Rendering (SSR)**: Optimized page loads with Next.js App Router
- **Image Optimization**: Automatic image optimization with Next.js Image component
- **Row Level Security (RLS)**: Database-level security policies
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies
- **Server Actions**: Type-safe server-side mutations without API routes

## Tech Stack

### Frontend

- **Framework**: Next.js 16.0.0 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API (CartContext)
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Outfit)

### Backend

- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with email confirmation
- **Storage**: Supabase Storage for product images
- **API**: Next.js Server Actions
- **ORM**: Supabase Client Library (@supabase/ssr, @supabase/supabase-js)

### Development Tools

- **Linting**: ESLint with Next.js config
- **Package Manager**: npm
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
kimprinttest/
├── app/                          # Next.js App Router pages and components
│   ├── account/                  # User account pages
│   │   ├── dashboard/            # User dashboard
│   │   └── page.tsx              # Account login/signup
│   ├── admin/                    # Admin panel (protected)
│   │   ├── collections/          # Collection management
│   │   │   ├── edit/[id]/       # Edit collection
│   │   │   ├── new/             # Create collection
│   │   │   └── page.tsx         # Collections list
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── orders/               # Order management
│   │   │   ├── [id]/            # Order detail page
│   │   │   └── page.tsx         # Orders list
│   │   ├── products/             # Product management
│   │   │   ├── edit/[id]/       # Edit product
│   │   │   ├── new/             # Create product
│   │   │   └── page.tsx         # Products list with categories
│   │   ├── settings/             # Admin settings
│   │   ├── users/                # User management
│   │   ├── layout.tsx            # Admin layout with auth check
│   │   └── LogoutButton.tsx     # Logout component
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts               # Authentication actions (login, signup, logout)
│   │   ├── collections.ts        # Collection CRUD operations
│   │   └── products.ts           # Product CRUD operations
│   ├── assortiment/              # Product catalog pages
│   │   ├── hoodies/             # Hoodies category page
│   │   ├── rompers/              # Rompers category page
│   │   ├── t-shirts/             # T-shirts category page
│   │   ├── tassen/               # Bags category page
│   │   └── page.tsx              # Main catalog page
│   ├── auth/                     # Auth callback handler
│   │   └── callback/
│   │       └── route.ts         # OAuth callback handler
│   ├── checkout/                 # Checkout page
│   │   └── page.tsx              # Multi-step checkout
│   ├── components/                # Reusable components
│   │   ├── AdminHeader.tsx       # Admin navigation header
│   │   ├── CategoryProducts.tsx  # Category product listing
│   │   ├── ClientLayout.tsx      # Client-side layout wrapper
│   │   ├── CollectionProducts.tsx # Collection product display
│   │   ├── DomeGallery.tsx       # Photo gallery component
│   │   ├── FadeInScroll.tsx       # Scroll animation component
│   │   ├── Footer.tsx            # Site footer
│   │   ├── Navbar.tsx            # Main navigation with search
│   │   └── ShoppingCart.tsx     # Shopping cart sidebar
│   ├── fotoboek/                 # Photo gallery
│   │   ├── t-shirts/             # T-shirt gallery
│   │   └── page.tsx              # Main gallery page
│   ├── maak-je-eigen/            # Custom product page
│   │   └── page.tsx
│   ├── product/                  # Product detail pages
│   │   └── [id]/
│   │       └── page.tsx          # Product detail with variants
│   ├── globals.css               # Global styles and Tailwind config
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── not-found.tsx             # 404 page
├── contexts/                     # React Context providers
│   └── CartContext.tsx           # Shopping cart state management
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication hook
│   ├── useFadeInScroll.ts        # Scroll animation hook
│   └── useProducts.ts             # Product data hook
├── lib/                          # Utility libraries
│   ├── imageUtils.ts             # Image handling utilities
│   ├── supabase.ts               # Legacy Supabase client (backward compatibility)
│   └── supabase/                 # Supabase client configuration
│       ├── auth.ts                # Auth helper functions (requireAuth, requireAdmin)
│       ├── client.ts              # Browser client
│       └── server.ts              # Server client
├── public/                       # Static assets
│   └── images/                   # Image assets
│       ├── hero/                 # Hero images
│       ├── icons/                 # SVG icons
│       ├── logo/                  # Logo files
│       └── products/             # Product images
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS configuration
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kimprinttest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   See [Database Setup](#database-setup) section below.

5. **Set up storage**
   See [Storage Setup](#storage-setup) section below.

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable                        | Description                         | Required |
| ------------------------------- | ----------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL           | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key         | Yes      |
| `NEXT_PUBLIC_SITE_URL`          | Your site URL (for email redirects) | Yes      |

You can find these values in your Supabase project settings under API.

## Database Setup

The application uses PostgreSQL via Supabase. You'll need to create the following tables and set up Row Level Security (RLS) policies.

### Required Tables

#### 1. Products Table

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  images TEXT[],
  colors JSONB,
  sizes TEXT[],
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 2. Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 3. Collections Table

```sql
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  hero_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 4. Product Collections (Junction Table)

```sql
CREATE TABLE product_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id, collection_id)
);
```

#### 5. Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 6. Orders Table

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  items_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

#### 7. Order Items Table

```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  color TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

1. **Products**: Public read, admin write
2. **Categories**: Public read, admin write
3. **Collections**: Public read, admin write
4. **Product Collections**: Public read, admin write
5. **Users**: Users can read own profile, admins can read all
6. **Orders**: Admin only (read/write)
7. **Order Items**: Admin only (read/write)

### Create Admin User

1. Sign up through the application
2. Update the user's role in the `users` table:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

Or create a trigger to automatically create a user profile:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Authentication

The application uses Supabase Auth for authentication. Features include:

- **Email/Password Authentication**: Standard email and password login
- **Email Confirmation**: Users must confirm their email before logging in
- **Role-Based Access Control**: Admin and regular user roles
- **Protected Routes**: Admin routes are protected by `requireAdmin()` helper
- **Session Management**: Automatic session handling via Supabase SSR

### User Roles

- **Admin**: Full access to admin panel, can manage products, collections, orders, and users
- **User**: Can browse products, make purchases, and manage their account

### Authentication Flow

1. User signs up → Email confirmation sent
2. User confirms email → Account activated, user profile created
3. User logs in → Redirected to dashboard (admin or user)
4. Admin users → Redirected to `/admin/dashboard`
5. Regular users → Redirected to `/account/dashboard`

### Auth Helpers

The application provides helper functions in `lib/supabase/auth.ts`:

- `requireAuth()`: Ensures user is authenticated, redirects to `/account` if not
- `requireAdmin()`: Ensures user is admin, redirects to `/account` if not
- `getUser()`: Gets current user (nullable)
- `isAuthenticated()`: Checks if user is authenticated

## Storage Setup

The application uses Supabase Storage for product images.

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named `product-images`
4. Set it to **Public** (or configure RLS policies)

### 2. Set Up Storage Policies

Create policies to allow:

- **Public Read**: Anyone can read images
- **Admin Write**: Only admins can upload/delete images

Example policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

### 3. Image Upload

Images are automatically uploaded when creating/updating products through the admin panel. Images are stored in the `product-images/products/` path with the format: `{sanitized-product-name}-{timestamp}.{extension}`

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Guidelines

1. **Code Style**: Follow TypeScript and React best practices
2. **Components**: Use functional components with hooks
3. **Server Actions**: Use `"use server"` directive for server-side functions
4. **Client Components**: Use `"use client"` directive for interactive components
5. **Type Safety**: Define types for all data structures
6. **Error Handling**: Implement proper error handling and user feedback

### Key Development Patterns

- **Server Components by Default**: Use server components unless client-side interactivity is needed
- **Server Actions**: Use Server Actions for mutations instead of API routes
- **Context API**: Use React Context for global state (cart, auth)
- **Image Optimization**: Always use Next.js Image component for images
- **Code Splitting**: Use dynamic imports for heavy components
- **Type Safety**: Export types from `lib/supabase.ts` for consistency

### File Naming Conventions

- **Pages**: `page.tsx` (App Router convention)
- **Components**: PascalCase (e.g., `Navbar.tsx`)
- **Server Actions**: camelCase (e.g., `getAllProducts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL, e.g., `https://yourdomain.com`)

### Other Deployment Options

- **Netlify**: Similar to Vercel, supports Next.js
- **Self-hosted**: Use Node.js server with `npm start`
- **Docker**: Create a Dockerfile for containerized deployment

## API Reference

### Server Actions

#### Products

```typescript
// Get all products
getAllProducts(): Promise<Product[]>

// Get product by ID
getProduct(id: string): Promise<Product | null>

// Create product
createProduct(formData: FormData): Promise<void>

// Update product
updateProduct(id: string, formData: FormData): Promise<void>

// Delete product
deleteProduct(id: string): Promise<void>

// Get products by category
getProductsByCategory(category: string): Promise<Product[]>

// Get products by category filter (partial match)
getProductsByCategoryFilter(categoryFilter: string, limit?: number): Promise<Product[]>

// Get best sellers
getBestSellers(limit?: number): Promise<Product[]>

// Get products by multiple categories
getProductsByCategories(categories: string[]): Promise<Product[]>
```

#### Collections

```typescript
// Get all collections
getAllCollections(): Promise<Collection[]>

// Get collection by ID
getCollection(id: string): Promise<Collection | null>

// Get collection by slug
getCollectionBySlug(slug: string): Promise<Collection | null>

// Get featured collection
getFeaturedCollection(): Promise<Collection | null>

// Create collection
createCollection(formData: FormData): Promise<void>

// Update collection
updateCollection(id: string, formData: FormData): Promise<void>

// Delete collection
deleteCollection(id: string): Promise<void>

// Get products in collection
getProductsInCollection(collectionId: string): Promise<Product[]>

// Add product to collection
addProductToCollection(productId: string, collectionId: string): Promise<void>

// Remove product from collection
removeProductFromCollection(productId: string, collectionId: string): Promise<void>

// Get collections for product
getCollectionsForProduct(productId: string): Promise<Collection[]>

// Update product collections (bulk)
updateProductCollections(productId: string, collectionIds: string[]): Promise<void>
```

#### Authentication

```typescript
// Login
login(formData: FormData): Promise<{ error?: string; requiresEmailConfirmation?: boolean }>

// Signup
signup(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
  message?: string;
  requiresEmailConfirmation?: boolean
}>

// Logout
logout(): Promise<void>
```

## Database Schema

### Products Table

| Column      | Type      | Description                  |
| ----------- | --------- | ---------------------------- |
| id          | UUID      | Primary key                  |
| name        | TEXT      | Product name (required)      |
| description | TEXT      | Product description          |
| price       | DECIMAL   | Product price (required)     |
| category    | TEXT      | Product category (required)  |
| stock       | INTEGER   | Stock quantity (default: 0)  |
| image_url   | TEXT      | Primary product image        |
| images      | TEXT[]    | Array of product images      |
| colors      | JSONB     | Color variants with images   |
| sizes       | TEXT[]    | Available sizes              |
| sales_count | INTEGER   | Number of sales (default: 0) |
| created_at  | TIMESTAMP | Creation timestamp           |
| updated_at  | TIMESTAMP | Last update timestamp        |

**Color Variant Structure**:

```typescript
{
  name: string;        // Color name (e.g., "Red", "Blue")
  colorCode: string;   // Hex color code (e.g., "#FF0000")
  images: string[];   // Array of image URLs for this color
}
```

### Collections Table

| Column        | Type      | Description                |
| ------------- | --------- | -------------------------- |
| id            | UUID      | Primary key                |
| name          | TEXT      | Collection name (unique)   |
| slug          | TEXT      | URL-friendly slug (unique) |
| description   | TEXT      | Collection description     |
| hero_image    | TEXT      | Hero image URL             |
| is_featured   | BOOLEAN   | Featured on homepage       |
| display_order | INTEGER   | Sort order                 |
| created_at    | TIMESTAMP | Creation timestamp         |
| updated_at    | TIMESTAMP | Last update timestamp      |

### Orders Table

| Column           | Type      | Description                     |
| ---------------- | --------- | ------------------------------- |
| id               | UUID      | Primary key                     |
| order_number     | TEXT      | Unique order number             |
| customer_name    | TEXT      | Customer full name              |
| customer_email   | TEXT      | Customer email                  |
| customer_phone   | TEXT      | Customer phone (optional)       |
| shipping_address | TEXT      | Shipping address                |
| total_amount     | DECIMAL   | Total order amount              |
| status           | TEXT      | Order status (default: pending) |
| items_count      | INTEGER   | Number of items (default: 0)    |
| notes            | TEXT      | Order notes (optional)          |
| created_at       | TIMESTAMP | Creation timestamp              |
| updated_at       | TIMESTAMP | Last update timestamp           |

### Users Table

| Column     | Type      | Description                         |
| ---------- | --------- | ----------------------------------- |
| id         | UUID      | Primary key (references auth.users) |
| email      | TEXT      | User email (required)               |
| role       | TEXT      | User role: 'user' or 'admin'        |
| created_at | TIMESTAMP | Creation timestamp                  |
| updated_at | TIMESTAMP | Last update timestamp               |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct

- Be respectful and inclusive
- Follow the existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

## License

This project is private and proprietary. All rights reserved.

## Support

For support, please contact the development team or open an issue in the repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Last Updated**: 2025
