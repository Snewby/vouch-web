# vouch-web Superiority Implementation Plan

**Date**: January 12, 2026
**Goal**: Transform vouch-web into a production-ready, superior application
**Timeline**: 2-3 weeks
**Context**: vouch-web vs vouch-mvp comparison

---

## Implementation Progress

**Last Updated**: January 12, 2026

### Phase Status
- ✅ **Phase 1: Server-Side Rendering** - COMPLETED
- ⏳ **Phase 2: Production Security & Reliability** - Not Started
- ⏳ **Phase 3: UX Enhancements** - Not Started

### Phase 1 Completed Items
- ✅ Server-side data fetching utilities (`lib/server/requests.ts`)
- ✅ Client component for interactive UI (`components/RequestDetailClient.tsx`)
- ✅ SSR request detail page with metadata (`app/request/[token]/page.tsx`)
- ✅ OpenGraph image generator (`app/api/og/route.tsx`)
- ✅ Dynamic sitemap generation (`app/sitemap.ts`)
- ✅ Robots.txt configuration (`app/robots.ts`)
- ✅ Build verification - All TypeScript checks passed ✓

### Key Achievements
🎉 **vouch-web now has full SSR support!**
- Request pages are server-rendered with rich metadata
- Beautiful social preview cards for WhatsApp, Twitter, SMS
- Dynamic sitemap for search engine indexing
- Production build verified and working

### Next Steps
Ready to proceed with **Phase 2: Production Security & Reliability**
- Rate limiting
- Error monitoring (Sentry)
- Input validation (Zod)
- Content moderation
- Analytics

---

## Executive Summary

**Current State**:
- ✅ Modern stack (Next.js 16.1.1, React 19.2.3, shadcn/ui)
- ✅ Superior architecture (React Query caching, database views, hierarchical data)
- ✅ Unique features (user-generated content, hierarchical filtering, "My Requests")
- ❌ Missing SSR (poor SEO, no social previews)
- ❌ Missing production features (rate limiting, monitoring, validation)

**Target State**:
- ✅ All current advantages preserved
- ✅ SSR for SEO and social sharing
- ✅ Production-ready monitoring and security
- ✅ Best-in-class UX and performance

**Outcome**: Superior to vouch-mvp in all dimensions (tech, functionality, UX, production-readiness)

---

## Phase 1: Add Server-Side Rendering (Week 1) ✅ COMPLETED

**Goal**: Improve SEO, social sharing, and initial page load performance
**Effort**: 2-3 days
**Impact**: 🔴 Critical for production launch
**Status**: ✅ Completed on January 12, 2026

### 1.1 Convert Request Detail Page to SSR ✅

**Implementation Summary**:
- ✅ Created `lib/server/requests.ts` for server-side data fetching
- ✅ Created `components/RequestDetailClient.tsx` for interactive UI
- ✅ Converted `app/request/[token]/page.tsx` to Server Component with metadata generation
- ✅ Implemented `generateMetadata()` for SEO and social sharing

**Original State** (`app/request/[token]/page.tsx`):
```tsx
'use client';

export default function RequestDetailPage({ params, searchParams }: { ... }) {
  const [token, setToken] = React.useState<string>('');

  React.useEffect(() => {
    params.then((p) => setToken(p.token));
  }, [params]);

  const { request, responses, loading, error } = useRequestByToken(token);  // Client-side fetch

  // ... render
}
```

**Problems**:
- Blank page until JavaScript loads
- No SEO (Google can't index content)
- No social previews (WhatsApp/SMS show blank)
- Slower Time to First Contentful Paint

---

**Target State**:
```tsx
// Remove 'use client' directive - make this a Server Component

import { fetchRequestByToken } from '@/lib/server/requests';
import { RequestDetailClient } from '@/components/RequestDetailClient';

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Server-side fetch
  const { request, responses } = await fetchRequestByToken(token);

  if (!request) {
    notFound();  // Next.js 404 page
  }

  return <RequestDetailClient request={request} responses={responses} />;
}

// Add metadata for SEO and social sharing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { request } = await fetchRequestByToken(token);

  if (!request) {
    return {
      title: 'Request Not Found',
    };
  }

  const title = request.title;
  const description = request.context || `Looking for ${request.business_type_name} recommendations in ${request.location_name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://vouch.app/request/${token}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'Vouch',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
  };
}
```

---

**Implementation Steps**:

1. **Create server-side data fetching utilities** (`lib/server/requests.ts`):
```tsx
import { supabase } from '@/lib/supabase';

