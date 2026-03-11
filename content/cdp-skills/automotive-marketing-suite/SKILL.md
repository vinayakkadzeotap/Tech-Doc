---
name: automotive-marketing-suite
description: Industry-specific orchestrator for automotive, car dealership, OEM, EV, and fleet marketing. Intelligently routes users through CDP workflows based on automotive industry triggers—vehicle research, test drives, service records, model preferences, trade-ins, leasing, warranties, parts, and ownership transitions. Optimizes the complete vehicle ownership lifecycle from research through loyalty and repurchase.
---

# Automotive Marketing Suite

## Overview

The Automotive Marketing Suite is a vertical-specific orchestrator designed for automotive OEMs, dealerships, fleet managers, and EV companies. It provides industry-contextual entry points into the Zeotap CDP, automatically detecting automotive-specific business problems and routing users to the most relevant core CDP skills.

## Vehicle Ownership Lifecycle Framework

The suite operates across five interconnected stages:

### 1. Research Phase
Vehicle shoppers in research mode, comparing models, reading reviews, and evaluating options. Minimal purchase commitment.

**Recommended Skills:**
- **cdp-audience-finder**: Segment research-phase shoppers by vehicle class and budget range
- **cdp-data-enricher**: Layer in vehicle specs, pricing, incentives, and competitor offerings
- **cdp-journey-recommender**: Deliver comparative content and spec sheets aligned with research interests

### 2. Test Drive Phase
High-intent shoppers ready to evaluate vehicles in-person. Dealership engagement begins.

**Recommended Skills:**
- **cdp-audience-finder**: Identify test drive-ready segments by location and model interest
- **cdp-data-analyzer**: Analyze test drive scheduling patterns and show rates
- **cdp-journey-recommender**: Sequence pre-test-drive communications and in-dealership offers

### 3. Purchase Phase
Purchase decision imminent. Financing, trade-in, and incentive negotiations begin.

**Recommended Skills:**
- **cdp-audience-finder**: Build ready-to-buy segments with strong purchase signals
- **cdp-data-enricher**: Layer in financing, trade-in value, and incentive eligibility
- **cdp-journey-recommender**: Optimize final offer presentation and closing sequences

### 4. Service & Ownership Phase
Vehicle owned or leased. Service appointments, warranty claims, maintenance, and product satisfaction.

**Recommended Skills:**
- **cdp-data-analyzer**: Track service patterns, warranty claims, and satisfaction indicators
- **cdp-journey-recommender**: Recommend maintenance services and accessories
- **cdp-churn-finder**: Identify dissatisfaction signals early (complaints, service avoidance)

### 5. Trade-In & Repurchase Phase
End of current vehicle lifecycle. Trade-in valuation, loyalty retention, and upgrade targeting.

**Recommended Skills:**
- **cdp-churn-finder**: Identify high-trade-in-propensity owners for loyalty intervention
- **cdp-audience-finder**: Build "ready to repurchase" segments by remaining loan term and age
- **cdp-lookalike-finder**: Find similar audiences to high-LTV repeat buyers
- **cdp-data-scientist**: Predict next vehicle class and timing preferences

## Key Use Cases

### Model Affinity Campaigns
Target shoppers with vehicles matching their preferences and needs. Use **cdp-audience-finder** to segment by current vehicle, household size, and vehicle class interests. Use **cdp-data-enricher** to layer in trim-level preferences and feature priorities.

### Service Retention Strategy
Maximize dealership service revenue from owned vehicles. Use **cdp-data-analyzer** to identify service intervals and predict next maintenance needs. Use **cdp-journey-recommender** to remind customers of upcoming service and cross-sell maintenance packages.

### EV Transition Marketing
Guide traditional ICE owners toward EV adoption. Use **cdp-data-analyzer** to identify EV-eligible audiences by driving patterns, income, and environmental interests. Use **cdp-journey-recommender** to deliver EV education content and incentive messaging.

### Trade-In Capture
Recapture trade-ins at competitive pricing. Use **cdp-churn-finder** to identify trade-in-eligible owners approaching end of loan/lease. Use **cdp-audience-finder** to build "at-risk trade-in" segments. Use **cdp-journey-recommender** to deliver value proposition and trade-in incentives before they shop competitors.

### Test Drive Conversion
Maximize test drive attendance and conversion rates. Use **cdp-data-analyzer** to understand scheduling patterns by time/day. Use **cdp-journey-recommender** to optimize pre-drive nurture and post-drive follow-up sequences. Track metrics with **cdp-data-scientist** predictive modeling.

## Skill Routing Quick Reference

| Use Case | Primary Skill | Secondary Skills |
|----------|---------------|------------------|
| Build buyer segments | cdp-audience-finder | cdp-data-analyzer |
| Predict trade-in risk | cdp-churn-finder | cdp-data-scientist |
| Find lookalike buyers | cdp-lookalike-finder | cdp-audience-finder |
| Recommend services | cdp-journey-recommender | cdp-data-enricher |
| Enrich vehicle data | cdp-data-enricher | cdp-metadata-explorer |
| Analyze buying patterns | cdp-data-analyzer | cdp-data-scientist |
| Monitor data health | cdp-health-diagnostics | cdp-metadata-explorer |

## Integration Points

### Vehicle & Owner Data Integration
Integrate vehicle registration, service history, warranty status, and loan details. Use **cdp-data-enricher** to create unified vehicle-owner profiles linking household to all owned vehicles.

### Dealership Engagement Tracking
Capture test drive scheduling, sales appointments, service visits, and transaction data. Layer into customer profiles for journey optimization and staff performance analysis.

### Real-Time Personalization
Leverage **cdp-journey-recommender** to power contextual experiences triggered by:
- Browsing specific vehicle models
- Abandoned loan/lease applications
- Service appointment scheduling
- Trade-in valuation requests
- Warranty claim submissions

### Predictive Analytics
Use **cdp-data-scientist** to build models for:
- Repurchase propensity and timing
- Model preference prediction
- Financing option optimization
- Service visit probability
- Warranty claim propensity

## Reference Materials

- **[Seasonal Calendar](./references/seasonal-calendar.md)**: Model launches, buying seasons, and campaign timing windows
- **[KPI Glossary](./references/kpi-glossary.md)**: Automotive-specific metrics and performance indicators

## Getting Started

1. Define your target buyer stage (research, test drive, purchase, service, trade-in)
2. Reference the Seasonal Calendar for model launches and buying season alignment
3. Select a primary skill based on your objective (acquisition, retention, or service)
4. Use secondary skills for customer enrichment and analysis
5. Monitor KPIs from the glossary to measure campaign success and lifetime value

---

**Last Updated:** 2026-03-05
**Industry Vertical:** Automotive
**Core CDP Version:** 1.0
