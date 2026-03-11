---
name: cdp-audience-finder
description: Translates business goals into CDP audience segments using behavioral and demographic data. THE essential skill for any "find me customers who..." request. Rapidly analyzes customer attributes, distributes populations across meaningful splits, and estimates segment sizes before execution. Use this whenever you need to build a campaign audience, target high-value segments, identify customer groups for retention or acquisition, or explore customer stratification. Pushes users toward data-driven segmentation instead of guesswork.
---

# CDP Audience Finder Skill

## Overview

The **cdp-audience-finder** skill transforms business objectives into actionable, data-backed customer segments. Whether you're launching an acquisition campaign, building a loyalty program, or targeting seasonal shoppers, this skill provides a structured methodology to identify the right customers at scale.

**When to trigger this skill:**
- "Find me customers who..."
- "Build an audience for [campaign]"
- "Segment our customer base"
- "Who should I target for [initiative]?"
- "High-value customers"
- "Frequent buyers"
- "Dormant customers"
- "Lookalike seed definition"

---

## Workflow: From Business Goal to Audience

### Step 1: Clarify Campaign Intent

Start by understanding the marketer's true objective:

| Campaign Type | Key Question | Success Metric |
|---|---|---|
| **Acquisition** | "What types of people should we acquire?" | Customer similarity to best existing segments |
| **Retention** | "Who do we want to keep engaged?" | Engagement level, lifetime value, churn risk |
| **Upsell** | "Who's ready to buy more?" | Product affinity, purchase frequency, category spend |
| **Reactivation** | "Who did we lose?" | Historical engagement, time since last interaction |
| **Seasonal** | "Who buys in Q4?" | Purchase timing patterns, seasonal spend spikes |

### Step 2: Discover Relevant Attributes

Use **schema_discovery(overview)** to understand available data:
- Identify which stores contain customer attributes (profile_store, calculated_attribute, event_store)
- Understand data freshness and coverage

Then use **schema_discovery(columns)** with relevant column names to dive deeper:
- Customer demographics (age, gender, location, income)
- Behavioral signals (purchase frequency, last purchase, category affinity)
- Engagement metrics (email opens, site visits, login frequency)
- Product ownership (subscriptions, bundles, premium features)

### Step 3: Analyze Attribute Distributions

Use **feature_analysis** to understand how customers cluster:

```
Input: columns=["purchase_frequency", "average_order_value", "days_since_purchase", "category_affinity"]
       metric_types=["basic", "statistical", "quality"]
       store_type="profile_store"

Output:
  - fill_rate: % of customers with data (missing data = risky segment)
  - distinct_count: how many unique values (cardinality for segmentation)
  - percentiles: 10th/25th/50th/75th/90th to find segment thresholds
  - is_pii: flag columns that need privacy handling
  - cardinality_category: "low" (good for simple splits) vs "high" (requires binning)
```

**Interpretation Guide:**
- **High fill_rate (>95%)**: Use for core segment definition
- **Low fill_rate (<70%)**: Use only as secondary filter; segment size will shrink
- **Low cardinality**: Natural breakpoints (e.g., membership_tier: bronze/silver/gold)
- **High cardinality numeric**: Use percentile-based binning (top 10%, top 25%, etc.)

### Step 4: Identify Temporal Patterns (If Behavioral Filtering Needed)

Use **time_travel** to detect change patterns over time windows:

```
Example: Find customers declining in engagement
time_travel(
  starting_timestamp="2026-01-05",  # 2 months back
  ending_timestamp="2026-03-05",     # today
  columns=["purchase_count", "total_spend", "login_frequency"],
  change_types=["update_postimage"],  # after-image of changes
  include_statistics=true
)

Output: Shows which customers' behavior changed and how dramatically
```

**Use cases for time_travel:**
- "Purchased in last 30 days" → Find recent activity patterns
- "Declining engagement" → Compare month-over-month behavior deltas
- "Seasonal patterns" → Extract Q4 vs Q1 purchasers
- "Churn signals" → Spot negative behavior trends

### Step 5: Estimate Query Cost & Feasibility

Use **query_builder** with your candidate segment definition:

```
query="SELECT COUNT(*) FROM profile_store
       WHERE purchase_frequency > 12
       AND average_order_value > 100
       AND days_since_purchase < 30"

Output: estimated_cost_usd, data_processed_gb, execution_time_estimate
```

