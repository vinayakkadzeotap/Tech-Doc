---
name: gaming-marketing-suite
description: Entry point for gaming, mobile games, console, and esports marketing. Orchestrates player lifecycle strategies from acquisition through monetization and reactivation. Handles DAU/MAU retention tiers (D1/D7/D30), IAP optimization, whale and engagement segment analysis. Routes users to core CDP skills (audience-finder, churn-finder, lookalike-finder, data-enricher, data-analyzer, journey-recommender) with gaming-specific context, engagement tier definitions, and KPI frameworks for retention, ARPU, LTV, and session metrics.
---

# Gaming Marketing Suite

The Gaming Marketing Suite is your orchestrator for mobile games, console games, and esports marketing within Zeotap CDP. Whether you're optimizing D7 retention, creating a whale segment, designing reactivation campaigns, or analyzing session behavior, this skill routes you to the right CDP capabilities with gaming-specific guidance.

## When to Use This Skill

**Trigger Keywords:** players, DAU, MAU, daily active users, retention, D1, D7, D30, D90, IAP, in-app purchase, churn, sessions, session length, ARPU, ARPPU, LTV, engagement, whales, spenders, lapsed players, game launch, esports, mobile gaming, console.

**Common Scenarios:**
- Identifying and retargeting churned players
- Creating whale/VIP player segments
- Optimizing IAP offer timing and frequency
- Analyzing session length decline
- Planning game launch player acquisition
- Designing seasonal event campaigns
- Reactivating lapsed players pre-content update
- Preventing high-value player churn

## Player Lifecycle Marketing

### 1. Acquisition Phase
**Objective:** Acquire new players, maximize install volume
- **Timing:** Game launch, major content updates, seasonal events
- **Audience strategy:** Lookalike audiences (based on similar game players), gamer demographics, channel affinity (Facebook, TikTok, YouTube)
- **Key metric:** CPI (Cost Per Install), Day 1 retention (D1)
- **Route to:** `cdp-lookalike-finder` (find players similar to engaged players)

### 2. Activation & Onboarding Phase
**Objective:** Convert installs to active players, drive tutorial completion
- **Timing:** Within first 24 hours post-install
- **Audience strategy:** New installs, players at specific tutorial milestones, device-type segments
- **Key metrics:** D1 retention, tutorial completion rate, first session length
- **Route to:** `cdp-journey-recommender` (map optimal onboarding path), `cdp-audience-finder` (segment by progression)

### 3. Engagement & Retention Phase
**Objective:** Keep players returning daily/weekly, maximize active time
- **Timing:** Daily push notifications, weekly events, content seasons
- **Audience strategy:** DAU, weekly active users, engagement tier (whales, dolphins, minnows), session behavior patterns
- **Key metrics:** D7 retention, D30 retention, DAU, average session length, session frequency
- **Route to:** `cdp-audience-finder` (engagement tiers), `cdp-data-analyzer` (session pattern analysis)

### 4. Monetization Phase
**Objective:** Maximize revenue from players, optimize IAP timing
- **Timing:** Post-engagement confirmation (after D7 retention established)
- **Audience strategy:** High-engagement players, spenders vs. non-spenders, price sensitivity tiers
- **Key metrics:** IAP conversion rate, ARPPU, LTV, payer rate
- **Route to:** `cdp-audience-finder` (price sensitivity, LTV tiers), `cdp-data-enricher` (spending history)

### 5. Retention & Community Phase
**Objective:** Build loyal community, maximize customer lifetime value
- **Timing:** Ongoing seasonal content, battle pass drops, limited-time events
- **Audience strategy:** Core players, guild/clan members, social engagement leaders
- **Key metrics:** D30+ retention, repeat spending rate, monthly active payers
- **Route to:** `cdp-audience-finder` (community segments), `cdp-journey-recommender` (social event sequences)

