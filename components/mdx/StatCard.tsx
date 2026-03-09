interface StatCardProps {
  stats?: { value: string; label: string; color?: string }[];
}

export default function StatCard({ stats }: StatCardProps) {
  if (!stats || !Array.isArray(stats)) return null;

  return (
    <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-bg-surface/50 border border-border rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-extrabold" style={{ color: stat.color || '#3b82f6' }}>
            {stat.value}
          </div>
          <div className="text-[11px] text-text-muted mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
