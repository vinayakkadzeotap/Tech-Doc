---
name: cdp-data-enricher
description: Enhances customer profiles with behavioral signals, real-time intent, and derived attributes. Assesses current data coverage, identifies gaps, extracts recent behavioral changes, and recommends enrichment strategies. Powers predictive models, personalization engines, and decisioning systems. Triggers on "enrich profiles", "add signals", "behavioral data", "intent signals", "profile completeness", "missing attributes", "data gaps". Rapidly evaluates what you have, diagnoses what's missing, and prioritizes enrichment investments for marketing ROI.
---

# CDP Data Enricher

## Overview

The Data Enricher skill diagnoses your customer profile completeness and designs enrichment strategies to fuel better marketing decisions. Instead of guessing what signals matter, this skill systematically maps your current data landscape, identifies gaps, extracts behavioral signals from recent activity, and recommends prioritized enrichment actions.

## Typical Workflow

1. **Data Landscape Assessment** – Map all current customer attributes
2. **Quality & Coverage Analysis** – Identify gaps (low fill rates, sparse data)
3. **Behavioral Signal Extraction** – Uncover intent signals from recent event changes
4. **Enrichment Gap Analysis** – Determine what's missing vs. what's available
5. **Vertical Benchmarking** – Compare against industry standards
6. **Enrichment Roadmap** – Prioritize additions for marketing impact
7. **Compliance Review** – Validate PII handling before enrichment

---

## Step 1: Data Landscape Assessment

Begin by cataloging every attribute your customer profiles currently contain:

```
Tool: schema_discovery(operation="overview")
Result: High-level view of all data stores
  - profile_store: 150 customer attributes
  - event_store: 75 event types with payloads
  - calculated_attribute: 45 derived metrics
  - consent_store: Privacy/preference data

Tool: schema_discovery(operation="columns", store_type="profile_store")
Result: Detailed column listing (sample):
  - Basic: user_id, email, phone, created_date
  - Demographic: age, gender, income, location, marital_status
  - Behavioral: purchase_frequency, last_purchase_date, ltv_estimate
  - Engagement: email_opens, click_rate, push_notification_opt_in
  - Derived: churn_score, lifetime_value_category, engagement_tier
  ... (140+ more attributes)
```

This inventory becomes your baseline for gap analysis.

---

## Step 2: Quality & Coverage Analysis

Presence alone doesn't mean usability. Assess data quality using `feature_analysis`:

```
Tool: feature_analysis(columns=[all], metric_types=["basic"],
                       store_type="profile_store")
Result: Data quality metrics for each attribute:
  - age: fill_rate=94%, data_type=integer
  - income: fill_rate=42%, data_type=currency  ← GAP: only 42% populated
  - purchase_frequency: fill_rate=100%, data_type=integer
  - brand_affinity: fill_rate=8%, data_type=string  ← CRITICAL GAP
```

**Red Flags to Identify**:
- **Low Fill Rate** (< 50%): Attribute exists but rarely populated
- **High Cardinality** (100K+ unique values): Hard to use in targeting
- **Low Cardinality** (< 5 unique values): Limited segmentation value
- **Stale Data**: Last_update_date shows no changes in 90+ days

---

## Step 3: Behavioral Signal Extraction via Time Travel

Recent behavioral changes often indicate intent. Use `time_travel` to surface emerging signals:

```
Tool: time_travel(starting_timestamp="2026-02-05", ending_timestamp="2026-03-05",
                  change_types=["insert", "update_postimage"],
                  columns=["purchase_count", "engagement_score", "category_preference"],
                  include_statistics=true, include_raw_data=true)
Result: Behavioral momentum indicators
```

**Extract These Signals**:

1. **Engagement Velocity**: How fast is activity increasing/decreasing?
   ```
   User X: purchase_count went 5→8 in 30 days (+60% velocity)
   → Signal: High purchase momentum; ready for upsell

   User Y: engagement_score went 85→40 in 30 days (-53% velocity)
   → Signal: Churn risk; trigger win-back
   ```

2. **Category Migration**: Are browsing/purchase patterns shifting?
   ```
   User Z: category_preference shifted from "Home & Garden" → "Electronics"
   → Signal: Cross-sell opportunity in new category
   ```

3. **Lifecycle Stage Transition**: Moving between journey phases?
   ```
   User W: Went from "subscriber" → "purchased_premium"
   → Signal: Monetization success; expand ecosystem
   ```

