# Automotive Audience Finding Guide

## Overview
Automotive marketing uses purchase cycle stage, service loyalty, and model affinity to identify sales-ready buyers and service-focused customers. Use CDP data to target replacement cycles, trade-in opportunities, and service upsells.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Vehicle ownership history (models, purchase dates, trade-in information)
- Purchase cycle stage (research, consideration, test drive, purchase, financing)
- Service visit history (date, type, mileage, cost)
- Warranty status and expiration dates
- Current vehicle(s) model, year, mileage
- Finance/lease information and terms
- Model interests and research activity (website, dealership visits)
- Accessories and parts purchase history
- Trade-in value and upgrade readiness
- Maintenance reminders and service completion
- CPO (Certified Pre-Owned) interaction
- Fleet vs individual classification
- Lease vs buy preference
- Insurance and coverage indicators
- Test drive and demo participation history
- Email and digital engagement with models
- Marketing channel response

```
schema_discovery operation: "store", store_type: "event_store"
schema_discovery operation: "columns", columns: ["vehicle_model", "purchase_date", "warranty_expiry", "service_visit_count"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Ownership duration**: Years since purchase, typical replacement window
- **Service loyalty**: Service visit frequency, preferred dealership patterns
- **Model affinity**: Current model, preferred segments (sedan, SUV, truck, EV)
- **Mileage progression**: Annual miles, warranty expiration readiness
- **Lifecycle stage**: New buyer, repeat customer, long-term owner
- **Parts/accessories spend**: Trend, accessory affinity
- **Warranty status**: Remaining coverage, extension opportunity

```
feature_analysis columns: ["years_since_last_purchase", "service_frequency_annual",
  "current_vehicle_mileage", "warranty_months_remaining"],
