/**
 * Request card component for displaying a request in the feed
 */

import Link from 'next/link';
import type { WebRequestFeed } from '@/types/database';
import { formatRelativeDate } from '@/lib/utils';

interface RequestCardProps {
  request: WebRequestFeed;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Link href={`/request/${request.share_token}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer min-h-[44px]">
        {/* Category and Location Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {request.business_type_name && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
              {request.business_type_name}
            </span>
          )}
          {request.subcategory_name && (
            <span className="inline-block bg-blue-50 text-blue-700 text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
              {request.subcategory_name}
            </span>
          )}
          {request.location_name && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full">
              📍 {request.location_name}
              {request.location_user_generated && (
                <span className="ml-1 text-xs opacity-60">(new)</span>
              )}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-snug">
          {request.title}
        </h3>

        {/* Context Preview */}
        {request.context && (
          <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{request.context}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span>Asked by {request.requester_name}</span>
            <span className="hidden sm:inline">•</span>
            <span>{formatRelativeDate(request.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-600">
              {request.response_count} recommendation{request.response_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
