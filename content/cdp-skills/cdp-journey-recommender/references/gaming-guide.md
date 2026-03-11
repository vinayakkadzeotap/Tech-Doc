# Gaming Journey Recommender Guide

## Overview
Industry-specific journey templates for gaming organizations, emphasizing session engagement, monetization progression, and retention mechanics.

## Core Journey Patterns

### 1. Install-to-First-Purchase Journey
**Trigger Events:** app_installed, tutorial_started, tutorial_completed, first_session, first_iap
**Segments:** New users (0-7 days post-install)

**Journey Stages:**
- Stage 1: Installation completion (0 hours)
- Stage 2: Tutorial progression (0-30 min)
- Stage 3: First session play (30 min - 2 hours)
- Stage 4: Monetization exposure (2-24 hours)
- Stage 5: First IAP conversion (1-7 days)

**Timing Windows:**
- Tutorial encouragement: 0-5 min in-game
- First reward unlock: 15-30 min playtime
- Monetization hint: 45-60 min first session
- First offer presentation: 4-12 hours post-install
- Aggressive IAP offer: 24-48 hours post-install

**Channel Recommendations:**
- In-game messaging (primary): Seamless user experience
- Push notifications: Session reminders (non-intrusive)
- Email: Secondary engagement (tutorial completion confirmation)
- In-app offers: Contextual monetization timing

**Conversion Expectations:**
- Tutorial completion rate: 70-85%
- First session return (D1): 50-65%
- First IAP conversion: 2-5% of D1 users
- Average IAP value (first purchase): $2-5

### 2. Lapsed-to-Reactivation Journey
**Trigger Events:** session_ended, session_gap_7d, session_gap_14d, reactivation_offer_sent
**Segments:** Lapsed users (7-30 days inactive), Dormant users (30+ days inactive)

**Journey Stages:**
- Stage 1: Inactivity detection (7 days without session)
- Stage 2: Reactivation nudge (push notification)
- Stage 3: Incentivized return offer (in-app reward or special event)
- Stage 4: Re-engagement content (new features, events, seasonal content)
- Stage 5: Long-term retention (loyalty rewards integration)

**Timing Windows:**
- First push: Day 7-8 of inactivity
- Second push: Day 14-15 (if no return)
- In-game welcome back offer: Immediate upon return
- Special event or content unlock: Day 1-3 after return
- Loyalty reward introduction: Day 7-14 after re-engagement

**Channel Recommendations:**
- Push notifications (primary): 40% of reactivation strategy
- Email: 35% (narrative-driven content)
- SMS: 15% (high-value users only)
- In-app messaging: 10% (onboarding after return)

**Conversion Expectations:**
- D7 push conversion: 5-8%
- D14 push conversion: 2-4%
- Re-engagement offer acceptance: 15-20%
- Sustained return (7+ day engagement): 30-40%

### 3. Whale-to-VIP-Nurture Journey
**Trigger Events:** iap_threshold_reached, high_session_time, high_social_activity, vip_eligibility
**Segments:** Top spenders (P1 monetization), Super-users (high engagement)

**Journey Stages:**
- Stage 1: VIP identification (spending > $50/month or session > 10 hrs/week)
- Stage 2: VIP benefits introduction (exclusive features, early access)
- Stage 3: Personalized monetization (curated offers, bundled discounts)
- Stage 4: Community engagement (guild leaders, content creators)
- Stage 5: Long-term retention (exclusive events, merchandise)

**Timing Windows:**
- VIP status notification: Immediate upon qualification
- Exclusive offer presentation: Within 24 hours
- Personalized event invitations: Weekly
- Merchandise/physical benefits: Quarterly
- VIP community events: Monthly

**Channel Recommendations:**
- In-game messaging (70%): Seamless VIP experience
- Email (20%): Exclusive content and offers
- SMS (10%): Time-sensitive high-value offers
- Community platforms: Discord, forums for engagement

**Conversion Expectations:**
- VIP tier upgrade: 60-70% of eligible users
- Average spend increase: 2-3x baseline
- Retention improvement: +25-35%
- Lifetime value increase: 3-5x regular users

### 4. Event-to-Participation-to-Social-Share
**Trigger Events:** limited_time_event_start, event_participation, event_reward, achievement_unlock, social_share_prompt
**Event Duration:** Typically 7-30 days

**Journey Stages:**
- Stage 1: Event announcement (48-72 hours before launch)
- Stage 2: Event participation triggers (0-2 days into event)
- Stage 3: Milestone rewards (unlock sequence over event duration)
- Stage 4: Achievement sharing mechanics (built-in social prompts)
- Stage 5: Post-event retention engagement (event replay offers)

**Timing Windows:**
- Pre-event hype: 2-3 days before launch
- Event launch push: Start of event
- Milestone unlocks: 1/4, 1/2, 3/4, full completion points
- Social sharing incentive: After milestone achievement
- Event conclusion reminder: 1-2 days before end
- Post-event offer: Immediately after event conclusion

**Channel Recommendations:**
- In-game notifications (primary): Event progress tracking
- Push notifications: Milestone unlocks and time-sensitive moments
- Social platforms: Facebook, TikTok for organic sharing
- Email: Event recap and replay offers

**Conversion Expectations:**
- Event participation: 40-60% of active users
- Milestone completion: 30-50% of participants
- Social share rate: 15-25%
- Post-event monetization lift: 10-15%

## Data Requirements

**Essential Attributes:**
- user_monetization_profile (lifetime_spend, spend_velocity, iap_frequency)
- engagement_metrics (session_duration, session_frequency, daily_active_days)
- skill_progression (level, achievements, milestones, rank)
- social_activity (guild_membership, friends_count, social_interactions)
- content_preferences (game_modes, character_classes, difficulty_settings)
- device_information (device_type, os_version, memory, connection_type)
- churn_risk_score (predictive model output)

**Event Tracking:**
- app_installed, tutorial_started, tutorial_completed
- session_started, session_ended, session_time
- level_up, achievement_unlocked, milestone_reached
- iap_displayed, iap_purchased, iap_abandoned
- social_invite_sent, friend_added, guild_joined
- event_started, event_participation, event_completed

## Key Performance Indicators

- D1, D7, D30 retention rates (target: 40%, 25%, 15%)
- Cost per install (CPI) and payback period
- Average revenue per user (ARPU) by cohort
- Lifetime value to CAC ratio (target: 3:1+)
- Event participation rate (target: 40-60%)
- Social sharing coefficient (k-factor)
- Churn rate by engagement segment
- Session length and frequency trends

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to understand gaming event taxonomy
- Use `feature_analysis` to score spending trajectories and churn risk
- Use `time_travel` to analyze session timing patterns and engagement velocity
- Use `get_available_event_types` to discover event-specific tracking

**Testing Framework:**
- A/B test monetization timing (early vs delayed)
- Push notification cadence optimization (daily vs weekly)
- Offer personalization by spending segment
- Event content difficulty balancing

**Cohort Analysis:**
- Compare D1-D30 progression by install source
- Analyze monetization by device type
- Track VIP conversion by user segment
- Monitor event participation by geography

