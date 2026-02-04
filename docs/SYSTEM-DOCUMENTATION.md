# AP Acoustic — System Documentation

## Live URL

**Production:** https://lp-omni-ap.vercel.app

---

## Login Credentials

### Admin Panel

| Field    | Value                                        |
|----------|----------------------------------------------|
| URL      | https://lp-omni-ap.vercel.app/admin/login    |
| Password | `AcousticAdmin2026!`                         |

The admin uses a single shared password (no email). After login, a session cookie (`admin_session`) is set.

### Demo Member Account

| Field    | Value                                        |
|----------|----------------------------------------------|
| URL      | https://lp-omni-ap.vercel.app/member/login   |
| Email    | `demo@apacoustic.com.au`                     |
| Password | `DemoMember2026!`                            |
| Name     | Sarah Mitchell                               |
| Company  | Mitchell Interior Design                     |
| Discount | 5%                                           |
| Points   | 500                                          |

Members use Supabase Auth (email + password). After login, a Supabase session cookie is set.

---

## Technology Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Framework   | Next.js 16.1.6 (App Router)   |
| Language    | TypeScript 5, React 19        |
| Styling     | Tailwind CSS 4                |
| Database    | Supabase PostgreSQL            |
| Auth        | Supabase Auth (members) + Cookie auth (admin) |
| Hosting     | Vercel                         |
| PDF Export  | jsPDF                          |
| Repository  | github.com/omnichannel360/LP-Omni-AP (branch: master) |

---

## Website Architecture

### Route Groups

The app uses Next.js route groups to separate concerns:

```
src/app/
├── (main)/          → Public marketing pages (sidebar nav)
├── (product)/       → Product catalog pages (top header nav)
├── (admin)/         → Admin dashboard (sidebar nav, password-protected)
├── (member)/        → Member portal (member nav bar, auth-protected)
└── api/             → API routes
```

### Public Pages — `(main)` group

| Route           | Description                          |
|-----------------|--------------------------------------|
| `/`             | Home page                            |
| `/about`        | About Us                             |
| `/gallery`      | Projects / Gallery                   |
| `/case-studies` | Case Studies                         |
| `/contact`      | Contact page                         |
| `/account`      | Redirects to member dashboard        |

### Product Pages — `(product)` group

| Route               | Description                              |
|---------------------|------------------------------------------|
| `/products`         | Product Range listing (shows "From $X" for members) |
| `/products/[slug]`  | Product detail with variants, pricing, color samples, PDF export |

### Member Pages — `(member)` group

All require Supabase Auth login.

| Route                        | Description                          |
|------------------------------|--------------------------------------|
| `/member/login`              | Email/password login form            |
| `/member/dashboard`          | Account overview, points balance     |
| `/member/cart`               | Order cart (from localStorage)       |
| `/member/checkout`           | Shipping form + mock order placement |
| `/member/orders`             | Order history list                   |
| `/member/orders/[id]`        | Single order detail                  |
| `/member/rewards`            | Redeem points for vouchers           |
| `/member/samples`            | Sample cart (color swatches)         |
| `/member/samples/checkout`   | Sample order checkout (free)         |

### Admin Pages — `(admin)` group

All require admin password.

| Route                        | Description                          |
|------------------------------|--------------------------------------|
| `/admin/login`               | Admin password login                 |
| `/admin`                     | Dashboard with product list          |
| `/admin/products/new`        | Create new product                   |
| `/admin/products/[id]`       | Edit product + variant pricing       |
| `/admin/members`             | Member list                          |
| `/admin/members/new`         | Create member (Supabase Auth)        |
| `/admin/members/[id]`        | Edit member details                  |
| `/admin/pricing`             | Variant pricing overview (all products) |
| `/admin/pricing/[productId]` | Variant pricing for single product   |
| `/admin/orders`              | All orders with status management    |
| `/admin/orders/[id]`         | Order detail with status update      |
| `/admin/rewards`             | Reward types CRUD                    |
| `/admin/discounts`           | Discount code management + generator |
| `/admin/samples`             | Color sample request management      |
| `/admin/settings`            | Global settings + payment gateways   |

