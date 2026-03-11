---
name: telecom-marketing-suite
description: Entry point for telecom, mobile carriers, ISP, and broadband marketing. Orchestrates subscriber lifecycle strategies from acquisition through plan optimization and churn prevention. Handles subscriber segmentation by plan type, device upgrades, data usage patterns, roaming behavior, and network quality tiers. Routes users to core CDP skills (audience-finder, churn-finder, lookalike-finder, data-enricher, data-analyzer, journey-recommender) with telecom-specific context and KPI frameworks for ARPU, MOU, churn, plan upgrade rates, and network utilization metrics.
---

# Telecom Marketing Suite

The Telecom Marketing Suite is your orchestrator for mobile carriers, ISPs (Internet Service Providers), and broadband marketing within Zeotap CDP. Whether you're preventing subscriber churn, optimizing plan upgrade campaigns, launching device promotions, or analyzing data usage patterns, this skill routes you to the right CDP capabilities with telecom-specific guidance.

## When to Use This Skill

**Trigger Keywords:** subscribers, plans, ARPU, MOU (minutes of use), data usage, churn, SIM, device upgrade, postpaid, prepaid, network, 5G, broadband, connection quality, roaming, contract renewal, device launch, network expansion, customer retention.

**Common Scenarios:**
- Prevent high-value subscriber churn
- Create plan upgrade segments (3G → 4G → 5G)
- Optimize device upgrade timing & offers
- Analyze data usage patterns for personalization
- Identify contract renewal windows
- Launch new 5G plan acquisition campaigns
- Reduce roaming revenue leakage
- Win back lapsed subscribers

## Subscriber Lifecycle Marketing

### 1. Acquisition Phase
**Objective:** Acquire new subscribers, maximize net adds
- **Timing:** Device launch windows, carrier promotions, back-to-school, holiday gifting
- **Audience strategy:** Lookalike audiences (based on high-value subscribers), competitive switching, new device buyers
- **Key metric:** SAC (Subscriber Acquisition Cost), first-month ARPU, new subscriber retention
- **Route to:** `cdp-lookalike-finder` (find profiles similar to valuable subscribers)

### 2. Activation & Plan Selection Phase
**Objective:** Activate service, assign optimal plan, establish usage patterns
- **Timing:** First 30 days post-activation
- **Audience strategy:** New subscribers by device type, data usage tier, geographic location
- **Key metrics:** Plan tier distribution, initial data usage, first MOU levels
- **Route to:** `cdp-audience-finder` (segment by usage profile), `cdp-data-enricher` (device type, location)

### 3. Usage & Growth Phase
**Objective:** Increase ARPU through upsell, encourage data consumption
- **Timing:** Months 2-6 (establish usage patterns)
- **Audience strategy:** Sub-plan subscribers (upgrade potential), light data users (expansion), heavy data users (family plans)
- **Key metrics:** Data usage growth, plan tier upgrade rate, add-on service adoption
- **Route to:** `cdp-data-analyzer` (usage pattern analysis), `cdp-audience-finder` (upsell candidates)

### 4. Optimization & Loyalty Phase
**Objective:** Maximize customer lifetime value, establish long-term loyalty
- **Timing:** Months 7-12+ (beyond contract)
- **Audience strategy:** High-ARPU subscribers, multi-device households, loyalty program members
- **Key metrics:** CLTV, churn rate, add-on service penetration, roaming usage
- **Route to:** `cdp-churn-finder` (identify at-risk), `cdp-audience-finder` (loyalty tiers)

### 5. Plan Optimization Phase
**Objective:** Right-size plans, prevent overages, increase margin efficiency
- **Timing:** Usage bill review cycles, contract renewal windows
- **Audience strategy:** Over-consuming subscribers (upgrade), under-utilizing subscribers (downgrade), fixed-usage patterns
- **Key metrics:** Plan efficiency ratio, overage charges, plan downgrade churn
- **Route to:** `cdp-data-analyzer` (usage pattern matching), `cdp-audience-finder` (plan tier fit)

### 6. Device Upgrade & Retention Phase
**Objective:** Upgrade devices, refresh subscriber commitment, prevent switching
- **Timing:** Contract renewal windows, device launch announcements, trade-in offers
- **Audience strategy:** Eligible for upgrade (contract age), premium device interest, trade-in candidates
- **Key metrics:** Device upgrade rate, upgrade revenue, post-upgrade churn reduction
- **Route to:** `cdp-audience-finder` (upgrade eligibility), `cdp-churn-finder` (retention)

