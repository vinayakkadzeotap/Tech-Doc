# Travel Journey Recommender Guide

## Overview
Travel and hospitality journey templates, emphasizing inspiration, booking conversion, experience, and loyalty progression.

## Core Journey Patterns

### 1. Search-to-Booking-to-Experience Pipeline
**Trigger Events:** destination_search, price_view, booking_initiation, booking_confirmation, pre_trip_starts, experience_completes, review_request
**Journey Duration:** 14-90 days pre-trip, 0-30 days post-trip

**Journey Stages:**
- Stage 1: Destination/property search (0-7 days, 3+ sessions)
- Stage 2: Comparison and price checking (7-14 days)
- Stage 3: Booking initiation (checkout started)
- Stage 4: Booking confirmation (payment completed)
- Stage 5: Pre-trip engagement (14-7 days before travel)
- Stage 6: Experience and travel (0+ days)
- Stage 7: Post-trip review and loyalty (0-14 days post-trip)

**Timing Windows:**
- Post-search reminder: 24 hours after search
- Price drop notification: Real-time when price decreases
- Abandoned booking reminder: 2 hours, 24 hours post-abandonment
- Confirmation and itinerary: 0-5 min post-booking
- Pre-trip check-in: 14 days, 7 days, 48 hours before travel
- Experience upsell: 7-14 days before check-in
- Review request: 3-5 days post-checkout
- Loyalty follow-up: 14-30 days post-trip

**Channel Recommendations:**
- Email (primary): Itineraries, booking confirmations, pre-trip info
- Push notifications: Price alerts, time-sensitive offers
- SMS: Confirmation numbers, check-in reminders, urgent updates
- In-app messaging: Booking progress, experience recommendations
- WhatsApp: Travel support and customer service

**Conversion Expectations:**
- Search to booking rate: 10-15%
- Abandoned booking recovery: 8-12%
- Price drop alert conversion: 15-20%
- Pre-trip upsell (activities, upgrades): 20-30%
- Review submission rate: 25-35%
- Repeat booking within 12 months: 40-50%

### 2. Loyalty-Tier-Approach-to-Upgrade
**Trigger Events:** loyalty_points_balance_high, next_tier_threshold_near, tier_upgrade_achievable, tier_milestone_notification
**Tier Upgrade Window:** 30-60 days before tier expiry

**Journey Stages:**
- Stage 1: Tier-approach notification (60 days out)
- Stage 2: Points-to-upgrade pathway (45 days out)
- Stage 3: Earning nudge with targeted offers (30 days out)
- Stage 4: Tier upgrade incentive (14 days out)
- Stage 5: Tier status notification (0 days, upgrade moment)
- Stage 6: Tier benefit activation (1-3 days post-upgrade)
- Stage 7: Loyalty engagement (ongoing)

**Timing Windows:**
- Approaching notification: 60 days before expiry/upgrade threshold
- Earning nudge: 45-50 days out
- Bonus points offer: 30-35 days out
- Final push: 14-7 days before deadline
- Upgrade celebration: Day 0 of tier change
- Benefit education: Days 1-3 post-upgrade

**Channel Recommendations:**
- Email (40%): Detailed tier benefits and earning opportunities
- Push notifications (30%): Milestone reminders and time-sensitive offers
- In-app messaging (20%): Seamless tier progression display
- SMS (10%): Urgent deadline reminders

**Conversion Expectations:**
- Engagement with tier notification: 35-45%
- Bonus points offer acceptance: 25-35%
- Tier upgrade achievement: 55-65%
- Tier benefit activation: 70-80%

### 3. Abandoned-Booking-to-Recovery
**Trigger Events:** booking_started, booking_abandoned, booking_email_sent, recovery_offer_sent
**Abandonment Window:** Checkout started but not completed

**Journey Stages:**
- Stage 1: Abandonment detection (within 10 min)
- Stage 2: Immediate browser push (within 10 min)
- Stage 3: Email reminder with incentive (2-4 hours)
- Stage 4: SMS backup (18-24 hours)
- Stage 5: Final offer with urgency (48-72 hours)
- Stage 6: Win-back offer (7-14 days)

