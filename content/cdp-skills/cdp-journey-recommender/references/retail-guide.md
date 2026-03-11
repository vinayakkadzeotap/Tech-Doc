# Retail Journey Recommender Guide

## Overview
Industry-specific journey templates for retail organizations, including event sequences, timing windows, channel recommendations, and conversion expectations.

## Core Journey Patterns

### 1. Browse-to-Purchase Recovery
**Trigger Events:** browse_product, add_to_cart, cart_abandoned
**Journey Stages:**
- Stage 1: Product browsing (0-30 min window, 2+ products viewed)
- Stage 2: Cart addition (3-15 min after browse)
- Stage 3: Abandonment detection (5+ min without checkout progression)

**Timing Windows:**
- First reminder: 1 hour post-abandonment
- Second reminder: 24 hours post-abandonment
- Final reminder: 72 hours post-abandonment

**Channel Recommendations:**
- Email (primary): High open rates, product image display
- SMS (secondary): 2-3 hour window, urgent tone
- Push notification: 4-6 hour window, geo-relevant
- Retargeting ads: Ongoing, dynamic creative

**Conversion Expectations:**
- First email conversion: 8-12%
- Second email conversion: 4-6%
- Third email conversion: 2-3%
- Combined recovery rate: 15-20%

### 2. Purchase-to-Loyalty Path
**Trigger Events:** purchase_completed, email_confirmation, delivery_confirmation
**Journey Stages:**
- Stage 1: Post-purchase confirmation (immediate)
- Stage 2: Product review request (3-7 days post-delivery)
- Stage 3: Repurchase trigger detection (30-90 days based on category)
- Stage 4: Loyalty program enrollment (45+ days after purchase)

**Timing Windows:**
- Confirmation email: 0-15 min
- Review request: 3-5 days after delivery
- Repurchase nudge: 30-60 days (consumables), 60-90 days (durable goods)
- Loyalty offer: 45-60 days

**Channel Recommendations:**
- Email: Primary channel for reviews and loyalty offers
- In-app messaging: Order status updates
- SMS: Delivery notifications
- Push: Repurchase reminders

**Conversion Expectations:**
- Review submission: 15-20%
- Repeat purchase within 90 days: 25-35%
- Loyalty signup rate: 30-40%

### 3. First-Purchase-to-Loyalty
**Trigger Events:** first_purchase, account_created, loyalty_program_eligible
**Segments:** New customers (< 60 days)

**Journey Stages:**
- Stage 1: Welcome communication (0-1 day)
- Stage 2: Onboarding education (1-7 days)
- Stage 3: Cross-sell introduction (7-14 days)
- Stage 4: Loyalty program incentive (14-30 days)

**Timing Windows:**
- Welcome email: Within 2 hours of purchase
- Education series: Daily cadence, 3-email sequence
- Cross-sell offer: 7-10 days post-purchase
- Loyalty incentive: 15-20 days post-purchase

**Channel Recommendations:**
- Email (70%): Primary engagement channel
- Push notifications (20%): Reminder alerts
- SMS (10%): Urgent offers

**Conversion Expectations:**
- Email open rate: 35-40%
- Cross-sell conversion: 8-12%
- Loyalty signup: 40-50%

### 4. Seasonal Wishlist-to-Purchase
**Trigger Events:** wishlist_add, price_drop, seasonal_event_start
**Seasonal Patterns:** Holiday seasons, back-to-school, summer, new year

**Journey Stages:**
- Stage 1: Wishlist monitoring (ongoing)
- Stage 2: Price-drop detection (real-time)
- Stage 3: Seasonal relevance notification (2-4 weeks before event)
- Stage 4: Final conversion push (1 week before event)

**Timing Windows:**
- Price-drop notification: Immediate
- Pre-season reminder: 14-21 days before event
- Final push: 3-7 days before peak event
- Post-season offer: Immediate post-season

**Channel Recommendations:**
- Email: Main channel, product images essential
- Push: Time-sensitive price drops
- Retargeting ads: Continuous presence
- SMS: Final day offers

**Conversion Expectations:**
- Price-drop click rate: 20-25%
- Seasonal conversion: 12-18%
- Wishlist-to-purchase rate: 15-22%

### 5. Return-to-Exchange-to-Retention
**Trigger Events:** return_initiated, return_accepted, exchange_offer, retention_offer
**Journey Stages:**
- Stage 1: Return processing (0-5 days)
- Stage 2: Exchange offer (day 2-3)
- Stage 3: Retention incentive (day 5-7)
- Stage 4: Win-back offer (30 days if customer disengaged)

**Timing Windows:**
- Immediate exchange offer: 1-2 days post-return initiation
- Retention offer: 5-7 days post-return
- Win-back: 30 days without purchase

**Channel Recommendations:**
- Email: Primary communication channel
- SMS: Urgent time-sensitive offers
- Customer service: Personal outreach for high-value returns
- Push: Reminder notifications

**Conversion Expectations:**
- Exchange acceptance: 30-40%
- Retention offer acceptance: 20-30%
- Win-back rate: 15-20%
- Repeat purchase after retention: 35-45%

## Data Requirements

**Essential Attributes:**
- purchase_history (amount, date, category, returns)
- browsing_behavior (session_time, products_viewed, cart_additions)
- channel_engagement (email_opens, click_rates, sms_responses)
- product_affinity (categories, price_points, brands)
- customer_lifetime_value (historical and predicted)
- segment_membership (loyalty_status, value_tier)

**Event Tracking:**
- page_view, product_view, add_to_cart, remove_from_cart
- checkout_initiated, purchase_completed, payment_failed
- email_delivered, email_opened, email_clicked, email_bounced
- sms_sent, sms_delivered, sms_clicked
- push_delivered, push_clicked
- return_initiated, return_completed, refund_processed

## Key Performance Indicators

- Conversion rate by stage (target: 15-20% overall)
- Average order value (track uplift from journey)
- Customer lifetime value (measure long-term impact)
- Email engagement metrics (open, click, unsubscribe rates)
- SMS opt-in and response rates
- Return on marketing spend (ROAS) by journey
- Churn reduction metrics
- Channel attribution analysis

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map retail event structure and attributes
- Use `feature_analysis` to identify purchase velocity and affinity scores
- Use `time_travel` to analyze journey progression timing and bottlenecks
- Use `get_available_event_types` to discover all trackable retail events

**Success Metrics by Journey:**
- Browse recovery: 15-20% conversion rate
- Purchase loyalty: 30-40% loyalty signup
- Seasonal: 12-18% conversion rate
- Return retention: 35-45% repeat purchase rate

**Testing Framework:**
- A/B test email subject lines and send times
- Test channel combinations (email + SMS vs email only)
- Segment-level personalization testing
- Dynamic timing optimization per segment

