# Generic Subscription Churn Detection Guide

## Overview
This guide covers universal subscription churn patterns applicable across SaaS, D2C (Direct-to-Consumer), and generic subscription businesses. Includes core metrics, intervention strategies, and implementation guidance using CDP tools.

## Universal Churn Signals

### Engagement Indicators
- **Login Frequency Decline**: Days between logins increasing beyond baseline
- **Feature Usage Narrowing**: Using only subset of available features
- **Session Duration**: Decreasing time spent in product per session
- **Support Ticket Pattern**: Shifting from feature questions to billing/cancellation
- **Onboarding Incomplete**: Key steps not completed within expected window
- **Dashboard Visits**: Reduced dashboard/reporting access frequency

### Behavioral Red Flags
- **Account Underutilization**: Usage significantly below subscription tier capabilities
- **Trial-to-Paid Failure**: Trial users not converting or converting then churning quickly
- **Billing-Related Friction**: Payment failures, declined cards, billing inquiries
- **Plan Downgrade**: Clear intent signal (moving to lower tier)
- **Explicit Cancellation Signals**: Support tickets requesting cancellation details
- **Free Plan Migration**: Downgrading from paid to free tier (temporary)

### Product Health Indicators
- **Feature Gap**: Using mostly feature X, not feature Y (product mismatch)
- **Bottleneck Encounters**: Hitting plan limits (API calls, storage, users)
- **Error Rates**: Experiencing product errors/bugs (quality issue)
- **Slow Adoption**: Not leveraging recommended features
- **Integration Non-Usage**: Installed integrations not being used
- **Advanced Feature Bypass**: Avoiding newer complex features

### NPS & Satisfaction Indicators
- **Net Promoter Score Drop**: NPS <0 or declining trend
- **Survey Non-Response**: Users not responding to satisfaction surveys
- **Complaint Escalation**: Escalating support tickets (unresolved issues)
- **Public Sentiment**: Negative social media/review mentions
- **Peer Comparison**: Stating competitors are better
- **Cancellation Reason**: Exit survey indicating specific dissatisfaction

## Feature Analysis Metrics

### Essential Metrics (basic)
```
Columns to analyze:
- last_login_days_ago
- login_frequency_7d
- session_count_monthly
- average_session_duration
- features_used_count
- api_calls_monthly
- support_tickets_open
- nps_score
- plan_tier
- days_since_onboarding_complete
- plan_change_requested
- payment_failure_count
```

Metric types: ["basic", "statistical", "quality"]

### Statistical Distribution Analysis
- Login frequency distribution by cohort
- Session duration percentiles (10, 50, 90)
- Feature adoption distribution
- API usage distribution per plan tier

### Data Quality Metrics
- NPS data completeness
- Last login timestamp freshness
- Payment data synchronization
- Support ticket categorization consistency

## Universal Subscription Churn Windows

### Early Detection (60-90 Days Before Churn)
**Characteristics:**
- Subtle engagement shifts
- User may be evaluating options
- Prevention most cost-effective

**Key Signals:**
- Login frequency declining gradually
- Session duration shortening
- Feature usage narrowing
- NPS score drifting downward
- No support tickets yet

**Metrics to Track:**
- Engagement score (custom composite)
- Feature adoption rate
- NPS trend
- Session consistency

**Typical Actions:**
- Product education outreach
- Feature recommendations
- Exclusive feature access
- Success stories/use cases

### Medium Risk (30-60 Days Before Churn)
**Characteristics:**
- Clear disengagement pattern
- Possible active evaluation of alternatives
- Intervention success moderate

**Key Signals:**
- Login frequency significantly below baseline
- Support tickets about billing/features
- Plan downgrade inquiry OR payment failure
- NPS score <50
- Error tickets increasing

**Metrics to Track:**
- Engagement score in "yellow" zone
- Support ticket category shift
- Payment health indicators
- Feature usage vs plan tier

**Typical Actions:**
- Product optimization consultation
- Discounted renewal offer
- Flexible plan change
- Executive/CSM outreach
- Exclusive customer roundtable

### Critical Risk (0-30 Days Before Churn)
**Characteristics:**
- Explicit churn intent signals
- Minimal intervention success expected
- Focus on partial retention (downgrade vs loss)

**Key Signals:**
- Explicit cancellation request
- Zero logins for 14+ days
- Failed payment with no retry
- "Plan cancellation" support ticket
- Account suspension warning issued

**Metrics to Track:**
- Cancellation request timestamp
- Last login date
- Payment status
- Account status flags

**Typical Actions:**
- Direct executive outreach
- Significant discount offer (40-60%)
- Down-tier incentive offer
- Win-back campaign post-cancellation

## Engagement Scoring Framework

### Score Components (0-100 Total)

