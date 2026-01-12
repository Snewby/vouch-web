/**
 * Client component for request detail page
 * Handles interactive parts (forms, buttons) while content is server-rendered
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ResponseForm } from '@/components/ResponseForm';
import { ResponseList } from '@/components/ResponseList';
import { ShareRequestButtons } from '@/components/ShareRequestButtons';
import { formatRelativeDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import type { WebRequestFeed, WebRequestResponse } from '@/types/database';

interface RequestDetailClientProps {
  request: WebRequestFeed;
  responses: WebRequestResponse[];
  isNewRequest?: boolean;
}

export function RequestDetailClient({
  request,
  responses: initialResponses,
  isNewRequest = false,
}: RequestDetailClientProps) {
  const [responses, setResponses] = useState(initialResponses);
  const [showNewRequestAlert, setShowNewRequestAlert] = useState(isNewRequest);

  const handleResponseSuccess = () => {
    // Refresh the page to get updated responses
    window.location.reload();
  };

  React.useEffect(() => {
    if (isNewRequest) {
      // Clear the URL parameter after showing the message
      window.history.replaceState({}, '', `/request/${request.share_token}`);
      // Hide alert after 10 seconds
      setTimeout(() => setShowNewRequestAlert(false), 10000);
    }
  }, [isNewRequest, request.share_token]);

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
        {showNewRequestAlert && (
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
              {request.subcategory_name || request.business_type_name || 'Recommendation'}
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

        {/* Existing Responses */}
        {responses.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recommendations ({responses.length})
            </h2>
            <ResponseList responses={responses} />
          </div>
        )}

        {/* Share Request Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Share This Request
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Share this link to get recommendations from your network
          </p>
          <ShareRequestButtons
            requestToken={request.share_token}
            requestTitle={request.title}
            subcategory={request.subcategory_name || request.business_type_name || undefined}
            location={request.location_name || undefined}
          />
        </div>

        <Separator className="mb-8" />

        {/* Response Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Make a Recommendation
          </h2>
          <ResponseForm requestId={request.id} onSuccess={handleResponseSuccess} />
        </div>
      </main>
    </div>
  );
}
