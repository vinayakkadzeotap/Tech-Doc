# Retail Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches and common models for retail use cases. Focus on capturing purchase behavior, product affinities, and customer value drivers.

## Purchase-Based Features

### Recency Features
Time-based measures of purchase frequency:

**Core Recency**
- Days since last purchase (lower = more recent)
- Date of last purchase (capture seasonality)
- Recency buckets (0-30, 30-90, 90-180, 180+ days)
- Recency trend (comparing to previous period)

**Implementation**
```sql
SELECT user_id,
  CURRENT_DATE() - MAX(purchase_date) as days_since_last_purchase,
  MAX(purchase_date) as last_purchase_date,
  COUNT(*) OVER (PARTITION BY user_id ORDER BY purchase_date ROWS BETWEEN 180 PRECEDING AND CURRENT ROW) as purchase_count_180d
FROM purchases
GROUP BY user_id
```

### Frequency Features
Purchase count and patterns:

**Purchase Frequency**
- Total purchases (lifetime)
- Purchases in 30/60/90/180/365 days (rolling windows)
- Average purchase frequency per month
- Purchase frequency trend (accelerating vs. declining)

**Purchase Intervals**
- Average days between purchases (loyalty indicator)
- Purchase interval variance (consistency signal)
- Days since second-to-last purchase (pattern continuity)
- % of customers with increasing purchase frequency

**Implementation**
```sql
SELECT user_id,
  COUNT(*) as lifetime_purchases,
  COUNTIF(purchase_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) as purchases_30d,
  COUNTIF(purchase_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY)) as purchases_365d,
  AVG(DATE_DIFF(purchase_date, LAG(purchase_date) OVER (PARTITION BY user_id ORDER BY purchase_date), DAY)) as avg_days_between_purchases
FROM purchases
WHERE purchase_date IS NOT NULL
GROUP BY user_id
```

### Monetary Features
Spending patterns and value:

**Spending Metrics**
- Total lifetime spend (customer value proxy)
- Average order value (AOV)
- AOV trend (increasing/decreasing)
- Median purchase value
- Max purchase value (highest transaction)

**Spending Velocity**
- Total spend in 30/90/365 days
- Average spend per day active
- Spending acceleration (comparing periods)
- Spend variance (consistency)

**Implementation**
```sql
SELECT user_id,
  SUM(order_value) as lifetime_spend,
  AVG(order_value) as avg_order_value,
  SUM(CASE WHEN purchase_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) THEN order_value ELSE 0 END) as spend_90d,
  STDDEV(order_value) as spend_stddev,
  COUNT(DISTINCT DATE(purchase_date)) as purchase_days
FROM purchases
GROUP BY user_id
```

### Inter-Purchase Time Features
Timing patterns:

**Purchase Interval Analysis**
- Modal (most common) days between purchases
- Median inter-purchase time
- Purchase interval consistency (low variance = predictable)
- Rate of interval change (is customer accelerating/decelerating?)

**Implementation**
```sql
SELECT user_id,
  AVG(days_between) as avg_interval,
  STDDEV(days_between) as interval_stddev,
  PERCENTILE_CONT(days_between, 0.5) OVER (PARTITION BY user_id) as median_interval,
  PERCENTILE_CONT(days_between, 0.9) OVER (PARTITION BY user_id) as p90_interval
FROM (
  SELECT user_id,
    DATE_DIFF(purchase_date, LAG(purchase_date) OVER (PARTITION BY user_id ORDER BY purchase_date), DAY) as days_between
  FROM purchases
) intervals
WHERE days_between > 0
GROUP BY user_id
```

## Product-Based Features

### Category Affinity
Product preference and engagement:

**Category Penetration**
- Number of distinct categories purchased
- % of available categories purchased
- Category diversity score (entropy measure)
- Dominant category (% of spend)

**Category Engagement**
- Purchase frequency per category
- Spend per category
- Recency per category (when last bought from category)
- Category switching rate

**Implementation**
```sql
SELECT user_id,
  COUNT(DISTINCT category) as distinct_categories,
  ARRAY_AGG(STRUCT(category, COUNT(*) as count, SUM(order_value) as spend) ORDER BY COUNT(*) DESC LIMIT 10) as category_mix
FROM purchases
GROUP BY user_id
```

### Brand Loyalty
Brand preference patterns:

**Brand Engagement**
- Favorite brands (top 3-5 by purchase count or spend)
- Concentration (Herfindahl index: 0 = diverse, 1 = single brand)
- Brand switching rate (% of purchases from different brand)
- Brand recency (days since last brand purchase)

**Multi-Brand vs. Single-Brand**
- Customers with 1 brand (high loyalty but narrow)
- Customers with 5+ brands (price shopping behavior?)
- Brand diversity score (how spread is spending?)

**Implementation**
```sql
SELECT user_id,
  COUNT(DISTINCT brand) as distinct_brands,
  (SUM(brand_spend_share * brand_spend_share)) as herfindahl_index,
  ARRAY_AGG(DISTINCT brand ORDER BY RAND() LIMIT 1)[OFFSET(0)] as favorite_brand
FROM (
  SELECT user_id, brand, SUM(order_value) as brand_spend_share
  FROM purchases
  GROUP BY user_id, brand
)
GROUP BY user_id
```

## Behavioral Features

### Browsing and Engagement
Pre-purchase behavior:

**Browsing Activity**
- Pages per session
- Browse-to-purchase rate (% of sessions converting)
- Time-on-site distribution
- Device switching (start on mobile, complete on desktop?)

**Search Behavior**
- Search frequency
- Search-to-purchase conversion
- Search keywords (category vs. specific product)
- Repeat search patterns (searching for same item)

**Implementation**
```sql
SELECT user_id,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNTIF(has_purchase) as sessions_with_purchase,
  COUNTIF(has_purchase)/COUNT(DISTINCT session_id) as session_conversion_rate,
  AVG(pages_per_session) as avg_pages_per_session
FROM sessions
GROUP BY user_id
```

### Cart Activity
Purchase intent indicators:

**Cart Addition Pattern**
- Items added to cart (total)
- Cart abandonment rate (add to cart but no purchase)
- Time in cart before purchase (how long deciding?)
- Multiple cart updates (indecision signal vs. batch adding)

**Cart Value Patterns**
- Average cart value
- Cart value at abandonment (price sensitivity signal?)
- Items per cart (basket size)

**Implementation**
```sql
SELECT user_id,
  COUNT(*) as total_cart_events,
  COUNTIF(event_type='add') as items_added,
  COUNTIF(event_type='abandon') as carts_abandoned,
  COUNTIF(event_type='purchase')/COUNT(DISTINCT CASE WHEN event_type IN ('add', 'purchase') THEN session_id END) as cart_conversion_rate
FROM cart_events
GROUP BY user_id
```

## Time-Based Aggregations

### Rolling Window Aggregations
Create temporal snapshots:

**30-Day Window**
```sql
SELECT user_id,
  SUM(order_value) as spend_30d,
  COUNT(*) as purchases_30d,
  COUNT(DISTINCT category) as distinct_categories_30d
FROM purchases
WHERE purchase_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY user_id
```

**60-Day and 90-Day Windows**
Extend the above with INTERVAL 60/90 DAY

### Year-over-Year Comparisons
Seasonal trend features:

**YoY Spend Comparison**
```sql
SELECT user_id,
  SUM(CASE WHEN EXTRACT(YEAR FROM purchase_date) = EXTRACT(YEAR FROM CURRENT_DATE()) THEN order_value ELSE 0 END) as ytd_spend,
  SUM(CASE WHEN purchase_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY) AND purchase_date < CURRENT_DATE() THEN order_value ELSE 0 END) as last_12m_spend,
  SUM(CASE WHEN purchase_date >= DATE_SUB(DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY), INTERVAL 365 DAY) AND purchase_date < DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY) THEN order_value ELSE 0 END) as prior_12m_spend
FROM purchases
GROUP BY user_id
```

## Common Retail Models

### Churn Prediction
Predict customer defection:

**Target Definition**
- No purchase in last 90 days (considering customer lifecycle)
- Or: No purchase in last N days (adjust N by cohort)

**Feature Selection**
- Recency (primary indicator)
- Frequency trend (declining = churn signal)
- Monetary trend (declining = churn signal)
- Category engagement (narrowing = churn signal)
- Brand loyalty (increasing concentration = single-item risk)

**Recommended Model**: LOGISTIC_REG (interpretability) or BOOSTED_TREE (robustness)

### Next Purchase Prediction
Predict which customers will purchase next:

**Target Definition**
- Binary: purchase in next 30 days (yes/no)

**Feature Selection**
- Days since last purchase (strong predictor)
- Historical purchase frequency (defines baseline likelihood)
- Recent trend (accelerating = more likely)
- Seasonal patterns (what time of year do they usually buy?)

**Recommended Model**: LOGISTIC_REG for speed, DNN_CLASSIFIER for accuracy

### Product Recommendation
Predict which products will interest customer:

**Target Definition**
- Products purchased by customer
- Rating given by customer (if available)

**Feature Selection**
- Customer purchase history (what they've bought before)
- Product popularity (item_id embedding based on co-purchase)
- Customer-product similarity (collaborative filtering)
- Seasonal product relevance

**Recommended Model**: DNN_CLASSIFIER or collaborative filtering

### Lifetime Value (CLV) Prediction
Predict customer future value:

**Target Definition**
- Spend in next 12 months
- Or: Total expected lifetime spend

**Feature Selection**
- Lifetime spend to date
- Average order value (spend trajectory)
- Purchase frequency (engagement level)
- Account tenure (maturity)
- Channel preference (online vs. in-store efficiency)

**Recommended Model**: LINEAR_REG (interpretable) or BOOSTED_TREE (robust)

## Feature Engineering Best Practices

1. **Temporal Consistency**: All features measured at same point in time (no data leakage)
2. **Stability**: Features should be consistent across time (not noisy)
3. **Predictive Power**: Features should correlate with target variable
4. **Scalability**: Features must be computable for entire customer base efficiently
5. **Business Logic**: Features should align with business understanding

## Cost Optimization Tips

- Use `query_builder` to estimate query cost before computing 100+ aggregate features
- Start with top 20 features, add others if model performance improves
- Use approximate aggregations (APPROX_QUANTILES) for percentiles (cheaper)
- Materialize features in a table rather than computing on-the-fly for scoring
- Batch scoring (score all customers daily) cheaper than real-time per-user scoring

## Model Monitoring

- **Feature Drift**: Is recency distribution changing? (customer behavior shift)
- **Target Drift**: Is churn rate changing? (business environment change)
- **Model Decay**: Is prediction accuracy declining? (retrain if AUROC drops 5%+)
