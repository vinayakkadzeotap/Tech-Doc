---
name: media-marketing-suite
description: Industry-specific orchestrator for media, entertainment, streaming, OTT, publishing, and news marketing. Intelligently routes users through CDP workflows based on media industry triggers—content consumption, subscriber engagement, viewing patterns, watch time, episodes, playlists, and podcasts. Optimizes the complete subscriber lifecycle from trial through loyal advocacy.
---

# Media Marketing Suite

## Overview

The Media Marketing Suite is a vertical-specific orchestrator designed for streaming services, OTT platforms, publishing houses, news organizations, and entertainment companies. It provides industry-contextual entry points into the Zeotap CDP, automatically detecting media-specific business problems and routing users to the most relevant core CDP skills.

## Subscriber Lifecycle Framework

The suite operates across five interconnected stages:

### 1. Trial Phase
New users exploring the platform with limited commitment. Low or no friction for signup, discovery-focused behavior.

**Recommended Skills:**
- **cdp-audience-finder**: Identify high-intent trial signups by content interests
- **cdp-data-analyzer**: Analyze trial conversion patterns and content discovery behavior
- **cdp-journey-recommender**: Personalize onboarding and first-watch recommendations

### 2. Paid Conversion Phase
Trial users converting to paid subscriptions. Price sensitivity, plan selection, payment friction.

**Recommended Skills:**
- **cdp-churn-finder**: Identify trial users at-risk of not converting
- **cdp-data-enricher**: Layer in subscription plans, pricing, and promotional eligibility
- **cdp-journey-recommender**: Optimize conversion sequences with timely offers and content highlights

### 3. Active Engagement Phase
Paid subscribers actively consuming content. High watch time, frequent sessions, content completion.

**Recommended Skills:**
- **cdp-data-analyzer**: Monitor engagement metrics and consumption patterns
- **cdp-journey-recommender**: Recommend content based on viewing history and preferences
- **cdp-audience-finder**: Segment by engagement level and content affinity

### 4. At-Risk Phase
Engagement declining, session frequency dropping, watch time decreasing. Early churn signals.

**Recommended Skills:**
- **cdp-churn-finder**: Identify declining engagement and at-risk segments
- **cdp-data-scientist**: Predict churn propensity with advanced modeling
- **cdp-journey-recommender**: Design re-engagement campaigns with compelling content offers

### 5. Win-Back & Advocacy Phase
Cancelled subscribers and engaged advocates. Reactivation and referral opportunities.

**Recommended Skills:**
- **cdp-churn-finder**: Identify high-value lapsed subscribers for win-back
- **cdp-lookalike-finder**: Find similar audiences to brand advocates
- **cdp-audience-finder**: Build referral and ambassador programs

## Key Use Cases

### Engagement Optimization
Move subscribers from passive to active viewers. Use **cdp-data-analyzer** to identify viewing patterns and content preferences. Layer in **cdp-journey-recommender** to suggest next episodes, related content, and new releases aligned with demonstrated interests.

### Subscription Tier Management
Balance subscriber distribution across Standard, Premium, and Family plans. Use **cdp-audience-finder** to segment by device count, resolution needs, and household size. Use **cdp-journey-recommender** to suggest tier upgrades to heavy multi-device users.

### Content Recommendation Strategy
Power personalized recommendation engines with **cdp-journey-recommender**. Leverage viewing history, ratings, completion rates, and session context to surface relevant content. Use **cdp-data-enricher** to layer in contextual data (time of day, device, location).

### Churn Prevention & Win-Back
Detect early churn signals before cancellation. Use **cdp-churn-finder** to identify declining engagement patterns. Layer in **cdp-data-scientist** for predictive churn modeling. Design win-back sequences with compelling content hooks via **cdp-journey-recommender**.

### Audience Growth Through Referrals
Leverage engaged subscribers to drive referrals. Use **cdp-lookalike-finder** to identify subscribers most likely to generate quality referrals. Use **cdp-audience-finder** to build referral program segments with incentive tiers.

## Skill Routing Quick Reference

| Use Case | Primary Skill | Secondary Skills |
|----------|---------------|------------------|
| Build subscriber segments | cdp-audience-finder | cdp-data-analyzer |
| Predict churn risk | cdp-churn-finder | cdp-data-scientist |
| Find lookalike subscribers | cdp-lookalike-finder | cdp-audience-finder |
| Recommend content | cdp-journey-recommender | cdp-data-enricher |
| Enrich viewer profiles | cdp-data-enricher | cdp-metadata-explorer |
| Analyze watch patterns | cdp-data-analyzer | cdp-data-scientist |
| Diagnose data quality | cdp-health-diagnostics | cdp-metadata-explorer |

## Integration Points

### Content Metadata Integration
Integrate title metadata, genre, ratings, release dates, and cast information. Use **cdp-data-enricher** to layer content attributes into viewing history for recommendation and segmentation.

### Real-Time Personalization
Power real-time recommendation engines through **cdp-journey-recommender** triggered by:
- Video completion events (suggest next episode or related content)
- Session start (personalized homepage)
- Browse events (contextual recommendations)
- Time-based signals (morning news vs. evening entertainment)

### Subscription Management
Use **cdp-data-enricher** to track subscription tier, renewal date, billing status, and plan history. Trigger campaigns via **cdp-journey-recommender** for:
- Tier upgrade opportunities
- Plan change incentives
- Payment failures and dunning recovery
- Renewal reminders

### Predictive Analytics
Use **cdp-data-scientist** to build models for:
- Churn propensity scoring
- Content preference prediction
- Watch time forecasting
- Lifetime value prediction by segment and cohort

## Reference Materials

- **[Seasonal Calendar](./references/seasonal-calendar.md)**: Content releases, awards seasons, and optimal campaign timing
- **[KPI Glossary](./references/kpi-glossary.md)**: Media-specific metrics and subscriber performance indicators

## Getting Started

1. Define your subscriber cohort (plan, acquisition channel, content genre)
2. Reference the Seasonal Calendar for content and campaign timing
3. Select a primary skill based on your engagement objective
4. Use secondary skills for profiling and analysis
5. Monitor KPIs from the glossary to measure engagement and retention success

---

**Last Updated:** 2026-03-05
**Industry Vertical:** Media & Entertainment
**Core CDP Version:** 1.0