metric_types: ["basic", "statistical"]
```

## Common Audience Definitions

### 1. Trade-In Ready (Replacement Window)
**Filter Criteria:**
- Vehicle ownership: 3-5 years (typical cycle)
- Mileage: 30K-80K miles (replacement indicators)
- Warranty: <12 months remaining (future cost concern)
- Service trend: Increasing frequency or repair costs
- Current model: Model year 2019-2021
- Trade-in value potential: >$15K (economically viable)
- Brand affinity: Own competitive brand (cross-sell potential)
- Engagement: Website browsing or email opens recent

**Expected Size:** 10-15% of base
**Activation:** Trade-in valuation tools, replacement model recommendations, financing pre-qualification, test drive invitations

### 2. Warranty Expiry Window (Service Upsell)
**Filter Criteria:**
- Warranty expiration: 30-180 days away
- Current coverage: OEM or extended warranty active
- Service history: Regular maintenance (good candidates)
- Mileage: Approaching warranty limit awareness
- Model: 3-5 years old (warranty extension relevant)
- Engagement: Not lapsed on communications
- Financing: Purchased or financed (not lease)
- Repair cost exposure: Upcoming risk

**Expected Size:** 8-12% of base (monthly flow)
**Activation:** Warranty extension offers, maintenance packages, service plan bundles, repair cost protection, peace-of-mind messaging

### 3. High-Value Service Customers
**Filter Criteria:**
- Service spend: Annual >$2K in parts and labor
- Service frequency: 4+ visits per year
- Service loyalty: 70%+ at brand dealership
- Model: Premium or luxury brand
- Ownership: 2+ vehicles in household
- Engagement: Active in ownership apps or programs
- Service type: Mix of warranty and out-of-warranty
- Payment: Credit account or loyalty program member

**Expected Size:** 8-12% of base
**Activation:** VIP service programs, express maintenance, parts discounts, loaner vehicle priority, service concierge

### 4. CPO (Certified Pre-Owned) Buyers
**Filter Criteria:**
- Purchase history: Previously purchased pre-owned
- Model affinity: Same brand CPO purchases
- Purchase cycle: Looking for value + warranty combination
- Financing: Open to finance/lease
- Budget: CPO price range ($15K-$35K typical)
- Engagement: Research-focused (multiple website visits)
- Loyalty: Brand switcher or repeat CPO buyer
- Timeline: Active searches (last 30 days)

**Expected Size:** 12-18% of base
**Activation:** CPO inventory alerts, competitive pricing, warranty coverage education, certified dealer locator, financing pre-approval

### 5. EV/Alternative Fuel Adoption Ready
**Filter Criteria:**
- Current vehicle: Gas-only (replacement needed)
- Ownership: 3+ years (upgrade timing)
- Model next: Research behavior for EV/hybrid
- Environmental indicators: Brand preference signals
- Tech adoption: High (digital engagement, app usage)
- Household: Urban or suburban (charging availability)
- Income: Middle to upper (EV price point)
- Government incentive eligibility: Based on location/income

**Expected Size:** 15-25% of base (growing)
**Activation:** EV education, incentive calculators, charging network info, test drive exclusive, EV-specific financing, environmental messaging

### 6. Accessory & Customization Enthusiasts
**Filter Criteria:**
- Accessory purchases: 3+ in past year
- Customization spend: >$1K annually (wheels, trim, audio)
- Engagement: High (website visits, accessories browsing)
- Model affinity: Strong (loyal to current model brand)
- Model type: Performance, truck, or customization-friendly
- Community: Participates in forums or social groups
- Ownership: <3 years (warranty still good for accessories)
- Personalization: Multiple purchases showing curation

**Expected Size:** 8-12% of base
**Activation:** Accessory bundles, customization packages, dealer upgrade programs, exclusive parts, community events

### 7. Fleet or Multi-Vehicle Owners
**Filter Criteria:**
- Vehicle count: 2+ vehicles in CDP
- Ownership: Mix of models (family vehicles, personal, work)
- Business indicator: Work-related vehicle usage
- Service: Using multiple service centers or fleet program
- Budget: Higher spending on fleet management
- Purchase pattern: Bulk/fleet pricing awareness
- Engagement: Fleet account or program membership
- Lease vs buy: Mix of owned and leased

**Expected Size:** 10-15% of base
**Activation:** Fleet programs, bulk pricing, fleet maintenance packages, vehicle management tools, business incentives

### 8. Lease Expiration (Coming Due)
**Filter Criteria:**
- Lease term: 30-60 days remaining
- Current vehicle: Leased (known date)
- Mileage: Within acceptable limits (no overage fees)
- Lease type: Personal or business
- Brand affinity: Same brand preference indicators
- Budget: Lease payment range for next vehicle
- Next step: Lease return, lease renewal, or purchase
- Engagement: Pre-notification ready

**Expected Size:** 5-8% of base (monthly flow)
**Activation:** Lease return processes, new lease offers, purchase conversion, vehicle trade-in options, loyalty incentives

### 9. Service-Loyal Customers (Retention Focus)
**Filter Criteria:**
- Service history: 4+ years at same dealership
- Service frequency: Regular scheduled maintenance
- Dealership loyalty: 80%+ service visits at brand dealer
- Relationship: Known/referred by name
- Satisfaction: Positive feedback/NPS score
- Ownership: Current vehicle 3-5 years old
- Model affinity: Repeat buyer of same brand
- Engagement: High touchpoint response rate

**Expected Size:** 12-18% of base
**Activation:** VIP appreciation programs, service priority, exclusive maintenance deals, trade-in loyalty bonuses, lifetime customer recognition

## Example Audience Queries

### Query 1: Trade-In Ready Replacement Cycle
```sql
SELECT customer_id, email, phone, current_vehicle_model, vehicle_purchase_year,
       current_mileage, estimated_trade_in_value, warranty_expiry_date
FROM vehicle_ownership
WHERE DATEDIFF(YEAR, vehicle_purchase_date, CURRENT_DATE) BETWEEN 3 AND 5
AND current_mileage BETWEEN 30000 AND 80000
AND DATEDIFF(DAY, CURRENT_DATE, warranty_expiry_date) < 365
AND estimated_trade_in_value > 15000
AND ownership_type = 'personal'
AND last_website_visit >= DATE_SUB(CURRENT_DATE, INTERVAL 60 DAY)
ORDER BY estimated_trade_in_value DESC
```

### Query 2: Warranty Extension - Pre-Expiry Campaign
```sql
SELECT customer_id, email, phone, vehicle_model, warranty_expiry_date,
       days_until_expiry, annual_service_cost_trend, mileage_to_expiry
