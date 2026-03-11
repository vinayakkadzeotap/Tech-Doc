# Media & Streaming Churn Detection Guide

## Overview
Media and streaming services face unique churn patterns based on content consumption behavior, subscriber tier engagement, and seasonal viewing cycles. This guide identifies early warning signals and provides engagement scoring methodology.

## Primary Churn Signals

### Content Consumption Indicators
- **Viewing Hours Decline**: >40% decrease from 30-day rolling average
- **Session Frequency Drop**: Weekly sessions fall below historical minimum baseline
- **Content Diversity Narrowing**: Genre variety decreasing (fewer categories accessed)
- **Completion Rate Drop**: Ratio of started vs completed content declining
- **Skip Behavior Change**: Increasing skip rates on ads or introductions
- **Browse-to-Watch Ratio**: More browsing, less actual watching

### Subscription Tier Signals
- **Premium-to-Basic Downgrade**: Clear churn precursor
- **Plan Investigation Activity**: Frequent plan-comparison page visits
- **Payment Friction**: Failed payment attempts, card expiration approaching
- **Reduced Feature Usage**: Premium features unused (offline downloads, simultaneous streams)
- **Device Reduction**: Fewer active streaming devices

### Engagement Quality Metrics
- **Social Sharing Decline**: Decreased sharing of watched content
- **Watchlist Abandonment**: Items added but never watched
- **Search Behavior Change**: Reduced active content search, increased browsing
- **Binge Pattern Loss**: Users no longer engaging in extended sessions
- **Profile Activity**: Secondary user profiles becoming inactive

### Login & Access Patterns
- **Login Frequency Decrease**: Days between logins increasing
- **Time-of-Day Shift**: Streaming patterns changing significantly
- **Platform Shift**: Moving away from primary platform
- **Off-Network Access**: Reduced usage of mobile/travel devices
- **Post-Login Abandonment**: Logging in but not watching

## Engagement Scoring Methodology

### Scoring Framework (0-100 Scale)

**Components:**
1. **Viewing Hours (30 points)**
   - Current month vs 3-month average
   - Threshold: >50% of average = 30 points
   - Linear decay below threshold
   - 0 hours = 0 points

2. **Session Frequency (25 points)**
   - Sessions per week metric
   - Historical baseline establishment (90-day)
   - Current week vs baseline
   - Threshold: >75% of baseline = 25 points

3. **Content Diversity (20 points)**
   - Unique genres accessed per month
   - Genre breadth score
   - Threshold: >3 genres = 20 points
   - Lower diversity = lower score

4. **Tier Utilization (15 points)**
   - Premium feature usage for paid tiers
   - Multi-device activation
   - Offline download usage
   - Simultaneous stream usage
   - Each feature = 3.75 points

5. **Completion Rate (10 points)**
   - Completed / Started content ratio
   - Threshold: >50% completion = 10 points
   - Rapid drop indicator of content mismatch

### Engagement Score Thresholds

- **Green (70-100)**: Healthy engagement, retention high
- **Yellow (40-69)**: At-risk, intervention possible
- **Red (0-39)**: Critical churn risk, immediate action needed

### Feature Analysis Metrics

Use feature_analysis tool with metric_types: ["basic", "statistical", "quality"]

**Essential Columns to Analyze:**
- viewing_hours_30d
- session_count_weekly
- genre_count_monthly
- content_completion_rate
- premium_feature_usage
- last_login_days_ago
- plan_tier
- subscriber_tenure

## Churn Detection Windows

### Early Warning (45+ Days)
**Indicators:**
- Engagement score decline from Green to Yellow
- Session frequency dropping but not critically
- Content diversity narrowing gradually
- No plan downgrade requests yet

**Key Metrics:**
- Engagement score trending down week-over-week
- Session consistency metric
- Genre exploration patterns

**Actions:**
- Personalized content recommendations (low-friction)
- "New release" notifications for preferred genres
- Introduce new features user hasn't tried

