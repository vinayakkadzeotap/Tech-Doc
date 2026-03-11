# Media Industry Analysis Guide

## Overview
This guide provides analysis frameworks for media companies (streaming, publishing, broadcasting). Focus on content consumption, subscriber lifecycle, engagement, and churn prediction.

## Content Consumption Patterns

### Viewing Behavior
Track subscriber consumption habits:

**Viewing Metrics**
- Hours watched per month
- Content start rate (% of subscribers active in period)
- Completion rate (% of content finished)
- Binge rate (multiple episodes/movies in short timeframe)

### Content Preferences
Analyze what subscribers consume:
- **Genre distribution**: Action vs. Drama vs. Comedy mix
- **Format preference**: Movies vs. Series vs. Documentaries
- **Producer/Franchise loyalty**: Marvel vs. DC, prestige creators
- **International content**: Local vs. international language content

### Viewing Context
- Device choice (TV vs. mobile vs. tablet patterns)
- Time of day (morning vs. evening viewing)
- Day of week (weekend vs. weekday patterns)
- Session length (quick browsing vs. deep engagement)

### Content Discovery
- Browse-to-play ratio (how many titles viewed before selecting?)
- Search vs. recommendation click-through
- Recommendation effectiveness (do recommended titles get watched?)
- Continued watching utilization (re-engagement via saved content)

Use `feature_analysis` with `metric_types: ["statistical"]` to profile content consumption distributions.

## Subscriber Lifecycle Analysis

### Lifecycle Stages

**Acquisition** (First 30 days)
- Activation rate (% completing signup)
- First content consumed within 7 days
- Device setup completion
- Personalization engagement (profile creation, preference setting)

**Early Engagement** (30-90 days)
- Monthly active usage rate
- Content breadth (diversity of genres consumed)
- Subscription tier selection stability
- First payment confirmation

**Maturity** (90+ days)
- Consistent monthly activity
- Content recommendation engagement
- Churn risk signals emerging
- Loyalty tier indicators

**Decline/Churn Risk** (signals)
- Decreasing monthly activity (watch hours declining)
- Reduced session frequency
- Generic/library content only (not engaged with new releases)
- Post-cancellation browsing (return visitor after cancellation)

### Progression Analysis
- Average days to reach each lifecycle stage
- % of cohort advancing to next stage
- Stage-specific intervention points (what drives progression?)
- Accelerators (multi-device household vs. single device)

Use `time_travel` CDF analysis to track subscriber progression through lifecycle stages.

## Engagement Scoring Methodology

### Engagement Dimensions

**Content Consumption**
- Hours watched (weighted: prestige content higher weight?)
- Completion rate (finished content vs. abandoned)
- Breadth (distinct titles/genres)
- Depth (multiple episodes/series continued)

**Interaction**
- Rating/review submission (active engagement)
- Watchlist usage (future intent signal)
- Social sharing (advocacy indicator)
- Search/discovery (engagement with platform)

**Recency**
- Days since last login
- Days since last content completion
- Activity trend (declining, stable, growing)

**Tier Usage**
- Are premium tier subscribers more engaged?
- Do add-on subscribers differ?
- Family account usage pattern (primary watcher vs. occasional)

### Scoring Model
Assign engagement scores combining dimensions:
- High engagement: 4+ hours/week, consistent activity, diverse content
- Medium engagement: 1-4 hours/week, regular but not obsessive
- Low engagement: <1 hour/week, sporadic activity
- Dormant: No activity in 14+ days

Use `feature_analysis` with `metric_types: ["quality", "user_metrics"]` for engagement distribution analysis.

## Churn Prediction Signals

### Early Warning Indicators

**Content Consumption Decline**
- Watch hours trending downward
- Session frequency decreasing
- Session duration shortening
- Days since last viewing increasing

**Engagement Pattern Shifts**
- Shift to low-quality/library content (not watching originals)
- Reduced breadth (rewatching same content)
- No new browsing activity (stopped exploring)
- Ratings/interactions declining

**Account Activity**
- No login in 7+ days
- Subscription tier downgrade requests
- Payment failures or account issues
- Cancellation browsing (adding payment method, then canceling)

