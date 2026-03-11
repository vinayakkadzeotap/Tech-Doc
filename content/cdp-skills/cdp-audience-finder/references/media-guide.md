# Media & Entertainment Audience Finding Guide

## Overview
Media audience segmentation focuses on content consumption patterns, subscription tiers, engagement depth, and churn risk. Use CDP data to optimize content recommendations, drive subscription upgrades, and reduce subscriber churn.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Subscription tier (free/basic/premium/ad-free)
- Content consumption patterns (watches, streaming hours, completion rate)
- Content genre affinity and preference distribution
- Device usage (TV, mobile, tablet, web) and platform
- Viewing behavior (time of day, binge vs casual)
- Content completion rate and abandonment patterns
- Social sharing and engagement (reviews, shares, ratings)
- Advertisement tolerance and viewing behavior
- Search and recommendation interaction
- Account sharing (multiple viewers on account)
- Subscription renewal and payment history
- Cancel/churn risk signals
- Content arrival timing (early adopter vs late adopter)
- Recommendation acceptance rate
- Engagement trend (increasing vs declining)

```
schema_discovery operation: "store", store_type: "event_store"
schema_discovery operation: "columns", columns: ["subscription_tier", "content_watched_hours", "genre_preference", "completion_rate"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Engagement depth**: Hours watched/month, content completion rate
- **Genre affinity**: Distribution across comedy, drama, documentary, etc.
- **Viewing style**: Binge watching (multiple episodes per session) vs casual
- **Platform preference**: Device usage distribution
- **Content adoption**: Time to consume new releases vs catalog browsing
- **Retention indicators**: Engagement trend, subscription payment consistency
- **Churn risk**: Declining hours, infrequent logins, cancellation intent

```
feature_analysis columns: ["monthly_viewing_hours", "completion_rate", "genre_diversity",
  "days_since_last_view", "subscription_payment_status"],
