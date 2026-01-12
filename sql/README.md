# Database Migrations

This folder contains SQL scripts for database migrations.

## How to Apply Migrations

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and execute

## Available Migrations

### get_or_create_subcategory.sql

**Purpose**: Enable user-generated business types

**What it does**:
- Creates a PostgreSQL function to get or create subcategories by name
- Allows users to add new business types without admin approval
- New subcategories are marked with `user_generated: true` metadata
- No parent category required (user-generated subcategories are standalone)

**When to apply**: Before enabling the "Add New Business Type" feature in the web app

**Function signature**:
```sql
get_or_create_subcategory(subcategory_name TEXT) RETURNS UUID
```

**Example usage**:
```sql
-- Create or find "Massage Therapist"
SELECT get_or_create_subcategory('Massage Therapist');

-- Returns the UUID of the subcategory (creates if doesn't exist)
```

**Metadata structure** for user-generated items:
```json
{
  "user_generated": true,
  "source": "web_poc",
  "verified": false,
  "created_at": "2026-01-12T..."
}
```

## Reviewing User-Generated Subcategories

Query to find all user-generated business types:

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

## Assigning Parent Categories (Admin Task)

If you want to organize user-generated subcategories later:

```sql
-- Find the parent category ID (e.g., "Health & Wellness")
SELECT id FROM list_items
WHERE list_id = (SELECT id FROM lists WHERE name = 'category')
  AND name = 'Health & Wellness';

-- Assign parent to subcategory
UPDATE list_items
SET parent_id = '<category-uuid>'
WHERE id = '<subcategory-uuid>';
```
