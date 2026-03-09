interface ArchDiagramProps {
  title: string;
  steps: { label: string; detail: string; icon?: string }[];
  direction?: 'horizontal' | 'vertical';
}

export default function ArchDiagram({ title, steps, direction = 'horizontal' }: ArchDiagramProps) {
  return (
    <div className="my-6 bg-bg-surface/50 border border-border rounded-2xl p-5 overflow-x-auto">
      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">{title}</h4>
      <div
        className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'} items-stretch gap-0`}
      >
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center text-center min-w-[100px] max-w-[140px] p-3">
              <span className="text-2xl mb-2">{step.icon || '📦'}</span>
              <span className="text-xs font-bold text-text-primary">{step.label}</span>
              <span className="text-[10px] text-text-muted mt-1 leading-tight">{step.detail}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-text-muted text-lg px-1 flex-shrink-0">
                {direction === 'vertical' ? '↓' : '→'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
