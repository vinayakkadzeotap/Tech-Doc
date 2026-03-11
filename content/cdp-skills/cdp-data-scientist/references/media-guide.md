# Media Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for media and streaming companies. Focus on viewing behavior, engagement, and churn prediction.

## Viewing Features

### Content Consumption
Watching patterns and volume:

**Watch Time Metrics**
- Total hours watched (lifetime)
- Hours per month (recency-weighted average)
- Hours per week (current engagement)
- Daily average watch time (intensity)

**Content Frequency**
- Sessions per week (engagement frequency)
- Content starts per month (activity level)
- Series binge indicator (multiple episodes in short period)
- Content completion rate (% finished vs. started)

**Implementation**
```sql
SELECT user_id,
  SUM(watch_duration_minutes) as total_watch_hours,
  AVG(CASE WHEN event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) THEN watch_duration_minutes ELSE 0 END) / 60 as avg_monthly_hours_30d,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(CASE WHEN event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) THEN session_id ELSE NULL END) as sessions_7d,
  SUM(CASE WHEN content_completed THEN 1 ELSE 0 END) / COUNT(*) as completion_rate
FROM viewing_events
GROUP BY user_id
```

### Viewing Patterns
Time and context patterns:

**Prime Time Usage**
- Preferred viewing hours (morning, afternoon, evening)
- Weekday vs. weekend viewing (patterns differ?)
- Peak hours (when do most watch?)
- Time-of-day variance (mobile mornings, TV evenings?)

**Session Characteristics**
- Average session length (browsing vs. deep watching)
- Session length distribution (consistent viewer vs. variable)
- Session type (single episode vs. binge sessions)

**Implementation**
```sql
SELECT user_id,
  EXTRACT(HOUR FROM event_time) as viewing_hour,
  CASE WHEN EXTRACT(DAYOFWEEK FROM event_time) IN (1,7) THEN 'weekend' ELSE 'weekday' END as day_type,
  AVG(TIMESTAMP_DIFF(session_end, session_start, MINUTE)) as avg_session_minutes,
  COUNT(*) as event_count
FROM viewing_events
GROUP BY user_id, viewing_hour, day_type
```

### Content Preferences
Genre and type engagement:

**Genre Affinity**
- Primary genre (most viewed)
- Genre mix (diverse vs. narrow preferences)
- Genre shift (is preference changing over time?)
- Genre popularity (trending genres)

**Content Type**
- Series vs. movie preference
- Original vs. acquired content preference
- Documentary consumption
- International vs. domestic content

**Implementation**
```sql
SELECT user_id,
  ARRAY_AGG(STRUCT(genre, SUM(watch_duration_minutes) as hours) ORDER BY SUM(watch_duration_minutes) DESC LIMIT 5) as top_genres,
  COUNT(DISTINCT CASE WHEN content_type='series' AND content_completed THEN content_id END) as series_completed,
  COUNT(DISTINCT CASE WHEN content_type='movie' AND content_completed THEN content_id END) as movies_completed,
  SUM(CASE WHEN is_original THEN watch_duration_minutes ELSE 0 END) / SUM(watch_duration_minutes) as pct_original_viewing
FROM viewing_events
GROUP BY user_id
```

### Content Diversity
Breadth of consumption:

