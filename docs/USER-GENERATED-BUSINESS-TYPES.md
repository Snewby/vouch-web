# User-Generated Business Types Feature

## Overview

Users can now create custom business types on-the-fly when creating a request, similar to how they can add custom locations. This eliminates the need for admin approval and allows for organic growth of the business type taxonomy.

## How It Works

### User Experience

1. **User types a new business type** (e.g., "Massage Therapist")
2. **System shows indicator**: ✓ "Massage Therapist" will be added as a new business type
3. **User submits the form**
4. **System automatically creates the subcategory** and saves the request

### Technical Implementation

#### Database Layer

**Function**: `get_or_create_subcategory(subcategory_name TEXT)`
- Location: `sql/get_or_create_subcategory.sql`
- Returns: UUID of the subcategory
- Creates new subcategory if it doesn't exist
- Marks with `user_generated: true` metadata
- No parent category required (parent_id = NULL)

**Metadata Structure**:
```json
{
  "user_generated": true,
  "source": "web_poc",
  "verified": false,
  "created_at": "2026-01-12T..."
}
```

#### React Hooks

**`useCreateSubcategory`** (`lib/hooks/useCreateSubcategory.ts`)
- Calls the database RPC function
- Returns subcategory UUID
- Handles errors

#### Component Changes

**CategorySearch** (`components/CategorySearch.tsx`)
- Shows green "will be added" indicator when no match found
- Passes `isNew` flag and new business type name to parent
- Updated callback signature to support new items

**CreateRequestForm** (`components/CreateRequestForm.tsx`)
- Detects when user is creating new business type
- Calls `getOrCreateSubcategoryAsync` before creating request
- Stores subcategory_id with null category_id

## Database Migration

### Required Steps

1. Open Supabase Dashboard → SQL Editor
2. Run the SQL from `sql/get_or_create_subcategory.sql`
3. Verify function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'get_or_create_subcategory';
   ```

### Rollback (if needed)

```sql
DROP FUNCTION IF EXISTS get_or_create_subcategory(TEXT);
```

## Data Management

### Viewing User-Generated Business Types

```sql
SELECT
  li.id,
  li.name,
  li.created_at,
  li.metadata
FROM list_items li
JOIN lists l ON li.list_id = l.id
WHERE l.name = 'subcategory'
  AND li.metadata->>'user_generated' = 'true'
ORDER BY li.created_at DESC;
```

### Assigning Parent Categories (Optional)

Admins can later organize user-generated subcategories:

```sql
-- Find parent category ID
SELECT id, name FROM list_items
WHERE list_id = (SELECT id FROM lists WHERE name = 'category')
  AND parent_id IS NULL;

-- Assign parent
UPDATE list_items
SET parent_id = '<category-uuid>'
WHERE id = '<subcategory-uuid>';
```

### Verifying User-Generated Items

```sql
UPDATE list_items
SET metadata = metadata || '{"verified": true}'::jsonb
WHERE id = '<subcategory-uuid>';
```

## Design Decisions

### Why No Parent Category Required?

1. **Simpler UX**: Users don't need to understand category hierarchy
2. **Faster creation**: One-step process instead of two
3. **Matches location pattern**: Consistent with how location creation works
4. **Admin can organize later**: Parent categories can be assigned retroactively

### Why Flat Structure for User-Generated Items?

- User-generated items start with `parent_id: NULL`
- They appear in search alongside regular subcategories
- Can be filtered and displayed normally
- Admins can curate and assign categories later
- Keeps the user experience simple

## Testing Checklist

- [x] Type new business type that doesn't exist
- [x] See green indicator "will be added as new business type"
- [ ] Submit form successfully (requires database migration)
- [ ] Verify new subcategory created with user_generated flag
- [ ] Verify request saved with subcategory_id (category_id = null)
- [ ] Verify new business type appears in search immediately
- [ ] Verify filtering by new business type works
- [ ] Verify display shows subcategory name correctly

## Future Enhancements

1. **Admin dashboard** to review/verify user-generated items
2. **Duplicate detection** using fuzzy matching (e.g., "Massage Therapist" vs "Massage Therapy")
3. **Auto-categorization** using ML to suggest parent categories
4. **Popularity tracking** to promote commonly used items
5. **Merge functionality** for duplicates
