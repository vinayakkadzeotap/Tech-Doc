export interface HeadToHead {
  feature: string;
  zeotap: string;
  competitor: string;
  winner: 'zeotap' | 'competitor' | 'tie';
}

export interface BattleCard {
  id: string;
  competitor: string;
  tagline: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
  talkingPoints: string[];
  headToHead: HeadToHead[];
}

export const BATTLE_CARDS: BattleCard[] = [
  {
    id: 'treasure-data',
    competitor: 'Treasure Data',
    tagline: 'Enterprise CDP focused on data unification',
    overview: 'Treasure Data is a Softbank-backed enterprise CDP that focuses on data warehousing and large-scale data unification. Strong in Japan/APAC markets, particularly in automotive and retail verticals.',
    strengths: [
      'Strong data warehousing backbone — handles massive data volumes',
      'Good ML/AI capabilities for predictive modeling',
      'Established presence in APAC especially Japan',
      'Flexible data ingestion from 200+ connectors',
    ],
    weaknesses: [
      'Complex implementation — avg 6-9 months to value',
      'UI/UX significantly behind modern CDPs',
      'Weaker in European market and GDPR compliance',
      'No native identity resolution — relies on partner integrations',
      'Pricing can be prohibitive for mid-market',
    ],
    differentiators: [
      'Zeotap has built-in, deterministic identity resolution (ID+/UCID) — Treasure Data requires third-party stitching',
      'Zeotap achieves time-to-value in weeks, not months',
      'Zeotap is EU-native with ISO 27701 and GDPR-by-design architecture',
      'Zeotap offers real-time segment activation vs. batch-heavy approach',
    ],
    talkingPoints: [
      'If the prospect values identity resolution quality, Zeotap\'s deterministic approach vs. probabilistic stitching is a clear differentiator.',
      'For European prospects: Zeotap was built for GDPR compliance from day one. Treasure Data retrofitted compliance.',
      'Zeotap\'s UI enables business users to build segments independently. Treasure Data typically requires data engineering support.',
    ],
    headToHead: [
      { feature: 'Identity Resolution', zeotap: 'Built-in deterministic (ID+)', competitor: 'Partner-dependent', winner: 'zeotap' },
      { feature: 'Time to Value', zeotap: '4-8 weeks', competitor: '6-9 months', winner: 'zeotap' },
      { feature: 'EU Data Residency', zeotap: 'Native EU infrastructure', competitor: 'US-first, EU add-on', winner: 'zeotap' },
      { feature: 'Data Scale', zeotap: 'Good (billions of events)', competitor: 'Excellent (petabyte-scale)', winner: 'competitor' },
      { feature: 'Self-serve UI', zeotap: 'Modern, business-user friendly', competitor: 'Technical, requires training', winner: 'zeotap' },
      { feature: 'ML Capabilities', zeotap: 'Good (propensity, lookalike)', competitor: 'Strong (custom models)', winner: 'tie' },
    ],
  },
  {
    id: 'tealium',
    competitor: 'Tealium',
    tagline: 'Tag management roots, CDP evolved',
    overview: 'Tealium evolved from a tag management platform into a CDP. Strong in real-time event streaming and has a loyal base from their TMS days. Positioned as a "data-first" CDP.',
    strengths: [
      'Real-time event stream processing — very fast data ingestion',
      'Strong tag management heritage — deep web/mobile SDK',
      'AudienceStream CDP is well-regarded for activation',
      'Good partner ecosystem with 1,300+ integrations',
    ],
    weaknesses: [
      'Identity resolution is event-based, not persistent — loses cross-device stitching quality',
      'Complex pricing with separate products (iQ + AudienceStream + DataAccess)',
      'Limited built-in analytics and BI capabilities',
      'EU compliance can be complex with their US-first architecture',
    ],
    differentiators: [
      'Zeotap\'s identity graph (ID+) provides persistent, cross-device identity — not just session-based matching',
      'Zeotap bundles activation, identity, and analytics in one platform — Tealium charges separately',
      'Zeotap offers stronger consent management and GDPR tooling natively',
    ],
    talkingPoints: [
      'Ask about their current tag management. If they use Tealium iQ already, they may feel locked in — but the CDP is a separate cost.',
      'Identity quality: Tealium stitches based on events. Zeotap maintains a persistent identity graph that survives cookie deletion.',
      'Total cost: Tealium\'s modular pricing (iQ + AS + DA) often exceeds Zeotap\'s all-in-one pricing.',
    ],
    headToHead: [
      { feature: 'Identity Resolution', zeotap: 'Persistent identity graph (ID+)', competitor: 'Event-based stitching', winner: 'zeotap' },
      { feature: 'Real-time Events', zeotap: 'Good', competitor: 'Excellent', winner: 'competitor' },
      { feature: 'Consent Management', zeotap: 'Built-in, GDPR-native', competitor: 'Add-on (Consent Manager)', winner: 'zeotap' },
      { feature: 'Pricing Transparency', zeotap: 'All-in-one platform', competitor: 'Modular (3+ products)', winner: 'zeotap' },
      { feature: 'Integration Count', zeotap: '100+', competitor: '1,300+', winner: 'competitor' },
      { feature: 'Self-serve Analytics', zeotap: 'Built-in dashboards', competitor: 'Limited (DataAccess add-on)', winner: 'zeotap' },
    ],
  },
  {
    id: 'segment',
    competitor: 'Segment (Twilio)',
    tagline: 'Developer-first CDP, now under Twilio',
    overview: 'Segment is the developer-favorite CDP, acquired by Twilio in 2020. Excellent API-first data collection but limited in identity resolution and audience management. Repositioning as part of Twilio\'s engagement platform.',
    strengths: [
      'Best-in-class developer experience — clean APIs and SDKs',
      'Huge integration catalog (400+ destinations)',
      'Strong event tracking and data routing',
      'Well-known brand in the developer community',
    ],
    weaknesses: [
      'Identity resolution is basic — cookie-based, no deterministic graph',
      'Audience building is limited compared to enterprise CDPs',
      'Twilio acquisition created confusion about product direction',
      'Pricing spikes at scale (per-MTU billing)',
      'No native activation — relies on downstream tools',
    ],
    differentiators: [
      'Zeotap is a full CDP (collect + unify + activate). Segment is primarily collect + route.',
      'Zeotap\'s ID+ provides deterministic identity matching that Segment cannot offer',
      'Zeotap\'s audience builder enables business users to create segments. Segment requires developer involvement.',
      'Zeotap includes journey orchestration. Segment relies on Twilio Engage (separate product).',
    ],
    talkingPoints: [
      'Segment is great for routing data — but it\'s not a complete CDP. Ask: "Can your marketing team build audiences without engineering?"',
      'Per-MTU pricing creates surprise bills at scale. Zeotap\'s pricing is more predictable.',
      'Post-Twilio, Segment\'s roadmap is unclear. Is it becoming a Twilio feature or staying independent?',
    ],
    headToHead: [
      { feature: 'Developer Experience', zeotap: 'Good APIs', competitor: 'Excellent (best-in-class)', winner: 'competitor' },
      { feature: 'Identity Resolution', zeotap: 'Deterministic (ID+)', competitor: 'Cookie-based only', winner: 'zeotap' },
      { feature: 'Audience Building', zeotap: 'Visual, business-user friendly', competitor: 'Basic, developer-required', winner: 'zeotap' },
      { feature: 'Journey Orchestration', zeotap: 'Built-in', competitor: 'Requires Twilio Engage', winner: 'zeotap' },
      { feature: 'Activation', zeotap: 'Native 100+ destinations', competitor: 'Routes to 400+ but no native activation', winner: 'zeotap' },
      { feature: 'Pricing at Scale', zeotap: 'Predictable', competitor: 'Per-MTU can spike', winner: 'zeotap' },
    ],
  },
  {
    id: 'mparticle',
    competitor: 'mParticle',
    tagline: 'Mobile-first customer data infrastructure',
    overview: 'mParticle positions as "customer data infrastructure" rather than a traditional CDP. Strong in mobile/app data collection and real-time event processing. Popular with mobile-first brands and streaming services.',
    strengths: [
      'Excellent mobile/app data collection — deep SDK support',
      'Real-time data quality and governance controls',
      'Strong in media and entertainment verticals',
      'Good data planning and schema enforcement tools',
    ],
    weaknesses: [
      'Limited audience building and segmentation UI',
      'No native identity resolution graph — partner-dependent',
      'Smaller integration ecosystem than competitors',
      'Less mature in European markets',
      'Focused on engineering teams — weak for business users',
    ],
    differentiators: [
      'Zeotap is a full-stack CDP for both technical and business users. mParticle is infrastructure-layer only.',
      'Zeotap\'s UI enables self-serve segment creation. mParticle requires API calls.',
      'Zeotap provides built-in identity resolution. mParticle relies on LiveRamp or custom solutions.',
    ],
    talkingPoints: [
      'mParticle is infrastructure, not a complete CDP. Ask: "Do you need a data pipe or an actionable customer platform?"',
      'For brands with both web and app presence, Zeotap\'s cross-device identity resolution provides a unified view.',
      'If the prospect\'s marketing team needs to build segments, they\'ll need another tool on top of mParticle.',
    ],
    headToHead: [
      { feature: 'Mobile/App Data', zeotap: 'Good', competitor: 'Excellent', winner: 'competitor' },
      { feature: 'Identity Resolution', zeotap: 'Built-in (ID+)', competitor: 'Partner-dependent', winner: 'zeotap' },
      { feature: 'Business User UI', zeotap: 'Visual segment builder', competitor: 'API/engineer-focused', winner: 'zeotap' },
      { feature: 'Activation', zeotap: 'Built-in journey + destinations', competitor: 'Data routing only', winner: 'zeotap' },
      { feature: 'Data Quality', zeotap: 'Good', competitor: 'Excellent (schema enforcement)', winner: 'competitor' },
      { feature: 'EU Compliance', zeotap: 'Native EU, ISO 27701', competitor: 'US-centric', winner: 'zeotap' },
    ],
  },
  {
    id: 'adobe-cdp',
    competitor: 'Adobe Real-Time CDP',
    tagline: 'Enterprise suite play within Adobe Experience Cloud',
    overview: 'Adobe RT-CDP is part of the Adobe Experience Platform (AEP). Deeply integrated with Adobe\'s marketing suite (Campaign, Journey Optimizer, Analytics). Targets large enterprises already in the Adobe ecosystem.',
    strengths: [
      'Seamless integration with Adobe Experience Cloud (AEM, Campaign, Analytics, Target)',
      'Enterprise-grade — designed for Fortune 500 complexity',
      'Strong ML with Adobe Sensei for predictions and recommendations',
      'Rich content personalization through AEM integration',
    ],
    weaknesses: [
      'Requires Adobe ecosystem commitment — not standalone-friendly',
      'Very expensive — typical deals start at $200K+/year',
      'Complex implementation — 9-18 months is common',
      'Steep learning curve — requires dedicated AEP expertise',
      'Over-engineered for most mid-market use cases',
    ],
    differentiators: [
      'Zeotap is vendor-neutral — no ecosystem lock-in. Adobe requires AEP + multiple Adobe products.',
      'Zeotap deploys in weeks. Adobe AEP implementations take 9-18 months.',
      'Zeotap costs a fraction of Adobe\'s pricing for equivalent capabilities.',
      'Zeotap\'s identity resolution works across all channels. Adobe\'s is strongest within its own ecosystem.',
    ],
    talkingPoints: [
      'If the prospect isn\'t already deep in Adobe ecosystem, RT-CDP makes no sense. It\'s an add-on, not a standalone.',
      'Ask about implementation timeline expectations. If they need value in Q1, Adobe won\'t deliver.',
      'TCO comparison: Adobe AEP + RT-CDP + Campaign + Analytics vs. Zeotap all-in-one. Often 3-5x cost difference.',
    ],
    headToHead: [
      { feature: 'Time to Value', zeotap: '4-8 weeks', competitor: '9-18 months', winner: 'zeotap' },
      { feature: 'Total Cost', zeotap: 'Competitive', competitor: '$200K+/year', winner: 'zeotap' },
      { feature: 'Vendor Independence', zeotap: 'Fully neutral', competitor: 'Adobe ecosystem required', winner: 'zeotap' },
      { feature: 'Enterprise Scale', zeotap: 'Good', competitor: 'Excellent (Fortune 500)', winner: 'competitor' },
      { feature: 'Content Personalization', zeotap: 'Partner integrations', competitor: 'Native (AEM)', winner: 'competitor' },
      { feature: 'ML/AI', zeotap: 'Good (propensity, lookalike)', competitor: 'Excellent (Adobe Sensei)', winner: 'competitor' },
    ],
  },
];

// Search battle cards by any text field
export function searchBattleCards(query: string): BattleCard[] {
  const q = query.toLowerCase();
  return BATTLE_CARDS.filter((card) =>
    card.competitor.toLowerCase().includes(q) ||
    card.overview.toLowerCase().includes(q) ||
    card.differentiators.some((d) => d.toLowerCase().includes(q)) ||
    card.headToHead.some((h) => h.feature.toLowerCase().includes(q))
  );
}
