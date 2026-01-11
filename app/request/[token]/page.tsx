/**
 * Request detail page - View request and submit responses
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRequestByToken } from '@/lib/hooks/useRequestByToken';
import { ResponseForm } from '@/components/ResponseForm';
import { ResponseList } from '@/components/ResponseList';
import { ShareRequestButtons } from '@/components/ShareRequestButtons';
import { formatRelativeDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

export default function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ new?: string }>;
}) {
  // In Next.js 15+, params is a Promise
  const [token, setToken] = React.useState<string>('');
  const [isNewRequest, setIsNewRequest] = React.useState(false);

  React.useEffect(() => {
    params.then((p) => setToken(p.token));
    searchParams?.then((sp) => {
      if (sp.new === '1') {
        setIsNewRequest(true);
        // Clear the URL parameter after showing the message
        window.history.replaceState({}, '', `/request/${token}`);
      }
    });
  }, [params, searchParams, token]);

  const { request, responses, loading, error, refetch } = useRequestByToken(token);

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
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors inline-block"
          >
            ← Back to Requests
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message for New Requests */}
        {isNewRequest && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Request created successfully! Share the link below to get recommendations.
            </AlertDescription>
          </Alert>
        )}

        {/* Request Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="default">
              {request.business_type_name || 'Recommendation'}
            </Badge>
            {request.location_name && (
              <Badge variant="outline">
                📍 {request.location_name}
              </Badge>
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

        {/* Share Request Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Share This Request
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Share this link to get recommendations from your network
          </p>
          <ShareRequestButtons
            requestToken={token}
            requestTitle={request.title}
            businessType={request.business_type_name || undefined}
            location={request.location_name || undefined}
          />
        </div>

        <Separator className="mb-8" />

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
