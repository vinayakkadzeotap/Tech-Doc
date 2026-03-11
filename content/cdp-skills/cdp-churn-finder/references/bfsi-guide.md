# Banking, Financial Services & Insurance (BFSI) Churn Detection Guide

## Overview
BFSI churn involves regulatory complexity, product interdependencies, and portfolio-based relationships. Churn patterns differ significantly by product type (banking, investment, insurance). This guide addresses multi-product account structures and product-specific signals.

## Primary Churn Signals

### Banking Churn Indicators
- **Balance Reduction**: >25% decline over 90 days is primary signal
- **Transaction Frequency**: Monthly transaction count dropping significantly
- **Deposit Velocity**: Reduced frequency of deposits/income credits
- **Withdrawal Patterns**: Increasing ATM/cash withdrawals vs electronic transfers
- **Minimum Balance**: Account falling below maintained balance threshold
- **Fee Susceptibility**: Increased overdraft fees or monthly maintenance charges
- **Card Usage**: Credit/debit card utilization decreasing
- **Payment Non-Receipt**: Missing expected bill payments or deposits

### Investment Churn Indicators
- **Portfolio Reduction**: Asset decline >25% over 6 months (excluding market movement)
- **Trading Frequency**: Reduced transaction activity in trading accounts
- **Switching Signals**: Consolidation to competing platforms
- **Contribution Cessation**: Monthly/quarterly investment contributions stopping
- **Dividend Non-Reinvestment**: Changing from auto-reinvest to manual collection
- **Asset Allocation Shift**: Moving to cash or lower-tier instruments
- **Advisory Service Non-Usage**: Reduced financial advisor interaction

### Insurance Churn Indicators
- **Policy Non-Renewal**: Explicit non-renewal notifications
- **Premium Reduction**: Downgrading coverage/limits
- **Lapsed Payments**: Payment delays or failed payment attempts
- **Claim Denial**: Coverage disputes or claim rejections (high churn predictor)
- **Competitor Product Research**: Visits to competitor sites (tracked via partnerships)
- **Coverage Reduction Requests**: Removing optional coverage riders
- **Grace Period Extension**: Multiple requests for payment extensions
- **Support Complaint Escalation**: Issues with claims or service

### Cross-Product Indicators
- **Digital Channel Dormancy**: Reduced online banking/app access
- **Customer Service Interactions**: Complaint-heavy vs transactional contact
- **Product Consolidation**: Closing accounts with low usage
- **Relationship Manager Responsiveness**: Fewer touchpoints with assigned manager
- **Portfolio Simplification**: Reducing number of products held
- **Rate Shopping Signals**: Increased competitive rate checks

## Product-Specific Churn Patterns

### Retail Banking Churn

**Churn Drivers:**
- Better rates offered elsewhere
- Convenience (branch closures, mobile app quality)
- Service quality (problem resolution speed)
- Fees (maintenance, overdraft, ATM)

**Key Metrics:**
- Account balance trend (quarterly)
- Transaction volume (monthly)
- Maintenance fee ratio
- Customer effort score

**Detection Window:**
- Early: 60-90 days
- Medium: 30-45 days
- Critical: <14 days

**Typical Churn Rate:** 3-8% annually

### Wealth Management Churn

**Churn Drivers:**
- Performance underperformance (vs benchmarks)
- Fee transparency concerns
- Advisor relationship changes
- Better opportunity elsewhere

**Key Metrics:**
- Assets under management (AUM) trend
- Portfolio performance vs benchmark
- Investment frequency
- Advisor meeting frequency

**Detection Window:**
- Early: 120+ days
- Medium: 60 days
- Critical: <30 days

**Typical Churn Rate:** 8-15% annually (higher volatility than retail)

### Insurance Churn

**Churn Drivers:**
- Price (premium increases)
- Claims handling issues
- Coverage inadequacy
- Life event (marriage, relocation)

**Key Metrics:**
- Premium trends
- Claim approval rates
- Claims processing time
- Renewal acceptance rate

**Detection Window:**
- Early: Pre-renewal (90+ days)
- Medium: 30-60 days
- Critical: <30 days (at renewal)

**Typical Churn Rate:** 10-20% annually (varies by product)

## Feature Analysis Metrics

### Essential Metrics (basic)
```
Banking:
- account_balance
- monthly_transaction_count
- average_transaction_size
- card_usage_frequency
- account_tenure
- fee_count

Investment:
- portfolio_value
- transaction_frequency
- number_of_holdings
- contribution_frequency
- advisor_interaction_count

Insurance:
- annual_premium
- coverage_amount
- policy_age
- claim_frequency
- renewal_rate
```

