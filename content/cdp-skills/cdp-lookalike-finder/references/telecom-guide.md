# Telecom Lookalike Finder Guide

## Overview
Telecom lookalike audiences target customers with similar usage patterns, service preferences, and value profiles. This guide addresses data consumption, plan tier affinity, and behavioral matching for efficient customer acquisition.

## Key Similarity Dimensions

### Usage Pattern Matching

**Data Usage Patterns**
- Monthly data consumption baseline (GB/month)
- Usage consistency (stable vs seasonal)
- Usage growth trajectory (increasing/declining)
- Peak usage hours and days
- Off-network usage (roaming, international)

**Voice & Messaging Behavior**
- Average monthly voice minutes
- Call frequency and duration patterns
- SMS volume and type (personal vs transactional)
- International calling patterns
- Video call usage (if available)

**Network Dependency**
- Network accessibility requirements (coverage expectations)
- Uptime criticality (business vs casual)
- Speed requirements (streaming vs browsing)
- Concurrent connection needs
- Geographic coverage needs

### Service Tier & Product Affinity

**Plan Type Preference**
- Prepaid vs postpaid alignment
- Plan tier level (basic, mid, premium)
- Bundled services (broadband, TV, insurance)
- Specialized plans (business, student, senior)
- Contract length preference

**Add-on Service Adoption**
- Premium network features (5G, priority data)
- Entertainment add-ons (streaming bundles)
- Insurance/protection products
- International roaming packs
- Device upgrade programs

**Premium Feature Adoption**
- High-speed data tier utilization
- Unlimited vs metered plan preference
- Priority traffic management
- Device protection services
- Family plan participation

### Device & Technology Behavior

**Device Type**
- Primary device category (smartphone, tablet, IoT)
- Device brand loyalty (Apple, Samsung, others)
- Device upgrade frequency
- Device performance tier (budget to flagship)
- Device financing adoption (installment plans)

**Technology Adoption**
- 5G adoption readiness
- Dual SIM usage
- Mobile wallet adoption
- App-based service usage
- OTT service consumption

### Commercial Behavior

**Payment Behavior**
- Payment method preference (autopay, manual)
- Payment consistency (on-time payment rate)
- Payment failure history
- Billing friction indicators
- Credit health proxy (payment score)

**Spending Level**
- Monthly ARPU range
- Spending consistency
- Spending growth trajectory
- High-margin service propensity
- Price sensitivity indicators

**Engagement Patterns**
- Channel preference (app, web, store, phone)
- Support contact frequency
- Complaint escalation patterns
- Feature exploration (trying new services)
- Loyalty program participation

### Geographic & Demographic Signals

**Geographic Clustering**
- Primary usage location(s)
- Urban vs suburban vs rural patterns
- Regional service preference variations
- Roaming destination patterns
- Coverage importance by region

**Demographic Alignment**
- Age group indicators
- Household composition signals
- Income level proxy
- Business vs consumer usage
- Geographic region cultural patterns

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- monthly_data_usage_gb
- monthly_voice_minutes
- monthly_sms_count
- plan_tier
- plan_type_prepaid_postpaid
- arpu_monthly
- device_type_primary
- device_brand
- roaming_usage_frequency
- add_on_count
- on_time_payment_rate
- support_contact_count
- last_payment_days_ago
- 5g_device_flag
- age_group
- region
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (customer profiles and service adoption)

### Statistical Metrics
- Data usage distribution (10th, 50th, 90th percentiles)
- Voice minutes distribution by plan tier
- ARPU distribution
- Device brand distribution
- Payment delay distribution

### Quality Metrics
- Data usage consistency (day-to-day variance)
- Billing system synchronization freshness
- Device type categorization validation
- Geographic location data accuracy

## Seed Audience Definition

### Approach
1. **Select Customer Segment**: Identify profitable or strategic segment
2. **Establish Usage Baseline**: Document typical consumption patterns
3. **Map Service Stack**: Identify product/add-on preferences
4. **Profile Device Affinity**: Document technology adoption patterns

### Example Seed Profiles

**Seed 1: "Data-Heavy Young Professional"**
- Data usage: 20-30 GB/month
- Voice: 200-400 minutes/month
- Plan tier: Premium/Unlimited
- Device: Flagship smartphone, high-end
- Add-ons: Video streaming, mobile device insurance
- Roaming: Frequent international travel
- ARPU: $75-100+
- Payment: Autopay, on-time, high credit score

**Seed 2: "Family-Oriented Mid-Market"**
- Data usage: 10-15 GB/month (shared plan)
- Voice: 300-500 minutes/month
- Plan tier: Family plan, mid-tier
- Device: Mix of mid-range to flagship
- Add-ons: Family sharing, parental controls
- Roaming: Occasional international
- ARPU: $120-150 (family bundle)
- Payment: Autopay, consistent usage

**Seed 3: "Value-Conscious Light User"**
- Data usage: 2-5 GB/month
- Voice: 100-200 minutes/month
- Plan tier: Basic/Entry-level
- Device: Budget or mid-range
- Add-ons: Minimal, price-sensitive
- Roaming: Rare or none
- ARPU: $20-35
- Payment: Manual, on-time

## Matching Methodology

### Feature Space Construction
1. **Usage Vector**: Normalize data, voice, SMS volumes
2. **Service Tier**: Encode plan type and add-on adoption
3. **Device Profile**: Device type, brand, technology features
4. **Commercial Profile**: ARPU, payment behavior, engagement
5. **Geographic/Demographic**: Location and demographic proxies

