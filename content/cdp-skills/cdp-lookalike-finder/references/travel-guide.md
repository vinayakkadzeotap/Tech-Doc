# Travel Lookalike Finder Guide

## Overview
Travel lookalike audiences target customers with similar trip patterns, booking behaviors, and travel preferences. This guide addresses destination preferences, travel frequency, and ancillary purchasing patterns for efficient travel customer acquisition.

## Key Similarity Dimensions

### Trip Characteristics

**Trip Type Preferences**
- Trip classification (leisure, business, adventure, family, romantic)
- Trip duration patterns (weekend, week-long, extended travel)
- Trip frequency by season
- Domestic vs international split
- Multi-destination vs single-destination patterns

**Destination Preferences**
- Geographic regions (Europe, Asia, Americas, etc.)
- Country/city frequency
- Destination diversity (returning vs exploring)
- Accessibility requirements (proximity, direct flights)
- Climate/climate season preferences (beach vs ski, summer vs winter)

**Travel Activities**
- Activity type preferences (beach, sightseeing, adventure, cultural, wellness)
- Adventure level (relaxation vs high-activity)
- Social aspect (group tours vs independent, family-oriented)
- Accommodation type preference (resort, hotel, vacation rental, cruise)
- Special interest travel (golf, wine, wildlife, etc.)

### Booking Behavior

**Booking Patterns**
- Advance booking window (last-minute vs planned)
- Booking frequency during trip planning
- Price-checking behavior (comparison shopping intensity)
- Online vs travel agent preference
- Channel preference (OTA vs direct booking vs wholesaler)

**Price Sensitivity**
- Willingness to pay (budget vs mid-range vs luxury)
- Price elasticity (deals important vs convenience)
- Discount responsiveness
- Price range expectations by trip type
- Premium amenity willingness

**Booking Timing**
- Day of week patterns
- Month-ahead booking patterns
- Last-minute booking propensity
- Seasonal surge awareness
- Flash deal responsiveness

### Loyalty & Engagement

**Loyalty Program Participation**
- Program enrollment rate
- Redemption frequency
- Status achievement (aspirational vs comfortable)
- Points balance patterns (spender vs hoarder)
- Cross-brand loyalty (portfolio participation)

**Communication Preferences**
- Email engagement depth
- Push notification responsiveness
- SMS engagement
- Content type preferences (deals, inspiration, reviews)
- Frequency tolerance

**Review & Research Behavior**
- Review reading frequency
- User-generated content consumption
- Social media travel research
- Travel blog/influencer following
- Expert recommendation reliance

### Travel Party Composition

**Group Size & Type**
- Typical party size (solo, couple, family, group)
- Traveling with family frequency
- Business vs leisure travel ratio
- Group travel organization (independent vs organized)
- Intergenerational travel patterns

**Travel Companions**
- Spouse/partner travel
- Children/family travel
- Friends group travel
- Extended family travel
- Solo travel

### Spending & Ancillary Behavior

**Accommodation Spending**
- Star rating preference (budget to luxury)
- Amenity priorities (pool, gym, dining, etc.)
- Room type preferences
- Length of stay patterns
- Booking flexibility (free cancellation preference)

**Ancillary Services**
- Flight upgrade uptake
- Hotel room upgrade uptake
- Activity booking propensity
- Travel insurance purchase
- Airport lounge membership
- Ground transportation preferences

**Total Trip Spend**
- Average trip budget
- Spending by trip type
- Ancillary vs accommodation split
- Budget growth trajectory
- Seasonal spend variation

### Logistical Preferences

**Transportation**
- Preferred airlines (if patterns exist)
- Flight class preference (economy, premium economy, business)
- Seat selection (aisle, window, upgrade)
- Ground transportation (rental car, public transit, ride-share)
- Airport preference (direct vs connections)

**Timing Flexibility**
- Preferred travel days (weekday vs weekend)
- Preferred departure times
- Flight duration tolerance
- Layover acceptance
- Schedule flexibility (midweek vs weekend)

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- trips_per_year
- average_trip_length_days
- average_trip_spend_usd
- primary_destination_region
- domestic_vs_international_ratio
- accommodation_type_preference
- trip_type_primary
- booking_window_advance_days
- price_sensitivity_score
- loyalty_program_member_flag
- loyalty_tier
- travel_group_size_typical
- has_children_traveling_flag
- travel_party_composition
- activity_type_primary
- flight_class_preference
- ancillary_purchase_frequency
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (customer travel profiles and preferences)