export async function fetchRequestByToken(token: string) {
  const { data: request, error: requestError } = await supabase
    .from('web_request_feed')
    .select('*')
    .eq('share_token', token)
    .single();

  if (requestError) {
    return { request: null, responses: [] };
  }

  const { data: responses, error: responsesError } = await supabase
    .from('web_request_responses')
    .select('*')
    .eq('request_id', request.id)
    .order('created_at', { ascending: false });

  return {
    request,
    responses: responses || [],
  };
}
```

2. **Create client component for interactive parts** (`components/RequestDetailClient.tsx`):
```tsx
'use client';

import { useState } from 'react';
import { ResponseForm } from '@/components/ResponseForm';
import { ResponseList } from '@/components/ResponseList';
import { ShareRequestButtons } from '@/components/ShareRequestButtons';
import type { Request, Response } from '@/types';

interface Props {
  request: Request;
  responses: Response[];
}

export function RequestDetailClient({ request, responses: initialResponses }: Props) {
  const [responses, setResponses] = useState(initialResponses);

  const handleNewResponse = (newResponse: Response) => {
    setResponses([newResponse, ...responses]);
  };

  return (
    <div>
      {/* Static content - server-rendered */}
      <RequestHeader request={request} />

      {/* Existing responses - server-rendered, then client-updated */}
      <ResponseList responses={responses} />

      {/* Share buttons - client interactive */}
      <ShareRequestButtons
        requestToken={request.share_token}
        requestTitle={request.title}
        businessType={request.business_type_name}
        location={request.location_name}
      />

      {/* Response form - client interactive */}
      <ResponseForm
        requestId={request.id}
        onSuccess={handleNewResponse}
      />
    </div>
  );
}
```

3. **Update page to use Server Component pattern**:
   - Remove `'use client'` directive
   - Use `async` function
   - Fetch data server-side
   - Pass to client component as props

**Benefits**:
- ✅ HTML rendered on server (SEO-friendly)
- ✅ Rich social previews on WhatsApp, SMS, Twitter
- ✅ Faster initial load (content visible before JS)
- ✅ Works if JavaScript fails to load
- ✅ Google can crawl and index all requests

---

### 1.2 Create OpenGraph Image Generator ✅

**Goal**: Beautiful social preview images
**Status**: ✅ Implemented at `app/api/og/route.tsx`

**Implementation**: `app/api/og/route.tsx`
```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Vouch - Get Recommendations';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
            }}
          >
            Get trusted recommendations from real people
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          vouch.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Benefits**:
- ✅ Beautiful preview cards on social platforms
- ✅ Increased click-through rates (40-60% higher)
- ✅ Professional brand appearance

---

### 1.3 Add Sitemap and Robots.txt ✅

**Goal**: Improve SEO discoverability
**Status**: ✅ Implemented

**Implementation**: `app/sitemap.ts`
```tsx
import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: requests } = await supabase
    .from('web_request_feed')
    .select('share_token, updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(1000);

  const requestUrls = (requests || []).map((request) => ({
    url: `https://vouch.app/request/${request.share_token}`,
    lastModified: new Date(request.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://vouch.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://vouch.app/create',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...requestUrls,
  ];
}
```

**File**: `app/robots.ts`
```tsx
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://vouch.app/sitemap.xml',
  };
}
```

**Benefits**:
- ✅ Google discovers all public requests
- ✅ Faster indexing
- ✅ Better search rankings

---

## Phase 2: Production Security & Reliability (Week 2)

**Goal**: Add critical production features
**Effort**: 3-4 days
**Impact**: 🔴 Critical - cannot launch without these

### 2.1 Rate Limiting

**Goal**: Prevent spam, abuse, and DDoS attacks

**Install Dependencies**:
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Setup Upstash**:
1. Create free account at https://upstash.com
2. Create Redis database
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env.local`

