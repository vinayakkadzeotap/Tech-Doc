# Telecom Audience Finding Guide

## Overview
Telecom segmentation centers on ARPU optimization, service consumption patterns, contract lifecycle management, and technology adoption. Use CDP data to identify upgrade candidates, bundle targets, and churn risks.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- ARPU (Average Revenue Per User) and monthly recurring charges
- Service usage (voice minutes, SMS count, data consumption)
- Plan type (prepaid/postpaid) and contract details
- Device information (model, OS, upgrade eligibility)
- Call detail records (CDR) - roaming, international, network type
- Service subscriptions (OTT bundling, content services, add-ons)
- Customer support interactions (complaint frequency, resolution time)
- Network quality indicators (dropped calls, signal strength complaints)
- Contract renewal dates and payment history
- 5G adoption potential and device compatibility
- Family plan memberships and account relationships
- Number portability status

```
schema_discovery operation: "store", store_type: "event_store"
schema_discovery operation: "columns", columns: ["arpu", "data_usage", "plan_type", "contract_renewal_date"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **ARPU distribution**: Monthly average, trend (increasing/stable/declining)
- **Data consumption**: GB/month by plan type, roaming data usage
- **Usage patterns**: Peak hours, device type distribution
- **Service adoption**: VAS (value-added services) adoption rate
- **Payment health**: Overdue count, payment method preference
- **Network performance**: Complaint frequency, resolution time
- **Contract lifecycle**: Days until renewal, renewal history

```
feature_analysis columns: ["monthly_arpu", "data_consumption_gb", "contract_days_remaining",
  "support_ticket_count", "device_model"],
metric_types: ["basic", "statistical"]
```

## Common Audience Definitions

### 1. Premium ARPU Customers (>$60/month)
**Filter Criteria:**
- Monthly ARPU: >$60
- Tenure: >12 months (mature accounts)
- Payment: On-time for 12+ months
- Service count: 3+ active services/add-ons
- Data usage: >5GB/month
- Churn risk: Low (engagement score >70)

**Expected Size:** 8-12% of base
**Activation:** Premium support tier, exclusive OTT bundles, loyalty rewards, VIP retention programs

### 2. Heavy Data Users (Consumption-Based Targeting)
**Filter Criteria:**
- Data consumption: >10GB/month (top 20%)
- Plan type: Postpaid (stability indicator)
- Usage consistency: Trending upward
- Device: Smartphone (primary)
- Network: 4G/5G capable
- Contract status: Active, 6+ months remaining

**Expected Size:** 12-18% of base
**Activation:** Unlimited data plan upsell, 5G migration, premium network prioritization, content partnerships

### 3. Upgrade Candidates (Device Lifecycle)
**Filter Criteria:**
- Device age: 24+ months (typical upgrade cycle)
- Device capability: 4G/3G (not 5G ready)
- ARPU: >$25 (financially viable)
- Upgrade eligibility: Active, bill-in-good-standing
- Last upgrade: >18 months ago
- Usage: Active (monthly data/voice >baseline)

**Expected Size:** 15-22% of base
**Activation:** Device upgrade offers, trade-in programs, 5G showcase content, financing promotions

### 4. Contract Renewal Window (Re-engagement)
**Filter Criteria:**
- Contract renewal date: 30-90 days away
- Current ARPU: Any (broad segment)
- Renewal history: Previous renewals completed
- Churn risk: Score <50 (at-risk only)
- Service satisfaction: Support resolution >80%
- Alternative availability: In competitive area

**Expected Size:** 8-15% of base (monthly flow)
**Activation:** Contract retention offers, upgrade bundles, loyalty discounts, proactive contact

### 5. International Roaming Users (High-Value Add-On)
**Filter Criteria:**
- Roaming activity: 3+ roaming instances in 6 months
- Roaming duration: >7 days per trip
- Roaming spend: >$20/month additional
- ARPU: Above median
- Travel pattern: Business or leisure regular
- Payment: No roaming bill arrears

**Expected Size:** 5-10% of base
**Activation:** Roaming packages, international pass promotions, partner country offers, travel content

### 6. Churn Risk (High Priority Retention)
**Filter Criteria:**
- Churn risk score: >80 (predictive)
- Usage trend: Declining 30%+ over 3 months
- Support interactions: Increased complaint count
- ARPU: Any, but focus on >$30
- Competitive offers: Recent competitor ad engagement
- Contract status: <3 months until renewal
- Payment: Recent late payment or payment method issue

**Expected Size:** 10-15% of base
**Activation:** Personalized retention offers, executive outreach (high ARPU), plan customization, competitor match

### 7. 5G Ready Adopters
**Filter Criteria:**
- Device: 5G capable (recent models)
- Network availability: 5G coverage in area
- ARPU: >$40 (premium segment)
- Data consumption: >5GB/month
- Technology adoption: Early adopter profile
- Plan type: Postpaid (commitment indicator)
- Payment: Excellent history

**Expected Size:** 15-25% of base
**Activation:** 5G plan migration, premium network access, technology content, 5G device financing

### 8. Family Plan Bundle Candidates
**Filter Criteria:**
- Account holders: 2+ individuals (inferred from usage)
- Shared responsibility: Multiple bill contacts
- ARPU: >$40 (cost-efficiency target)
- Device diversity: Multiple phone models
- Usage pattern: Peak hours different (different users)
- Eligibility: Postpaid accounts only
- Family indicators: Geographic proximity of tower usage

**Expected Size:** 20-30% of base
**Activation:** Family plan bundling, parental control features, family sharing benefits, group discounts

### 9. OTT Service Bundlers (Cross-Sell)
**Filter Criteria:**
- Current subscriptions: 1+ OTT services
- Telecom service: Postpaid (stability)
- ARPU: >$35 (spending capacity)
- Data usage: >5GB/month (content heavy)
- Engagement: Recent content platform usage
- Payment: On-time, preferred payment method stored
- Interest: 2+ OTT categories (music, video, gaming)

**Expected Size:** 25-40% of base
**Activation:** OTT bundles, bundled discounts, tiered partnerships, content recommendations

## Example Audience Queries

### Query 1: Premium ARPU Retention (Renewal Window)
```sql
SELECT customer_id, phone_number, current_plan, monthly_arpu, days_until_renewal,
       support_satisfaction_score, churn_risk_score
