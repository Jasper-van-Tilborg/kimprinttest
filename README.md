# K-imprint Webshop

Een moderne webshop gebouwd met Next.js, Tailwind CSS en Supabase.

## 🚀 Features

- **Moderne UI/UX** - Responsive design met Tailwind CSS
- **Admin Dashboard** - Shopify-achtige interface voor beheer
- **Product Management** - Volledige CRUD operaties voor producten
- **Order Management** - Bestellingen beheren en tracken
- **Category System** - Productcategorieën organiseren
- **Real-time Data** - Supabase voor real-time database updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth systeem
- **Icons**: Lucide React

## 📦 Installatie

1. **Clone de repository**

   ```bash
   git clone <repository-url>
   cd kimprinttest
   ```

2. **Installeer dependencies**

   ```bash
   npm install
   ```

3. **Configureer Supabase**

   - Maak een Supabase project aan op [supabase.com](https://supabase.com)
   - Kopieer je project URL en anon key
   - Voeg ze toe aan je environment variabelen:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Database**

   - Ga naar je Supabase dashboard
   - Ga naar SQL Editor
   - Voer het schema uit uit `database/schema.sql`
   - Dit maakt alle benodigde tabellen en data aan

5. **Start de development server**

   ```bash
   npm run dev
   ```

6. **Open de applicatie**
   - Ga naar [http://localhost:3000](http://localhost:3000)
   - Login als admin met: `admin` / `admin123`

## 🗄️ Database Schema

De database bevat de volgende tabellen:

- **users** - Gebruikers (admin en klanten)
- **categories** - Productcategorieën
- **products** - Producten
- **product_images** - Productafbeeldingen
- **orders** - Bestellingen
- **order_items** - Bestelregels
- **addresses** - Adressen (factuur/verzending)
- **settings** - Webshop instellingen

## 🔐 Authentication

Het systeem gebruikt een eenvoudig localStorage-based auth systeem:

- **Admin login**: `admin` / `admin123`
- **Dashboard**: Alleen toegankelijk voor admins
- **Session management**: Via localStorage

## 📱 Pages

- **Homepage** (`/`) - Hoofdpagina met carousel en producten
- **Login** (`/login`) - Inlog/registratie pagina
- **Dashboard** (`/dashboard`) - Admin dashboard (alleen voor admins)

## 🎨 Styling

De applicatie gebruikt een warme, aardse kleurenpalet:

- **Primair**: #D9C1B5 (warme beige)
- **Secundair**: #F5F1ED (lichte beige)
- **Accent**: #E8DDD4 (zachte beige)

## 🚀 Deployment

1. **Build de applicatie**

   ```bash
   npm run build
   ```

2. **Deploy naar je hosting provider**

   - Vercel (aanbevolen voor Next.js)
   - Netlify
   - AWS, DigitalOcean, etc.

3. **Configureer environment variabelen** op je hosting platform

## 📝 Development

### Project Structuur

```
kimprinttest/
├── app/
│   ├── components/          # React componenten
│   ├── dashboard/          # Dashboard pagina
│   ├── login/              # Login pagina
│   └── page.tsx            # Hoofdpagina
├── lib/
│   ├── database.ts         # Database functies
│   └── supabase.ts         # Supabase client
├── database/
│   └── schema.sql          # Database schema
└── public/                 # Statische bestanden
```

### Nieuwe Features Toevoegen

1. **Database functies** - Voeg toe aan `lib/database.ts`
2. **API routes** - Maak nieuwe routes in `app/api/`
3. **Components** - Voeg toe aan `app/components/`
4. **Pages** - Maak nieuwe pagina's in `app/`

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is eigendom van K-imprint. Alle rechten voorbehouden.

## 📞 Contact

Voor vragen of ondersteuning, neem contact op via:

- Email: info@k-imprint.nl
- Website: [k-imprint.nl](https://k-imprint.nl)
