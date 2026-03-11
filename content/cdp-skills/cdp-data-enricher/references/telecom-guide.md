# Telecom Data Enricher Guide

## Overview
Enrichment playbook for telecommunications providers, defining critical service usage attributes, network quality signals, and churn/upgrade predictors.

## Core Enrichment Attributes

### 1. Data Appetite Score

**Definition:** Customer propensity to consume mobile data and readiness for data plan upgrades
**Measurement:** Historical usage patterns and growth trajectory

**Metrics to Calculate:**
- Total data usage (GB) in last 30/60/90 days
- Average monthly data consumption (trend)
- Peak usage month (highest consumption)
- Data usage growth rate (% month-over-month)
- Data usage vs plan allocation (usage ratio: 0-100%)
- Heavy data user flag (>5GB/month, >80% of plan)
- Data usage by time period (weekday vs weekend, peak hours)

**Appetite Scoring:**
- Low appetite: <1GB/month, using <20% of plan
- Medium appetite: 1-3GB/month, using 20-50% of plan
- High appetite: 3-5GB/month, using 50-80% of plan
- Very high appetite: >5GB/month, approaching/exceeding plan limit
- Unlimited ready: Consistently at 80%+ of plan allocation

**Growth Trajectory:**
- Stable: Month-to-month change <10%
- Accelerating: Consistent month-over-month growth
- Declining: Month-over-month decrease

**Data Sources:**
- Usage data warehouse (CDRs - Call Detail Records)
- Plan allocation database
- Network usage logs
- use `feature_analysis` to calculate percentiles

**Enrichment Output:**
- Data appetite tier (1-5 scale)
- Monthly average usage (GB)
- Usage trend direction (stable/growing/declining)
- Plan optimization opportunity (flag for upsell)
- Projected usage next quarter (forecast)

### 2. Device Readiness Index

**Definition:** Customer's device technology level and upgrade propensity
**Dimensions:** Device age, device capabilities, OS version, 5G readiness

**Metrics to Calculate:**
- Device age (months since acquisition)
- Device type (flagship/midrange/budget)
- OS version (current/outdated flag)
- 5G capability (yes/no flag)
- Device storage capacity (GB)
- Device battery health (if tracked)
- Technology generation (1G generations behind current)

**Readiness Calculation:**
- Device age 24+ months: +3 pts (upgrade readiness)
- Device 2+ generations behind: +2 pts
- OS version outdated: +1 pt
- No 5G capability: +1 pt (if 5G network available)
- Device trade-in eligible: +2 pts
- Final readiness score: 1-5 scale

**Device Segments:**
- Premium ready: High-end phone users, early adopters
- Mid-tier upgrade candidate: 18-24 month old devices
- Budget upgrade eligible: 24+ month old budget devices
- Constrained segment: Device payment plans ongoing

**Data Sources:**
- Device management systems
- Handset inventory database
- OS version tracking
- Trade-in eligibility database
- use `schema_discovery` to map device attributes

**Enrichment Output:**
- Device readiness score (1-5)
- Device age (months)
- Trade-in eligibility (yes/no)
- Upgrade opportunity (device segment + timing)
- Financing offer recommendation (if applicable)

### 3. Service Bundle Affinity

**Definition:** Propensity to adopt bundled services (data, voice, SMS, family plans, device protection)
**Bundles Offered:** Single/family plans, data add-ons, premium services, device insurance

**Metrics to Calculate:**
- Current services owned (count)
- Service adoption pattern (sequential or immediate)
- Bundle participation (single service vs bundle)
- Family plan participation (yes/no)
- Add-on service usage (roaming, international, hotspot)
- Service stacking behavior (adoption of 3+ services)

**Affinity Scoring:**
- By service type: Calculate % of eligible customers adopting each
- Bundle readiness: Identify next likely service for individual
- Cross-sell opportunity score: 1-5 scale based on usage patterns
- Family plan propensity: Household size indicators, family plan interest signals

