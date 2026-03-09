import ArchitectureGraph from '@/components/learning/ArchitectureGraph';

export default function ExplorePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">Architecture Explorer</h1>
        <p className="text-text-secondary text-sm mt-1">
          Interactive visualization of the Zeotap CDP platform architecture.
          Click any component for details.
        </p>
      </div>

      <ArchitectureGraph />
    </div>
  );
}
