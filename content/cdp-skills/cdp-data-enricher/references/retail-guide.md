# Retail Data Enricher Guide

## Overview
Enrichment playbook for retail organizations, defining critical attributes, signals to derive, and data gaps to fill for customer segmentation and personalization.

## Core Enrichment Attributes

### 1. Purchase Recency/Frequency/Monetary (RFM) Scoring

**Recency Metrics:**
- Days since last purchase (calculated)
- Last purchase date (timestamp)
- Purchase gap trend (accelerating or decelerating)
- Time between purchases (average interval)

**Frequency Metrics:**
- Total purchases in last 12 months (count)
- Average purchases per month (calculated)
- Purchase frequency trend (increasing/decreasing)
- Repeat purchase rate (% of customers with 2+ purchases)

**Monetary Metrics:**
- Lifetime purchase value (sum)
- Average order value (AOV) calculated
- Total spend in last 12 months (sum)
- Spend velocity (trend direction and acceleration)

**Calculation Method:**
- Recency score: 1-5 (5 = purchased within last 30 days)
- Frequency score: 1-5 (5 = 8+ purchases in 12 months)
- Monetary score: 1-5 (5 = top 20% by lifetime spend)
- RFM Combined Score: (R+F+M)/3 (1-5 scale)

**Data Sources:**
- transaction_history table
- order details and payment data
- use `feature_analysis` to compute RFM percentiles

### 2. Product Category Affinity

**Definition:** Propensity to purchase across product categories
**Categories to Track:** Apparel, footwear, accessories, electronics, home goods, beauty, food/beverage

**Metrics to Calculate:**
- Category purchase frequency (purchases in category / total purchases)
- Category spend percentage (spend in category / total spend)
- Category recency (days since last purchase in category)
- Category loyalty (repeat rate within category)
- Cross-category purchase patterns (which categories purchased together)

**Data Sources:**
- Transaction item details
- Product catalog category mapping
- Use `time_travel` to track category purchase sequences

**Enrichment Output:**
- Primary category (highest spend %)
- Secondary category (2nd highest)
- Affinity score by category (1-5 scale)
- Category switching frequency (propensity to change)

### 3. Price Sensitivity Index

**Definition:** Customer responsiveness to discounts and price points
**Calculation Approach:**
- Full-price purchase percentage
- Discount-triggered purchase likelihood
- Price point elasticity (response to $10, $25, $50+ discounts)
- Average discount acceptance rate

**Metrics:**
- Purchases at full price vs discounted (%)
- Average discount needed to trigger purchase
- Incremental spend from promotional offers
- Price sensitivity score: 1-5 (1=price insensitive, 5=highly sensitive)

**Data Sources:**
- Order details with original and final prices
- Discount code application tracking
- Promotional campaign response data
- Use `query_builder` for promotional ROI analysis

**Enrichment Output:**
- Price sensitivity tier (premium/regular/deal-seeker)
- Optimal discount threshold for conversion
- Minimum margin requirements by segment

### 4. Channel Preference Profile

**Definition:** Customer propensity across acquisition and engagement channels
**Channels:** Email, SMS, push notification, retargeting ads, social, direct mail, in-store

**Metrics to Calculate:**
- Channel engagement rate (open/click rates by channel)
- Channel conversion rate (purchase rate by channel)
- Channel preference ranking (ordered by engagement)
- Omnichannel adoption score (uses 3+ channels: 1-5 scale)
- Mobile vs desktop preference ratio
- Device type distribution (phone, tablet, desktop, in-store)

**Data Sources:**
- Customer engagement event logs
- Marketing automation platforms
- Web analytics and attribution
- Use `get_detailed_events` to track channel interactions

**Enrichment Output:**
- Primary channel recommendation (highest engagement)
- Optimal channel mix for customer (2-3 channel combination)
- Channel saturation threshold (max frequency before opt-out)
- Device preference flag (mobile-first vs desktop)

### 5. Seasonal Buying Pattern Analysis

**Definition:** Predictable purchase timing based on seasonal factors
**Seasons:** Winter holidays, summer, back-to-school, spring renewal

**Metrics to Calculate:**
- Peak purchase months (historical pattern)
- Spend increase % during peak seasons
- Product purchases during specific seasons
- Seasonal purchase reliability (consistency year-over-year)
- Holiday gift purchase propensity