**File**: `middleware.ts` (NEW FILE)
```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 m'), // 10 requests per 10 minutes
  analytics: true,
  prefix: 'vouch-ratelimit',
});

export async function middleware(request: NextRequest) {
  // Only rate limit POST requests (form submissions)
  if (request.method !== 'POST') {
    return NextResponse.next();
  }

  // Get IP address
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // Check rate limit
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests. Please try again later.',
        limit,
        reset: new Date(reset).toISOString(),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match API routes and form submissions
    '/api/:path*',
    // Add specific paths that need rate limiting
  ],
};
```

**Alternative**: RPC-level rate limiting in Supabase functions

**File**: `sql/add_rate_limiting.sql`
```sql
-- Add rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_rate_limits_ip_action_time
ON rate_limits(ip_address, action, created_at);

-- Modify get_or_create_subcategory to include rate limiting
CREATE OR REPLACE FUNCTION get_or_create_subcategory(subcategory_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subcategory_id UUID;
  v_list_id UUID;
  v_ip_address TEXT;
  v_recent_count INT;
BEGIN
  -- Get IP from request headers (set by Supabase)
  v_ip_address := current_setting('request.headers', true)::json->>'x-forwarded-for';

  -- Check rate limit: max 5 new subcategories per IP per hour
  SELECT COUNT(*) INTO v_recent_count
  FROM rate_limits
  WHERE ip_address = v_ip_address
    AND action = 'create_subcategory'
    AND created_at > NOW() - INTERVAL '1 hour';

  IF v_recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;

  -- Get the subcategory list ID
  SELECT id INTO v_list_id
  FROM lists
  WHERE name = 'subcategory'
  LIMIT 1;

  IF v_list_id IS NULL THEN
    RAISE EXCEPTION 'Subcategory list not found';
  END IF;

  -- Try to find existing subcategory (case-insensitive)
  SELECT id INTO v_subcategory_id
  FROM list_items
  WHERE list_id = v_list_id
    AND LOWER(name) = LOWER(subcategory_name)
  LIMIT 1;

  -- If not found, create new subcategory
  IF v_subcategory_id IS NULL THEN
    INSERT INTO list_items (
      list_id,
      name,
      code_name,
      parent_id,
      metadata,
      sort_order
    ) VALUES (
      v_list_id,
      subcategory_name,
      LOWER(REPLACE(subcategory_name, ' ', '_')),
      NULL,
      jsonb_build_object(
        'user_generated', true,
        'source', 'web_poc',
        'verified', false,
        'created_at', NOW()::TEXT,
        'created_by_ip', v_ip_address
      ),
      999
    )
    RETURNING id INTO v_subcategory_id;

    -- Log rate limit action
    INSERT INTO rate_limits (ip_address, action)
    VALUES (v_ip_address, 'create_subcategory');
  END IF;

  RETURN v_subcategory_id;
END;
$$;

-- Apply same pattern to get_or_create_area
-- (Similar implementation - omitted for brevity)

-- Cleanup old rate limit entries (run as cron job)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;
```

**Benefits**:
- ✅ Prevents spam attacks
- ✅ Protects database from abuse
- ✅ Reduces hosting costs
- ✅ Industry standard: 10 requests per 10 minutes

---

### 2.2 Error Monitoring with Sentry

**Goal**: Track bugs, errors, and performance issues in production

**Install Sentry**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configure Sentry** (wizard auto-generates these files):

**File**: `sentry.client.config.ts`
```tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  environment: process.env.NODE_ENV,
});
```

**File**: `sentry.server.config.ts`
```tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV,
});
```

**File**: `sentry.edge.config.ts`
```tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV,
});
```

**Update Error Handling**:

**File**: `lib/hooks/useCreateRequest.ts`
```tsx
import * as Sentry from '@sentry/nextjs';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onError: (error, variables) => {
      console.error('Error creating request:', error);

      // Send to Sentry with context
      Sentry.captureException(error, {
        tags: {
          feature: 'create-request',
          component: 'useCreateRequest',
        },
        extra: {
          input: variables,
          timestamp: new Date().toISOString(),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
```

