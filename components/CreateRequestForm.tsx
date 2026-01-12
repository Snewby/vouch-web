/**
 * Form for creating a new request
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAllCategoriesFlat } from '@/lib/hooks/useAllCategoriesFlat';
import { useLocationHierarchy } from '@/lib/hooks/useLocationHierarchy';
import { useCreateRequest } from '@/lib/hooks/useCreateRequest';
import { useCreateArea } from '@/lib/hooks/useCreateArea';
import { useCreateSubcategory } from '@/lib/hooks/useCreateSubcategory';
import { LocationAutocomplete } from './LocationAutocomplete';
import { CategorySearch } from './CategorySearch';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { addMyRequest } from '@/lib/localStorage';

export function CreateRequestForm() {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useAllCategoriesFlat();
  const { areas, loading: areasLoading } = useLocationHierarchy();
  const { createRequestAsync, loading: creating, error } = useCreateRequest();
  const { getOrCreateAreaAsync } = useCreateArea();
  const { getOrCreateSubcategoryAsync } = useCreateSubcategory();

  const [formData, setFormData] = useState({
    location: '',
    locationId: '',
    categoryId: '',
    subcategoryId: '',
    selectedCategoryOptionId: '', // The actual selected option ID (could be category or subcategory)
    context: '',
    isNewBusinessType: false,
    newBusinessTypeName: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLocationSelect = (areaId: string, areaName: string) => {
    setFormData({ ...formData, locationId: areaId, location: areaName });
  };

  const handleCategorySelect = (
    optionId: string,
    categoryId: string,
    subcategoryId: string | null,
    isNew: boolean,
    newName?: string
  ) => {
    setFormData({
      ...formData,
      selectedCategoryOptionId: optionId,
      categoryId,
      subcategoryId: subcategoryId || '',
      isNewBusinessType: isNew,
      newBusinessTypeName: newName || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      // Get or create area ID
      let areaId = formData.locationId;
      if (!areaId && formData.location) {
        areaId = await getOrCreateAreaAsync(formData.location);
      }

      if (!areaId) {
        setValidationError('Please select a location');
        return;
      }

      // Handle new business type creation
      let subcategoryId = formData.subcategoryId;
      let categoryId = formData.categoryId;

      if (formData.isNewBusinessType && formData.newBusinessTypeName) {
        // Create new subcategory (no parent category needed)
        subcategoryId = await getOrCreateSubcategoryAsync(formData.newBusinessTypeName);
        categoryId = ''; // No parent category for user-generated
      }

      // Create request
      const request = await createRequestAsync({
        title: '', // Will be auto-generated on backend
        context: formData.context || null,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        area_id: areaId,
      });

      // Save to localStorage for "Your Requests" feature
      addMyRequest(request.share_token);

      // Redirect to request detail page with success indicator
      router.push(`/request/${request.share_token}?new=1`);
    } catch (err: any) {
      console.error('Error creating request:', err);
      setValidationError(err.message || 'Failed to create request. Please try again.');
    }
  };

  const isFormValid =
    (formData.locationId || formData.location.trim()) &&
    (formData.categoryId || formData.isNewBusinessType);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
        <Textarea
          id="context"
          rows={4}
          placeholder="Add any specific requirements or context..."
          value={formData.context}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          className="resize-none"
        />
      </div>

      {/* Error Messages */}
      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || creating}
        size="lg"
        className="w-full"
      >
        {creating ? 'Creating...' : 'Create Request'}
      </Button>
    </form>
  );
}
