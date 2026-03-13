'use client';

import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Admin Page Error
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {error.message || 'Something went wrong loading this admin page.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-surface border border-border text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
