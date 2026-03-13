export default function AdminUsersLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-bg-surface rounded-lg" />
        <div className="h-4 w-64 bg-bg-surface rounded mt-2" />
      </div>
      <div className="rounded-2xl border border-border bg-bg-surface/50 overflow-hidden">
        <div className="h-12 bg-bg-elevated/50 border-b border-border" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 border-b border-border-subtle" />
        ))}
      </div>
    </div>
  );
}
