# Automotive Data Enricher Guide

## Overview
Enrichment playbook for automotive industry, emphasizing vehicle ownership, service behavior, and upgrade readiness signals.

## Core Enrichment Attributes

### 1. Purchase Cycle Position

**Definition:** Where customer is in vehicle purchase decision journey
**Journey:** Research → Test drive → Negotiation → Purchase → Ownership → Repurchase

**Metrics to Calculate:**
- Time since last vehicle purchase (years)
- Vehicle age (months owned)
- Purchase cycle stage (identified by behavior signals)
- Typical purchase frequency (vehicles per years owned)
- Purchase cycle acceleration (faster repurchase than typical)
- Model switching frequency (changes brands vs stays loyal)
- Multi-vehicle ownership (fleet vs single vehicle)

**Purchase Cycle Stages:**
- Research phase: Browsing models, reading reviews, gathering info
- Active consideration: Comparing features, getting quotes
- Test drive: Scheduling and completing test drives
- Negotiation: Final pricing and financing discussions
- Purchase ready: Very close to buying decision
- Post-purchase: Recently purchased (0-6 months)
- Early ownership: 6-18 months into ownership
- Mid-cycle: 18-36 months ownership
- Late-cycle: 36-48 months ownership
- End-of-cycle: 48+ months, upgrade candidate

**Cycle Position Signals:**
- Browse behavior (configurator usage, spec research)
- Site visit frequency (more frequent = more serious)
- Content consumption (reviews, videos, specifications)
- Inquiry submission (dealer information requests)
- Test drive booking (highest purchase intent)
- Email engagement (response to offers)
- Visit timing relative to peak purchase seasons

**Data Sources:**
- Vehicle registration database (purchase dates)
- Browsing and engagement logs
- Test drive scheduling records
- Inquiry submission tracking
- Purchase transaction records
- use `time_travel` to track purchase cycle progression

**Enrichment Output:**
- Current purchase cycle stage (category)
- Time in current stage (days/weeks)
- Probability of purchase (next 30/60/90 days)
- Likely target model (based on research)
- Budget range (estimated from browsing patterns)
- Timeline to purchase (projected)

### 2. Service Loyalty Score

**Definition:** Propensity to service vehicle at dealer vs independent shops
**Loyalty Factors:** Service history, visit frequency, dealer relationship, brand affinity

**Metrics to Calculate:**
- Service visit frequency (visits per year)
- Dealer service percentage (dealer visits / total service)
- Independent service percentage (independent visits / total)
- Service regularity (adheres to maintenance schedule)
- Warranty compliance (uses dealer for warranty service)
- Extended service plan enrollment (yes/no)
- Accessory purchases (dealer vs aftermarket)
- Parts purchasing (OEM vs aftermarket)

**Loyalty Segments:**
- High dealer loyalty: 80%+ dealer service, regular maintenance
- Moderate dealer loyalty: 50-79% dealer service, occasional independent
- Low dealer loyalty: 20-49% dealer service, uses independent shops
- Independent preference: <20% dealer service, aftermarket focus
- Irregular service: Sporadic maintenance, mix of providers

**Service Loyalty Drivers:**
- Warranty coverage (must use dealer during warranty)
- Trust/relationship (established dealer relationship)
- Convenience (dealer location and hours)
- Cost (price comparison between dealer and independent)
- Quality perception (belief in dealer expertise)
- Brand affinity (loyal to brand = loyal to dealer)

**Service Compliance Score (1-5):**
- 5 (Excellent): Follows schedule, regular service, dealer loyalty
- 4 (Good): Regular service, mostly dealer, minor deviations
- 3 (Adequate): Services occasionally, mixed provider
- 2 (Poor): Irregular service, avoids maintenance
- 1 (Non-compliant): Minimal service, high-risk owner

**Data Sources:**
- Service appointment records
- Service transaction history
- Warranty tracking
- Service plan enrollment
- Parts ordering records
- use `schema_discovery` to map service data

**Enrichment Output:**
- Loyalty score (1-5)
- Dealer service percentage (%)
- Service frequency (visits/year)
- Compliance status (scheduled/overdue)
- Extended service plan interest (yes/no)
- Next service due date

### 3. Model Affinity Progression

**Definition:** Evolution of vehicle preferences across purchases and interests
**Progression:** Model history and future preference indicators

**Metrics to Calculate:**
- Current vehicle model (owned)
- Previous models owned (purchase history)
- Model research behavior (configurator usage)
- Segment preference (sedan, SUV, truck, etc.)
- Brand consistency (stays with brand or switches)
- Price point progression (trades up/down)
- Performance focus (luxury, sport, economy, eco)
- Features evolution (changes in priorities)

**Model Evolution Patterns:**
- Brand loyal: Stays with same manufacturer
- Segment loyal: Switches brands but stays in segment
- Premium progression: Trades up to higher trim/segment
- Budget conscious: Seeks value options
- Feature seeker: Chases latest technology
- Performance oriented: Prioritizes horsepower/handling
- Eco-conscious: Moves toward EV/hybrid

**Affinity Scoring:**
- Calculate affinity for model categories
- Identify preferred segments (SUV, sedan, truck, sport)
- Track trim/package preferences
- Note technology preferences (standard, premium, basic)

**Segment Preferences:**
- Sedan, SUV (compact/mid/full-size), truck, sports car, van, luxury, economy, eco-friendly, high-performance

**Data Sources:**
- Vehicle registration history (owned models)
- Configurator and shopping behavior
- Browsing and engagement on specific models
- Video views of specific vehicles
- Test drive scheduling (by model)
- use `feature_analysis` to analyze preference patterns

