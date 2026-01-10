/**
 * Database types for Vouch Web POC
 * Based on Supabase schema with web-specific views
 */

export interface HierarchyItem {
  id: string;
  name: string;
  code_name?: string | null;
  parent_id?: string | null;
  list_id?: string | null;
  metadata?: Record<string, any> | null;
  sort_order?: number | null;
}

export interface WebRequestFeed {
  id: string;
  share_token: string;
  title: string;
  context: string | null;
  created_at: string;
  status: string | null;
  user_id: string | null;
  area_id: string | null;
  location_name: string | null;
  location_user_generated: boolean | null;
  category_id: string | null;
  business_type_name: string | null;
  subcategory_id: string | null;
  subcategory_name: string | null;
  response_count: number;
  requester_name: string;
}

export interface WebRequestResponse {
  id: string;
  request_id: string;
  created_at: string;
  is_guest: boolean;
  responder_name: string | null;
  business_name: string;
  website: string | null;
  email: string | null;
  instagram: string | null;
  location: string | null;
  notes: string | null;
  user_id: string | null;
  voucher_name: string | null;
  is_business_linked: boolean;
}

export interface RecRequest {
  id: string;
  user_id: string | null;
  title: string;
  context: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  area_id: string | null;
  neighbourhood_id: string | null;
  city_id: string | null;
  share_token: string;
  is_public: boolean;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecResponse {
  id?: string;
  request_id: string;
  user_id?: string | null;
  business_id?: string | null;
  business_name?: string | null;
  email?: string | null;
  instagram?: string | null;
  website?: string | null;
  location?: string | null;
  notes?: string | null;
  comment?: string | null;
  is_guest?: boolean;
  responder_name?: string | null;
  created_at?: string;
}

export interface ListItem {
  id: string;
  list_id: string | null;
  name: string;
  code_name: string | null;
  parent_id: string | null;
  metadata: Record<string, any> | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}
