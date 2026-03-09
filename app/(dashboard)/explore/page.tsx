export default function ExplorePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">Architecture Explorer</h1>
        <p className="text-text-secondary text-sm mt-1">
          Interactive visualization of the Zeotap CDP platform architecture
        </p>
      </div>

      <div className="bg-bg-surface/50 border border-border rounded-3xl p-12 text-center space-y-4">
        <div className="text-6xl">🗺️</div>
        <h2 className="text-xl font-bold">Interactive Graph Coming Soon</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          The Canvas 2D architecture graph from the legacy platform is being ported to a React component
          with touch support and mobile optimization.
        </p>
        <p className="text-xs text-text-muted">
          17 platform nodes &middot; 6 architectural layers &middot; Physics simulation
        </p>
      </div>
    </div>
  );
}