**Enrichment Output:**
- Current owned model (name, year)
- Purchase history (list of previous vehicles)
- Preferred segment (current focus)
- Segment progression trend
- Next likely model interest (top 3)
- Brand loyalty flag (yes/no)

### 4. Trade-In Readiness Index

**Definition:** Vehicle equity position and trade-in eligibility for upgrade
**Readiness:** Age, mileage, condition, market value, upgrade urgency

**Metrics to Calculate:**
- Vehicle age (months/years since purchase)
- Current mileage (miles/kilometers driven)
- Mileage rate (miles per month average)
- Projected remaining ownership (based on pattern)
- Estimated trade-in value (current market value)
- Equity position (current value vs loan balance if applicable)
- Warranty remaining (if under warranty)
- Service record quality (maintenance history impact)

**Trade-In Readiness Tiers:**
- Not ready: <24 months ownership, <30K miles
- Early consideration: 24-36 months, 30-60K miles
- Good condition: 36-48 months, 60-90K miles
- Near optimal: 48-60 months, 90-120K miles
- Trade-in candidate: 60+ months, 120K+ miles

**Equity Calculation:**
- Positive equity: Current value > loan balance (favorable for trade)
- Neutral equity: Current value = loan balance
- Negative equity: Current value < loan balance (underwater)

**Value Estimation Factors:**
- Model demand (popular vs niche)
- Condition (excellent/good/fair/poor)
- Mileage (below/above average for age)
- Market conditions (buyer demand, supply)
- Color and options (affects resale value)

**Data Sources:**
- Vehicle registration and ownership records
- Purchase price and date
- Mileage tracking (odometer readings, service records)
- Loan information (if financed)
- Market value database (Kelley Blue Book, NADA)
- use `query_builder` for trade-in value modeling

**Enrichment Output:**
- Readiness index score (1-5)
- Estimated trade-in value ($)
- Equity position (positive/neutral/negative)
- Ownership months remaining (projected)
- Trade-in interest window (when to approach)
- Recommended upgrade timeline

### 5. Accessory Propensity

**Definition:** Likelihood to purchase vehicle accessories and customization items
**Accessories:** Wheels, tires, tech upgrades, protection plans, performance parts, appearance modifications

**Metrics to Calculate:**
- Accessory purchase frequency (purchases per year)
- Accessory spend ($ spent annually)
- Accessory categories purchased (wheels, tech, protection, etc.)
- OEM vs aftermarket ratio (brand vs third-party)
- DIY vs dealer installation (self-installer vs convenience)
- Premium accessory interest (high-end options)
- Cosmetic vs functional (appearance vs performance/utility)

**Accessory Segments:**
- Non-buyers: Minimal to no accessory purchases
- Practical buyers: Utility items (floor mats, racks, covers)
- Style-focused: Appearance items (wheels, trim, paint protection)
- Tech enthusiasts: Electronics and connectivity upgrades
- Performance enthusiasts: Performance parts and tuning
- Premium users: High-end, brand accessories
- Frequent upgraders: Regular new accessories

**Propensity Scoring (1-5):**
- 5 (High): Regular accessories, diverse purchases, willing to upgrade
- 4 (Moderate-high): Frequent purchases, multiple categories
- 3 (Moderate): Occasional purchases, functional focus
- 2 (Low): Minimal purchases, only essentials
- 1 (None): No accessory interest

**Accessory Revenue Opportunity:**
- Calculate lifetime accessory value potential
- Identify next likely accessory purchase
- Upsell opportunity based on ownership stage

**Data Sources:**
- Accessory purchase history
- Service records (accessories installed)
- Parts ordering records
- Browsing behavior on accessory pages
- use `schema_discovery` to identify accessory data

**Enrichment Output:**
- Propensity score (1-5)
- Annual accessory spend (average)
- Preferred accessory types (categories)
- OEM vs aftermarket preference
- Likely next accessory (recommendation)
- Accessory upsell readiness (yes/no)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 80% for vehicle ownership data
- Timeliness: Update monthly for ownership, weekly for engagement
- Accuracy: Validate against registration and VIN database
- Consistency: Cross-check purchase dates and service records

**MCP Tools Integration:**
- Use `schema_discovery` to map vehicle and service event data
- Use `feature_analysis` to calculate loyalty and propensity scores
- Use `time_travel` to track ownership progression and purchase cycle
- Use `query_builder` to estimate trade-in values and upgrade costs

**Enrichment Frequency:**
- Purchase cycle position: Weekly (from engagement)
- Service loyalty: Monthly (from service records)
- Model affinity: Monthly (from browsing/engagement)
- Trade-in readiness: Monthly (value data update)
- Accessory propensity: Monthly (purchase tracking)

**Output Storage:**
- Store enriched attributes in owner_360 table
- Create monthly snapshots for trend analysis
- Maintain vehicle-level records (multiple vehicles per customer)
- Archive ownership history for lifecycle tracking

## Key Analysis Workflows

**MCP Tool Usage Examples:**

1. **Analyze service compliance:**
   - Use `get_detailed_events` to track service appointments
   - Identify patterns in dealer vs independent service
   - Calculate compliance scores against maintenance schedules

2. **Predict trade-in timing:**
   - Use `time_travel` to analyze ownership duration patterns
   - Track vehicle age cohorts and mileage progression
   - Project trade-in readiness windows

3. **Identify upgrade candidates:**
   - Use `feature_analysis` to score trade-in readiness
   - Correlate service visits with upgrade interest signals
   - Recommend optimal timing for upgrade offers

