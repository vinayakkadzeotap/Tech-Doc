interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'tip' | 'important';
  title?: string;
  children: React.ReactNode;
}

const styles: Record<string, { bg: string; border: string; icon: string; titleColor: string }> = {
  info: { bg: 'bg-brand-blue/[0.07]', border: 'border-brand-blue/20', icon: 'ℹ️', titleColor: 'text-blue-300' },
  warning: { bg: 'bg-amber-500/[0.07]', border: 'border-amber-500/20', icon: '⚠️', titleColor: 'text-amber-300' },
  success: { bg: 'bg-brand-green/[0.07]', border: 'border-brand-green/20', icon: '✅', titleColor: 'text-green-300' },
  tip: { bg: 'bg-brand-purple/[0.07]', border: 'border-brand-purple/20', icon: '💡', titleColor: 'text-purple-300' },
  important: { bg: 'bg-brand-rose/[0.07]', border: 'border-brand-rose/20', icon: '🔥', titleColor: 'text-rose-300' },
};

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const s = styles[type] || styles.info;
  return (
    <div className={`${s.bg} ${s.border} border rounded-2xl px-5 py-4 my-6`}>
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{s.icon}</span>
        <div className="flex-1 min-w-0">
          {title && <p className={`font-bold text-sm mb-1 ${s.titleColor}`}>{title}</p>}
          <div className="text-sm text-text-secondary leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
