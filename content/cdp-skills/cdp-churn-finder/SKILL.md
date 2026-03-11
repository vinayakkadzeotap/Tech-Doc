---
name: cdp-churn-finder
description: Identifies customers showing churn signals using behavioral change patterns and historical deltas. THE essential skill for retention work. Uses time_travel to detect declining activity, reduced spend, engagement drops, and other early warning signals. Applies universal churn indicators plus vertical-specific patterns (telecom ARPU decline, gaming session length drop, media viewing hours decrease, etc.). Output is risk-scored customer list with recommended interventions and days-to-churn estimates. Use whenever asked "who's leaving?", "at-risk customers", "retention opportunities", or "reduce attrition".
---

# CDP Churn Finder Skill

## Overview

The **cdp-churn-finder** skill identifies customers in active decline before they actually churn. By analyzing behavioral changes, engagement drops, and spending patterns over time, this skill surfaces customers at risk and prioritizes them for retention campaigns.

**When to trigger this skill:**
- "Who's leaving?"
- "Churn risk"
- "At-risk customers"
- "Retention opportunities"
- "Who should we win back?"
- "Reduce attrition"
- "Customer loss prevention"
- "About to cancel"

---

## Churn Detection Methodology

Churn is not a single event—it's a journey. Customers show measurable behavioral changes weeks or months before they formally leave. This skill detects that journey.

### Core Approach: The Three-Step Detection Process

#### Step 1: Define Historical Baseline (30+ Days Ago)

Use **time_travel** to capture customer behavior in a stable period:

```
time_travel(
  starting_timestamp="2025-12-05",  # 90 days back
  ending_timestamp="2026-01-04",     # 60 days back
  columns=["purchase_count", "total_spend", "login_frequency",
           "support_tickets", "engagement_score"],
  include_statistics=true
)

Output: Baseline metrics for comparison
  - Average purchase count: X per month
  - Average spend: $Y per month
  - Average logins: Z per month
  - Baseline engagement profile
```

#### Step 2: Capture Recent Behavior (Last 30 Days)

```
time_travel(
  starting_timestamp="2026-02-05",  # last 30 days
  ending_timestamp="2026-03-05",
  columns=["purchase_count", "total_spend", "login_frequency",
           "support_tickets", "engagement_score"],
  change_types=["update_postimage"],  # capture current state
  include_statistics=true
)

Output: Recent behavior snapshot for delta analysis
```

#### Step 3: Analyze Behavioral Deltas & Risk Scoring

Use **feature_analysis** to understand which attributes correlate with churn risk:

```
feature_analysis(
  columns=["purchase_count_delta", "spend_delta", "login_frequency_delta",
           "support_ticket_increase", "engagement_score_decline"],
  metric_types=["basic", "statistical", "quality"],
  store_type="calculated_attribute"
)

Output:
  - Correlation with churn events (if historical data available)
  - Distribution of decline metrics (percentiles for risk scoring)
  - Data quality flags (missing values indicate incomplete customer engagement)
  - Cardinality: single-value columns (e.g., "churned=1") are strong signals
```

**Risk Score Calculation:**
```
churn_risk_score = (
  (baseline_purchase_count - recent_purchase_count) / baseline_purchase_count * 0.35
  + (baseline_spend - recent_spend) / baseline_spend * 0.35
  + (baseline_logins - recent_logins) / baseline_logins * 0.20
  + support_ticket_increase_flag * 0.10
)

Risk Tiers:
  - 0.70-1.00: CRITICAL (churn likely within 14 days)
  - 0.50-0.69: HIGH (churn likely within 30 days)
  - 0.30-0.49: MEDIUM (churn likely within 60 days)
  - 0.10-0.29: LOW (monitor; early warning stage)
  - <0.10: STABLE (no immediate concern)
```

---

## Universal Churn Signals (Apply to All Verticals)

### 1. Decreasing Activity Frequency

**Signal:** Customer interactions (logins, purchases, site visits, API calls) drop significantly.

```
Detection:
  last_30d_interactions < (baseline_interactions * 0.5)
  OR days_since_last_interaction > (2x historical average)

Example metrics:
  - Gaming: Daily active days < 10 (vs. historical average of 20)
  - E-commerce: Purchases < 1 per month (vs. historical 3x/month)
  - Media: Logins < 5 per week (vs. historical 10x/week)
  - SaaS: API calls < 100/day (vs. historical 500/day)
  - Telecom: Usage days < 25/month (vs. historical 29/month)
```

**Urgency:** HIGH - Activity drop is the #1 predictor of churn across all industries.

### 2. Decreasing Monetary Value

**Signal:** Spending, revenue, or transaction size drops significantly.

