# Telecom Journey Recommender Guide

## Overview
Industry-specific journey templates for telecommunications, focusing on service activation, plan optimization, retention, and upgrade mechanics.

## Core Journey Patterns

### 1. Signup-to-Activation-Optimization
**Trigger Events:** signup_complete, sim_activated, first_call, first_data_usage, plan_optimization_eligible
**Journey Duration:** 0-90 days

**Journey Stages:**
- Stage 1: Signup completion (0 hours)
- Stage 2: SIM activation confirmation (0-24 hours)
- Stage 3: First service usage (0-7 days)
- Stage 4: Data usage monitoring (7-30 days)
- Stage 5: Plan optimization offer (30-90 days)

**Timing Windows:**
- Welcome SMS: 0-5 min post-signup
- SIM activation reminder: 2-4 hours post-shipment
- First usage acknowledgment: 0-15 min after first call
- Data consumption update: Weekly for first month
- Plan optimization offer: 30-45 days post-activation

**Channel Recommendations:**
- SMS (primary): Highest engagement (95%+ open rate)
- IVR (interactive voice response): Activation confirmations
- Email: Secondary for detailed plan information
- In-app messaging: Plan changes and recommendations
- WhatsApp: Customer service and support

**Conversion Expectations:**
- SIM activation within 7 days: 85-90%
- First usage within 7 days: 75-85%
- Data plan upgrade rate: 20-30%
- Plan optimization acceptance: 35-45%

### 2. Contract-Near-Expiry-Retention
**Trigger Events:** contract_expiry_90d, contract_expiry_30d, contract_expiry_7d, renewal_offer_sent
**Segments:** Mid-contract and near-expiry customers

**Journey Stages:**
- Stage 1: Early notification (90 days before expiry)
- Stage 2: Retention offer introduction (60 days before expiry)
- Stage 3: Aggressive retention push (30 days before expiry)
- Stage 4: Final win-back offer (7 days before expiry)
- Stage 5: Churn recovery (post-expiry, if customer leaves)

**Timing Windows:**
- 90-day advance notice: Email + SMS
- 60-day retention offer: Personalized offer via SMS + email
- 30-day reminder: Push notification + in-app message
- 7-day final offer: SMS + phone call (high-value customers)
- Churn recovery: Day 1, Day 7 post-churn

**Channel Recommendations:**
- SMS (40%): Time-sensitive renewal offers
- Email (30%): Detailed plan comparisons and benefits
- Phone call (15%): High-value customer outreach
- In-app messaging (10%): Seamless renewal process
- WhatsApp (5%): Customer preference option

**Conversion Expectations:**
- Renewal rate at 90-day window: 35-45%
- Renewal rate at 30-day window: 50-60%
- Retention at 7-day window: 65-75%
- Win-back post-churn: 10-15%

### 3. Data-Heavy-to-Unlimited-Upsell
**Trigger Events:** high_data_usage, data_warning_sent, overage_charge, unlimited_plan_eligible
**Usage Threshold:** 70%+ of monthly data allocation

**Journey Stages:**
- Stage 1: High usage detection (real-time, upon 70% threshold)
- Stage 2: Overage warning notification (80% threshold)
- Stage 3: Unlimited plan introduction (85% threshold)
- Stage 4: Cost savings presentation (upon overage charge)
- Stage 5: Upgrade offer (within 24 hours of overage)

**Timing Windows:**
- 70% warning: SMS notification
- 85% critical alert: SMS + push notification
- Overage acknowledgment: Immediate upon charge
- Unlimited offer: Within 2 hours of overage
- Follow-up offer: 24 hours later (if no upgrade)

**Channel Recommendations:**
- SMS (primary): Real-time usage alerts
- In-app messaging: Contextualized upgrade prompts
- Email: Detailed savings comparison
- Push notifications: Urgent alerts
- IVR: Self-service upgrade option

**Conversion Expectations:**
- Warning acknowledgment: 60-70%
- Overage prevention upgrade: 25-35%
- Unlimited plan adoption: 40-50%
- Average plan value increase: 15-20%

### 4. Device-Aging-to-Upgrade-Purchase
**Trigger Events:** device_age_24m, device_age_36m, device_battery_degradation, device_trade_in_eligible
**Device Age Trigger:** 24+ months for primary device

**Journey Stages:**
- Stage 1: Device aging detection (24 months)
- Stage 2: Upgrade availability notification (month 24)
- Stage 3: Trade-in offer introduction (month 25-26)
- Stage 4: Financing options presentation (month 26-28)
- Stage 5: Exclusive upgrade deal (month 28-30)

**Timing Windows:**
- Upgrade notification: Month 24
- Trade-in offer: Week 1 of month 25
- Financing details: Week 2 of month 25
- Limited-time offer: Month 27-28
- Final push: Month 29-30

**Channel Recommendations:**
- Email (40%): Detailed upgrade options and trade-in value
- SMS (30%): Offer alerts and deadlines
- In-app messaging (15%): Seamless upgrade process
- Retail store: Physical experience (10%)
- Push notifications (5%): Reminder notifications

**Conversion Expectations:**
- Upgrade consideration rate: 45-55%
- Trade-in acceptance: 60-70% of upgraders
- Device purchase completion: 35-45%
- Financing plan adoption: 55-65%

## Data Requirements

**Essential Attributes:**
- service_profile (plan_type, monthly_spend, contract_duration, renewal_date)
- usage_metrics (voice_minutes, sms_count, data_usage, roaming_usage)
- device_information (device_type, device_age, os_version, battery_health)
- payment_history (on_time_payment_rate, invoice_disputes, credit_risk)
- engagement_metrics (customer_care_contacts, plan_changes_frequency)
- churn_risk_score (predictive churn probability)
- segment_membership (value_tier, loyalty_status, vip_status)

**Event Tracking:**
- signup_complete, sim_activated, first_usage
- plan_changed, plan_upgraded, plan_downgraded
- overage_charge, payment_received, payment_failed
- customer_care_contact, complaint_filed, complaint_resolved
- device_changed, trade_in_initiated, trade_in_completed
- contract_renewed, contract_expired, churn_initiated

## Key Performance Indicators

- Customer acquisition cost (CAC) and payback period
- Contract renewal rate (target: 70-80%)
- Churn rate by segment (target: <5% monthly)
- Average revenue per user (ARPU) growth (target: 3-5% annually)
- Upgrade rate (target: 45-55%)
- Upsell success rate (target: 25-35%)
- Customer lifetime value (CLV) by segment
- NPS and customer satisfaction scores

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map telecom service events and billing data
- Use `feature_analysis` to calculate data appetite and upgrade readiness scores
- Use `time_travel` to track usage patterns and contract milestone timing
- Use `get_detailed_events` to analyze overage behavior and upgrade triggers

**Testing Framework:**
- A/B test offer timing (30-day vs 7-day windows)
- Test offer value (discount % vs service upgrades)
- Segment personalization by device type and usage pattern
- Channel optimization (SMS vs email vs push priority)

**Churn Prevention:**
- Monitor contract renewal intent 90 days out
- Track competitor offer response patterns
- Optimize retention offers based on customer lifetime value
- Implement proactive service quality improvements