**Data Sources:**
- Service subscription database
- Plan composition records
- Feature usage logs
- Household/account structure data
- use `query_builder` to analyze bundle adoption patterns

**Enrichment Output:**
- Primary services (list)
- Bundle participation status (single/family/premium)
- Next recommended service (based on profile)
- Cross-sell affinity score (1-5)
- Bundle opportunity value estimate ($)

### 4. Network Quality Sensitivity

**Definition:** Customer's quality-of-service (QoS) requirements and network perception
**Dimensions:** Speed requirements, coverage expectations, reliability importance

**Metrics to Calculate:**
- Network complaint history (support tickets related to network)
- Call drop frequency (calls dropped / total calls)
- Data speed experience (measured speeds vs plan speeds)
- Coverage gaps (areas with poor signal)
- Complaint resolution time (if applicable)
- Network switching propensity (history of switching to competitors)
- Premium network feature interest (5G, WiFi calling, etc.)

**Sensitivity Classification:**
- High sensitivity: Multiple complaints, low tolerance
- Medium sensitivity: Occasional issues reported
- Low sensitivity: Minimal complaints, cost-focused

**Quality Signals:**
- Network health score (1-5 based on metrics)
- Coverage adequacy (yes/no flag)
- Speed satisfaction (estimated from usage patterns)
- Reliability score (based on uptime/drops)

**Data Sources:**
- Customer service interaction logs
- Network performance monitoring systems
- Coverage mapping database
- Call quality records (if available)
- use `get_detailed_events` for complaint analysis

**Enrichment Output:**
- Network sensitivity tier (low/medium/high)
- Quality score (1-5)
- Coverage adequacy flag
- Premium network feature recommendation (yes/no)
- Retention risk (if quality declining)

### 5. Roaming Propensity

**Definition:** International travel frequency and roaming service adoption
**Measurement:** Historical roaming usage and projected patterns

**Metrics to Calculate:**
- International roaming activations (frequency per year)
- Roaming data usage (GB during roaming periods)
- Roaming markets (countries visited)
- Travel frequency (trips per year)
- Roaming spend (total cost)
- Roaming plan adoption rate (uses roaming packs)
- Frequent traveler flag (3+ trips/year)

**Roaming Segments:**
- Non-travelers: Zero roaming activity
- Occasional travelers: 1-2 trips/year
- Regular travelers: 3-4 trips/year
- Frequent travelers: 5+ trips/year, significant roaming spend
- Business travelers: Roaming during business hours, high-value markets

**Travel Pattern Analysis:**
- Peak roaming seasons (when travel occurs)
- Preferred roaming destinations (countries)
- Business vs leisure travel (pattern analysis)
- Roaming service adoption likelihood

**Data Sources:**
- Roaming CDR database
- Travel event logs
- Roaming plan subscription history
- use `time_travel` to identify seasonal roaming patterns

**Enrichment Output:**
- Roaming propensity tier (low/medium/high)
- Annual trips estimate (count)
- Preferred roaming destinations (list)
- Roaming plan recommendation (yes/no + type)
- Projected roaming revenue ($)

### 6. Content Consumption Profile

**Definition:** Usage patterns indicating content type preferences and streaming behavior
**Content Types:** Video streaming, music, gaming, social media, messaging

**Metrics to Calculate:**
- Video streaming usage (hours/week, data consumed)
- Music streaming adoption (yes/no flag, hours/week)
- Social media usage (engagement frequency)
- Gaming app usage (hours/week, data/bandwidth)
- Messaging app preference (WhatsApp, WeChat, native SMS)
- Peak usage times (hours of day)
- Data-intensive app adoption rate

**Content Profile Segments:**
- Heavy video users: 5+ GB/month video streaming
- Music focused: High music app usage, moderate data
- Social/messaging: Social app dominant, variable data
- Gaming oriented: Gaming app heavy, high data during gameplay
- Balanced users: Mixed content consumption

**Data Sources:**
- Deep packet inspection (DPI) data (if available)
- Application-level usage logs
- Data category classification
- Network traffic analysis
- use `feature_analysis` for content consumption percentiles

