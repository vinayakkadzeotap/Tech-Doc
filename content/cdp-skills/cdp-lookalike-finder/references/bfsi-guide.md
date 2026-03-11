# BFSI Lookalike Finder Guide

## Overview
BFSI lookalike audiences target customers with similar wealth tiers, risk profiles, and financial behaviors. This guide addresses product portfolio alignment, life stage indicators, and investment style matching for high-value customer acquisition.

## Key Similarity Dimensions

### Wealth & Asset Indicators

**Product Portfolio**
- Number of active products (checking, savings, investments, insurance)
- Portfolio diversification level
- Product mix patterns (banking-heavy vs investment-focused)
- Product adoption speed (early adopter vs follower)
- Cross-product relationship strength

**Wealth Tier Classification**
- Assets under management (AUM) level
- Monthly transaction volumes (proxy for income)
- Average account balance trends
- Investment contribution levels
- Savings rate indicators

**Asset Distribution**
- Cash vs investment ratio
- Domestic vs international allocation
- Risk asset percentage (stocks, crypto)
- Real estate investment indicators
- Business ownership indicators

### Risk Profile & Investment Style

**Risk Appetite**
- Conservative vs aggressive positioning
- Volatility tolerance (evidenced by holdings)
- Asset class preferences (bonds, equities, alternatives)
- Rebalancing frequency (active vs passive investor)
- Loss recovery behavior (panic sell vs hold)

**Investment Style**
- Active trading vs buy-and-hold
- Sector concentration
- Dividend yield preference vs growth
- ESG investing interest
- Emerging markets exposure

**Financial Goals**
- Retirement planning engagement
- Education savings indicators
- Wealth accumulation trajectory
- Risk management (insurance adoption)
- Tax optimization behavior

### Banking & Credit Behavior

**Banking Patterns**
- Monthly transaction frequency
- Digital vs branch usage preference
- Online banking feature adoption
- Mobile app utilization depth
- Payment method diversity

**Credit Behavior**
- Credit score proxy (payment history)
- Credit utilization patterns
- Loan type preferences (secured vs unsecured)
- Refinancing behavior
- Debt consolidation history

**Payment Patterns**
- Bill pay usage
- Standing order prevalence
- Autopay adoption
- Payment timing consistency
- International payment needs

### Life Stage & Demographic Indicators

**Life Stage Segments**
- Accumulation phase (building wealth, young professional)
- Peak earnings phase (established income, mid-career)
- Wealth management phase (high net worth, business owner)
- Preservation phase (pre-retirement, protecting assets)
- Distribution phase (retirement, pension drawing)

**Age & Tenure**
- Customer age proxy (from transaction patterns)
- Banking relationship tenure
- Product adoption timeline (new vs established)
- Generation cohort (millennial, Gen X, boomer)
- Generational wealth transition indicators

**Household Indicators**
- Family size proxies (transaction patterns)
- Education level signals (product sophistication)
- Geographic location (property ownership, income levels)
- Relationship status (single vs joint accounts)
- Dependent indicators (child-related expenses)

### Transaction Patterns

**Spending Profile**
- Monthly spending volume
- Spending volatility
- Category distribution (necessities vs discretionary)
- Seasonal spending patterns
- Disposable income indicators

**Financial Activity**
- Investment transaction frequency
- Loan/borrowing patterns
- Transfer patterns (remittances, gifts)
- Insurance premium frequency
- Tax-related transactions

### Digital Adoption & Engagement

**Channel Preferences**
- Primary banking channel (digital, branch, phone)
- Multi-channel usage (omnichannel comfort)
- Mobile banking adoption
- Online investment platform usage
- API/integration adoption (fintech partnerships)

**Product Adoption Behavior**
- Early adopter of new products
- Digital-first service preferences
- Alternative service interest (robo-advisor, AI-driven)
- Self-service capability comfort
- Traditional service reliance

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- total_aum_value
- product_count
- average_account_balance
- monthly_transaction_count
- digital_adoption_score
- credit_score_proxy
- investment_risk_score
- asset_allocation_risk_percentage
- annual_transaction_volume
- monthly_spending_volume
- active_credit_accounts
- insurance_product_count
- age_proxy
- income_proxy
- life_stage_segment
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (customer demographics and financial behavior)

