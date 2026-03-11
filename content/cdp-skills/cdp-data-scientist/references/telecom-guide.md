# Telecom Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for telecom analytics. Focus on usage patterns, network quality, plan adoption, and churn prediction.

## Usage Features

### Data Usage Metrics
Mobile data consumption patterns:

**Monthly Data Usage**
- GB per month (recent month, rolling 3/6/12 month averages)
- Data usage trend (increasing/decreasing/stable)
- Peak data usage month (usage during heavy usage season)
- Data usage percentile (heavy vs. light user)

**Usage Velocity**
- Daily average data consumption
- Data usage acceleration (is consumption growing?)
- Days until monthly limit reached (urgency indicator)
- Overage pattern (exceeding plan limits)

**Implementation**
```sql
SELECT subscriber_id,
  SUM(data_gb) as total_data_usage,
  AVG(data_gb) as avg_monthly_data,
  STDDEV(data_gb) as data_usage_stddev,
  MAX(data_gb) as peak_month_data,
  SUM(CASE WHEN data_gb > plan_limit_gb THEN data_gb - plan_limit_gb ELSE 0 END) as total_overage_gb
FROM usage_monthly
GROUP BY subscriber_id
```

### Voice and SMS Usage
Traditional service consumption:

**Voice Usage**
- Voice minutes per month (trend)
- Voice minutes per day (average)
- Peak voice month (seasonal patterns)
- Voice usage decline rate (migration to messaging apps)

**SMS/Messaging**
- SMS count per month
- SMS trend (declining as OTT apps grow)
- Roaming SMS (international indicators)
- Message type mix (SMS vs. MMS)

**Implementation**
```sql
SELECT subscriber_id,
  SUM(voice_minutes) as total_voice_minutes,
  AVG(voice_minutes) as avg_monthly_voice,
  COUNT(*) as call_count,
  AVG(call_duration_minutes) as avg_call_duration,
  SUM(sms_count) as total_sms,
  SUM(CASE WHEN is_roaming THEN sms_count ELSE 0 END) as roaming_sms
FROM usage_monthly
GROUP BY subscriber_id
```

### Usage Patterns
Service mix and preferences:

**Service Mix**
- Primary service (data, voice, or balanced)
- Service concentration (% of usage from primary service)
- Multi-service users (using voice + data + SMS)
- Service switching (were they voice-primary, now data-primary?)

**Roaming Usage**
- Roaming days per month (travel indicator)
- Roaming spend (revenue source or churn signal?)
- Roaming usage intensity (heavy roaming users)

**Implementation**
```sql
SELECT subscriber_id,
  SUM(CASE WHEN usage_type='data' THEN usage_amount ELSE 0 END) as data_usage,
  SUM(CASE WHEN usage_type='voice' THEN usage_amount ELSE 0 END) as voice_usage,
  SUM(CASE WHEN usage_type='sms' THEN usage_amount ELSE 0 END) as sms_usage,
  CASE
    WHEN SUM(CASE WHEN usage_type='data' THEN usage_amount ELSE 0 END) > 100 THEN 'data_heavy'
    WHEN SUM(CASE WHEN usage_type='voice' THEN usage_amount ELSE 0 END) > 500 THEN 'voice_heavy'
    ELSE 'balanced'
  END as usage_profile
FROM usage_detail
GROUP BY subscriber_id
```

## Plan Features

### Plan Characteristics
Subscription tier information:

**Plan Type**
- Current plan name/tier (premium vs. basic)
- Plan price point (proxy for customer value segment)
- Plan features (unlimited data vs. limited)
- Plan category (individual, family, prepaid)

**Plan History**
- Days in current plan (tenure)
- Plan upgrade history (traded up from basic?)
- Plan downgrade history (cost sensitivity signal)
- Number of plan changes (stability indicator)

**Implementation**
```sql
SELECT subscriber_id,
  plan_name,
  plan_price,
  CURRENT_DATE() - plan_activation_date as days_in_plan,
  COUNT(*) as plan_changes_lifetime,
  SUM(CASE WHEN plan_price > LAG(plan_price) OVER (PARTITION BY subscriber_id ORDER BY change_date) THEN 1 ELSE 0 END) as upgrades,
  SUM(CASE WHEN plan_price < LAG(plan_price) OVER (PARTITION BY subscriber_id ORDER BY change_date) THEN 1 ELSE 0 END) as downgrades
FROM plan_history
GROUP BY subscriber_id, plan_name, plan_price, plan_activation_date
```