### 7. Churn Prevention & Reactivation Phase
**Objective:** Identify at-risk subscribers, prevent churn, reactivate dormant
- **Timing:** Continuous monitoring, reactivation campaign windows
- **Audience strategy:** Usage decline (data, voice), billing issues, competitor activity, lapsed subscribers
- **Key metrics:** Churn rate, reactivation rate, save rate from churn prevention
- **Route to:** `cdp-churn-finder` (identify at-risk early), `cdp-journey-recommender` (win-back campaigns)

## Skill Routing Guide

### Scenario Examples

**"Prevent churn - who's likely to leave in the next 60 days?"**
→ Use **cdp-churn-finder** to identify: declining ARPU, dropping data usage, roaming cost sensitivity, service complaint history, contract age approaching expiration. Focus on high-value subscribers (ARPU > $50/month).

**"Build segments for a 5G plan upgrade campaign"**
→ Use **cdp-audience-finder** to segment: 4G LTE current subscribers, device 5G-capable (check eligibility), high data usage (>5GB/month), premium tier customers. Create tiers: early adopter, heavy user, price-sensitive.

**"Find subscribers like our best ones to acquire"**
→ Use **cdp-lookalike-finder** with high-ARPU, low-churn subset (ARPU $60+, 24+ month tenure, contract renewable). Define lookalikes by: demographic, device preference, data usage tier, geographic area, competitor footprint.

**"Why is data usage declining? Analyze patterns"**
→ Use **cdp-data-analyzer** to compare cohorts: this month's data users vs. 3 months ago by: age, location, plan tier, device type, network quality (5G availability), service outages, competitor launches, seasonal factors.

**"Create device upgrade offer segments based on eligibility"**
→ Use **cdp-audience-finder** with filters: contract end date approaching (within 30 days), last upgrade 24+ months ago, premium device interest (based on browsing), trade-in value score. Design offers by: device cost, upgrade discount, loyalty bonus.

**"Identify roaming revenue leakage - who's traveling but not roaming?"**
→ Use **cdp-data-analyzer** to find: geographic data (GPS/location signals), billing address different from usage location, no roaming charges recorded. Segment: business travelers, vacation users, immigrating subscribers. Route to: targeted roaming plan offers.

**"Optimize plan tier fit - who's over/under-utilizing?"**
→ Use **cdp-data-analyzer** to identify: over-consumers (hitting limits, paying overages), under-consumers (using <20% of data allowance). Right-size: upgrade over-consumers (save overage pain), downgrade under-consumers (reduce customer CAC burden), offer shared/family plans.

## Telecom Campaign Playbook

### Device Launch Campaigns
- Timing: 2-4 weeks pre-launch (pre-order), launch day, 6-8 weeks post (early majority)
- Segments: Premium device buyers, contract-eligible, trade-in candidates
- KPI: Device upgrade rate, ARPU impact, churn prevention

### Plan Upgrade Campaigns
- Timing: Usage-based (exceeding threshold), contract renewal, seasonal data surge
- Segments: Postpaid tier subscribers (growth potential), heavy data users, travelers
- KPI: Tier upgrade rate, ARPU growth, plan efficiency

### Churn Prevention Campaigns
- Timing: Real-time (usage decline signal), periodic (contract near-end), seasonal
- Segments: High-value at-risk, service satisfaction decline, competitor marketing exposure
- KPI: Save rate, retention improvement, CLTV preservation

### Network Expansion Campaigns (5G, Broadband)
- Timing: Post-network launch (coverage area expansion), competitive threat
- Segments: Existing 4G subscribers, new market entrants, fixed-line to mobile switchers
- KPI: Technology adoption rate, ARPU lift, churn reduction

## Key Telecom KPIs

Load **kpi-glossary.md** for complete definitions, formulas, and benchmarks:

| KPI | Definition | Business Impact |
|-----|-----------|-----------------|
| **ARPU** | Average Revenue Per User | Revenue per subscriber |
| **MOU** | Minutes of Use | Voice usage intensity |
| **Data Usage** | GB per subscriber | Data consumption patterns |
| **Churn Rate** | % subscribers lost monthly | Retention & sustainability |
| **SAC** | Subscriber Acquisition Cost | Acquisition efficiency |
| **CLTV** | Customer Lifetime Value | Long-term profitability |
| **NPS** | Net Promoter Score | Customer satisfaction |
| **Plan Upgrade Rate** | % moving to premium plans | Revenue growth |
| **Device Upgrade Rate** | % eligible completing upgrade | Device cycle revenue |
| **Roaming Revenue** | International usage revenue | Geographic expansion |

