# Gaming Industry Analysis Guide

## Overview
This guide provides analysis frameworks for gaming studios and mobile game publishers. Focus on retention, monetization, engagement, and player progression metrics.

## Retention Curve Analysis

### D-Day Metrics (Day 1 through Day 90)
Track what percentage of players return on each day post-install:
- **D1 (Day 1 Retention)**: Return within 1-7 days of install
- **D7 (Day 7 Retention)**: Return within 8-14 days
- **D14**: Return within 15-28 days
- **D30**: Return within 29-60 days
- **D90**: Return within 61-90 days

### Cohort Retention Curves
- Group players by install cohort (week or month installed)
- Plot retention % by days since install
- Compare curves across cohorts to identify:
  - Version improvements (newer cohorts retain better)
  - Content update impacts
  - Feature launch effectiveness
  - Seasonal player quality variations

### Analysis Approach
1. Define cohort by install_date
2. Calculate days_since_install for each session
3. Flag returning players on D1, D7, D14, D30, D90
4. Build retention curves and compare across versions/periods

Use `time_travel` CDF analysis to track retention changes across update releases.

## Monetization Funnel Analysis

### Conversion Stages
Track progression through monetization funnel:
1. **Installer**: Downloaded game (total addressable market)
2. **Session Starter**: Launched game first time
3. **Tutorial Completer**: Finished onboarding
4. **Level Progressor**: Reached level 5-10 (engaged)
5. **Shop Visitor**: Viewed in-app purchase (IAP) shop
6. **Payer**: Made first IAP purchase
7. **Whale**: Spending above 90th percentile

### Key Metrics
- **Install-to-Payer**: % of installers who spend
- **Time-to-First-Purchase**: Days between install and first IAP
- **Payer LTV**: Lifetime spending by payer segment
- **Repeat Purchase Rate**: % of payers who purchase again within 7 days

### Drop-off Analysis
Identify where players exit the funnel:
- High drop between install and session start = onboarding friction
- High drop at tutorial = difficulty spike or content length
- High drop before shop = inadequate monetization prompts
- High drop after shop = pricing or offer misalignment

## Engagement Tier Distribution

### Player Segmentation by Activity
Classify players into engagement tiers:

**Whale** (Top 5%)
- Sessions per day: 3+
- Daily active time: 60+ minutes
- Monthly spending: $20+
- Content completion: High level/progression

**Core** (Next 15%)
- Sessions per day: 1-3
- Daily active time: 20-60 minutes
- Monthly spending: $1-20
- Content completion: Medium-to-high

**Casual** (Next 30%)
- Sessions per day: 0.3-1
- Daily active time: 5-20 minutes
- Monthly spending: $0-1
- Content completion: Low-to-medium

**Churn-Risk** (Bottom 50%)
- Sessions: Sporadic or declining
- Active time: Very low or zero
- Spending: None or lapsed
- Engagement signals: Minimal

### Tier Movement Analysis
- Track player tier transitions week-to-week
- Identify "climbing" players (ascending tiers)
- Flag rapid "falling" players (churn risk)
- Measure stickiness (% staying in same tier)

Use `feature_analysis` with `metric_types: ["basic", "statistical"]` to understand activity distributions per tier.

## Content Performance Analysis

### Engagement by Content Type
Track performance across game content:
- Levels/Story chapters (completion %, time spent, difficulty perception)
- Events (participation %, rewards claimed, reengagement impact)
- Seasonal content (novelty decay, return-to-play rates)
- Daily/weekly challenges (completion %, reward redemption)

### Content Lifecycle
Measure content value decay:
- Peak engagement within first 3-7 days of release
- Engagement half-life (days to 50% of peak engagement)
- Long-tail engagement (residual play after decay)
- Re-engagement from content repeats/reruns

### Performance Benchmarking
- Compare new content against historical baseline
- Segment by player level (content shouldn't be too hard/easy)
- Track difficulty perception (player feedback, quit rates, retry frequency)
- Identify "sticking points" where players abandon content

## Player Progression Analytics

### Level Progression Tracking
- **Average time-to-level**: Days or hours to reach each level milestone
- **Level completion rate**: % of players reaching each level
- **Progression curve**: Identify difficulty spikes (levels with high quit rate)
- **Power creep analysis**: Track difficulty trends across updates

### Milestone Achievements
Monitor achievement unlocking:
- % of players reaching key milestones (level 10, 50, 100)
- Time-to-achievement (how long to reach milestone)
- Milestone skip rates (% jumping to higher levels)
- Correlation between milestone achievement and retention

### Progression-Monetization Link
- Do faster progressors spend more? (gear walls, progression acceleration)
- Does difficulty slowdown trigger spend spikes?
- What progression level maximizes payer conversion?

Use `query_builder` cost analysis when joining large progression_event and purchase tables.

## A/B Test Framework for In-Game Offers

### Offer Attributes to Test
- **Offer type**: Limited-time, seasonal, achievement-based
- **Price point**: Tiered pricing for same content
- **Bundle content**: Single item vs. bundle vs. battle pass
- **Presentation**: Notification timing, creative, placement
- **Segment targeting**: Segment-specific vs. universal offers

### Test Design Principles
1. **Randomization**: Split players 50/50 into control and treatment
2. **Duration**: Minimum 7 days (capture weekly seasonality)
3. **Isolation**: Avoid concurrent offers that confound results
4. **Power**: Ensure sample size sufficient to detect minimum effect size
5. **Metric**: Primary (purchase rate), secondary (offer value, repeat purchase)

### Analysis Approach
- Calculate purchase rate per variant
- Statistical test (chi-square for rates, t-test for continuous metrics)
- Confidence intervals around effect estimates
- Recommend variants with positive effect and statistical significance

Track A/B test performance over time using `time_travel` to identify version-dependent treatment effects.

## Session Depth Analysis

### Session Metrics
- **Session length**: Minutes per session
- **Session frequency**: Sessions per day
- **Session quality**: Progression made, content consumed per session
- **Session drag**: Declining length indicating player frustration

### Session Patterns
- **Peak session time**: When do players typically session?
- **Session distribution**: Are sessions consistent or bursty?
- **Multi-session days**: % of active players with 2+ sessions
- **Session streaks**: Consecutive days with sessions

### Session-Churn Connection
- High session length but declining = risk of fatigue-driven churn
- Consistent 20-minute sessions = healthy engagement
- Highly variable session length = unstable engagement
- Rapidly declining frequency = churn warning signal

### Implementation
1. Define session as consecutive events within 30-minute gap
2. Calculate session duration, content completed, rewards earned
3. Aggregate to player-day, player-week metrics
4. Trend analysis across cohorts using `time_travel` CDF

## Data Integration Checklist

- Install events with device/source data
- Session events with timestamps and content
- Progression milestones with timing
- In-app purchase events with amounts and items
- Event participation tracking
- Achievement unlock timestamps
- Offer exposure and response

Use `schema_discovery` to identify these event types in your raw data.
