# Media & Entertainment Journey Recommender Guide

## Overview
Media, streaming, and entertainment journey templates, emphasizing trial conversion, content engagement, subscription retention, and social amplification.

## Core Journey Patterns

### 1. Signup-to-Trial-to-Subscription Pipeline
**Trigger Events:** account_created, trial_started, first_content_consumed, binge_event, subscription_purchase_eligible, subscription_purchased
**Trial Duration:** Typically 7-30 days

**Journey Stages:**
- Stage 1: Account creation and profile setup (0-5 min)
- Stage 2: Trial activation (0-2 hours)
- Stage 3: First content view (0-24 hours)
- Stage 4: Engagement acceleration (days 2-5)
- Stage 5: Binge-watch patterns (days 5-20)
- Stage 6: Subscription decision window (days 15-28)
- Stage 7: Payment completion (day 25-30 of trial)

**Timing Windows:**
- Trial welcome: 0-15 min post-signup
- First content recommendation: 30-60 min
- Curated playlist delivery: 2-4 hours post-signup
- First engagement celebration: 24 hours (first watch)
- Content discovery: Days 3-5
- Binge milestone notification: Days 7-15
- Subscription offer: Days 18-25 of trial
- Trial expiry reminder: Days 28-30

**Channel Recommendations:**
- In-app messaging (primary): Seamless viewing experience
- Email (secondary): Content recommendations and offers
- Push notifications: New content alerts and time-sensitive offers
- SMS: Trial expiry reminders (high-engagement users)
- Social platforms: Organic sharing and community

**Conversion Expectations:**
- Trial activation rate: 70-85%
- First content view within 24 hours: 55-70%
- Binge engagement (3+ hours weekly): 40-50%
- Subscription conversion: 30-45% of trial users
- Full subscription completion: 20-30% of trial starts

### 2. Engagement-Drop-to-Recovery
**Trigger Events:** engagement_drop_detected, personalized_content_sent, binge_resumed, churn_risk_detected, win_back_offer_sent
**Drop Threshold:** No activity for 7+ days or session_time < baseline

**Journey Stages:**
- Stage 1: Engagement decline detection (7-day inactivity)
- Stage 2: Personalized recommendation (day 8)
- Stage 3: Content discovery push (day 10)
- Stage 4: Special content offer (day 14)
- Stage 5: Churn risk assessment (day 21)
- Stage 6: Win-back campaign (day 28+)

**Timing Windows:**
- Personalization trigger: Day 7 of inactivity
- First recommendation: Day 8
- Content discovery email: Day 10
- Special offer presentation: Day 14-15
- Win-back push notification: Day 21
- Final win-back offer: Day 28-35

**Channel Recommendations:**
- Email (45%): Personalized content recommendations
- Push notifications (35%): Quick re-engagement prompts
- SMS (15%): Exclusive offer alerts
- In-app messaging (5%): Contextual discovery tools

**Conversion Expectations:**
- Recommendation click rate: 15-20%
- Content rewatch rate: 20-30%
- Win-back re-engagement: 25-40%
- Sustained return (7+ day engagement): 35-50%

### 3. Free-to-Premium-Upsell
**Trigger Events:** free_tier_active, premium_feature_view, premium_trial_offered, premium_subscription_purchased
**Free Tier Duration:** Variable, depending on platform

**Journey Stages:**
- Stage 1: Free tier activation (0 hours)
- Stage 2: Feature limitation discovery (1-7 days)
- Stage 3: Premium feature showcase (7-14 days)
- Stage 4: Limited-time trial offer (14-21 days)
- Stage 5: Premium upgrade incentive (21-30 days)
- Stage 6: Subscription purchase (30+ days)

**Timing Windows:**
- Feature limitation message: Day 2-3
- Premium value prop: Day 7
- First trial offer: Day 14
- Follow-up offer: Day 21
- Exclusive discount: Day 28-30
- Final conversion push: Day 35+

