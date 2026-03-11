# Retail Lookalike Finder Guide

## Overview
Retail lookalike audiences rely on comprehensive purchase behavior, channel preferences, and demographic indicators. This guide defines similarity dimensions, matching methodology, and expansion ratios for retail targeting.

## Key Similarity Dimensions

### Purchase Behavior Dimensions

**Purchase Categories**
- Primary category affinity (apparel, footwear, accessories, etc.)
- Secondary category mix
- Category concentration (focused vs diverse)
- Seasonal category patterns
- Cross-category propensity

**Average Order Value (AOV) Range**
- Distribution clustering around historical average
- AOV tolerance band: ±20% of seed segment
- Tier progression patterns (moving up/down)
- Price sensitivity indicators

**Purchase Frequency**
- Transactions per month/quarter
- Seasonality adjustment factors
- Consistency of spacing (regular vs sporadic)
- Growth trajectory (increasing/stable/declining)

**Product Affinity Patterns**
- Brand preference alignment
- Quality tier matching (fast-fashion vs premium)
- Material/construction preferences
- Color/style preference clustering
- Size consistency patterns

### Channel & Engagement Dimensions

**Channel Preference**
- Primary channel (online, in-store, mobile)
- Channel combination patterns
- Cross-channel behavior (research online, buy in-store)
- Mobile engagement depth
- Social commerce participation

**Brand Affinity**
- Core brands purchased repeatedly
- Brand loyalty score
- Premium vs discount brand mix
- Emerging brand adoption rate
- Private label acceptance

**Discount Sensitivity**
- Response to promotional offers
- Price elasticity clustering
- Coupon redemption patterns
- Full-price purchase ratio
- Sale-season vs year-round purchaser

### Transaction Patterns

**Payment Method**
- Primary payment type (credit card, debit, wallet)
- Payment consistency
- Alternative payment adoption
- Financing utilization (BNPL, credit plans)

**Return Rate**
- Return frequency ratio
- Return reason patterns
- Satisfaction indicator correlation
- Final purchase conversion after browsing

**Browsing Behavior**
- Browse-to-purchase conversion rate
- Time from browse to purchase
- Wishlist item overlap
- Search behavior patterns
- Product page depth

### Geographic & Demographic Dimensions

**Geographic Clustering**
- Primary shopping location
- Regional preference variations
- Store proximity importance
- Climate-based purchasing (seasonal goods)
- Urban vs suburban vs rural patterns

**Demographic Indicators**
- Age cluster matching
- Gender affinity
- Household income alignment
- Family/household size signals
- Life stage indicators (new parent, empty nester, etc.)

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- total_purchase_count
- average_order_value
- purchase_frequency_monthly
- primary_category
- primary_channel
- payment_method_primary
- return_rate
- brand_loyalty_score
- discount_sensitivity_score
- last_purchase_days_ago
- customer_lifetime_value
- geographic_region
- age_group
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (customer demographics and behavior)

### Statistical Analysis
- AOV distribution percentiles (10, 25, 50, 75, 90)
- Purchase frequency distribution
- Brand concentration distribution (Herfindahl index)
- Channel mix diversity distribution

### Quality Metrics
- Data completeness for each dimension
- Consistency of geographic data
- Outlier detection for AOV and frequency
- Temporal freshness of purchase data

## Seed Audience Definition

### Approach
1. **Select Target Customers**: Define high-value or strategic customer segment
2. **Establish Baseline Vectors**: Calculate average/median for each dimension
3. **Define Tolerance Bands**: Set acceptable variance ranges
4. **Create Similarity Profile**: Multi-dimensional customer archetype

### Example Seed Definition
```
Seed Audience: "Conscious Female Apparel Buyer"
- Age group: 28-42
- Primary channel: Digital + In-store mixed
- AOV range: $75-$150
- Purchase frequency: 4-6 purchases/month
- Primary categories: Apparel, Footwear, Accessories
- Brand type: Premium-casual mix
- Discount sensitivity: Moderate (responds to seasonal sales)
- Return rate: <5%
- Payment: Credit card preferred
- Geographic: Urban centers
```

### Multi-Segment Approach
- Define 3-5 seed profiles within same business objective
- Each seed generates separate lookalike audience
- Audiences merged with controlled overlap management

## Matching Methodology

### Feature Space Construction
1. **Normalize Each Dimension**: Z-score normalization for continuous variables
2. **Categorical Encoding**: One-hot or ordinal encoding for categories
3. **Weight Assignment**: Higher weights for differentiating factors
4. **Distance Metric**: Euclidean distance in normalized feature space

### Similarity Scoring Algorithm
- **Exact Dimension Matching**: Discrete categories (same brand tier, channel preference)
- **Range-Based Matching**: Numeric dimensions (AOV within ±20%, frequency within ±1 purchase)
- **Fuzzy Matching**: Similar but not identical (adjacent brand tiers, nearby age groups)

### Filtering Thresholds
- Minimum similarity score: 0.65 (on 0-1 scale)
- Exclude: Recent customers of competing brands
- Exclude: Geographic regions with no distribution
- Priority: High LTV potential customers