### Active Risk (14-44 Days)
**Indicators:**
- Engagement score in Yellow or Red zone
- Viewing hours significantly below baseline
- Plan downgrade inquiries OR failed payments
- Reduced premium feature usage

**Key Metrics:**
- Engagement score <50
- Viewing hours <40% of average
- Plan tier review activity

**Actions:**
- Discount offer on plan tier
- "We miss you" personalized campaigns
- Exclusive content preview based on interests
- Payment issue resolution

### Critical (0-13 Days)
**Indicators:**
- Explicit cancellation request
- Complete inactivity (zero logins)
- Failed payment with no retry
- Account in suspended state

**Key Metrics:**
- Cancellation request received
- Last login >30 days ago
- Engagement score <20

**Actions:**
- Direct outreach with retention offer
- Account reactivation incentive
- Downgrade option presentation
- Win-back campaign post-cancellation

## Time_Travel CDF Analysis

### Tracking Changes in Engagement
Configure time_travel with:
- Starting timestamp: 90 days ago
- Ending timestamp: current date
- Columns: [viewing_hours, session_count, genre_count, content_completion_rate, plan_tier, last_login]
- Change types: [update_postimage] for engagement metric changes
- Include statistics: true

### Key Change Patterns to Detect
- Rapid drops in viewing_hours (>40% decline)
- Multiple consecutive plan_tier downgrades
- Extended last_login gaps expanding
- Genre_count consistent decrease

## Churn by Content Type

### Linear/Traditional Subscribers
- Focus: Appointment viewing (news, sports)
- Churn signal: Missing regular show days
- Window: Short (14-21 days)

### Binge-Watchers
- Focus: Series completion
- Churn signal: Series completion without new binges starting
- Window: Medium (30 days)

### Casual/Social Viewers
- Focus: Shared experiences
- Churn signal: Social sharing decline
- Window: Long (45+ days)

## Seasonal Considerations

### Peak Seasons (Dec-Jan, Summer)
- Baseline engagement naturally higher
- Churn risk lower
- Watch for users staying at lower baselines

### Off-Seasons
- Lower baseline engagement expected
- Adjust thresholds by 20%
- Focus on consistency rather than absolute numbers

## Segmentation Approach

### Tier-Based Segmentation

**Premium Subscribers:**
- Higher expected engagement
- Multi-device usage
- Priority retention (highest CLV)

**Standard Subscribers:**
- Core content consumers
- Single device primary
- Reliable revenue, moderate churn risk

**Basic/Ad-Supported:**
- Price-sensitive
- Lower engagement often acceptable
- High churn volume, lower impact

### Behavior-Based Segmentation

**Content Enthusiasts:**
- Consistent engagement
- Diverse genre consumption
- Respond to exclusive content

**Casual Viewers:**
- Episodic engagement
- Single genre preference
- Respond to social features

**Inactive Users:**
- Low engagement from signup
- May never have been fit
- Different intervention strategy

## Expected Accuracy & Lift

- Early window prediction accuracy: 70-75%
- Active risk window accuracy: 82-88%
- Critical window accuracy: 95%+
- Typical retention lift from interventions: 15-25%
- False positive rate: <12%

## Integration with CDP Tools

### Query Builder Usage
- Analyze cost of engagement scoring queries
- Model: Analysis queries (not BFML)
- Optimize date window for volume vs freshness

### Schema Discovery
- Profile store: subscriber tier, region, signup date
- Event store: viewing events, payment events
- Calculated attributes: engagement_score, ltv_segment

## Implementation Checklist

- [ ] Define engagement scoring formula
- [ ] Set baseline calculations per user cohort
- [ ] Establish scoring refresh frequency
- [ ] Configure time_travel for CDF tracking
- [ ] Build engagement segment dashboards
- [ ] Create intervention playbooks by risk level
- [ ] Test on pilot user groups
- [ ] Measure offer response rates
- [ ] Monitor unsubscribe reasons
- [ ] Iterate scoring weights quarterly