**Title Diversity**
- Distinct titles watched (content breadth)
- Series diversity (# of distinct series)
- Concentration (% of viewing from top 10 titles)
- New content rate (% first-time viewers)

**Discovery Pattern**
- Browse-to-watch ratio (titles viewed before selecting)
- Search vs. recommendation path (how found content)
- Recommendation acceptance rate

**Implementation**
```sql
SELECT user_id,
  COUNT(DISTINCT title_id) as distinct_titles_watched,
  COUNT(DISTINCT CASE WHEN content_type='series' THEN title_id END) as distinct_series,
  SUM(CASE WHEN ROW_NUMBER() OVER (PARTITION BY title_id ORDER BY watch_duration_minutes DESC) <= 10 THEN watch_duration_minutes ELSE 0 END) / SUM(watch_duration_minutes) as concentration_top_10,
  COUNT(CASE WHEN is_first_view THEN 1 END) / COUNT(*) as pct_new_content
FROM viewing_events
GROUP BY user_id
```

## Engagement Features

### Interaction Signals
Active engagement beyond watching:

**Content Interaction**
- Ratings submitted (engagement level)
- Reviews written (advocacy signal)
- Content shared (social signal)
- Watchlist additions (future intent)
- Comments/discussion participation

**Engagement Frequency**
- Rating rate (% of content rated)
- Share rate (% of content shared)
- Watchlist update frequency

**Implementation**
```sql
SELECT user_id,
  COUNT(CASE WHEN interaction_type='rating' THEN 1 END) as ratings_submitted,
  COUNT(CASE WHEN interaction_type='share' THEN 1 END) as content_shares,
  COUNT(CASE WHEN interaction_type='watchlist_add' THEN 1 END) as watchlist_additions,
  COUNT(CASE WHEN interaction_type='review' THEN 1 END) as reviews_written,
  COUNT(CASE WHEN interaction_type='rating' THEN 1 END) / COUNT(DISTINCT viewing_session_id) as rating_frequency
FROM user_interactions
GROUP BY user_id
```

### Session Engagement
Session quality indicators:

**Session Quality**
- Average rating given (satisfaction)
- Rating trend (improving or declining satisfaction)
- Completion percentage (content watched before abandoning)
- Resume rate (come back to unfinished content)

**Engagement Intensity**
- High engagement sessions (long watch, multiple titles)
- Low engagement sessions (browsing, no completion)
- Engagement trend (overall engagement declining?)

**Implementation**
```sql
SELECT user_id,
  AVG(CASE WHEN rating_submitted THEN rating ELSE NULL END) as avg_rating_given,
  COUNT(DISTINCT session_id) as total_sessions,
  AVG(content_watched_pct) as avg_completion_pct,
  COUNT(CASE WHEN resumed_content THEN 1 END) / COUNT(*) as resume_rate,
  CORR(session_date, CAST(high_engagement AS INT64)) as engagement_trend
FROM session_analysis
GROUP BY user_id
```

## Subscription Features

### Tier and Status
Subscription level information:

**Subscription Tier**
- Current tier (basic, standard, premium)
- Tier tenure (how long at current tier)
- Tier upgrades (basic → standard → premium progression)
- Tier downgrades (cost sensitivity signal)

**Account Status**
- Active vs. paused subscription
- Payment method reliability (failures?)
- Account sharing (household usage)

**Implementation**
```sql
SELECT user_id,
  subscription_tier,
  CURRENT_DATE() - subscription_start_date as subscription_tenure_days,
  COUNT(CASE WHEN new_tier > old_tier THEN 1 END) as upgrades,
  COUNT(CASE WHEN new_tier < old_tier THEN 1 END) as downgrades,
  MAX(CASE WHEN CURRENT_DATE() - last_payment_date > 30 THEN 1 ELSE 0 END) as has_payment_issues
FROM subscription_history
GROUP BY user_id, subscription_tier, subscription_start_date
```

### Payment Behavior
Billing patterns:

**Payment Consistency**
- On-time payment rate
- Failed payment frequency
- Payment method changes (instability?)
- Subscription pause/resume pattern

**Payment Preference**
- Annual vs. monthly billing (commitment level)
- Auto-renewal status (consent level)

**Implementation**
```sql
SELECT user_id,
  COUNT(CASE WHEN payment_status='successful' THEN 1 END) / COUNT(*) as payment_success_rate,
  COUNT(CASE WHEN payment_status='failed' THEN 1 END) as failed_payments,
  CASE WHEN billing_frequency='annual' THEN 'annual' ELSE 'monthly' END as billing_preference,
  CASE WHEN auto_renewal_enabled THEN 'auto' ELSE 'manual' END as renewal_type
FROM billing_history
GROUP BY user_id
```

## Device and Access Features

### Device Usage
Viewing device patterns:

**Primary Device**
- TV vs. mobile vs. tablet vs. computer usage
- Device preference (where do they primarily watch?)
- Multi-device usage (household penetration)

**Device Distribution**
- % of viewing on each device type
- Device type trend (mobile increasing?)

**Implementation**
```sql
SELECT user_id,
  COUNT(CASE WHEN device_type='smart_tv' THEN 1 END) / COUNT(*) as pct_tv_viewing,
  COUNT(CASE WHEN device_type='mobile' THEN 1 END) / COUNT(*) as pct_mobile_viewing,
  COUNT(CASE WHEN device_type='tablet' THEN 1 END) / COUNT(*) as pct_tablet_viewing,
  COUNT(DISTINCT device_id) as distinct_devices,
  CASE WHEN COUNT(DISTINCT device_id) > 2 THEN 'household' ELSE 'single_user' END as usage_pattern
FROM viewing_events
GROUP BY user_id
```

### Streaming Quality
Technical experience indicators:

**Quality Metrics**
- Average bitrate (quality level viewing)
- Buffering incidents (quality issues)
- Resolution preference (4K vs. HD capable users)

**Technical Health**
- Frequent rebuffering (user frustration signal)
- Quality trend (improving or degrading experience)

**Implementation**
```sql
SELECT user_id,
  AVG(bitrate_mbps) as avg_bitrate,
  COUNT(CASE WHEN rebuffer_count > 0 THEN 1 END) / COUNT(*) as sessions_with_buffering,
  AVG(rebuffer_count) as avg_rebufs_per_session,
  MAX(resolution) as max_resolution_viewed
FROM streaming_quality
GROUP BY user_id
```

## Common Media Models

### Churn Prediction
Predict subscription cancellation:

**Target Definition**
- Cancelled subscription in next 30/60 days
- Or: Paused subscription (intent to churn)

**Feature Selection**
- Watch hours declining (disengagement)
- Completion rate declining (content satisfaction)
- Session frequency declining (engagement drop)
- Rating trend declining (satisfaction)
- Payment issues (friction point)
- Content discovery declining (boredom with catalog)

**Recommended Model**: LOGISTIC_REG or BOOSTED_TREE

### Tier Upgrade Propensity
Predict who will upgrade subscription:

**Target Definition**
- Will upgrade tier in next 30 days
- Will switch from basic to premium

**Feature Selection**
- Current tier (basic users more likely to upgrade)
- Watch hours (high engagers upgrade for quality)
- Device usage (multi-device users want premium quality)
- Payment reliability (good payers upgrade)
- Content preferences (premium content attracts upgrades)

**Recommended Model**: LOGISTIC_REG or DNN_CLASSIFIER

### Content Recommendation
Predict which content will interest user:

**Target Definition**
- Will watch content (yes/no)
- Rating given to content

**Feature Selection**
- Similar content previously watched (genre, director, actor)
- Genre affinity (align with preference)
- Trending content (popularity signal)
- Peer recommendations (social signal)
- Optimal timing (recommend when likely to watch)

**Recommended Model**: DNN_CLASSIFIER or neural collaborative filtering

### Engagement Scoring
Predict overall platform engagement:

**Target Definition**
- Engagement score (0-100)
- Engagement tier (low/medium/high)

**Feature Selection**
- Watch hours (volume)
- Content diversity (breadth)
- Rating frequency (interaction)
- Series completion rate (depth)
- Session recency (current activity)
- Share/recommendation frequency (advocacy)

**Recommended Model**: LINEAR_REG or BOOSTED_TREE_REGRESSOR

## Feature Engineering Best Practices

1. **Temporal Windows**: Use 30/90 day lookbacks for recency features
2. **Engagement Scoring**: Combine multiple signals (watch + rating + sharing)
3. **Content Embeddings**: Map high-cardinality content to learned embeddings
4. **Genre Vectors**: Create affinity vectors for content genres
5. **Device Context**: Features may differ by device type (mobile vs. TV viewing)

## Cost Optimization Tips

- Use `query_builder` before large viewing event aggregations (can be voluminous)
- Aggregate viewing at daily user level before building features
- Pre-compute content embeddings separately from user features
- Use APPROX_QUANTILES for percentile calculations
- Batch score recommendations nightly rather than real-time

## Model Monitoring

- **Engagement Shift**: Are watch hours per user declining (content quality?)
- **Tier Distribution**: Is % of premium subscribers increasing or declining?
- **Content Consumption**: Are viewing patterns shifting (new releases impacting?)
- **Device Shift**: Mobile viewing increasing (cord-cutting indicator)
- **Satisfaction Trend**: Are rating averages declining (content quality perception)?
