# Gaming Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for gaming analytics. Focus on engagement, monetization, progression, and retention prediction.

## Session Features

### Session Characteristics
Fundamental session-level metrics:

**Session Duration**
- Time in game per session (minutes)
- Session duration distribution (median, p95)
- Duration trend (increasing = deeper engagement)
- Drift (declining duration = warning signal)

**Session Frequency**
- Sessions per day
- Sessions per week (weekly active trend)
- Consecutive day streaks (habit formation)
- Session gap (days between sessions)

**Session Depth**
- Progression per session (levels gained)
- Content completed (quests, battles, events)
- Resources earned per session
- Achievement progress per session

**Implementation**
```sql
SELECT user_id,
  COUNT(*) as total_sessions,
  AVG(TIMESTAMP_DIFF(session_end, session_start, MINUTE)) as avg_session_duration,
  STDDEV(TIMESTAMP_DIFF(session_end, session_start, MINUTE)) as session_duration_stddev,
  COUNT(DISTINCT DATE(session_start)) as days_active,
  MAX(TIMESTAMP_DIFF(session_end, session_start, MINUTE)) as longest_session
FROM sessions
GROUP BY user_id
```

### Session Patterns
Temporal engagement patterns:

**Time-of-Day Preference**
- Peak hours (when does player usually session?)
- AM vs. PM preference
- Weekday vs. weekend patterns
- Timezone-based insights

**Session Timing**
- Time since last session (recency)
- Consistent timing (similar times daily?)
- Prime time participation (events happening at specific times)

**Implementation**
```sql
SELECT user_id,
  EXTRACT(HOUR FROM session_start) as session_hour,
  CASE WHEN EXTRACT(DAYOFWEEK FROM session_start) IN (1,7) THEN 'weekend' ELSE 'weekday' END as day_type,
  COUNT(*) as session_count
FROM sessions
GROUP BY user_id, session_hour, day_type
```

## Monetization Features

### In-App Purchase (IAP) Behavior
Spending patterns and frequency:

