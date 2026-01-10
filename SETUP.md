# Vouch Web - Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- Access to Vouch Supabase project
- Database migration 006 applied

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd C:\Users\seand\vouch-web
npm install
```

Expected output: All packages installed successfully

### 2. Create Environment File

```bash
copy .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials.

**Where to find Supabase credentials:**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your Vouch project
3. Click Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Database Migration

**Location**: `C:\Users\seand\Vouch\sql\migrations\006_web_poc_support.sql`

**Steps**:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy entire contents of `006_web_poc_support.sql`
5. Paste into SQL editor
6. Click "Run"

**Expected output**:
```
NOTICE: Migration 006: Verification complete - Web POC support enabled
```

### 4. Start Development Server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in Xms
```

### 5. Test the Application

Open [http://localhost:3000](http://localhost:3000)

**Test checklist**:
- [ ] Home page loads
- [ ] Can see existing requests (if any)
- [ ] Filters work (location, business type, search)
- [ ] Click "Create Request" button
- [ ] Fill out form and submit
- [ ] Redirected to request detail page
- [ ] Can submit a response
- [ ] Response appears in list

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Cause**: `.env.local` file not found or variables not set

**Fix**:
1. Ensure `.env.local` exists in `vouch-web/` folder
2. Check variable names match exactly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart dev server after changing `.env.local`

### Error: "List 'area' not found"

**Cause**: Database migration not run or incomplete

**Fix**:
1. Re-run migration 006 in Supabase SQL Editor
2. Check output for errors
3. Verify `lists` table contains entry with `name = 'area'`

### Error: "relation 'web_request_feed' does not exist"

**Cause**: Views not created by migration

**Fix**:
1. Run migration 006 again
2. Check Supabase logs for errors during view creation
3. Manually verify views exist:
   ```sql
   SELECT * FROM information_schema.views
   WHERE table_name IN ('web_request_feed', 'web_request_responses');
   ```

### No Requests Showing on Home Page

**Possible causes**:
1. No public requests in database yet
2. RLS policies blocking access
3. Views not returning data

**Fix**:
1. Create a test request using the form
2. Check Supabase Table Editor → `rec_requests` for data
3. Verify `is_public = true` on requests
4. Test query directly in SQL Editor:
   ```sql
   SELECT * FROM web_request_feed LIMIT 5;
   ```

### TypeScript Errors

**Fix**:
```bash
npm run type-check
```

If errors persist, check that all type imports are correct.

### Port 3000 Already in Use

**Fix**:
```bash
# Use different port
npm run dev -- -p 3001
```

Or kill process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Verification Checklist

After setup, verify:

- [ ] Dev server starts without errors
- [ ] Home page loads at http://localhost:3000
- [ ] Categories and areas load in filters
- [ ] Can navigate to /create
- [ ] Can submit a request
- [ ] Request appears in feed
- [ ] Can open request detail page
- [ ] Can submit a response
- [ ] Response appears in list

## Next Steps

1. **Create Test Data**: Add a few requests and responses to test functionality
2. **Test Sharing**: Copy request link and open in another browser/incognito
3. **Test User-Generated Location**: Type a new location name in create form
4. **Review Database**: Check `list_items` for new user-generated areas

## Getting Help

If issues persist:
1. Check browser console for errors (F12)
2. Check terminal for server errors
3. Review Supabase logs in dashboard
4. Verify migration 006 completed successfully

## Development Tips

- **Hot Reload**: Changes to files auto-reload (no restart needed)
- **Type Safety**: VS Code will show TypeScript errors inline
- **React Query DevTools**: Can be added for debugging cache
- **Database Changes**: If you modify schema, update types in `types/database.ts`

## Production Deployment

See [README.md](README.md#deployment) for Vercel deployment instructions.
