# Travel Data Enricher Guide

## Overview
Enrichment playbook for travel and hospitality, emphasizing destination affinities, trip planning behavior, and loyalty progression.

## Core Enrichment Attributes

### 1. Trip Planning Horizon

**Definition:** How far in advance customer plans travel and books accommodations
**Measurement:** Days between booking and travel date

**Metrics to Calculate:**
- Average booking window (days between booking and travel)
- Booking pattern consistency (variation in booking window)
- Last-minute booking propensity (books <14 days before)
- Advance booking propensity (books 60+ days before)
- Peak booking window (most common booking timeframe)
- Seasonality of booking window (differs by season)
- Special occasion booking (books differently for holidays)

**Booking Horizon Segments:**
- Last-minute bookers: <14 days, flexible calendar
- Short-term planners: 14-30 days, moderate flexibility
- Standard planners: 30-60 days, typical pattern
- Advance planners: 60-120 days, early birds
- Ultra-advance planners: 120+ days, vacation planning focus

**Planning Behavior Patterns:**
- Consistency (same booking window each trip)
- Flexibility (variable booking windows)
- Price-driven (waits for last-minute deals)
- Calendar-driven (plans around specific dates)

**Data Sources:**
- Booking date and travel date records
- Booking history for multiple trips
- Travel calendar (if known)
- use `time_travel` to analyze booking window trends

**Enrichment Output:**
- Average booking horizon (days)
- Booking horizon tier (last-minute to ultra-advance)
- Booking pattern consistency (score 1-5)
- Optimal timing for offers (window recommendation)
- Seasonal booking window variation (if applicable)

### 2. Destination Affinity Vector

**Definition:** Multi-dimensional preferences across destinations and geographies
**Dimensions:** Beach, mountain, city, cultural, adventure, tropical, European, Asian, etc.

**Metrics to Calculate:**
- Destination visits (count by destination or type)
- Repeat destination rate (% visiting same destination 2+ times)
- New destination exploration (tries new destinations)
- Geographic region preferences (Europe, Asia, Americas, etc.)
- Destination type preferences (beach, city, cultural, adventure)
- Domestic vs international ratio (preference)
- Destination distance preference (nearby vs far)
- Climate preference (tropical, temperate, cold)

**Affinity Calculation:**
- Create vector of destination types visited (normalized percentages)
- Identify primary affinity (top destination type, >50% of trips)
- Secondary affinities (10-50% of trips)
- Minority interests (<10% of trips)
- Measure affinity strength (consistency of preference)

**Destination Clustering:**
- Beach lovers: Tropical, seaside, resort-focused
- City explorers: Urban, cultural, cosmopolitan
- Adventure seekers: Activity-based, outdoor-focused
- Culture enthusiasts: Historical sites, museums, local experiences
- Luxury travelers: High-end resorts, premium experiences
- Budget travelers: Economy accommodations, value-conscious
- Mixed travelers: Diverse preferences, varied experiences

**Data Sources:**
- Booking history (destinations booked)
- Stay records (actual destinations visited)
- Destination classification (type categorization)
- Use `schema_discovery` to identify destination attributes

**Enrichment Output:**
- Primary destination type (category + %)
- Secondary affinities (list with %)
- Top destinations by visit frequency (list)
- Geographic preference (regions)
- Recommended next destinations (based on pattern)
- Affinity strength score (consistency 1-5)

### 3. Price Elasticity Analysis

**Definition:** Customer's price sensitivity and responsiveness to rate changes
**Elasticity:** How demand changes with price variations

**Metrics to Calculate:**
- Average daily rate (ADR) accepted (accommodations)
- Price point distribution (budget/mid/luxury range)
- Price sensitivity by season (varies with demand)
- Last-minute deal acceptance (discount threshold for booking)
- Premium service willingness (pays for upgrades)
- Price comparison behavior (shops multiple sites)
- Value perception (quality vs price balance)

