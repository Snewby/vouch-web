/**
 * Request detail page - Server-side rendered for SEO and social sharing
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchRequestByToken } from '@/lib/server/requests';
import { RequestDetailClient } from '@/components/RequestDetailClient';

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ new?: string }>;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const { request } = await fetchRequestByToken(token);

  if (!request) {
    return {
      title: 'Request Not Found',
      description: 'This request does not exist or has been removed.',
    };
  }

  const title = request.title;
  const description =
    request.context ||
    `Looking for ${request.business_type_name || 'recommendations'} ${
      request.location_name ? `in ${request.location_name}` : ''
    }`.trim();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://vouch.app/request/${token}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'Vouch',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
  };
}

// Server-side rendered page
export default async function RequestDetailPage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { request, responses } = await fetchRequestByToken(token);

  // Show 404 if request not found
  if (!request) {
    notFound();
  }

  // Check if this is a newly created request
  const sp = searchParams ? await searchParams : undefined;
  const isNewRequest = sp?.new === '1';

  return <RequestDetailClient request={request} responses={responses} isNewRequest={isNewRequest} />;
}
