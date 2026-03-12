export interface CaseStudy {
  id: string;
  customer: string;
  industry: string;
  useCase: string;
  challenge: string;
  solution: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  tags: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'retail-fashion-eu',
    customer: 'Leading EU Fashion Retailer',
    industry: 'Retail',
    useCase: 'Omnichannel Identity Resolution',
    challenge: 'Customer data siloed across 200+ stores, e-commerce, and mobile app. Unable to create unified customer view or attribute in-store visits to online browsing.',
    solution: 'Deployed Zeotap CDP with web SDK, POS integration, and mobile app connector. ID+ resolved 78% of cross-channel identities within 6 weeks.',
    outcome: 'Unified customer profiles enabled personalized email campaigns and retargeting, driving measurable revenue lift and operational efficiency.',
    metrics: [
      { label: 'Identity match rate', value: '78%' },
      { label: 'Time to value', value: '6 weeks' },
      { label: 'Email revenue lift', value: '+34%' },
      { label: 'Reduced data silos', value: '12 → 1' },
    ],
    tags: ['identity-resolution', 'retail', 'omnichannel', 'eu'],
  },
  {
    id: 'telco-churn',
    customer: 'Major European Telco',
    industry: 'Telecom',
    useCase: 'Churn Prediction & Prevention',
    challenge: 'Monthly subscriber churn rate of 2.1% with no ability to predict or proactively retain at-risk subscribers. Customer data spread across billing, CRM, and network systems.',
    solution: 'Unified subscriber data from 8 sources using Zeotap CDP. Built propensity-to-churn model using Zeotap ML capabilities. Activated retention campaigns to at-risk segments.',
    outcome: 'Reduced monthly churn by 19% within 3 months, saving estimated €4.2M in annual subscriber revenue.',
    metrics: [
      { label: 'Churn reduction', value: '19%' },
      { label: 'Annual savings', value: '€4.2M' },
      { label: 'Data sources unified', value: '8' },
      { label: 'Prediction accuracy', value: '87%' },
    ],
    tags: ['churn', 'telecom', 'ml', 'eu'],
  },
  {
    id: 'bank-cross-sell',
    customer: 'Top 10 European Bank',
    industry: 'Financial Services',
    useCase: 'Cross-sell Insurance Products',
    challenge: 'Banking and insurance divisions operated independently with no shared customer intelligence. Cross-sell campaigns had <2% conversion rate.',
    solution: 'Implemented Zeotap CDP with strict consent management. Created unified profiles across banking and insurance, with GDPR-compliant cross-sell segments.',
    outcome: 'Cross-sell conversion rate increased 3.2x while maintaining full regulatory compliance. Campaign efficiency improved dramatically.',
    metrics: [
      { label: 'Conversion rate', value: '6.4% (3.2x)' },
      { label: 'GDPR compliant', value: '100%' },
      { label: 'Profiles unified', value: '2.3M' },
      { label: 'Campaign efficiency', value: '+280%' },
    ],
    tags: ['cross-sell', 'finance', 'gdpr', 'eu'],
  },
  {
    id: 'media-engagement',
    customer: 'Digital Media Publisher',
    industry: 'Media',
    useCase: 'Audience Monetization & Engagement',
    challenge: 'Heavy reliance on third-party cookies for ad targeting. With cookie deprecation approaching, needed first-party data strategy to maintain CPMs.',
    solution: 'Deployed Zeotap CDP to build first-party audience segments from content consumption data. Used ID+ for deterministic cross-device matching. Activated audiences to programmatic platforms.',
    outcome: 'CPM rates increased 45% with first-party segments. Advertiser retention improved as targeting quality surpassed cookie-based alternatives.',
    metrics: [
      { label: 'CPM increase', value: '+45%' },
      { label: 'Addressable reach', value: '+62%' },
      { label: 'Advertiser retention', value: '+28%' },
      { label: 'Deployment time', value: '5 weeks' },
    ],
    tags: ['media', 'advertising', 'first-party', 'cookie-deprecation'],
  },
  {
    id: 'retail-grocery',
    customer: 'National Grocery Chain',
    industry: 'Retail',
    useCase: 'Loyalty Program Optimization',
    challenge: 'Loyalty program had 8M members but only 30% were active. Personalization limited to basic demographic segments.',
    solution: 'Used Zeotap CDP to enrich loyalty profiles with online browsing, purchase history, and app engagement. Built behavioral micro-segments for personalized offers.',
    outcome: 'Active loyalty participation increased 40%. Personalized offers drove higher basket value and repeat purchase frequency.',
    metrics: [
      { label: 'Active members', value: '+40%' },
      { label: 'Avg basket value', value: '+18%' },
      { label: 'Repeat purchase', value: '+22%' },
      { label: 'Segments created', value: '120+' },
    ],
    tags: ['loyalty', 'retail', 'personalization', 'behavioral'],
  },
  {
    id: 'telco-acquisition',
    customer: 'Mobile Operator (DACH region)',
    industry: 'Telecom',
    useCase: 'New Subscriber Acquisition',
    challenge: 'Customer acquisition cost (CAC) rising 15% YoY. Lookalike targeting relied on third-party data with declining accuracy.',
    solution: 'Built first-party lookalike audiences using Zeotap ML on existing high-value subscriber profiles. Activated to Google, Meta, and programmatic via Zeotap destinations.',
    outcome: 'CAC reduced 25% while improving subscriber quality (higher ARPU). Campaign ROAS improved across all channels.',
    metrics: [
      { label: 'CAC reduction', value: '25%' },
      { label: 'ARPU uplift', value: '+12%' },
      { label: 'Campaign ROAS', value: '+35%' },
      { label: 'Time to value', value: '4 weeks' },
    ],
    tags: ['acquisition', 'telecom', 'lookalike', 'dach'],
  },
  {
    id: 'insurance-personalization',
    customer: 'Pan-European Insurer',
    industry: 'Financial Services',
    useCase: 'Policy Renewal Personalization',
    challenge: 'Generic renewal communications resulted in 68% renewal rate. No ability to personalize based on customer lifecycle or risk profile.',
    solution: 'Zeotap CDP unified policy, claims, and engagement data. Built renewal propensity segments with personalized messaging strategies per segment.',
    outcome: 'Renewal rate improved to 79% (+11 pts). High-value customer retention specifically improved 15%, protecting premium revenue.',
    metrics: [
      { label: 'Renewal rate', value: '79% (+11pts)' },
      { label: 'HV retention', value: '+15%' },
      { label: 'Revenue protected', value: '€8.5M' },
      { label: 'Segments', value: '24' },
    ],
    tags: ['insurance', 'finance', 'retention', 'personalization'],
  },
  {
    id: 'pharma-hcp',
    customer: 'Global Pharma Company',
    industry: 'Healthcare',
    useCase: 'HCP Engagement Optimization',
    challenge: 'Healthcare professional (HCP) engagement fragmented across field sales, webinars, and digital channels. No unified view of HCP interactions.',
    solution: 'Implemented Zeotap CDP with strict privacy controls for HCP data. Unified touchpoints from CRM, webinar platforms, and digital campaigns.',
    outcome: 'HCP engagement frequency increased 30%. Sales rep productivity improved with unified HCP profiles and next-best-action recommendations.',
    metrics: [
      { label: 'HCP engagement', value: '+30%' },
      { label: 'Rep productivity', value: '+22%' },
      { label: 'Data sources unified', value: '6' },
      { label: 'Privacy compliant', value: '100%' },
    ],
    tags: ['healthcare', 'pharma', 'hcp', 'compliance'],
  },
];

export const INDUSTRIES = Array.from(new Set(CASE_STUDIES.map((cs) => cs.industry)));
export const USE_CASES = Array.from(new Set(CASE_STUDIES.map((cs) => cs.useCase)));
