/**
 * Request card component for displaying a request in the feed
 */

import Link from 'next/link';
import type { WebRequestFeed } from '@/types/database';
import { formatRelativeDate } from '@/lib/utils';
import { Badge } from './ui/badge';

interface RequestCardProps {
  request: WebRequestFeed;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Link href={`/request/${request.share_token}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer min-h-[44px]">
        {/* Category and Location Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="default">
            {request.subcategory_name || request.business_type_name || 'Recommendation'}
          </Badge>
          {request.location_name && (
            <Badge variant="outline">
              📍 {request.location_name}
              {request.location_user_generated && (
                <span className="ml-1 text-xs opacity-60">(new)</span>
              )}
            </Badge>
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
