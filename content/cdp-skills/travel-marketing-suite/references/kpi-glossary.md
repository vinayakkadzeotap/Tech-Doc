# Travel & Hospitality KPI Glossary

Essential performance metrics for travel, hotel, airline, and OTA marketing campaigns in the Zeotap CDP.

## Revenue Metrics

### RevPAR (Revenue Per Available Room)
**Definition**: Total room revenue divided by the number of available rooms in a given period.
- **Formula**: Total Room Revenue / Number of Available Rooms
- **Benchmark**: Luxury hotels 150+, Mid-range 80-120, Budget 40-80
- **Use Case**: Measure hotel efficiency and pricing strategy effectiveness
- **CDP Insight**: Use **cdp-data-enricher** to layer RevPAR data into guest profiles for targeting high-value guests

### ADR (Average Daily Rate)
**Definition**: Average price charged for a room per night.
- **Formula**: Total Room Revenue / Number of Rooms Sold
- **Benchmark**: Varies by location, season, and property class
- **Use Case**: Track pricing strategy impact and seasonal rate optimization
- **CDP Insight**: Segment guests by ADR sensitivity to test tiered pricing campaigns

### Ancillary Revenue
**Definition**: Non-room revenue from services like parking, dining, activities, spa, upgrades.
- **Benchmark**: 15-25% of total revenue for full-service hotels
- **Use Case**: Identify upsell opportunities and optimize bundled offers
- **CDP Insight**: Use **cdp-journey-recommender** to suggest ancillary services based on traveler profile

### Yield
**Definition**: Ratio of actual revenue to potential maximum revenue if all rooms sold at highest price.
- **Formula**: (Actual Revenue / (Rooms Available × Highest Room Price)) × 100
- **Benchmark**: 60-85% for well-optimized properties
- **Use Case**: Assess pricing optimization and demand management effectiveness
- **CDP Insight**: Identify over/underpricing scenarios across traveler segments

## Occupancy & Booking Metrics

### Occupancy Rate
**Definition**: Percentage of available rooms occupied during a period.
- **Formula**: (Rooms Occupied / Rooms Available) × 100
- **Benchmark**: 70-85% for healthy properties, 85%+ is strong
- **Use Case**: Measure demand fulfillment and supply utilization
- **CDP Insight**: Low occupancy signals opportunity for **cdp-churn-finder** win-back campaigns

### Booking Window
**Definition**: Average number of days between booking and travel/check-in.
- **Benchmark**: 30-45 days average, varies by trip type
- **Patterns**: Leisure: 6-8 weeks, Business: 1-2 weeks, Group: 3-6 months
- **Use Case**: Plan campaign timing to align with booking behavior
- **CDP Insight**: Use **cdp-data-analyzer** to predict optimal booking window windows by segment

### Load Factor (Airlines)
**Definition**: Percentage of available seats actually occupied on flights.
- **Formula**: (Actual Passengers / Total Seat Capacity) × 100
- **Benchmark**: 75-85% for healthy airlines
- **Use Case**: Measure revenue optimization and pricing effectiveness
- **CDP Insight**: Segment audiences by last-minute vs. early-planner booking patterns

## Customer Value Metrics

### CLTV (Customer Lifetime Value)
**Definition**: Total net profit expected from a customer relationship over their lifetime.
- **Formula**: (Annual Spend × Gross Margin × Relationship Duration) - Acquisition Cost
- **Benchmark**: 3-5x higher for repeat travelers than one-time bookers
- **Use Case**: Prioritize retention and loyalty program investment
- **CDP Insight**: Use **cdp-data-scientist** to build predictive CLTV models by segment

### Booking Frequency
**Definition**: Average number of bookings per customer per year.
- **Benchmark**: 2-4 trips/year for leisure, 8-12 trips/year for business
- **Use Case**: Identify high-frequency travelers for VIP treatment
- **CDP Insight**: Segment into "frequent," "occasional," and "one-time" tiers with **cdp-audience-finder**

### Customer Acquisition Cost (CAC)
**Definition**: Total marketing spend divided by number of new customers acquired.
- **Formula**: Marketing Spend / New Customers Acquired
- **Benchmark**: CAC should be <20% of first year CLTV
- **Use Case**: Evaluate marketing efficiency and channel ROI
- **CDP Insight**: Use **cdp-data-enricher** to track CAC by acquisition channel and campaign