### Lookalike Expansion Process
1. **Seed Matching**: Find exact matches to seed profile (overlap set)
2. **Tier 1 Expansion**: Modify 1-2 dimensions, keep others aligned
3. **Tier 2 Expansion**: Modify 3-4 dimensions, maintain core affinity
4. **Tier 3 Expansion**: Broader tolerance bands, same primary category

## Expected Expansion Ratios

### Conservative Matching (High Quality)
- Similarity threshold: 0.75+
- Tier 1 expansion only
- Expansion ratio: 5-8x seed size
- Expected conversion lift: 40-60% vs average audience
- Use case: Premium product launches, limited inventory

### Moderate Matching (Balanced)
- Similarity threshold: 0.65-0.74
- Tier 1 + Tier 2 expansion
- Expansion ratio: 15-25x seed size
- Expected conversion lift: 25-40% vs average audience
- Use case: Standard campaigns, inventory available

### Aggressive Matching (Volume)
- Similarity threshold: 0.50-0.64
- All tiers included
- Expansion ratio: 50-100x seed size
- Expected conversion lift: 10-25% vs average audience
- Use case: Brand awareness, acquisition at scale

## Similarity Dimension Weighting

### High Importance (Weight: 3.0x)
- Primary category (core business fit)
- AOV range (profitability alignment)
- Channel preference (operational efficiency)
- Purchase frequency (customer value)

### Medium Importance (Weight: 2.0x)
- Brand affinity (quality tier matching)
- Discount sensitivity (campaign efficiency)
- Return rate (fulfillment cost)
- Payment method (conversion friction)

### Low Importance (Weight: 1.0x)
- Secondary categories (nice-to-have alignment)
- Geographic region (distribution dependent)
- Demographic indicators (behavioral proxies less predictive)

## Implementation Approach

### Data Requirements
- Minimum 6 months of transaction history
- Complete category attribution
- Channel tracking across touchpoints
- Return/exchange data linked to purchases

### Lookalike Creation Steps
1. Use schema_discovery to understand customer data structure
2. Run feature_analysis on seed segment to establish baselines
3. Run time_travel to identify recent purchasing patterns
4. Calculate feature-space distances for candidate audience
5. Apply similarity thresholds and create segments
6. Validate with campaign performance data

### Quality Assurance
- Compare lookalike audience demographic distribution to seed
- Validate category mix matches expectation
- Verify no accidental competitor customer inclusion
- A/B test against control audience of similar size

## Segment-Specific Matching

### Fast Fashion Segment
- Emphasis on purchase frequency and channel
- De-weight brand loyalty
- High discount sensitivity matching
- Expected expansion: 30-40x

### Premium Segment
- Emphasis on brand affinity and AOV
- High-quality filtering (low return rate)
- Geographic concentration
- Expected expansion: 5-10x

### Value Segment
- Emphasis on discount sensitivity
- Frequency-based matching
- Multi-category exploration
- Expected expansion: 40-60x

### Category-Specific (Footwear)
- Size consistency as unique dimension
- Style preference clustering
- Occasion-based purchasing patterns
- Expected expansion: 15-25x

## Expected Performance Metrics

- Lookalike audience size: 50-500x seed size (depending on matching tightness)
- Conversion rate lift: 15-50% above random audience
- ROAS uplift: 20-40% above standard campaigns
- Customer acquisition cost: 15-30% lower for lookalike vs standard
- False positive rate: 5-15% (customers not actually similar)

## Monitoring & Refinement

### Performance Tracking
- Measure conversion rates within lookalike tiers
- Compare customer LTV to seed segment LTV
- Track repeat purchase patterns
- Monitor channel preference stability

### Model Refinement
- Quarterly review of seed audience definitions
- Update feature weighting based on campaign performance
- Refresh feature baselines as customer behavior evolves
- Expand similarity dimensions as new data becomes available

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for available customer dimensions
- Identify calculated_attribute options for pre-computed scores
- Verify data completeness before matching

### feature_analysis Usage
- Analyze seed audience on metric_types: ["basic", "statistical", "quality"]
- Establish percentile distributions for range-based matching
- Identify outliers to exclude from matching

### time_travel Usage
- Track changes in customer behavior over time
- Identify seasonal patterns in category preferences
- Detect channel shift trends pre-matching
- Validate stability of seed audience definition

### query_builder Usage
- Cost analysis for feature extraction queries
- Optimize matching query efficiency
- Estimate cost of regular lookalike model retraining

## Implementation Checklist

- [ ] Define 3-5 seed audience profiles
- [ ] Document similarity dimensions and weights
- [ ] Extract and normalize feature space
- [ ] Establish similarity scoring methodology
- [ ] Test on historical customers (backtesting)
- [ ] Create lookalike audiences at multiple thresholds
- [ ] Set up campaign performance tracking
- [ ] Implement monitoring dashboards
- [ ] Plan quarterly model refinement
- [ ] Document audience expansion ratios
