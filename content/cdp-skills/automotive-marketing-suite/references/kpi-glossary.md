# Automotive Marketing KPI Glossary

Essential performance metrics for automotive OEM, dealership, and fleet marketing campaigns in the Zeotap CDP.

## Sales & Volume Metrics

### Cost Per Lead (CPL)
**Definition**: Total marketing spend divided by number of qualified leads generated.
- **Formula**: Total Marketing Spend / Qualified Leads Generated
- **Benchmark**: $100-500 CPL depending on vehicle segment and market
- **Use Case**: Evaluate lead generation campaign efficiency
- **CDP Insight**: Track CPL by channel, campaign, and audience segment to optimize spend allocation

### Test Drive Conversion Rate
**Definition**: Percentage of test drive requests that result in actual test drives completed.
- **Formula**: (Test Drives Completed / Test Drives Requested) × 100
- **Benchmark**: 60-80% for online requests, 90%+ for in-dealership requests
- **Use Case**: Measure scheduling optimization and test drive readiness
- **CDP Insight**: Use **cdp-data-analyzer** to identify scheduling friction and optimal time slots

### Test Drive-to-Purchase Conversion
**Definition**: Percentage of completed test drives that result in purchase within 30-60 days.
- **Formula**: (Purchases / Test Drives Completed) × 100
- **Benchmark**: 15-30% depending on vehicle segment and dealership quality
- **Use Case**: Measure sales effectiveness and follow-up quality
- **CDP Insight**: Use **cdp-churn-finder** to identify test drivers not returning for purchase

### Sales Velocity
**Definition**: Average days from lead to purchase completion.
- **Benchmark**: 30-45 days average, luxury segment 45-60 days
- **Use Case**: Track sales cycle efficiency and process optimization
- **CDP Insight**: Analyze velocity by acquisition channel and vehicle segment

### Transaction Price
**Definition**: Average selling price per vehicle sold.
- **Formula**: Total Revenue / Number of Vehicles Sold
- **Benchmark**: Varies by segment (luxury $50k+, mid-market $25-35k, economy $15-20k)
- **Use Case**: Measure pricing strategy and trim-level sell-through
- **CDP Insight**: Track transaction price by vehicle model and customer segment

## Service & Loyalty Metrics

### Service Retention Rate
**Definition**: Percentage of vehicle owners using dealership for service vs. independent shops.
- **Formula**: (Owners Using Dealership Service / Total Vehicle Owners) × 100
- **Benchmark**: 50-70% service retention for new cars, declines 10-20% annually
- **Use Case**: Measure loyalty and service revenue capture
- **CDP Insight**: Use **cdp-churn-finder** to identify at-risk service customers for win-back

### Parts Attach Rate
**Definition**: Percentage of service visits that include parts sales or accessories.
- **Benchmark**: 60-80% of service visits include parts
- **Use Case**: Measure cross-sell effectiveness and service profitability
- **CDP Insight**: Use **cdp-journey-recommender** to recommend parts and accessories pre-visit

### Warranty Claim Rate
**Definition**: Percentage of vehicles under warranty that file warranty claims.
- **Formula**: (Warranty Claims / Vehicles Under Warranty) × 100
- **Benchmark**: 20-40% during warranty period
- **Use Case**: Measure vehicle quality, reliability, and warranty cost exposure
- **CDP Insight**: Correlate warranty claims with customer satisfaction and NPS

### Net Promoter Score (NPS)
**Definition**: Percentage of promoters minus percentage of detractors on "likelihood to recommend" scale.
- **Formula**: (% Promoters - % Detractors) × 100
- **Benchmark**: 30-50 for automotive industry, 60+ indicates market leader
- **Use Case**: Measure customer satisfaction and brand loyalty
- **CDP Insight**: Correlate NPS by dealership location and service type

### Repeat Purchase Rate
**Definition**: Percentage of customers who purchase a second vehicle from same brand.
- **Formula**: (Repeat Buyers / Total Buyers) × 100
- **Benchmark**: 40-60% for mass market, 60-75% for luxury brands
- **Use Case**: Measure brand loyalty and lifetime value
- **CDP Insight**: Use **cdp-lookalike-finder** to identify repeat buyer profiles and expand reach

## Trade-In & Finance Metrics

### Trade-In Capture Rate
**Definition**: Percentage of trade-in vehicles sourced from new vehicle purchases.
- **Formula**: (Trade-In Vehicles from New Purchases / Total New Vehicles Sold) × 100
- **Benchmark**: 40-60% of new sales include trade-ins
- **Use Case**: Measure internal sourcing efficiency and customer loyalty
- **CDP Insight**: Use **cdp-churn-finder** to identify owners approaching trade-in window