4. **Intent Signals** (Real-time):
   - Sudden increase in search/browse activity in new category
   - Adding items to cart (purchase intent)
   - Visiting pricing/comparison pages (shopping mode)
   - Viewing help/documentation (activation intent)

---

## Step 4: Enrichment Categories & Strategies

Structure enrichment by category. Each category serves different marketing use cases:

### Category 1: Demographic Enrichment
**Current State**: Name, email, location, age
**Gaps**: Household composition, income, education, occupation
**Enrichment Source**: Third-party appends (data brokers) or CRM uploads
**Marketing Impact**: Hyper-targeted messaging, media buying optimization
**Example**:
```
Before: "User is 35 years old in California"
After: "35-year-old parent with 2 kids, household income $120K, metro area"
→ Enables targeting "Back to School" campaigns, family plans
```

### Category 2: Behavioral Enrichment
**Current State**: Purchase history, browsing (via events)
**Gaps**: Browse frequency, time-in-app, content consumption patterns, search behavior
**Enrichment Source**: First-party event data (already available via time_travel)
**Marketing Impact**: Behavioral triggers, engagement scoring, churn early-warning
**Example**:
```
Before: "User made 5 purchases"
After: "User browses weekly, averages 8 pages/session, spends 12 min/visit"
→ Enables lifecycle stage detection and optimal send time selection
```

### Category 3: Transactional Enrichment
**Current State**: Purchase count, order value, categories purchased
**Gaps**: Return rate, profit margin, product satisfaction, repeat purchase cycles
**Enrichment Source**: Order system integration, returns data, margin database
**Marketing Impact**: Profitability segmentation, retention ROI scoring
**Example**:
```
Before: "User has $5K lifetime value"
After: "User has $5K LTV but 35% return rate; net margin $3.2K"
→ Enables profitability-based targeting (focus on low-return segments)
```

### Category 4: Engagement Enrichment
**Current State**: Email opens, click rates, push opt-in status
**Gaps**: Email engagement by content type, channel preference velocity, optimal send times
**Enrichment Source**: Email platform data (via integration), engagement scoring models
**Marketing Impact**: Channel selection, frequency capping, cadence optimization
**Example**:
```
Before: "User opens emails 40% of time"
After: "User opens promotional emails 55%, product reviews 30%; prefers SMS"
→ Enables channel-specific messaging and content personalization
```

### Category 5: Intent Enrichment
**Current State**: Browsing history (categorical)
**Gaps**: Search keywords, content engagement (time-in-page), comparison activity, price sensitivity
**Enrichment Source**: Event payloads, clickstream analysis
**Marketing Impact**: Predictive messaging, personalized recommendations, dynamic pricing
**Example**:
```
Before: "User browsed Electronics"
After: "User searched 'budget laptop', spent 8 min on comparison page, viewed 12 reviews"
→ Enables "Here's a $600 laptop with great reviews" targeted ad
```

### Category 6: Real-Time Intent (Highest Value)
**Current State**: Static daily/weekly attributes
**Gaps**: Session-level signals (current session activity, micro-interactions)
**Enrichment Source**: Real-time event streams
**Marketing Impact**: Decisioning at moment of interaction (next-best-action, offer optimization)
**Example**:
```
Real-time: User is currently browsing "Running Shoes" category in session
→ Enable real-time ad personalization, in-app messaging, and web personalization
```

---

## Step 5: Vertical-Specific Enrichment Playbooks

Industry best practices differ. Reference your vertical's enrichment priorities:

### Retail & E-Commerce
**Priority 1**: Product affinity enrichment (what categories matter to this customer?)
**Priority 2**: Price sensitivity (discount responsiveness)
**Priority 3**: Seasonality patterns (when does customer shop?)
**Data Benchmark**: 80%+ fill on purchase history, 60%+ on category affinity

### Gaming & Entertainment
**Priority 1**: Genre/content preference enrichment
**Priority 2**: Monetization propensity (spend likelihood)
**Priority 3**: Session behavior (play duration, engagement patterns)
**Data Benchmark**: 90%+ fill on engagement metrics, 70%+ on content preferences