Metric types: ["basic", "statistical", "quality"]

### Statistical Metrics
- Balance distribution (percentiles)
- Transaction frequency distribution
- Premium amount distribution
- Payment delay patterns

### Quality Metrics
- Data completeness (account synchronization lags)
- Outlier detection (high-balance anomalies)
- Data freshness validation

## Time_Travel CDF Analysis

### Banking Configuration
- Starting timestamp: 90 days ago
- Ending timestamp: current date
- Columns: [account_balance, transaction_count, card_usage, minimum_balance_flag, fee_count]
- Change types: [update_postimage] for balance changes
- Include statistics: true

### Investment Configuration
- Starting timestamp: 180 days ago
- Ending timestamp: current date
- Columns: [portfolio_value, transaction_frequency, contribution_amount, holdings_count]
- Change types: [update_postimage]
- Include statistics: true

### Insurance Configuration
- Starting timestamp: 120 days ago (pre-renewal window)
- Ending timestamp: current date
- Columns: [premium_amount, coverage_amount, claim_frequency, renewal_status]
- Change types: [update_postimage, delete] (delete for cancellations)
- Include statistics: true

## Segmentation Approach

### Customer Value Segment
**High-Net-Worth (HNW):**
- Portfolio >$1M
- Multiple products
- Advisory relationship
- Priority retention

**Mass Affluent:**
- Portfolio $250K-$1M
- Selective product adoption
- Limited advisory
- Standard retention

**Mass Market:**
- Limited assets
- Often single-product
- Self-service reliance
- Volume-based retention

### Product Portfolio Segment
**Single-Product:** Most churn-prone (limited switching cost)
**Multi-Product:** Locked-in (embedded ecosystem)
**Full-Service:** Relationship-based (requires trust)

### Behavioral Segment
**Active Managers:** Frequent trading, engaged
**Set-and-Forget:** Minimal engagement after setup
**Service-Dependent:** High advisor interaction needs

## Churn Rate Dynamics

### Seasonal Patterns
- Q1: Tax season impacts (increased engagement)
- Q2: Compensation season (investment decisions)
- Q3: Back-to-school budget pressures
- Q4: Year-end planning + holiday expenses

### Life Event Triggers
- Job change: Account consolidation likely
- Relocation: Branch accessibility changes
- Marriage/Divorce: Portfolio restructuring
- Retirement: Product suite change

## Multi-Product Retention Strategy

### Cross-Sell Prevention
- Customers with 2+ products have 60% lower churn
- Strategy: Identify single-product high-value customers
- Offer complementary products with incentives

### Consolidation Incentives
- Fee waivers for moving assets to single institution
- Integrated dashboard access
- Unified customer service

### Proactive Service
- Quarterly relationship reviews (HNW/Mass Affluent)
- Performance reporting
- Tax-loss harvesting recommendations
- Rate/product optimization reviews

## Intervention Strategies by Segment

### HNW/Wealth Management
- Personal advisor outreach
- Performance analysis and attribution
- Tax strategy meetings
- Exclusive investment opportunities

### Mass Affluent
- Digital relationship manager check-ins
- Performance summaries
- Product cross-sell offers
- Behavioral incentives (deposit bonuses)

### Mass Market
- Digital push notifications
- Email campaigns
- Self-serve product recommendations
- Fee reduction offers

## Expected Metrics

- Early window prediction accuracy: 72-78%
- Medium window prediction accuracy: 80-85%
- Critical window prediction accuracy: 88-93%
- Cross-sell impact on churn: -15% to -25%
- Multi-product customers churn rate: 2-5% vs single-product 8-15%

## Compliance & Regulatory Considerations

- Document all outreach for audit trails
- Honor DNC (Do Not Call) registrations
- Fair practice standards for offers
- GDPR/CCPA compliance for data usage
- Suitability documentation for products offered

## Implementation Checklist

- [ ] Define product-specific churn definitions
- [ ] Establish balance/value baseline calculations
- [ ] Set up time_travel CDF for account movements
- [ ] Configure feature_analysis for all product types
- [ ] Create product interdependency map
- [ ] Build segment-specific playbooks
- [ ] Establish advisor escalation protocols
- [ ] Set up compliance tracking
- [ ] Monitor regulatory requirements
- [ ] Test interventions on pilot cohorts
