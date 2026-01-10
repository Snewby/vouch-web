/**
 * Create request page
 */

'use client';

import Link from 'next/link';
import { CreateRequestForm } from '@/components/CreateRequestForm';

export default function CreateRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Request
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Ask for a Recommendation
            </h2>
            <p className="text-gray-600 mt-1">
              Get trusted recommendations from real people
            </p>
          </div>

          <CreateRequestForm />
        </div>
      </main>
    </div>
  );
}