FROM customer_accounts
WHERE monthly_arpu > 60
AND days_until_renewal BETWEEN 30 AND 90
AND payment_status = 'good_standing'
AND active_services >= 3
AND tenure_months >= 12
AND churn_risk_score < 50
ORDER BY monthly_arpu DESC, days_until_renewal ASC
```

### Query 2: Heavy Data Users 5G Migration (Upsell)
```sql
SELECT DISTINCT customer_id, phone_number, current_plan, monthly_arpu,
       data_consumption_last_3m, device_model, device_5g_capable, network_type
FROM customer_usage
WHERE data_consumption_last_3m > 10
AND plan_type = 'postpaid'
AND (
  data_consumption_trend = 'increasing'
  OR data_consumption_last_3m > (SELECT AVG(data_consumption_gb) FROM customer_usage) * 1.5
)
AND (device_5g_capable = true OR device_model IN (SELECT model FROM 5g_device_list))
AND account_status = 'active'
ORDER BY data_consumption_last_3m DESC
```

### Query 3: Churn Risk - Competitor Win-Back
```sql
SELECT customer_id, phone_number, current_plan, monthly_arpu, churn_risk_score,
       usage_change_pct_3m, last_support_ticket_date, competitor_engagement_score
FROM customer_profiles
WHERE churn_risk_score > 80
AND monthly_arpu >= 30
AND DATEDIFF(month, last_billing_date, CURRENT_DATE) < 3
AND days_until_contract_renewal <= 90
AND payment_history_last_6m NOT IN ('multiple_late', 'collections')
AND (
  usage_trend = 'declining'
  OR last_support_ticket_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
  OR competitor_engagement_score > 70
)
ORDER BY monthly_arpu DESC, churn_risk_score DESC
```

## Service Activation Channels

| Segment | SMS | Email | IVR | Mobile App | Customer Service | In-Store | Direct Mail |
|---------|-----|-------|-----|-----------|-----------------|----------|-------------|
| Premium ARPU | Low | High | No | High | Very High | Medium | High |
| Heavy Data Users | Medium | High | Low | Very High | Medium | Low | Low |
| Upgrade Candidates | High | High | Medium | Very High | Medium | High | Medium |
| Contract Renewal | Very High | Very High | Medium | High | Very High | Medium | Medium |
| Roaming Users | High | High | Low | Very High | High | Low | No |
| Churn Risk | Very High | Very High | Medium | High | Very High | High | High |
| 5G Ready | Medium | High | Low | Very High | Medium | High | Low |
| Family Plans | High | High | Medium | High | Medium | High | Medium |
| OTT Bundlers | Medium | High | Low | Very High | Medium | Low | Low |

## Contract Lifecycle Management

1. **Pre-Renewal (60 days out)**: Identify at-risk; prepare retention offers
2. **Renewal Window (30 days)**: Execute targeted campaigns by risk/ARPU tier
3. **Post-Renewal (renewal +30)**: High-touch onboarding; confirm satisfaction
4. **Mid-Contract (6 months)**: Cross-sell OTT, device upgrade, data plans
5. **Late Contract (90 days to end)**: Begin renewal planning; identify upgrade hooks

## Tips for Success

1. Use ARPU as primary segmentation; tier offers accordingly
2. Monitor data consumption trends; forecast 5G migration windows
3. Analyze support interaction sentiment; high complaints = churn signal
4. Build device lifecycle calendar; know upgrade windows by model
5. Track contract renewal dates monthly; automate 60-30-0 day workflows
6. Use time_travel to analyze seasonal usage (summer travel, holiday roaming)
7. Model ARPU elasticity by plan type; understand churn price sensitivity
