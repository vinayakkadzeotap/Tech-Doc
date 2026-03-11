# Automotive Journey Recommender Guide

## Overview
Automotive industry journey templates, emphasizing research-to-purchase, service retention, warranty management, and trade-in opportunities.

## Core Journey Patterns

### 1. Research-to-Purchase-Negotiation Pipeline
**Trigger Events:** model_research_started, configurator_used, test_drive_booked, showroom_visited, purchase_quote_requested, purchase_completed
**Journey Duration:** 30-120 days

**Journey Stages:**
- Stage 1: Model research initiation (0-14 days, 3+ sessions)
- Stage 2: Configurator usage (7-21 days)
- Stage 3: Test drive booking interest (14-28 days)
- Stage 4: Test drive completion (21-35 days)
- Stage 5: Negotiation and financing (35-60 days)
- Stage 6: Purchase completion (60-90 days)

**Timing Windows:**
- First research email: 0-2 hours post-site visit
- Configurator reminder: 24 hours after configurator session
- Test drive invitation: 3-5 days after configurator usage
- Test drive confirmation: 2-3 days pre-scheduled test drive
- Post-test-drive follow-up: 2 hours after test drive
- Financing offer: 3-5 days post-test-drive
- Purchase incentive: 7-14 days after financing offer
- Final push: 30 days post-initial inquiry

**Channel Recommendations:**
- Email (40%): Detailed spec comparisons, offers, financing options
- SMS (25%): Time-sensitive test drive confirmations, incentives
- Retargeting ads (20%): Keep model top-of-mind
- Phone/dealer contact (10%): High-touch for negotiation
- In-app messaging (5%): Configurator completion prompts

**Conversion Expectations:**
- Research to configurator: 20-30%
- Configurator to test drive: 25-35%
- Test drive to purchase inquiry: 40-50%
- Purchase inquiry to completion: 50-65%
- Overall research to purchase: 5-10% conversion

### 2. Service-Reminder-to-Loyalty
**Trigger Events:** service_due_detected, service_reminder_sent, appointment_booked, service_completed, follow_up_scheduled
**Service Intervals:** Oil changes (5k-10k miles), inspections (annually), major service (varies by model)

**Journey Stages:**
- Stage 1: Service due notification (30 days before due)
- Stage 2: Appointment booking promotion (25 days before)
- Stage 3: Appointment confirmation (5-7 days before)
- Stage 4: Service completion (day 0)
- Stage 5: Follow-up and feedback (1-3 days post-service)
- Stage 6: Next service scheduling (day 7 post-service)

**Timing Windows:**
- Initial reminder: 30-45 days before service due date
- Booking incentive: 20-25 days before due date
- Appointment confirmation: 5-7 days before scheduled date
- Service day reminder: 24 hours before appointment
- Completion notification: Same day post-service
- Feedback request: 2-3 days post-service
- Next service prompt: 7-10 days post-service

**Channel Recommendations:**
- SMS (primary): Appointment reminders and confirmations
- Email (secondary): Service details and next steps
- In-app messaging: Loyalty rewards and service history
- Push notifications: Appointment reminders
- Direct mail: Service offers for valuable customers

**Conversion Expectations:**
- Service reminder engagement: 45-55%
- Appointment booking rate: 40-50%
- On-time appointment completion: 85-90%
- Loyalty program enrollment: 50-60%
- Service bundle adoption: 20-30%

### 3. Warranty-Expiry-to-Extended-Coverage
**Trigger Events:** warranty_expiry_90d, warranty_expiry_30d, extended_warranty_eligible, coverage_recommendation_sent
**Warranty Expiry Window:** 90-30 days before expiry

**Journey Stages:**
- Stage 1: Warranty expiry notification (90 days out)
- Stage 2: Extended warranty benefits education (60 days out)
- Stage 3: Coverage options comparison (45 days out)
- Stage 4: Exclusive offer presentation (30 days out)
- Stage 5: Final conversion push (7-14 days before expiry)
- Stage 6: Post-expiry win-back (14-30 days after expiry)

**Timing Windows:**
- Awareness notification: 90 days before expiry
- Education email series: 60-75 days out (3-email sequence)
- Comparison offer: 45-50 days out
- Exclusive pricing: 30-35 days out
- Urgency message: 14-7 days before expiry
- Win-back offer: 14-30 days post-expiry

