# Retail Audience Finding Guide

## Overview
Retail marketing benefits from RFM analysis and product affinity segmentation. Use CDP data to identify high-value customer segments, behavioral buyers, and cross-sell opportunities.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Transaction history (date, amount, product category)
- Product purchases and browsing behavior
- Loyalty program enrollment and tier status
- Cart/basket contents and abandonment events
- Return/refund history
- Promotional code redemption patterns
- Email/SMS engagement metrics
- Store visit frequency and location data
- Payment method preferences
- Customer demographics (age, gender, location)

```
schema_discovery operation: "overview"
schema_discovery operation: "store", store_type: "event_store"
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Recency**: Days since last purchase (30/60/90 day windows)
- **Frequency**: Transaction count (monthly/quarterly/annual)
- **Monetary**: Average order value, lifetime value, seasonal spending
- **Category affinity**: Product purchase distribution
- **Basket size**: Items per transaction
- **Discount sensitivity**: Redemption rates vs full-price purchase ratio

```
feature_analysis columns: ["transaction_amount", "purchase_frequency", "last_purchase_date",
  "product_category", "loyalty_tier"],
metric_types: ["basic", "statistical"]
```

## Common Audience Definitions

### 1. VIP/High-Value Customers
**Filter Criteria:**
- LTV > 95th percentile
- Purchase frequency: monthly or more
- Monetary: AOV > regional median + 50%
- Loyalty tier: Gold/Platinum

**Expected Size:** 5-8% of base
**Activation:** Exclusive previews, early access sales, concierge support, VIP-only events

### 2. Seasonal Holiday Shoppers
**Filter Criteria:**
- Purchase concentration: Oct-Dec spike
- Transaction count Nov/Dec > avg monthly x3
- Category: Gift items, festive products
- First purchase: Sep-Oct timeframe

**Expected Size:** 12-18% of base
**Activation:** Holiday campaigns, gift guides, extended return windows, holiday bundles

### 3. Cart Abandoners (High-Intent)
**Filter Criteria:**
- Cart abandonment event: last 7-14 days
- Abandonment count: 1-2 (not serial abandoners)
- Item value: >$50
- Device: Desktop (higher conversion potential)

**Expected Size:** 8-12% of active users
**Activation:** Abandoned cart email, 10-15% discount offer, retargeting ads

### 4. First-Time Buyers
**Filter Criteria:**
- Customer age: 0-30 days
- Transaction count: 1
- Source: Organic, paid search, referral
- No returns within 30 days (quality indicator)

**Expected Size:** 15-25% monthly cohort
**Activation:** Welcome series, onboarding content, first purchase discount (second order)

### 5. At-Risk Churners (Loyal but Silent)
**Filter Criteria:**
- Historical frequency: 4+ purchases/year
- Recency: 60+ days since last purchase
- Recent trend: Purchase frequency declining >30%
- No engagement: Email opens <10% over last 3 months

**Expected Size:** 10-15% of base
**Activation:** Win-back campaigns, exclusive comeback offers, personalized product recommendations

### 6. Cross-Sell Ready (Category Expansion)
**Filter Criteria:**
- LTV: Above median
- Category count: Only 1-2 categories purchased
- Frequency: Active (purchase in last 30 days)
- AOV: Increasing trend over 3 months

**Expected Size:** 20-30% of base
**Activation:** Category-specific recommendations, bundle offers, discovery emails

### 7. Full-Price Buyers (Discount-Resistant)
**Filter Criteria:**
- Full-price purchase %: >80% of transactions
- Frequency: Regular (monthly+)
- Monetary: Above median AOV
- Promo code redemption: <10%

**Expected Size:** 12-18% of base
**Activation:** Premium/new arrivals, early access to best-sellers, loyalty rewards (not discounts)

### 8. Basket Builders (High-Item Count)
**Filter Criteria:**
- Average items per transaction: >4
- AOV: Above median
- Category diversity: 3+ categories per order
- Return rate: <15% (satisfaction indicator)

**Expected Size:** 15-20% of base
**Activation:** Multi-item bundles, tiered discounts, free shipping thresholds

## Example Audience Queries

### Query 1: VIP Birthday Campaign
```sql
SELECT user_id, customer_email, last_purchase_date, lifetime_value
FROM customer_profiles
WHERE lifetime_value > (
  SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY lifetime_value)
  FROM customer_profiles
)
AND purchase_frequency >= 12
AND loyalty_tier IN ('Gold', 'Platinum')
AND MONTH(birth_date) = MONTH(CURRENT_DATE)
AND DATEDIFF(day, last_purchase_date, CURRENT_DATE) <= 30
```

### Query 2: Back-to-School Seasonal Buyers
```sql
SELECT DISTINCT user_id, customer_email, last_purchase_date
FROM orders
WHERE MONTH(order_date) BETWEEN 7 AND 8
AND product_category IN ('Apparel', 'Backpacks', 'School Supplies', 'Electronics')
AND YEAR(order_date) = YEAR(CURRENT_DATE)
AND purchase_count >= 2
GROUP BY user_id, customer_email, last_purchase_date
HAVING COUNT(*) >= 2
```

### Query 3: Cart Abandoners with High-Value Items (Win-Back)
```sql
SELECT user_id, customer_email, abandoned_cart_value, abandoned_items_count,
       days_since_abandonment
FROM cart_events
WHERE event_type = 'abandoned'
AND abandoned_cart_value > 50
AND days_since_abandonment <= 14
AND abandoned_items_count < 10
AND user_id NOT IN (
  SELECT user_id FROM orders
  WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY)
)
ORDER BY abandoned_cart_value DESC
```

## Activation Channel Recommendations

| Segment | Email | SMS | Paid Search | Retargeting | Direct Mail | In-Store |
|---------|-------|-----|-------------|------------|------------|----------|
| VIP | High | High | Premium | Yes | Yes | Yes |
| Holiday Shoppers | Very High | High | High | Yes | Yes | Yes |
| Cart Abandoners | Very High | Medium | High | Very High | No | No |
| First-Time Buyers | Very High | Medium | Medium | High | No | No |
| At-Risk Churners | High | Medium | Medium | Yes | Yes | Yes |
| Cross-Sell Ready | High | Medium | High | Yes | No | Medium |
| Full-Price Buyers | High | Low | Medium | Yes | Yes | Medium |
| Basket Builders | Medium | Medium | Medium | Medium | No | Medium |

## Tips for Success

1. Update RFM scores weekly for timely win-back campaigns
2. Use cohort analysis for seasonal patterns (back-to-school, holidays, Valentine's)
3. Monitor basket size trends—increases indicate cross-sell success
4. Segment holiday shoppers early (Aug-Sep) for planning
5. Test discount offers only on discount-sensitive segments to maintain margin
6. Track first-purchase repeat rate to evaluate acquisition quality
7. Use time_travel tool to analyze purchase pattern changes over quarters
