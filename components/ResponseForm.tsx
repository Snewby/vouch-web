/**
 * Form for submitting a text-based response
 */

'use client';

import { useState } from 'react';
import { useCreateResponse } from '@/lib/hooks/useCreateResponse';
import { useLocationHierarchy } from '@/lib/hooks/useLocationHierarchy';
import { useCreateArea } from '@/lib/hooks/useCreateArea';
import { LocationAutocomplete } from './LocationAutocomplete';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CheckCircle2 } from 'lucide-react';

interface ResponseFormProps {
  requestId: string;
  onSuccess?: () => void;
}

export function ResponseForm({ requestId, onSuccess }: ResponseFormProps) {
  const { createResponseAsync, loading, error } = useCreateResponse();
  const { areas, loading: areasLoading } = useLocationHierarchy();
  const { getOrCreateAreaAsync } = useCreateArea();

  const [formData, setFormData] = useState({
    responderName: '',
    businessName: '',
    email: '',
    instagram: '',
    website: '',
    location: '',
    locationId: '',
    notes: '',
  });

  const [success, setSuccess] = useState(false);

  const handleLocationSelect = (areaId: string, areaName: string) => {
    setFormData({ ...formData, locationId: areaId, location: areaName });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      // Get or create area ID if location is provided
      let locationToSave = formData.location;
      if (formData.location && !formData.locationId) {
        // User typed a new location, create it
        await getOrCreateAreaAsync(formData.location);
      }

      await createResponseAsync({
        request_id: requestId,
        responder_name: formData.responderName || null,
        business_name: formData.businessName,
        email: formData.email || null,
        instagram: formData.instagram || null,
        website: formData.website || null,
        location: locationToSave || null,
        notes: formData.notes || null,
        is_guest: true,
      });

      // Reset form
      setFormData({
        responderName: '',
        businessName: '',
        email: '',
        instagram: '',
        website: '',
        location: '',
        locationId: '',
        notes: '',
      });

      // Show success
      setSuccess(true);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

      // Trigger refresh
      onSuccess?.();
    } catch (err: any) {
      console.error('Error creating response:', err);
    }
  };

  const isFormValid = formData.businessName.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Recommendation submitted successfully! Thank you for sharing.
          </AlertDescription>
        </Alert>
      )}

      {/* Your Name (optional) */}
      <div>
        <label htmlFor="responderName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name (optional)
        </label>
        <Input
          id="responderName"
          type="text"
          placeholder="e.g., John Doe"
          value={formData.responderName}
          onChange={(e) => setFormData({ ...formData, responderName: e.target.value })}
        />
      </div>

      {/* Business Name (required) */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <Input
          id="businessName"
          type="text"
          required
          placeholder="e.g., Joe's Plumbing"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
        />
      </div>

      {/* Location (optional) */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location (optional)
        </label>
        <LocationAutocomplete
          areas={areas}
          loading={areasLoading}
          value={formData.location}
          onSelect={handleLocationSelect}
          onChange={(value) => setFormData({ ...formData, location: value, locationId: '' })}
          required={false}
          showParentContext={true}
        />
      </div>

      {/* Contact Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <Input
            id="email"
            type="email"
            placeholder="contact@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Instagram */}
        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
            Instagram (optional)
          </label>
          <Input
            id="instagram"
            type="text"
            placeholder="@handle"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website (optional)
          </label>
          <Input
            id="website"
            type="url"
            placeholder="example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Why do you recommend them? (optional)
        </label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Share your experience..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Submit Recommendation'}
      </Button>
    </form>
  );
}
