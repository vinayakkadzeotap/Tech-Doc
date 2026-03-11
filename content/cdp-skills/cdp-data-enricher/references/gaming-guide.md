# Gaming Data Enricher Guide

## Overview
Enrichment playbook for gaming and interactive entertainment, emphasizing engagement velocity, monetization trajectory, and churn predictors.

## Core Enrichment Attributes

### 1. Player Skill Tier Classification

**Definition:** Hierarchical player capability level based on performance metrics
**Tiers:** Beginner (0-10 hrs), Intermediate (10-50 hrs), Advanced (50-200 hrs), Expert (200+ hrs), Legendary (top 1%)

**Metrics to Calculate:**
- Total playtime (sum of session durations)
- Level/progression (game-specific rank or level)
- Win rate (battles won / battles played)
- Achievement completion rate (achievements earned / available)
- PvP ranking (competitive ladder position if applicable)
- Skill progression velocity (rate of leveling/ranking)

**Calculation Method:**
- Combine playtime (40%) + progression level (30%) + achievement rate (20%) + win rate (10%)
- Normalize to 1-10 scale
- Update weekly or with significant achievement unlocks

**Data Sources:**
- Session duration tracking
- Achievement and milestone events
- Competitive ranking data
- use `feature_analysis` to compute skill percentiles

**Enrichment Output:**
- Player skill tier (1-5 classification)
- Skill percentile (1-100)
- Skill progression trend (improving/declining)
- Skill tier recommendation for matchmaking

### 2. Engagement Velocity Score

**Definition:** Rate and acceleration of player engagement over time
**Measurement Period:** Last 30/60/90 days

**Metrics to Calculate:**
- Weekly active days (0-7 scale)
- Average session frequency (sessions per week)
- Average session duration (minutes per session)
- Engagement trend (accelerating/stable/declining)
- Engagement volatility (consistent vs sporadic play)
- Peak engagement hours (time-of-day pattern)

**Velocity Scoring:**
- Base engagement score: 1-5 (5 = 5+ sessions/week, 60+ min/day)
- Acceleration factor: +1 if trend improving, -1 if declining
- Final velocity score: 1-5 scale

**Data Sources:**
- Session event logs with timestamps
- Login frequency tracking
- Session duration measurements
- Use `time_travel` to analyze 30/60/90-day trends

**Enrichment Output:**
- Current engagement velocity (1-5)
- Velocity trend direction (up/stable/down)
- Projected 30-day engagement level
- Reactivation priority score for lapsed users

### 3. Spending Trajectory Analysis

**Definition:** Historical and projected spending patterns and monetization readiness
**Measurement:** Lifetime spending, monthly recurring, free-to-pay conversion

**Metrics to Calculate:**
- Lifetime spending (LTV) total
- Monthly recurring revenue (MRR) average
- Spend per session (average $)
- Spend acceleration (trend increasing/decreasing)
- Purchase frequency (buys per month)
- Average transaction value (ATV)
- Days to first purchase (speed to monetization)
- Spending consistency (regular vs sporadic payer)

**Trajectory Classification:**
- Non-payer: $0 lifetime
- Low spender: $1-20 lifetime
- Medium spender: $20-100 lifetime
- High spender: $100-500 lifetime
- Whale: $500+ lifetime

**Spending Velocity:**
- Stable: Month-to-month variation < 20%
- Growing: Spending increasing month-over-month
- Declining: Spending decreasing over 2+ months

**Data Sources:**
- In-app purchase (IAP) transaction data
- Payment history
- Monetization event logs
- Use `feature_analysis` for spending percentile analysis

**Enrichment Output:**
- Spending tier (non-payer/low/medium/high/whale)
- Spending velocity (stable/growing/declining)
- Lifetime value projection (12-month forecast)
- Monetization readiness score (1-5)
- Churn risk if spending drops (yes/no flag)

### 4. Social Influence Score

**Definition:** Player network size and ability to influence other players
**Metrics to Calculate:**
- Friend count (direct connections)
- Guild/clan membership (group affiliation)
- Guild leadership role (officer/leader flag)
- Social activity (messages sent, interactions)
- Referral success (players referred who became active)
- Content sharing (social shares of gameplay)
- Streaming presence (YouTube/Twitch followers if tracked)

**Influence Calculation:**
- Network size (friends + guild members, capped at 500, 0-2 pts)
- Leadership role (0-1 pts if leader/officer)
- Referral success (0-2 pts based on conversion rate)
- Social activity (0-1 pts if high interaction)
- Final score: 1-5 scale (normalized)

**Data Sources:**
- Social graph data (friends, follows, guilds)
- Social interaction event logs
- Referral tracking (attribution)
- use `schema_discovery` to map social event structure

**Enrichment Output:**
- Social influence tier (low/medium/high/influencer)
- Network size (friend count, guild size)
- Leadership status (yes/no flag)
- Referral attribution potential (high/medium/low)
- Ambassador/advocate eligibility (yes/no)

### 5. Content Preference Matrix

**Definition:** Affinity across game modes, characters, genres, and content types
**Content Dimensions:** PvP vs PvE, raid vs solo, casual vs competitive, story-driven vs arcade

