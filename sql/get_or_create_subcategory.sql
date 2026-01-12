-- Function to get or create a subcategory by name
-- Used for user-generated business types
-- Returns the subcategory UUID

CREATE OR REPLACE FUNCTION get_or_create_subcategory(subcategory_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subcategory_id UUID;
  v_list_id UUID;
BEGIN
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
      NULL, -- No parent category for user-generated items
      jsonb_build_object(
        'user_generated', true,
        'source', 'web_poc',
        'verified', false,
        'created_at', NOW()::TEXT
      ),
      999 -- Low priority sort order
    )
    RETURNING id INTO v_subcategory_id;
  END IF;

  RETURN v_subcategory_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_or_create_subcategory(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_subcategory(TEXT) TO anon;
