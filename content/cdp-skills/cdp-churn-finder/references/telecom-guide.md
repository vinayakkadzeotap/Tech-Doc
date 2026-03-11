# Telecom Churn Detection Guide

## Overview
Telecom churn is typically gradual with measurable early warning signals. This guide provides patterns to detect churn across different customer lifecycle stages using time_travel and feature_analysis tools.

## Primary Churn Signals

### Revenue-Based Indicators
- **ARPU Decline**: Monitor >15% Month-over-Month decrease in average revenue per user
- **Plan Downgrade Requests**: Track explicit requests to lower-tier plans
- **Usage-to-Billing Mismatch**: Higher usage with lower billing indicates plan inadequacy
- **Roaming Charges Elimination**: Customers switching off international roaming
- **Add-on Service Cancellation**: Removal of premium services (data boost, entertainment packs)

### Behavioral Indicators
- **Data Usage Drop**: >30% reduction from historical average over 2-week window
- **Call Frequency Decrease**: <50% of typical monthly calls in current month
- **SMS Volume Reduction**: Sharp decline in messaging activity
- **Network Switching**: Detection of competing network SIM activation
- **Login Frequency**: Reduced portal/app access patterns

### Service-Related Indicators
- **Support Ticket Escalation**: Increasing complaint volumes, especially unresolved
- **Complaint Categories**: Billing disputes, service quality, network coverage complaints
- **SIM Inactivity**: Device not registering on network for extended periods
- **Device Non-Upgrade**: Missing scheduled upgrade cycle participation
- **Failed Payment Attempts**: Multiple retry failures on billing

## Churn Detection Windows

### Early Detection Window (60+ Days Before Churn)
**Characteristics:**
- Subtle pattern changes rather than dramatic drops
- User still engaged but engagement shifting
- Prevention interventions most cost-effective here

**Key Metrics to Track:**
- ARPU trending: establish 90-day baseline, identify deviations
- Feature usage diversity: are users exploring new features?
- Session patterns: consistency and frequency
- Support interaction tone: satisfaction indicators

**Recommended Actions:**
- Win-back offers on unused features
- Network quality improvements
- Product recommendations

### Medium-Risk Window (30 Days Before Churn)
**Characteristics:**
- Clearer behavioral shifts become visible
- Users actively evaluating alternatives
- Intervention success rate drops significantly

**Key Metrics to Track:**
- Usage volume thresholds breached
- Plan tier assessment (insufficient for needs)
- Competitor signal detection
- Payment friction indicators

**Recommended Actions:**
- Targeted retention offers
- Premium feature trials
- Loyalty rewards acceleration

### Critical Window (<14 Days Before Churn)
**Characteristics:**
- Explicit churn signals present (cancellation requests, device inactivity)
- Success rate minimal but still worth attempting
- Focus shifts to save/save-as-downgrade

**Key Metrics to Track:**
- Explicit cancellation signals
- Complete inactivity (zero usage)
- Final payment status
- Customer service interactions

**Recommended Actions:**
- Immediate retention offers
- White-glove service outreach
- Flexible downgrade options

## Time_Travel Analysis Patterns

### Setting Up Change Data Feed (CDF) Tracking
Use time_travel tool with these date windows:
- **Baseline Period**: 90 days of historical data
- **Observation Window**: Current month + 2 weeks forward
- **Change Metrics**: Focus on decrease_postimage changes in usage fields

### Key Fields to Monitor
```
- monthly_arpu
- data_usage_gb
- voice_minutes
- sms_count
- support_tickets
- last_login_date
- active_days_count
- plan_tier_changes
```

### CDF Query Example
- Starting timestamp: 90 days ago
- Ending timestamp: Current date
- Change types: [update_postimage, delete] for cancellations
- Include statistics: true
- Columns: [monthly_arpu, data_usage_gb, voice_minutes, plan_tier]

## Feature Analysis Metrics

### Essential Metrics (basic)
- Fill rate for each signal dimension
- Distinct count of plan tiers per customer
- Data type validation for numeric fields

### Statistical Metrics
- ARPU percentiles (10th, 50th, 90th)
- Data usage distribution
- Call frequency distribution
- Support ticket frequency distribution

### Quality Metrics
- Missing value patterns in usage data
- Outlier detection in spending
- Consistency of timestamps

## Segmentation Approach

### High-Value Churn
- ARPU > 75th percentile + recent decline
- Long tenure (>24 months)
- Enterprise/business plans

### Volume Churn
- Mid-tier plans + consistent base
- Frequent feature users
- Community-engaged customers

### Low-Value Churn
- ARPU < 25th percentile
- Minimal usage
- Often replaced profitably by new customers

## Prevention Strategy by Segment

**High-Value:**
- Executive outreach
- Custom plan creation
- Priority network improvements

**Volume:**
- Feature education campaigns
- Community programs
- Loyalty incentives

**Low-Value:**
- Self-serve digital campaigns
- Lightweight offers
- Accept some churn

## Expected Accuracy Metrics

- Early window detection accuracy: 65-75%
- Medium window detection accuracy: 80-85%
- Critical window detection accuracy: 90%+
- False positive rate target: <15%

## Integration with CDP Tools

### Query Builder for Cost Analysis
- Estimate cost of CDF analysis on large customer bases
- Model_type: Not applicable (analysis query, not BFML)
- Optimize window sizes for cost-performance balance

### Schema Discovery
- Profile store: customer demographics, tenure, tier
- Event store: usage events, support interactions
- Calculated attributes: ARPU, engagement score

## Implementation Checklist

- [ ] Define ARPU baseline calculation logic
- [ ] Set up automated data quality checks
- [ ] Configure time_travel CDF extraction schedule
- [ ] Test feature_analysis on pilot segments
- [ ] Establish intervention playbook by window
- [ ] Monitor false positive/negative rates
- [ ] Validate churn predictions against actual churn
