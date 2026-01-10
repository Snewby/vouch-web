import { HierarchyItem } from './database';

export interface CreateRequestInput {
  title: string;
  context?: string | null;
  category_id: string;
  subcategory_id?: string | null;
  area_id: string;
  neighbourhood_id?: string | null;
  city_id?: string | null;
}

export interface RequestFormData {
  title: string;
  location: string; // Will be converted to area_id
  businessType: string; // category_id
  subcategory?: string; // subcategory_id
  context?: string;
}

export interface RequestFilters {
  location?: string; // area_id
  businessType?: string; // category_id
  search?: string;
}