**Login Frequency (30 points)**
- Current frequency vs 90-day baseline
- >80% of baseline = 30 points
- Linear decay below threshold
- Zero logins = 0 points

**Session Duration (25 points)**
- Current average vs 90-day average
- >75% of baseline = 25 points
- Minimum viable session: 2 minutes
- Consistent short sessions = warning sign

**Feature Diversity (25 points)**
- Number of features actively used
- All available features = 25 points
- <50% feature usage = 12 points
- Single feature usage = 5 points

**Support Ticket Health (15 points)**
- Ticket volume and category
- 0 open tickets = 15 points
- Escalated tickets = 5 points
- Billing/cancellation tickets = 0 points

**Payment Health (5 points)**
- Payment success rate
- No failures in 90 days = 5 points
- Any recent failure = 0 points

### Engagement Score Zones
- **Green (75-100)**: Healthy, low churn risk
- **Yellow (50-74)**: At-risk, intervention warranted
- **Red (0-49)**: Critical, immediate action needed

## Time_Travel CDF Configuration

### Setting Up Change Detection
- Starting timestamp: 90 days ago
- Ending timestamp: current date
- Columns: [last_login_days_ago, login_frequency_7d, features_used_count, plan_tier, nps_score, payment_failure_count]
- Change types: [update_postimage] for metric changes
- Include statistics: true
- Metrics: ["basic", "statistical"]

### Key Pattern Detection
- Consistent login frequency decline week-over-week
- Features_used_count dropping (narrowing)
- NPS score trending down
- Payment_failure_count increasing
- Plan tier changes indicating downgrades

## Segmentation Approach

### By Customer Value (LTV)
- **Enterprise**: $50K+ ARR, strategic importance
- **Mid-Market**: $10K-50K ARR, growth potential
- **SMB**: $1K-10K ARR, self-service
- **Startup**: <$1K ARR, high-risk high-upside

### By Usage Pattern
- **Power Users**: 5+ logins/week, 10+ features used
- **Regular Users**: 2-4 logins/week, 5-9 features used
- **Casual Users**: <2 logins/week, <5 features used
- **Inactive**: Minimal to zero engagement

### By Product Fit
- **Product-Market Fit**: Engaged, regular logins, NPS >50
- **Moderate Fit**: Irregular engagement, NPS 0-50
- **Poor Fit**: Minimal engagement, NPS <0 or no data
- **Mismatch**: Using lower features, need different plan

## Intervention Strategy by Segment

### Enterprise At-Risk
- C-level business review
- Executive relationship manager assignment
- Custom feature development/roadmap
- Loyalty discount (modest, 10-20%)

### Mid-Market At-Risk
- Account manager outreach
- Product optimization session
- Feature training/webinar
- Retention discount (20-40%)

### SMB At-Risk
- Automated email outreach
- In-app nudges and tips
- Self-serve training resources
- Self-serve discount offer (portal)

### Startup At-Risk
- Community engagement
- Feature request implementation
- Referral incentive program
- Free tier value maximization

## Expected Metrics & Benchmarks

- Early window prediction accuracy: 70-75%
- Medium window prediction accuracy: 80-85%
- Critical window prediction accuracy: 92-96%
- Engagement score stability: >90% month-over-month correlation
- Typical retention improvement from interventions: 20-30%
- False positive rate: <10%

## SaaS-Specific Considerations

### Free-to-Paid Conversion
- Trial period performance predictor of retention
- Feature usage during trial highly predictive
- Onboarding completion rate critical
- Early friction is biggest churn driver

### API Usage Patterns
- API call volume often mirrors feature engagement
- Rate limit approaching = growth signal
- API error rates indicate integration issues
- Webhook failures indicate integration abandonment

### Multi-tenant Scenarios
- Admin engagement more predictive than user count
- Administrator permission changes may indicate internal churn
- Seat utilization important (unused seats = risk)

## D2C Subscription-Specific Considerations

### Repeat Purchase Patterns
- Purchase frequency baseline critical
- Skipped shipments are early warning
- Address/payment updates indicate retention intent
- Customer service contacts about product quality

### Seasonality
- Fitness subscriptions: Jan spike, April decline
- Beauty boxes: Holiday heavy, summer light
- Meal kits: January/February commitment, summer vacation drops

## Implementation Checklist

- [ ] Define engagement score formula and weights
- [ ] Establish baseline metrics by segment
- [ ] Set alert thresholds for each risk level
- [ ] Configure time_travel CDF extraction
- [ ] Build engagement dashboards
- [ ] Create segment-specific playbooks
- [ ] Set up automated alerts for critical signals
- [ ] Design A/B tests for intervention offers
- [ ] Implement win-back campaign structure
- [ ] Monitor engagement metrics weekly
- [ ] Quarterly churn model refresh
- [ ] Track intervention ROI by segment
