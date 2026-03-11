import fs from 'fs';
import path from 'path';

export interface SkillDefinition {
  name: string;
  description: string;
  triggerKeywords: string[];
  filePath: string;
  industry?: string;
}

export const SKILLS_DIR = path.join(process.cwd(), 'content', 'cdp-skills');

export const skillRegistry: SkillDefinition[] = [
  {
    name: 'cdp-marketing-suite',
    description: 'Universal entry point and intelligent router for all CDP marketing capabilities.',
    triggerKeywords: ['help', 'get started', 'what can i do', 'cdp capabilities', 'marketing tools', 'campaign', 'guide'],
    filePath: 'cdp-marketing-suite/SKILL.md',
  },
  {
    name: 'cdp-audience-finder',
    description: 'Translates business goals into CDP audience segments using behavioral and demographic data.',
    triggerKeywords: ['audience', 'segment', 'find customers', 'target', 'high-value', 'frequent buyers', 'dormant', 'campaign audience', 'customer groups'],
    filePath: 'cdp-audience-finder/SKILL.md',
  },
  {
    name: 'cdp-churn-finder',
    description: 'Identifies customers showing churn signals using behavioral change patterns and historical deltas.',
    triggerKeywords: ['churn', 'attrition', 'leaving', 'at-risk', 'retention', 'win back', 'cancel', 'declining', 'lose customers'],
    filePath: 'cdp-churn-finder/SKILL.md',
  },
  {
    name: 'cdp-data-analyzer',
    description: 'High-level data analysis driven by business goals. Translates "why is X happening?" into systematic investigation.',
    triggerKeywords: ['analyze', 'why', 'trend', 'root cause', 'insights', 'performance', 'investigation', 'pattern', 'correlation', 'metric'],
    filePath: 'cdp-data-analyzer/SKILL.md',
  },
  {
    name: 'cdp-data-enricher',
    description: 'Enhances customer profiles with behavioral signals, real-time intent, and derived attributes.',
    triggerKeywords: ['enrich', 'signals', 'behavioral data', 'intent', 'profile completeness', 'missing attributes', 'data gaps', 'coverage'],
    filePath: 'cdp-data-enricher/SKILL.md',
  },
  {
    name: 'cdp-data-manager',
    description: 'Monitor data pipelines, check quality metrics, troubleshoot sync failures.',
    triggerKeywords: ['pipeline', 'sync', 'data quality', 'freshness', 'data flowing', 'upload', 'ingestion', 'monitor', 'operations'],
    filePath: 'cdp-data-manager/SKILL.md',
  },
  {
    name: 'cdp-data-scientist',
    description: 'Designs predictive models and feature engineering workflows via BigQuery ML.',
    triggerKeywords: ['predict', 'propensity', 'machine learning', 'ml model', 'scoring', 'classification', 'regression', 'clustering', 'bqml', 'predictive'],
    filePath: 'cdp-data-scientist/SKILL.md',
  },
  {
    name: 'cdp-health-diagnostics',
    description: 'Quick system status checks and deep error investigation for CDP pipelines.',
    triggerKeywords: ['broken', 'status', 'health check', 'failed', 'errors', 'down', 'not working', 'issues', 'diagnostics'],
    filePath: 'cdp-health-diagnostics/SKILL.md',
  },
  {
    name: 'cdp-journey-recommender',
    description: 'Recommends customer journeys and next-best-actions based on event sequences.',
    triggerKeywords: ['journey', 'next best action', 'cart abandonment', 'lifecycle', 'flow', 're-engagement', 'trigger', 'touchpoint', 'automation'],
    filePath: 'cdp-journey-recommender/SKILL.md',
  },
  {
    name: 'cdp-lookalike-finder',
    description: 'Finds new prospects that resemble your best customers using statistical similarity.',
    triggerKeywords: ['lookalike', 'similar customers', 'expand audience', 'prospects', 'audience expansion', 'find similar', 'seed audience'],
    filePath: 'cdp-lookalike-finder/SKILL.md',
  },
  {
    name: 'cdp-metadata-explorer',
    description: 'Crawls raw schemas to generate semantic context. Explore available attributes and data completeness.',
    triggerKeywords: ['schema', 'metadata', 'data dictionary', 'fields', 'attributes', 'what data', 'explore data', 'pii', 'completeness'],
    filePath: 'cdp-metadata-explorer/SKILL.md',
  },
  // Industry verticals
  {
    name: 'retail-marketing-suite',
    description: 'Retail, e-commerce, DTC, and CPG marketing orchestrator.',
    triggerKeywords: ['retail', 'ecommerce', 'e-commerce', 'shopping', 'dtc', 'cpg', 'aov', 'basket', 'store', 'product catalog'],
    filePath: 'retail-marketing-suite/SKILL.md',
    industry: 'retail',
  },
  {
    name: 'gaming-marketing-suite',
    description: 'Gaming, mobile games, console, and esports marketing orchestrator.',
    triggerKeywords: ['gaming', 'game', 'player', 'dau', 'mau', 'iap', 'whale', 'session', 'esports', 'retention d7'],
    filePath: 'gaming-marketing-suite/SKILL.md',
    industry: 'gaming',
  },
  {
    name: 'telecom-marketing-suite',
    description: 'Telecom, mobile carrier, ISP, and broadband marketing orchestrator.',
    triggerKeywords: ['telecom', 'carrier', 'isp', 'broadband', 'subscriber', 'arpu', 'plan upgrade', 'roaming', 'data usage'],
    filePath: 'telecom-marketing-suite/SKILL.md',
    industry: 'telecom',
  },
  {
    name: 'healthcare-marketing-suite',
    description: 'Healthcare, pharma, wellness, and health insurance marketing orchestrator.',
    triggerKeywords: ['healthcare', 'health', 'patient', 'pharma', 'hipaa', 'wellness', 'medication', 'provider', 'telehealth'],
    filePath: 'healthcare-marketing-suite/SKILL.md',
    industry: 'healthcare',
  },
  {
    name: 'media-marketing-suite',
    description: 'Media, streaming, OTT, publishing, and news marketing orchestrator.',
    triggerKeywords: ['media', 'streaming', 'ott', 'publishing', 'content', 'viewership', 'subscriber', 'watch time', 'podcast'],
    filePath: 'media-marketing-suite/SKILL.md',
    industry: 'media',
  },
  {
    name: 'automotive-marketing-suite',
    description: 'Automotive, car dealership, OEM, EV, and fleet marketing orchestrator.',
    triggerKeywords: ['automotive', 'car', 'vehicle', 'dealership', 'oem', 'ev', 'test drive', 'fleet', 'trade-in'],
    filePath: 'automotive-marketing-suite/SKILL.md',
    industry: 'automotive',
  },
  {
    name: 'bfsi-marketing-suite',
    description: 'Banking, financial services, insurance, and fintech marketing orchestrator.',
    triggerKeywords: ['banking', 'finance', 'insurance', 'fintech', 'bfsi', 'wealth', 'lending', 'credit', 'aum', 'cross-sell'],
    filePath: 'bfsi-marketing-suite/SKILL.md',
    industry: 'bfsi',
  },
  {
    name: 'travel-marketing-suite',
    description: 'Travel, hospitality, airlines, hotels, and OTA marketing orchestrator.',
    triggerKeywords: ['travel', 'hotel', 'airline', 'booking', 'hospitality', 'ota', 'cruise', 'destination', 'frequent flyer'],
    filePath: 'travel-marketing-suite/SKILL.md',
    industry: 'travel',
  },
];

