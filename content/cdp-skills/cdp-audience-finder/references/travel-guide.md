# Travel Audience Finding Guide

## Overview
Travel marketing centers on booking patterns, destination affinity, loyalty tiers, and trip characteristics. Use CDP data to identify high-value travelers, upsell accommodation/ancillary services, and predict seasonal travel intent.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Booking history (dates, destinations, advance booking window)
- Trip characteristics (duration, purpose, cabin/class, accommodation type)
- Traveler profile (solo, couple, family, group)
- Loyalty program enrollment and tier status
- Loyalty points balance and redemption behavior
- Booking channels (website, app, agent, OTA)
- Ancillary service purchases (baggage, seat selection, travel insurance)
- Customer spend (accommodation, flights, ground transport, activities)
- Review/feedback sentiment and engagement
- Payment method preference and frequency
- Destination affinity and repeat visitation
- Mobile app usage frequency
- Search behavior (price sensitivity, search depth)

```
schema_discovery operation: "store", store_type: "event_store"
schema_discovery operation: "columns", columns: ["booking_date", "destination", "trip_duration", "total_spend"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Trip frequency**: Trips per year, booking consistency
- **Spend profile**: Average trip spend, spend per day, ancillary spend rate
- **Booking behavior**: Advance booking window, last-minute vs planner
- **Destination patterns**: Repeat destinations, geographic diversity, preferred regions
- **Loyalty engagement**: Points redemption rate, tier progression
- **Channel preference**: Digital vs agent, app vs web usage
- **Trip characteristics**: Duration distribution, purpose breakdown

```
feature_analysis columns: ["trips_per_year", "average_trip_spend", "days_advance_booking",
  "loyalty_tier", "repeat_destination_rate"],
metric_types: ["basic", "statistical"]
```

## Common Audience Definitions

### 1. High-Value Luxury Travelers
**Filter Criteria:**
- Annual travel spend: >$10K
- Trip frequency: 3+ trips/year
- Cabin/class preference: Business, first, or premium economy
- Accommodation: 4-5 star properties
- Loyalty tier: Gold/Platinum
- Ancillary spend: >30% of base fare
- Booking channel: Direct or loyalty app

**Expected Size:** 3-7% of base
**Activation:** Exclusive lounge access, complimentary upgrades, concierge service, exclusive rate access, VIP recognition programs

### 2. Frequent Business Travelers
**Filter Criteria:**
- Trip purpose: Business (inferred from patterns)
- Trip frequency: 4+ trips/year
- Trip duration: 2-5 days (short trips)
- Booking pattern: Short advance window (5-7 days)
- Loyalty status: Active elite tier
- Booking flexibility: High (last-minute capable)
- Accommodation: Business hotels/chains
- Return destinations: 30%+ of trips to same cities

**Expected Size:** 8-12% of base
**Activation:** Business class upgrades, status benefits, short-haul specials, corporate rates, flexible cancellation

### 3. Leisure Family Travelers
**Filter Criteria:**
- Traveler composition: 2+ adults + children (inferred)
- Trip purpose: Leisure, holidays
- Trip frequency: 2-3 trips/year
- Booking advance: 30-60 days (planners)
- Accommodation: Family-friendly hotels, resorts
- Ancillary: Car rental, activities bundling
- Seasonal pattern: School holidays, summer, winter
- Trip duration: 5-10 days (longer stays)

**Expected Size:** 20-30% of base
**Activation:** Family packages, kids-free promotions, activity bundles, all-inclusive resorts, flexible payments

### 4. Adventure/Experience Seekers
**Filter Criteria:**
- Destination diversity: 5+ different destinations in 2 years
- Accommodation: Unique properties (boutique, Airbnb, eco-lodges)
- Activity engagement: High ancillary (tours, activities, dining)
- Booking channel: Apps, alternative platforms (not legacy)
- Reviews/engagement: Active review writer, social sharer
- Trip type: Mix of locations (not repeat-dependent)
- Age: Typically 25-45

**Expected Size:** 15-25% of base
**Activation:** Curated destination guides, off-beat experiences, local activity bundles, authentic stays, adventure insurance

### 5. Budget-Conscious/Deal Seekers
**Filter Criteria:**
- Price sensitivity: High (frequent searches, multiple sites)
- Booking window: Last-minute (14 days or less)
- Ancillary spend: Minimal (<10% of total)
- Accommodation: Budget chains, shared accommodations
- Trip frequency: Regular (2+ trips/year) but low spend per trip
- Seasonal pattern: Off-peak travel preference
- Loyalty adoption: Rate comparison sites vs brand loyalty

**Expected Size:** 25-35% of base
**Activation:** Flash sales, last-minute deals, budget travel guides, hidden-city ticketing, budget packages

### 6. Early Planners (Planning Window 60+ Days)
**Filter Criteria:**
- Average booking advance: 60+ days
- Booking patterns: Consistent (regular scheduler)
- Trip frequency: 2-3 trips/year
- Cancellation rate: Low (committed)
- Destination: Mix of domestic and international
- Loyalty: Member of program
- Engagement: App notifications enabled, email open rate >40%

**Expected Size:** 20-30% of base
**Activation:** Early bird discounts, travel planning tools, destination inspiration, pre-travel education, group booking benefits

### 7. Loyalty Program Elite (Tier Focus)
**Filter Criteria:**
- Loyalty tier: Gold, Platinum, Diamond
- Tier status: Maintained 2+ consecutive years
- Tier progress: On track for same or higher tier
- Engagement: Point redemption, exclusive benefit usage
- Booking volume: 8+ segments/year
- Tenure: Member 3+ years
- Status value: Benefits valued (upgrades taken, lounge access)

**Expected Size:** 5-10% of base
**Activation:** Accelerated tier benefits, exclusive rate access, status recognition, partner privileges, loyalty perks enhancement

### 8. Solo Travelers
**Filter Criteria:**
- Traveler type: Solo (single occupancy pattern)
- Trip frequency: 2+ trips/year
- Accommodation: Single rooms, shared/co-working accommodation
- Activities: High engagement with tours, group activities
- Duration: 5-14 days (exploration period)
- Destinations: Mix of cultural, adventure, beach
- Age: Typically 18-50, diverse
- Social engagement: Active review writer, photo sharing

**Expected Size:** 10-18% of base
**Activation:** Solo traveler-specific packages, group activity options, social networking features, female-specific safety focus, remote work stays

### 9. Repeat Destination Lovers
**Filter Criteria:**
- Repeat destination rate: 60%+ trips to 1-2 favorite destinations
- Loyalty to specific properties: Stay at same 1-2 hotels
- Trip frequency: 2+ per year
- Destination: Specific city/region
- Accommodation: Preferred brands/properties
- Booking: Direct to property or loyalty program
- Duration: Consistent (similar trip lengths)
- Ancillary: Familiar with local options, minimal upsell needed

**Expected Size:** 15-20% of base
**Activation:** Loyalty to properties, repeat stay discounts, destination-specific loyalty, local partnership benefits, home-away programs

## Example Audience Queries

### Query 1: High-Value Luxury Upgrade Targets
```sql
SELECT customer_id, email, phone, annual_travel_spend, trip_frequency,
       preferred_cabin, loyalty_tier, last_trip_date, total_loyalty_points
