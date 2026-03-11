# Automotive Industry Analysis Guide

## Overview
This guide provides analysis frameworks for automotive manufacturers and dealers. Focus on purchase cycles, service retention, customer satisfaction, and EV transition.

## Purchase Cycle Analysis

### Consideration Phase
Track prospect journey before purchase:
- **Awareness**: Website visits, content consumption (brochures, videos)
- **Exploration**: Configurator usage (customizing models, comparing prices)
- **Test drive requests**: Appointment booking, completion rates
- **Financing inquiry**: Credit application, rate shopping
- **Lead nurture**: Email engagement, dealer contact frequency

### Decision Timing
Analyze purchase acceleration drivers:
- **Lead age**: Days from first contact to purchase
- **Sequence**: What's the optimal contact sequence?
- **Seasonality**: Are Q4 buyers different from Q1 buyers?
- **Life events**: Job changes, relocation, family expansion triggering purchases?

### Customer Segmentation in Cycle
- **Browsers**: High engagement, slow decision (information seeking)
- **Quick deciders**: Low touchpoint, rapid purchase
- **Trade-in evaluators**: Vehicle age/mileage concerns
- **Financing-driven**: Payment amount sensitivity

### Dealer vs. Online
- Which channel drives purchase (dealer vs. digital)?
- Hybrid approach (online research, dealer transaction)?
- Purchase completion channel by customer segment
- Satisfaction variance by sales channel

Use `feature_analysis` with `metric_types: ["statistical"]` to profile purchase cycle length distributions.

## Service Retention Analysis

### Service Visit Patterns

**Scheduled Maintenance**
- Service interval adherence (customers following recommended schedule)
- Oil change frequency (baseline service)
- Tire rotation participation
- Major service completion (at 30K, 60K, 100K miles)

**Unscheduled/Warranty**
- Warranty claim rates (quality perception)
- Issue types (electrical, drivetrain, body)
- Repeat issues (same customer, same problem = dissatisfaction signal)

### Service Loyalty
- % of owners returning to original dealer (vs. independent shops)
- Service visit frequency by ownership duration
- Service $ value over ownership cycle
- Retention by vehicle age (when do owners go elsewhere?)

### Relationship Drivers
- Service quality (first-time fix rate)
- Convenience (service appointments, wait times, loaner cars)
- Pricing perception (parts/labor charged fairly?)
- Dealer relationships (preferred service advisor)

### Service as Upsell
- Do service visitors buy add-ons (premium tires, packages)?
- Parts upsells (batteries, wipers, filters)
- Extended warranty uptake
- Ancillary services (detailing, window tinting)

Use `time_travel` CDF analysis to track service visit frequency changes over customer lifetime.

## Model Preference Trends

### Portfolio Analysis
Track demand across model lineup:

**By Segment**
- Sedan vs. Coupe vs. SUV vs. Truck share
- Luxury vs. mainstream popularity
- Performance vs. efficiency preferences
- New segments emerging (electric, crossover)

**By Powertrain**
- Gas vs. hybrid vs. electric share
- Powertrain preference by geography
- Adoption curve of new powertrains
- Range anxiety indicators (battery size demand)

**By Feature**
- Transmission preference (manual vs. automatic vs. CVT)
- Trim level distribution (are customers upgrading specs?)
- Option package adoption (luxury vs. practical options)
- Technology adoption (infotainment, driver assistance)

### Geographic Variations
- Regional model preferences (trucks in certain regions)
- Urban vs. rural segment preferences (SUVs vs. sedans)
- Climate-related preferences (snow markets preferring AWD?)
- Local competition intensity impact

### Demographic Patterns
- Age group model preferences (younger buyers vs. mature buyers)
- Gender-specific preferences (buying patterns differ?)
- Family size impact (2-seater vs. minivan)
- Income level model selection

Use `feature_analysis` to profile demographic and geographic distribution of model preferences.

## Trade-In Timing Analysis

### Vehicle Age Patterns
Analyze when customers trade in:

**Optimal Trade-In Windows**
- 3-5 years: Post-warranty, before major maintenance needs
- 5-7 years: Depreciation curve inflection points
- 100K miles: Transmission/engine reliability concerns emerging
- 200K+ miles: Reliable vehicles (loyalty/emotional attachment)

### Mileage Milestones
- 30K miles: First major service threshold
- 60K miles: Warranty expiration (owner cost shift)
- 100K miles: Major cost potential (transmission, engine)
- 150K+ miles: Extended vehicle life (how many are crossing?)

### Trade-In Readiness Signals
- Service cost increases (approaching major service)
- Repair frequency trending up (reliability concerns)
- Fuel efficiency concerns (consumer perception)
- Safety/technology gap (new models have advanced features)

