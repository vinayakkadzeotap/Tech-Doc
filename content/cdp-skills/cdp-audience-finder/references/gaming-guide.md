# Gaming Audience Finding Guide

## Overview
Gaming audiences are defined by engagement depth, spending patterns, and retention cohorts. Use CDP data to identify monetizable whales, re-engage lapsed players, and promote content to aligned player types.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Session count and duration (daily/weekly/monthly)
- In-app purchase (IAP) history and amounts
- Game mode preferences (PvP/PvE, casual/competitive, solo/multiplayer)
- Content/level progression and completion
- Achievement/reward engagement
- Social features (friend connections, guild/clan membership, chat activity)
- Last session timestamp and app delete events
- Device type and platform (mobile/PC/console)
- Tutorial completion and onboarding progress
- Ad engagement (video completions, rewarded ad watches)
- Event participation (seasonal, limited-time events)
- Tutorial completion rate and skill assessment

```
schema_discovery operation: "store", store_type: "event_store"
schema_discovery operation: "columns", columns: ["session_duration", "iap_amount", "level_progress"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Engagement depth**: Sessions per day/week, session duration trends
- **Monetization**: Total spend (LTV), spend per session, IAP conversion rate
- **Retention cohorts**: D1/D7/D30 retention, churn probability
- **Content affinity**: Game mode distribution, favorite genres
- **Social engagement**: Friend count, guild membership, chat activity
- **Progression rate**: Levels per week, completion metrics

```
feature_analysis columns: ["session_count", "iap_amount", "session_duration",
  "days_since_last_session", "progression_level"],
metric_types: ["basic", "statistical", "quality"]
```

## Common Audience Definitions

### 1. Whales (High-Value Spenders)
**Filter Criteria:**
- Lifetime spend: >$500 (top 1-3%)
- IAP conversion: >20% of sessions include purchase
- Average spend per session: >$5
- Active: Last session within 7 days
- Retention: D30 = true

**Expected Size:** 1-3% of base
**Activation:** VIP programs, exclusive cosmetics, early content access, premium events, direct community manager outreach

### 2. Dolphins (Moderate Spenders)
**Filter Criteria:**
- Lifetime spend: $50-$500
- IAP conversion: 5-20% of sessions
- Average spend per session: $0.50-$5
- Session frequency: 3+ per week
- Retention: D7 = true

**Expected Size:** 5-10% of base
**Activation:** Battle pass promotions, seasonal bundles, limited-edition skins, special event access

### 3. Minnows (Minimal Spenders)
**Filter Criteria:**
- Lifetime spend: $1-$50
- IAP conversion: <5% of sessions
- Session frequency: 2-4 per week
- Progression: Mid-level content
- Retention: D7 = true

**Expected Size:** 20-30% of base
**Activation:** Free-to-play content, progression rewards, cosmetic crate earnings, battle pass trial

### 4. Free Players (Non-Monetized)
**Filter Criteria:**
- Lifetime spend: $0
- Session frequency: Active (2+ per week)
- Progression: Accessible levels only
- Retention: D7 = true
- Engagement: Ad watch rate >10%

**Expected Size:** 50-65% of base
**Activation:** Ad-supported rewards, progression incentives, community events, skill-based contests

### 5. Lapsed Players (Reactivation Target)
**Filter Criteria:**
- Last session: 30-90 days ago
- Historical engagement: D7 = true (was active)
- Peak progression: >10 levels (knows game)
- Account age: >90 days (not new churn)
- No deletion flag

**Expected Size:** 15-25% of base
**Activation:** Win-back email (new content summary), comeback login bonus, content anniversary notifications, nostalgia campaigns

### 6. New Content Adopters
**Filter Criteria:**
- Session within 7 days of new content launch
- Content completion: >50% within 14 days
- Engagement jump: Session duration +20% post-launch
- Content type affinity: Same mode as new release
- Social activity spike: Increased multiplayer sessions

**Expected Size:** 40-60% of active base
**Activation:** Content teasers, early access to next release, limited-time cosmetics, story progression incentives

### 7. Competitive/PvP Enthusiasts
**Filter Criteria:**
- PvP mode session %: >60% of total
- Ranked participation: Active in competitive ladder
- Skill rating: Above 50th percentile
- Session frequency: 4+ per week
- Win rate: >45%

**Expected Size:** 15-25% of base
**Activation:** Ranked rewards, esports tournament invitations, competitive cosmetics, pro player content

### 8. Social/Multiplayer Players
**Filter Criteria:**
- Multiplayer session %: >70% of sessions
- Friend count: >10 active friends
- Guild/clan membership: Active status
- Group session rate: >50% of sessions in groups
- Chat activity: Regular (daily+)

**Expected Size:** 25-35% of base
**Activation:** Guild events, friend referral bonuses, co-op exclusive content, party-size cosmetics

### 9. Event Completers (Loyal & Engaged)
**Filter Criteria:**
- Limited-time event participation: >80% of released events
- Event completion rate: >50% within window
- Last session: Within 14 days
- Engagement consistency: Active 6+ months
- Challenge completion: High difficulty events attempted

**Expected Size:** 8-15% of base
**Activation:** Exclusive event cosmetics, event season pass, priority access to new events, community recognition

## Example Audience Queries

### Query 1: Whale Retention Campaign (High-Value At-Risk)
```sql
SELECT user_id, player_tag, lifetime_spend, last_session_date,
       AVG(session_duration) as avg_session_mins, COUNT(*) as total_sessions