### Statistical Metrics
- Trip frequency distribution (trips per year)
- Trip duration distribution
- Trip spend distribution (by type)
- Booking window distribution (advance days)
- Group size distribution
- Destination diversity score distribution

### Quality Metrics
- Booking system data freshness
- Currency conversion consistency
- Destination classification consistency
- Group size data accuracy (booking confirmations)

## Seed Audience Definition

### Approach
1. **Select Travel Segment**: Identify profitable or strategic segment
2. **Establish Travel Patterns**: Document frequency, duration, and destination patterns
3. **Map Booking Behavior**: Identify how they research, book, and decide
4. **Profile Spending**: Document budget and ancillary service patterns
5. **Identify Party Composition**: Define typical travel group structure

### Example Seed Profiles

**Seed 1: "Luxury Escape Traveler"**
- Trip frequency: 3-4 trips/year
- Trip length: 5-7 days typical
- Spend per trip: $3,000-$6,000+
- Destinations: European cities, Caribbean resorts, Asia luxury
- Trip type: Romantic/leisure
- Accommodation: 4-5 star luxury hotels, resorts
- Booking: 2-3 months advance, direct booking
- Ancillary: High (upgrades, activities, dining)
- Loyalty: Premium tier member
- Group: Couples primarily

**Seed 2: "Adventure Explorer"**
- Trip frequency: 2-3 trips/year
- Trip length: 10-14 days typical
- Spend per trip: $1,500-$3,000
- Destinations: Emerging destinations, off-beaten-path
- Trip type: Adventure/cultural
- Accommodation: Mid-range, local experiences, hostels
- Booking: 4-8 weeks advance, comparison shopping
- Ancillary: Moderate (activities, minimal upgrades)
- Loyalty: Program participant, value-conscious
- Group: Solo or small groups

**Seed 3: "Family Vacation Planner"**
- Trip frequency: 2 trips/year
- Trip length: 7-10 days typical
- Spend per trip: $2,500-$4,500
- Destinations: Family-friendly, reliable destinations, beaches
- Trip type: Family/leisure
- Accommodation: Family suites, resorts with kids clubs
- Booking: 6-10 weeks advance, multiple channels
- Ancillary: Moderate (activities suitable for kids)
- Loyalty: Family plan member
- Group: Family (2-4+ people)

## Matching Methodology

### Feature Space Construction
1. **Travel Pattern Vector**: Trip frequency, duration, seasonality
2. **Destination Affinity**: Geographic preferences, destination diversity
3. **Booking Behavior**: Booking window, price sensitivity, channel
4. **Spending Profile**: Budget tier, ancillary spend, upgrade frequency
5. **Party Profile**: Group size, composition, travel type

### Similarity Scoring
- **Trip Frequency Alignment**: Within ±1 trip/year of seed frequency
- **Budget Tier Match**: Same or adjacent budget tier
- **Destination Preference**: Similar geographic region focus
- **Booking Behavior**: Similar advance booking patterns
- **Travel Party**: Similar group size/composition

### Candidate Filtering
- **Exclude**: Customers with no travel history in past 24 months
- **Exclude**: Customers with unresolved service issues
- **Priority**: Customers with growth trajectory in spending
- **Bias toward**: Loyalty program members (engagement signal)

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Trip frequency, budget tier, primary destination
- Can vary: Secondary destinations, ancillary spend (±30%)
- Expansion ratio: 4-7x
- Expected spend match: 85-95%

**Tier 2: Moderate (Balanced)**
- Must match: Budget tier, trip type, travel party type
- Can vary: Specific destinations (same region), frequency (±1 trip)
- Expansion ratio: 12-20x
- Expected spend match: 70-85%

**Tier 3: Aggressive (Volume)**
- Must match: General traveler type (budget/mid/luxury)
- Can vary: Destination regions, trip patterns
- Expansion ratio: 35-70x
- Expected spend match: 50-75%

## Expected Expansion Ratios

### By Traveler Type

