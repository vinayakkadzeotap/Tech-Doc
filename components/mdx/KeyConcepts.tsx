interface KeyConceptsProps {
  concepts?: string[];
}

export default function KeyConcepts({ concepts }: KeyConceptsProps) {
  if (!concepts || !Array.isArray(concepts)) return null;

  return (
    <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl p-5">
      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
        Key Concepts
      </h4>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <span
            key={concept}
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  );
}
