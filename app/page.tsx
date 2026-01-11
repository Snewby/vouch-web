/**
 * Home page - Request feed with filters
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRequests } from '@/lib/hooks/useRequests';
import { useCachedCategories } from '@/lib/hooks/useCachedCategories';
import { useLocationHierarchy } from '@/lib/hooks/useLocationHierarchy';
import { RequestCard } from '@/components/RequestCard';
import { RequestFilters } from '@/components/RequestFilters';
import { MyRequests } from '@/components/MyRequests';
import type { RequestFilters as RequestFiltersType } from '@/types/request';

export default function HomePage() {
  const [filters, setFilters] = useState<RequestFiltersType>({});
  const { categories } = useCachedCategories();
  const { areas, getLocationWithDescendants } = useLocationHierarchy();

  // Expand location filter to include all descendants (boroughs + neighbourhoods)
  const locationIds = filters.location
    ? getLocationWithDescendants(filters.location)
    : undefined;

  const { requests, loading, error } = useRequests(filters, locationIds);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vouch</h1>
            <Link
              href="/create"
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Create Request
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Requests (if any) */}
        <MyRequests />

        {/* Filters */}
        <RequestFilters
          categories={categories}
          areas={areas}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Request List */}
        <div className="mt-8">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading requests...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!loading && !error && requests.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg">No requests found</p>
              <p className="text-gray-500 mt-2">
                Be the first to create a request!
              </p>
              <Link
                href="/create"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Request
              </Link>
            </div>
          )}

          {!loading && !error && requests.length > 0 && (
            <div className="space-y-4">
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
