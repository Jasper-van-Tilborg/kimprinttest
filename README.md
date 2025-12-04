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
- [Contributing](#contributing)

## Features

### Customer-Facing Features

- **Product Catalog**: Browse products by category (T-shirts, Hoodies, Rompers, Bags)
- **Collections System**: Featured collections with hero images and product grouping
- **Product Search**: Real-time search functionality with debounced queries
- **Shopping Cart**: Persistent cart with localStorage, supports color and size variants
- **Checkout Process**: Multi-step checkout with form validation
- **User Accounts**: Registration, login, and account dashboard
- **Photo Gallery**: Custom photo book section for showcasing products

### Admin Features

- **Product Management**: Create, read, update, and delete products
- **Collection Management**: Organize products into collections with featured collections
- **Order Management**: View and manage customer orders
- **User Management**: View and manage user accounts
- **Image Upload**: Upload product images to Supabase Storage
- **Admin Dashboard**: Overview of store statistics and management tools

### Technical Features

- **Server-Side Rendering (SSR)**: Optimized page loads with Next.js App Router
- **Image Optimization**: Automatic image optimization with Next.js Image component
- **Row Level Security (RLS)**: Database-level security policies
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies

## Tech Stack

### Frontend

- **Framework**: Next.js 16.0.0 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Outfit)

### Backend

- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js Server Actions
- **ORM**: Supabase Client Library

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
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── orders/               # Order management
│   │   ├── products/             # Product management
│   │   ├── settings/             # Admin settings
│   │   ├── users/                # User management
│   │   └── layout.tsx            # Admin layout with auth check
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts               # Authentication actions
│   │   ├── collections.ts        # Collection CRUD operations
│   │   └── products.ts           # Product CRUD operations
│   ├── assortiment/              # Product catalog pages
│   │   ├── hoodies/
│   │   ├── rompers/
│   │   ├── t-shirts/
│   │   └── tassen/
│   ├── auth/                     # Auth callback handler
│   │   └── callback/
│   ├── checkout/                 # Checkout page
│   ├── components/                # Reusable components
│   │   ├── AdminHeader.tsx
│   │   ├── CategoryProducts.tsx
│   │   ├── ClientLayout.tsx
│   │   ├── CollectionProducts.tsx
│   │   ├── DomeGallery.tsx
│   │   ├── FadeInScroll.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ShoppingCart.tsx
│   ├── fotoboek/                 # Photo gallery
│   ├── maak-je-eigen/            # Custom product page
│   ├── product/                  # Product detail pages
│   │   └── [id]/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── contexts/                     # React Context providers
│   └── CartContext.tsx           # Shopping cart state management
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useFadeInScroll.ts
│   └── useProducts.ts
├── lib/                          # Utility libraries
│   ├── imageUtils.ts             # Image handling utilities
│   └── supabase/                 # Supabase client configuration
│       ├── auth.ts                # Auth helper functions
│       ├── client.ts              # Browser client
│       └── server.ts              # Server client
├── public/                       # Static assets
│   └── images/                   # Image assets
├── sql/                          # Database migration scripts
│   ├── create-orders-table.sql
│   ├── create-collections-system.sql
│   ├── setup-admin.sql
│   └── ...                       # Other migration scripts
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
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

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable                        | Description                         | Required |
| ------------------------------- | ----------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL           | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key         | Yes      |
| `NEXT_PUBLIC_SITE_URL`          | Your site URL (for email redirects) | Yes      |

You can find these values in your Supabase project settings under API.

## Database Setup

The application uses PostgreSQL via Supabase. Follow these steps to set up your database:

### 1. Create Tables

Run the SQL scripts in the `sql/` directory in order:

1. **Products Table**: Create the products table with all necessary columns

   ```sql
   -- Run: sql/fix-products-table.sql
   ```

2. **Users Table**: Set up user management

   ```sql
   -- Run: sql/create-user-trigger.sql
   ```

3. **Collections System**: Set up collections

   ```sql
   -- Run: sql/create-collections-system.sql
   ```

