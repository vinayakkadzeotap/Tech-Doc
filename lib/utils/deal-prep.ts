export interface DealPrepIndustry {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  recommendedModules: string[];
  battleCardIds: string[];
  talkingPoints: string[];
  demoFlow: string[];
}

export const DEAL_PREP_INDUSTRIES: DealPrepIndustry[] = [
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: '🛒',
    color: '#3b82f6',
    description: 'Retail brands need unified customer views across online, in-store, and app channels to drive personalization and loyalty.',
    recommendedModules: [
      'what-is-cdp',
      'how-zeotap-works',
      'audience-builder',
      'data-collection',
      'zeotap-pitch',
      'discovery-questions',
    ],
    battleCardIds: ['segment', 'tealium', 'adobe-cdp'],
    talkingPoints: [
      'Retail sees 20-30% of revenue from repeat customers — Zeotap unifies profiles to maximize cross-sell/upsell.',
      'Cookie deprecation directly impacts retargeting budgets. ID+ maintains addressability without cookies.',
      'Real-time segment activation enables flash sale targeting and abandoned cart recovery within minutes.',
      'Connect POS, web, and app data for true omnichannel customer journeys.',
    ],
    demoFlow: [
      'Show data ingestion from web SDK + POS system',
      'Demo identity resolution merging online/offline profiles',
      'Build a "high-value shoppers who abandoned cart" segment',
      'Activate segment to Google Ads + email in real-time',
      'Show journey canvas for automated cart recovery flow',
    ],
  },
  {
    id: 'telecom',
    name: 'Telecommunications',
    icon: '📱',
    color: '#10b981',
    description: 'Telcos generate massive data volumes across subscriber touchpoints and need CDPs for churn reduction and ARPU growth.',
    recommendedModules: [
      'what-is-cdp',
      'how-zeotap-works',
      'our-customers',
      'competitive-landscape',
      'objection-handling',
    ],
    battleCardIds: ['treasure-data', 'adobe-cdp', 'mparticle'],
    talkingPoints: [
      'Telcos have 10+ data silos (billing, CRM, network, app, retail). Zeotap unifies them in weeks.',
      'Churn prediction models using unified profiles can reduce churn by 15-25%.',
      'ID+ handles cross-device identity natively — critical for telcos managing multiple devices per subscriber.',
      'GDPR compliance is critical for EU telcos. Zeotap is EU-native with ISO 27701.',
    ],
    demoFlow: [
      'Show batch + real-time data ingestion for subscriber data',
      'Demo UCID creation across phone, tablet, home broadband',
      'Build a "subscribers likely to churn" propensity segment',
      'Show activation to retention campaign channels',
      'Demo consent management dashboard',
    ],
  },
  {
    id: 'finance',
    name: 'Financial Services',
    icon: '🏦',
    color: '#f59e0b',
    description: 'Banks and insurers need privacy-first CDPs for cross-selling financial products while maintaining regulatory compliance.',
    recommendedModules: [
      'what-is-cdp',
      'how-zeotap-works',
      'business-model',
      'zeotap-pitch',
      'objection-handling',
    ],
    battleCardIds: ['adobe-cdp', 'treasure-data', 'segment'],
    talkingPoints: [
      'Financial services see 5-10x higher CAC than retail. Cross-sell to existing customers is critical.',
      'Regulatory compliance (GDPR, PSD2, MiFID II) makes EU-native architecture a requirement, not a nice-to-have.',
      'Identity resolution across banking, insurance, and investment products drives share-of-wallet growth.',
      'Deterministic matching (no probabilistic guessing) is essential for financial regulatory requirements.',
    ],
    demoFlow: [
      'Show secure data ingestion with encryption at rest/transit',
      'Demo consent-first profile creation',
      'Build a "cross-sell insurance to banking customers" segment',
      'Show suppression list management for opted-out customers',
      'Demo audit trail and data lineage capabilities',
    ],
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    icon: '🎬',
    color: '#a855f7',
    description: 'Media companies need to understand content consumption patterns and monetize audiences across channels.',
    recommendedModules: [
      'what-is-cdp',
      'how-zeotap-works',
      'audience-builder',
      'data-collection',
      'discovery-questions',
    ],
    battleCardIds: ['mparticle', 'segment', 'tealium'],
    talkingPoints: [
      'Media companies generate billions of content interaction events. Zeotap processes them in real-time.',
      'First-party data strategy is critical as third-party cookies disappear — build direct audience relationships.',
      'Lookalike modeling on engaged audiences expands advertiser reach with deterministic matching.',
      'Real-time segment activation enables dynamic content personalization and ad targeting.',
    ],
    demoFlow: [
      'Show real-time event ingestion from streaming/web platform',
      'Demo behavioral segmentation based on content consumption',
      'Build "binge-watcher who might churn" audience',
      'Show activation to push notification + email channels',
      'Demo SmartPixel for on-site content personalization',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Pharma',
    icon: '🏥',
    color: '#ef4444',
    description: 'Healthcare organizations need strict privacy controls while creating patient engagement programs.',
    recommendedModules: [
      'what-is-cdp',
      'how-zeotap-works',
      'business-model',
      'competitive-landscape',
      'objection-handling',
    ],
    battleCardIds: ['adobe-cdp', 'treasure-data'],
    talkingPoints: [
      'Healthcare data requires the highest level of compliance. Zeotap has ISO 27701, ISO 27018, and SOC 2.',
      'EU data residency is non-negotiable for European healthcare. Zeotap infrastructure is EU-native.',
      'Patient engagement programs need unified profiles without compromising HIPAA/GDPR compliance.',
      'Deterministic identity prevents patient record duplication across systems.',
    ],
    demoFlow: [
      'Show data governance and privacy controls',
      'Demo consent management for patient data',
      'Build a compliant patient engagement segment',
      'Show role-based access control for different departments',
      'Demo audit logs and data lineage for compliance',
    ],
  },
];
