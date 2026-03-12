export interface Objection {
  objection: string;
  response: string;
}

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
  objections: Objection[];
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
    objections: [
      { objection: 'We already use Google Analytics for customer data.', response: 'GA is great for web analytics but doesn\'t unify customer profiles across channels. A CDP connects GA data with POS, CRM, and app data for a true 360-degree view.' },
      { objection: 'Our DMP handles audience segmentation.', response: 'DMPs work with anonymous third-party data that\'s disappearing with cookie deprecation. Zeotap builds segments on deterministic first-party data that\'s future-proof.' },
      { objection: 'We can build this in-house with our data warehouse.', response: 'Custom builds take 12-18 months and require ongoing maintenance. Zeotap is purpose-built for marketers — your team can create segments in minutes, not sprint cycles.' },
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
    objections: [
      { objection: 'We have too many subscribers to migrate to a CDP.', response: 'Zeotap processes billions of events daily for enterprise telcos. Our batch + streaming ingestion handles any scale without downtime.' },
      { objection: 'Our CRM already does customer segmentation.', response: 'CRMs see only known touchpoints. Zeotap adds anonymous web behavior, app usage, and network data to give you a complete subscriber view for better churn prediction.' },
      { objection: 'We\'re locked into our current vendor ecosystem.', response: 'Zeotap integrates with your existing stack — it enhances your CRM, not replaces it. Most telcos see value within 8 weeks.' },
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
    objections: [
      { objection: 'Our compliance team won\'t approve a cloud-based CDP.', response: 'Zeotap is ISO 27701/27018 certified, SOC 2 Type II compliant, and runs entirely in EU data centers. We pass the strictest compliance reviews.' },
      { objection: 'We need on-premise deployment.', response: 'Our EU-native cloud architecture with dedicated tenant isolation meets the same security requirements as on-prem, with faster deployment and automatic updates.' },
      { objection: 'We already invested in a data lake.', response: 'Zeotap complements your data lake by adding real-time identity resolution and marketer-friendly segmentation on top of it. No rip-and-replace needed.' },
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
    objections: [
      { objection: 'Our ad tech stack already handles audience data.', response: 'Ad tech silos don\'t provide unified first-party profiles. Zeotap creates a persistent customer view that powers both ad monetization and content personalization.' },
      { objection: 'We need real-time processing for live content.', response: 'Zeotap processes events in under 100ms for real-time personalization, enabling live content recommendations and dynamic ad insertion.' },
      { objection: 'How do you handle consent for media audiences?', response: 'Zeotap has built-in consent management that handles IAB TCF 2.0, ensuring compliant audience building across all properties.' },
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
    objections: [
      { objection: 'Patient data can\'t leave our premises.', response: 'Zeotap supports EU-native data residency with dedicated infrastructure. All patient data stays in your chosen region with full encryption.' },
      { objection: 'HIPAA/GDPR compliance is too complex for a CDP.', response: 'Zeotap was built privacy-first with ISO 27701, supporting both HIPAA and GDPR by design — not as an afterthought.' },
      { objection: 'Our EHR system is our system of record.', response: 'Zeotap integrates with EHR systems to enrich patient engagement data without replacing your clinical systems.' },
    ],
  },
];
