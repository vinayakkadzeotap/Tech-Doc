# Travel Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for travel companies. Focus on booking behavior, customer segmentation, and demand prediction.

## Booking Features

### Booking Frequency
Travel propensity and patterns:

**Booking Volume**
- Total bookings (lifetime)
- Bookings in 30/90/365 days (rolling windows)
- Booking frequency per month (trending up/down)
- Booking accelerator (increasing rate = growing traveler)

**Booking Intervals**
- Average days between bookings
- Days since last booking (recency)
- Booking interval variance (consistent traveler vs. sporadic)

**Implementation**
```sql
SELECT user_id,
  COUNT(*) as lifetime_bookings,
  COUNT(*) / (CURRENT_DATE() - MIN(booking_date)) / 365 as bookings_per_year,
  COUNTIF(booking_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)) as bookings_90d,
  CURRENT_DATE() - MAX(booking_date) as days_since_last_booking,
  AVG(DATE_DIFF(booking_date, LAG(booking_date) OVER (PARTITION BY user_id ORDER BY booking_date), DAY)) as avg_days_between_bookings
FROM bookings
GROUP BY user_id
```

### Advance Booking
Planning horizon analysis:

**Booking Window**
- Advance booking days (how far ahead booked)
- Average advance booking window
- Advance booking trend (earlier vs. later bookings)
- Last-minute booker indicator (books <14 days ahead)

**Temporal Patterns**
- Day of week booked (weekends vs. weekdays)
- Month of year booked (seasonal booking patterns)
- Booking lag distribution (% booking 30/60/90+ days ahead)

**Implementation**
```sql
SELECT user_id,
  AVG(DATE_DIFF(travel_start_date, booking_date, DAY)) as avg_advance_days,
  PERCENTILE_CONT(DATE_DIFF(travel_start_date, booking_date, DAY), 0.5) OVER (PARTITION BY user_id) as median_advance_days,
  COUNT(CASE WHEN DATE_DIFF(travel_start_date, booking_date, DAY) < 14 THEN 1 END) / COUNT(*) as pct_last_minute
FROM bookings
GROUP BY user_id
```

### Booking Value
Spending patterns:

**Spend Metrics**
- Total lifetime spend
- Average booking value (per trip)
- Spend per day traveled (trip intensity)
- Spend trend (increasing/decreasing trips)

**Booking Composition**
- Flight spend vs. hotel spend vs. activities
- Package vs. component purchases
- Premium vs. budget trips (average price)

**Implementation**
```sql
SELECT user_id,
  SUM(booking_total) as lifetime_spend,
  AVG(booking_total) as avg_booking_value,
  SUM(flight_cost) / SUM(booking_total) as pct_flight_spend,
  SUM(hotel_cost) / SUM(booking_total) as pct_hotel_spend,
  COUNT(CASE WHEN booking_total > PERCENTILE_CONT(booking_total, 0.75) OVER (PARTITION BY user_id) THEN 1 END) as premium_bookings
FROM bookings
GROUP BY user_id
```

## Preference Features

### Destination Preferences
Travel destination patterns:

**Destination Diversity**
- Distinct destinations visited (travel breadth)
- Favorite destinations (top 3-5 by visit count)
- Geographic diversity (continents visited)
- Domestic vs. international split

**Destination Type Preference**
- Beach destinations (relaxation preference)
- City/urban destinations (experience preference)
- Adventure destinations (activity preference)
- Combination (diverse trip type preferences)

**Implementation**
```sql
SELECT user_id,
  COUNT(DISTINCT destination) as distinct_destinations,
  COUNT(DISTINCT destination_region) as distinct_regions,
  ARRAY_AGG(STRUCT(destination, COUNT(*) as visit_count) ORDER BY COUNT(*) DESC LIMIT 5) as top_destinations,
  COUNT(CASE WHEN destination_type='beach' THEN 1 END) / COUNT(*) as pct_beach_trips,
  COUNT(CASE WHEN destination_type='city' THEN 1 END) / COUNT(*) as pct_city_trips
FROM bookings
GROUP BY user_id
```

### Accommodation Preferences
Hotel and lodging patterns:

**Accommodation Class**
- Preferred hotel star rating (budget vs. luxury)
- Hotel star trend (upgrading from 3* to 5*?)
- Room type preference (single, suite, etc.)
- Special requests (kitchen, balcony, etc.)

**Accommodation Features**
- Hotel amenity preferences (pool, gym, etc.)
- All-inclusive preference
- Boutique vs. chain preference

**Implementation**
```sql
SELECT user_id,
  AVG(hotel_star_rating) as avg_hotel_rating,
  PERCENTILE_CONT(hotel_star_rating, 0.5) OVER (PARTITION BY user_id) as median_hotel_rating,
  COUNT(DISTINCT hotel_brand) as distinct_hotel_brands,
  CASE
    WHEN AVG(hotel_star_rating) >= 4.5 THEN 'luxury'
    WHEN AVG(hotel_star_rating) >= 3.5 THEN 'upscale'
    ELSE 'budget_conscious'
  END as hotel_preference_segment
FROM bookings
JOIN hotels USING (hotel_id)
GROUP BY user_id
```

### Travel Companion Preferences
Group composition patterns:

**Travel Group**
- Typical group size (solo, couple, family, group)
- Travel with children (family trips)
- Group composition type (friends, family, romantic)

**Solo vs. Group**
- Solo travel frequency
- Group travel frequency
- Mixed traveler (both solo and groups)

**Implementation**
```sql
SELECT user_id,
  AVG(num_passengers) as avg_group_size,
  COUNT(CASE WHEN num_passengers = 1 THEN 1 END) / COUNT(*) as pct_solo,
  COUNT(CASE WHEN num_passengers > 2 THEN 1 END) / COUNT(*) as pct_group_travel,
  COUNT(CASE WHEN has_children = TRUE THEN 1 END) / COUNT(*) as pct_family_trips
FROM bookings
GROUP BY user_id
```

## Loyalty Features

### Loyalty Tier
Program engagement level:

**Tier Status**
- Current loyalty tier (bronze/silver/gold/platinum)
- Tier tenure (how long at current tier)
- Tier progression (moving up or stagnant)
- Elite status percentage (what % of bookings)

**Points Metrics**
- Lifetime points earned
- Points balance (redeemable)
- Points redemption rate (active vs. passive)
- Points per booking (earning efficiency)

**Implementation**
```sql
SELECT user_id,
  loyalty_tier,
  CURRENT_DATE() - loyalty_tier_effective_date as days_in_tier,
  lifetime_points_earned,
  current_points_balance,
  COUNT(CASE WHEN points_redeemed > 0 THEN 1 END) / COUNT(*) as redemption_rate,
  lifetime_points_earned / COUNT(*) as avg_points_per_booking
FROM loyalty_accounts
LEFT JOIN bookings USING (user_id)
GROUP BY user_id, loyalty_tier, loyalty_tier_effective_date, lifetime_points_earned, current_points_balance
```

### Loyalty Engagement
Program participation level:

**Program Activity**
- Active loyalty member (enrolled and earning)
- Elite qualifying flights/nights (progression)
- Status match activity (competition participation)
- Member engagement score

**Redemption Behavior**
- Points redemption frequency
- Redemption type (flights, hotel, experiences)
- Redemption value utilization (how much of earned points redeemed)

**Implementation**
```sql
SELECT user_id,
  COUNT(*) as total_loyalty_qualifying_stays,
  SUM(nights_earned) as total_nights_earned,
  COUNT(CASE WHEN points_redeemed > 0 THEN 1 END) as redemption_count,
  SUM(points_redeemed) as lifetime_points_redeemed,
  SUM(points_redeemed) / SUM(lifetime_points_earned) as redemption_utilization_rate
FROM loyalty_transactions
GROUP BY user_id
```

## Trip Characteristics

### Trip Duration
Length of stay patterns:

**Duration Metrics**
- Average trip length (nights)
- Trip duration variance (flexible vs. set itineraries)
- Shortest trip (weekend getaway)
- Longest trip (extended vacation)

**Duration Trend**
- Are trips getting longer or shorter?
- Trip duration by destination type (beach = longer?)

