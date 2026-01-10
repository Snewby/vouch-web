# 🚀 Vouch Web - Quick Start

## What Was Created

A complete Next.js 14 web application that connects to your existing Vouch Supabase database, allowing users to create and respond to recommendation requests with text-based vouches.

## Files Created

✅ **Total: 27 files** across:
- Database migration (in mobile app folder)
- Next.js configuration
- TypeScript types
- Data hooks (ported from mobile)
- 3 pages (home, create, request detail)
- 6 components
- Documentation

## Next Steps (In Order)

### 1. Open New VS Code Window
```
File → Open Folder → C:\Users\seand\vouch-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
copy .env.local.example .env.local
```

Then edit `.env.local` with your Supabase URL and key (see [SETUP.md](SETUP.md))

### 4. Run Database Migration
1. Open Supabase Dashboard → SQL Editor
2. Copy contents from:
   `C:\Users\seand\Vouch\sql\migrations\006_web_poc_support.sql`
3. Run in SQL Editor
4. Look for: `NOTICE: Migration 006: Verification complete`

### 5. Start Development Server
```bash
npm run dev
```

### 6. Test It Out
Open http://localhost:3000

Try:
1. Creating a request
2. Responding to it
3. Browsing the feed

## What This App Does

### User Flow

```
Home Page (/)
    ↓
Browse requests with filters
    ↓
Click "Create Request"
    ↓
Create Page (/create)
    ↓
Fill form → Submit
    ↓
Request Detail (/request/[token])
    ↓
View request + Submit responses
```

### Key Features

- ✅ **No authentication** - Anonymous requests/responses
- ✅ **Smart location input** - Autocomplete + create new
- ✅ **Text-based responses** - No business object required
- ✅ **Shareable links** - WhatsApp/SMS friendly
- ✅ **Real-time updates** - React Query cache invalidation
- ✅ **Mobile responsive** - Works on all devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (shared with mobile) |
| State | React Query |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Deployment | Vercel (recommended) |

## Database Changes (Migration 006)

Applied to your existing Supabase database:

1. **Modified `rec_responses` table**:
   - Made `business_id` and `user_id` nullable
   - Added text fields: `business_name`, `email`, `instagram`, `website`, `location`, `notes`, `responder_name`, `is_guest`

2. **Created function**:
   - `get_or_create_area(area_name)` - Smart location creation

3. **Created views**:
   - `web_request_feed` - Optimized request listing
   - `web_request_responses` - Unified response display

## Folder Structure

```
C:\Users\seand\vouch-web\
├── app/                          # Pages
│   ├── page.tsx                 # Home/feed
│   ├── create/page.tsx          # Create request
│   ├── request/[token]/page.tsx # Request detail
│   ├── layout.tsx               # Root layout
│   └── providers.tsx            # React Query
├── components/                   # UI components
│   ├── RequestCard.tsx
│   ├── RequestFilters.tsx
│   ├── CreateRequestForm.tsx
│   ├── ResponseForm.tsx
│   ├── ResponseList.tsx
│   └── LocationAutocomplete.tsx
├── lib/
│   ├── supabase.ts              # Database client
│   ├── utils.ts                 # Helpers
│   └── hooks/                   # Data fetching
│       ├── useCachedCategories.ts
│       ├── useCachedAreas.ts
│       ├── useRequests.ts
│       ├── useRequestByToken.ts
│       ├── useCreateRequest.ts
│       ├── useCreateResponse.ts
│       └── useCreateArea.ts
├── types/                        # TypeScript
│   ├── database.ts
│   ├── request.ts
│   └── response.ts
├── package.json
├── .env.local.example
├── README.md                     # Full documentation
├── SETUP.md                      # Troubleshooting
└── QUICK_START.md                # This file
```

## Verification Checklist

After setup, confirm:

- [ ] `npm install` completes without errors
- [ ] `.env.local` exists with Supabase credentials
- [ ] Migration 006 ran successfully in Supabase
- [ ] Dev server starts: `npm run dev`
- [ ] Home page loads at http://localhost:3000
- [ ] Can create a request
- [ ] Can submit a response
- [ ] Response appears in list

## Common Issues

| Issue | Fix |
|-------|-----|
| "Missing Supabase environment variables" | Create `.env.local` with correct keys |
| "List 'area' not found" | Run migration 006 in Supabase |
| "web_request_feed does not exist" | Re-run migration, check for errors |
| Port 3000 in use | Run `npm run dev -- -p 3001` |

## Where to Get Help

- **Detailed setup**: [SETUP.md](SETUP.md)
- **Full docs**: [README.md](README.md)
- **Database migration**: `C:\Users\seand\Vouch\sql\migrations\006_web_poc_support.sql`
- **Mobile app context**: `C:\Users\seand\Vouch\README.md`

## Development Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linter
npm run type-check # Check TypeScript types
```

## What's Different from Mobile App?

| Aspect | Mobile App | Web POC |
|--------|-----------|---------|
| **Responses** | Link to businesses table | Text fields (name, email, etc.) |
| **Auth** | Required (Supabase Auth) | None (anonymous) |
| **Location** | Dropdown only | Autocomplete + create new |
| **Platform** | iOS/Android (Expo) | Browser (Next.js) |
| **State** | React Query + Context | React Query only |

## Ready to Deploy?

See [README.md - Deployment](README.md#deployment) for Vercel instructions.

---

**Questions?** Check [SETUP.md](SETUP.md) for detailed troubleshooting.

**Need to modify?** All code is well-commented with TypeScript types.

**Happy coding!** 🎉
