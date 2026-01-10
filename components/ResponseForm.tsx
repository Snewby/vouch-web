/**
 * Form for submitting a text-based response
 */

'use client';

import { useState } from 'react';
import { useCreateResponse } from '@/lib/hooks/useCreateResponse';

interface ResponseFormProps {
  requestId: string;
  onSuccess?: () => void;
}

export function ResponseForm({ requestId, onSuccess }: ResponseFormProps) {
  const { createResponseAsync, loading, error } = useCreateResponse();
  const [formData, setFormData] = useState({
    responderName: '',
    businessName: '',
    email: '',
    instagram: '',
    website: '',
    location: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createResponseAsync({
        request_id: requestId,
        responder_name: formData.responderName || null,
        business_name: formData.businessName,
        email: formData.email || null,
        instagram: formData.instagram || null,
        website: formData.website || null,
        location: formData.location || null,
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
        notes: '',
      });

      // Show success
      alert('Recommendation submitted successfully!');

      // Trigger refresh
      onSuccess?.();
    } catch (err: any) {
      console.error('Error creating response:', err);
      alert(err.message || 'Failed to submit recommendation. Please try again.');
    }
  };

  const isFormValid = formData.businessName.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Your Name (optional) */}
      <div>
        <label htmlFor="responderName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name (optional)
        </label>
        <input
          id="responderName"
          type="text"
          placeholder="e.g., John Doe"
          value={formData.responderName}
          onChange={(e) => setFormData({ ...formData, responderName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Business Name (required) */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <input
          id="businessName"
          type="text"
          required
          placeholder="e.g., Joe's Plumbing"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Location (optional) */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location (optional)
        </label>
        <input
          id="location"
          type="text"
          placeholder="e.g., Hackney, London"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Contact Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            placeholder="contact@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Instagram */}
        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
            Instagram (optional)
          </label>
          <input
            id="instagram"
            type="text"
            placeholder="@handle"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website (optional)
          </label>
          <input
            id="website"
            type="url"
            placeholder="example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Why do you recommend them? (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Share your experience..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Submitting...' : 'Submit Recommendation'}
      </button>
    </form>
  );
}
