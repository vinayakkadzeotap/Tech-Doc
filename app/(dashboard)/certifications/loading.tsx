export default function CertificationsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-bg-surface rounded-lg" />
        <div className="h-4 w-72 bg-bg-surface rounded mt-2" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-bg-surface/50 rounded-2xl border border-border" />
        ))}
      </div>
    </div>
  );
}