metric_types: ["basic", "statistical", "quality"]
```

## Common Audience Definitions

### 1. Premium Tier Subscribers (Highest Engagement)
**Filter Criteria:**
- Subscription tier: Premium or ad-free
- Monthly engagement: >20 hours/month
- Content completion: >60% of started content
- Viewing consistency: Active 3+ days per week
- Payment status: On-time, auto-renewal enabled
- Account age: 6+ months (mature subscriber)
- Multi-device usage: 2+ device types
- Churn risk: Low (engagement stable or increasing)

**Expected Size:** 8-15% of base
**Activation:** Exclusive content previews, early access to originals, premium-only features, personalized curation, premium support

### 2. Basic Tier (Ad-Supported Growth)
**Filter Criteria:**
- Subscription tier: Basic/standard with ads
- Monthly engagement: 10-20 hours/month
- Completion rate: 40-60%
- Viewing frequency: 2-3 days per week
- Ad tolerance: Accepting ads (watch-through rate >70%)
- Upgrade susceptibility: Has viewed premium content
- Device: Primarily mobile/tablet
- Duration: 3-12 months (early tenure)

**Expected Size:** 25-40% of base
**Activation:** Upgrade prompts, ad-free trial offers, premium content teasers, bundle offers, limited-time discounts

### 3. Free Tier Users (Conversion Path)
**Filter Criteria:**
- Subscription tier: Free
- Engagement: 2-5 hours/month
- Content access: Limited to free library only
- Viewing: Sporadic, 1-2 days per week
- Ad engagement: Completing ads (if applicable)
- Account age: <3 months (new users)
- Premium conversion probability: Interacted with premium content info
- Device: Mobile-first (convenience-driven)

**Expected Size:** 35-50% of base
**Activation:** Free trial conversion, freemium content discovery, upgrade education, limited-time premium offers, referral incentives

### 4. Binge Watchers (High Engagement)
**Filter Criteria:**
- Monthly hours: >25 hours/month
- Viewing pattern: Multiple episodes per session
- Completion rate: >75% of started series
- Genre focus: Drama, crime, sci-fi (serialized content)
- Viewing pace: Fast progression through shows
- Engagement trend: Consistent or increasing
- Time of watching: Multiple peak hours (flexible viewing)
- Content appetite: High (diverse show exploration)

**Expected Size:** 15-25% of base
**Activation:** New season announcements, series recommendations, binge-able content bundles, marathon content drops, exclusive binge content

### 5. Multi-Platform Users (Omnichannel)
**Filter Criteria:**
- Device diversity: 3+ device types (TV, mobile, tablet, web)
- Platform switching: Frequent (different devices on different days)
- Engagement: Steady (>15 hours/month across devices)
- Subscription tier: Premium (features enabled across devices)
- Sync awareness: Uses continue-watching features
- Viewing context: Different content per device (shows on TV, movies on mobile)
- Account features: Profile preferences, watchlist usage

**Expected Size:** 20-30% of base
**Activation:** Seamless cross-device experience, device-optimized content, sync features, offline viewing, device-specific recommendations

### 6. Social Sharers (Community Engagement)
**Filter Criteria:**
- Review/rating activity: 5+ reviews/month
- Social sharing: Active (shares 2+ times/week)
- Comment engagement: Regular community interaction
- User-generated content: Actively creates posts/lists
- Influence potential: High follower count or engagement score
- Content affinity: Strong opinions on specific genres
- Engagement timing: Posts during/after watching
- Platform savvy: Uses multiple social networks

**Expected Size:** 12-20% of base
**Activation:** Community features, exclusive discussions, user-generated content contests, ambassador programs, exclusive premieres

### 7. At-Risk Churners (Retention Priority)
**Filter Criteria:**
- Engagement trend: Declining >30% over last 2 months
- Viewing frequency: Previously 3+ days/week, now 1-2 days
- Last view: 14+ days ago
- Content interaction: No searches or recommendations accepted >3 weeks
- Payment: Recent payment failed or method expired
- Subscription: Within 30 days of renewal
- Viewing time: Previously >10 hours/month, now <5 hours
- Support interactions: Recent complaints or technical issues

**Expected Size:** 5-10% of base
**Activation:** Win-back offers, personalized content emails, reactivation incentives, subscription pause options, customer service outreach

### 8. New Release Adopters (Early Audience)
**Filter Criteria:**
- Content adoption window: Watch within 48 hours of release
- New content engagement: >50% of new releases consumed
- Notification setting: Enabled for new releases
- Genre alignment: Watches new releases in preferred genres
- Viewing speed: Rapid progression through new series
- Subscription tier: Premium (access advantage)
- Engagement: Overall active (regular viewer)
- Influence: High social sharing of new content

**Expected Size:** 10-18% of base
**Activation:** Early access to unreleased content, premiere events, exclusive behind-the-scenes, new release notifications, critic communities

### 9. Casual Browsers (Low Engagement, Recommendation Dependent)
**Filter Criteria:**
- Monthly engagement: 2-5 hours/month
- Content completion: <30% (high abandonment)
- Search activity: Low (relies on recommendations)
- Viewing patterns: Irregular, 1-2 days per week
- Browsing behavior: High (time spent searching > viewing)
- Genre preference: Not clear (diverse, low affinity)
- Subscription: Basic or free tier
- Engagement trend: Flat or declining
- Churn risk: Medium (conversion or churn)

**Expected Size:** 20-30% of base
**Activation:** Personalized recommendations, guided curation, best-of collections, seasonal playlists, search improvements, simplified UX

## Example Audience Queries

### Query 1: Premium Tier Retention (At-Risk High-Value)
```sql
SELECT subscriber_id, email, subscription_tier, monthly_viewing_hours,
       content_completion_rate, last_view_date, payment_status,
       engagement_trend_3m, churn_risk_score