FROM vehicle_profiles
WHERE warranty_type IN ('OEM', 'extended_warranty')
AND DATEDIFF(DAY, CURRENT_DATE, warranty_expiry_date) BETWEEN 30 AND 180
AND service_frequency_annual >= 2
AND DATEDIFF(YEAR, vehicle_purchase_date, CURRENT_DATE) BETWEEN 3 AND 5
AND NOT EXISTS (
  SELECT 1 FROM warranty_offers
  WHERE customer_id = vp.customer_id
  AND offer_status = 'accepted'
  AND offer_date >= DATE_SUB(CURRENT_DATE, INTERVAL 180 DAY)
)
ORDER BY warranty_expiry_date ASC
```

### Query 3: EV Upgrade Candidates (Tech-Forward, Next Replacement)
```sql
SELECT customer_id, email, phone, current_vehicle_type, vehicle_age,
       mileage, estimated_replacement_date, environmental_affinity_score,
       tech_engagement_score
FROM customer_profiles
WHERE vehicle_type = 'gasoline_only'
AND DATEDIFF(YEAR, vehicle_purchase_date, CURRENT_DATE) >= 3
AND tech_engagement_score > 70
AND environmental_affinity_score > 65
AND household_location_charging_available = true
AND income_estimate > 60000
AND website_ev_page_visits > 0
AND NOT EXISTS (
  SELECT 1 FROM ev_test_drives
  WHERE customer_id = cp.customer_id
  AND test_drive_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
)
ORDER BY estimated_replacement_date ASC
```

## Activation Channel Recommendations

| Segment | Email | SMS | Mobile App | Retargeting | Direct Mail | Dealership |
|---------|-------|-----|-----------|------------|------------|-----------|
| Trade-In Ready | High | High | High | Very High | High | Very High |
| Warranty Expiry | Very High | High | Medium | High | High | High |
| High-Value Service | High | Medium | Very High | Low | Medium | Very High |
| CPO Buyers | High | Medium | High | Very High | Medium | High |
| EV Adopters | Very High | Medium | Very High | High | Medium | High |
| Accessory Enthusiasts | High | Low | Very High | High | Low | High |
| Fleet Owners | High | High | Medium | Low | High | Very High |
| Lease Expiration | Very High | Very High | High | Medium | High | Very High |
| Service-Loyal | High | Low | High | Low | Medium | Very High |

## Purchase Cycle Timeline

1. **Research Phase (0-3 months)**: Website visits, email engagement, competitor comparison
2. **Consideration Phase (1-2 months)**: Test drive requests, configurators, financing inquiries
3. **Test Drive Phase (2-4 weeks)**: Dealership visits, vehicle comparison, incentive inquiries
4. **Negotiation Phase (1-2 weeks)**: Pricing, trade-in valuation, financing terms
5. **Purchase Phase (days)**: Final negotiation, paperwork, delivery scheduling
6. **Post-Purchase (weeks)**: Delivery, registration, warranty education, satisfaction survey

## Tips for Success

1. Map vehicle age/mileage to replacement windows; build predictive models
2. Monitor warranty expiry dates; automate 180/90/30-day reminders
3. Use service visit frequency as loyalty indicator; protect high-frequency customers
4. Track model affinity; recommend next model in same series
5. Analyze trade-in valuations; use as incentive messaging ($X for your trade)
6. Build CPO audience separately; they have different messaging (value + warranty)
7. Monitor EV infrastructure in customer locations; target addressable audience
8. Use time_travel for seasonal analysis (Q1 tax incentives, summer road trip, holiday gift buying)
9. Create lease-expiration calendar; pre-plan outreach 90 days prior
10. Track dealership service loyalty; reward long-term customers with VIP programs