---

## API Routes

### Admin APIs (protected by admin middleware)

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/admin/members`              | List all members               |
| POST   | `/api/admin/members`              | Create member (+ Supabase Auth)|
| GET    | `/api/admin/members/[id]`         | Get member by ID               |
| PUT    | `/api/admin/members/[id]`         | Update member                  |
| DELETE | `/api/admin/members/[id]`         | Delete member                  |
| GET    | `/api/admin/variants`             | List variants (by productId)   |
| POST   | `/api/admin/variants`             | Create variant                 |
| PUT    | `/api/admin/variants/[id]`        | Update variant                 |
| DELETE | `/api/admin/variants/[id]`        | Delete variant                 |
| GET    | `/api/admin/orders`               | List all orders                |
| GET    | `/api/admin/orders/[id]`          | Get order detail               |
| PUT    | `/api/admin/orders/[id]`          | Update order status            |
| GET    | `/api/admin/rewards`              | List reward types              |
| POST   | `/api/admin/rewards`              | Create reward type             |
| PUT    | `/api/admin/rewards/[id]`         | Update reward type             |
| DELETE | `/api/admin/rewards/[id]`         | Delete reward type             |
| GET    | `/api/admin/discounts`            | List discount codes            |
| POST   | `/api/admin/discounts`            | Create discount code           |
| GET    | `/api/admin/discounts/generate`   | Generate random code           |
| PUT    | `/api/admin/discounts/[id]`       | Update discount code           |
| DELETE | `/api/admin/discounts/[id]`       | Delete discount code           |
| GET    | `/api/admin/samples`              | List sample requests           |
| PUT    | `/api/admin/samples/[id]`         | Update sample status           |
| GET    | `/api/admin/settings`             | Get global settings            |
| PUT    | `/api/admin/settings`             | Update settings/payment gateways|

### Member APIs (protected by Supabase Auth)

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | `/api/member/auth/login`          | Member login                   |
| POST   | `/api/member/auth/logout`         | Member logout                  |
| GET    | `/api/member/auth/session`        | Check session status           |
| GET    | `/api/orders`                     | List member's orders           |
| POST   | `/api/orders`                     | Place new order                |
| GET    | `/api/orders/[id]`                | Get order detail               |
| GET    | `/api/rewards`                    | List available rewards         |
| POST   | `/api/rewards/redeem`             | Redeem points for voucher      |
| GET    | `/api/rewards/history`            | Redeemed voucher history       |
| GET    | `/api/samples`                    | List member's sample requests  |
| POST   | `/api/samples`                    | Submit sample request          |

### Public APIs

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/products`                   | List active products           |
| GET    | `/api/products/[id]`              | Get product by ID              |
| GET    | `/api/products/[id]/designs`      | Get product designs            |
| GET    | `/api/products/[id]/variants`     | Get available variants         |
| POST   | `/api/auth/login`                 | Admin login                    |
| POST   | `/api/auth/logout`                | Admin logout                   |
| POST   | `/api/upload`                     | Image upload                   |

---

## Database Schema

### Tables (13 total)

| Table               | Description                                   |
|---------------------|-----------------------------------------------|
| `products`          | Product catalog (name, slug, category, etc.)  |
| `designs`           | Product design variants (colorways)           |
| `product_images`    | Product image URLs                            |
| `product_variants`  | Pricing: thickness x size x face_color combos |
| `members`           | Member profiles linked to Supabase Auth       |
| `orders`            | Member orders with shipping, totals, status   |
| `order_items`       | Line items with price snapshots               |
| `global_settings`   | Discount %, points rate, payment gateways     |
| `reward_types`      | Redeemable rewards (vouchers, etc.)           |
| `redeemed_rewards`  | Voucher codes generated from point redemption |
| `points_ledger`     | Points transaction log                        |
| `sample_requests`   | Color sample order requests                   |
| `discount_codes`    | Promo/discount codes for checkout             |