**Decision threshold:**
- < $1 USD: Safe to execute
- $1-5 USD: Acceptable; consider narrowing scope if time-sensitive
- > $5 USD: Optimize (add more filters, use pre-aggregated metrics, consider sampling)

---

## Vertical-Specific Reference Loading

Once you've clarified the business context, load the vertical-specific guide for industry patterns:

### Retail
```
Load: references/retail-guide.md
Focus: RFM segmentation (Recency/Frequency/Monetary), category affinity, seasonality,
       basket size, price sensitivity, brand loyalty
Example: "High-value holiday shoppers" = (spend_Q4 > 75th percentile) +
         (purchase_frequency_Q4 > median) + (category_affinity includes luxury)
```

### Gaming
```
Load: references/gaming-guide.md
Focus: Session length, IAP (in-app purchase) spend, level progression, retention cohorts,
       churn signals (level stagnation, decreasing session time)
Example: "High-LTV players" = (total_iap_spend > 90th percentile) +
         (session_duration > median) + (daily_active_days > 20/30)
```

### Telecom
```
Load: references/telecom-guide.md
Focus: ARPU (average revenue per user), data usage, plan tier, contract status,
       churn signals (ARPU decline, data usage drop)
Example: "Premium postpaid segment" = (plan_tier = premium) +
         (arpu > 50th percentile) + (contract_remaining_months > 6)
```

### BFSI (Banking/Financial Services/Insurance)
```
Load: references/bfsi-guide.md
Focus: Account balance, transaction frequency, product ownership, credit score proxies,
       risk signals (balance decline, closure intent)
Example: "Investment-ready segment" = (account_balance > 75th percentile) +
         (transaction_frequency > median) + (product_count >= 3)
```

### Travel & Hospitality
```
Load: references/travel-guide.md
Focus: Booking frequency, trip length, price point, destination affinity,
       seasonality (summer/winter travelers)
Example: "Luxury vacationers" = (avg_nightly_rate > 90th percentile) +
         (annual_booking_count >= 3) + (trip_duration > 5 nights)
```

### Media & Entertainment
```
Load: references/media-guide.md
Focus: Viewing hours, content diversity, streaming device, premium tier adoption,
       engagement signals (daily active users, content completion rate)
Example: "Core viewers" = (monthly_viewing_hours > median) +
         (content_category_diversity > 5) + (daily_active_days > 20)
```

### Automotive
```
Load: references/automotive-guide.md
Focus: Vehicle ownership, service frequency, parts purchase, financing status,
       lifecycle stage (new owner vs. replacement buyer)
Example: "Service-engaged owners" = (service_visits_12m >= 2) +
         (parts_purchase_value > 50th percentile) + (vehicle_age_months between 12-48)
```

### Healthcare
```
Load: references/healthcare-guide.md
Focus: Appointment frequency, medication adherence, provider switching, condition flags,
       engagement signals (patient portal usage, appointment reminders accepted)
Example: "High-engagement patients" = (appointments_12m >= 3) +
         (medication_refills_on_time > 80%) + (portal_logins_30d > 2)
```

---

## Common Audience Patterns & Definitions

### High-Value Segment (Universal)

**Definition:** Top spenders or most engaged customers
```
Attributes:
  - Spend: 75th+ percentile of total lifetime value OR annual spend
  - Frequency: 50th+ percentile of purchase count
  - Recency: Purchased within last 90 days (recent activity)

Size estimate: ~7% of customer base (top quartile subset)
Recommended channels: Premium email, exclusive offers, VIP program, direct mail
Confidence: HIGH (RFM is proven across industries)
```

### At-Risk Segment

**Definition:** Customers showing decline signals
```
Attributes (from time_travel analysis):
  - Spend decline: 25%+ drop month-over-month
  - Activity decline: 50%+ fewer interactions vs. historical average
  - Recency increase: 3x longer since last interaction
  - Negative signals: Support complaints, plan downgrades, product returns

Size estimate: 5-15% of base (vertical-dependent; gaming has higher churn)
Recommended channels: Win-back email, special retention offer, personal outreach
Confidence: MEDIUM (depends on signal quality; validate with vertical guide)
```

### Seasonal Segment