FROM player_sessions
WHERE lifetime_spend > 500
AND last_session_date BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
                            AND DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
AND days_since_last_session >= 7
GROUP BY user_id, player_tag, lifetime_spend, last_session_date
HAVING AVG(session_duration) > 30
ORDER BY lifetime_spend DESC
```

### Query 2: Lapsed Players Reactivation (30-90 Day Gap)
```sql
SELECT DISTINCT user_id, player_tag, last_session_date,
       MAX_PROGRESSION_LEVEL, total_iap_spend, days_since_last_session
FROM player_profiles
WHERE last_session_date BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
                              AND DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
AND max_progression_level > 10
AND account_creation_date < DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
AND NOT account_deleted
AND retention_d7_historical = true
ORDER BY total_iap_spend DESC, last_session_date DESC
```

### Query 3: New Content Early Adopters (Launch Window)
```sql
SELECT user_id, player_tag, session_date, content_type, session_duration,
       iap_during_content_window, social_activity
FROM player_sessions
WHERE session_date <= DATE_ADD(@content_launch_date, INTERVAL 14 DAY)
AND session_date >= @content_launch_date
AND content_played_id = @new_content_id
AND session_duration > (SELECT AVG(session_duration) FROM player_sessions
                        WHERE content_played_id != @new_content_id)
AND user_id IN (
  SELECT DISTINCT user_id FROM player_sessions
  WHERE last_session_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
)
ORDER BY iap_during_content_window DESC
```

## Monetization Channel Recommendations

| Segment | In-Game Shop | Battle Pass | Events | Cosmetics | Ads | Premium Content |
|---------|------------|------------|--------|-----------|-----|-----------------|
| Whales | Premium | All Tiers | VIP | Exclusive | Skip | Early Access |
| Dolphins | Regular | Standard | All | Standard | Skip | Standard |
| Minnows | Standard | Trial | Free | Free | Enable | Preview |
| Free Players | Minimal | Trial | Free | Earned | Enable | No |
| Lapsed Players | Comeback Offer | Bonus | New Content | Free | Enable | New Content |
| New Content Adopters | Featured | Push | Featured | Content-Aligned | Optional | Launch Promotion |
| Competitive | Ranked Rewards | Competitive | Ranked Events | Skill-Based | Skip | Ranked Pass |
| Social Players | Group Bundles | Group Rewards | Guild Events | Social Cosmetics | Skip | Guild Features |
| Event Completers | Event Shop | Event Pass | All Events | Event Exclusive | Skip | Seasonal Content |

## Retention & Churn Prevention

1. **D1 Retention Focus**: Optimize first-session completion (tutorial, first win)
2. **D7 Gate**: Identify users at D7 risk; push engagement/rewards
3. **D30 Prediction**: Build churn model using feature_analysis on churned cohorts
4. **Session Duration Trends**: Declining duration = churn signal; activate before D7
5. **Content Calendar**: Match new content to retention windows (e.g., content drops every 2 weeks)
6. **IAP Conversion Analysis**: Monitor spend drop; re-monetize free players with first offer

## Tips for Success

1. Use time_travel to analyze cohort behavior across content seasons
2. Build IAP conversion funnels: browsing → purchase completion
3. Monitor PvP engagement; balance for competitive/casual mix
4. Track event participation early to predict content interest
5. Segment by platform (mobile/PC); optimize UX differently
6. Create progression milestones (level 10, 50, 100) for retention hooks
7. Use cohort analysis for post-launch tuning (new content adoption curves)
