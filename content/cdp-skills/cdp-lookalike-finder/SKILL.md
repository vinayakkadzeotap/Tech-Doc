---
name: cdp-lookalike-finder
description: Finds new prospects that resemble your best customers. Analyzes seed audiences (top spenders, brand advocates) and identifies lookalike segments across your data platform. Compares demographic, behavioral, and transactional attributes to expand addressable market. Uses statistical similarity scoring and vertical-specific playbooks. Triggers on "find similar customers", "lookalike audience", "expand audience", "customers like my best", "audience expansion". Rapidly discovers high-potential prospects matching proven customer profiles without manual rule-building.
---

# CDP Lookalike Finder

## Overview

The Lookalike Finder skill enables you to rapidly expand your audience by discovering new prospects that resemble your best-performing customer segments. Instead of starting from scratch with new audience definitions, this skill starts with a proven seed audience—your top 1% spenders, most engaged users, or highest-value segment—and finds similar prospects in your data platform.

## Typical Workflow

1. **Define Your Seed Audience** – Select the customer segment you want to replicate
2. **Understand Seed Attributes** – Analyze what makes these customers special
3. **Find Matches** – Search your full customer base for similar profiles
4. **Score & Rank** – Rank prospects by match confidence and shared attributes
5. **Export & Activate** – Send lookalike audience to marketing channels

---

## Step 1: Define Your Seed Audience

Seed audiences are high-value customer segments that serve as templates for expansion. Common seed definitions:

- **Revenue-Based**: Top 1% of customers by lifetime value or annual spend
- **Engagement-Based**: Most active users (e.g., daily active users, high event frequency)
- **Segment-Based**: Customers who purchased a specific product or converted on a campaign
- **Uploaded List**: CRM export of your best account relationships

Use `feature_analysis` to profile your seed audience:
```
Query: What are the key characteristics of our top 1% spenders?
Tool: feature_analysis([age, gender, purchase_frequency, avg_order_value, category_affinity], metric_types=[basic, statistical])
Result: Statistical distributions show seed audience skews toward 35-55 age, 3.5x higher purchase frequency, 40% higher AOV
```

---

## Step 2: Attribute Selection – What Matters for Similarity?

Not all attributes drive lookalike matching. Select dimensions most predictive of your seed audience's success:

### Demographic Dimensions
- Age, gender, household income, marital status, family size
- Geography (region, metro, urban/rural classification)

### Behavioral Dimensions
- Purchase frequency, last purchase recency, category affinity
- Engagement velocity (pages per session, session frequency)
- Device/channel preference (mobile vs. desktop, email vs. push)

### Transactional Dimensions
- Average order value, customer lifetime value, margin contribution
- Product affinity (which categories/brands they prefer)
- Price sensitivity (discount response rate)

Use `schema_discovery` to inventory available attributes:
```
Tool: schema_discovery(operation="columns", store_type="profile_store")
Result: Lists all 150+ customer attributes; identify which align with seed audience success factors
```

---

## Step 3: Similarity Scoring via Statistical Metrics

The Lookalike Finder uses `feature_analysis` statistical metrics to compare seed audience distributions against the full population:

### Key Statistical Metrics
- **Percentile Ranges**: Seed audiences often occupy the 75th–99th percentile for key metrics
- **Mean/Median Comparison**: How much higher is seed audience average vs. overall population?
- **Distribution Shape**: Are seed audience distributions tight (homogeneous) or spread (heterogeneous)?

Example scoring logic:
```
Attribute: Purchase Frequency
Seed Audience: Mean = 8.2 purchases/year (75th percentile), Std Dev = 2.1
Full Population: Mean = 2.1 purchases/year (50th percentile), Std Dev = 3.5

Prospect Match Score: If prospect's purchase frequency ≥ 75th percentile, +25 points
Further refinement: If prospect is within 1 SD of seed mean, +10 bonus points
```

---

## Step 4: Vertical Reference Playbooks

Industry-specific lookalike strategies vary. Use these vertical templates to guide attribute selection:

### Retail & E-Commerce
**Seed Drivers**: AOV, purchase frequency, category diversity, repeat purchase rate
**Match Dimensions**: Fashion sense (category affinity), price point, seasonality patterns
**Output Confidence Threshold**: 65%+ match

### Gaming & Entertainment
**Seed Drivers**: Lifetime value, session frequency, time-in-app, monetization rate
**Match Dimensions**: Game genre preference, daily active player behavior, in-app purchase propensity
**Output Confidence Threshold**: 70%+ match

### Financial Services & Banking
**Seed Drivers**: Account balance, transaction volume, product diversity, tenure
**Match Dimensions**: Risk profile, income stability, savings rate, investment appetite
**Compliance Note**: Use `schema_discovery(pii)` to exclude PII in lookalike models
**Output Confidence Threshold**: 75%+ match

### Telecom & Media
**Seed Drivers**: Subscriber LTV, ARPU (average revenue per user), churn rate, upsell rate
**Match Dimensions**: Usage intensity, contract tenure, bundle adoption, device ecosystem
**Output Confidence Threshold**: 70%+ match

---

## Step 5: Time-Based Enrichment (Optional)

For more sophisticated lookalike models, use `time_travel` to understand recent behavioral changes in your seed audience:

```
Tool: time_travel(starting_timestamp="2026-02-01", ending_timestamp="2026-03-05",
                  columns=["purchase_count", "engagement_score"],
                  include_statistics=true)
Result: Identify which seed audience attributes changed recently; incorporate velocity signals
```

This reveals behavioral momentum: prospects with rising engagement scores may be more valuable lookalikes than static attributes alone suggest.

---

## Step 6: Output – Expanded Audience Definition

The Lookalike Finder deliverable includes:

1. **Audience Size**: Number of prospects meeting match criteria
2. **Match Confidence Scores**: Ranked by similarity to seed audience
3. **Key Shared Attributes**: Which 3–5 attributes drive matches (transparency for marketer)
4. **Segment Breakdown**: Demographic/behavioral/transactional profile of lookalike audience
5. **Estimated Conversion Lift**: Industry benchmarks for lookalike campaign performance
6. **Activation Channels**: Recommended channels for lookalike audience reach

Example output:
```
Seed Audience: Top 1% Spenders (n=5,000)
Lookalike Audience: 45,000 prospects at 65%+ similarity
Top Matches (Score 75–95): 8,200 prospects (highest conversion potential)
Shared Attributes: Age 35–55, 3+ purchases/year, Electronics category affinity, Urban metro
Est. Conversion Lift vs. Broad Campaign: 2.3x
Recommended Channel: Email (72% match), Paid Social (68% match)
```

---

## Cost & Performance Notes

- **Data Cost**: Lookalike matching scales to your full customer base; use `feature_analysis` on subsets first
- **Typical Execution Time**: 5–15 minutes for audiences up to 1M records
- **Refresh Cadence**: Monthly (seed audience evolves; regenerate lookalike audiences quarterly)

---

## Related Skills

- **cdp-audience-finder**: Discover audiences by first-party behavior without a seed
- **cdp-data-enricher**: Enhance lookalike profiles with additional signals before activation
- **cdp-journey-recommender**: Plan messaging strategy for newly acquired lookalike audience