**Luxury Traveler Seeds**
- Conservative: 3-5x
- Moderate: 8-15x
- Aggressive: 20-40x
- Rationale: Smaller premium segment, selective matching

**Mid-Range/Adventure Seeds**
- Conservative: 5-10x
- Moderate: 15-30x
- Aggressive: 40-100x
- Rationale: Larger segment, broader destination appeal

**Budget Traveler Seeds**
- Conservative: 8-15x
- Moderate: 25-50x
- Aggressive: 80-150x
- Rationale: Large population, price-sensitive

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Trip budget tier (spend alignment)
- Trip type preference (product fit)
- Trip frequency (engagement level)
- Primary destination region (itinerary relevance)

### Important Dimensions (Weight: 2.0x)
- Booking behavior (campaign timing)
- Travel party type (offer relevance)
- Ancillary propensity (upsell potential)
- Loyalty engagement (retention predictor)

### Supplementary Dimensions (Weight: 1.0x)
- Secondary destinations (personalization)
- Accommodation preference (nice-to-have)
- Activity preferences (refinement)

## Implementation Approach

### Data Requirements
- 24+ months of booking/travel history
- Complete trip details (dates, destinations, spend)
- Booking source and payment method
- Customer profile (age, party composition if available)
- Loyalty program enrollment status

### Lookalike Creation Steps
1. Use schema_discovery to understand travel customer data model
2. Run feature_analysis on seed segment for travel patterns
3. Use time_travel to identify stable vs seasonal travelers
4. Calculate similarity scores for candidate customers
5. Apply budget-tier and destination-based filtering
6. Generate lookalike audiences at multiple expansion tiers
7. Validate against historical booking patterns

### Validation Strategy
- Compare lookalike spend distribution to seed
- Verify destination preference distribution
- Check trip frequency consistency
- Monitor booking pattern alignment
- Track conversion rates vs seed segment

## Segment-Specific Matching

### Luxury/Premium Matching
- Emphasis on spend history and upgrade patterns
- Exclusive destination/hotel matching
- Premium amenity preferences
- Expected expansion: 4-10x

### Family Travel Matching
- Emphasis on family-friendly destinations
- Group size and party composition
- Peak season travel patterns
- Expected expansion: 15-25x

### Business Traveler Matching
- Emphasis on business destination frequency
- Multi-city trip patterns
- Premium cabin and lounge preferences
- Expected expansion: 8-15x

## Performance Expectations

- Lookalike audience size: 30-100x seed (depending on tier)
- Booking conversion: 15-40% higher than average audience
- Average booking value: 70-90% of seed spend
- Repeat booking rate: 80-95% of seed segment
- Ancillary attach rate: 75-95% of seed segment
- False positive rate: 10-20%

## Seasonal Considerations

- Adjust matching for seasonal traveler types
- Consider destination seasonality in matching
- Track shoulder-season vs peak-season patterns
- Account for holiday vs non-holiday travel

## Monitoring & Optimization

### Key Metrics
- Average trip spend consistency
- Booking frequency within season
- Destination preference stability
- Ancillary uptake rates
- Repeat booking rate

### Refinement Triggers
- Spend variance >25% from seed
- Destination preference shift
- Booking behavior changes
- Seasonality pattern changes

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for travel customer dimensions
- Identify calculated_attribute for spend scores, frequency
- Verify destination taxonomy

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish spend, frequency, and destination distributions
- Identify booking behavior clusters

### time_travel Usage
- Track trip booking patterns over 24+ months
- Identify seasonal variation and trends
- Monitor spend growth trajectory
- Detect destination preference changes

### query_builder Usage
- Cost estimation for trip history extraction
- Optimize destination matching queries
- Model budget tier classification efficiency

## Implementation Checklist

- [ ] Define 2-4 seed travel segment profiles
- [ ] Establish trip frequency and spend baselines
- [ ] Document destination preference clusters
- [ ] Map booking behavior patterns
- [ ] Create travel party composition profiles
- [ ] Build feature space vectors
- [ ] Establish similarity scoring methodology
- [ ] Test on historical travelers (backtesting)
- [ ] Validate lookalike vs seed spend/frequency
- [ ] Set up campaign performance tracking
- [ ] Plan seasonal adjustment strategy
- [ ] Schedule quarterly model updates
