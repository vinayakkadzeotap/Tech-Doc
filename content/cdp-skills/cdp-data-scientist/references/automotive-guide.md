# Automotive Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for automotive manufacturers and dealers. Focus on purchase intent, service retention, and customer lifecycle.

## Ownership Features

### Vehicle Characteristics
Vehicle information and age:

**Vehicle Details**
- Vehicle age (years owned)
- Mileage (usage intensity)
- Model and trim (price tier indicator)
- Powertrain (gas, hybrid, electric)
- Color and exterior features

**Fleet Status**
- Primary vehicle (owner's main car?)
- Multi-vehicle household (other vehicles?)
- Trade-in readiness (age/mileage indicators)

**Implementation**
```sql
SELECT customer_id,
  CURRENT_DATE() - purchase_date as ownership_days,
  odometer_current as current_mileage,
  CURRENT_DATE() - model_year as vehicle_age_years,
  powertrain_type,
  CASE WHEN ownership_days < 365 THEN 'new_owner'
       WHEN ownership_days < 1825 THEN 'established_owner'
       ELSE 'long_term_owner' END as ownership_stage
FROM vehicle_registry
```

### Usage Patterns
Mileage and driving behavior:

**Mileage Trends**
- Annual mileage (high vs. low driver)
- Mileage trend (accelerating use vs. declining)
- Monthly average mileage
- Mileage distribution (consistent vs. sporadic use)

**Driving Intensity**
- Miles per month (baseline usage)
- High-mileage indicator (>15K miles/year)
- Low-mileage indicator (<5K miles/year)
- Aggressive driving signals (spike in mileage = heavy use)

**Implementation**
```sql
SELECT customer_id,
  vehicle_id,
  AVG(monthly_mileage) as avg_monthly_miles,
  SUM(CASE WHEN EXTRACT(YEAR FROM service_date) = EXTRACT(YEAR FROM CURRENT_DATE()) THEN mileage_at_service ELSE 0 END) / COUNT(*) as current_year_mileage,
  MAX(monthly_mileage) as peak_month_miles,
  STDDEV(monthly_mileage) as mileage_consistency
FROM mileage_tracking
GROUP BY customer_id, vehicle_id
```

## Service Behavior

### Service History
Maintenance and repair patterns:

**Service Frequency**
- Services per year (maintenance adherence)
- Days between services (interval consistency)
- Overdue service rate (deferred maintenance)

**Service Type Distribution**
- Scheduled maintenance (oil changes, filters)
- Warranty repairs (covered defects)
- Out-of-warranty repairs (wear items, accidents)
- Major service completion (30K, 60K, 100K mile services)

**Implementation**
```sql
SELECT customer_id,
  vehicle_id,
  COUNT(*) as total_services,
  COUNT(DISTINCT YEAR(service_date)) as service_years,
  AVG(DATE_DIFF(service_date, LAG(service_date) OVER (PARTITION BY customer_id, vehicle_id ORDER BY service_date), DAY)) as avg_days_between_service,
  COUNT(CASE WHEN service_type='scheduled' THEN 1 END) as scheduled_services,
  COUNT(CASE WHEN service_type='warranty' THEN 1 END) as warranty_claims
FROM service_history
GROUP BY customer_id, vehicle_id
```

### Service Spend
Maintenance investment:

**Service Cost Metrics**
- Lifetime service spend (loyalty indicator)
- Average service cost
- Annual service spend (current intensity)
- Parts vs. labor ratio

**Cost Trends**
- Increasing service costs (aging vehicle signal)
- Cost acceleration (major repairs approaching?)
- Warranty exhaustion (when does warranty expire?)

**Implementation**
```sql
SELECT customer_id,
  vehicle_id,
  SUM(service_cost) as lifetime_service_spend,
  AVG(service_cost) as avg_service_cost,
  SUM(CASE WHEN EXTRACT(YEAR FROM service_date) = EXTRACT(YEAR FROM CURRENT_DATE()) THEN service_cost ELSE 0 END) as ytd_service_spend,
  SUM(parts_cost) / SUM(service_cost) as parts_pct,
  CURRENT_DATE() - warranty_expiration_date as days_past_warranty
FROM service_history
GROUP BY customer_id, vehicle_id
```

### Service Loyalty
Dealer vs. aftermarket service:

**Dealership Service**
- % of services at dealership (dealer loyalty)
- Dealership service trend (increasing or declining)
- Dealership visit consistency (same dealership?)

**Dealership Defection**
- Moved to aftermarket shop (dealer lost customer)
- Multi-shop pattern (no loyalty)

**Implementation**
```sql
SELECT customer_id,
  COUNT(CASE WHEN service_location_type='dealership' THEN 1 END) / COUNT(*) as pct_dealership_service,
  COUNT(DISTINCT CASE WHEN service_location_type='dealership' THEN service_location_id END) as distinct_dealerships,
  COUNT(CASE WHEN service_location_type='independent' THEN 1 END) / COUNT(*) as pct_independent_service
FROM service_history
GROUP BY customer_id
```

## Purchase Intent Features

### Configurator Engagement
Shopping behavior signals:

**Configurator Activity**
- Visits to vehicle configurator
- Time spent configuring
- Configurations saved
- Configuration changes (indecision signal vs. refinement)

**Configuration Preferences**
- Trim level explored (price segment)
- Features added (must-haves vs. nice-to-haves)
- Color/exterior options
- Powertrain selection (gas, hybrid, EV interest)

**Implementation**
```sql
SELECT customer_id,
  COUNT(*) as configurator_visits,
  AVG(session_duration_minutes) as avg_config_time,
  COUNT(SAVED_CONFIGURATION) as saved_configs,
  MOST_RECENT_SAVED_TRIM as preferred_trim,
  COUNT(CASE WHEN is_ev_configuration THEN 1 END) as ev_configurations_explored
FROM configurator_activity
GROUP BY customer_id
```

### Test Drive Requests
Purchase progression signals:

**Test Drive Frequency**
- Test drives requested (purchase journey stage)
- Test drives completed (conversion indicator)
- No-show rate (serious interest?)
- Test drives per vehicle model

**Test Drive Behavior**
- Time from request to test drive (urgency)
- Vehicle models test driven (consideration set)
- Trade-in vehicle details (replacement pattern)

**Implementation**
```sql
SELECT customer_id,
  COUNT(*) as test_drive_requests,
  COUNT(CASE WHEN completed THEN 1 END) as test_drives_completed,
  COUNT(CASE WHEN no_showed THEN 1 END) / COUNT(*) as no_show_rate,
  ARRAY_AGG(DISTINCT vehicle_model) as models_tested,
  AVG(DATE_DIFF(test_drive_date, request_date, DAY)) as avg_days_to_test_drive
FROM test_drive_requests
GROUP BY customer_id
```

### Lead Quality
Purchase intent strength:

**Lead Scoring Components**
- Web activity (site visits, time spent)
- Email engagement (open rate, click rate)
- Contact frequency (how often contacted dealer)
- Content consumption (brochure downloads, video views)

**Lead Progression**
- Leads progressing to test drive (conversion %)
- Test drives progressing to purchase (close rate)
- Lead-to-purchase cycle time

**Implementation**
```sql
SELECT customer_id,
  COUNT(DISTINCT CASE WHEN activity_type='web_visit' THEN date END) as website_visit_days,
  COUNT(CASE WHEN activity_type='email_open' THEN 1 END) as email_opens,
  COUNT(CASE WHEN activity_type='email_click' THEN 1 END) as email_clicks,
  DATE_DIFF(CURRENT_DATE(), MAX(activity_date), DAY) as days_since_activity,
  CASE WHEN days_since_activity < 7 THEN 'hot'
       WHEN days_since_activity < 30 THEN 'warm'
       ELSE 'cold' END as lead_temperature
FROM customer_activity
GROUP BY customer_id
```

## Financial Features

### Payment Method and Financing
Purchase financing indicators:

**Financing Status**
- Financed vs. cash purchase (financing need)
- Loan amount (purchase budget)
- Loan term (payment affordability)
- Interest rate (credit quality proxy)

**Payment Behavior**
- On-time payment rate (credit reliability)
- Payment pattern (consistent vs. variable)

**Implementation**
```sql
SELECT customer_id,
  financing_method,
  CASE WHEN financing_method='loan' THEN 'financed' ELSE 'cash' END as purchase_type,
  loan_amount,
  loan_term_months,
  interest_rate,
  COUNT(CASE WHEN payment_status='on_time' THEN 1 END) / COUNT(*) as on_time_payment_rate
FROM vehicle_financing
GROUP BY customer_id
```

### Warranty and Insurance
Risk tolerance indicators:

**Warranty Selection**
- Extended warranty purchased (risk aversion)
- Warranty type (bumper-to-bumper vs. powertrain)
- Warranty duration (3yr vs. 10yr confidence)

**Insurance Status**
- Gap insurance (financing risk)
- Auto insurance partner (financing relationship depth)

**Implementation**
```sql
SELECT customer_id,
  vehicle_id,
  CASE WHEN extended_warranty_purchased THEN 'extended' ELSE 'standard' END as warranty_type,
  warranty_coverage_type,
  CURRENT_DATE() - warranty_expiration_date as days_until_expiration,
  gap_insurance_purchased,
  insurance_provider
FROM vehicle_warranty
GROUP BY customer_id, vehicle_id
```

## Behavioral Features

### Digital Engagement
Online interaction patterns:

**Website Activity**
- Website visits (research activity)
- Pages viewed (information depth)
- Time on site (engagement depth)
- Repeat visits (sustained interest)

**Digital Communication**
- Newsletter subscription (interest signal)
- App downloads (mobile engagement)
- Push notification engagement

**Implementation**
```sql
SELECT customer_id,
  COUNT(*) as website_visits,
  SUM(pages_per_visit) as total_pages_viewed,
  AVG(session_duration_minutes) as avg_session_length,
  COUNT(DISTINCT DATE(visit_date)) as active_days,
  CASE WHEN newsletter_subscribed THEN 'subscribed' ELSE 'unsubscribed' END as newsletter_status
FROM digital_activity
GROUP BY customer_id
```

### Loyalty Program
Brand engagement signal:

**Program Participation**
- Loyalty member (brand engagement)
- Program tier (purchase history level)
- Points accumulated (spending history)
- Points redeemed (engagement depth)

**Implementation**
```sql
SELECT customer_id,
  loyalty_member,
  member_tier,
  lifetime_points_earned,
  lifetime_points_redeemed,
  CURRENT_DATE() - last_loyalty_activity as days_since_activity
FROM loyalty_program
GROUP BY customer_id
```

## Common Automotive Models

### Purchase Propensity
Predict vehicle purchase likelihood:

**Target Definition**
- Will purchase vehicle in next 90 days
- Or: High purchase intent score

**Feature Selection**
- Test drive completed (strong signal)
- Configurator activity (research stage)
- Web engagement trend (increasing visits)
- Lead age (how long in pipeline)
- Trade-in value (affordability assessment)
- Current vehicle age (replacement cycle)

**Recommended Model**: DNN_CLASSIFIER (non-linear intent signals) or LOGISTIC_REG (interpretability)

### Service Retention
Predict dealership service loyalty:

**Target Definition**
- Will return to dealership for next service
- Or: Defection to independent shop

**Feature Selection**
- Service history at dealership (habit formation)
- Service satisfaction (last visit rating)
- Service cost trend (pricing competitiveness)
- Warranty status (warranty service required at dealer)
- Vehicle age (newer vehicles more likely to use dealer)

**Recommended Model**: LOGISTIC_REG or BOOSTED_TREE

### Trade-In Timing
Predict vehicle trade-in timing:

**Target Definition**
- Will trade in vehicle in next 12 months
- Or: Days until trade-in likely

**Feature Selection**
- Vehicle age (aging curve)
- Mileage accumulated (wear factor)
- Service costs increasing (reliability concern)
- Competitive new model launch (feature gap)
- Trade-in value trend (market timing)

**Recommended Model**: LINEAR_REG (days to trade-in) or LOGISTIC_REG (binary)

### Accessory Purchase Propensity
Predict additional accessory spending:

**Target Definition**
- Will purchase accessories in next 30 days
- Or: Will spend >$500 on accessories

**Feature Selection**
- Historical accessory purchases (repeats pattern)
- Vehicle type (SUVs buy more accessories)
- Demographic (younger buyers more accessories)
- Lifestyle signals (outdoor enthusiasts, performance fans)

**Recommended Model**: LOGISTIC_REG or DNN_CLASSIFIER

## Feature Engineering Best Practices

1. **Vehicle Lifecycle**: Features should reflect vehicle maturity (new, established, long-term)
2. **Mileage Normalization**: Normalize by vehicle age for fair comparison
3. **Warranty Status**: Key feature affecting service behavior
4. **Device Context**: Purchase intent varies by browsing context (mobile research vs. dealer visit)
5. **Seasonality**: Vehicle purchases seasonal (end of model year, tax refund season)

## Cost Optimization Tips

- Use `query_builder` before joining vehicle registry with service history (large tables)
- Aggregate mileage data monthly to reduce cardinality
- Pre-compute vehicle age buckets for efficient grouping
- Batch score purchase intent periodically rather than real-time
- Use APPROX_QUANTILES for mileage percentile calculations

## Model Monitoring

- **Trade-In Timing**: Are vehicles being traded younger than expected (satisfaction issue)?
- **Service Retention**: Is dealership service share declining (competition pressure)?
- **Powertrain Shift**: Is EV interest increasing among prospects?
- **Purchase Cycle**: Is lead-to-purchase time shortening (market competition)?
- **Service Cost Trends**: Are maintenance costs increasing by model year (quality issue)?
