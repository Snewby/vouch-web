# Vouch Web Application - Complete UX & Technical Documentation

> **Last Updated:** January 12, 2026
> **Based on:** Complete codebase analysis of all 50+ files
> **Status:** Production-ready POC

## Overview
Vouch is a web-based recommendation platform where users can request business recommendations from their network and receive vouches from real people. The platform focuses on local, trusted recommendations with location-based filtering and zero barriers to entry (no login required).

---

## Tech Stack

### Frontend Framework
- **Next.js 16.1.1** (React 19.2.3)
  - App Router architecture (server & client components)
  - Server-side rendering (SSR) for SEO optimization
  - Edge runtime for OpenGraph image generation
  - React Compiler enabled (`reactCompiler: true`) for automatic memoization
  - Dynamic sitemap and robots.txt generation

### UI & Styling
- **Tailwind CSS 3.3.0** - Utility-first CSS framework with custom configuration
- **Radix UI Components:**
  - `@radix-ui/react-select` ^2.2.6 - Accessible select dropdowns
  - `@radix-ui/react-separator` ^1.1.8 - Visual dividers
  - `@radix-ui/react-slot` ^1.2.4 - Polymorphic component composition
- **Lucide React 0.562.0** - Icon library
- **Class Variance Authority 0.7.1** - Component variant management
- **clsx 2.1.1** + **tailwind-merge 2.6.0** - Conditional classname handling
- **tailwindcss-animate 1.0.7** - Animation utilities

### State Management & Data Fetching
- **TanStack Query (React Query) 5.17.19** - Server state management
  - Default stale time: 1 minute
  - Categories cache: 24 hours
  - Locations cache: 6 hours
  - Requests cache: 2 minutes
  - Retry attempts: 1
  - Optimistic updates on mutations

### Backend & Database
- **Supabase (@supabase/supabase-js 2.39.3)** - PostgreSQL database + REST API
  - Custom database views: `web_request_feed`, `web_request_responses`
  - Hierarchical data structure via `list_items` table
  - Server-side and client-side Supabase clients
  - No authentication (POC mode: `persistSession: false`)

### Build Tools
- **TypeScript 5** - Full type safety
- **PostCSS 8** + **Autoprefixer 10** - CSS processing
- **Babel Plugin React Compiler 1.0.0** - Experimental React optimizations

---

## Application Pages

### 1. Home Page (`/`)
**Browse and filter all public recommendation requests**

**Key Features:**
- "Your Requests" widget (from localStorage)
- Text search + location + business type filtering
- Hierarchical location filtering (selecting "London" includes all boroughs/neighbourhoods)
- Request cards showing badges, title, context preview, metadata
- Responsive grid layout

### 2. Create Request Page (`/create`)
**Create a new recommendation request**

**Form Fields:**
1. **Business Type** (required) - CategorySearch component
   - Select from existing categories/subcategories
   - OR create new business type on-the-fly (green indicator)
2. **Location** (required) - LocationAutocomplete component
   - Select from cities, boroughs, neighbourhoods
   - OR create new neighbourhood (green indicator)
3. **Additional Details** (optional) - Textarea

**Process:**
- Auto-generates title: "{BusinessType} in {Location}"
- Saves share_token to localStorage
- Redirects to `/request/{token}?new=1`

### 3. Request Detail Page (`/request/[token]`)
**View request, recommendations, and submit new recommendations**

**Sections:**
- Success alert (for newly created requests)
- Request header with badges, title, context
- Existing recommendations list
- Share buttons (Copy, WhatsApp, SMS)
- Response form (guest-friendly, no login)

**SEO Features:**
- Server-side rendering
- Dynamic Open Graph tags
- Custom OG image generation (`/api/og`)
- Twitter Card support

---

## User Capabilities

### Location System
Users can:
- **Select** from existing cities, boroughs/areas, or neighbourhoods
- **Create new neighbourhoods** - automatically flagged as user-generated
- **Filter hierarchically** - selecting "London" shows all requests in London + all boroughs + all neighbourhoods

**Example Hierarchy:**
```
London
├── Westminster
│   ├── Soho
│   └── Covent Garden
└── Hackney
    ├── Shoreditch
    └── Dalston
```

### Business Type System
Users can:
- **Select** from existing categories (e.g., "Food & Dining")
- **Select** from existing subcategories (e.g., "Italian Restaurant")
- **Create entirely new business types** - stored as standalone subcategories

**Display Format:**
- Category: "Food & Dining"
- Subcategory: "Italian Restaurant (Food & Dining)"
- User-created: "Custom Type"

### Request Creation
- Required: Business type + Location
- Optional: Additional context/requirements
- Title auto-generated from selections
- Unique share link created
- Saved to device (localStorage) for "Your Requests"