**Data Sources:**
- Transaction history with dates
- Product category seasonal demand
- Use `time_travel` to identify seasonal peaks and valleys

**Enrichment Output:**
- Seasonal buyer flag (yes/no)
- Peak season months (list)
- Expected seasonal spend (projected amount)
- Off-season engagement strategy (maintain touch without purchase push)

### 6. Brand Loyalty Score

**Definition:** Propensity to repeat purchase from same brands
**Calculation Approach:**
- Repeat brand purchase rate (purchases from same brand / total purchases)
- Brand diversity index (number of unique brands purchased from)
- Brand switching frequency (% changing brands between purchases)
- Premium brand affinity (tendency to purchase higher-priced brands)

**Metrics:**
- Loyalty score: 1-5 (5 = exclusively purchases 1-2 brands)
- Top 3 brands (by purchase frequency and spend)
- Brand expansion likelihood (propensity to try new brands)
- Premium brand engagement (designer, luxury segments)

**Data Sources:**
- Product brand field
- Repeat purchase tracking
- Brand catalog segmentation
- Use `feature_analysis` for brand affinity matrix

**Enrichment Output:**
- Loyal customer flag (yes/no)
- Primary brand recommendation
- Brand expansion opportunities
- Exclusive brand offers vs new brand trials

### 7. Return Propensity Score

**Definition:** Likelihood to return purchases
**Calculation Approach:**
- Historical return rate (returns / purchases)
- Return reason analysis (size, wrong item, defect, fit)
- Return value threshold (amount returned per transaction)
- Return timing (how quickly returns initiated)
- Serial returner identification (pattern of excessive returns)

**Metrics:**
- Return likelihood: 1-5 scale
- Average return rate (%)
- Return value ($)
- Return cycle (days from purchase to return)
- Net return value per customer

**Data Sources:**
- Order and return transaction data
- Return reason codes
- Refund tracking
- Use `schema_discovery` to map return event structure

**Enrichment Output:**
- Return risk tier (high/medium/low)
- Return prevention strategy (fit guides, reviews, descriptions)
- Warranty or protection plan opportunity
- Return authorization efficiency metrics

### 8. Browsing-to-Purchase Ratio

**Definition:** Conversion efficiency from browsing to completed purchase
**Calculation Approach:**
- Sessions to purchase ratio (how many browsing sessions before purchase)
- Product view count per purchase (average products viewed)
- Time from browse to purchase (average days between browse and buy)
- Browse abandonment rate

**Metrics:**
- Browsing frequency (sessions per month)
- Browse-to-purchase conversion (% of browser sessions leading to purchase)
- Cart abandonment rate (%)
- Decision cycle length (average days from first view to purchase)
- High-intent indicator (low browse count before purchase)

**Data Sources:**
- Web analytics (session, page view data)
- Shopping cart activity
- Product view tracking
- Use `time_travel` to analyze browsing patterns over time

**Enrichment Output:**
- Shopping efficiency score: 1-5 (5 = decisive, quick purchase)
- Cart abandonment recovery strategy
- Browse abandonment recovery touchpoints
- Product recommendation timing (optimal moments to engage)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 85% for core RFM attributes
- Timeliness: Update RFM weekly, affinity monthly
- Accuracy: Validate against transaction sources
- Consistency: Cross-check categories and channels

**MCP Tools Integration:**
- Use `schema_discovery` to understand retail event structure
- Use `feature_analysis` to calculate propensity scores
- Use `time_travel` to identify patterns over time windows
- Use `query_builder` to cost-optimize enrichment queries

**Enrichment Frequency:**
- RFM: Weekly (or nightly batch)
- Category affinity: Monthly
- Price sensitivity: Monthly (with promotional lift data)
- Channel preference: Monthly
- Seasonal patterns: Quarterly
- Brand loyalty: Monthly
- Return propensity: Monthly
- Browsing efficiency: Weekly

**Output Storage:**
- Store enriched attributes in customer_360 table
- Create derived segment flags for activation
- Maintain calculation metadata and timestamps
- Archive previous versions for trend analysis

## Quality Checklist

- RFM scores computed from last 12-24 months
- Category affinities based on minimum 3 purchases
- Price sensitivity calibrated to local/regional market
- Channel preferences include 30+ day activity window
- Seasonal patterns identified from 2+ years of history
- Brand loyalty excludes single-purchase brands
- Return propensity includes full refund cycle data
- Browsing metrics include mobile and desktop sessions