### 6. Reactivation Phase
**Objective:** Win back lapsed players, re-engage dormant accounts
- **Timing:** New content drops, seasonal comeback events, major patches
- **Audience strategy:** Churned players (30+ days inactive), high-value lapsed players, seasonal dormancy patterns
- **Key metrics:** Reactivation rate, return spend rate, D7 retention on return
- **Route to:** `cdp-churn-finder` (identify at-risk & lapsed players), `cdp-data-analyzer` (re-engagement triggers)

## Skill Routing Guide

### Scenario Examples

**"Who are our best spenders and how do we find more like them?"**
→ Use **cdp-lookalike-finder** with whale segment (IAP > $100 LTV). Create lookalikes by: device type, game session pattern, initial engagement velocity, first IAP timing.

**"We're losing high-value players. Who's at risk?"**
→ Use **cdp-churn-finder** to identify players showing: session frequency decline, IAP drop-off, session length shortening, declining daily active streaks. Focus on players with ARPPU > $50.

**"Build segments for a new seasonal event: Free, Spender, Whale tiers"**
→ Use **cdp-audience-finder** segmented by:
- Free: Non-payers (IAP = 0)
- Spender: IAP $5-50 LTV
- Whale: IAP $50+ LTV
- Target different event offers per tier

**"Optimize push notification timing - when should we send?"**
→ Use **cdp-data-analyzer** + **cdp-journey-recommender** to map: session patterns by player segment, highest engagement time windows, push-to-session conversion rate by send time, optimal cadence (daily vs. 2x daily vs. 3x weekly).

**"Reactivate lapsed players 60+ days inactive before content update"**
→ Use **cdp-churn-finder** for 60+ day dormancy, then **cdp-audience-finder** to segment by: prior engagement level, likely reasons for churn (content drought, social friend decline), estimated re-engagement win probability.

**"Analyze why D7 retention dropped 5% this month"**
→ Use **cdp-data-analyzer** to compare cohorts: this month's new players vs. last month by: device type, region, install source, first session length, early IAP exposure, tutorial completion rate, difficulty/progression speed.

**"Create engagement tier segments and design offer strategy"**
→ Use **cdp-audience-finder** with tier definitions (DAU frequency, session length, IAP amount, play duration, social engagement), then **cdp-data-enricher** to add per-player metrics for personalized offer optimization.

## Gaming Player Metrics Framework

Load **kpi-glossary.md** for complete definitions, formulas, and benchmarks:

| KPI | Definition | Business Impact |
|-----|-----------|-----------------|
| **DAU** | Daily Active Users | Daily engagement & stickiness |
| **MAU** | Monthly Active Users | Overall player base health |
| **D1/D7/D30** | Retention at day 1/7/30 | Player quality & game appeal |
| **ARPU** | Average Revenue Per User | Revenue per player (payer + non) |
| **ARPPU** | Avg Revenue Per Paying User | Revenue concentration in whales |
| **LTV** | Lifetime Value | Long-term player profitability |
| **CPI** | Cost Per Install | Acquisition cost efficiency |
| **IAP Rate** | % players spending in-app | Monetization conversion |
| **Churn Rate** | % players inactive 30+ days | Player attrition |
| **Session Length** | Average minutes per session | Engagement depth |

## Engagement Tier Framework

### Player Classification by Spending & Engagement

**Whales** (Top 1-5%)
- Spending: $50+ LTV
- Sessions: 5+ per week, 30+ min avg length
- Behavior: Early IAP adopter, high retention, active in events
- Strategy: VIP treatment, exclusive offers, community recognition, battle pass incentives

**Dolphins** (Next 10-15%)
- Spending: $10-50 LTV
- Sessions: 3-5 per week, 20-30 min avg length
- Behavior: Occasional spenders, respond to limited-time offers
- Strategy: Tier-up incentives, event participation rewards, social features

**Minnows** (Regular Players - 30-40%)
- Spending: $0-10 LTV
- Sessions: 1-3 per week, 10-20 min avg length
- Behavior: Consistent play but low spend, barrier to monetization is important
- Strategy: Free value delivery, barrier reduction, battle pass trials, bundle value

