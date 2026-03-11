# Retail Industry Analysis Guide

## Overview
This guide provides industry-specific analysis frameworks and methodologies for retail customer intelligence. Use these approaches to uncover purchasing patterns, customer value drivers, and growth opportunities.

## Cohort Analysis Framework

### Purchase Cohorts by Month
Segment customers by their first purchase month to track cohort-level behavior over time. Track:
- Repeat purchase rate by cohort age
- Average order value trends within each cohort
- Category adoption patterns across cohorts
- Seasonal purchasing fluctuations by cohort

Use `feature_analysis` with `metric_types: ["basic", "statistical"]` to examine purchase frequency distributions across cohorts.

### Implementation Steps
1. Define cohort boundaries by first_purchase_date month
2. Calculate days-since-first-purchase for each customer
3. Segment into cohort buckets (0-30, 30-90, 90-180, 180+ days)
4. Analyze revenue, frequency, and product mix per bucket

## Seasonality Decomposition

Decompose sales time series into:
- **Trend**: Long-term growth/decline patterns
- **Seasonality**: Recurring monthly/quarterly patterns (holiday peaks, weather impacts)
- **Cyclicality**: Longer business cycles
- **Irregular**: One-time events or anomalies

Use `time_travel` CDF analysis to track purchase volumes across date ranges, identifying peak and valley periods.

## Basket Analysis Methodology

Examine customer purchase baskets to identify:
- Product affinity matrices (which items are purchased together)
- Category pairing rules (e.g., pants + shoes correlation)
- Average basket size trends
- Sequential purchase patterns (what customers buy next)

**Key Metrics**:
- Items per basket (trend over time)
- Category diversity per basket
- Price point combinations
- Cross-category penetration rates

## RFM Distribution Analysis

### Recency, Frequency, Monetary Scoring
Segment customers by three dimensions:

**Recency**: Days since last purchase
- R1: 0-30 days (active customers)
- R2: 31-90 days (cooling off)
- R3: 91-180 days (at-risk)
- R4: 180+ days (dormant)

**Frequency**: Purchase count in last 12 months
- F1: 1 purchase (one-time buyers)
- F2: 2-4 purchases (occasional)
- F3: 5-10 purchases (regular)
- F4: 10+ purchases (loyal)

**Monetary**: Average transaction value
- M1: Bottom quartile
- M2: Q2
- M3: Q3
- M4: Top quartile

Combine these into 64 segments (4×4×4), focusing on High-High-High (best) and Low-Low-Low (worst) cohorts.

## Channel Attribution

### Multi-touch Attribution Models
Track customer journey across channels:
- Online (website, mobile app, email)
- Offline (store visits, phone orders)
- Paid marketing (social ads, search, display)
- Organic (direct, organic search)

**Analysis approaches**:
- First-touch attribution (which channel brings customers?)
- Last-touch attribution (which channel drives conversion?)
- Time-decay attribution (recent touchpoints weighted higher)
- Linear attribution (equal credit to all touchpoints)

Use `feature_analysis` with `metric_types: ["quality"]` to identify channel reliability and consistency.

## Promotion Effectiveness

Measure promotion impact:
- **Incremental lift**: Additional sales attributed to promotion
- **Promotional elasticity**: Price sensitivity by segment
- **Category switching**: Cannibalization effects
- **Full-price erosion**: Discount-driven behavioral change

Track promotion effectiveness across:
- Customer segments (new vs. loyal, high vs. low value)
- Product categories
- Seasonal periods
- Marketing channels

## Customer Lifetime Value (CLV) Analysis

### CLV Calculation Components
- **Historical CLV**: Sum of all past profits from customer
- **Predictive CLV**: Expected future profits (12-24 month horizon)
- **Segmental CLV**: CLV distribution across customer segments

**Formula**: CLV = (Average Order Value × Purchase Frequency × Customer Lifespan) - Customer Acquisition Cost

### Key Drivers
Analyze what drives high CLV:
- Product category preferences
- Purchase frequency patterns
- Channel engagement levels
- Loyalty program participation
- Seasonal spending patterns

Use `time_travel` to analyze CLV components over historical periods and identify CLV improvement trends.

## Inventory-Demand Correlation

### Stock and Sales Relationship
- **Stockout impact**: Lost sales when inventory unavailable
- **Overstock impact**: Aging inventory, markdown pressure
- **Category correlation**: How stock in one category affects others
- **Seasonal alignment**: Is inventory positioned for seasonal demand?

**Analysis structure**:
1. Map inventory levels by product and time period
2. Correlate inventory depth with sales velocity
3. Identify stockout windows and impact
4. Measure days-to-stock-out by product lifecycle stage

Use `query_builder` to cost large historical inventory-sales joins for correlation analysis.

## Implementation Workflow

1. **Data Preparation**: Use `schema_discovery` to map retail transaction tables
2. **Cohort Setup**: Leverage `feature_analysis` with basic metrics
3. **Trend Analysis**: Apply `time_travel` for historical decomposition
4. **Model Validation**: Use `query_builder` cost analysis before large-scale runs

## Common Pitfalls
- Ignoring customer acquisition costs in profitability analysis
- Attributing all sales to last touchpoint (oversimplifying)
- Seasonality assumptions from too-short windows
- Inventory analysis without demand signal context
