/**
 * Request detail page - View request and submit responses
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRequestByToken } from '@/lib/hooks/useRequestByToken';
import { ResponseForm } from '@/components/ResponseForm';
import { ResponseList } from '@/components/ResponseList';
import { formatRelativeDate, getRequestShareUrl, copyToClipboard } from '@/lib/utils';

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  // In Next.js 15+, params is a Promise
  const [token, setToken] = React.useState<string>('');

  React.useEffect(() => {
    params.then((p) => setToken(p.token));
  }, [params]);

  const { request, responses, loading, error, refetch } = useRequestByToken(token);

  const handleCopyLink = async () => {
    const url = getRequestShareUrl(token);
    const success = await copyToClipboard(url);
    if (success) {
      alert('Link copied to clipboard!');
    }
  };

  // Show loading if we don't have the token yet
  if (!token || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading request...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Request Not Found
            </h2>
            <p className="text-red-700 mb-4">
              {error || 'This request does not exist or has been removed.'}
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Requests
            </Link>
            <button
              onClick={handleCopyLink}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Request Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {request.business_type_name || 'Recommendation'}
            </span>
            {request.location_name && (
              <span className="inline-block ml-2 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                📍 {request.location_name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {request.title}
          </h1>

          {request.context && (
            <p className="text-gray-700 text-lg mb-4">{request.context}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Asked by {request.requester_name}</span>
            <span>•</span>
            <span>{formatRelativeDate(request.created_at)}</span>
            <span>•</span>
            <span className="font-medium text-blue-600">
              {request.response_count} recommendation{request.response_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Response Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Make a Recommendation
          </h2>
          <ResponseForm requestId={request.id} onSuccess={refetch} />
        </div>

        {/* Existing Responses */}
        {responses.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recommendations ({responses.length})
            </h2>
            <ResponseList responses={responses} />
          </div>
        )}
      </main>
    </div>
  );
}
