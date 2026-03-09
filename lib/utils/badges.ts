export interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const BADGES: Record<string, Badge> = {
  first_module: {
    id: 'first_module',
    icon: '🌱',
    title: 'First Steps',
    description: 'Completed your first learning module',
    color: '#10b981',
  },
  fast_learner: {
    id: 'fast_learner',
    icon: '⚡',
    title: 'Fast Learner',
    description: 'Completed 5 modules in one session',
    color: '#a78bfa',
  },
  quiz_ace: {
    id: 'quiz_ace',
    icon: '🎯',
    title: 'Quiz Ace',
    description: 'Scored 100% on any quiz',
    color: '#f59e0b',
  },
  business_grad: {
    id: 'business_grad',
    icon: '🏢',
    title: 'Business Graduate',
    description: 'Completed Business Essentials track',
    color: '#3b82f6',
  },
  product_expert: {
    id: 'product_expert',
    icon: '🎨',
    title: 'Product Expert',
    description: 'Completed Product Mastery track',
    color: '#a855f7',
  },
  sales_pro: {
    id: 'sales_pro',
    icon: '💼',
    title: 'Sales Pro',
    description: 'Completed Sales Enablement track',
    color: '#f59e0b',
  },
  cs_champion: {
    id: 'cs_champion',
    icon: '🤝',
    title: 'CS Champion',
    description: 'Completed Customer Success Playbook',
    color: '#10b981',
  },
  engineering_master: {
    id: 'engineering_master',
    icon: '⚙️',
    title: 'Engineering Master',
    description: 'Completed Engineering Deep Dive',
    color: '#6366f1',
  },
  all_rounder: {
    id: 'all_rounder',
    icon: '👑',
    title: 'All-Rounder',
    description: 'Completed every available track',
    color: '#f43f5e',
  },
  streak_7: {
    id: 'streak_7',
    icon: '🔥',
    title: '7-Day Streak',
    description: 'Learned something 7 days in a row',
    color: '#ef4444',
  },
};