4. **Orders System**: Set up orders and order items

   ```sql
   -- Run: sql/create-orders-table.sql
   -- Run: sql/create-order-items-table.sql
   ```

5. **Add Additional Columns**: Add sizes, colors, and sales count
   ```sql
   -- Run: sql/add-sizes-column.sql
   -- Run: sql/add-colors-column.sql
   -- Run: sql/add-sales-count-column.sql
   ```

### 2. Set Up Row Level Security (RLS)

Run the RLS policy scripts:

```sql
-- Run: sql/fix-rls-policies.sql
-- Run: sql/admin-policies.sql
-- Run: sql/storage-policies.sql
```

### 3. Create Admin User

Run the admin setup script:

```sql
-- Run: sql/setup-admin.sql
```

Or manually create an admin user:

1. Sign up through the application
2. Update the user's role in the `users` table:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### 4. Verify Setup

Run the verification script to check your setup:

```sql
-- Run: sql/verify-setup.sql
```

## Authentication

The application uses Supabase Auth for authentication. Features include:

- **Email/Password Authentication**: Standard email and password login
- **Email Confirmation**: Users must confirm their email before logging in
- **Role-Based Access Control**: Admin and regular user roles
- **Protected Routes**: Admin routes are protected by middleware
- **Session Management**: Automatic session handling via Supabase SSR

### User Roles

- **Admin**: Full access to admin panel, can manage products, collections, orders, and users
- **User**: Can browse products, make purchases, and manage their account

### Authentication Flow

1. User signs up → Email confirmation sent
2. User confirms email → Account activated
3. User logs in → Redirected to dashboard (admin or user)
4. Admin users → Redirected to `/admin/dashboard`
5. Regular users → Redirected to `/account/dashboard`

## Storage Setup

The application uses Supabase Storage for product images.

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named `product-images`
4. Set it to **Public** (or configure RLS policies)

### 2. Set Up Storage Policies

Run the storage policies script:

```sql
-- Run: sql/storage-policies.sql
```

Or manually create policies:

- **Public Read**: Anyone can read images
- **Admin Write**: Only admins can upload/delete images

### 3. Image Upload

Images are automatically uploaded when creating/updating products through the admin panel. Images are stored in the `product-images/products/` path.

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

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

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

// Get best sellers
getBestSellers(limit?: number): Promise<Product[]>
```

#### Collections

```typescript
// Get all collections
getAllCollections(): Promise<Collection[]>

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
```

#### Authentication

```typescript
// Login
login(formData: FormData): Promise<{ error?: string }>

// Signup
signup(formData: FormData): Promise<{ error?: string; success?: boolean }>

// Logout
logout(): Promise<void>
```

### Database Schema

#### Products Table

- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `description` (TEXT, Nullable)
- `price` (DECIMAL, Required)
- `category` (TEXT, Required)
- `stock` (INTEGER, Default: 0)
- `image_url` (TEXT, Nullable)
- `images` (TEXT[], Nullable)
- `colors` (JSONB, Nullable)
- `sizes` (TEXT[], Nullable)
- `sales_count` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Collections Table

- `id` (UUID, Primary Key)
- `name` (TEXT, Required, Unique)
- `slug` (TEXT, Required, Unique)
- `description` (TEXT, Nullable)
- `hero_image` (TEXT, Nullable)
- `is_featured` (BOOLEAN, Default: false)
- `display_order` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Orders Table

- `id` (UUID, Primary Key)
- `order_number` (TEXT, Unique)
- `customer_name` (TEXT)
- `customer_email` (TEXT)
- `customer_phone` (TEXT, Nullable)
- `shipping_address` (TEXT)
- `total_amount` (DECIMAL)
- `status` (TEXT, Default: 'pending')
- `items_count` (INTEGER, Default: 0)
- `notes` (TEXT, Nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Users Table

- `id` (UUID, Primary Key, References auth.users)
- `email` (TEXT, Required)
- `role` (TEXT, Default: 'user')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

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