### Similarity Scoring
- **Data Usage Alignment**: Within ±30% of seed monthly usage
- **Plan Tier Matching**: Same or adjacent tier (±1 level)
- **Device Preference**: Same device category or adjacent
- **ARPU Proximity**: Within ±25% of seed ARPU
- **Payment Reliability**: Same payment score bracket

### Candidate Filtering
- **Exclude**: Customers in contract lock-in with competitors
- **Exclude**: Customers with churn risk indicators
- **Exclude**: Credit-impaired customers (if acquisition target is premium)
- **Priority**: Customers with usage growth trends
- **Bias toward**: Geographic areas with good coverage

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Data usage range, plan tier, payment reliability
- Can vary: Device brand (same category), minor roaming differences
- Expansion ratio: 5-8x
- Expected ARPU match: 85-95%

**Tier 2: Moderate (Balanced)**
- Must match: Usage category (heavy/medium/light), ARPU range
- Can vary: Specific plan tier, device type variation
- Expansion ratio: 15-25x
- Expected ARPU match: 70-85%

**Tier 3: Aggressive (Volume)**
- Must match: General user type (premium/standard/budget)
- Can vary: Specific usage amounts (±50%), device category
- Expansion ratio: 40-80x
- Expected ARPU match: 50-75%

## Expected Expansion Ratios

### By Seed Type

**Premium/Data-Heavy Seeds**
- Conservative: 4-6x
- Moderate: 12-18x
- Aggressive: 30-50x
- Rationale: Smaller segment of power users, targeted acquisition

**Mid-Market Seeds**
- Conservative: 6-10x
- Moderate: 18-30x
- Aggressive: 50-100x
- Rationale: Larger addressable market, broader matching

**Budget/Light User Seeds**
- Conservative: 8-15x
- Moderate: 30-60x
- Aggressive: 100-200x
- Rationale: Large population, many similar users

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Data usage level (service fit)
- Plan tier (product affinity)
- Device type (technology alignment)
- ARPU (profitability match)

### Important Dimensions (Weight: 2.0x)
- Voice usage patterns (service utilization)
- Add-on adoption (upsell potential)
- Payment behavior (risk assessment)
- Roaming frequency (international service)

### Supplementary Dimensions (Weight: 1.0x)
- Demographic proxies (targeting refinement)
- Geographic location (coverage dependent)
- Device brand specific (optimization)

## Implementation Approach

### Data Requirements
- 60+ days of usage history per customer
- Complete service component breakdown (data, voice, SMS)
- Device and add-on adoption record
- Payment transaction history
- Billing cycle alignment

### Lookalike Creation Steps
1. Use schema_discovery to understand customer data structure
2. Run feature_analysis on seed segment for baseline metrics
3. Use time_travel to identify stable usage patterns
4. Calculate feature-space distances for candidate customers
5. Apply tier-based filtering and thresholds
6. Generate lookalike audience segments
7. Validate against acquisition cost targets

### Validation Strategy
- Compare lookalike ARPU distribution to seed
- Verify device adoption distribution
- Check roaming service adoption rates
- Monitor plan tier distribution
- Track first-month churn rates

## Segment-Specific Matching

### Premium Tier Matching
- Emphasis on device type and premium add-ons
- Data usage secondary (features matter more)
- High payment score filtering
- Expected lifetime value: 1.3-1.7x basic tier

### Family Plan Matching
- Emphasis on household indicators
- Multi-device support requirements
- Data sharing preferences
- Shared plan history
- Expected expansion: 15-25x

### International Business Matching
- Emphasis on roaming patterns
- Business plan features
- International calling
- Premium support requirements
- Expected expansion: 5-10x (niche market)

## Performance Expectations

- Lookalike audience size: 30-200x seed (depending on seed tier)
- ARPU match: 70-95% of seed ARPU
- Day 30 churn: Within 2-5% of seed segment
- Plan adoption: 80%+ adopt within 90 days
- Add-on adoption lift: 15-30% vs non-targeted
- Customer acquisition cost: 20-40% reduction vs random audience

## Monitoring & Optimization

### Key Metrics
- ARPU consistency with seed projection
- Data usage stability in first 90 days
- Plan tier adoption confirmation
- Add-on adoption rates
- Churn rate alignment

### Refinement Triggers
- ARPU variance >20% from projection
- Unexpectedly high or low usage
- Plan downgrade within 60 days
- Device upgrade patterns changed
- Seasonal usage variation detection

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for available service dimensions
- Identify calculated_attribute for pre-computed ARPU, usage scores
- Verify data usage normalization across billing systems

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish usage and ARPU distributions
- Identify device brand and add-on patterns
- Validate payment behavior consistency

### time_travel Usage
- Track data usage changes over 60-90 days
- Identify stable vs volatile usage patterns
- Monitor plan tier adoption stability
- Detect seasonal usage variations

### query_builder Usage
- Cost estimation for lookalike matching queries
- Optimize usage pattern extraction
- Model scalability of expanding tiers

## Implementation Checklist

- [ ] Define 2-4 seed customer profiles (by tier)
- [ ] Establish usage baseline and tolerance bands
- [ ] Document plan tier and add-on taxonomy
- [ ] Map device type and technology features
- [ ] Create feature space vectors
- [ ] Build similarity scoring formula
- [ ] Test on historical customers (backtesting)
- [ ] Validate lookalike vs seed ARPU/usage
- [ ] Set up performance dashboards
- [ ] Plan A/B testing for offers
- [ ] Document expansion ratio assumptions
- [ ] Schedule quarterly model refresh
