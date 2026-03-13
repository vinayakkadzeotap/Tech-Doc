export default function AdminAssignmentsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-56 bg-bg-surface rounded-lg" />
        <div className="h-4 w-72 bg-bg-surface rounded mt-2" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="h-80 bg-bg-surface/50 rounded-2xl border border-border" />
        <div className="h-80 bg-bg-surface/50 rounded-2xl border border-border" />
      </div>
      <div className="h-64 bg-bg-surface/50 rounded-2xl border border-border" />
    </div>
  );
}
