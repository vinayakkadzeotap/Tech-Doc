interface TechItem {
  name: string;
  role: string;
  color?: string;
}

interface TechStackProps {
  title?: string;
  items?: TechItem[];
}

export default function TechStack({ title = 'Tech Stack', items }: TechStackProps) {
  if (!items || !Array.isArray(items)) return null;

  return (
    <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl p-5">
      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border"
          >
            <span className="text-xs font-bold font-mono" style={{ color: item.color || '#93c5fd' }}>
              {item.name}
            </span>
            <span className="text-[10px] text-text-muted">{item.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