**Add Global Error Boundary**:

**File**: `app/error.tsx` (NEW FILE)
```tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We've been notified and are looking into it.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
```

**File**: `app/global-error.tsx` (NEW FILE)
```tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </div>
      </body>
    </html>
  );
}
```

**Environment Variables** (`.env.local`):
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token
```

**Benefits**:
- ✅ Real-time error alerts
- ✅ Stack traces with source maps
- ✅ User session replay
- ✅ Performance monitoring
- ✅ Free tier: 5k errors/month

---

### 2.3 Input Validation with Zod

**Goal**: Validate all user inputs to prevent bad data and security issues

**Install Zod**:
```bash
npm install zod
```

**File**: `lib/validation.ts` (NEW FILE)
```tsx
import { z } from 'zod';

// Request creation schema
export const createRequestSchema = z.object({
  locationId: z.string().uuid('Invalid location ID'),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  subcategoryId: z.string().uuid('Invalid subcategory ID').optional(),
  context: z
    .string()
    .max(500, 'Context must be 500 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  isNewBusinessType: z.boolean().default(false),
  newBusinessTypeName: z
    .string()
    .min(2, 'Business type must be at least 2 characters')
    .max(50, 'Business type must be 50 characters or less')
    .regex(/^[a-zA-Z0-9\s&'-]+$/, 'Invalid characters in business type name')
    .optional()
    .transform((val) => val?.trim()),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

// Response creation schema
export const createResponseSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  responderName: z
    .string()
    .max(100, 'Name must be 100 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(200, 'Business name must be 200 characters or less')
    .transform((val) => val.trim()),
  location: z
    .string()
    .max(200, 'Location must be 200 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  website: z
    .string()
    .url('Invalid website URL')
    .or(z.literal(''))
    .optional()
    .transform((val) => {
      if (!val || val === '') return null;
      // Add https:// if missing
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return `https://${val}`;
      }
      return val;
    }),
  instagram: z
    .string()
    .max(100, 'Instagram handle must be 100 characters or less')
    .optional()
    .transform((val) => {
      if (!val) return null;
      // Remove @ if present, trim whitespace
      return val.replace('@', '').trim();
    }),
  email: z
    .string()
    .email('Invalid email address')
    .or(z.literal(''))
    .optional()
    .transform((val) => {
      if (!val || val === '') return null;
      return val.toLowerCase().trim();
    }),
  notes: z
    .string()
    .max(1000, 'Notes must be 1000 characters or less')
    .optional()
    .transform((val) => val?.trim()),
});

export type CreateResponseInput = z.infer<typeof createResponseSchema>;

// New area schema
export const createAreaSchema = z.object({
  name: z
    .string()
    .min(2, 'Location name must be at least 2 characters')
    .max(100, 'Location name must be 100 characters or less')
    .regex(/^[a-zA-Z0-9\s,'-]+$/, 'Invalid characters in location name')
    .transform((val) => val.trim()),
});

export type CreateAreaInput = z.infer<typeof createAreaSchema>;

// New subcategory schema
export const createSubcategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Business type must be at least 2 characters')
    .max(50, 'Business type must be 50 characters or less')
    .regex(/^[a-zA-Z0-9\s&'-]+$/, 'Invalid characters in business type name')
    .transform((val) => val.trim()),
});

export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
```

**Update Hooks with Validation**:

**File**: `lib/hooks/useCreateRequest.ts`
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequestSchema, type CreateRequestInput } from '@/lib/validation';
import * as Sentry from '@sentry/nextjs';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRequestInput) => {
      // Validate input with Zod
      const validated = createRequestSchema.parse(input);

      // ... rest of implementation using validated data
    },
    onError: (error, variables) => {
      if (error instanceof z.ZodError) {
        // Validation error - show to user
        throw new Error(error.errors[0].message);
      }

      // Other errors - log to Sentry
      Sentry.captureException(error, {
        tags: { feature: 'create-request' },
        extra: { input: variables },
      });

      throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
```

**Update Components to Show Validation Errors**:

**File**: `components/CreateRequestForm.tsx`
```tsx
export function CreateRequestForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createRequest, creating } = useCreateRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const result = await createRequest(formData);
      // ... success handling
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <Alert variant="destructive">
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      {/* ... form fields */}
    </form>
  );
}
```

**Benefits**:
- ✅ Prevents invalid data in database
- ✅ Better error messages for users
- ✅ Type safety (TypeScript + Zod)
- ✅ Prevents XSS attacks (sanitization)
- ✅ Consistent validation across app

---

### 2.4 Content Moderation

**Goal**: Filter spam, profanity, and inappropriate content

**Install Dependencies**:
```bash
npm install bad-words
```

**File**: `lib/moderation.ts` (NEW FILE)
```tsx
import Filter from 'bad-words';

const filter = new Filter();

// Add custom words to filter
filter.addWords('spam', 'scam', 'viagra', 'crypto', 'nft');

export interface ModerationResult {
  clean: string;
  flagged: boolean;
  filtered: boolean;
}

export function moderateContent(text: string): ModerationResult {
  if (!text || text.trim() === '') {
    return { clean: '', flagged: false, filtered: false };
  }

  const flagged = filter.isProfane(text);
  const clean = filter.clean(text);

  return {
    clean,
    flagged,
    filtered: clean !== text,
  };
}

// Stricter validation for user-generated categories
export function validateBusinessTypeName(name: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = name.trim();

  // Check length
  if (trimmed.length < 2) {
    return { valid: false, error: 'Business type must be at least 2 characters' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Business type must be 50 characters or less' };
  }

  // Check for profanity
  const { flagged } = moderateContent(trimmed);
  if (flagged) {
    return { valid: false, error: 'Business type contains inappropriate language' };
  }

  // Check for spam patterns
  const spamPatterns = [
    /\b(buy|cheap|discount|free|click here|viagra|casino)\b/i,
    /http[s]?:\/\//i, // URLs
    /\d{10,}/i, // Long numbers (phone numbers, etc.)
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Business type appears to be spam' };
    }
  }

  // Check for valid characters
  if (!/^[a-zA-Z0-9\s&'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Business type contains invalid characters' };
  }

  return { valid: true };
}

// Same for location names
export function validateLocationName(name: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Location must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Location must be 100 characters or less' };
  }

  const { flagged } = moderateContent(trimmed);
  if (flagged) {
    return { valid: false, error: 'Location contains inappropriate language' };
  }

  if (!/^[a-zA-Z0-9\s,'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Location contains invalid characters' };
  }

  return { valid: true };
}
```

**Update Hooks with Moderation**:

**File**: `lib/hooks/useCreateRequest.ts`
```tsx
import { moderateContent } from '@/lib/moderation';

export function useCreateRequest() {
  return useMutation({
    mutationFn: async (input: CreateRequestInput) => {
      // Validate and moderate context
      if (input.context) {
        const { flagged, clean } = moderateContent(input.context);
        if (flagged) {
          throw new Error('Your request contains inappropriate language. Please revise and try again.');
        }
        input.context = clean;
      }

      // Validate new business type name
      if (input.isNewBusinessType && input.newBusinessTypeName) {
        const validation = validateBusinessTypeName(input.newBusinessTypeName);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
      }

      // ... rest of implementation
    },
  });
}
```

**Benefits**:
- ✅ Filters profanity automatically
- ✅ Prevents spam submissions
- ✅ Protects brand reputation
- ✅ Reduces manual moderation work

---

### 2.5 Analytics

**Goal**: Understand user behavior and optimize features

**Install Dependencies**:
```bash
npm install @vercel/analytics posthog-js
```

**File**: `app/layout.tsx`
```tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PHProvider } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PHProvider>
          <Providers>
            {children}
            <Analytics />
            <SpeedInsights />
          </Providers>
        </PHProvider>
      </body>
    </html>
  );
}
```

**File**: `app/providers.tsx`
```tsx
'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: 'https://app.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

**Track Key Events**:

**File**: `lib/hooks/useCreateRequest.ts`
```tsx
import { usePostHog } from 'posthog-js/react';

export function useCreateRequest() {
  const posthog = usePostHog();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: (data, variables) => {
      // Track successful request creation
      posthog.capture('request_created', {
        category_id: variables.categoryId,
        subcategory_id: variables.subcategoryId,
        location_id: variables.locationId,
        is_new_business_type: variables.isNewBusinessType,
        has_context: !!variables.context,
        share_token: data.share_token,
      });
    },
  });
}
```

**Track Share Events**:

**File**: `components/ShareRequestButtons.tsx`
```tsx
import { usePostHog } from 'posthog-js/react';

export function ShareRequestButtons({ requestToken, requestTitle }: Props) {
  const posthog = usePostHog();

  const handleCopyLink = async () => {
    await copyToClipboard(url);
    posthog.capture('request_shared', {
      method: 'copy_link',
      request_token: requestToken,
    });
  };

  const handleWhatsAppShare = () => {
    window.open(whatsappUrl, '_blank');
    posthog.capture('request_shared', {
      method: 'whatsapp',
      request_token: requestToken,
    });
  };

  const handleSMSShare = () => {
    window.open(smsUrl, '_blank');
    posthog.capture('request_shared', {
      method: 'sms',
      request_token: requestToken,
    });
  };

  // ... render
}
```

**Environment Variables** (`.env.local`):
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
```

**Benefits**:
- ✅ Track user journeys
- ✅ Measure conversion rates
- ✅ Identify popular features
- ✅ A/B testing capability
- ✅ Free tier: 1M events/month

---

### 2.6 Environment Variable Validation

**Goal**: Fail fast on startup if required env vars are missing

**File**: `lib/env.ts` (NEW FILE)
```tsx
import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),

  // Sentry (optional in development)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Upstash Redis (optional in development)
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // PostHog (optional)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

// Validate on module load
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
```

**Update Supabase Client**:

**File**: `lib/supabase.ts`
```tsx
import { createClient } from '@supabase/supabase-js';
import { env } from './env'; // Import validated env

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
```

**Benefits**:
- ✅ Fails on startup if env vars missing (not at runtime)
- ✅ Type-safe environment variables
- ✅ Better developer experience
- ✅ Prevents production misconfigurations

---

## Phase 3: UX Enhancements (Week 3, Optional)

**Goal**: Polish user experience
**Effort**: 3-5 days
**Impact**: 🟡 Important but not blocking

### 3.1 Loading Skeletons

**Replace spinners with content-shaped skeletons**

**File**: `components/RequestCardSkeleton.tsx` (NEW FILE)
```tsx
export function RequestCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="flex gap-4 mt-4">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
```

**Usage**:
```tsx
{loading ? (
  <>
    <RequestCardSkeleton />
    <RequestCardSkeleton />
    <RequestCardSkeleton />
  </>
) : (
  requests.map((request) => <RequestCard key={request.id} request={request} />)
)}
```

---

### 3.2 Pagination

**Add pagination to request feed**

**File**: `lib/hooks/useRequests.ts`
```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

const REQUESTS_PER_PAGE = 20;

export function useRequests(filters: RequestFilters, locationIds?: string[]) {
  return useInfiniteQuery({
    queryKey: ['requests', filters, locationIds],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('web_request_feed')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + REQUESTS_PER_PAGE - 1);

      // Apply filters...

      const { data, error } = await query;
      if (error) throw error;

      return {
        requests: data || [],
        nextPage: data && data.length === REQUESTS_PER_PAGE ? pageParam + REQUESTS_PER_PAGE : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 2 * 60 * 1000,
  });
}
```

**Component**:
```tsx
export default function HomePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRequests(filters, locationIds);

  const requests = data?.pages.flatMap((page) => page.requests) ?? [];

  return (
    <div>
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
}
```

---

### 3.3 Search Highlighting

**Highlight matched terms in search results**

**File**: `components/RequestCard.tsx`
```tsx
function highlightMatch(text: string, searchTerm: string) {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-gray-900">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function RequestCard({ request, searchTerm }: Props) {
  return (
    <div>
      <h3>{highlightMatch(request.title, searchTerm)}</h3>
      {request.context && <p>{highlightMatch(request.context, searchTerm)}</p>}
    </div>
  );
}
```

---

## Testing Strategy

### Manual Testing Checklist

Before deployment, test:

**SSR & SEO**:
- [ ] Request detail page shows content with JS disabled
- [ ] View page source - HTML contains request title and context
- [ ] Share link on WhatsApp - preview card shows
- [ ] Share link on Twitter - preview card shows
- [ ] Google Search Console - pages indexed

**Rate Limiting**:
- [ ] Submit 10 requests rapidly - 11th should fail with 429
- [ ] Wait 10 minutes - can submit again
- [ ] Different IP addresses work independently

**Error Monitoring**:
- [ ] Trigger an error - appears in Sentry dashboard
- [ ] Check Sentry for stack trace
- [ ] Verify source maps work (code not minified in Sentry)

**Validation**:
- [ ] Submit empty form - shows validation errors
- [ ] Submit profanity - rejected with error
- [ ] Submit valid data - succeeds

**Analytics**:
- [ ] Create request - event appears in PostHog
- [ ] Share request - event appears in PostHog
- [ ] Submit response - event appears in PostHog

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set in Vercel
- [ ] Sentry project created and DSN configured
- [ ] Upstash Redis database created
- [ ] PostHog project created
- [ ] Database migrations applied
- [ ] Run `npm run build` - no errors
- [ ] Run `npm run type-check` - no errors

### Vercel Configuration

**Environment Variables**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

**Build Settings**:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Post-Deployment

- [ ] Test production URL
- [ ] Check Sentry - no errors
- [ ] Check PostHog - events tracking
- [ ] Check Vercel Analytics - page views
- [ ] Test rate limiting on production
- [ ] Submit test request - verify email notification (if implemented)

---

## Success Metrics

After implementation, measure:

### Performance
- **Lighthouse Score**: > 90 (currently: ~70)
- **Time to First Byte (TTFB)**: < 200ms (currently: ~500ms)
- **First Contentful Paint (FCP)**: < 1s (currently: ~2s)
- **Total Blocking Time (TBT)**: < 300ms

### SEO
- **Indexed Pages**: 100% of public requests (currently: 0%)
- **Social Share CTR**: > 20% (WhatsApp previews)
- **Organic Traffic**: Measurable (currently: none)

### Reliability
- **Error Rate**: < 0.1% (tracked in Sentry)
- **Uptime**: > 99.9% (Vercel)
- **Spam Rate**: < 1% (content moderation)

### User Engagement
- **Request Creation**: Track conversion rate
- **Share Rate**: % of requests shared
- **Response Rate**: Avg responses per request
- **Return Rate**: % of users creating 2+ requests

---

## Timeline Summary

| Phase | Tasks | Duration | Priority |
|-------|-------|----------|----------|
| **Phase 1: SSR** | Convert pages, add OG images, sitemap | 2-3 days | 🔴 Critical |
| **Phase 2: Production** | Rate limiting, Sentry, validation, analytics | 3-4 days | 🔴 Critical |
| **Phase 3: UX** | Skeletons, pagination, highlighting | 3-5 days | 🟡 Important |
| **Testing & Deployment** | QA, deploy, monitor | 1-2 days | 🔴 Critical |

**Total**: 9-14 days (2-3 weeks)

---

## Expected Outcome

After implementation, vouch-web will be:

✅ **Superior in Tech**:
- Same modern stack as vouch-mvp (Next.js 16, React 19, shadcn/ui)
- Better caching (React Query multi-tier)
- Better database design (views + RPC)
- SSR for SEO and performance

✅ **Superior in Functionality**:
- All vouch-mvp features (request/response system)
- Plus: Hierarchical filtering, user-generated content, "My Requests"
- Plus: Production monitoring, rate limiting, validation

✅ **Superior in UX**:
- Faster initial load (SSR)
- Better caching (instant navigation)
- Smart filtering (hierarchical)
- Rich social previews
- Real-time error tracking

✅ **Production-Ready**:
- Rate limiting (prevents abuse)
- Error monitoring (Sentry)
- Analytics (PostHog + Vercel)
- Input validation (Zod)
- Content moderation
- Environment validation

**Result**: A production-ready application that exceeds vouch-mvp in every dimension, ready to scale to 10k+ users.