### Key Relationships

```
members.auth_user_id → auth.users.id
product_variants.product_id → products.id
designs.product_id → products.id
orders.member_id → members.id
order_items.order_id → orders.id
order_items.product_variant_id → product_variants.id
redeemed_rewards.member_id → members.id
redeemed_rewards.reward_type_id → reward_types.id
points_ledger.member_id → members.id
sample_requests.member_id → members.id
```

---

## Authentication

### Two Auth Systems

1. **Admin Auth** — Simple cookie-based
   - Password checked against `ADMIN_PASSWORD` env var
   - Sets `admin_session` cookie on success
   - Middleware checks cookie for `/admin/*` routes

2. **Member Auth** — Supabase Auth (JWT)
   - Uses `@supabase/ssr` for cookie-based session management
   - Email/password sign-in via Supabase Auth API
   - Middleware checks Supabase session for `/member/*` routes

Both coexist in `src/middleware.ts`, each targeting different route prefixes.

---

## Key Features

### Product Catalog
- Products with designs (colorway swatches), build options (thickness, size, face color)
- Variant-based pricing (per thickness x size x face_color combination)
- Public visitors see products but NO prices
- Members see "From $X.XX AUD" on listing and detail pages

### Shopping Cart
- localStorage-based (`lp-omni-ap-cart` key)
- Add to cart from product detail page when valid variant selected
- Quantity management in cart page
- Checkout with shipping form, mock payment

### Color Sample Ordering
- Interactive colorway selection mode on product detail
- Separate sample cart (`lp-omni-ap-sample-cart` key)
- Free shipping for color sample requests
- PDF export of colorway sheets with AP Acoustic branding

### Points & Rewards
- Points awarded when admin marks order as "delivered"
- Rate configurable in admin settings (default: 0.01 points per dollar)
- Members redeem points for digital vouchers
- Voucher codes in APA-XXXX-XXXX format with 12-month expiry

### Discount Codes
- Admin creates codes (percentage or fixed amount)
- Optional: minimum order, max uses, expiry date
- Auto-generate codes via API
- Seeded examples: WELCOME10 (10%), SUMMER25 ($25), APA-VIP-2026 (15%), ACOUSTIC50 ($50)

### Payment Gateway Configuration
- Admin settings page for Stripe, PayPal, Afterpay/Zip
- Per-gateway: enable/disable, test/live mode, public key, secret key
- Stored as JSONB in `global_settings.payment_gateways`
- Currently mock checkout (no real payment processing)

---

## File Structure

