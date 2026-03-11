# Automotive Lookalike Finder Guide

## Overview
Automotive lookalike audiences target customers with similar vehicle preferences, ownership behaviors, and purchase patterns. This guide addresses vehicle segment affinity, service behavior, and loyalty matching for efficient customer acquisition.

## Key Similarity Dimensions

### Vehicle Segment & Preference

**Vehicle Category Affinity**
- Primary segment (sedan, SUV, truck, hatchback, luxury, electric)
- Segment loyalty (repeat segment customers)
- Size preference (compact, mid-size, full-size)
- Body style preferences (coupe, convertible, wagon)
- New vs used preference

**Vehicle Specifications**
- Engine type preference (gas, hybrid, electric, diesel)
- Performance expectations (luxury, economy, performance)
- Technology feature interest (autonomous, connectivity)
- Safety feature importance
- Fuel efficiency expectations

**Brand Affinity**
- Preferred manufacturers
- Brand loyalty patterns
- Brand premium vs economy preference
- Domestic vs import preference
- Brand switching patterns

### Ownership Duration & Lifecycle

**Ownership Pattern**
- Average ownership duration
- Vehicle replacement frequency
- Lease vs purchase preference
- Trade-in patterns
- Ownership consistency (same vehicle type tenure)

**Lifecycle Stage Timing**
- Time to next vehicle decision
- Service needs cycle (predictable)
- Upgrade timing patterns
- Model refresh awareness (new generation interest)

### Purchase Method & Financing

**Purchase Channel**
- Dealership preference (new vs used)
- Private purchase likelihood
- Online research intensity
- Test drive frequency
- In-dealership vs online negotiation

**Financing Preference**
- Cash purchase propensity
- Lease interest
- Finance term preference (24, 36, 60 months)
- Payment amount tolerance
- Trade-in vs cash down preference

**Price Sensitivity**
- Budget tier (economy, mid-market, luxury)
- Financing flexibility
- Incentive response rate
- Negotiation intensity
- Total cost of ownership consciousness

### Service & Maintenance Behavior

**Service Frequency**
- Scheduled maintenance frequency
- Preventive maintenance enthusiasm
- Warranty service usage
- Out-of-warranty repair patterns
- Dealer vs independent service preference

**Service Spending**
- Average annual service spend
- Parts and accessories investment
- Extended warranty purchase
- Premium service offering uptake
- Maintenance package adoption

**Service Loyalty**
- Primary service location consistency
- Dealer loyalty vs price shopping
- Review writing and sharing
- Service appointment scheduling patterns

### Accessory & Customization Behavior

**Accessory Purchasing**
- First-party accessory adoption
- Aftermarket accessory interest
- Cosmetic vs functional preference
- Upgrade spending patterns
- Seasonal accessory purchases

**Customization Level**
- Paint/interior personalization
- Performance modifications
- Utility modifications (roof racks, towing)
- Technology upgrades
- Lifestyle customization

### Usage Pattern & Lifestyle

**Driving Patterns**
- Annual mileage typical
- Primary use case (commute, family, recreation, business)
- Daily vs occasional driver
- Multi-vehicle household patterns
- Seasonal usage patterns

**Activity-Based Usage**
- Commute distance/duration
- Weekend recreation driving
- Family transport needs
- Adventure/off-road interest
- Commercial/business use

**Lifestyle Indicators**
- Towing/cargo capacity needs
- Off-road capability requirements
- Luxury/comfort priorities
- Performance interest (track days)
- Environmental consciousness (EV interest)

### Demographics & Household

**Demographic Indicators**
- Age group clustering
- Household income proxy
- Family size and composition
- Education level proxy
- Professional/occupation type

**Household Vehicle Patterns**
- Multi-vehicle household membership
- Primary vehicle role in household
- Spouse/partner vehicle preference alignment
- First-time buyer signals

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- primary_vehicle_segment
- vehicle_brand_primary
- ownership_duration_months
- annual_mileage_average
- service_visits_annual
- annual_service_spend
- last_purchase_days_ago
- next_purchase_estimated_days
- purchase_method_preference
- financing_preference_lease_vs_finance
- average_financed_amount
- price_tier_preference
- accessory_purchases_count
- accessory_spend_annual
- fuel_type_preference
- new_vs_used_preference
- age_group_proxy
- household_income_proxy
- multi_vehicle_household_flag
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (customer vehicle and ownership profiles)

