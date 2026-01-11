/**
 * Form for creating a new request
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAllCategoriesFlat } from '@/lib/hooks/useAllCategoriesFlat';
import { useCachedAreas } from '@/lib/hooks/useCachedAreas';
import { useCreateRequest } from '@/lib/hooks/useCreateRequest';
import { useCreateArea } from '@/lib/hooks/useCreateArea';
import { LocationAutocomplete } from './LocationAutocomplete';
import { CategorySearch } from './CategorySearch';

export function CreateRequestForm() {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useAllCategoriesFlat();
  const { areas, loading: areasLoading } = useCachedAreas();
  const { createRequestAsync, loading: creating, error } = useCreateRequest();
  const { getOrCreateAreaAsync } = useCreateArea();

  const [formData, setFormData] = useState({
    location: '',
    locationId: '',
    categoryId: '',
    subcategoryId: '',
    selectedCategoryOptionId: '', // The actual selected option ID (could be category or subcategory)
    context: '',
  });

  const handleLocationSelect = (areaId: string, areaName: string) => {
    setFormData({ ...formData, locationId: areaId, location: areaName });
  };

  const handleCategorySelect = (
    optionId: string,
    categoryId: string,
    subcategoryId: string | null
  ) => {
    setFormData({
      ...formData,
      selectedCategoryOptionId: optionId,
      categoryId,
      subcategoryId: subcategoryId || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get or create area ID
      let areaId = formData.locationId;
      if (!areaId && formData.location) {
        areaId = await getOrCreateAreaAsync(formData.location);
      }

      if (!areaId) {
        alert('Please select a location');
        return;
      }

      // Create request
      const request = await createRequestAsync({
        title: '', // Will be auto-generated on backend
        context: formData.context || null,
        category_id: formData.categoryId,
        subcategory_id: formData.subcategoryId || null,
        area_id: areaId,
      });

      // Show success message
      alert('Request created successfully! You can now share the link.');

      // Redirect to request detail page
      router.push(`/request/${request.share_token}`);
    } catch (err: any) {
      console.error('Error creating request:', err);
      alert(err.message || 'Failed to create request. Please try again.');
    }
  };

  const isFormValid =
    (formData.locationId || formData.location.trim()) &&
    formData.categoryId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
          What are you looking for? *
        </label>
        <CategorySearch
          categories={categories}
          loading={categoriesLoading}
          value={formData.selectedCategoryOptionId}
          onSelect={handleCategorySelect}
          required
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <LocationAutocomplete
          areas={areas}
          loading={areasLoading}
          value={formData.location}
          onSelect={handleLocationSelect}
          onChange={(value) => setFormData({ ...formData, location: value, locationId: '' })}
          showParentContext={true}
        />
      </div>

      {/* Context (optional) */}
      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
          Additional details (optional)
        </label>
        <textarea
          id="context"
          rows={4}
          placeholder="Add any specific requirements or context..."
          value={formData.context}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || creating}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {creating ? 'Creating...' : 'Create Request'}
      </button>
    </form>
  );
}