## Common Telecom Use Case Matrix

| Use Case | Primary Skill | Secondary Skill | Reference |
|----------|---------------|-----------------|-----------|
| Device upgrade audience | cdp-audience-finder | cdp-data-enricher | kpi-glossary.md (device cycle) |
| Churn prevention (high-value) | cdp-churn-finder | cdp-data-analyzer | kpi-glossary.md (ARPU) |
| 5G adoption campaign | cdp-lookalike-finder | cdp-audience-finder | seasonal-calendar.md (launch cycles) |
| Plan tier optimization | cdp-data-analyzer | cdp-audience-finder | kpi-glossary.md (data usage) |
| Roaming monetization | cdp-audience-finder | cdp-data-enricher | seasonal-calendar.md (travel patterns) |
| Contract renewal campaigns | cdp-audience-finder | cdp-churn-finder | kpi-glossary.md |
| Service quality impact analysis | cdp-data-analyzer | cdp-journey-recommender | kpi-glossary.md |
| Broadband cross-sell | cdp-audience-finder | cdp-data-enricher | seasonal-calendar.md |

## Network & Technology Segments

### Technology Adoption Tiers
- **5G Leaders:** 5G-capable device, in 5G coverage, enrolled in 5G plans
- **4G Core:** 4G-only device or 5G-capable but not activated
- **3G Dormant:** Legacy 3G-capable device, declining usage (migration risk)
- **Fixed-line Candidates:** Home broadband in coverage, no wireless device

### Data Consumption Tiers
- **Light users:** <500MB/month (rural, voice-focused, prepaid)
- **Standard users:** 500MB-2GB/month (typical smartphone users)
- **Heavy users:** 2-10GB/month (video streamers, content creators)
- **Ultra-heavy users:** 10GB+/month (power users, business/professional)

### Usage Pattern Segments
- **Business users:** High MOU during weekdays, data spike at work hours
- **Casual users:** Even distribution, lower MOU/data overall
- **Travelers:** High roaming charges, usage spikes aligned with destination
- **Social media creators:** High data, trending times (evening), minimal voice

## Reference Files

- **seasonal-calendar.md** - Telecom event calendar (device launches, contract renewal windows, network expansion, travel seasons), acquisition moments, churn prevention windows
- **kpi-glossary.md** - Detailed KPI definitions, formulas, industry benchmarks, network metrics, data consumption analysis

## Contract Management Framework

### Contract Lifecycle Stages
1. **Pre-contract (30 days before):** Identify good/bad experiences, pre-churn signals
2. **In-contract:** Focus on ARPU growth, usage optimization, loyalty
3. **Renewal window (0-30 days):** Churn prevention, upgrade incentives, retention offers
4. **Post-contract (30+ days):** Loyalty program, automatic renewal triggers, reactivation

### Churn Prevention by Lifecycle
- **Early tenure (0-3 months):** Onboarding quality, plan fit (most vulnerable)
- **Growth period (4-12 months):** Service quality, ARPU optimization, loyalty building
- **Maturity (12+ months):** Network quality, competitive pressure, device upgrade timing
- **High-tenure (24+ months):** Relationship fatigue, better offer competitors, price sensitivity

## Next Steps

1. **Identify your campaign objective** - Acquisition? Retention? Churn prevention? Plan upgrade? Device promotion?
2. **Load the appropriate reference** - Use seasonal-calendar.md for timing, kpi-glossary.md for metrics
3. **Select your skill** - Route to the orchestrator suggested in the matrix above
4. **Define your segments** - Use technology/data/usage tier frameworks and CDP skills
5. **Measure & iterate** - Track the telecom-specific KPIs relevant to your campaign

---

**Advanced Features:**
- Network quality impact analysis: Correlate service outages/quality with churn
- Roaming optimization: Identify untapped roaming revenue opportunities
- Plan efficiency modeling: Right-size plans to reduce churn from inadequate/excessive plans
- Device upgrade lifecycle: Predict upgrade timing and optimal device recommendations

**Questions?** Check the reference files or escalate to a Data Scientist for network quality modeling, propensity-to-churn prediction, or device upgrade timing optimization.
