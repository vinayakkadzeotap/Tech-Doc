export interface CertDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: 'associate' | 'professional' | 'expert';
  requirements: {
    tracks: string[];
    quizzes: string[];
    minQuizScore: number;
  };
}

export const CERTIFICATIONS: CertDefinition[] = [
  {
    id: 'zeotap-associate',
    title: 'Zeotap Certified Associate',
    description: 'Foundational knowledge of Zeotap and CDPs',
    icon: '🎓',
    color: '#3b82f6',
    level: 'associate',
    requirements: {
      tracks: ['business-essentials'],
      quizzes: ['business-essentials-quiz'],
      minQuizScore: 70,
    },
  },
  {
    id: 'zeotap-professional',
    title: 'Zeotap Certified Professional',
    description: 'Deep product and technical knowledge',
    icon: '🏅',
    color: '#a855f7',
    level: 'professional',
    requirements: {
      tracks: ['business-essentials', 'product-mastery'],
      quizzes: ['business-essentials-quiz', 'product-mastery-quiz'],
      minQuizScore: 70,
    },
  },
  {
    id: 'zeotap-expert',
    title: 'Zeotap Certified Expert',
    description: 'Mastery of the full Zeotap platform',
    icon: '👑',
    color: '#f59e0b',
    level: 'expert',
    requirements: {
      tracks: ['business-essentials', 'product-mastery', 'engineering'],
      quizzes: ['business-essentials-quiz', 'engineering-week1-quiz', 'engineering-week2-quiz', 'product-mastery-quiz'],
      minQuizScore: 80,
    },
  },
];
