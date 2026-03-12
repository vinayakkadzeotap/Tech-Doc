import { TRACKS } from '@/lib/utils/roles';

export interface SalesReadinessScore {
  overall: number; // 0-100
  breakdown: {
    trackCompletion: number; // 0-100
    battleCardFamiliarity: number; // 0-100
    quizPerformance: number; // 0-100
    dealPrepEngagement: number; // 0-100
  };
}

interface ProgressEntry {
  track_id: string;
  module_id: string;
  status: string;
}

interface QuizAttempt {
  quiz_id: string;
  percentage: number;
  passed: boolean;
}

// Sales-relevant track IDs
const SALES_TRACK_IDS = ['business-essentials', 'sales-enablement', 'product-mastery'];
const BATTLE_CARD_COUNT = 5; // Total battle cards available
const DEAL_PREP_INDUSTRY_COUNT = 5; // Total industries

// Weights for overall score
const WEIGHTS = {
  trackCompletion: 0.4,
  battleCardFamiliarity: 0.25,
  quizPerformance: 0.2,
  dealPrepEngagement: 0.15,
};

export function computeSalesReadiness(
  progress: ProgressEntry[],
  quizAttempts: QuizAttempt[],
  battleCardViews: number,
  dealPrepViews: number
): SalesReadinessScore {
  // 1. Track completion (40%) - completion of sales-relevant tracks
  const salesTracks = TRACKS.filter((t) => SALES_TRACK_IDS.includes(t.id));
  const totalSalesModules = salesTracks.reduce((sum, t) => sum + t.modules.length, 0);
  const completedSalesModules = progress.filter(
    (p) => SALES_TRACK_IDS.includes(p.track_id) && p.status === 'completed'
  ).length;
  const trackCompletion = totalSalesModules > 0
    ? Math.round((completedSalesModules / totalSalesModules) * 100)
    : 0;

  // 2. Battle card familiarity (25%) - based on views of battle cards
  const battleCardFamiliarity = Math.min(
    Math.round((battleCardViews / BATTLE_CARD_COUNT) * 100),
    100
  );

  // 3. Quiz performance (20%) - average quiz score on sales-relevant quizzes
  const salesQuizzes = quizAttempts.filter((q) =>
    SALES_TRACK_IDS.some((tid) => q.quiz_id.includes(tid))
  );
  const quizPerformance = salesQuizzes.length > 0
    ? Math.round(salesQuizzes.reduce((sum, q) => sum + q.percentage, 0) / salesQuizzes.length)
    : (quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, q) => sum + q.percentage, 0) / quizAttempts.length * 0.7)
      : 0);

  // 4. Deal prep engagement (15%) - viewed deal prep pages
  const dealPrepEngagement = Math.min(
    Math.round((dealPrepViews / DEAL_PREP_INDUSTRY_COUNT) * 100),
    100
  );

  // Overall weighted score
  const overall = Math.round(
    trackCompletion * WEIGHTS.trackCompletion +
    battleCardFamiliarity * WEIGHTS.battleCardFamiliarity +
    quizPerformance * WEIGHTS.quizPerformance +
    dealPrepEngagement * WEIGHTS.dealPrepEngagement
  );

  return {
    overall: Math.min(overall, 100),
    breakdown: {
      trackCompletion,
      battleCardFamiliarity,
      quizPerformance,
      dealPrepEngagement,
    },
  };
}