### Plan-Usage Alignment
How well usage matches plan:

**Usage vs. Limit**
- Data as % of monthly plan limit
- Voice as % of included minutes
- Service limits exceeded (overage frequency)
- Upgrade triggers (approaching limits)

**Upgrade Readiness**
- Is customer bumping against limits? (upgrade candidate)
- Unused allowance (could downgrade)
- Data trend relative to plan (consuming more within limit?)

**Implementation**
```sql
SELECT subscriber_id,
  plan_limit_gb,
  actual_usage_gb,
  ROUND(100 * actual_usage_gb / plan_limit_gb, 1) as usage_percent,
  CASE
    WHEN actual_usage_gb > 0.9 * plan_limit_gb THEN 'upgrade_candidate'
    WHEN actual_usage_gb < 0.1 * plan_limit_gb THEN 'downgrade_candidate'
    ELSE 'well_matched'
  END as plan_fit
FROM current_plans
LEFT JOIN usage_summary USING (subscriber_id)
```

## Device Features

### Device Information
Mobile device characteristics:

**Device Type**
- Device model and brand
- Device capability (4G vs. 5G capable)
- Device age (years since model release)
- Device price tier (indicator of customer segment)

**Device Technology**
- Operating system (iOS vs. Android)
- OS version (updated vs. outdated)
- 5G capability (early adopter or laggard?)

**Implementation**
```sql
SELECT subscriber_id,
  device_brand,
  device_model,
  device_os,
  CURRENT_DATE() - device_launch_date as device_age_days,
  CASE WHEN capability_5g = TRUE THEN '5G' ELSE '4G' END as network_capable,
  CASE
    WHEN device_price_msrp > 1000 THEN 'premium'
    WHEN device_price_msrp > 500 THEN 'mid_range'
    ELSE 'budget'
  END as device_segment
FROM device_registry
```

### Device Upgrade Patterns
Equipment replacement behavior:

**Upgrade History**
- Time since last device upgrade (replacement cycle)
- Device upgrade frequency (quick upgrader vs. keeper)
- Upgrade to same brand (loyalty indicator)
- Upgrade to different OS (customer retention risk)

**Upgrade Timing**
- Device age at upgrade (typical lifecycle)
- Seasonal upgrade pattern (new release cycles)
- Upgrade to 5G (early adoption signal)

**Implementation**
```sql
SELECT subscriber_id,
  COUNT(*) as device_upgrades,
  AVG(days_between_upgrades) as avg_upgrade_cycle,
  COUNT(DISTINCT device_brand) as distinct_brands,
  CASE WHEN latest_device_brand = previous_device_brand THEN 'same_brand' ELSE 'switched_brand' END as upgrade_pattern
FROM (
  SELECT subscriber_id,
    device_brand as latest_device_brand,
    LAG(device_brand) OVER (PARTITION BY subscriber_id ORDER BY activation_date) as previous_device_brand,
    DATE_DIFF(activation_date, LAG(activation_date) OVER (PARTITION BY subscriber_id ORDER BY activation_date), DAY) as days_between_upgrades
  FROM device_activations
)
GROUP BY subscriber_id
```

## Behavioral Features

### Recharge Patterns
Payment and account behavior:

**Recharge Frequency**
- Days between recharges (payment consistency)
- Recharge amount distribution (payment preference)
- Auto-recharge status (convenience engagement)

**Payment Method**
- Preferred payment method (credit card, account credit, USSD)
- Payment failures (bad credit cards, account issues?)
- Payment consistency (on-time vs. frequently late)

**Implementation**
```sql
SELECT subscriber_id,
  COUNT(*) as total_recharges,
  AVG(days_between_recharges) as avg_recharge_interval,
  AVG(recharge_amount) as avg_recharge_amount,
  CASE WHEN has_auto_recharge THEN 'auto' ELSE 'manual' END as recharge_type,
  COUNT(CASE WHEN payment_status='failed' THEN 1 END) as failed_payments
FROM recharge_history
GROUP BY subscriber_id
```

### Complaint and Service Activity
Customer service signals:

**Complaint Frequency**
- Total complaints (satisfaction indicator)
- Complaint type (billing, quality, service)
- Complaint resolution time
- Repeat complainers (habitual issues)