### Statistical Metrics
- Ownership duration distribution (by segment)
- Annual mileage distribution
- Service spend distribution
- Purchase price distribution (by segment)
- Accessory spend distribution
- Days to next purchase distribution

### Quality Metrics
- Vehicle identification accuracy (VIN validation)
- Mileage data consistency
- Service history completeness
- Purchase transaction validation

## Seed Audience Definition

### Approach
1. **Select Vehicle Segment**: Identify target segment
2. **Establish Ownership Baseline**: Document tenure and usage patterns
3. **Map Purchase Behavior**: Identify buying patterns and preferences
4. **Profile Service Engagement**: Document service frequency and loyalty
5. **Identify Lifestyle Match**: Define primary use cases and ownership philosophy

### Example Seed Profiles

**Seed 1: "Premium SUV Enthusiast"**
- Primary segment: Luxury SUV
- Brands: BMW X5, Mercedes GLE, Audi Q7
- Ownership duration: 5-7 years
- Annual mileage: 10,000-12,000 miles
- Purchase method: New from dealership, finance/lease mix
- Price tier: $60K-$100K+
- Service: Dealer loyalty, annual spend $3K-$5K
- Accessories: Premium, tech-focused upgrades
- Usage: Family transport, luxury focus
- Next purchase window: 5-7 years from last

**Seed 2: "Practical Truck Owner"**
- Primary segment: Full-size pickup truck
- Brands: Ford F-150, Chevy Silverado, RAM 1500
- Ownership duration: 7-10 years
- Annual mileage: 12,000-15,000 miles
- Purchase method: Finance, new or certified pre-owned
- Price tier: $35K-$60K
- Service: Mix dealer/independent, annual spend $1K-$2K
- Accessories: Functional (towing, truck bed)
- Usage: Work/recreation mix, towing/hauling
- Next purchase window: 7-10 years

**Seed 3: "Eco-Conscious EV Adopter"**
- Primary segment: Electric vehicle (premium)
- Brands: Tesla Model S, BMW i7, Mercedes EQS
- Ownership duration: 3-5 years (EV upgrade cycle)
- Annual mileage: 8,000-10,000 miles
- Purchase method: Finance, new preferred
- Price tier: $50K-$100K
- Service: Minimal (EV maintenance low)
- Accessories: Tech and charging infrastructure
- Usage: Daily commute, tech-savvy, environmental
- Next purchase window: 3-5 years (tech upgrade)

## Matching Methodology

### Feature Space Construction
1. **Vehicle Segment Vector**: Encode primary and secondary segments
2. **Brand Affinity Vector**: Brand preference encoding
3. **Ownership Profile**: Duration, mileage, loyalty patterns
4. **Purchase Profile**: Method, financing, price tier
5. **Service Profile**: Frequency, spending, dealership loyalty
6. **Usage Profile**: Annual mileage, primary use, lifestyle

### Similarity Scoring
- **Segment Alignment**: Same segment or adjacent (SUV to crossover OK)
- **Brand Preference**: Same manufacturer or equivalent tier
- **Ownership Duration**: Within ±2 years of seed duration
- **Mileage Patterns**: Within ±3,000 miles annually
- **Purchase Method**: Same preference (new/used, finance/lease)
- **Price Tier**: Within ±15% of seed price point
- **Service Pattern**: Similar annual visit frequency
- **Lifestyle Match**: Similar primary usage patterns

### Candidate Filtering
- **Exclude**: Recent vehicle purchasers (within 6 months if targeting future sales)
- **Exclude**: Customers with outstanding warranty claims
- **Priority**: Customers approaching end-of-ownership window
- **Priority**: Repeat brand/segment purchasers
- **Bias toward**: Customers with positive service experiences

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Vehicle segment, brand tier, purchase method
- Can vary: Specific model, secondary brands (same tier)
- Expansion ratio: 3-6x
- Expected purchase price match: 85-95%

**Tier 2: Moderate (Balanced)**
- Must match: Segment category (truck/SUV/sedan), price tier, ownership duration
- Can vary: Specific brands (tier equivalent), financing method
- Expansion ratio: 10-18x
- Expected purchase price match: 70-85%

**Tier 3: Aggressive (Volume)**
- Must match: General vehicle type (truck/car/EV), price range category
- Can vary: Segment specifics, brand preferences
- Expansion ratio: 30-80x
- Expected purchase price match: 50-75%