**Metrics to Calculate:**
- Content mode distribution (% of playtime per mode)
- Preferred content type (primary mode)
- Secondary preferences (2-3 content types played)
- Content switching frequency (changes per month)
- New content adoption (tries new mode/feature)
- Content difficulty preference (easy/normal/hard/impossible)

**Matrix Calculation:**
- Calculate playtime distribution across 5-8 major content categories
- Identify primary (>50% of playtime) and secondary (10-50%)
- Minority interests (<10%)
- Recommend content personalization based on top 2-3 affinities

**Data Sources:**
- Game mode/content type tagging in events
- Session/activity classification
- Leaderboard or performance data by mode
- Use `time_travel` to track content preference evolution

**Enrichment Output:**
- Primary content affinity (mode name + %)
- Secondary affinities (list with %s)
- Content preference stability (changes per month)
- New content discovery propensity (yes/no)
- Personalized content recommendation engine input

### 6. Session Pattern Clustering

**Definition:** Temporal and behavioral session patterns for engagement optimization
**Patterns:** Daily players, weekly dedicated, weekend warriors, binge players, casual

**Metrics to Calculate:**
- Session frequency (daily/weekly/monthly rate)
- Ideal session timing (time-of-day peak)
- Session duration average (minutes per session)
- Session consistency (standard deviation)
- Binge pattern detection (3+ hours in single session)
- Weekend vs weekday split (%)
- Timezone (inferred from session timestamps)

**Pattern Classification:**
- Daily players: 5+ sessions/week, <1 hour per session
- Dedicated weekly: 2-4 sessions/week, 1-2 hours per session
- Weekend warriors: 2-3 sessions/week, mostly weekends
- Binge players: 1-2 sessions/week, 3+ hours per session
- Casual: <1 session/week, 30-60 min per session

**Data Sources:**
- Session event logs with timestamps
- Session duration tracking
- Login frequency data
- use `query_builder` for timestamp analysis

**Enrichment Output:**
- Session pattern cluster (category)
- Optimal push notification timing
- Optimal engagement window (2-hour window)
- Timezone classification (inferred)
- Server region recommendation

### 7. Churn Risk Score

**Definition:** Propensity to become inactive or uninstall
**Measurement:** Behavioral indicators predicting 7/14/30-day churn

**Metrics to Calculate:**
- Days since last session (0-365 scale)
- Session frequency decline (trend)
- Engagement drop indicator (drop >50% vs baseline)
- Spending decline (if applicable)
- Negative feedback (support complaints, low ratings)
- Loss events (death streaks, loss of status)
- Content exhaustion (completed all available content)

**Churn Risk Scoring (1-5 scale):**
- 1 (Low risk): Active in last 7 days, stable/increasing engagement
- 2 (Low-medium): Active in last 14 days, slight decline
- 3 (Medium): Inactive 14-30 days, engagement declining
- 4 (High): Inactive 30+ days, significant engagement drop
- 5 (Critical): Inactive 60+ days or negative sentiment indicators

**Data Sources:**
- Session and login tracking
- Engagement event logs
- Spending data
- Support/feedback sentiment
- use `feature_analysis` for churn risk percentiles

**Enrichment Output:**
- Churn risk score (1-5)
- Churn probability estimate (%)
- Days to predicted churn (estimated)
- Churn prevention strategy (reactivation offer type)
- Win-back offer recommendation

### 8. Monetization Readiness Score

**Definition:** Likelihood to convert to paying or increase spending
**Readiness Factors:** Playtime, engagement, skill, willingness, spending capacity

**Metrics to Calculate:**
- Playtime threshold (minimum engagement level)
- Progression level (achieved meaningful progression)
- Engagement intensity (session frequency and duration)
- First purchase propensity (if non-payer)
- Spending increase propensity (if payer)
- Offer receptiveness (past offer acceptance rate)
- Premium feature interest (feature interaction patterns)

**Readiness Scoring:**
- Non-payers (playtime 10+ hrs, level 10+, engaged): +2 pts
- Payers with growth potential (stable engagement, low spend): +1 pt
- High-engagement power users (any tier): +1 pt
- Low engagement or declining: -1 pt
- Final readiness score: 1-5 scale

**Data Sources:**
- Session and progression data
- Payment history
- Feature usage tracking
- Offer history and acceptance rates
- use `query_builder` for monetization ROI analysis

**Enrichment Output:**
- Monetization readiness tier (low/medium/high)
- Recommended offer type (first IAP/bundle/battle pass)
- Optimal offer price point ($)
- Offer presentation timing
- Expected ARPU increase if successful

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 90% for core engagement metrics
- Timeliness: Update daily for engagement, weekly for churn
- Accuracy: Validate session durations against server logs
- Consistency: Cross-check spending against payment records

**MCP Tools Integration:**
- Use `schema_discovery` to map gaming event taxonomy
- Use `feature_analysis` to compute skill and spending percentiles
- Use `time_travel` to analyze trend acceleration patterns
- Use `get_available_event_types` to discover event types for classification

**Enrichment Frequency:**
- Engagement velocity: Daily
- Skill tier: Weekly
- Spending trajectory: Daily
- Social influence: Weekly
- Content preferences: Weekly
- Session patterns: Daily
- Churn risk: Daily
- Monetization readiness: Daily

**Output Storage:**
- Store enriched attributes in player_360 table
- Create daily snapshot for time-series analysis
- Maintain segment flags for campaigns
- Archive scoring history for model training

