interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'default' | 'outline';
  className?: string;
}

export default function Badge({
  children,
  color = '#3b82f6',
  variant = 'default',
  className = '',
}: BadgeProps) {
  const style =
    variant === 'outline'
      ? { borderColor: `${color}40`, color }
      : { backgroundColor: `${color}15`, color, borderColor: `${color}30` };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold
        rounded-full border transition-colors
        ${className}
      `}
      style={style}
    >
      {children}
    </span>
  );
}
