export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-bg-surface rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-bg-surface rounded-lg" />
          <div className="h-4 w-56 bg-bg-surface rounded" />
        </div>
      </div>
      <div className="h-64 bg-bg-surface/50 rounded-2xl border border-border" />
      <div className="h-48 bg-bg-surface/50 rounded-2xl border border-border" />
    </div>
  );
}