```
Detection:
  last_30d_revenue < (baseline_revenue * 0.5)
  OR average_transaction_value < (baseline_atv * 0.7)

Example metrics:
  - Retail: Monthly spend < $50 (vs. historical $200+)
  - Subscription: Billing amount < base tier (downgrade detected)
  - Gaming: Monthly IAP < $10 (vs. historical $50+)
  - BFSI: Account balance decline > 30% (withdrawal pattern)
  - Telecom: ARPU < historical ARPU * 0.7
```

**Urgency:** CRITICAL - Revenue drop is often final stage of churn journey.

### 3. Increasing Time Between Interactions

**Signal:** Gaps between customer actions are growing (dormancy pattern).

```
Detection:
  average_days_between_purchases > (baseline * 1.5)
  OR days_since_last_interaction > (90th percentile of historical gaps)

Example metrics:
  - E-commerce: Previously bought every 20 days → now every 45 days
  - Gaming: Previously logged in every 2 days → now every 7 days
  - Media: Previously watched every day → now every 3 days
  - SaaS: Previously logged in every weekday → now 1x per week
```

**Urgency:** MEDIUM-HIGH - Growing dormancy often precedes hard churn.

### 4. Support/Complaint Activity Increase

**Signal:** More support tickets, negative NPS, complaints, or refund requests.

```
Detection:
  support_tickets_30d > (historical average * 2)
  OR complaint_count > 0 (if historically 0)
  OR refund_rate > (baseline * 1.5)
  OR nps_score_decline > 20 points

Example scenarios:
  - Product quality issues (returns, complaints, app crashes)
  - Billing disputes (unexpected charges, confusion)
  - Account access issues (password resets, locked accounts)
  - Service downtime impact (frustrated by outages)
```

**Urgency:** MEDIUM - Support friction increases churn probability by 5-10x.

### 5. Downgrade or Right-Sizing Signals

**Signal:** Customer changes to lower-tier plan, fewer features, or reduced commitment.

```
Detection:
  product_tier < historical_tier
  OR feature_count_current < feature_count_3m_ago
  OR contract_value_renewal < contract_value_current
  OR cancellation_notice_submitted = true

Example scenarios:
  - Premium → Standard tier migration
  - Annual → Monthly contract downgrade
  - Bundle → Single product (removing SKUs)
  - Subscription pause or hold initiated
```

**Urgency:** CRITICAL - Downgrade is often churn in slow-motion.

---

## Vertical-Specific Churn Patterns

### Telecom

**Load:** references/telecom-guide.md

**Key signals:**
- ARPU decline: Monthly revenue drops >20% (voice/SMS/data bundle erosion)
- Data usage drop: Monthly usage < 50% of historical (customer finding alternatives)
- Plan downgrade: Switching from premium tier to basic (cost-consciousness)
- Contract renewal: Customer not renewing annual contract (defection signal)
- Network performance: Complaint volume spikes (service quality issues)
- Roaming behavior: Reduced roaming/international usage (travel pattern change)

**Example churn risk definition:**
```
TELECOM_CHURN_RISK = (
  (baseline_arpu - recent_arpu) / baseline_arpu > 0.25  [0.30 weight]
  + (baseline_data_usage - recent_data_usage) / baseline_data_usage > 0.30  [0.30 weight]
  + (support_tickets_30d > baseline * 2)  [0.20 weight]
  + (contract_renewal_date < 30 days AND not_renewed)  [0.20 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 30-60 days
```

### Media & Entertainment

**Load:** references/media-guide.md

**Key signals:**
- Viewing hours decline: Monthly engagement < 50% of historical (content not resonating)
- Content diversity drop: Watching fewer genres/categories (disengagement)
- Device diversity decline: Using only one device vs. multi-device (reduced engagement)
- Binge completion rate: Fewer complete series watched (retention declining)
- Premium tier downgrade: Dropping from premium to basic (cost-driven)
- Re-engagement failure: Targeted offers not driving returns (customer lost interest)

**Example churn risk definition:**
```
MEDIA_CHURN_RISK = (
  (baseline_monthly_hours - recent_monthly_hours) / baseline_monthly_hours > 0.40  [0.35 weight]
  + (genre_count_recent < genre_count_3m_ago)  [0.25 weight]
  + (series_completion_rate < historical_rate * 0.6)  [0.20 weight]
  + (tier_downgrade = true)  [0.20 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 14-30 days
```

### Gaming

**Load:** references/gaming-guide.md

