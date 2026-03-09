'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="text-5xl">⚠️</div>
      <h1 className="text-2xl font-extrabold">Something went wrong</h1>
      <p className="text-sm text-text-secondary max-w-md mx-auto">
        There was an error loading this page. This may be a temporary issue — try refreshing.
        {error.digest && (
          <span className="block mt-2 text-xs text-text-muted">Error ID: {error.digest}</span>
        )}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-white transition-colors"
        >
          Try Again
        </button>
        <a
          href="/home"
          className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-border hover:border-border-strong transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