### Financial Services
**Priority 1**: Account health indicators (balance trends, transaction patterns)
**Priority 2**: Risk profile enrichment (inferred from behavior)
**Priority 3**: Life event signals (first home, retirement planning, etc.)
**Data Benchmark**: 95%+ fill on core account data, 40%+ on life event signals
**Compliance**: Use `schema_discovery(pii)` to validate no over-enrichment of sensitive attributes

### Telecom & Media
**Priority 1**: Service usage enrichment (data consumption, call patterns)
**Priority 2**: Device ecosystem signals (phone, tablet, smart home compatibility)
**Priority 3**: Content preference enrichment (streaming patterns, sports/news affinity)
**Data Benchmark**: 85%+ fill on usage data, 60%+ on device/content signals

---

## Step 6: PII Compliance Check

Before enriching profiles, validate data governance:

```
Tool: schema_discovery(operation="pii")
Result: Identifies PII columns (email, phone, SSN, payment info, etc.)
```

**Enrichment Compliance Rules**:
- ✓ OK: Aggregate PII (e.g., "urban" vs. full address)
- ✓ OK: Derived signals (e.g., "churn_risk_score" vs. raw behavior)
- ✗ CAUTION: Raw PII appends from third parties (ensure consent + legal review)
- ✗ CAUTION: Sensitive inferred attributes (health status, financial stress)

**Best Practice**: Enrich into separate derived attribute columns; don't overwrite raw PII.

---

## Step 7: Enrichment Roadmap Output

The Data Enricher deliverable is a prioritized enrichment roadmap:

```
ENRICHMENT ASSESSMENT REPORT
Generated: 2026-03-05

CURRENT DATA LANDSCAPE
├── Profile Store: 150 attributes, 87% avg fill rate
├── Event Store: 75 event types, rich payload data
├── Calculated Attributes: 45 derived metrics
└── Consent Store: 12 preference attributes (92% fill)

DATA QUALITY GAPS (Fill Rate < 50%)
├── income: 42% (Priority: High—enables premium segmentation)
├── brand_affinity: 8% (Priority: Low—sparse signal)
└── last_engagement_date: 35% (Priority: High—blocks churn modeling)

BEHAVIORAL SIGNALS EXTRACTION (Last 30 Days)
├── Engagement Velocity: 12% users showed 30%+ activity increase
├── Category Migration: 3,200 users shifted categories (cross-sell signal)
└── Intent Signals: 8,400 users added items to cart (purchase intent)

ENRICHMENT ROADMAP
Priority 1 (Implement in Q1):
├── Income/Household Composition (append via DMP partner)
├── Category Affinity Scoring (derive from recent purchases + browsing)
└── Churn Risk Score (behavioral model on recent engagement changes)
Expected Impact: +25% engagement, +15% retention

Priority 2 (Implement in Q2):
├── Price Sensitivity Scoring (analyze historical discount response)
├── Optimal Send Time (per-user engagement patterns)
└── Device Ecosystem Enrichment (infer from session data)
Expected Impact: +12% email engagement, +8% conversion

Priority 3 (Implement in Q3):
├── Real-time Intent Signals (session-level decisioning)
├── Competitor Propensity (inferred from search/browse patterns)
└── Lifetime Value Prediction (BQML-powered)
Expected Impact: +20% personalization accuracy

COMPLIANCE NOTES
✓ All planned enrichments reviewed for PII/consent requirements
✓ Recommended audit log additions (track enrichment audit trail)

ESTIMATED TIMELINE & COST
├── Phase 1: 4 weeks, $15K (third-party appends, scoring models)
├── Phase 2: 3 weeks, $10K (optimization features)
└── Phase 3: 6 weeks, $25K (real-time decisioning platform)
Total: 13 weeks, $50K
Expected ROI: 3.2x (based on engagement lift benchmarks)
```

---

## Implementation Sequence

1. **Week 1**: Run this Data Enricher skill; review gaps and roadmap
2. **Week 2**: Prioritize top 3 enrichments; finalize data sources
3. **Week 3–4**: Implement Priority 1 enrichments
4. **Week 5**: Validate quality; measure impact on campaign performance
5. **Week 6+**: Iterate; plan Priority 2 enrichments

---

## Related Skills

- **cdp-audience-finder**: Leverage enriched attributes for better audience definition
- **cdp-lookalike-finder**: Use enrichment dimensions for similarity matching
- **cdp-data-scientist**: Use enriched features for model training
- **cdp-journey-recommender**: Use enriched signals for next-best-action logic
