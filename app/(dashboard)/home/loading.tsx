export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Welcome header */}
      <div>
        <div className="h-8 w-64 bg-bg-surface rounded-lg" />
        <div className="h-4 w-48 bg-bg-surface rounded mt-2" />
      </div>

      {/* Continue CTA skeleton */}
      <div className="h-20 bg-bg-surface/50 rounded-2xl border border-border" />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-bg-surface/50 rounded-2xl border border-border" />
        ))}
      </div>

      {/* Analytics */}
      <div className="h-64 bg-bg-surface/50 rounded-2xl border border-border" />

      {/* Track cards */}
      <div>
        <div className="h-6 w-40 bg-bg-surface rounded mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-bg-surface/50 rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
