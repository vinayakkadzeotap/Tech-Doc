export default function ExploreLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-bg-surface rounded-lg" />
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-28 bg-bg-surface/50 rounded-lg shrink-0" />
        ))}
      </div>
      <div className="h-[500px] bg-bg-surface/50 rounded-2xl border border-border" />
    </div>
  );
}