### Statistical Metrics
- AUM distribution (percentiles: 10, 25, 50, 75, 90)
- Monthly transaction volume distribution
- Investment risk score distribution
- Asset allocation distribution
- Spending pattern distribution

### Quality Metrics
- AUM data consistency (cross-product reconciliation)
- Risk score stability over time
- Transaction classification accuracy
- Missing data patterns in wealth indicators

## Seed Audience Definition

### Approach
1. **Select Wealth Tier**: Define target customer segment
2. **Establish Financial Profile**: Document asset levels and composition
3. **Map Product Affinity**: Identify product adoption patterns
4. **Profile Risk Behavior**: Document investment preferences and tolerance
5. **Identify Life Stage**: Determine demographic and life stage characteristics

### Example Seed Profiles

**Seed 1: "High-Net-Worth Investor"**
- AUM: $1M+
- Product count: 5+ (diversified)
- Risk profile: Moderate-aggressive (60% equities)
- Investment style: Active, diversified portfolio
- Life stage: Peak earnings (35-55 years)
- Banking needs: Integrated wealth management
- Digital: High adoption, fintech interested
- Expected LTCV: $50K+/year

**Seed 2: "Mass Affluent Saver"**
- AUM: $250K-$1M
- Product count: 3-4 (balanced)
- Risk profile: Moderate (50% equities)
- Investment style: Long-term, dividend-focused
- Life stage: Establishment phase (40-60 years)
- Banking needs: Retirement planning, insurance
- Digital: Moderate adoption, comfortable online
- Expected LTCV: $10K-$20K/year

**Seed 3: "Young Accumulator"**
- AUM: $50K-$250K
- Product count: 2-3 (growth-focused)
- Risk profile: Aggressive (70%+ equities)
- Investment style: Index-focused, tech-savvy
- Life stage: Building phase (25-40 years)
- Banking needs: Digital-first, automation
- Digital: Very high adoption, app-native
- Expected LTCV: $2K-$5K/year (growth trajectory)

## Matching Methodology

### Feature Space Construction
1. **Wealth Vector**: AUM level, asset distribution, income proxy
2. **Risk Profile**: Risk score, asset allocation, product type
3. **Behavioral Profile**: Transaction frequency, channel preference, adoption speed
4. **Life Stage Vector**: Age proxy, life stage segment, demographic indicators
5. **Portfolio Diversity**: Product count, cross-product usage, diversification ratio

### Similarity Scoring
- **Wealth Alignment**: Within ±20% of seed AUM (log-scale for better distribution)
- **Risk Profile Match**: Same risk score quintile or adjacent quintile
- **Product Affinity**: Same product categories, similar adoption pattern
- **Behavioral Similarity**: Similar transaction patterns and channel preferences
- **Life Stage Match**: Same or adjacent life stage segment

### Candidate Filtering
- **Exclude**: Customers with compliance/regulatory flags
- **Exclude**: Customers with negative credit history
- **Exclude**: Customers with recent major negative events (bankruptcies, defaults)
- **Priority**: Customers with wealth growth trajectories
- **Bias toward**: Customers demonstrating investment interest

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Wealth tier, risk profile, primary products
- Can vary: Secondary products, exact asset allocation (±10%)
- Expansion ratio: 3-6x
- Expected LTCV match: 85-95%

**Tier 2: Moderate (Balanced)**
- Must match: Wealth category, life stage, risk tolerance
- Can vary: Specific products, product count variance
- Expansion ratio: 10-20x
- Expected LTCV match: 70-85%

**Tier 3: Aggressive (Volume)**
- Must match: Wealth tier (broad range), general investor type
- Can vary: Specific products, risk profile variance
- Expansion ratio: 30-80x
- Expected LTCV match: 50-75%

## Expected Expansion Ratios

### By Wealth Tier

**HNW Seeds ($1M+ AUM)**
- Conservative: 2-4x
- Moderate: 6-12x
- Aggressive: 15-30x
- Rationale: Rare segment, limited similar customers

**Mass Affluent Seeds ($250K-$1M)**
- Conservative: 4-8x
- Moderate: 12-25x
- Aggressive: 40-80x
- Rationale: Moderate segment size, targeted matching

