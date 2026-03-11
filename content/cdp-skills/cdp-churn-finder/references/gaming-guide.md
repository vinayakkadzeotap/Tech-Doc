# Gaming Churn Detection Guide

## Overview
Gaming churn operates on session-based and spending-based patterns distinct from other verticals. Users typically show clear engagement drops before churning. This guide covers D-day based detection windows and spending-tier specific churn patterns.

## Primary Churn Signals

### Session-Based Indicators
- **Session Length Decrease**: Average session duration drops >30% from baseline
- **Sessions Per Week Drop**: Weekly session count falls below critical threshold
- **Login Frequency Decline**: Days between logins increasing steadily
- **Time-of-Day Shift**: Regular play times becoming sporadic
- **Streaking Loss**: Breaking consistent daily login patterns
- **Play Window Narrowing**: User confining gaming to shorter windows

### Progression Indicators
- **Level Stagnation**: No character/account progression for 14+ days
- **Achievement Absence**: No new achievements unlocked in extended period
- **Quest Abandonment**: Incomplete quest objectives
- **Equipment Non-Upgrade**: Not acquiring new gear/weapons
- **Skill Rating Plateau**: Competitive players not improving rankings

### Spending Indicators
- **In-App Purchase (IAP) Stop**: Users with history stopping completely
- **Monetization Access**: Reduced battle pass/cosmetic engagement
- **Coupon Redemption**: Users not using provided credits
- **Tier Drop**: Premium feature cancellations
- **Spending Decline**: <50% of historical spending in current period

### Social Engagement Indicators
- **Guild/Team Departure**: Leaving social structures
- **Social Interaction Decline**: Fewer interactions with friends list
- **Chat Activity Drop**: Reduced in-game communication
- **Cooperative Play**: Avoiding multiplayer content
- **Event Non-Participation**: Missing special events they previously attended
- **Friend List Decay**: Fewer active friends remaining

### Platform/Device Signals
- **Device Migration**: Primarily playing on secondary platform
- **Device Dormancy**: Primary device not registering for weeks
- **Cross-Play Reduction**: Playing fewer sessions cross-platform
- **App Update Avoidance**: Not updating to latest version
- **Installation Removal**: App uninstalled from devices

## D-Day Based Detection Framework

### Concept
"D-day" (Departure Day) prediction: Calculate probability of churn within N days from current observation date.

### D-7 (7 Days to Churn)
**Characteristics:**
- User showing critical engagement cliff
- Session frequency near zero
- Zero spending or IAP activity

**Signals:**
- Last session >5 days ago
- 0 sessions in current week
- 0 IAP purchases in 7 days
- No progression in 7 days

**Accuracy:** 88-92%
**Action:** Last-ditch retention push only

### D-14 (14 Days to Churn)
**Characteristics:**
- Clear disengagement pattern
- Possible account inactivity

**Signals:**
- Session frequency <20% of baseline
- 0 progression in 14 days
- IAP velocity significantly lower
- Event participation: 0

**Accuracy:** 82-86%
**Action:** Moderate-effort retention offers

### D-30 (30 Days to Churn)
**Characteristics:**
- Detectable pattern shift
- User exploring alternatives likely

**Signals:**
- Session length declining trend
- Spending trend dropping
- Social interaction cooling
- Weekly sessions <baseline/2

**Accuracy:** 75-80%
**Action:** Targeted feature recommendations

### D-60 (60+ Days to Churn)
**Characteristics:**
- Subtle shifts, often noise mixed in
- Prevention most effective here
- User may not realize engagement dropping

**Signals:**
- Engagement score trending down
- Session frequency consistency loss
- Progression slowing
- Social participation optional activities only

**Accuracy:** 65-72%
**Action:** Engagement boosters, fresh content

## Whale vs Minnow Churn Differences

### Whale Retention (High Spenders: >$100/month)
**Churn Drivers:**
- Content drought (need new progression paths)
- Competitive balance issues
- Community drama/guild conflicts
- New superior competitor launching
- Desire for "end-game" achievement

**Warning Signs:**
- Spending flatlines (hit spending ceiling)
- Reduced login consistency
- Competitive ranking ambition waning
- Reduced cosmetic purchases (low engagement with vanity)

