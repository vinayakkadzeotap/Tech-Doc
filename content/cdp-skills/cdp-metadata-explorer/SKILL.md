---
name: cdp-metadata-explorer
description: |
  Crawls raw schemas to generate semantic context for accurate data retrieval and reasoning.
  THE entry point for understanding what data exists in your CDP. Call this immediately when you need to explore available
  attributes, understand data completeness, identify PII fields, or build a data dictionary. Essential before any
  audience targeting, segmentation, or analytical work. Use triggers: "what data do we have", "show me the schema",
  "which fields exist", "data dictionary", "available attributes", "what's in the CDP", "explore our data".
  This skill cuts through complexity and delivers marketer-friendly data catalogs with fill rates and quality metrics.
---

# CDP Metadata Explorer

## Overview

The CDP Metadata Explorer is your gateway to understanding the complete data landscape within your Customer Data Platform. Rather than guessing what attributes are available or how complete they are, this skill systematically crawls your schema and presents a comprehensive, marketer-friendly data catalog.

**When to use this skill:**
- You need to understand what customer attributes are available
- You're building a segment and want to know which fields you can use
- You want to see data completeness and quality metrics
- You need to identify sensitive/PII fields before analysis
- You're onboarding to the CDP and need orientation
- You're planning a campaign and want to understand targeting options

## How It Works

The skill follows a structured, progressive discovery approach:

### Phase 1: System Overview
Start by calling `schema_discovery(operation: "overview")` to get a bird's-eye view of all data stores and their distribution. This shows you the major data categories in your CDP.

### Phase 2: Store-Level Deep Dive
For each store type discovered, call `schema_discovery(operation: "store", store_type: "<type>")` to explore:
- **profile_store**: User profile attributes (demographics, identity, preferences)
- **event_store**: Event/interaction data (purchases, clicks, page views, custom events)
- **calculated_attribute**: Derived/aggregated data (lifetime value, engagement scores, behavioral features)
- **consent_store**: Privacy and consent data (opt-in status, privacy preferences)

### Phase 3: Column Analysis
Identify key columns and call `schema_discovery(operation: "columns", columns: ["field1", "field2", ...])` to retrieve:
- Data type information
- Fill rate (what percentage of users have this value)
- Distinct value counts
- Sample values
- Cardinality classification

### Phase 4: PII Detection
Run `schema_discovery(operation: "pii")` to automatically flag sensitive fields like:
- Email addresses
- Phone numbers
- Social security numbers
- Financial account numbers
- Health/medical information

### Phase 5: Quality Assessment
For columns with potential issues (low fill rates, unusual patterns), call `feature_analysis(columns: [...], metric_types: ["basic", "quality"], store_type: "profile_store")` to get:
- Fill rate percentages
- Cardinality patterns
- Data quality indicators
- Sample distributions

## Output Format

Present results as a marketer-friendly data catalog organized by category:

```
📊 DATA CATALOG - YOUR CDP

[PROFILE DATA]
├── Identity
│   ├── user_id (100% complete) - Unique customer ID
│   ├── email (87% complete) - Customer email address [PII]
│   └── phone (45% complete) - Phone number [PII]
├── Demographics
│   ├── age (92% complete) - Age in years
│   ├── gender (94% complete) - Gender classification
│   └── country (99% complete) - Country of residence
└── Behavioral Scores
    ├── engagement_score (100% complete) - 0-100 engagement metric
    └── loyalty_tier (85% complete) - Tier classification

[EVENT DATA]
├── Commerce
│   ├── purchase_amount (varies) - Transaction amount
│   ├── product_category (varies) - Category purchased
│   └── purchase_date (varies) - Date of transaction
└── Web
    ├── page_view_count - Number of page views
    └── session_duration - Session length in seconds

[SENSITIVE FIELDS] ⚠️
├── email [PII]
├── phone [PII]
└── ssn [PII - HIGHLY SENSITIVE]
```

## Example Interactions

### User asks: "What data do we have?"

You should:
1. Call `schema_discovery(overview)` - get the big picture
2. For each returned store type, call `schema_discovery(store)`
3. Select 10-15 most important columns across all stores
4. Call `schema_discovery(columns)` for those columns
5. Call `schema_discovery(pii)` to identify sensitive data
6. Present organized catalog with fill rates and quality

### User asks: "What fields can I use for targeting?"

You should:
1. Call `schema_discovery(overview)` and then all stores
2. Filter for profile_store and calculated_attribute columns
3. Call `schema_discovery(columns)` for targeting-relevant fields
4. Call `feature_analysis(columns: [...], metric_types: ["quality"])`
5. Prioritize fields with >80% fill rate
6. Flag any PII considerations
7. Return ordered by usefulness for segmentation

### User asks: "What's our data quality like?"

You should:
1. Call `schema_discovery(overview)` to identify all data
2. Call `feature_analysis(metric_types: ["basic", "quality"])` on major columns
3. Identify low fill-rate fields
4. Check cardinality and distinctness
5. Present quality dashboard highlighting problem areas

## Key Concepts

**Fill Rate**: Percentage of user records with a value for this field. >80% is excellent, >60% is usable, <40% is risky for targeting.

**Cardinality**: Number of distinct values. High cardinality (many unique values) is good for segmentation. Low cardinality (few values) limits targeting options.

**PII (Personally Identifiable Information)**: Automatically flagged sensitive data that requires special handling under GDPR/CCPA.

**Store Types**: Logical groupings of data - profiles are customers, events are behaviors, calculated attributes are derived signals.

## Tips for Marketers

1. **Start broad, then narrow**: Always begin with overview, then explore specific stores
2. **Focus on fill rate**: Fields with <60% fill rate may not be reliable for targeting
3. **Combine stores**: Use profile data for who + event data for what they did + calculated attributes for propensity
4. **Watch for PII**: Flag any PII usage in your workflows and ensure compliance
5. **Ask about recency**: Event data completeness depends on how old the events are
6. **Validate assumptions**: Don't assume field X exists - verify it in the catalog first

## Related Skills

- **cdp-health-diagnostics**: If data seems incomplete, check pipeline health
- **cdp-data-analyzer**: For deeper statistical analysis of available fields
- **cdp-marketing-suite**: Router to all CDP capabilities

---

*Last Updated: 2026-03-05*