**Mass Market Seeds (<$250K)**
- Conservative: 8-15x
- Moderate: 25-50x
- Aggressive: 80-200x
- Rationale: Large addressable market, volume expansion

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Wealth tier (profitability alignment)
- Risk profile (product suitability)
- Life stage (needs alignment)
- Investment behavior (product adoption)

### Important Dimensions (Weight: 2.0x)
- Product portfolio diversity (sophistication level)
- Digital adoption (engagement model)
- Asset allocation (risk sophistication)
- Income stability proxy (reliability)

### Supplementary Dimensions (Weight: 1.0x)
- Specific asset classes (nice-to-have)
- Transaction patterns (behavioral refinement)
- Geographic location (regional variation)

## Implementation Approach

### Data Requirements
- Complete product listing with balances (6+ months history)
- Investment portfolio data if available
- Transaction history (3-6 months minimum)
- Credit history proxy
- Demographic data (if available)

### Lookalike Creation Steps
1. Use schema_discovery to understand customer financial data model
2. Run feature_analysis on seed segment for wealth and behavior baselines
3. Use time_travel to identify stable vs volatile financial patterns
4. Calculate feature-space similarity for candidate customers
5. Apply wealth-tier and risk-profile based filtering
6. Generate lookalike audience at multiple expansion tiers
7. Validate against product performance data

### Validation Strategy
- Compare lookalike AUM distribution to seed
- Verify product adoption patterns
- Check life stage distribution
- Monitor risk profile alignment
- Track product cross-sell success rates

## Segment-Specific Matching

### HNW Wealth Management Matching
- Emphasis on AUM, product portfolio, risk sophistication
- Exclusive advisor relationship matching
- Behavioral finance preference matching
- Expected expansion: 3-8x (elite segment)

### Insurance Expansion Matching
- Emphasis on life stage and asset protection needs
- Family composition indicators
- Risk management behavior
- Expected expansion: 15-30x

### Retirement Planning Matching
- Emphasis on age/life stage and savings patterns
- Income replacement needs
- Risk preservation behavior
- Expected expansion: 20-40x

## Performance Expectations

- Lookalike audience size: 20-100x seed (depending on wealth tier)
- Product adoption: 70-90% adopt primary product within 90 days
- LTCV match: 70-95% of seed LTCV
- Cross-sell success: 20-40% higher than average customer
- First-year revenue: 75-90% of seed customer revenue
- False positive rate: 10-20% (customers not truly similar)

## Regulatory Compliance Considerations

- Document suitability matching (regulatory requirement)
- Track product recommendation rationale
- Maintain fair lending compliance
- Monitor for discriminatory patterns
- Handle PII/financial data with care (GDPR/CCPA)
- Audit trail for all wealth-based targeting

## Monitoring & Optimization

### Key Metrics
- Product adoption consistency with seed
- Investment behavior stability
- Risk profile maintenance (customers staying in target profile)
- Cross-product engagement
- Satisfaction and retention rates

### Refinement Triggers
- LTCV variance >25% from seed
- Unexpected product category adoption
- Risk profile drifting beyond tolerance
- Wealth tier changes (significant gains/losses)
- Major life event indicators

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for financial dimensions
- Identify calculated_attribute for wealth score, risk score
- Verify multi-product data consolidation

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish AUM and asset distribution
- Identify wealth tier and risk clusters
- Validate life stage indicators

### time_travel Usage
- Track wealth and asset changes over 90+ days
- Identify stable vs volatile wealth patterns
- Monitor product adoption progression
- Detect life stage transitions

### query_builder Usage
- Cost estimation for wealth calculation queries
- Optimize portfolio consolidation queries
- Model scalability of expansion tiers

## Implementation Checklist

- [ ] Define wealth tiers and tier-specific seeds
- [ ] Establish AUM baseline and tolerance bands
- [ ] Document risk profile and asset allocation patterns
- [ ] Map product portfolio patterns
- [ ] Create life stage segment definitions
- [ ] Build feature space vectors
- [ ] Establish similarity scoring methodology
- [ ] Test on historical customers (backtesting)
- [ ] Validate lookalike vs seed LTCV/engagement
- [ ] Set up compliance monitoring
- [ ] Document regulatory requirements
- [ ] Plan quarterly model review