**Retention Strategy:**
- Exclusive cosmetics (limited editions)
- VIP community experiences
- Early access to new content
- Personal community manager engagement
- Season passes tailored to interests

**Prevention Window:** 60-90 days (longer engagement possible with proper incentives)

### Minnow Retention (Low/No Spenders)
**Churn Drivers:**
- Skill ceiling reached
- Content completion
- Time availability reduction
- Boring progression grind
- Social friend group churned first

**Warning Signs:**
- Session frequency dropping
- Progression slowing relative to pace
- Frequency of logins (less consistent)
- No monetization signals ever existed

**Retention Strategy:**
- Free cosmetics/rewards for play
- Battle pass free tier completion
- Community challenges
- Seasonal event participation
- Social mechanics (guilds, friends)

**Prevention Window:** 30-45 days (often simpler to win back than whales)

## Feature Analysis Metrics

### Essential Metrics (basic)
```
Columns to analyze:
- session_count_weekly
- average_session_length
- last_login_days_ago
- days_since_progression
- level
- total_iam_spend_alltime
- cosmetic_purchase_count
- guild_member_status
- achievement_count
```

Metric types: ["basic", "statistical", "quality"]

### Statistical Analysis
- Session duration distribution (percentiles: 10, 50, 90)
- Session frequency distribution
- Spending distribution by cohort
- Progression rate percentiles

### Quality Metrics
- Data completeness (fills rates)
- Outlier detection (whales vs minnows)
- Data freshness (last event timestamp consistency)

## Time_Travel CDF Tracking

### Configuration
- Starting timestamp: 60 days ago
- Ending timestamp: current date
- Columns: [session_count, average_session_length, last_login_date, total_iam_spend, level, achievement_count]
- Change types: [update_postimage] for engagement changes
- Include statistics: true
- Metrics: ["basic", "statistical", "quality"]

### Pattern Detection
- Look for consistent session_count declines
- Track spending velocity changes
- Monitor level progression stalling
- Identify sharp drop-offs (cliff detection)

## Segmentation Approach

### By Spending Tier
- **Whale**: >$100/month historical
- **Dolphin**: $10-99/month
- **Minnow**: <$10/month or $0

### By Playstyle
- **Competitive**: Focused on ranking/leaderboards
- **Cooperative**: Guild/team focused
- **Casual**: Play when interested, no progression focus
- **Completionist**: Achievement/content completion driven

### By Lifecycle
- **New**: <30 days
- **Established**: 30-180 days
- **Veteran**: 180+ days

## Churn Rate Expectations by Segment

- New players (week 1): 20-30% (normal, not churn)
- New players (month 1): 40-50% (retention is key)
- Established (6 months): 5-15% monthly
- Veterans (12+ months): 2-8% monthly
- Whales: 0.5-3% monthly

## Intervention Playbook

### D-60 to D-30: Engagement Phase
- New content teasers
- Seasonal event announcements
- Friend invitations
- Limited-time cosmetics

### D-30 to D-14: Escalation Phase
- Battle pass discounts
- Premium currency offer
- Exclusive cosmetic pack
- VIP weekend access

### D-14 to D-7: Final Phase
- Win-back offer (50-70% discount)
- Exclusive legendary cosmetic
- 3x event reward multiplier
- Personal outreach

### Post-Churn: Recovery (14-90 Days)
- Graduated return offers
- Summary of new content
- Friend reunion mechanics
- Booster pack reactivation discount

## Expected Metrics

- D-7 prediction accuracy: 88-92%
- D-14 prediction accuracy: 82-86%
- D-30 prediction accuracy: 75-80%
- Whale retention lift: 20-35%
- Minnow retention lift: 15-25%
- False positive rate: <10%

## Implementation Checklist

- [ ] Define spending tiers for organization
- [ ] Establish D-day calculation logic
- [ ] Set baseline session metrics per cohort
- [ ] Configure time_travel CDF extraction
- [ ] Build D-day scoring model
- [ ] Create segment-specific playbooks
- [ ] Set up automated offer deployment
- [ ] Monitor churn rate by segment
- [ ] A/B test retention offers
- [ ] Track offer redemption rates