### Trade-In to Repurchase Conversion
**Definition**: Percentage of customers trading in vehicles with the same brand.
- **Formula**: (Same-Brand Trade-Ins / Total Trade-Ins) × 100
- **Benchmark**: 50-70% loyalty indicator
- **Use Case**: Measure brand retention and loyalty program effectiveness
- **CDP Insight**: Use **cdp-audience-finder** to build trade-in eligible segments for retention campaigns

### Financing Penetration
**Definition**: Percentage of retail sales with dealer-arranged or brand financing.
- **Formula**: (Dealer/Brand Financed Sales / Total Retail Sales) × 100
- **Benchmark**: 60-80% depending on brand and market
- **Use Case**: Measure captive finance strategy effectiveness
- **CDP Insight**: Layer financing data to track payment performance and default risk

### Lease-to-Loyalty Conversion
**Definition**: Percentage of lease-end customers who purchase another vehicle vs. walking away.
- **Formula**: (Purchase at Lease End / Total Lease Maturities) × 100
- **Benchmark**: 40-60% lease-end conversion
- **Use Case**: Measure lease program effectiveness and retention
- **CDP Insight**: Use **cdp-journey-recommender** to trigger purchase messages 6-9 months pre-lease-end

### Average Loan Term
**Definition**: Average number of months for new vehicle loans.
- **Benchmark**: 60-72 months for mass market, 36-48 months for luxury
- **Use Case**: Track customer affordability and financing trends
- **CDP Insight**: Identify customers approaching payoff for trade-in targeting

## Customer Lifetime Value Metrics

### CLTV (Customer Lifetime Value)
**Definition**: Total net profit expected from a customer relationship over vehicle ownership lifecycle.
- **Formula**: (Vehicle Sale Revenue + Service Revenue + Parts Revenue - Cost of Service - Acquisition Cost) × Repeat Probability
- **Benchmark**: 1.5-2.5x vehicle transaction price
- **Use Case**: Determine optimal retention and acquisition investment
- **CDP Insight**: Use **cdp-data-scientist** to build predictive CLTV models by segment

### Vehicle Lifetime Revenue
**Definition**: Total revenue captured from customer from initial purchase through trade-in/end of ownership.
- **Components**: Vehicle sale + service revenue + parts revenue + insurance premiums (if captured)
- **Benchmark**: Varies by vehicle segment and ownership duration
- **Use Case**: Measure total customer value across entire ownership lifecycle
- **CDP Insight**: Correlate vehicle lifetime revenue with brand loyalty and repurchase propensity

### Service Revenue Per Owner
**Definition**: Average annual service revenue per vehicle owner.
- **Formula**: Total Annual Service Revenue / Total Vehicle Owners
- **Benchmark**: $500-1,200 annually depending on vehicle age and type
- **Use Case**: Optimize service marketing and retention investment
- **CDP Insight**: Use **cdp-data-enricher** to layer vehicle age and type for service forecasting

### Conquest Rate
**Definition**: Percentage of new customers acquired from competing brands.
- **Formula**: (Customers Switching from Competitors / Total New Customers) × 100
- **Benchmark**: 20-40% typical market share turnover
- **Use Case**: Measure competitive strength and market share gains
- **CDP Insight**: Use **cdp-lookalike-finder** to identify competitor customers most likely to convert

## EV & Sustainability Metrics

### EV Market Share
**Definition**: Percentage of total vehicle sales that are electric vehicles.
- **Benchmark**: 3-10% in most markets, 15%+ in progressive markets
- **Use Case**: Track EV adoption and electrification progress
- **CDP Insight**: Use **cdp-audience-finder** to identify EV-ready customers by usage patterns

### EV Adoption Propensity
**Definition**: Likelihood score for traditional vehicle owners to purchase an EV for next vehicle.
- **Factors**: Daily driving miles, income, environmental values, early adopter profile
- **Benchmark**: 5-15% of traditional owners are EV-ready in any given year
- **Use Case**: Target EV marketing to highest-propensity audiences
- **CDP Insight**: Use **cdp-data-scientist** to build EV adoption prediction models

### EV Trial Rate
**Definition**: Percentage of EV test drives that convert to purchase.
- **Benchmark**: 25-40% EV test drive conversion (higher than traditional vehicles)
- **Use Case**: Measure EV marketing effectiveness and sales effectiveness
- **CDP Insight**: Track conversion by EV model and competitor comparisons

---

**CDP Integration Tips**:
- Build buyer stage segments using **cdp-audience-finder** based on lifecycle position and purchase signals
- Develop predictive models with **cdp-data-scientist** for purchase propensity and lifetime value forecasting
- Monitor KPI health with **cdp-health-diagnostics** to ensure data accuracy and completeness
- Use **cdp-data-enricher** to layer vehicle data, financing, and service history into customer profiles
- Power personalized sequences with **cdp-journey-recommender** based on ownership stage and service needs
