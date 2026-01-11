# Vouch - UX Overview

## Product Overview
Vouch is a recommendation platform where users can request and share trusted recommendations from real people in their community. The core concept is "asking for vouches" - getting personal recommendations for services, businesses, and experiences.

---

## User Flow

```
Home Page (Browse Requests)
    ↓
Create Request → Share Link → Receive Recommendations
    ↓
Request Detail Page → View Responses → Follow Recommendations
```

---

## Main Screens

### 1. Home Page (Feed View)
**URL:** `/`

**Purpose:** Browse all community requests and discover what people are asking for

**Key Components:**
- **Header**
  - Vouch logo
  - "Create Request" button (primary CTA)

- **Filter Panel**
  - Search bar (free text search across requests)
  - Location dropdown (hierarchical: City → Area → Neighbourhood)
  - Business Type dropdown (hierarchical: Category → Subcategory)
  - Clear filters button (appears when filters active)

- **Request Feed**
  - List of request cards (most recent first)
  - Each card shows:
    - Category/subcategory tags
    - Location tag
    - Request title (auto-generated)
    - Context/description (optional, preview truncated)
    - Requester name
    - Date posted (relative time)
    - Response count
  - Entire card is clickable → navigates to request detail

**States:**
- Loading (spinner)
- Empty state (no requests found)
- Error state
- Active filters indicator

**Mobile Optimizations:**
- Reduced padding and spacing
- Filters stack vertically
- Tags use smaller text
- Metadata stacks vertically instead of horizontal layout

---

### 2. Create Request Page
**URL:** `/create`

**Purpose:** Create a new request for recommendations

**Key Components:**
- **Header**
  - Back button (← Back to home)
  - Page title: "Create Request"

- **Form Card**
  - Title section: "Ask for a Recommendation"
  - Subtitle: "Get trusted recommendations from real people"

- **Form Fields:**
  1. **Business Type** (required)
     - Searchable dropdown
     - Searches across categories and subcategories
     - Example: "Restaurant", "Barber", "Plumber"
     - Display format: `(Category) Subcategory`

  2. **Location** (required)
     - Autocomplete input
     - Hierarchical location search (City/Area/Neighbourhood)
     - Allows creating new locations on-the-fly
     - Display format: `(Parent) Location`
     - "User-added" indicator for new locations

  3. **Additional Details** (optional)
     - Multi-line textarea
     - Placeholder: "Add any specific requirements or context..."
     - Used for specific requests like cuisine preferences, budget, etc.

- **Submit Button**
  - "Create Request" button
  - Disabled until required fields filled
  - Shows "Creating..." state during submission

**Post-Creation Flow:**
- Success message
- Redirect to request detail page
- User can share the unique link

**Mobile Optimizations:**
- Reduced form padding
- Tighter spacing between fields
- Larger touch targets (min 44px)
- Responsive input sizing

---

### 3. Request Detail Page
**URL:** `/request/[token]`

**Purpose:** View a specific request and all recommendations received

**Key Components:**
- **Request Header**
  - Title (auto-generated from category + location)
  - Category and subcategory tags
  - Location tag
  - Requester name and date
  - Full context/description (if provided)

- **Share Section**
  - Shareable link
  - Copy button
  - Social sharing options (future)

- **Response Section**
  - Response count header
  - List of recommendations
  - Each recommendation shows:
    - Recommender name
    - Business/service recommended
    - Rating/review
    - Date submitted

- **Response Form** (for respondents)
  - Add your recommendation
  - Business name
  - Rating
  - Comment/review
  - Submit button

**States:**
- No responses yet (empty state with encouragement to share)
- Loading responses
- Error state

---

## Key Components

### Searchable Dropdowns

#### LocationSearchableSelect
- **Purpose:** Filter by location on home page
- **Behavior:**
  - Shows all locations on focus
  - Live search filtering
  - Prioritizes exact matches, then starts-with, then contains
  - Top-level items (cities) ranked higher
  - Display: `(Parent) Location` with parent in gray, location in bold
  - Shows selected value or search input
  - Clear button when value selected

#### LocationAutocomplete
- **Purpose:** Select/create location when creating request
- **Behavior:**
  - Type-ahead autocomplete
  - Creates new locations if no match found
  - Shows "will be added as new location" message
  - Display: `(Parent) Location` format
  - User-generated locations marked with "(user-added)"

#### CategorySearch
- **Purpose:** Select business type (category/subcategory)
- **Behavior:**
  - Unified search across categories and subcategories
  - Searches both name and parent category
  - Examples: "restaurant", "food", "barber"
  - Display: `(Category) Subcategory` format
  - Parent category in gray, subcategory in bold

### RequestCard
- **Purpose:** Display request in feed
- **Key Features:**
  - Hover effect (blue border + shadow)
  - Responsive tag sizing
  - Truncated context (2 lines max)
  - Flexible metadata layout
  - Entire card is clickable
  - Min touch target: 44px

