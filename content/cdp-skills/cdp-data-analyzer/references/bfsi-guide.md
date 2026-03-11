# BFSI (Banking, Financial Services, Insurance) Analysis Guide

## Overview
This guide provides analysis frameworks for financial institutions. Focus on product penetration, wealth progression, profitability, and lifecycle management.

## Product Penetration Analysis

### Product Coverage Metrics
Track customer engagement with product portfolio:

**Single-Product Customers**
- Holding only one product (Savings Account, Credit Card, Loan, Investment)
- Often entry-level or transactional relationships
- High churn risk due to low switching cost
- Cross-sell opportunity identification

**Multi-Product Customers**
- 2-3 products (typical engagement level)
- Better lifetime value
- Higher wallet share
- Lower propensity to switch

**Comprehensive Customers**
- 4+ products (Banking, Cards, Investments, Insurance)
- Highest lifetime value
- Deepest relationships
- Lowest churn risk

### Penetration by Segment
- Corporate vs. Retail penetration rates
- By customer age cohort (younger: digital-first, older: branch-dependent)
- By account tenure (newer customers: lower penetration)
- By wealth tier (higher wealth: more products)

### New Product Adoption
Track rollout success:
- % of customer base aware of new product
- % of eligible customers adopting
- Time-to-adoption distribution
- Cannialization (new product stealing from existing)
- Incremental revenue contribution

Use `feature_analysis` with `metric_types: ["basic", "quality"]` to profile product holdings distribution.

## Wealth Tier Migration

### Wealth Tier Definition
Segment customers by accumulated wealth/assets:

**Tier 1 (Mass Market)**
- Assets: <$50,000
- Deposit-focused relationships
- Price-sensitive
- Digital adoption moderate

**Tier 2 (Affluent)**
- Assets: $50,000-$250,000
- Diversifying into investments
- Seeking advisory
- Omnichannel active

**Tier 3 (High Net Worth)**
- Assets: $250,000-$1M
- Investment-focused
- Relationship manager assigned
- Tax/estate planning engaged

**Tier 4 (Ultra High Net Worth)**
- Assets: >$1M
- Wealth management services
- Private banking relationship
- Complex financial needs

### Migration Patterns
- **Upward mobility**: Customers moving to higher tiers (growth signal)
- **Downward movement**: Asset decumulation or portfolio rebalancing (life event?)
- **Tier stickiness**: % remaining in same tier (loyalty)
- **Exit risk**: When customers move to lower tier (churn risk)

### Driver Analysis
What drives upward migration:
- Income growth or bonus seasonality?
- Successful investment performance?
- Inheritance or financial event?
- Time accumulation (salary savings)?

Use `time_travel` CDF analysis to track asset flow changes and migration patterns.

## Cross-Sell Effectiveness

### Cross-Sell Products by Starting Product
- **Savings Account holders**: Credit card, investment products, insurance
- **Credit Card holders**: Personal loans, investment accounts
- **Loan holders**: Insurance, savings vehicles for loan payoff
- **Investment holders**: Insurance, banking services for income

### Cross-Sell Timing
- **Immediate**: Right after first product activation (account setup)
- **Usage-based**: After customer demonstrates active use
- **Life event-triggered**: Account alerts indicate insurance need
- **Anniversary-triggered**: After first year of product ownership

### Offer Effectiveness
- What % of cross-sell offers convert?
- How do conversion rates vary by customer segment?
- What's the revenue/cost ratio for campaigns?
- Does bundled pricing increase adoption?

### Attribution
- Do customers with bundled products have lower churn?
- Is cross-sell customer LTV higher (causation vs. selection bias)?
- How long until bundled customers increase engagement?

### Implementation
Use `query_builder` cost analysis for customer acquisition → product adoption join analysis.

## Risk Score Distribution

### Risk Dimensions
Track customer risk profiles:

**Credit Risk**
- Payment history (late/missed payments)
- Debt-to-income ratio
- Credit utilization rate
- Collections events

**Behavioral Risk**
- Transaction frequency decline (dormancy signal)
- Large withdrawal requests (exit signal)
- Complaint frequency
- Regulatory flag events

