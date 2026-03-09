import {
  Home,
  BookOpen,
  Microscope,
  ClipboardCheck,
  Trophy,
  GraduationCap,
  Zap,
  BarChart3,
  CheckCircle2,
  FileText,
  Award,
  Building2,
  PieChart,
  Target,
  Monitor,
  Swords,
  DollarSign,
  Mic,
  HelpCircle,
  Clapperboard,
  Shield,
  FileBarChart,
  Handshake,
  Briefcase,
  Megaphone,
  Users,
  Compass,
  Settings,
  Radio,
  Link,
  User,
  Rocket,
  Bot,
  Brain,
  Lock,
  Server,
  Activity,
  RefreshCw,
  TestTubes,
  Map,
  Wrench,
  Plug,
  ArrowUpCircle,
  HeartPulse,
  CheckSquare,
  Layers,
  Flame,
  Crown,
  Sprout,
  Palette,
  Medal,
  Workflow,
  GitBranch,
  Send,
  Sparkles,
  LayoutDashboard,
  BookMarked,
  type LucideIcon,
} from 'lucide-react';

// Map emoji strings / identifiers to Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation
  '🏠': Home,
  '📚': BookOpen,
  '🔬': Microscope,
  '📝': ClipboardCheck,
  '🏆': Trophy,
  '🎓': GraduationCap,
  '⚡': Zap,
  '📖': BookMarked,
  '👤': User,

  // Stats
  '📊': BarChart3,
  '✅': CheckCircle2,

  // Tracks
  '🏢': Building2,
  '🎨': Palette,
  '💼': Briefcase,
  '🤝': Handshake,
  '⚙️': Settings,

  // Roles
  '📐': Compass,
  '📣': Megaphone,
  '🎯': Target,
  '👥': Users,

  // Modules — Business Essentials
  '🖥️': Monitor,
  '⚔️': Swords,
  '💰': DollarSign,

  // Modules — Sales
  '🎤': Mic,
  '❓': HelpCircle,
  '🎬': Clapperboard,
  '🛡️': Shield,
  '📋': FileBarChart,

  // Modules — CS
  '💚': HeartPulse,
  '🔧': Wrench,
  '📢': Megaphone,
  '📈': ArrowUpCircle,
  '🔌': Plug,

  // Modules — Engineering
  '🏗️': Layers,
  '📡': Radio,
  '🔗': Link,
  '🗺️': Map,
  '🚀': Rocket,
  '🤖': Bot,
  '🧠': Brain,
  '🔒': Lock,
  '🔄': RefreshCw,
  '🧪': TestTubes,

  // Badges
  '🌱': Sprout,
  '🔥': Flame,
  '👑': Crown,

  // Certifications
  '🏅': Medal,

  // Interactive
  'pipeline': Workflow,
  'architecture': GitBranch,
  'identity': Link,
  'segments': Target,
  'journeys': Map,
  'leaderboard': Trophy,
  'send': Send,
  'sparkles': Sparkles,
  'dashboard': LayoutDashboard,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  /** Render icon inside a colored container */
  contained?: boolean;
  /** Background color for contained mode (hex) */
  color?: string;
  /** Container size: sm (32px), md (40px), lg (48px) */
  containerSize?: 'sm' | 'md' | 'lg';
  /** Accessible label for screen readers */
  label?: string;
}

const containerSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 20,
};

export default function Icon({
  name,
  size,
  className = '',
  contained = false,
  color,
  containerSize = 'md',
  label,
}: IconProps) {
  const LucideComponent = ICON_MAP[name];

  if (!LucideComponent) {
    // Fallback: render the string as-is (e.g. for unmapped emojis)
    return <span className={className} role="img" aria-label={label || 'icon'}>{name}</span>;
  }

  const iconSize = size || (contained ? iconSizes[containerSize] : 18);
  const ariaProps = label ? { 'aria-label': label, role: 'img' as const } : { 'aria-hidden': true as const };

  if (contained) {
    const bgColor = color || '#3b82f6';
    return (
      <div
        className={`${containerSizes[containerSize]} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}
        style={{ background: `${bgColor}15` }}
        {...(label ? { 'aria-label': label, role: 'img' } : {})}
      >
        <LucideComponent
          size={iconSize}
          style={{ color: bgColor }}
          className={className}
          strokeWidth={2}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <LucideComponent
      size={iconSize}
      className={className}
      strokeWidth={2}
      style={color ? { color } : undefined}
      {...ariaProps}
    />
  );
}

// Export the map for direct access when needed
export { ICON_MAP };
export type { IconProps };