**Purchase History**
- Total lifetime spend ($)
- Purchase count (# of IAP transactions)
- Average purchase amount ($)
- Days since first purchase (monetization maturity)

**Purchase Frequency**
- Purchases per day (conversion rate)
- Purchase-to-session ratio (what % of sessions include purchase)
- Inter-purchase time (days between purchases)
- Purchase trend (accelerating vs. declining)

**Implementation**
```sql
SELECT user_id,
  SUM(purchase_amount) as lifetime_spend,
  COUNT(*) as purchase_count,
  AVG(purchase_amount) as avg_purchase_amount,
  CURRENT_DATE() - MIN(purchase_date) as days_as_payer,
  MAX(CASE WHEN purchase_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) THEN purchase_amount ELSE 0 END) as spend_30d
FROM iap_purchases
GROUP BY user_id
```

### Item Preferences
What do payers buy:

**Item Category Distribution**
- Cosmetics vs. gameplay items (preference signal)
- Currency purchases (convenience items)
- Event-specific items (FOMO items)
- Bundle vs. individual items

**Item Affinity**
- Favorite item categories (what gets purchased most)
- Item combination patterns (do buyers get specific combos?)
- Limited-time item participation (urgency response)

**Implementation**
```sql
SELECT user_id,
  ARRAY_AGG(STRUCT(item_category, COUNT(*) as purchase_count) ORDER BY COUNT(*) DESC) as category_purchases,
  COUNT(DISTINCT item_id) as distinct_items_purchased,
  SUM(CASE WHEN item_type='cosmetic' THEN purchase_amount ELSE 0 END) as cosmetic_spend,
  SUM(CASE WHEN item_type='gameplay' THEN purchase_amount ELSE 0 END) as gameplay_spend
FROM iap_purchases
GROUP BY user_id
```

### Spending Tiers
Segmentation by monetization:

**Tier Definition**
- Free players: $0 lifetime spend
- Light spenders: $0-25 lifetime
- Medium spenders: $25-100
- Whales: $100+ lifetime

**Tier Characteristics**
- Session duration by tier (whales more engaged?)
- Progression speed by tier (pay-to-win effect?)
- Retention by tier (monetizers more loyal?)

**Implementation**
```sql
SELECT user_id,
  SUM(purchase_amount) as lifetime_spend,
  CASE
    WHEN SUM(purchase_amount) = 0 THEN 'free'
    WHEN SUM(purchase_amount) < 25 THEN 'light'
    WHEN SUM(purchase_amount) < 100 THEN 'medium'
    ELSE 'whale'
  END as spending_tier
FROM users
LEFT JOIN iap_purchases USING (user_id)
GROUP BY user_id
```

## Progression Features

### Level and Milestone Progression
Account progression tracking:

**Level Progression**
- Current level (account maturity)
- Levels per day (progression speed)
- Days to reach current level (from install)
- Level growth trend (accelerating vs. stuck)

**Milestone Achievements**
- Milestones reached (achievements unlocked)
- Achievement rate (milestones per day)
- Speed to milestone (how quickly achieved)
- Stalled progression (stuck at difficult level?)

**Implementation**
```sql
SELECT user_id,
  MAX(level) as current_level,
  CURRENT_DATE() - MIN(install_date) as days_since_install,
  MAX(level) / NULLIF(CURRENT_DATE() - MIN(install_date), 0) as levels_per_day,
  COUNT(*) as total_achievements
FROM player_progression
GROUP BY user_id
```

### Skill and Performance
Player capability indicators:

**Win Rate**
- PvP win rate (competitive performance)
- Mission completion rate (PvE success)
- Average score (ability indicator)

**Performance Trend**
- Win rate trend (improving vs. declining)
- Score trend (skill development)
- Difficulty progression (attempting harder content)

**Implementation**
```sql
SELECT user_id,
  COUNT(*) as total_matches,
  COUNTIF(result='win') / COUNT(*) as win_rate,
  AVG(score) as avg_score,
  MAX(difficulty_level) as max_difficulty_attempted,
  CORR(EXTRACT(EPOCH FROM match_date), CAST(result='win' AS INT64)) as win_trend
FROM matches
GROUP BY user_id
```

## Social Features

### Friend Network
Social engagement:

**Friend Count**
- Friend list size (social connectivity)
- Active friends (how many friends also active?)
- Friend requests sent/received
- Block list size (conflict indicator)

**Guild/Team Activity**
- Guild membership (social bonding)
- Guild leadership (responsibility)
- Guild activity level (participate in group events?)

**Implementation**
```sql
SELECT user_id,
  COUNT(DISTINCT friend_id) as friend_count,
  COUNT(DISTINCT CASE WHEN friend_last_active >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) THEN friend_id END) as active_friends,
  guild_id,
  guild_contribution_points as guild_participation
FROM social_relationships
GROUP BY user_id, guild_id
```

### Engagement with Others
Social interaction patterns:

**Message Activity**
- Messages sent (social engagement)
- Chat participation (community engagement)
- Chat frequency (communication preferences)

**Collaboration Metrics**
- Co-op missions played (teamwork)
- Guild raids participated (guild commitment)
- Trade activity (economic participation)

## Retention Features

### D-Day Indicators
Retention cohort features:

**Historical Retention**
- D1 achieved (returned after day 1)
- D7 achieved (returned after week 1)
- D30 achieved (returned after month 1)
- D90 achieved (long-term retention)

**Current Retention Status**
- Days since last session (risk indicator)
- Session frequency trend (declining = churn signal)
- Engagement intensity (hours/week trend)

**Implementation**
```sql
SELECT user_id,
  CASE WHEN MAX(session_date) >= DATE_ADD(install_date, INTERVAL 1 DAY) THEN 1 ELSE 0 END as d1_retained,
  CASE WHEN MAX(session_date) >= DATE_ADD(install_date, INTERVAL 7 DAY) THEN 1 ELSE 0 END as d7_retained,
  CASE WHEN MAX(session_date) >= DATE_ADD(install_date, INTERVAL 30 DAY) THEN 1 ELSE 0 END as d30_retained,
  CURRENT_DATE() - MAX(session_date) as days_since_last_session
FROM sessions
GROUP BY user_id, install_date
```

## Common Gaming Models

### Churn Prediction
Predict player abandonment:

**Target Definition**
- No session in 30+ days (churned)
- Or: No session in 7+ days (at-risk)

**Feature Selection**
- Days since last session (strongest indicator)
- Session frequency trend (is engagement declining?)
- Progression stalled (stuck at difficult content?)
- Monetization engagement (whales less likely to churn)
- Social engagement (guild members less likely to churn)

**Recommended Model**: LOGISTIC_REG or BOOSTED_TREE

### IAP Propensity
Predict who will spend money:

**Target Definition**
- Made first IAP purchase (yes/no)
- Or: Will make IAP in next 7 days (yes/no)

**Feature Selection**
- Session engagement (active players more likely to spend)
- Progression level (advanced players less gated)
- Owned cosmetics from free rewards (willing to engage)
- Friend spending (social influence)
- Time in game (monetization opportunity window)

**Recommended Model**: DNN_CLASSIFIER (capture non-linear engagement thresholds)

### Whale Identification
Predict high-value spenders:

**Target Definition**
- Will spend $100+ in next 12 months
- Or: Lifetime spend > $100 (classification of existing whales)

**Feature Selection**
- Historical spending (trajectory)
- Spending acceleration (increasing over time?)
- Session engagement (commitment level)
- Content completion (completionists spend more)
- Competitive play (PvP engagement)
- Item preferences (cosmetic spenders higher value?)

**Recommended Model**: DNN_CLASSIFIER or BOOSTED_TREE

### Content Recommendation
Recommend events, quests, items:

**Target Definition**
- Did player engage with content type
- Rating given to content

**Feature Selection**
- Historical content preferences (what have they played?)
- Progression level (difficulty appropriate?)
- Social recommendations (friends engaging?)
- Time since content release (novelty)
- Previous engagement with content type
- Seasonal/thematic preferences

**Recommended Model**: DNN_CLASSIFIER with content embeddings

## Feature Engineering Best Practices

1. **Install Cohorts**: Always account for install date (newer players behave differently)
2. **Temporal Windows**: Use moving windows (30d, 90d) to capture recent trends
3. **Trend Indicators**: Include trend features (comparing periods) for churn signals
4. **Monetization Segments**: Different models for payers vs. free players may improve accuracy
5. **Time-Zone Normalization**: Normalize temporal features for player timezone

## Cost Optimization Tips

- Use `query_builder` to estimate large session-level aggregations before computing
- Session data can be voluminous; filter to recent periods (last 90-180 days)
- Pre-aggregate daily player metrics to reduce query scope
- Use APPROX_QUANTILES for percentile calculations (cheaper than PERCENTILE_CONT)
- Batch score predictions overnight rather than real-time scoring

## Model Monitoring

- **Monetization Shift**: Is whale percentage increasing/decreasing?
- **Engagement Decay**: Are average session durations declining?
- **Cohort Quality**: Are newer install cohorts retaining worse?
- **Meta Game Changes**: Do balance patch impacts show in feature distributions?
- **Churn Rate**: Is baseline churn increasing (game-level issue)?