**Key signals:**
- Session length decrease: Average session time < 50% of historical (engagement drop)
- IAP (in-app purchase) stop: $0 spend for 30+ days (monetization cliff)
- Login frequency collapse: Daily active user → occasional player (dormancy)
- Level stagnation: No level progression in 60+ days (progression block or frustration)
- Tier downgrade: VIP → Standard (cost reduction)
- Negative feedback: Low app store ratings, complaint spike (product quality issue)

**Example churn risk definition:**
```
GAMING_CHURN_RISK = (
  (baseline_session_minutes - recent_session_minutes) / baseline_session_minutes > 0.50  [0.25 weight]
  + (iap_spend_30d = 0 AND baseline_iap > 0)  [0.30 weight]
  + (daily_active_days_recent < 10)  [0.25 weight]
  + (level_progression_days > 60)  [0.20 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 7-21 days
```

### BFSI (Banking/Financial Services/Insurance)

**Load:** references/bfsi-guide.md

**Key signals:**
- Account balance reduction: Total balance declining >30% over 30 days (withdrawal pattern)
- Transaction frequency decline: Monthly transactions < 50% of historical (disengagement)
- Product closure: Customer closing accounts/canceling policies (formal exit signal)
- Cross-sell failure: Declining to upsell or upgrade offers (reduced engagement)
- Competitor interaction: Customer opening accounts elsewhere (detected via data append)
- Credit behavior change: Late payments, missed payments (financial stress)

**Example churn risk definition:**
```
BFSI_CHURN_RISK = (
  (baseline_balance - recent_balance) / baseline_balance > 0.30  [0.30 weight]
  + (baseline_transaction_count - recent_transaction_count) / baseline_transaction_count > 0.40  [0.30 weight]
  + (product_closure_initiated = true)  [0.25 weight]
  + (late_payment_flag = true OR missed_payment_flag = true)  [0.15 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 30-90 days
```

### Subscription & SaaS

**Load:** references/subscription-guide.md

**Key signals:**
- Usage decline: API calls, active users, feature usage < 50% of baseline (feature adoption problem)
- Engagement drop: Logins, session frequency < baseline (disengagement)
- Support escalation: Increase in support tickets or escalations (product satisfaction issue)
- Utilization collapse: Provisioned vs. actual usage ratio shrinks (over-provisioned)
- Trial-to-paid conversion failing: Free tier → non-conversion on renewal (product-market fit issue)
- Billing churn: Failed payment attempts, payment method changes (payment friction)

**Example churn risk definition:**
```
SAAS_CHURN_RISK = (
  (baseline_api_calls - recent_api_calls) / baseline_api_calls > 0.40  [0.35 weight]
  + (baseline_logins - recent_logins) / baseline_logins > 0.50  [0.30 weight]
  + (support_tickets_30d > baseline * 3)  [0.20 weight]
  + (failed_payment_attempts > 0)  [0.15 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 14-45 days
```

### Retail & E-commerce

**Load:** references/retail-guide.md

**Key signals:**
- Purchase frequency collapse: Buys < 1x per month (vs. historical 4-5x)
- Average order value decline: AOV < 70% of historical (budget-conscious shift)
- Category abandonment: Stops buying from previously favored categories
- Browser abandonment: Cart abandonment rate spikes; price sensitivity increases
- Seasonal non-engagement: Misses seasonal peak (e.g., no holiday purchases)
- Negative review or return: Product return, negative feedback (satisfaction drop)

**Example churn risk definition:**
```
RETAIL_CHURN_RISK = (
  (baseline_purchase_frequency - recent_frequency) / baseline_frequency > 0.50  [0.35 weight]
  + (baseline_aov - recent_aov) / baseline_aov > 0.30  [0.35 weight]
  + (category_count_recent < category_count_historical)  [0.15 weight]
  + (return_rate_recent > historical_return_rate * 2)  [0.15 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 30-90 days
```

### Healthcare

**Load:** references/healthcare-guide.md

**Key signals:**
- Appointment frequency decline: Scheduled visits < historical rate (patient disengagement)
- Medication adherence drop: Refills not being requested (treatment abandonment or provider switch)
- Provider switching: Visits to competing providers increase (seeking alternatives)
- Preventive care avoidance: Skipping routine checkups (cost-driven or satisfaction issue)
- Patient portal disuse: Portal logins drop to zero (disconnection from care team)
- Complaint escalation: Complaint count or satisfaction score decline (care quality issue)

**Example churn risk definition:**
```
HEALTHCARE_CHURN_RISK = (
  (baseline_appointments_12m - recent_appointments_6m * 2) / baseline_appointments_12m > 0.40  [0.30 weight]
  + (medication_refill_rate < historical_refill_rate * 0.7)  [0.30 weight]
  + (portal_login_frequency < 1x per month)  [0.20 weight]
  + (complaint_or_escalation_flag = true)  [0.20 weight]
)
Risk_Score = 0.70+ → days_to_churn_estimate: 60-120 days
```

