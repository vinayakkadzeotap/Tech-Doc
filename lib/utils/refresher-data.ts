export interface RefresherCard {
  title: string;
  points: string[];
}

export const REFRESHER_CARDS: Record<string, RefresherCard[]> = {
  'what-is-zeotap': [
    { title: 'Company Overview', points: ['Founded 2014, headquartered in Berlin', 'Customer Data Platform (CDP) for enterprises', 'EU-native with global presence'] },
    { title: 'Core Value Prop', points: ['Unify fragmented customer data', 'Deterministic identity resolution via ID+', 'Privacy-first, GDPR-compliant by design'] },
    { title: 'Key Numbers', points: ['100+ enterprise customers', 'Process billions of data points daily', 'ISO 27701, SOC 2 Type II certified'] },
  ],
  'what-is-cdp': [
    { title: 'CDP Definition', points: ['Centralized customer data hub', 'Collects first-party data from all sources', 'Creates unified customer profiles'] },
    { title: 'CDP vs. Others', points: ['CDP ≠ CRM (CDPs handle all data, not just sales)', 'CDP ≠ DMP (CDPs use 1st-party, persistent data)', 'CDP ≠ Data Warehouse (CDPs are marketer-accessible)'] },
    { title: 'Core Capabilities', points: ['Data collection & integration', 'Identity resolution & profile unification', 'Audience segmentation & activation'] },
  ],
  'our-customers': [
    { title: 'Primary Verticals', points: ['Retail & E-commerce', 'Telecommunications', 'Media & Entertainment', 'Financial Services'] },
    { title: 'Customer Profile', points: ['Enterprise and mid-market brands', 'Data-mature organizations', 'EU and global companies needing GDPR compliance'] },
  ],
  'how-zeotap-works': [
    { title: 'Three Pillars', points: ['COLLECT: SDKs, APIs, connectors, batch upload', 'UNIFY: ID+ identity graph, UCID creation', 'ACTIVATE: Audience builder, journey orchestration, 100+ destinations'] },
    { title: 'Identity Resolution', points: ['ID+ creates Universal Customer IDs (UCIDs)', 'Deterministic matching across devices', 'Persistent profiles that survive cookie deletion'] },
    { title: 'Tech Stack', points: ['Built on GCP (BigQuery, GKE, Pub/Sub)', 'Delta Lake for data storage', 'Real-time + batch processing'] },
  ],
  'competitive-landscape': [
    { title: 'Key Competitors', points: ['Treasure Data: strong in APAC, weak EU/identity', 'Tealium: tag mgmt heritage, modular pricing', 'Segment (Twilio): developer-first, limited CDP', 'Adobe: enterprise suite, expensive + slow'] },
    { title: 'Zeotap Advantages', points: ['4-8 weeks to value (vs. 6-18 months)', 'Built-in identity resolution (ID+)', 'EU-native, GDPR by design', 'All-in-one pricing (no modules)'] },
  ],
  'business-model': [
    { title: 'Revenue Model', points: ['SaaS subscription (annual contracts)', 'Pricing based on data volume + profiles', 'Upsell through additional modules/channels'] },
    { title: 'Go-to-Market', points: ['Direct enterprise sales', 'Partner channel (SI, agencies)', 'Land & expand within accounts'] },
  ],
  'unity-dashboard': [
    { title: 'What is Unity', points: ['Central management console', 'All CDP functions in one place', 'Role-based access control'] },
    { title: 'Key Sections', points: ['Data Sources & Connectors', 'Audience Builder & Segments', 'Journey Canvas', 'Reports & Analytics'] },
  ],
  'data-collection': [
    { title: 'Collection Methods', points: ['Web SDK (JavaScript tag)', 'Mobile SDKs (iOS, Android)', 'Server-side APIs (REST)', 'Batch file upload (CSV, JSON)', 'Pre-built connectors (Salesforce, GA, etc.)'] },
    { title: 'Integr8 Framework', points: ['Handles data transformation', 'Schema validation and mapping', 'Error handling and retry logic'] },
  ],
  'audience-builder': [
    { title: 'Building Audiences', points: ['Visual drag-and-drop interface', 'Combine demographics + behaviors + events', 'Real-time audience estimation', 'No SQL required'] },
    { title: 'Audience Types', points: ['Static segments (point-in-time snapshot)', 'Dynamic segments (auto-refresh on schedule)', 'Lookalike audiences (expand reach)', 'Suppression lists (exclude users)'] },
  ],
  'zeotap-pitch': [
    { title: 'Pitch Structure', points: ['1. Pain: Fragmented customer data', '2. Solution: Unified CDP with identity', '3. Proof: Customer outcomes + time to value', '4. Differentiation: EU-native, deterministic ID'] },
    { title: 'Key Proof Points', points: ['4-8 weeks to first activation', 'Avg 30% improvement in match rates', 'ISO 27701 + SOC 2 certified'] },
  ],
  'discovery-questions': [
    { title: 'Must-Ask Questions', points: ['What data sources do you have today?', 'How do you currently build audiences?', 'What\'s your biggest data challenge?', 'What does your martech stack look like?'] },
    { title: 'Qualification Signals', points: ['Multiple disconnected data sources ✓', 'Manual audience building processes ✓', 'GDPR/privacy compliance needs ✓', 'Cookie deprecation concerns ✓'] },
  ],
  'objection-handling': [
    { title: 'Common Objections', points: ['"We already have a CDP" → Ask about gaps', '"Too expensive" → Compare TCO vs. point solutions', '"Not a priority" → Highlight cookie deprecation urgency', '"We can build it ourselves" → 18+ months vs. 8 weeks'] },
    { title: 'Competitive Rebuttals', points: ['vs. Treasure Data: Identity quality + EU compliance', 'vs. Segment: Full CDP vs. data pipe', 'vs. Adobe: Speed + cost (3-5x cheaper)', 'vs. Tealium: All-in-one vs. modular pricing'] },
  ],
};