**Channel Recommendations:**
- Email (50%): Detailed coverage comparison and benefits
- SMS (30%): Deadline alerts and exclusive offers
- In-app messaging (10%): Coverage status and options
- Dealer contact (10%): High-touch for premium warranties

**Conversion Expectations:**
- Extended warranty consideration: 30-40%
- Coverage option selection: 20-30%
- Extended warranty purchase: 25-35%
- Pre-expiry purchase rate: 60-70% of buyers
- Post-expiry win-back: 5-10%

### 4. Trade-In-Ready-to-New-Model-Offer
**Trigger Events:** vehicle_age_5_years, vehicle_mileage_milestone, model_refresh_announced, trade_in_value_high, purchase_intent_signal
**Vehicle Age Trigger:** 5+ years or 60,000+ miles

**Journey Stages:**
- Stage 1: Trade-in readiness assessment (vehicle age/mileage)
- Stage 2: Trade-in value quote offer (days 1-3)
- Stage 3: New model showcase (days 3-7)
- Stage 4: Trade-in and purchase offer (days 7-14)
- Stage 5: Financing options presentation (days 14-21)
- Stage 6: Test drive and negotiation (days 21-45)
- Stage 7: Trade-in completion and purchase (days 45+)

**Timing Windows:**
- Trade-in appraisal: 1-3 days after assessment
- New model introduction: 3-5 days after trade-in quote
- Combined offer: 7-10 days post-quote
- Financing offer: 10-14 days post-combined offer
- Test drive invitation: 14-21 days post-assessment
- Final incentive: 30-45 days post-initial contact
- Win-back: 60-90 days if no conversion

**Channel Recommendations:**
- Email (40%): Trade-in value, new model details, financing
- SMS (30%): Quick appraisal links, urgent offers
- Retargeting ads (15%): New model showcase
- Dealer contact (10%): High-touch negotiation
- Direct mail (5%): Trade-in value certificates

**Conversion Expectations:**
- Trade-in quote request: 25-35%
- Quote to test drive: 30-40%
- Test drive to purchase: 45-55%
- Trade-in completion rate: 60-70%
- Average trade-in value: 40-50% of original MSRP

## Data Requirements

**Essential Attributes:**
- vehicle_profile (current_model, year, mileage, ownership_duration)
- service_history (service_frequency, service_type, maintenance_compliance)
- warranty_status (coverage_type, expiry_date, remaining_coverage)
- purchase_history (previous_models, purchase_prices, financing_methods)
- trade_in_value (estimated_current_value, depreciation_rate)
- engagement_metrics (website_visits, configurator_usage, test_drive_frequency)
- financing_profile (credit_score_range, preferred_financing_term, down_payment_capacity)

**Event Tracking:**
- model_research_started, configurator_used, test_drive_booked
- purchase_inquiry_submitted, purchase_completed, purchase_financed
- service_due_detected, service_appointment_booked, service_completed
- warranty_expiry_approaching, extended_warranty_purchased
- trade_in_appraised, trade_in_completed
- referral_requested, loyalty_enrolled

## Key Performance Indicators

- Website-to-test-drive conversion: 5-10%
- Test-drive-to-purchase rate: 45-55%
- Overall research-to-purchase cycle: 60-90 days
- Service appointment booking rate: 40-50%
- Extended warranty attachment rate: 25-35%
- Trade-in volume growth: Year-over-year
- Customer retention rate: 50-60%
- Net Promoter Score (NPS): 50+
- Customer lifetime value (CLV) including service and parts

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map automotive purchase journey and service events
- Use `feature_analysis` to calculate trade-in readiness and purchase intent scores
- Use `time_travel` to analyze service compliance patterns and warranty expiry trends
- Use `get_detailed_events` to identify purchase journey bottlenecks and drop-off points

**Testing Framework:**
- A/B test offer timing (90-day vs 60-day warranty notifications)
- Test configurator features and UX improvements
- Segment by vehicle age and usage patterns
- Personalize offers by trade-in equity position

**Dealer Coordination:**
- Synchronize digital and physical experiences
- Track in-dealership conversion rates
- Monitor sales process efficiency
- Coordinate inventory with digital campaigns