**Fraud Risk**
- Unusual transaction patterns
- Geographic anomalies
- Device/IP changes
- Velocity checks (multiple transactions)

### Risk Segmentation
- Low risk: 95%+ customers (stable, on-time payers)
- Moderate risk: 4% of customers (emerging delinquency signals)
- High risk: 1% of customers (active collections, fraud investigation)

### Risk Trend Analysis
- Is portfolio risk increasing or decreasing?
- Which cohorts have rising risk (newer lending cohorts riskier?)
- Does risk score predict default 6-12 months ahead?
- How effective are risk mitigation interventions?

Use `feature_analysis` with `metric_types: ["statistical"]` to analyze risk score distributions across segments.

## Digital Adoption Trends

### Digital Channel Usage
Track customer migration to digital channels:

**Adoption Levels**
- Non-digital: Still using branch/call center exclusively
- Light digital: Occasional app/web usage (<1x/month)
- Regular digital: Active app/web user (multiple times/week)
- Digital-primary: Primarily digital channel

### Service Adoption
- Mobile app downloads and active use
- Online banking access and frequency
- Digital payments (P2P, digital wallets)
- Self-service (ATM, kiosk usage)
- Video banking adoption

### Adoption Benefits
- Do digital-active customers have lower service costs?
- Do they have lower churn?
- Are they more likely to cross-buy?
- Do they have higher profitability?

### Digital Divide
- Demographics of digital adoption (age, education, tech comfort)
- Geographic variations (urban vs. rural adoption)
- Product-specific digital usage (payments vs. lending)
- Barriers to adoption (friction, onboarding, feature clarity?)

Track adoption trends using `time_travel` to measure quarter-over-quarter movement.

## Customer Profitability Analysis

### Profitability Components

**Revenue Sources**
- Net interest income (spread between lending rates and deposit rates)
- Service fees (account, transaction, advisory)
- Commission income (investments, insurance)
- Card fees and merchant interchange

**Cost Components**
- Customer acquisition cost (onboarding)
- Servicing cost (operations, branch, call center)
- Risk cost (expected credit losses, fraud losses)
- Technology cost (systems, security)

### Customer Profitability Segments
- **Profitable**: Revenue > allocated costs (maximize lifetime value)
- **Break-even**: Revenue ~= costs (growth potential)
- **Unprofitable**: Revenue < costs (winback or churn acceptable)

### Profitability Drivers
- Does a customer's tier directly drive profitability?
- Do multi-product customers have higher profitability?
- Do digital-active customers have lower service costs?
- What's the payback period for a new customer?

### Profitability Lifecycle
- Negative early (acquisition costs)
- Breakeven at 6-12 months
- Positive growth with tenure
- Decline at end-of-life (dormancy)

Use `query_builder` cost analysis for large profitability margin calculations across customer base.

## Lifecycle Stage Distribution

### Customer Lifecycle Stages

**Acquisition** (0-6 months)
- New account opening
- Initial deposit/funding
- First product setup
- Early engagement signals

**Growth** (6-24 months)
- Increasing activity levels
- Product adoption/cross-sell receptivity
- Deepening relationship signals
- Retention investment phase

**Maturity** (24+ months)
- Stable usage patterns
- Established service preferences
- Relationship stability
- Revenue optimization phase

**Decline** (signals of exit)
- Decreasing activity
- Product reduction/closure requests
- Competitive offer consideration
- Churn risk intervention needed

### Stage Distribution Health
- What % are in growth stage (healthy pipeline)?
- What % are in decline (churn risk)?
- How fast do customers progress through stages?
- Can you accelerate progression (reduce acquisition drag)?

### Retention by Lifecycle Stage
- Which stage has highest churn risk?
- What interventions work for each stage?
- Is stage-specific messaging more effective?

Analyze stage distribution changes using `time_travel` to measure health of overall customer base.

## Implementation Checklist

- Accounts table with product holdings
- Transaction/activity data for engagement
- Asset/balance data for wealth tier
- Risk/credit data for scoring
- Profitability ledgers (interest, fees, costs)
- Digital channel usage logs
- Life event/alert triggers

Use `schema_discovery` to identify these data sources in your warehouse.