**Elasticity Scoring:**
- Highly elastic (1): Very price-sensitive, shops aggressively
- Moderately elastic (2): Price-conscious, compares options
- Balanced (3): Price and value conscious, reasonable
- Inelastic (4): Less price-sensitive, values convenience
- Very inelastic (5): Premium willing, least price-sensitive

**Price Segments:**
- Budget segment: <$100/night avg, discount-focused
- Mid-range segment: $100-250/night avg, value-conscious
- Upscale segment: $250-500/night avg, quality-focused
- Luxury segment: >$500/night avg, premium experience
- Mixed buyers: Different price points by trip type

**Dynamic Pricing Opportunity:**
- Identify willingness to pay by season/destination
- Estimate price elasticity (% change in demand per % price change)
- Optimal pricing by segment and timing

**Data Sources:**
- Booking history with rate information
- Rate acceptance/rejection logs
- Dynamic pricing experiments (A/B tests)
- use `query_builder` for price elasticity modeling

**Enrichment Output:**
- Price sensitivity tier (1-5 scale)
- Average daily rate accepted (by accommodation type)
- Elasticity coefficient (estimated)
- Optimal pricing range (recommended)
- Premium upgrade propensity (yes/no)
- Last-minute discount threshold (%)

### 4. Loyalty Engagement Depth

**Definition:** Customer's involvement in loyalty programs and rewards utilization
**Engagement Factors:** Point earning, redemption, tier progression, exclusive usage

**Metrics to Calculate:**
- Loyalty program enrollment status (yes/no)
- Point earning rate (points earned per dollar spent)
- Point redemption rate (% of earned points redeemed)
- Tier level (current status in tiered program)
- Tier progression velocity (speed to next tier)
- Exclusive benefit utilization (usage of tier-specific perks)
- Program engagement score (interaction frequency)

**Loyalty Segment Classification:**
- Non-member: No program enrollment
- Passive member: Enrolled, minimal engagement
- Active member: Regular earning and redemption
- Engaged member: Frequent program interaction
- Elite member: Highest tier, active in all benefits
- Power user: Maximum program optimization

**Engagement Depth Scoring (1-5):**
- 1: No loyalty program participation
- 2: Program member, minimal engagement
- 3: Regular participation, moderate engagement
- 4: Frequent engagement, strategic point use
- 5: Maximum engagement, optimizes all benefits

**Tier Progression Opportunity:**
- Identify path to next tier (points needed)
- Engagement required for tier upgrade
- Targeted earn opportunities (bonus point offers)
- Timeline to next tier (projected months)

**Data Sources:**
- Loyalty program enrollment records
- Point earning and redemption history
- Tier status and progression tracking
- Benefit utilization logs
- use `feature_analysis` for engagement percentiles

**Enrichment Output:**
- Loyalty program status (enrolled/tier level)
- Engagement depth score (1-5)
- Points balance (current)
- Tier progression status (points to next tier)
- Redemption behavior (frequent/occasional)
- Exclusive benefit interest (high/moderate/low)

### 5. Companion Profile

**Definition:** Travel party composition and group dynamics
**Dimensions:** Solo/couple/family/group, repeat companions, companion type preferences

**Metrics to Calculate:**
- Travel party size (average number of travelers)
- Travel party composition (adults, children, seniors)
- Family vs friends vs business ratio
- Repeat companions (travels with same people)
- Solo travel propensity (% solo trips)
- Group travel propensity (% group trips)
- Children travel (with kids or without)
- Pet travel (travels with pets)

**Companion Segments:**
- Solo travelers: Individual travelers, frequent travel
- Couples: Two-person travel, romantic destinations
- Families: Travel with children, family-friendly needs
- Friends groups: Group travel, social experiences
- Business travelers: Work-related, convenience-focused
- Multigenerational: Extended family, varied needs
- Pet owners: Travel with animals, special accommodations

