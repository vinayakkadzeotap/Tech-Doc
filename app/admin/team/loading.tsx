export default function AdminTeamLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-bg-surface rounded-lg" />
        <div className="h-4 w-64 bg-bg-surface rounded mt-2" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-bg-surface/50 rounded-2xl border border-border" />
        ))}
      </div>
      <div className="h-64 bg-bg-surface/50 rounded-2xl border border-border" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-bg-surface/50 rounded-2xl border border-border" />
        ))}
      </div>
    </div>
  );
}