**Channel Recommendations:**
- In-app messaging (60%): Point-of-need premium messaging
- Email (25%): Detailed premium benefits
- Push notifications (10%): Offer reminders
- Display ads (5%): Retargeting premium benefits

**Conversion Expectations:**
- Premium feature exploration: 30-40%
- Trial acceptance rate: 15-25%
- Premium conversion from trial: 40-50%
- Overall free-to-premium conversion: 8-15%

### 4. New-Release-to-Social-Sharing-Engagement
**Trigger Events:** new_content_released, content_viewed, rating_submitted, social_share_prompt, community_interaction
**Release Cycle:** Weekly, monthly, or seasonal depending on platform

**Journey Stages:**
- Stage 1: Release announcement (48 hours pre-release)
- Stage 2: Release day access (0 hours)
- Stage 3: Content consumption (0-7 days post-release)
- Stage 4: Rating/review submission (1-3 days post-consumption)
- Stage 5: Social sharing prompt (2-5 days post-consumption)
- Stage 6: Community discussion (3-7 days post-release)
- Stage 7: Hashtag campaign participation (ongoing)

**Timing Windows:**
- Release teaser: 2-3 days pre-release
- Release day notification: 6-12 hours pre-release
- Watch reminder: 24 hours post-release
- Rating prompt: 2-3 hours post-completion
- Social share prompt: 3-6 hours post-completion
- Community invite: 24-48 hours post-release
- Hashtag campaign: Week 1 post-release

**Channel Recommendations:**
- Push notifications (35%): Release availability and timing
- Email (30%): Content details and early access
- Social platforms (25%): Organic amplification and UGC
- In-app messaging (10%): Seamless social sharing

**Conversion Expectations:**
- Content view rate (release week): 40-60%
- Rating submission rate: 10-15%
- Social sharing rate: 15-25%
- User-generated content (UGC) rate: 8-12%
- Hashtag participation: 5-10%

## Data Requirements

**Essential Attributes:**
- subscription_profile (tier_level, signup_date, billing_cycle, churn_risk)
- viewing_behavior (watch_history, binge_patterns, genre_preferences, session_duration)
- content_affinity (favorite_genres, favorite_creators, watchlist_items)
- engagement_metrics (rating_frequency, review_submission, social_sharing_tendency)
- platform_usage (device_types, viewing_times, multi_platform_engagement)
- subscription_status (trial_status, trial_days_remaining, renewal_date, payment_status)
- churn_risk_score and engagement_velocity

**Event Tracking:**
- account_created, trial_started, content_viewed
- binge_detected (multiple episodes/sessions)
- rating_submitted, review_written, social_share_completed
- premium_offered, premium_purchased, subscription_renewed
- engagement_drop_detected, churn_initiated, win_back_offer_accepted
- new_release_notification_opened, new_release_viewed
- hashtag_participated, community_post_created

## Key Performance Indicators

- Trial activation rate (target: 70-85%)
- Subscription conversion rate from trial (target: 30-45%)
- Free-to-premium conversion rate (target: 8-15%)
- Average engagement per user (minutes watched per week)
- Churn rate by cohort (target: <5% monthly)
- Customer lifetime value (CLV) by tier
- Binge engagement rate (target: 40-50%)
- Social sharing coefficient (k-factor for viral potential)
- Content completion rate by genre
- NPS and customer satisfaction scores

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map content consumption events and subscription data
- Use `feature_analysis` to calculate binge propensity and churn risk scores
- Use `time_travel` to analyze viewing patterns and engagement velocity trends
- Use `get_detailed_events` to understand churn triggers and recovery moments

**Testing Framework:**
- A/B test offer timing (day 14 vs day 21 premium trial offer)
- Test offer incentives (free trial vs discounted trial vs freemium features)
- Segment by content affinity and viewing patterns
- Personalize recommendations based on watch history

**Content Strategy:**
- Plan release schedules to optimize binge potential
- Create curated playlists for new users
- Identify content gaps and acquisition opportunities
- Monitor social amplification by release type