/**
 * Score each skill against the user's message and return top matches.
 */
export function matchSkills(userMessage: string, maxResults = 2): SkillDefinition[] {
  const tokens = userMessage.toLowerCase().split(/\s+/);
  const message = userMessage.toLowerCase();

  const scored = skillRegistry.map((skill) => {
    let score = 0;

    // Keyword matching — exact keyword in message gets high score
    for (const keyword of skill.triggerKeywords) {
      if (message.includes(keyword)) {
        // Multi-word keywords are more specific, score higher
        score += keyword.includes(' ') ? 3 : 2;
      }
    }

    // Token overlap with description
    const descTokens = skill.description.toLowerCase().split(/\s+/);
    for (const token of tokens) {
      if (token.length > 3 && descTokens.includes(token)) {
        score += 1;
      }
    }

    // Industry boost — if message mentions an industry, boost that suite
    if (skill.industry && message.includes(skill.industry)) {
      score += 5;
    }

    return { skill, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // If no strong match, default to the marketing suite (the router)
  if (scored[0].score === 0) {
    return [skillRegistry[0]]; // cdp-marketing-suite
  }

  return scored
    .filter((s) => s.score > 0)
    .slice(0, maxResults)
    .map((s) => s.skill);
}

/**
 * Load the full SKILL.md content for a given skill.
 * Truncates to ~4000 chars to stay within context budget.
 */
export function loadSkillContent(skillName: string): string {
  const skill = skillRegistry.find((s) => s.name === skillName);
  if (!skill) return '';

  const fullPath = path.join(SKILLS_DIR, skill.filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    // Truncate to keep context manageable — keep the workflow/methodology sections
    if (content.length > 6000) {
      return content.slice(0, 6000) + '\n\n[... skill content truncated for context ...]';
    }
    return content;
  } catch {
    return '';
  }
}

/**
 * Load a reference guide for a specific industry within a skill.
 */
export function loadReferenceGuide(skillName: string, industry: string): string {
  const guidePath = path.join(SKILLS_DIR, skillName, 'references', `${industry}-guide.md`);
  try {
    const content = fs.readFileSync(guidePath, 'utf-8');
    if (content.length > 3000) {
      return content.slice(0, 3000) + '\n\n[... reference truncated ...]';
    }
    return content;
  } catch {
    return '';
  }
}
