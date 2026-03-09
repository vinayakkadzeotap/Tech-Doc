import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export default function Card({
  hover = false,
  glow = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-bg-surface/50 border border-border rounded-2xl p-6
        backdrop-blur-sm
        ${hover ? 'transition-all duration-300 hover:border-border-strong hover:-translate-y-1 hover:shadow-card cursor-pointer group' : ''}
        ${glow ? 'shadow-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