**Timing Windows:**
- Retargeting ad: 5-15 min post-abandonment
- First email: 2-4 hours post-abandonment
- SMS reminder: 18-24 hours post-abandonment
- Final push: 48-72 hours post-abandonment
- Win-back campaign: 7-14 days post-abandonment

**Channel Recommendations:**
- Retargeting ads (40%): Immediate visual reminder
- Email (35%): Incentivized recovery offer
- SMS (15%): Sense of urgency
- Push notifications (10%): Reminder on app

**Conversion Expectations:**
- First email recovery: 15-20%
- SMS recovery: 8-12%
- Final push recovery: 5-8%
- Total abandonment recovery: 25-35%

### 4. Seasonal-Inspiration-to-Planning-to-Booking
**Trigger Events:** seasonal_content_engagement, inspiration_viewed, destination_pinned, planning_tool_started, booking_initiated
**Seasonal Patterns:** Peak seasons (summer, holidays), shoulder seasons (spring, fall), off-season opportunities

**Journey Stages:**
- Stage 1: Seasonal content exposure (8-12 weeks pre-season)
- Stage 2: Inspiration engagement (destination pinning, wishlist adding)
- Stage 3: Planning phase (research, itinerary building)
- Stage 4: Booking consideration (price checking, availability viewing)
- Stage 5: Booking completion (payment)
- Stage 6: Planning support (pre-trip collaboration tools)
- Stage 7: Community sharing (post-trip social engagement)

**Timing Windows:**
- Seasonal inspiration content: 12 weeks before peak season
- Destination-specific content: 8-10 weeks before peak
- Early-bird offer: 8-12 weeks pre-season
- Regular-bird offer: 4-6 weeks pre-season
- Last-minute offer: 1-2 weeks pre-season
- Travel period: Peak season dates
- Post-trip engagement: 0-30 days post-travel

**Channel Recommendations:**
- Email (35%): Seasonal collections and inspiration
- Social media (30%): Visual inspiration and user-generated content
- In-app messaging (20%): Personalized destination suggestions
- SMS (10%): Time-sensitive early-bird offers
- Display ads (5%): Retargeting seasonal themes

**Conversion Expectations:**
- Content engagement rate: 30-40%
- Wishlist/planning tool usage: 20-30%
- Early-bird offer conversion: 15-20%
- Overall seasonal booking rate: 25-35%

## Data Requirements

**Essential Attributes:**
- travel_history (bookings, destinations, trip_duration, spend_per_trip)
- destination_preferences (beach, city, adventure, cultural interests)
- loyalty_profile (tier_status, points_balance, member_since)
- seasonal_patterns (peak_travel_periods, advance_booking_window)
- price_sensitivity (discount_responsiveness, price_point_preferences)
- group_composition (solo, couple, family, group_size)
- channel_preferences (email_engagement, sms_preference, app_usage)

**Event Tracking:**
- destination_search, price_view, destination_bookmarked
- booking_started, booking_abandoned, booking_completed
- confirmation_email_opened, confirmation_email_clicked
- check_in_completed, review_submitted, review_shared
- experience_booked, experience_completed, experience_rated
- loyalty_points_earned, tier_upgraded, offer_redeemed

## Key Performance Indicators

- Booking conversion rate (search to booking): 10-15%
- Average booking value and revenue per user
- Booking abandonment recovery rate: 25-35%
- Customer lifetime value by loyalty tier
- Review rate and average rating
- Repeat booking rate within 12 months: 40-50%
- Net Promoter Score (NPS) by segment
- Cost per acquisition (CPA) by channel
- Return on ad spend (ROAS) by campaign

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map travel booking events and customer journey
- Use `feature_analysis` to identify destination affinity and loyalty progression
- Use `time_travel` to analyze seasonal booking patterns and advance booking windows
- Use `get_detailed_events` to track abandonment points and recovery effectiveness

**Testing Framework:**
- A/B test offer incentives (discount % vs free services)
- Test timing windows (early-bird vs last-minute strategies)
- Segment by travel style and trip frequency
- Personalize content by destination and trip type

**Seasonality Management:**
- Build 12-month content calendar
- Pre-plan campaigns 8-12 weeks ahead
- Monitor early-bird offer uptake
- Track booking curve and adjust promotions accordingly

