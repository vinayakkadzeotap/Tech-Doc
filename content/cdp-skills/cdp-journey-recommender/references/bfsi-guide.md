# BFSI Journey Recommender Guide

## Overview
Banking, Financial Services, and Insurance journey templates, emphasizing account activation, cross-sell, compliance, and lifecycle progression.

## Core Journey Patterns

### 1. Account-Open-to-Primary-Usage
**Trigger Events:** account_opened, kyc_completed, first_funding, first_transaction, primary_usage_qualified
**Journey Duration:** 0-90 days

**Journey Stages:**
- Stage 1: Account opening (0 hours)
- Stage 2: KYC verification completion (0-24 hours)
- Stage 3: First funding/deposit (1-7 days)
- Stage 4: Primary usage activation (1-30 days)
- Stage 5: Cross-sell eligibility (30-90 days)

**Timing Windows:**
- Welcome communication: 0-5 min post-account opening
- KYC document request: 0-2 hours (if not auto-verified)
- First funding incentive: 2-24 hours post-account
- Account activation confirmation: 1 day post-funding
- Cross-sell offer: 30-45 days post-activation

**Channel Recommendations:**
- Email (primary): Regulatory documentation and disclosures
- SMS (secondary): Transaction alerts and timely offers
- In-app messaging: Account setup guidance and features
- WhatsApp: Support and verification links
- Customer service: High-touch onboarding for wealth segment

**Conversion Expectations:**
- KYC completion within 24 hours: 70-80%
- First funding within 7 days: 65-75%
- Active usage within 30 days: 75-85%
- Cross-sell readiness: 50-60% of active users

### 2. Loan-Inquiry-to-Disbursement Pipeline
**Trigger Events:** loan_inquiry, application_started, application_submitted, credit_decision, approval_granted, disbursement_completed, repayment_started
**Journey Duration:** 7-60 days

**Journey Stages:**
- Stage 1: Inquiry receipt (hour 0)
- Stage 2: Application assistance (days 1-3)
- Stage 3: Documentation submission (days 3-7)
- Stage 4: Credit decision (days 7-14)
- Stage 5: Approval notification (day 14+)
- Stage 6: Disbursement coordination (days 15-30)
- Stage 7: Repayment onboarding (day 30+)

**Timing Windows:**
- Pre-application guidance: 0-2 hours
- Application reminder: 24 hours if abandoned
- Document upload tracking: Daily progress updates
- Credit decision notification: Within 2-4 business days
- Approval celebration: Immediate upon approval
- Disbursement execution: Within 1-5 business days
- Repayment setup reminder: 2-3 days pre-first payment

**Channel Recommendations:**
- Email (40%): Official approvals and documentation
- SMS (35%): Time-sensitive status updates
- In-app messaging (15%): Application status and next steps
- Customer service (5%): High-touch for complex cases
- WhatsApp (5%): Support and verification

**Conversion Expectations:**
- Application completion: 45-55% of inquiries
- Documentation submission: 75-85% of applicants
- Credit approval rate: 60-75% (varies by risk tolerance)
- Disbursement within SLA: 95%+
- On-time repayment rate: 85-95%

### 3. Dormant-to-Reactivation
**Trigger Events:** account_dormant_90d, reactivation_offer_sent, deposit_received, transaction_activity_resumed
**Dormancy Threshold:** No transactions in 90 days

**Journey Stages:**
- Stage 1: Dormancy detection (90 days without activity)
- Stage 2: Reactivation incentive offer (day 95)
- Stage 3: Product showcase (day 100)
- Stage 4: Service upgrade offer (day 105)
- Stage 5: Win-back campaign (day 120+)

**Timing Windows:**
- Dormancy reminder: Day 90 notification
- Reactivation offer: Day 95-100 (incentive based)
- Product education: Day 100-105
- Premium feature trial: Day 105-110
- Final win-back: Day 120-150

**Channel Recommendations:**
- Email (45%): Product benefits and updates
- SMS (35%): Special offer alerts
- Direct mail (15%): Physical offer for high-value accounts
- Phone call (5%): High-value customer outreach

**Conversion Expectations:**
- Reactivation offer click rate: 15-20%
- Account reactivation: 20-30%
- Deposit/transaction completion: 40-50% of reactivated
- Cross-sell conversion: 25-35% of reactivated

### 4. Life-Event-to-Product-Recommendation
**Trigger Events:** life_event_indicator, age_milestone, income_change, family_status_change, employment_change, product_recommendation_trigger
**Life Events:** Marriage, birth, graduation, home purchase, job change

**Journey Stages:**
- Stage 1: Life event detection (real-time or periodic scan)
- Stage 2: Product recommendation (24-48 hours post-detection)
- Stage 3: Educational content (days 3-7)
- Stage 4: Personalized offer (days 7-14)
- Stage 5: Application facilitation (ongoing until purchase)

**Timing Windows:**
- Event notification: 24-48 hours after detection
- Initial product recommendation: Day 2
- Educational webinar/content: Day 3-5
- Personalized offer presentation: Day 7-10
- Limited-time offer: Day 10-30

**Channel Recommendations:**
- Email (50%): Detailed product comparisons
- In-app messaging (25%): Seamless product exploration
- SMS (15%): Offer alerts and reminders
- Video content (10%): Product education and benefits

**Conversion Expectations:**
- Recommendation engagement: 25-35%
- Educational content completion: 40-50%
- Product inquiry rate: 15-25%
- Product purchase rate: 10-18% of engaged users

## Data Requirements

**Essential Attributes:**
- account_profile (account_type, account_age, account_status)
- financial_metrics (account_balance, monthly_income, credit_score, debt_profile)
- transaction_history (transaction_frequency, transaction_size, spending_patterns)
- product_holdings (products_owned, product_usage, cross_sell_readiness)
- life_stage_indicators (age, family_status, employment, income_level)
- compliance_status (kyc_status, aml_status, sanctions_screening)
- engagement_metrics (login_frequency, app_usage, customer_care_contacts)
- churn_risk_score and propensity models

**Event Tracking:**
- account_opened, kyc_completed, account_activated
- loan_inquiry, application_started, application_submitted, credit_decision, approval_granted
- deposit_received, withdrawal_made, payment_received
- product_opened, product_closed, cross_sell_opportunity
- customer_service_contact, complaint_filed, complaint_resolved
- account_dormant, churn_initiated, account_reactivated

## Key Performance Indicators

- Account activation rate within 30 days (target: 75-85%)
- Loan approval and disbursement rate (target: 60-75%)
- Cross-sell ratio (target: 2.5-3.5 products per customer)
- Average account balance growth (target: 8-12% annually)
- Customer retention rate (target: 90-95%)
- Loan repayment rate (target: 85-95%)
- NPS score (target: 50+)
- Cost of acquisition by product
- Lifetime value by customer segment

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map banking transaction and account data
- Use `feature_analysis` to calculate financial readiness and cross-sell propensity scores
- Use `time_travel` to track loan application progression and payment behavior
- Use `get_detailed_events` to analyze dormancy patterns and reactivation opportunities

**Testing Framework:**
- A/B test offer timing (30-day vs 60-day windows)
- Test incentive structures (cashback vs interest rate improvements)
- Segment by life stage and financial profile
- Personalize messaging by product affinity

**Compliance & Risk:**
- Monitor KYC/AML compliance status
- Track regulatory communication requirements
- Ensure disclosure and consent management
- Maintain audit trail of customer interactions