### RequestFilters
- **Purpose:** Filter the request feed
- **Key Features:**
  - Responsive grid layout
  - Clear filters button (conditional)
  - Maintains filter state
  - Updates URL params (future)

---

## Design System

### Typography
- **Headers:**
  - Desktop: text-2xl (24px)
  - Mobile: text-xl (20px)
- **Subheaders:**
  - Desktop: text-xl (20px)
  - Mobile: text-lg (18px)
- **Body:**
  - Desktop: text-base (16px)
  - Mobile: text-sm (14px)
- **Tags:**
  - Desktop: text-sm (14px)
  - Mobile: text-xs (12px)

### Colors
- **Primary:** Blue-600 (#2563eb)
- **Hover:** Blue-700 (#1d4ed8)
- **Background:** Gray-50 (#f9fafb)
- **Cards:** White with gray-200 border
- **Text Primary:** Gray-900
- **Text Secondary:** Gray-600
- **Text Tertiary:** Gray-500

### Spacing
- **Card Padding:**
  - Desktop: p-6 (24px)
  - Mobile: p-4 (16px)
- **Page Padding:**
  - Desktop: px-8 py-8
  - Mobile: px-4 py-6
- **Header Padding:**
  - Desktop: py-4
  - Mobile: py-3

### Interactive Elements
- **Touch Targets:** Minimum 44px height on mobile
- **Buttons:** Rounded-lg (8px radius)
- **Inputs:** Rounded-lg with focus ring
- **Hover States:** Background darkening + shadow
- **Transitions:** All interactive elements

---

## Hierarchy & Navigation

### Information Architecture
```
Vouch
├── Home (Request Feed)
│   ├── Filters (Search, Location, Type)
│   └── Request Cards
│       └── → Request Detail
│
├── Create Request
│   ├── Business Type (Category/Subcategory)
│   ├── Location (Hierarchical)
│   └── Context (Optional)
│       └── → Request Detail (on success)
│
└── Request Detail
    ├── Request Info
    ├── Share Link
    ├── Responses List
    └── Add Response Form
```

### Data Hierarchy

#### Locations (3 levels)
```
City (e.g., London)
└── Area (e.g., Westminster)
    └── Neighbourhood (e.g., Soho)
```

#### Business Types (2 levels)
```
Category (e.g., Food and Drink)
└── Subcategory (e.g., Restaurant, Cafe, Bar)
```

---

## Key User Interactions

### Creating a Request
1. Click "Create Request" button
2. Search and select business type (e.g., "restaurant")
3. Search and select location (e.g., "Hackney")
4. Optionally add context (e.g., "Looking for authentic Italian")
5. Click "Create Request"
6. Redirected to request detail page
7. Copy and share the link

### Browsing Requests
1. View feed of all requests
2. Filter by location (e.g., "Hackney")
3. Filter by business type (e.g., "Restaurant")
4. Click on request card
5. View details and recommendations

### Providing a Recommendation
1. Receive shared request link
2. View request details
3. Fill out recommendation form
4. Submit recommendation
5. Confirmation shown

---

## Mobile-First Considerations

### Responsive Breakpoints
- **Small (sm):** 640px - Mobile adjustments
- **Medium (md):** 768px - Tablet layout
- **Large (lg):** 1024px - Desktop layout

### Mobile-Specific Features
- Reduced padding throughout
- Stacked layouts instead of side-by-side
- Larger touch targets (44px minimum)
- Simplified metadata display
- Condensed tag sizing
- Full-width buttons on mobile
- Responsive typography scaling

### Touch Interactions
- All interactive elements meet 44px minimum
- Clear visual feedback on tap
- No hover-only interactions
- Optimized dropdown scrolling
- Prevent zoom on input focus

---

## Future Enhancements

### Planned Features
- User authentication and profiles
- Request ownership and editing
- Response voting/ranking
- Social sharing integration
- Notification system
- Advanced filtering (price, rating, distance)
- Map view of recommendations
- Save/bookmark requests
- Follow users
- Private/public requests toggle

### Technical Improvements
- URL state management for filters
- Infinite scroll pagination
- Real-time updates
- Image uploads for responses
- Rich text editing
- Progressive Web App (PWA)

---

## Accessibility Notes

### Current Implementation
- Semantic HTML structure
- Keyboard navigable dropdowns
- Focus states on all interactive elements
- Sufficient color contrast ratios
- Descriptive button labels
- Screen reader friendly

### Needs Improvement
- ARIA labels for complex dropdowns
- Skip navigation links
- Keyboard shortcuts
- High contrast mode support
- Screen reader announcements for dynamic content
- Error message accessibility

---

## Performance Considerations

- React Query for data caching (24-hour stale time)
- Debounced search inputs
- Dropdown result limits (50 items max)
- Optimistic UI updates
- Lazy loading of request details
- Image optimization (future)

---

## Technical Stack Reference

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Language:** TypeScript