**Implementation**
```sql
SELECT user_id,
  AVG(DATE_DIFF(checkout_date, checkin_date, DAY)) as avg_trip_length_nights,
  STDDEV(DATE_DIFF(checkout_date, checkin_date, DAY)) as trip_length_stddev,
  MIN(DATE_DIFF(checkout_date, checkin_date, DAY)) as shortest_trip,
  MAX(DATE_DIFF(checkout_date, checkin_date, DAY)) as longest_trip
FROM bookings
GROUP BY user_id
```

### Seasonal Travel
Timing and seasonality:

**Season Preference**
- Preferred travel season (spring, summer, fall, winter)
- School holiday travel (family vacations)
- Peak season vs. off-season preference
- Weather-driven patterns (beach summers, ski winters)

**Holiday Travel**
- Holiday travel frequency
- Holiday destination choices

**Implementation**
```sql
SELECT user_id,
  COUNT(CASE WHEN EXTRACT(QUARTER FROM travel_start_date) = 2 THEN 1 END) / COUNT(*) as pct_spring_trips,
  COUNT(CASE WHEN EXTRACT(MONTH FROM travel_start_date) IN (12,1,2) THEN 1 END) / COUNT(*) as pct_winter_trips,
  COUNT(CASE WHEN is_holiday_travel THEN 1 END) / COUNT(*) as pct_holiday_trips
FROM bookings
GROUP BY user_id
```

## Common Travel Models

### Next Booking Prediction
Predict which customers will book soon:

**Target Definition**
- Will book in next 30/60 days (yes/no)
- Days until next booking (regression)

**Feature Selection**
- Days since last booking (recency)
- Booking frequency (baseline likelihood)
- Seasonal patterns (what time of year do they book?)
- Loyalty engagement (active members book more)
- Historical booking value (wealthy segments book more)

**Recommended Model**: LOGISTIC_REG or DNN_CLASSIFIER

### Destination Recommendation
Predict which destination interests customer:

**Target Definition**
- Will book to destination (yes/no)
- Rating given to destination

**Feature Selection**
- Historical destination preferences (similar to past trips?)
- Destination popularity (trending destinations)
- Peer recommendations (friends going there?)
- Season alignment (destination weather matches preference)
- Price point alignment (budget vs. luxury destinations)

**Recommended Model**: DNN_CLASSIFIER or collaborative filtering

### Upgrade Propensity
Predict who will upgrade room/service:

**Target Definition**
- Upgraded hotel room class during stay
- Purchased ancillary services (spa, activities)

**Feature Selection**
- Historical booking value (wealthy customers upgrade)
- Loyalty tier (elite members upgrade more)
- Prior upgrade history (repeats behavior)
- Room type preference evolution

**Recommended Model**: LOGISTIC_REG or BOOSTED_TREE

### Booking Value Prediction
Predict trip spending:

**Target Definition**
- Total booking value ($)
- Booking value range (budget, mid, premium)

**Feature Selection**
- Historical average booking value
- Destination type (beach resorts vs. city hotels)
- Group size (families spend more)
- Trip duration (longer = more spend)
- Loyalty status (loyalty members book better rates but higher total spend?)

**Recommended Model**: LINEAR_REG or BOOSTED_TREE_REGRESSOR

## Feature Engineering Best Practices

1. **Temporal Alignment**: Features as of booking date (not travel date)
2. **Recency Weighting**: Recent bookings more predictive than old bookings
3. **Destination Encoding**: Use destination embeddings for high cardinality
4. **Seasonality**: Include month and quarter of travel
5. **Price Normalization**: Normalize for currency and inflation

## Cost Optimization Tips

- Use `query_builder` before large booking aggregations (hotels + bookings join)
- Pre-compute destination embeddings separately
- Batch score recommendations rather than real-time per-user
- Use APPROX_QUANTILES for percentile calculations
- Materialize destination aggregations in a separate table

## Model Monitoring

- **Destination Shifts**: Are travelers going to different destinations (preference change)?
- **Booking Window Change**: Are advance booking windows shrinking (market competition)?
- **Loyalty Engagement**: Is member activity increasing/decreasing?
- **Seasonality Shift**: Are seasonal patterns changing (climate impact)?
- **Price Sensitivity**: Is average booking value declining (economic pressure)?