### Same-Brand Loyalty
- What % of trade-ins are replaced with same brand?
- How does satisfaction impact brand retention?
- Cross-shopping (considering competitor brands)?
- Traded-in vehicle condition (satisfaction proxy)

### Owner Profiling
- Time between trade-ins (consistent upgraders vs. long-keepers)
- Trade-down phenomenon (downgrading at trade-in time)
- Multiple vehicles in household (trading one while owning others)

## Accessory Attach Rates

### Popular Accessories
Track adoption by accessory category:

**Performance/Aesthetic**
- Wheels and tires (most popular)
- Body kits and exterior trim
- Interior trim upgrades
- Exhaust systems

**Functional**
- Roof racks and cargo carriers
- Towing packages
- Off-road accessories
- Weathertech mats and protection

**Technology**
- Navigation/infotainment upgrades
- Safety systems (backup cameras, sensors)
- Connected car features
- Premium audio systems

### Attach Analysis
- What % buy accessories at purchase vs. post-purchase?
- Average accessory spend per customer
- Accessory margin contribution (high margin products?)
- Cross-sell effectiveness (bundle opportunities)

### Dealer vs. Aftermarket
- Do customers buy from dealer or independent shops?
- Warranty implications (dealer vs. aftermarket)
- Customer perception (genuine vs. third-party)

Use `query_builder` cost analysis for accessory attach analysis across vehicle lineup.

## Customer Satisfaction Drivers

### Net Promoter Score (NPS) Drivers
Analyze satisfaction components:

**Purchase Experience**
- Sales process satisfaction (pushy vs. consultative?)
- Financing terms clarity
- Trade-in valuation fairness
- Delivery/handover experience

**Product Quality**
- Build quality (fit/finish)
- Reliability (no defects)
- Performance (meets expectations)
- Features work as intended

**Service Experience**
- Service appointment availability
- Wait times and service speed
- Diagnosis accuracy (first-time fix rate)
- Parts availability (not waiting for parts)
- Pricing transparency

**Ownership Experience**
- Fuel efficiency (real-world vs. EPA)
- Feature usability (learning curve, intuitiveness)
- Warranty clarity (what's covered?)
- Resale value trajectory (depreciation acceptance)

### Satisfaction Segmentation
- NPS by dealership (dealer quality variance)
- NPS by model (which models drive satisfaction)
- NPS by purchase channel (dealer vs. online)
- NPS by demographic (age, region patterns)

### Satisfaction-Retention Link
- Does NPS predict repeat purchase?
- Do satisfied owners provide referrals?
- Dissatisfaction leading to brand switching
- Loyalty program effectiveness

## EV Transition Analysis

### EV Market Share
Track electric vehicle adoption:

**Portfolio Shift**
- % of sales in electric models
- Segment penetration (luxury vs. mainstream EVs)
- Pure electric vs. plug-in hybrid mix
- Growth rate of EV segment

**Customer Migration**
- Are legacy customers transitioning to EV?
- What drives the switch (fuel prices, environmental, incentives)?
- Segment most receptive to EV (early adopters vs. mainstream)
- Geographic adoption (where's EV growth fastest?)

### Concerns and Barriers
- Range anxiety indicators (battery size demand)
- Charging infrastructure concerns (urban vs. rural differences)
- Price premium tolerance (how much will customers pay for EV?)
- Performance expectations (acceleration, handling comparisons)

### Incentive Impact
- Federal tax credits driving conversion rates
- State/local incentives effectiveness by region
- Price point elasticity (customer price sensitivity)
- Lease vs. buy preference for EVs

### Fuel Cost Economics
- Total cost of ownership (TCO) comparison
- Electricity costs vs. gasoline
- Maintenance cost benefits (fewer moving parts)
- Fuel type availability (charging network gaps)

Use `time_travel` to track EV adoption growth over quarters and by customer segment.

## Integration Workflow

1. **Data Mapping**: Use `schema_discovery` for vehicle, transaction, and service tables
2. **Cycle Analysis**: Apply `feature_analysis` to purchase and service patterns
3. **Trend Analysis**: Use `time_travel` for historical model preference and EV adoption
4. **Profitability**: Use `query_builder` cost analysis before large lifecycle calculations
5. **Satisfaction Correlation**: Calculate NPS impact on repeat purchase and referrals

## Key Metrics Dashboard

- Purchase cycle length and completion rate
- Service retention rate by ownership duration
- Model sales mix and growth trends
- Average trade-in vehicle age and condition
- Accessory attach rate and average spend
- NPS by dealership and model
- EV sales share and growth rate