**Enrichment Output:**
- Primary content type (category)
- Secondary content types (list)
- Data consumption breakdown (% by content type)
- Quality of service needs (bandwidth, latency)
- Relevant plan/add-on recommendation

### 7. Family Plan Potential

**Definition:** Propensity to adopt or expand family/multi-user plans
**Dimensions:** Household size, number of active users, family composition

**Metrics to Calculate:**
- Household size (estimated or known)
- Active users per account (number of SIMs/devices)
- Family plan participation (yes/no)
- Secondary line addition frequency (propensity)
- Children in household (inferred from usage patterns)
- Multi-generational household (inferred from device types)
- Family plan penetration (adoption % of eligible households)

**Family Plan Segments:**
- Solo users: Single device, no expansion need
- Couple households: 2-person household, family plan opportunity
- Family with children: 3+ people, growth potential
- Multi-generational: Extended family on single plan
- Currently on family plan: Upsell opportunity (more lines/services)

**Expansion Potential:**
- High potential: Estimated household size > current lines
- Medium potential: May add line in 12-24 months
- Low potential: Content with current setup

**Data Sources:**
- Account structure database
- Billing contact information
- Device registration patterns
- Usage pattern inference
- use `schema_discovery` to map account/user relationships

**Enrichment Output:**
- Family plan participation (yes/no)
- Household size estimate
- Current active users (count)
- Expansion potential (high/medium/low)
- Expected revenue impact of family expansion

### 8. Upgrade Likelihood Score

**Definition:** Propensity to upgrade to higher-tier service plans or premium offerings
**Upgrade Types:** Data plan increase, family plan addition, premium device, international roaming

**Metrics to Calculate:**
- Current plan tier (entry/standard/premium)
- Plan tenure (months on current plan)
- Usage-to-plan ratio (%, indicates room for growth)
- Income proxy (inferred from historical spend)
- Device value (premium vs budget device ownership)
- Service bundle depth (count of services)
- Competitive churn risk (if not upgraded)

**Upgrade Propensity Scoring:**
- Usage growth exceeding plan (high upgrade likelihood)
- Data hits 80%+ monthly (data plan upgrade candidate)
- No family plan + household size >1 (family plan upsell)
- Budget device + high usage (premium device upgrade)
- Entry-tier plan + high satisfaction (premium plan upgrade)

**Final Score (1-5):**
- 5 (Critical upgrade need): Usage near/exceeding limits
- 4 (High probability): Usage trending toward limits
- 3 (Medium probability): Some growth trajectory
- 2 (Low probability): Stable, satisfied usage
- 1 (No upgrade need): Using <50% of plan

**Data Sources:**
- Plan database with tier information
- Usage analytics
- Device inventory
- Spending history
- use `query_builder` for upgrade ROI modeling

**Enrichment Output:**
- Upgrade likelihood score (1-5)
- Recommended upgrade path (plan type + tier)
- Expected upgrade revenue increase ($)
- Timing recommendation (when to offer)
- Retention value if upgraded (churn prevention impact)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 85% for core usage metrics
- Timeliness: Update daily for usage, weekly for device data
- Accuracy: Validate against billing and network systems
- Consistency: Cross-check usage with plan allocations

**MCP Tools Integration:**
- Use `schema_discovery` to map telecom service data structure
- Use `feature_analysis` to compute usage and upgrade scores
- Use `time_travel` to identify seasonal patterns and trends
- Use `get_available_event_types` for roaming and service events

**Enrichment Frequency:**
- Usage metrics: Daily
- Device readiness: Monthly
- Service bundle affinity: Monthly
- Network quality: Weekly
- Roaming propensity: Monthly
- Content profile: Weekly
- Family plan potential: Monthly
- Upgrade likelihood: Weekly

**Output Storage:**
- Store enriched attributes in subscriber_360 table
- Create nightly batch updates
- Maintain historical snapshots quarterly
- Archive scoring rationale for audit