### Response Submission
- No login required (guest mode)
- Required: Business name only
- Optional: Name, location, email, Instagram, website, notes
- All responses public and visible immediately

### Sharing
- **Copy Link** - Clipboard API with fallback
- **WhatsApp** - Web share URL with pre-filled message
- **SMS** - Native messaging app with pre-filled text

---

## Core User Flows

### Flow 1: Create Request
1. Click "Create Request"
2. Type and select/create business type
3. Type and select/create location
4. Optionally add context
5. Submit → auto-generates title
6. Redirected to request page with success message
7. Share link via WhatsApp/SMS/copy

### Flow 2: Browse & Filter
1. View all requests on homepage
2. See "Your Requests" if any created
3. Filter by text search, location, or business type
4. Location filter includes all child areas automatically
5. Click card to view details

### Flow 3: Respond to Request
1. Receive shared link
2. View request details and existing recommendations
3. Fill out recommendation form
4. Submit (no login needed)
5. Page refreshes to show new recommendation

### Flow 4: Share Request
1. On request detail page, scroll to share section
2. Choose: Copy link, WhatsApp, or SMS
3. Message auto-populated with request details + URL
4. Share with network

---

## UX Design Components

### Input Components

**LocationAutocomplete:**
- Autocomplete dropdown with parent context: "(Westminster) Soho"
- Shows "(user-added)" tag for user-created locations
- Green indicator when creating new: "✓ 'NewPlace' will be added"
- Blur delay: 300ms for dropdown interaction

**CategorySearch:**
- Unified search across categories and subcategories
- Shows parent in results: "(Food & Dining) Restaurant"
- Green indicator for new types
- Selected state shows name with clear (✕) button
- Blur delay: 200ms

**Text Inputs:**
- Consistent padding: px-4 py-3
- Gray border with blue focus ring
- Full width responsive

**Textarea:**
- Fixed rows, no resize
- Same styling as inputs

### Card Components

**Request Card (Feed):**
- White bg, gray border
- Hover: blue border + shadow
- Badge row → Title → Context preview → Metadata
- Entire card clickable

**Response Card:**
- Business name (bold) + location
- "Verified" badge (if linked)
- Notes/testimonial
- Contact links (website, Instagram, email)
- Recommender name + date

### Badge Components
- **Default:** Blue bg, white text (business types)
- **Outline:** White bg, gray border, gray text (locations)
- 📍 emoji for location badges

### Button Components
- **Primary:** Blue bg (bg-blue-600), hover darker
- **Outline:** White bg, gray border (share buttons)
- Disabled state reduces opacity
- Loading text: "Submit" → "Submitting..."

### Loading States
- Centered spinner with text
- Input fields disabled and grayed
- Button text changes during mutation

### Empty States
- "No requests found" → CTA to create
- "No recommendations yet. Be the first!"
- Clear messaging with actionable next steps

### Alert Components
- **Success:** Green checkmark, light green bg
- **Error:** Red bg, destructive variant
- Auto-dismiss on some (10s for new request, 3s for copy)

---

## Design System

### Typography
- **Font:** Inter (Google Fonts)
- **Sizes:** text-xs (12px) → text-3xl (30px)
- **Weights:** normal (400), medium (500), semibold (600), bold (700)
- **Responsive:** Smaller on mobile (text-sm → text-base)

