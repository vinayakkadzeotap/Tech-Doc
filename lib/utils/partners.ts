export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'Data Partner' | 'Technology Partner' | 'Cloud Partner' | 'Agency Partner' | 'Integration Partner';
  description: string;
  capabilities: string[];
  coSellPoints: string[];
  integrationLevel: 'Deep' | 'Standard' | 'API';
}

export const PARTNERS: Partner[] = [
  {
    id: 'snowflake',
    name: 'Snowflake',
    logo: '❄️',
    type: 'Cloud Partner',
    description: 'Cloud data warehouse integration for unified customer data activation and analytics.',
    capabilities: [
      'Native data share for real-time segment sync',
      'Snowflake Secure Data Sharing for audience export',
      'Joint data clean room capabilities',
      'Unified identity resolution across warehoused data',
    ],
    coSellPoints: [
      'Mutual customers get fastest time-to-value with pre-built connectors',
      'Joint solution reduces data movement costs by up to 60%',
      'Clean room offering addresses privacy concerns for regulated industries',
    ],
    integrationLevel: 'Deep',
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud Platform',
    logo: '☁️',
    type: 'Cloud Partner',
    description: 'Strategic cloud partnership for BigQuery ML integration and Google Marketing Platform activation.',
    capabilities: [
      'BigQuery ML model scoring for propensity and churn',
      'Google Ads Customer Match audience sync',
      'Looker Studio dashboards for CDP analytics',
      'Vertex AI integration for advanced segmentation',
    ],
    coSellPoints: [
      'Only CDP with native BigQuery ML model scoring',
      'Seamless Google Marketing Platform activation pipeline',
      'Joint GTM for enterprise data-driven marketing',
    ],
    integrationLevel: 'Deep',
  },
  {
    id: 'braze',
    name: 'Braze',
    logo: '🔥',
    type: 'Technology Partner',
    description: 'Customer engagement platform integration for real-time personalization and campaign orchestration.',
    capabilities: [
      'Real-time audience sync to Braze cohorts',
      'Bi-directional event streaming',
      'Attribute enrichment for Braze user profiles',
      'Campaign trigger based on CDP segment entry/exit',
    ],
    coSellPoints: [
      'Combined solution reduces integration time from weeks to hours',
      'Joint customers see 2-3x improvement in campaign relevance',
      'Pre-built templates for common use cases (churn, upsell, onboarding)',
    ],
    integrationLevel: 'Deep',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '💼',
    type: 'Integration Partner',
    description: 'CRM integration for unified customer view across marketing and sales touchpoints.',
    capabilities: [
      'Bi-directional contact and lead sync',
      'Marketing Cloud audience activation',
      'Sales Cloud enrichment with behavioral signals',
      'Service Cloud integration for support context',
    ],
    coSellPoints: [
      'Bridges the gap between marketing data and CRM',
      'Enriches Salesforce records with behavioral and intent signals',
      'Complements Salesforce CDP for organizations with hybrid needs',
    ],
    integrationLevel: 'Standard',
  },
  {
    id: 'the-trade-desk',
    name: 'The Trade Desk',
    logo: '📊',
    type: 'Data Partner',
    description: 'Programmatic advertising activation with first-party data for cookieless targeting.',
    capabilities: [
      'UID2 integration for cookieless audience activation',
      'First-party segment activation for programmatic campaigns',
      'Lookalike modeling on first-party seeds',
      'Cross-device identity matching',
    ],
    coSellPoints: [
      'First-party data strategy for post-cookie advertising',
      'Joint solution delivers 40-60% better ROAS vs third-party data',
      'Privacy-safe audience activation with UID2 framework',
    ],
    integrationLevel: 'Standard',
  },
];

export function searchPartners(query: string): Partner[] {
  const q = query.toLowerCase();
  return PARTNERS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.capabilities.some((c) => c.toLowerCase().includes(q))
  );
}