**Dormant** (Lapsed - 20-30%)
- Spending: $0, Sessions: 0 (30+ days)
- Last active: 30-365 days ago
- Churn reasons: Content exhaustion, social friend departure, competition
- Strategy: Comeback offers, new content highlights, friend re-engagement incentives

## Common Gaming Campaigns & Skill Routing

| Campaign | Objective | Primary Skill | Secondary | Reference |
|----------|-----------|---------------|-----------|-----------|
| New game launch | Maximize installs + D1 retention | cdp-lookalike-finder | cdp-audience-finder | seasonal-calendar.md |
| Prevent whale churn | Identify at-risk high spenders | cdp-churn-finder | cdp-data-enricher | kpi-glossary.md (LTV) |
| IAP upsell campaign | Convert non-payers to spenders | cdp-audience-finder | cdp-data-analyzer | kpi-glossary.md (IAP metrics) |
| Seasonal event push | Maximize event participation | cdp-audience-finder | cdp-journey-recommender | seasonal-calendar.md |
| Reactivation pre-patch | Win back lapsed players | cdp-churn-finder | cdp-audience-finder | kpi-glossary.md (D30+) |
| Session length decline | Diagnose & reverse engagement drop | cdp-data-analyzer | cdp-journey-recommender | kpi-glossary.md |
| Spender tier campaign | Personalize offers by spend level | cdp-audience-finder | cdp-data-enricher | kpi-glossary.md (ARPPU, tiers) |
| Social reactivation | Re-engage via friend networks | cdp-audience-finder | cdp-journey-recommender | seasonal-calendar.md |

## Reference Files

- **seasonal-calendar.md** - Gaming event calendar (launches, seasonal events, platform sales, esports tournaments), marketing moments, audience strategies per season
- **kpi-glossary.md** - Detailed gaming KPI definitions, formulas, industry benchmarks, retention calculations, cohort analysis

## Session Analysis Framework

### Session Metrics by Player Segment

**Session Length Analysis:**
- Engagement indicator: Longer sessions = higher satisfaction
- Typical: 5-30 min per session (varies by game type)
- Trend: Declining session length predicts churn risk
- Route to: `cdp-data-analyzer` to track trends by cohort/segment

**Session Frequency Analysis:**
- Stickiness indicator: DAU frequency shows habit formation
- Targets: D1 (next day), D7 (7-day retention), weekly frequency
- Churn signal: Declining frequency (5x/wk → 3x/wk → 1x/wk)
- Route to: `cdp-churn-finder` for frequency decline alerts

**Optimal Push Timing:**
- Map session patterns: When do players naturally log in?
- Best push time: 1 hour before typical session time
- Frequency: Too many = uninstall; too few = forgotten
- Route to: `cdp-data-analyzer` + `cdp-journey-recommender`

## Seasonal Gaming Calendar

See **seasonal-calendar.md** for:
- Game launch windows (major releases drive competitive pressure)
- Seasonal content drops (new chapters, events, battle passes)
- Platform-driven sales (Steam, App Store, PlayStation promotions)
- Esports seasons (tournament schedules, watching drives playing)
- Player behavior seasonality (summer higher, January resolution spikes)

## Next Steps

1. **Identify your campaign type** - Acquisition? Retention? Monetization? Reactivation?
2. **Load the appropriate reference** - Use seasonal-calendar.md for timing, kpi-glossary.md for metrics
3. **Select your skill** - Route to the orchestrator suggested in the matrix above
4. **Define your player segments** - Use engagement tier framework and CDP skills for precise segmentation
5. **Measure & iterate** - Track the gaming-specific KPIs relevant to your campaign goal

---

**Advanced Features:**
- Cohort analysis: Compare D1 retention across install sources, device types, regions
- Session path analysis: Map common progression patterns to identify drop-off points
- LTV prediction: Use historical spend + engagement to forecast player value
- Churn prediction: Flag players showing deactivation signals before they quit

**Questions?** Check the reference files or escalate to a Data Scientist for cohort analysis, predictive churn modeling, or session funnel optimization.
