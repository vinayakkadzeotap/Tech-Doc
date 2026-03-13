export default function AdminFeedbackLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-bg-surface rounded-lg" />
          <div className="h-4 w-56 bg-bg-surface rounded mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-bg-surface/50 rounded-full" />
          <div className="h-8 w-24 bg-bg-surface/50 rounded-full" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-bg-surface/50 rounded-2xl border border-border" />
        ))}
      </div>
    </div>
  );
}