FROM subscriber_profiles
WHERE subscription_tier = 'premium'
AND monthly_viewing_hours >= 20
AND content_completion_rate > 0.60
AND engagement_trend_3m = 'declining'
AND days_since_last_view BETWEEN 7 AND 30
AND churn_risk_score > 70
AND payment_status IN ('on_time', 'recent_renewal')
ORDER BY churn_risk_score DESC, monthly_viewing_hours DESC
```

### Query 2: Basic Tier Upgrade Conversion (Premium Content Interest)
```sql
SELECT subscriber_id, email, subscription_tier, monthly_viewing_hours,
       device_type, genre_preferences, premium_content_engagement_score
FROM subscriber_engagement
WHERE subscription_tier = 'basic'
AND monthly_viewing_hours BETWEEN 10 AND 20
AND ad_completion_rate > 0.70
AND premium_content_engagement_score > 50
AND account_age_months BETWEEN 3 AND 12
AND NOT EXISTS (
  SELECT 1 FROM upgrade_offers
  WHERE subscriber_id = se.subscriber_id
  AND offer_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
)
ORDER BY premium_content_engagement_score DESC
```

### Query 3: Churn Risk Win-Back Campaign
```sql
SELECT subscriber_id, email, subscription_tier, monthly_viewing_hours,
       days_since_last_view, engagement_trend_3m, favorite_genres,
       last_watched_title, payment_method_status
FROM subscriber_profiles
WHERE engagement_trend_3m = 'declining'
AND monthly_viewing_hours < 5
AND days_since_last_view >= 14
AND subscription_renewal_date <= DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)
AND account_age_months >= 3
AND (
  payment_method_status = 'expired'
  OR recent_support_complaint = true
  OR engagement_hours_previous_month > CURRENT_monthly_viewing_hours * 1.5
)
ORDER BY account_lifetime_value DESC
```

## Channel Strategy by Segment

| Segment | Email | SMS | In-App | Push | Social Media | Direct Mail |
|---------|-------|-----|--------|------|-------------|------------|
| Premium Subs | Medium | Low | Very High | High | Medium | Low |
| Basic Tier | High | Medium | Very High | High | Medium | Low |
| Free Users | Very High | Low | Very High | High | Medium | Low |
| Binge Watchers | High | Low | Very High | Very High | High | Low |
| Multi-Platform | Medium | Low | Very High | Very High | Low | Low |
| Social Sharers | High | Medium | Very High | Medium | Very High | Low |
| At-Risk Churners | Very High | High | Very High | High | Low | Medium |
| New Release Adopters | High | Medium | Very High | Very High | Very High | Low |
| Casual Browsers | Very High | Low | Very High | High | Medium | Low |

## Content Strategy by Engagement Type

### Binge Watchers
- Full-season releases (all episodes at once)
- Serialized narratives with cliffhangers
- Limited series completable in 2-3 weekends
- Bundle recommendations (watch next show)

### Casual Browsers
- Single-episode releases (variety, choice)
- Episodic content (non-sequential watching)
- Curated playlists and collections
- Simple, genre-based discovery

### Social Sharers
- Controversy/debate-prone content
- Exclusive interviews and behind-the-scenes
- Community features (polls, discussions)
- User-generated content integration

### Early Adopters
- Exclusive premiere access
- Critic reviews and commentary
- Sneak peeks and teasers
- Discussion forums for new releases

## Tips for Success

1. Monitor completion rates weekly; declining = churn signal
2. Build engagement score: hours × completion_rate × consistency
3. Use genre affinity for personalization; test in recommendation engine
4. Track ad tolerance separately; it correlates with churn risk
5. Analyze binge windows (time-to-completion) by show; optimize release strategy
6. Use time_travel to track seasonal viewing patterns (summer vs. winter content appetite)
7. Build churn prediction model using engagement trend + payment status + last_view_date
8. Create recommendation A/B tests; measure acceptance rate improvement
9. Monitor account sharing patterns; opportunity for family plan upsell