## Expected Expansion Ratios

### By Vehicle Segment

**Luxury/Premium Segment Seeds**
- Conservative: 2-4x
- Moderate: 6-12x
- Aggressive: 15-30x
- Rationale: Niche premium segment, limited similar customers

**Mass Market Segment Seeds**
- Conservative: 4-8x
- Moderate: 12-25x
- Aggressive: 40-100x
- Rationale: Large addressable market, volume potential

**Specialty Segment Seeds (Trucks, EVs)**
- Conservative: 3-6x
- Moderate: 10-20x
- Aggressive: 30-60x
- Rationale: Segment-specific loyalty, dedicated buyers

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Vehicle segment (product fit)
- Price tier (budget alignment)
- Purchase timeline (sales readiness)
- Usage pattern (need alignment)

### Important Dimensions (Weight: 2.0x)
- Brand affinity (loyalty indicator)
- Ownership duration (replacement cycle)
- Service pattern (dealer engagement)
- Financing preference (approval likelihood)

### Supplementary Dimensions (Weight: 1.0x)
- Accessory interest (upsell opportunity)
- Specific features (personalization)
- Demographic indicators (targeting refinement)

## Implementation Approach

### Data Requirements
- Vehicle ownership history (VIN lookup)
- Service records from dealer systems
- Purchase transaction history (price, financing terms)
- Online browsing/research behavior if available
- Loyalty program participation data

### Lookalike Creation Steps
1. Use schema_discovery to understand vehicle ownership data model
2. Run feature_analysis on seed segment for ownership patterns
3. Use time_travel to identify customers approaching purchase windows
4. Calculate feature-space similarity for candidates
5. Apply segment and price-tier filtering
6. Generate lookalike audiences at multiple expansion tiers
7. Validate against historical purchase patterns

### Validation Strategy
- Compare lookalike price distribution to seed
- Verify segment mix consistency
- Check financing preference alignment
- Monitor service appointment patterns
- Track test drive and purchase conversion

## Segment-Specific Matching

### Luxury Segment Matching
- Emphasis on brand loyalty and premium features
- Service and warranty emphasis
- Trade-in value expectations
- Expected expansion: 3-8x

### Family Vehicle Matching
- Emphasis on capacity and safety features
- Household size indicators
- Extended warranty interest
- Expected expansion: 15-30x

### Performance/Enthusiast Matching
- Emphasis on performance metrics
- Modification interest
- Dealer engagement level
- Expected expansion: 8-15x

## Performance Expectations

- Lookalike audience size: 30-100x seed (depending on segment)
- Purchase price match: 70-95% of seed average
- Financing approval: 85-95% of seed approval rate
- Service visit frequency: 80-95% of seed frequency
- Model adoption: 75-90% within segment category
- Trade-in value consistency: ±10% of seed average
- False positive rate: 10-20%

## Monitoring & Optimization

### Key Metrics
- Average purchase price consistency
- Financing approval rate
- Service engagement levels
- Accessory adoption
- Vehicle retention period

### Refinement Triggers
- Purchase price variance >20% from seed
- Financing approval rate drops >10%
- Service frequency significantly different
- Segment switching increased
- Ownership duration shortened

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for vehicle ownership dimensions
- Identify calculated_attribute for ownership duration, service spend
- Verify vehicle segment taxonomy

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish price and ownership distributions
- Identify service and accessory patterns
- Validate brand preference clustering

### time_travel Usage
- Track ownership duration patterns
- Monitor service visit trends
- Identify purchase window approaches
- Detect accessory purchase cycles
- Monitor brand switching patterns

### query_builder Usage
- Cost estimation for ownership history queries
- Optimize vehicle matching calculations
- Model purchase window prediction cost

## Implementation Checklist

- [ ] Define 2-4 seed vehicle profiles (by segment)
- [ ] Establish ownership duration and mileage baselines
- [ ] Document vehicle segment and brand taxonomy
- [ ] Map purchase method and financing patterns
- [ ] Create feature space vectors
- [ ] Build similarity scoring formula
- [ ] Test on historical owners (backtesting)
- [ ] Validate lookalike vs seed purchase price
- [ ] Set up performance dashboards
- [ ] Plan purchase window targeting strategy
- [ ] Document expansion ratio assumptions
- [ ] Schedule quarterly model updates