```
src/
├── app/
│   ├── (main)/                    # Public marketing pages
│   │   ├── page.tsx               # Home
│   │   ├── about/page.tsx
│   │   ├── account/page.tsx
│   │   ├── case-studies/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gallery/page.tsx
│   │   └── layout.tsx             # Sidebar nav layout
│   │
│   ├── (product)/                 # Product catalog
│   │   ├── products/page.tsx      # Product Range listing
│   │   ├── products/[slug]/
│   │   │   ├── page.tsx           # Server component (data fetch)
│   │   │   └── product-detail.tsx # Client component (interactivity)
│   │   └── layout.tsx             # Header nav layout
│   │
│   ├── (admin)/                   # Admin dashboard
│   │   ├── layout.tsx             # Sidebar with nav links
│   │   └── admin/
│   │       ├── page.tsx           # Dashboard
│   │       ├── login/page.tsx
│   │       ├── products/new/page.tsx
│   │       ├── products/[id]/page.tsx
│   │       ├── members/page.tsx
│   │       ├── members/new/page.tsx
│   │       ├── members/[id]/page.tsx
│   │       ├── pricing/page.tsx
│   │       ├── pricing/[productId]/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── orders/[id]/page.tsx
│   │       ├── rewards/page.tsx
│   │       ├── discounts/page.tsx
│   │       ├── samples/page.tsx
│   │       └── settings/page.tsx
│   │
│   ├── (member)/                  # Member portal
│   │   ├── layout.tsx             # Member nav bar
│   │   └── member/
│   │       ├── login/page.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── cart/page.tsx
│   │       ├── checkout/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── orders/[id]/page.tsx
│   │       ├── rewards/page.tsx
│   │       ├── samples/page.tsx
│   │       └── samples/checkout/page.tsx
│   │
│   └── api/                       # API routes (see table above)
│
├── components/
│   ├── navbar.tsx                 # Sidebar navigation (main pages)
│   ├── product-header.tsx         # Top navigation bar (product pages)
│   ├── product-footer.tsx         # Footer
│   ├── admin/
│   │   ├── product-form.tsx       # Product create/edit form
│   │   ├── member-form.tsx        # Member create/edit form
│   │   ├── variant-pricing-form.tsx # Variant pricing editor
│   │   └── order-status-badge.tsx # Order status color badge
│   └── member/
│       ├── cart-icon.tsx          # Cart badge (legacy, replaced by text links)
│       └── price-display.tsx      # Price or "Login for pricing"
│
├── lib/
│   ├── auth.ts                    # Admin auth helpers
│   ├── member-auth.ts             # Member session helpers
│   ├── supabase-server.ts         # Supabase admin client
│   ├── supabase-client.ts         # Supabase browser client
│   ├── supabase-auth.ts           # Supabase SSR auth client
│   ├── supabase-middleware.ts     # Supabase middleware helper
│   ├── cart.ts                    # Order cart (localStorage)
│   ├── sample-cart.ts             # Sample cart (localStorage)
│   ├── order-number.ts            # ORD-YYYYMMDD-NNN generator
│   ├── sample-request-number.ts   # SMP-YYYYMMDD-NNNN generator
│   └── voucher-code.ts            # APA-XXXX-XXXX generator
│
└── middleware.ts                   # Dual auth middleware (admin + member)
```

---

## Seeded Data

### Products (6)
| Product              | ID                                   |
|----------------------|--------------------------------------|
| Woven Ceiling Frames | ce5f88f2-9a8b-48d0-9829-f291841e21d2 |
| Gingham              | 3e654f3c-f9a5-487e-a1ea-70a715e309dc |
| Pincheck             | 7cbad304-7a4d-45ad-a052-a4013f27fefa |
| Tartan               | ef5c0c5d-22a8-40db-9d76-368d321686f5 |
| Rafter               | 7ae8c2d2-8fc4-4211-bce3-d8b0865f08f3 |
| Fillet               | 108e8b08-c153-48a0-b2f2-9622790f9094 |

### Variants
30 variants across 6 products (5 per product):
- Thicknesses: 25mm, 50mm
- Sizes: 600x600, 1200x600
- Face colors: White, Black, Grey, Natural, Charcoal

### Reward Types (5)
| Reward               | Points | Value  |
|----------------------|--------|--------|
| $10 Store Voucher    | 100    | $10.00 |
| $25 Store Voucher    | 200    | $25.00 |
| $50 Store Voucher    | 350    | $50.00 |
| $100 Store Voucher   | 600    | $100.00|
| Free Sample Kit      | 150    | Free   |

### Discount Codes (4)
| Code          | Type       | Value | Min Order | Max Uses | Status   |
|---------------|------------|-------|-----------|----------|----------|
| WELCOME10     | Percentage | 10%   | $50       | 100      | Active   |
| SUMMER25      | Fixed      | $25   | $150      | 50       | Active   |
| APA-VIP-2026  | Percentage | 15%   | None      | Unlimited| Active   |
| ACOUSTIC50    | Fixed      | $50   | $300      | 20       | Maxed Out|

---

## Environment Variables

Required in `.env.local` and Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://fikhtfeqhzxcajbhjonf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ADMIN_PASSWORD=AcousticAdmin2026!
```

---

## Deployment

- **GitHub:** Push to `master` branch at `omnichannel360/LP-Omni-AP`
- **Vercel:** Auto-deploy or manual via `vercel --prod --yes`
- **Database:** Supabase project `fikhtfeqhzxcajbhjonf` (ap-southeast-1)
