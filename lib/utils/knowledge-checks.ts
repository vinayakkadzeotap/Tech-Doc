export interface KnowledgeQuestion {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ModuleKnowledgeCheck {
  moduleId: string;
  questions: KnowledgeQuestion[];
}

export const KNOWLEDGE_CHECKS: Record<string, KnowledgeQuestion[]> = {
  // Business Essentials
  'what-is-zeotap': [
    { text: 'What is Zeotap\'s primary product category?', options: ['CRM', 'Customer Data Platform (CDP)', 'Email Marketing Tool', 'Analytics Dashboard'], correct: 1, explanation: 'Zeotap is a Customer Data Platform (CDP) that unifies customer data across sources for activation and insights.' },
    { text: 'Which year was Zeotap founded?', options: ['2014', '2016', '2018', '2020'], correct: 0, explanation: 'Zeotap was founded in 2014 and has since grown into a leading European CDP.' },
  ],
  'what-is-cdp': [
    { text: 'Which of the following is NOT a core capability of a CDP?', options: ['Data Collection', 'Identity Resolution', 'Payroll Processing', 'Audience Activation'], correct: 2, explanation: 'CDPs collect data, resolve identities, build audiences, and activate them. Payroll processing is not a CDP function.' },
    { text: 'How does a CDP differ from a DMP?', options: ['CDPs use first-party data; DMPs primarily use third-party', 'CDPs are cheaper', 'DMPs are newer technology', 'There is no difference'], correct: 0, explanation: 'CDPs work with first-party, persistent customer data. DMPs primarily aggregate anonymous third-party cookie data.' },
    { text: 'What does "single customer view" mean in CDP context?', options: ['One customer per account', 'A unified profile merging all data sources', 'A single dashboard view', 'One login per customer'], correct: 1, explanation: 'Single customer view means creating a unified profile by merging data from all touchpoints and sources.' },
  ],
  'our-customers': [
    { text: 'Which industries are Zeotap\'s primary verticals?', options: ['Healthcare and Education', 'Retail, Telco, and Media', 'Construction and Mining', 'Government and Defense'], correct: 1, explanation: 'Zeotap primarily serves retail, telecommunications, and media/entertainment verticals.' },
    { text: 'What is the typical deployment model for Zeotap enterprise customers?', options: ['On-premise only', 'Cloud-native SaaS', 'Hybrid only', 'Desktop application'], correct: 1, explanation: 'Zeotap is deployed as a cloud-native SaaS platform, typically on GCP infrastructure.' },
  ],
  'how-zeotap-works': [
    { text: 'What are the three pillars of Zeotap\'s platform?', options: ['Collect, Unify, Activate', 'Plan, Build, Deploy', 'Ingest, Store, Query', 'Design, Develop, Test'], correct: 0, explanation: 'Zeotap\'s platform is built on three pillars: Collect (data ingestion), Unify (identity resolution), and Activate (audience activation).' },
    { text: 'What technology does Zeotap use for identity resolution?', options: ['Cookie matching', 'ID+ deterministic graph', 'Email hashing only', 'IP address matching'], correct: 1, explanation: 'Zeotap uses ID+, a deterministic identity graph that creates persistent, cross-device customer identities (UCIDs).' },
  ],
  'competitive-landscape': [
    { text: 'Which of these is a key differentiator for Zeotap vs. competitors?', options: ['Lowest price', 'EU-native with built-in identity resolution', 'Most integrations', 'Oldest in market'], correct: 1, explanation: 'Zeotap differentiates through EU-native data residency and its built-in deterministic identity resolution (ID+).' },
    { text: 'What is Zeotap\'s typical time-to-value compared to enterprise CDPs?', options: ['Same (6-12 months)', 'Faster (4-8 weeks)', 'Slower', 'Instant (1 day)'], correct: 1, explanation: 'Zeotap typically achieves value in 4-8 weeks, significantly faster than enterprise alternatives that take 6-18 months.' },
  ],
  'business-model': [
    { text: 'What is Zeotap\'s primary pricing model?', options: ['Per-user licensing', 'Platform subscription based on data volume', 'Pay-per-click', 'Free with ads'], correct: 1, explanation: 'Zeotap uses a platform subscription model, typically based on data volume and activated profiles.' },
  ],
  // Product Mastery
  'unity-dashboard': [
    { text: 'What is the Unity Dashboard?', options: ['A game engine', 'Zeotap\'s central management console', 'A BI reporting tool', 'An email editor'], correct: 1, explanation: 'Unity is Zeotap\'s central console where users manage data sources, audiences, journeys, and reports.' },
    { text: 'Who are the primary users of the Unity Dashboard?', options: ['Only engineers', 'Marketing and data teams', 'Only C-suite', 'External customers'], correct: 1, explanation: 'Unity is designed for marketing teams, data analysts, and business users to self-serve without engineering support.' },
  ],
  'data-collection': [
    { text: 'Which data collection methods does Zeotap support?', options: ['Only batch file upload', 'SDKs, APIs, batch upload, and connectors', 'Only real-time APIs', 'Manual entry only'], correct: 1, explanation: 'Zeotap supports multiple ingestion methods: web/mobile SDKs, REST APIs, batch file uploads, and pre-built connectors.' },
    { text: 'What is Integr8?', options: ['A database', 'Zeotap\'s data integration framework', 'A testing tool', 'An analytics module'], correct: 1, explanation: 'Integr8 is Zeotap\'s data integration framework that handles ingesting, transforming, and routing data from various sources.' },
  ],
  'audience-builder': [
    { text: 'What type of interface does the Audience Builder use?', options: ['SQL query editor', 'Visual drag-and-drop with filters', 'Command line', 'Spreadsheet'], correct: 1, explanation: 'The Audience Builder provides a visual interface where users can combine attributes, behaviors, and events to create segments without SQL.' },
    { text: 'Can audiences in Zeotap be refreshed automatically?', options: ['No, only manual refresh', 'Yes, on a scheduled or real-time basis', 'Only weekly', 'Only on request'], correct: 1, explanation: 'Audiences can be configured to refresh automatically on schedules or in near-real-time as new data arrives.' },
  ],
  'journey-canvas': [
    { text: 'What is the Journey Canvas used for?', options: ['Data visualization', 'Multi-step customer journey orchestration', 'Code deployment', 'Bug tracking'], correct: 1, explanation: 'The Journey Canvas enables marketers to build multi-step, conditional customer journeys with triggers, waits, splits, and actions.' },
  ],
  'activating-data': [
    { text: 'What does "activation" mean in CDP context?', options: ['Turning on the platform', 'Pushing audiences to marketing channels for action', 'Activating user accounts', 'Starting data collection'], correct: 1, explanation: 'Activation means sending built audiences to downstream channels (ad platforms, email, CRM) for targeted marketing actions.' },
  ],
  // Sales Enablement
  'zeotap-pitch': [
    { text: 'What should be the leading message in a Zeotap pitch?', options: ['We\'re the cheapest CDP', 'We unify customer data for smarter engagement', 'We have the most features', 'We\'re backed by top investors'], correct: 1, explanation: 'Lead with the value proposition: unifying fragmented customer data to enable smarter, privacy-compliant customer engagement.' },
  ],
  'discovery-questions': [
    { text: 'What is the most important outcome of a discovery call?', options: ['Closing the deal', 'Understanding the prospect\'s data challenges and goals', 'Showing all product features', 'Getting a verbal commitment'], correct: 1, explanation: 'Discovery is about understanding pain points, current stack, data maturity, and business goals to position Zeotap effectively.' },
  ],
  'objection-handling': [
    { text: 'When a prospect says "We already have a CDP," the best response is:', options: ['Accept and move on', 'Ask what gaps they\'re experiencing with their current solution', 'Say Zeotap is better', 'Offer a discount'], correct: 1, explanation: 'Explore gaps — incumbent CDPs often lack identity resolution quality, EU compliance, or self-serve capabilities that Zeotap excels at.' },
  ],
};