**Definition:** Customers with spike purchase behavior in specific periods
```
Example (Q4 holidays):
  - Seasonal spend: Q4 spending > 2x Q1-Q3 average
  - Timing: Purchases between Nov 15-Jan 5
  - Category: Gift-oriented purchases OR home/entertainment category spike

Example (Summer travelers):
  - Booking frequency: 2+ bookings June-August
  - Trip characteristics: Destinations in warm climates
  - Advance booking: Books 4+ weeks in advance

Size estimate: 15-30% of base (varies by category)
Recommended channels: Seasonal email campaigns, social ads, retargeting
Confidence: MEDIUM-HIGH (seasonal patterns are predictable but shift year-to-year)
```

### Lookalike Seed Segment

**Definition:** Core customers to use for expansion/modeling
```
Criteria:
  1. Profitability: Contribution margin > 50th percentile
  2. Satisfaction: Return/complaint rate < 5th percentile
  3. Engagement: Repeat purchase rate > 75th percentile
  4. Stability: Customer tenure > 12 months

Attributes to extract for lookalike modeling:
  - Demographics: age_range, location, income_bracket
  - Behavioral: category_affinity, price_sensitivity, channel_preference
  - Psychographic: (if available) interests, values, lifestyle indicators

Size: Typically 100K-500K customers (large enough for model robustness)
Output: Lookalike model seed + attribute profile for modeling teams
Confidence: HIGH (if data quality is strong)
```

### New Customer Lookalike

**Definition:** Prospects matching characteristics of best customers
```
Build from: High-value + new customer seed
Attributes: Extract top 10 demographic/behavioral features from seed
Channels: Acquisition campaigns, paid social, lookalike audiences on ad platforms
Expected CAC reduction: 20-40% vs. untargeted acquisition
Confidence: MEDIUM (depends on ad platform modeling quality)
```

---

## Execution Checklist

- [ ] Clarified campaign goal (acquisition/retention/upsell/reactivation/seasonal)
- [ ] Ran schema_discovery(overview) to confirm data availability
- [ ] Ran schema_discovery(columns) on key attributes
- [ ] Ran feature_analysis to understand distributions (percentiles, fill rates, cardinality)
- [ ] Loaded vertical-specific reference guide
- [ ] Identified key segment thresholds from feature distributions
- [ ] (If behavioral): Ran time_travel to confirm change patterns
- [ ] Ran query_builder to estimate cost
- [ ] Validated segment size is realistic (not <100 customers, not >95% of base)
- [ ] Documented segment definition with business rationale
- [ ] Estimated confidence level and identified data quality risks

---

## Output Format Template

```
AUDIENCE DEFINITION
Name: [Descriptive name, e.g., "Holiday High-Value Shoppers"]
Business Intent: [Campaign goal and expected impact]

SEGMENT CRITERIA
├─ Primary attribute: [e.g., "spend_2025 >= $500"]
├─ Secondary attributes: [e.g., "purchase_frequency >= 5", "days_since_purchase <= 90"]
├─ Temporal constraints: [e.g., "purchased between Nov 15 - Jan 5"]
└─ Exclusions: [e.g., "NOT flagged for churn risk", "NOT in complaints queue"]

SIZE ESTIMATE
├─ Absolute: ~[X] customers
├─ % of base: [Y]%
└─ Trend: [Stable / Growing / Shrinking based on recent cohorts]

KEY ATTRIBUTES (for targeting/messaging)
├─ Average annual spend: $[X]
├─ Average purchase frequency: [Y] purchases/year
├─ Primary category affinity: [Category name]
└─ Preferred channel: [Email / SMS / App / Direct mail]

RECOMMENDED CHANNELS
├─ Primary: [Most effective for segment]
├─ Secondary: [Secondary touchpoint]
└─ Avoid: [Channels known to underperform]

CONFIDENCE LEVEL: [HIGH / MEDIUM / LOW]
├─ Data quality: [% fill rate on key attributes]
├─ Statistical robustness: [Sample size, signal strength]
└─ Risks: [Data gaps, seasonal bias, etc.]

NEXT STEPS
- Validate segment with [X samples]
- Estimate expected response rate: [%]
- Set up audience refresh cadence: [Daily / Weekly / Monthly]
```

---

## Related Skills

- **cdp-churn-finder**: Identify at-risk customers and customers showing decline signals
- **cdp-lookalike-finder**: Expand audiences using lookalike modeling on seed segments
- **cdp-data-enricher**: Layer third-party data (demographic, psychographic) to refine segments
- **cdp-journey-recommender**: Design winback or nurture flows for segmented audiences