---

## Execution Checklist

- [ ] Clarified definition of "churn" for your vertical (cancel subscription? No login for 90 days? Formal closure?)
- [ ] Ran schema_discovery(overview) to identify available behavioral stores
- [ ] Ran time_travel for baseline period (e.g., 2 months back, 1-month window)
- [ ] Ran time_travel for recent period (e.g., last 30 days)
- [ ] Calculated behavioral deltas (baseline vs. recent)
- [ ] Ran feature_analysis on change metrics to understand distributions
- [ ] Loaded vertical-specific reference guide and identified key signals
- [ ] Calculated churn_risk_score for all customers
- [ ] Segmented into risk tiers (CRITICAL / HIGH / MEDIUM / LOW)
- [ ] Estimated days_to_churn_estimate for each tier
- [ ] Validated against historical churn events (if available)
- [ ] Identified recommended interventions per tier

---

## Output Format Template

```
CHURN RISK REPORT
Generated: [Date]
Analysis Period: Baseline [dates] vs. Recent [dates]

EXECUTIVE SUMMARY
├─ Total at-risk customers: [X]
├─ Critical risk (churn imminent): [X] customers
├─ High risk (30-day window): [X] customers
├─ Medium risk (60-day window): [X] customers
└─ Trend: [Increasing / Stable / Decreasing] vs. last period

RISK TIER BREAKDOWN

CRITICAL RISK (Churn in 7-14 days)
├─ Count: [X] customers
├─ Key signals: [3-5 behavioral indicators]
├─ Days to churn estimate: 7-14 days
├─ Average customer LTV: $[X]
├─ Recommended intervention: Immediate outreach (phone/email/SMS)
│  └─ Retention offer: [Discount / Free trial / Concierge service]
│  └─ Messaging: [Focus on pain point resolution]
└─ Expected win-back rate: [X]% (based on offer type)

HIGH RISK (Churn in 30 days)
├─ Count: [X] customers
├─ Key signals: [3-5 behavioral indicators]
├─ Days to churn estimate: 15-30 days
├─ Average customer LTV: $[X]
├─ Recommended intervention: High-touch email + SMS campaign
│  └─ Sequence: [Day 0: Alert, Day 3: Offer, Day 7: Follow-up]
│  └─ Messaging: [Re-engagement focus]
└─ Expected win-back rate: [X]%

MEDIUM RISK (Churn in 60 days)
├─ Count: [X] customers
├─ Key signals: [3-5 behavioral indicators]
├─ Days to churn estimate: 30-60 days
├─ Average customer LTV: $[X]
├─ Recommended intervention: Nurture campaign + content engagement
│  └─ Channel: Email [frequency/cadence]
│  └─ Content: [Product feature highlights, success stories, tips]
└─ Expected win-back rate: [X]%

SIGNAL ANALYSIS

Top 5 Churn Indicators (by correlation strength):
1. [Signal]: [X]% of churned customers had this signal
2. [Signal]: [X]% of churned customers had this signal
3. [Signal]: [X]% of churned customers had this signal
4. [Signal]: [X]% of churned customers had this signal
5. [Signal]: [X]% of churned customers had this signal

CUSTOMER SEGMENT INSIGHTS

By vertical pattern:
├─ [Pattern type] churn: [X] customers (e.g., "ARPU decline")
├─ [Pattern type] churn: [X] customers (e.g., "Engagement collapse")
└─ [Pattern type] churn: [X] customers (e.g., "Support escalation")

By product/service:
├─ [Product X]: [X] at-risk customers
├─ [Product Y]: [X] at-risk customers
└─ [Product Z]: [X] at-risk customers

DATA QUALITY

├─ Fill rate on key signals: [X]% (if <70%, reduce confidence)
├─ Outliers or data anomalies: [Describe any issues]
└─ Confidence level: [HIGH / MEDIUM / LOW]

NEXT STEPS
1. Execute retention campaigns per risk tier
2. Monitor intervention response: [Metrics to track]
3. Refresh analysis: [Weekly / Bi-weekly / Monthly]
4. Validate churn predictions against actual churn events
5. Iterate model based on win-back success rates
```

---

## Related Skills

- **cdp-audience-finder**: Build retention segments from churn risk tiers (e.g., "save high-LTV at-risk customers")
- **cdp-journey-recommender**: Design win-back and retention nurture flows for at-risk customers
- **cdp-data-enricher**: Append external signals (competitor activity, job changes) to enhance churn detection
- **cdp-audience-finder** (reactivation): Identify "hard churned" customers suitable for reactivation campaigns
