# Vouch Web POC

A simple web-based recommendation platform where users can create requests, share links, and receive text-based vouches.

## Overview

This is a proof-of-concept web application built with Next.js 14 that connects to the same Supabase database as the Vouch mobile app. Unlike the mobile app which links responses to business objects, this web version allows users to submit text-based recommendations with contact information.

## Features

- **Create Requests**: Ask for recommendations with location and business type filters
- **Smart Location Input**: Autocomplete from existing areas + ability to create new locations
- **Public Sharing**: Generate shareable links for WhatsApp, SMS, etc.
- **Text-Based Responses**: Submit recommendations without business object linking
- **No Authentication Required**: Anonymous requests and responses (POC v1)
- **Real-time Updates**: See responses as they come in
- **Mobile Responsive**: Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (shared with mobile app)
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
cd C:\Users\seand\vouch-web
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get these from**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

### 3. Run Database Migration

Before running the app, you need to apply migration 006 to your Supabase database:

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `C:\Users\seand\Vouch\sql\migrations\006_web_poc_support.sql`
3. Paste and run the migration

This migration:
- Makes `rec_responses.business_id` and `user_id` nullable
- Adds text fields for business info (name, email, instagram, website, location, notes)
- Creates `get_or_create_area()` function for user-generated locations
- Creates `web_request_feed` and `web_request_responses` views

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vouch-web/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home: Request feed
│   ├── create/              # Create request page
│   ├── request/[token]/     # Request detail page
│   ├── layout.tsx           # Root layout
│   └── providers.tsx        # React Query provider
├── components/              # UI components
│   ├── RequestCard.tsx      # Request display card
│   ├── RequestFilters.tsx   # Filter controls
│   ├── CreateRequestForm.tsx
│   ├── ResponseForm.tsx
│   ├── ResponseList.tsx
│   └── LocationAutocomplete.tsx
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── utils.ts             # Utility functions
│   └── hooks/               # Data fetching hooks
│       ├── useCachedCategories.ts
│       ├── useCachedAreas.ts
│       ├── useRequests.ts
│       ├── useRequestByToken.ts
│       ├── useCreateRequest.ts
│       ├── useCreateResponse.ts
│       └── useCreateArea.ts
├── types/                   # TypeScript types
│   ├── database.ts
│   ├── request.ts
│   └── response.ts
└── package.json
```

## Usage

### Creating a Request

1. Click "Create Request" button
2. Fill in:
   - **Title**: "What are you looking for?"
   - **Location**: Type to search or create new
   - **Business Type**: Select from categories
   - **Subcategory**: Optional
   - **Context**: Optional additional details
3. Submit to generate a shareable link

### Responding to a Request

1. Open request via shared link
2. Fill in recommendation:
   - **Business Name** (required)
   - Contact info (email, Instagram, website)
   - Location
   - Notes/comments
3. Submit anonymously

### Browsing Requests

- Filter by location, business type, or search keywords
- See response count for each request
- Click to view details and respond

## Database Schema

### Key Tables

- **rec_requests**: Recommendation requests (shared with mobile app)
- **rec_responses**: Responses (supports both business-linked and text-based)
- **list_items**: Categories, subcategories, areas, neighbourhoods

### New Views (Migration 006)

- **web_request_feed**: Optimized request listing with metadata
- **web_request_responses**: Unified response view (business-linked + text-based)

### User-Generated Locations

When users type a location not in the database, `get_or_create_area()` creates a new `list_item` with:
```json
{
  "user_generated": true,
  "source": "web_poc",
  "verified": false,
  "created_at": "2025-01-10T12:00:00Z"
}
```

Admins can review and verify these via:
```sql
SELECT * FROM get_user_generated_areas();
```

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com)
3. Add environment variables (Supabase URL and key)
4. Deploy

### Environment Variables for Production

Set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Differences from Mobile App

| Feature | Mobile App | Web POC |
|---------|-----------|---------|
| Responses | Link to businesses table | Text-based (name, contact info) |
| Authentication | Required | None (anonymous) |
| Location input | Dropdown only | Autocomplete + create new |
| Business data | Full object with geocoding | Free-text fields |
| User accounts | Profile-based | Guest-only |

## Future Enhancements

- [ ] User authentication (optional sign-in)
- [ ] Link mobile app accounts
- [ ] Rich link previews for WhatsApp/SMS
- [ ] Analytics dashboard
- [ ] Admin panel for user-generated locations
- [ ] Email notifications for responses
- [ ] Advanced search filters
- [ ] Request categories/tags

## Related Projects

- **Mobile App**: `C:\Users\seand\Vouch` (Expo React Native)
- **Shared Database**: Supabase (same instance for both apps)

## Support

For issues or questions, check:
- Database migrations in `C:\Users\seand\Vouch\sql\migrations\`
- Mobile app documentation in `C:\Users\seand\Vouch\README.md`

## License

Private - Vouch Project
