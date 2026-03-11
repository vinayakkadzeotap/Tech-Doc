---
name: travel-marketing-suite
description: Industry-specific orchestrator for travel, hospitality, airlines, hotels, and OTA marketing. Intelligently routes users through CDP workflows based on travel industry triggers—bookings, destinations, loyalty programs, frequent flyer metrics, stays, travelers, packages, cruises, and tours. Optimizes the complete traveler lifecycle from dream through repeat bookings.
---

# Travel Marketing Suite

## Overview

The Travel Marketing Suite is a vertical-specific orchestrator designed for travel, hospitality, airline, hotel, and online travel agency (OTA) marketing professionals. It provides industry-contextual entry points into the Zeotap CDP, automatically detecting travel-related business problems and routing users to the most relevant core CDP skills.

## Traveler Lifecycle Framework

The suite operates across five interconnected stages:

### 1. Dream Phase
Users in research mode, browsing destinations, reading reviews, and exploring options. Minimal engagement signals.

**Recommended Skills:**
- **cdp-audience-finder**: Segment high-intent dreamers by destination interest and travel preferences
- **cdp-lookalike-finder**: Expand reach to similar audiences based on browsing behavior

### 2. Plan Phase
Active planning with increased engagement. Wishlist creation, price tracking, itinerary building.

**Recommended Skills:**
- **cdp-data-analyzer**: Analyze planning patterns and intent signals
- **cdp-audience-finder**: Build "planners" segment for targeted nurture campaigns
- **cdp-journey-recommender**: Recommend contextual content and offers

### 3. Book Phase
High-intent, conversion-focused stage. Price sensitivity, payment readiness, urgency signals.

**Recommended Skills:**
- **cdp-audience-finder**: Identify ready-to-book audiences
- **cdp-data-enricher**: Layer in pricing, availability, and competitive intelligence
- **cdp-journey-recommender**: Optimize booking path and offer timing

### 4. Experience Phase
Post-booking, pre-travel and during-travel engagement. Support needs, add-ons, upgrades.

**Recommended Skills:**
- **cdp-data-analyzer**: Track engagement with confirmation, boarding, check-in
- **cdp-journey-recommender**: Recommend local experiences, dining, activities
- **cdp-churn-finder**: Identify dissatisfaction signals early

### 5. Share & Repeat Phase
Post-experience feedback, reviews, advocacy, and repurchase intent.

**Recommended Skills:**
- **cdp-churn-finder**: Identify at-risk travelers post-experience
- **cdp-audience-finder**: Build repeat traveler segment
- **cdp-data-scientist**: Predict next booking windows and preferences

## Key Use Cases

### Loyalty Program Optimization
Target travelers across loyalty tiers with tier-appropriate offers. Use **cdp-audience-finder** to segment by tier status, redemption behavior, and elite status. Layer in **cdp-data-enricher** to enrich with travel frequency and spend patterns.

### Seasonal Demand Management
Align campaigns with travel seasons. Reference the [Seasonal Calendar](./references/seasonal-calendar.md) to time campaigns for peak travel periods—summer holidays, ski season, spring break, and shoulder seasons. Use **cdp-data-analyzer** to forecast demand and **cdp-audience-finder** to pre-segment by seasonality indicators.

### Personalized Offer Strategy
Move beyond generic promotions. Use **cdp-journey-recommender** to suggest offers aligned with each traveler's stage and preferences. Layer in destination affinity, trip duration patterns, and companion type (solo, couple, family, group).

### Win-Back Campaigns
Identify inactive loyalty members and lapsed bookers. Use **cdp-churn-finder** to detect at-risk segments, then **cdp-journey-recommender** to craft re-engagement sequences with exclusive offers and new destinations.

## Skill Routing Quick Reference

| Use Case | Primary Skill | Secondary Skills |
|----------|---------------|------------------|
| Build traveler segments | cdp-audience-finder | cdp-data-analyzer |
| Predict churn/loyalty decline | cdp-churn-finder | cdp-data-scientist |
| Find similar travelers | cdp-lookalike-finder | cdp-audience-finder |
| Recommend experiences | cdp-journey-recommender | cdp-data-enricher |
| Enrich traveler profiles | cdp-data-enricher | cdp-metadata-explorer |
| Analyze booking patterns | cdp-data-analyzer | cdp-data-scientist |
| Diagnose data issues | cdp-health-diagnostics | cdp-metadata-explorer |

## Integration Points

### Data Enrichment
Integrate booking history, loyalty program data, payment methods, and preference centers. Use **cdp-data-enricher** to layer in external travel data (destination popularity, seasonality indices, weather patterns).

### Real-Time Personalization
Leverage **cdp-journey-recommender** to power real-time offer engines triggered by:
- Browsing activity on destination pages
- Abandoned bookings
- Loyalty tier status changes
- Seasonal shopping patterns

### Predictive Analytics
Use **cdp-data-scientist** to build models for:
- Booking window prediction
- Repeat travel propensity
- Lifetime value forecasting
- Churn risk scoring

## Reference Materials

- **[Seasonal Calendar](./references/seasonal-calendar.md)**: Travel seasons, holidays, and peak booking windows
- **[KPI Glossary](./references/kpi-glossary.md)**: Travel-specific metrics and performance indicators

## Getting Started

1. Define your traveler segment (destination, trip type, loyalty tier)
2. Reference the Seasonal Calendar to align timing
3. Select a primary skill based on your use case
4. Use secondary skills for enrichment and analysis
5. Monitor KPIs from the glossary to measure success

---

**Last Updated:** 2026-03-05
**Industry Vertical:** Travel & Hospitality
**Core CDP Version:** 1.0