### Colors
**Primary:**
- Blue 600 (#2563eb) - CTAs, links
- Blue 700 (#1d4ed8) - Hover states

**Neutrals:**
- Gray 50 (#f9fafb) - Page bg
- Gray 200 (#e5e7eb) - Borders
- Gray 500-900 - Text hierarchy

**Semantic:**
- Green 50/200 - Success
- Red 50/800 - Errors

### Design Tokens (CSS Variables)
Located in `app/globals.css`:
- Color tokens: `--background`, `--foreground`, `--primary`, etc.
- Spacing: `--radius: 0.5rem`
- Dark mode variants available (not active)

**Note:** Many components use hardcoded Tailwind colors (bg-blue-600) instead of tokens

### Spacing
- Card padding: `p-4 sm:p-6 lg:p-8`
- Input padding: `px-4 py-3`
- Page margins: `px-4 sm:px-6 lg:px-8`
- Section gaps: `space-y-4` to `space-y-8`

### Responsive Breakpoints
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- Mobile-first approach

---

## Data Structure

### Requests (`rec_requests` table)
- Auto-generated title
- Optional context
- Category + subcategory (or just one)
- Location (area_id - any hierarchy level)
- Unique share_token
- Public visibility
- Created timestamp

### Responses (`rec_responses` table)
- Business name (required)
- Responder name (optional)
- Location (optional, free text)
- Email, Instagram, website (optional)
- Notes/testimonial (optional)
- Guest mode flag
- Created timestamp

### Locations (`list_items` table)
- 3-level hierarchy: City → Area → Neighbourhood
- Parent-child relationships via parent_id
- User-generated flag in metadata
- Sort ordering

### Business Types (`list_items` table)
- 2-level hierarchy: Category → Subcategory
- User-created types stored as standalone subcategories
- Parent context for display

---

## Technical Implementation

### State Management
- **React Query:** All server state (requests, responses, categories, locations)
- **Local State:** Form inputs, UI toggles, search values
- **LocalStorage:** User's created request tokens
- **URL State:** `?new=1` parameter for success messages

### Caching Strategy
- Categories: 24 hours (static)
- Locations: 6 hours (semi-static)
- Requests: 2 minutes (dynamic)
- Cache invalidation on mutations

### Performance
- React Compiler auto-memoization
- Client-side filtering (no backend calls)
- Dropdown result limits (10-50 items)
- SSR for SEO-critical pages
- Edge runtime for OG images

### SEO
- Dynamic sitemap with all public requests
- Robots.txt with sitemap reference
- Per-request Open Graph tags
- Custom OG image generation
- Server-side rendering for crawlers

### Error Handling
- Try-catch blocks in all async operations
- User-friendly error messages in Alert components
- Console logging for debugging
- Form validation with disabled states

### Accessibility
- Semantic HTML (header, main, form)
- Keyboard navigation support
- Focus rings on all interactive elements
- Form labels with `htmlFor` bindings
- ARIA roles (alert)
- Color contrast (WCAG AA target)

---

## LocalStorage Implementation

**Key:** `vouch_my_requests`

**Format:**
```json
[
  {"token": "abc123", "createdAt": "2026-01-12T..."},
  {"token": "def456", "createdAt": "2026-01-11T..."}
]
```

**Features:**
- Stores up to 50 most recent requests
- No duplicates
- Device-based (no cross-device sync)
- Powers "Your Requests" widget
- No authentication required

---

## Share Functionality

### Message Format
```
Can anyone recommend a {businessType} in {location}?
Add your recommendation here: {url}
```

### Share Channels
1. **Copy to Clipboard**
   - Uses `navigator.clipboard.writeText()`
   - Fallback: `document.execCommand('copy')`
   - Shows "Copied!" confirmation for 3 seconds

2. **WhatsApp**
   - Opens `https://wa.me/?text={encoded}`
   - New window/tab

3. **SMS**
   - Opens `sms:?body={encoded}`
   - Works iOS + Android
   - Native messaging app

---

## Future Enhancements

### Authentication
- User accounts and profiles
- Request ownership
- Response attribution
- Private requests

### Advanced Features
- Photo uploads for responses
- Rating system (1-5 stars)
- Response voting/helpfulness
- Multiple filter selection
- Sort options (trending, most recommended)
- Map view of recommendations

### Technical
- URL state persistence for filters
- Optimistic updates
- Infinite scroll pagination
- Real-time updates via Supabase subscriptions
- PWA with offline support

### Design System
- Migrate hardcoded colors to semantic tokens
- Typography scale tokens
- Dark mode activation
- Theme toggle

---

## Development

### Scripts
```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
npm run type-check  # TypeScript validation
```

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### File Structure

```
vouch-web/
├── .claude/                      # Claude Code configuration
│   └── settings.local.json       # Project-specific settings
│
├── app/                          # Next.js App Router (pages & API routes)
│   ├── api/
│   │   └── og/
│   │       └── route.tsx         # OpenGraph image generator (Edge runtime)
│   ├── create/
│   │   └── page.tsx              # Create request page
│   ├── request/
│   │   └── [token]/
│   │       └── page.tsx          # Request detail page (SSR)
│   ├── globals.css               # Global styles + CSS tokens
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Homepage (request feed)
│   ├── providers.tsx             # React Query provider wrapper
│   ├── robots.ts                 # Robots.txt generator
│   └── sitemap.ts                # Dynamic sitemap generator
│
├── components/                   # React components
│   ├── ui/                       # Base UI components (Radix + shadcn/ui)
│   │   ├── alert.tsx             # Alert/notification component
│   │   ├── badge.tsx             # Badge component (default/outline variants)
│   │   ├── button.tsx            # Button with CVA variants
│   │   ├── card.tsx              # Card container components
│   │   ├── input.tsx             # Text input component
│   │   ├── select.tsx            # Radix Select wrapper (not currently used)
│   │   ├── separator.tsx         # Horizontal/vertical divider
│   │   └── textarea.tsx          # Multi-line text input
│   │
│   ├── CategorySearch.tsx        # Category/subcategory search with create-new
│   ├── CreateRequestForm.tsx     # Complete request creation form
│   ├── LocationAutocomplete.tsx  # Location search with create-new
│   ├── LocationSearchableSelect.tsx # Location filter dropdown
│   ├── MyRequests.tsx            # User's created requests widget
│   ├── RequestCard.tsx           # Request display in feed
│   ├── RequestDetailClient.tsx   # Client-side request detail wrapper
│   ├── RequestFilters.tsx        # Search/location/type filter bar
│   ├── ResponseForm.tsx          # Recommendation submission form
│   ├── ResponseList.tsx          # Display list of recommendations
│   ├── SearchableSelect.tsx      # Generic autocomplete component
│   └── ShareRequestButtons.tsx   # Copy/WhatsApp/SMS share buttons
│
├── lib/                          # Utilities and business logic
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAllCategoriesFlat.ts    # Fetch flattened categories
│   │   ├── useCachedAreas.ts          # Fetch areas (not used)
│   │   ├── useCachedCategories.ts     # Fetch categories only (not used)
│   │   ├── useCreateArea.ts           # Create/get location mutation
│   │   ├── useCreateRequest.ts        # Create request mutation
│   │   ├── useCreateResponse.ts       # Create response mutation
│   │   ├── useCreateSubcategory.ts    # Create/get business type mutation
│   │   ├── useLocationHierarchy.ts    # Fetch location hierarchy
│   │   ├── useRequestByToken.ts       # Fetch request by token (not used)
│   │   └── useRequests.ts             # Fetch & filter requests
│   │
│   ├── server/
│   │   └── requests.ts           # Server-side data fetching for SSR
│   │
│   ├── localStorage.ts           # LocalStorage utilities for "Your Requests"
│   ├── supabase.ts               # Supabase client configuration
│   └── utils.ts                  # Helper functions (date formatting, URLs, etc.)
│
├── types/                        # TypeScript type definitions
│   ├── database.ts               # Database types (tables, views, models)
│   ├── request.ts                # Request-related types
│   └── response.ts               # Response-related types
│
├── docs/                         # Documentation
│   ├── table_definitions.txt    # Database schema reference
│   ├── UX-OVERVIEW.md           # High-level UX overview (older)
│   └── USER-GENERATED-BUSINESS-TYPES.md # Feature documentation
│
├── sql/                          # SQL utilities
│   ├── get_or_create_subcategory.sql # Database function
│   └── README.md                # SQL documentation
│
├── .env.local.example            # Environment variables template
├── .gitignore                    # Git ignore rules
├── components.json               # shadcn/ui configuration
├── IMPLEMENTATION-PLAN.md        # Development roadmap
├── next.config.js                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript definitions
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── QUICK_START.md                # Quick start guide
├── README.md                     # Project README
├── SETUP.md                      # Setup instructions
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── UX-DOCUMENTATION.md           # This file (complete UX docs)
```

**Key Directories:**

- **`app/`** - Next.js 13+ App Router structure, file-based routing
- **`components/`** - Reusable React components, split into UI primitives and features
- **`lib/`** - Business logic, hooks, utilities, and clients
- **`types/`** - TypeScript interfaces and type definitions
- **`docs/`** - Documentation and reference materials
- **`sql/`** - Database functions and migrations

**Configuration Files:**

- **`next.config.js`** - React Compiler enabled, image domains
- **`tailwind.config.ts`** - Custom theme, design tokens
- **`tsconfig.json`** - Strict TypeScript settings
- **`components.json`** - shadcn/ui component configuration

**Notable Patterns:**

- **File naming:** PascalCase for components (.tsx), camelCase for utilities (.ts)
- **Component organization:** Feature components in `components/`, UI primitives in `components/ui/`
- **Hooks:** All custom hooks prefixed with `use`, located in `lib/hooks/`
- **Types:** Co-located in `types/` directory, imported with `@/types/`
- **Aliases:** `@/` resolves to project root for clean imports

---

## Summary

Vouch is a production-ready POC with:

**Strengths:**
- Modern tech stack (Next.js 16, React 19, TypeScript 5)
- Zero authentication barrier
- Flexible user-generated content (locations & business types)
- Hierarchical filtering intelligence
- SEO-optimized with rich social previews
- Mobile-first responsive design
- Full type safety

**Key Differentiators:**
- Create locations and business types on-the-fly
- Hierarchical location filtering (parent includes all children)
- Guest-friendly (no login needed)
- Device-based request tracking via localStorage
- Pre-filled social share messages

**Production Ready:**
- Complete error handling
- Loading and empty states
- Accessibility fundamentals
- SEO and social sharing
- Responsive across all breakpoints
- Type-safe codebase

The application is ready for user testing and can scale with authentication and advanced features.