**Support Contact**
- Support calls (via call center)
- Chat support usage
- Online portal activity (self-service vs. support-dependent)

**Implementation**
```sql
SELECT subscriber_id,
  COUNT(*) as total_complaints,
  COUNT(DISTINCT complaint_type) as complaint_variety,
  AVG(TIMESTAMP_DIFF(resolution_date, complaint_date, DAY)) as avg_resolution_days,
  SUM(CASE WHEN complaint_status='unresolved' THEN 1 ELSE 0 END) as open_complaints
FROM complaints
GROUP BY subscriber_id
```

## Network Quality Features

### Quality Metrics
Service quality indicators:

**Network Performance**
- Average data speed (Mbps)
- Speed consistency (variance)
- 4G coverage availability (%)
- Call drop rate (%)
- Network reliability score

**Quality Experience**
- Days with good quality (>90th percentile)
- Days with poor quality (<10th percentile)
- Quality trend (improving vs. degrading)

**Implementation**
```sql
SELECT subscriber_id,
  AVG(data_speed_mbps) as avg_speed,
  STDDEV(data_speed_mbps) as speed_consistency,
  PERCENTILE_CONT(data_speed_mbps, 0.5) OVER (PARTITION BY subscriber_id) as median_speed,
  SUM(CASE WHEN call_dropped THEN 1 ELSE 0 END) / COUNT(*) as drop_rate,
  COUNT(DISTINCT CASE WHEN data_speed_mbps > PERCENTILE_CONT(data_speed_mbps, 0.9) OVER () THEN DATE(measurement_time) END) as excellent_days
FROM quality_measurements
GROUP BY subscriber_id
```

## Common Telecom Models

### Churn Prediction
Predict subscriber defection:

**Target Definition**
- Account disconnected (yes/no)
- Or: Account inactive for 60 days (dormant churn)

**Feature Selection**
- Usage trend (declining usage precedes churn)
- Plan-usage mismatch (unsatisfied customers)
- Quality issues (poor network experience)
- Complaint frequency (unresolved issues)
- Device capability (5G users less likely to churn?)
- Competitive pressure (known in high-competition areas)

**Recommended Model**: LOGISTIC_REG (fast, interpretable) or BOOSTED_TREE (robust)

### Upsell Propensity
Predict upgrade likelihood:

**Target Definition**
- Upgraded to higher-tier plan in next 30 days
- Added new service in next 30 days

**Feature Selection**
- Data usage approaching limits (upgrade trigger)
- Device upgrade to 5G (capability availability)
- Historical upgrade pattern (repeats behavior)
- Plan tenure (mature customers more stable)
- Service satisfaction (complaints = resistance)

**Recommended Model**: LOGISTIC_REG or DNN_CLASSIFIER

### Credit Risk
Predict payment difficulty:

**Target Definition**
- Late payment (>30 days) in next 60 days
- Account suspension for non-payment

**Feature Selection**
- Payment pattern consistency (reliable payers)
- Failed payment frequency (collections issue)
- Account tenure (newer customers more risk)
- Plan price vs. income proxy (spending affordability)
- External credit score (if available)

**Recommended Model**: BOOSTED_TREE (robust to missing credit data)

## Feature Engineering Best Practices

1. **Temporal Windows**: Use 30/60/90 day lookback windows for trend features
2. **Normalization**: Normalize usage features (per plan limits) for fair comparison
3. **Categorical Encoding**: Device model as categorical, not numeric ordinal
4. **Trend Direction**: Include velocity features (change in usage month-over-month)
5. **Quality Integration**: Join quality metrics by cell tower / location, not just account level

## Cost Optimization Tips

- Use `query_builder` before joining large usage tables with quality data
- Aggregate usage data at monthly level, not daily (10-30x cost savings)
- Device registry can be left-joined (less frequent updates)
- Use approximate percentiles (APPROX_QUANTILES) for speed bucketing
- Pre-materialize common feature sets in a features table

## Model Monitoring

- **Usage Trend Shift**: Declining average data usage (market saturation?)
- **Device Mix Change**: Rapid 5G adoption (requires model retraining)
- **Quality Baseline**: Network improvements (quality feature distribution shifts)
- **Plan Migration**: Customers moving to different plan types
- **Churn Rate**: Is baseline churn increasing (competitive pressure)?
