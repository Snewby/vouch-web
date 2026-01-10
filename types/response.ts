export interface CreateResponseInput {
  request_id: string;
  responder_name?: string | null;
  business_name: string;
  email?: string | null;
  instagram?: string | null;
  website?: string | null;
  location?: string | null;
  notes?: string | null;
  is_guest: boolean;
}

export interface ResponseFormData {
  responderName?: string;
  businessName: string;
  email?: string;
  instagram?: string;
  website?: string;
  location?: string;
  notes?: string;
}
