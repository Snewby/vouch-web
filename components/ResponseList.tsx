/**
 * List of responses for a request
 */

import type { WebRequestResponse } from '@/types/database';
import { formatRelativeDate, getInstagramUrl, formatUrl } from '@/lib/utils';

interface ResponseListProps {
  responses: WebRequestResponse[];
}

export function ResponseList({ responses }: ResponseListProps) {
  if (responses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recommendations yet. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {responses.map((response) => (
        <div key={response.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {response.business_name}
              </h3>
              {response.location && (
                <p className="text-sm text-gray-600">📍 {response.location}</p>
              )}
            </div>
            {response.is_business_linked && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>

          {/* Notes */}
          {response.notes && (
            <p className="text-gray-700 mb-3">{response.notes}</p>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap gap-3 mb-2">
            {response.website && (
              <a
                href={formatUrl(response.website) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                🌐 Website
              </a>
            )}
            {response.instagram && (
              <a
                href={getInstagramUrl(response.instagram) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                📷 Instagram
              </a>
            )}
            {response.email && (
              <a
                href={`mailto:${response.email}`}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                ✉️ Email
              </a>
            )}
          </div>

          {/* Metadata */}
          <div className="text-sm text-gray-500">
            {response.responder_name || response.voucher_name ? (
              <span>
                Recommended by {response.responder_name || response.voucher_name}
              </span>
            ) : (
              <span>Recommended by someone</span>
            )}
            <span className="mx-2">•</span>
            <span>{formatRelativeDate(response.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