**Lifecycle Signals**
- Early-stage churn (within 90 days post-acquisition): onboarding friction
- Mid-tenure churn: content gaps, competitive threat
- Long-tenure churn: content exhaustion, life changes

### Predictive Modeling
- Features correlated with churn (from early warning indicators)
- Lead time (how far in advance can you predict churn?)
- Segment-specific churn patterns (sports fans vs. drama fans churn differently?)
- Intervention effects (retargeting effectiveness for at-risk segments)

Build churn models using `query_builder` cost analysis before large training dataset assembly.

## Content Catalog Utilization

### Content Library Analysis

**Size and Freshness**
- Total titles available
- Original vs. licensed content mix
- New content addition rate (monthly)
- Content removal rate (expiring licenses)

**Catalog Utilization**
- % of catalog watched (what % of titles have >0 views?)
- Concentration: are 80% of views on 20% of titles?
- Long-tail content: is there demand for deep catalog?
- Duds: titles with zero/minimal views

### Content Performance
- Hours watched per title (proxy for quality)
- Completion rate by content type
- Rating distribution (user ratings as quality signal)
- Impact on churn (does specific content reduce churn?)

### Genre/Format Analysis
- % of viewing by genre (concentration vs. balance)
- Genre trend (is comedy rising? is drama falling?)
- Original series performance vs. acquired content
- Documentary/niche content engagement (loyal niche vs. casual viewing)

### Recommendations Engine
- What % of viewing from recommendations?
- Recommendation accuracy (do recommended items get watched?)
- Personalization by preference profile
- Diversity (does algorithm recommend diverse content or narrow niche?)

Use `query_builder` cost analysis for content-level aggregation at scale.

## Platform Usage Analysis

### Device Distribution
- Smart TV vs. mobile vs. tablet vs. web
- Primary device by subscriber segment
- Multi-device households (household penetration)
- Device switching (start on mobile, continue on TV?)

### Feature Adoption
- Multi-profile usage (household members using separate profiles)
- Parental controls adoption
- Offline download usage
- Ad-supported tier adoption (if available)

### Session Characteristics
- Session length distribution (short browsing vs. deep engagement)
- Session type (binge - back-to-back episodes vs. single episode)
- Time-to-content (how long from login to play?)
- Peak usage times (when are servers busiest?)

### Streaming Quality
- Average bitrate served
- Buffering/rebuffering incidents (quality of experience)
- Device capability distribution (4K vs. HD capable)
- Network bandwidth sufficiency (are users getting best quality available?)

## Ad Revenue Optimization (Ad-Supported Tiers)

### Ad Inventory
- Hours of ads per subscriber per month
- Ad load tolerance (when do ads drive churn?)
- Ad skip rates (if applicable)
- Ad format performance (auto-play vs. skippable)

### Advertiser Performance
- Cost per impression (CPM) by advertiser/category
- Click-through rates
- Conversion tracking (does subscriber action follow ad exposure?)
- Brand affinity (do certain sponsors correlate with content preference?)

### Monetization Strategy
- Tier spread (ad-free premium vs. ad-supported basic)
- % of subscribers on ad-supported vs. ad-free tiers
- Revenue per subscriber (ARPU) comparison
- Churn by tier (do ad-supported subscribers churn more?)

Use `feature_analysis` to analyze ad exposure patterns and monetization effectiveness.

## Implementation Checklist

- Viewing events with content metadata
- Subscription tier and status data
- Account creation and demographics
- Device and platform information
- Payment/billing events
- Cancellation and pause reasons
- Content ratings and reviews
- Search and browsing activity

Use `schema_discovery` to identify these data sources in your warehouse.

## Key Analysis Queries

1. **Retention Curves**: By cohort, by content genre preference
2. **Engagement Distribution**: Hours watched per subscriber (Lorenz curve)
3. **Churn Prediction**: Logistic regression on consumption decline signals
4. **Content Performance**: By content type, day-of-release metrics
5. **Device Trends**: Cross-device viewing patterns, household penetration