FROM customer_travel_profiles
WHERE annual_travel_spend > 10000
AND trip_frequency >= 3
AND preferred_cabin IN ('business', 'first', 'premium_economy')
AND loyalty_tier IN ('gold', 'platinum', 'diamond')
AND ancillary_spend_ratio > 0.30
AND last_trip_date >= DATE_SUB(CURRENT_DATE, INTERVAL 180 DAY)
ORDER BY annual_travel_spend DESC, last_trip_date DESC
```

### Query 2: Leisure Family Summer Holiday Targeting
```sql
SELECT DISTINCT customer_id, email, phone, annual_travel_spend,
       trip_frequency, accommodation_type, traveler_composition_type
FROM customer_bookings
WHERE traveler_composition_type = 'family_with_children'
AND trip_purpose = 'leisure'
AND trip_frequency BETWEEN 2 AND 3
AND average_booking_advance BETWEEN 30 AND 60
AND accommodation_type IN ('family_hotel', 'resort', 'vacation_rental')
AND last_trip_date >= DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)
AND next_potential_trip_season = 'summer'
ORDER BY trip_frequency DESC, annual_travel_spend DESC
```

### Query 3: Early Planner Winter Travel Campaign (90+ Days Out)
```sql
SELECT customer_id, email, phone, booking_pattern_advance_days,
       annual_trip_frequency, loyalty_member, historical_winter_trips
FROM customer_profiles
WHERE booking_pattern_advance_days >= 60
AND annual_trip_frequency >= 2
AND email_engagement_rate > 0.40
AND app_push_enabled = true
AND historical_winter_trips > 0
AND loyalty_member = true
AND last_engagement_date >= DATE_SUB(CURRENT_DATE, INTERVAL 60 DAY)
AND NOT EXISTS (
  SELECT 1 FROM bookings
  WHERE customer_id = cp.customer_id
  AND travel_date >= DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY)
  AND travel_date <= DATE_ADD(CURRENT_DATE, INTERVAL 180 DAY)
)
ORDER BY booking_pattern_advance_days DESC
```

## Channel Strategy by Segment

| Segment | Email | SMS | App Push | Retargeting | Direct Mail | Phone |
|---------|-------|-----|----------|------------|------------|-------|
| Luxury Travelers | High | Low | Medium | Yes | High | Very High |
| Business Travelers | Very High | High | Very High | Yes | Low | High |
| Leisure Families | High | High | High | Yes | Medium | Medium |
| Adventure Seekers | High | Medium | Very High | Yes | Low | Low |
| Deal Seekers | Very High | Very High | High | Very High | Low | Low |
| Early Planners | Very High | Medium | High | Yes | Medium | Medium |
| Loyalty Elite | High | Low | Very High | Yes | High | High |
| Solo Travelers | High | Medium | Very High | Yes | Low | Low |
| Repeat Destination | Medium | Low | Medium | No | Medium | Low |

## Seasonal Activation Calendar

1. **Jan-Feb**: Winter escapes, CNY/Valentine's (couples), ski season
2. **Mar-Apr**: Spring breaks, Easter, golf season, cherry blossoms
3. **May-Jun**: Early summer, Father's Day, education season ends
4. **Jul-Aug**: Peak summer, school holidays, adventure season
5. **Sep-Oct**: Fall foliage, business travel uptick, festival season
6. **Nov-Dec**: Holiday travel, Thanksgiving, Christmas, year-end leisure

## Tips for Success

1. Build 60/30/7-day booking window campaigns; optimize timing by segment
2. Analyze destination affinity; recommend similar untried destinations
3. Monitor ancillary penetration; bundle services by segment appetite
4. Use loyalty tier as engagement lever; tailor benefits by progression
5. Track repeat destination lovers separately; they need different messaging
6. Analyze family compositions; identify school holiday travel windows
7. Use time_travel for seasonal pattern analysis (summer vs. winter peaks)
8. Create personalized itineraries based on past destination/activity choices
9. Build price elasticity models by segment (luxury vs. budget)