**Group Dynamics:**
- Decision maker (who chooses destination/accommodation)
- Budget holder (who pays)
- Group size stability (consistent group or varies)
- Group preferences (needs to satisfy multiple people)
- Accommodation needs (separate rooms vs together)

**Family Travel Indicators:**
- Child age range (impacts activity suitability)
- Family travel frequency (annual trips)
- School break alignment (holiday travel patterns)
- Multi-generational participation (grandparents included)

**Data Sources:**
- Booking party size and guest information
- Historical travel records
- Family status (if known)
- use `schema_discovery` to identify companion data fields

**Enrichment Output:**
- Typical travel party size (count)
- Primary travel companion type (solo/couple/family/group)
- Repeat companion frequency (frequent/occasional)
- Family travel flag (yes/no)
- Accommodation preferences (room configuration)
- Activity suitability (by party composition)

### 6. Seasonal Travel Propensity

**Definition:** Predictable travel timing and seasonal patterns
**Seasonality:** Peak seasons, off-seasons, special occasions

**Metrics to Calculate:**
- Peak travel months (highest travel frequency)
- Peak season spending (higher spend in certain seasons)
- Off-season participation (travels during slow seasons)
- Holiday travel propensity (travel during holidays/breaks)
- School break alignment (travels during school vacations)
- Weather-driven patterns (temperature, rainfall seasonality)
- Event-driven travel (festivals, conferences, sports events)

**Seasonal Segments:**
- Summer travelers: Peak in June-August
- Winter holiday travelers: Peak in December
- Spring break travelers: Peak in March-April
- Shoulder season travelers: Peak in May/September
- Year-round travelers: Consistent throughout year
- Business-driven: Travel based on business calendar
- Event-specific: Travel around major events

**Seasonality Pattern Analysis:**
- Identify peak travel windows (months, dates)
- Project future travel based on seasonal patterns
- Optimal marketing timing (reach when planning)
- Pricing strategy (premium vs discount seasons)

**Data Sources:**
- Booking date and travel date history
- Calendar year booking patterns
- School calendar alignment
- Holiday/event calendar
- use `time_travel` for seasonal pattern detection

**Enrichment Output:**
- Peak travel season (months)
- Peak season spending increase (%)
- Off-season participation rate (% of annual trips)
- Holiday travel propensity (yes/no, types)
- Seasonal pattern consistency (score 1-5)
- Next projected travel window (dates)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 85% for booking and destination data
- Timeliness: Update weekly for travel bookings, monthly for preferences
- Accuracy: Validate destination classifications
- Consistency: Cross-check booking and actual travel dates

**MCP Tools Integration:**
- Use `schema_discovery` to map travel booking structure
- Use `feature_analysis` to calculate affinity and elasticity scores
- Use `time_travel` to identify booking window and seasonal patterns
- Use `get_detailed_events` to track loyalty program interactions

**Enrichment Frequency:**
- Booking horizon: With each booking (real-time)
- Destination affinity: Monthly after each trip
- Price elasticity: Monthly (with booking data)
- Loyalty engagement: Weekly (with program activity)
- Companion profile: With each booking
- Seasonal propensity: Quarterly (pattern analysis)

**Output Storage:**
- Store enriched attributes in traveler_360 table
- Create monthly snapshots for trend analysis
- Archive historical preferences for ML models
- Maintain booking prediction data

## Key Analysis Workflows

**MCP Tool Usage Examples:**

1. **Analyze destination patterns:**
   - Use `get_available_event_types` to identify booking events
   - Use `get_detailed_events` to extract destination information
   - Use `feature_analysis` to calculate affinity percentiles

2. **Track booking behavior:**
   - Use `time_travel` to measure days between booking and travel
   - Analyze booking window trends over time
   - Identify seasonality in booking patterns

3. **Identify cross-sell opportunities:**
   - Use `query_builder` to cost-analyze personalization queries
   - Calculate loyalty tier progression for targeted offers

