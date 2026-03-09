'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-white font-sans antialiased flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-extrabold">Something went wrong</h1>
          <p className="text-sm text-gray-400">
            {error.digest
              ? `Error ID: ${error.digest}`
              : 'An unexpected error occurred.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-gray-700 hover:border-gray-500 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