## Loyalty & Retention Metrics

### Loyalty Tier Distribution
**Definition**: Percentage of customer base in each loyalty program tier.
- **Tiers**: Silver, Gold, Platinum, Diamond (example structure)
- **Benchmark**: 20% in top tier, 40% mid-tier, 40% entry-level (typical)
- **Use Case**: Allocate benefits and retention spend to tier composition
- **CDP Insight**: Use **cdp-audience-finder** to build tier-specific campaigns and upgrade paths

### Repeat Booking Rate
**Definition**: Percentage of customers who book again within a specific timeframe (usually 12-24 months).
- **Benchmark**: 20-40% for leisure, 60-80% for business
- **Use Case**: Measure loyalty program effectiveness and customer satisfaction impact
- **CDP Insight**: Use **cdp-churn-finder** to identify at-risk repeat customers for intervention

### Loyalty Program Enrollment
**Definition**: Percentage of bookings made by loyalty program members.
- **Benchmark**: 40-60% of revenue from loyalty members
- **Use Case**: Track loyalty program growth and engagement
- **CDP Insight**: Use **cdp-journey-recommender** to drive enrollment with personalized value propositions

### Miles/Points Redemption Rate
**Definition**: Percentage of earned miles/points actually redeemed within program life.
- **Benchmark**: 60-75% redemption rate
- **Use Case**: Assess program health and member engagement
- **CDP Insight**: Identify low-redeemers for engagement campaigns and low-friction redemption offers

## Satisfaction & NPS Metrics

### Net Promoter Score (NPS)
**Definition**: Percentage of promoters minus percentage of detractors based on "likelihood to recommend" question.
- **Formula**: (% Promoters - % Detractors) × 100
- **Benchmark**: 30-50 for travel industry, 60+ is excellent
- **Use Case**: Measure customer satisfaction and loyalty drivers
- **CDP Insight**: Use **cdp-churn-finder** to flag detractors for service recovery

### Customer Satisfaction (CSAT)
**Definition**: Percentage of customers satisfied or very satisfied with their travel experience.
- **Survey Question**: "How satisfied are you with your experience?"
- **Benchmark**: 75-85% for healthy properties
- **Use Case**: Track service quality and operational excellence
- **CDP Insight**: Correlate CSAT with repeat booking propensity

### Customer Effort Score (CES)
**Definition**: How easy it was for customers to complete their booking and check-in.
- **Scale**: 1-5 or 1-7
- **Benchmark**: 4.0+ on 5-point scale
- **Use Case**: Identify friction points in customer journey
- **CDP Insight**: Use **cdp-journey-recommender** to optimize paths for high-effort segments

## Cancellation & Churn Metrics

### Cancellation Rate
**Definition**: Percentage of bookings cancelled before travel date.
- **Formula**: (Cancelled Bookings / Total Bookings) × 100
- **Benchmark**: 5-15% for leisure, 2-5% for business
- **Use Case**: Forecast revenue volatility and identify cancellation drivers
- **CDP Insight**: Use **cdp-churn-finder** to detect early cancellation signals (e.g., email unopens)

### No-Show Rate
**Definition**: Percentage of confirmed bookings where customers don't arrive.
- **Benchmark**: 2-8% for hotels, 1-3% for airlines
- **Use Case**: Measure booking commitment and forecast occupancy
- **CDP Insight**: Identify serial no-shows for stricter booking terms

### Churn Rate
**Definition**: Percentage of customers who do not book within a 12-month period.
- **Formula**: (Customers Lost / Starting Customers) × 100
- **Benchmark**: 15-30% annual churn for leisure travel
- **Use Case**: Primary health metric for loyalty and retention programs
- **CDP Insight**: Use **cdp-churn-finder** to predict churn and trigger win-back campaigns

---

**CDP Integration Tips**:
- Layer KPIs into customer profiles using **cdp-data-enricher**
- Build predictive models using **cdp-data-scientist**
- Monitor KPI health with **cdp-health-diagnostics**
- Use **cdp-data-analyzer** for trend analysis and correlation studies
