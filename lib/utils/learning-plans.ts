export interface LearningPlanTemplate {
  id: string;
  name: string;
  description: string;
  targetRoles: string[];
  tracks: string[];
  estimatedDays: number;
}

export const LEARNING_PLAN_TEMPLATES: LearningPlanTemplate[] = [
  {
    id: 'cs-onboarding',
    name: 'CS Onboarding',
    description: 'Complete onboarding path for Customer Success team members. Covers business fundamentals, CS playbook, and technical account management.',
    targetRoles: ['cs'],
    tracks: ['business-essentials', 'cs-playbook', 'tam-playbook'],
    estimatedDays: 21,
  },
  {
    id: 'sales-ramp',
    name: 'Sales Ramp',
    description: 'Accelerated ramp-up for new sales hires. Business knowledge, sales enablement techniques, and product deep-dive.',
    targetRoles: ['sales'],
    tracks: ['business-essentials', 'sales-enablement', 'product-mastery'],
    estimatedDays: 28,
  },
  {
    id: 'engineering-starter',
    name: 'Engineering Starter',
    description: 'Technical onboarding for engineers joining the platform team. Business context plus engineering deep-dive.',
    targetRoles: ['engineering'],
    tracks: ['business-essentials', 'engineering'],
    estimatedDays: 14,
  },
  {
    id: 'marketing-foundations',
    name: 'Marketing Foundations',
    description: 'Essential knowledge for marketing team members. Business basics and product mastery for campaign planning.',
    targetRoles: ['marketing'],
    tracks: ['business-essentials', 'product-mastery'],
    estimatedDays: 14,
  },
  {
    id: 'full-certification',
    name: 'Full Certification Path',
    description: 'Complete all tracks needed for expert-level certification. Recommended for team leads and senior ICs.',
    targetRoles: ['sales', 'cs', 'marketing', 'engineering'],
    tracks: ['business-essentials', 'product-mastery', 'sales-enablement', 'engineering'],
    estimatedDays: 42,
  },
];
