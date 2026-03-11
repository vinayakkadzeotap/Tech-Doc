---
name: cdp-journey-recommender
description: Recommends customer journeys and next-best-actions based on event sequences. Analyzes touchpoint patterns, identifies friction points, and suggests triggers for cart abandonment recovery, lifecycle flows, and win-back campaigns. Learns from successful customer progressions to recommend optimal messaging sequence, timing, and channels. Triggers on "cart abandonment", "next best action", "customer journey", "lifecycle flow", "re-engagement", "win-back", "trigger campaign". Powers automated decisioning for timely, relevant customer interactions.
---

# CDP Journey Recommender

## Overview

The Journey Recommender skill orchestrates customer touchpoint sequences based on real event data. Rather than building journeys from intuition, this skill analyzes how customers actually progress through your application, identifies successful sequences, and recommends the next-best-action at each decision point.

## Typical Workflow

1. **Map Available Events** – Discover all touchpoints and events in your system
2. **Analyze Event Sequences** – Track how customers flow from event to event
3. **Identify Friction Points** – Find where customers drop off or stall
4. **Extract Successful Patterns** – Learn which sequences drive desired outcomes
5. **Recommend Journey Stages** – Define stages, timing, and messaging triggers
6. **Activate & Measure** – Deploy journey with automated triggers and track performance

---

## Step 1: Event Catalog Discovery

Every customer journey is a sequence of events. Start by understanding what events your platform tracks:

```
Tool: get_available_event_types(org_id="your_org", service_name="")
Result: Lists all distinct events:
  - account_created
  - product_browsed
  - cart_abandoned
  - purchase_completed
  - customer_support_contacted
  - subscription_upgraded
  - churn_risk_flagged
  - ... (50+ more)
```

Next, filter events by service area to understand sub-journeys:

```
Tool: get_available_event_types(org_id="your_org", service_name="Uploader")
Result: Identifies which events map to data ingestion flows
```

---

## Step 2: Event Sequence Analysis via Time Travel

Once you've cataloged events, use `time_travel` to see how customers progress:

```
Tool: time_travel(starting_timestamp="2026-01-01", ending_timestamp="2026-03-05",
                  change_types=["insert", "update_postimage"],
                  columns=["event_type", "event_timestamp", "user_id"],
                  include_raw_data=true)
Result: Raw event sequence for each user, sorted by timestamp
```

This reveals natural journey progressions:
```
User 12345 Journey:
  Day 1 @ 10:00 AM → account_created
  Day 1 @ 10:05 AM → email_verified
  Day 1 @ 11:00 AM → product_browsed (category: electronics)
  Day 2 @ 2:00 PM → product_browsed (category: electronics)
  Day 3 @ 9:00 AM → cart_initiated
  Day 3 @ 9:15 AM → cart_abandoned
  Day 4 @ 8:00 AM → email_opened (cart recovery email)
  Day 5 @ 3:00 PM → purchase_completed
```

---

## Step 3: Understand Event Payloads

Events contain rich context. Use `get_detailed_events` to inspect what data each event carries:

```
Tool: get_detailed_events(org_id="your_org", service_name="Uploader",
                         event_type="cart_abandoned", limit=10)
Result: Sample events showing payload structure:
{
  "event_id": "evt_001",
  "user_id": "user_12345",
  "timestamp": "2026-03-05T09:15:00Z",
  "event_type": "cart_abandoned",
  "payload": {
    "cart_value": 245.99,
    "item_count": 3,
    "recovery_email_sent": false,
    "device_type": "mobile",
    "referrer": "email_campaign"
  }
}
```

Use payload fields to inform next-best-action logic:
- **cart_value**: Send recovery if value > $50; skip if < $10 (margin)
- **device_type**: SMS recovery for mobile; email for desktop
- **referrer**: Thank original source in recovery message

---

## Step 4: Analyze User-Level Metrics

Understand how frequently each event occurs and which users experience which journeys:

```
Tool: feature_analysis(columns=["event_count", "avg_days_between_events", "churn_likelihood"],
                       metric_types=["user_metrics"],
                       store_type="event_store")
Result: Event frequency distributions and user engagement velocity
```

This informs journey timing:
- If users typically go cart_abandoned → purchase within 48 hours, send recovery email at 24 hours
- If users who don't see recovery email within 7 days have 80% churn, set retargeting deadline to day 6

---

## Step 5: Vertical Journey Templates

Industry-specific journey patterns differ significantly. Use these templates as starting points:

### Retail & E-Commerce

**Primary Journey**: Browse → Add to Cart → Checkout → Purchase → Review → Repurchase

**Cart Abandonment Sub-Journey**:
- Trigger: `cart_abandoned` event
- Delay: 2 hours (let customer cool off)
- Message 1: "You left something behind" (soft reminder, 30% recovery rate)
- Delay: 24 hours
- Message 2: "Complete your order, 15% off" (incentive, 45% recovery rate)
- Delay: 48 hours
- Message 3: "Your cart expires in 24 hours" (urgency, 20% recovery rate)

**Post-Purchase Journey**:
- Day 1: Order confirmation + shipping tracking
- Day 3: "How's your order?" satisfaction survey
- Day 7: Product review request
- Day 30: "Customers also bought…" recommendation
- Day 90: Repurchase trigger (based on product category seasonality)

### Gaming & Entertainment

**Primary Journey**: Install → Tutorial → First Purchase → Daily Engagement → Monetization → Retention

**New User Onboarding**:
- Trigger: `account_created` event
- Minute 0: Show in-app tutorial
- Hour 2: If tutorial not completed → tutorial nudge push
- Hour 4: If first purchase not made → limited-time starter offer
- Day 3: If not daily active → re-engagement push (personal offer)
- Day 7: If churned → win-back campaign (special offer + progress bonus)

**Monetization Journey**:
- Trigger: `in_app_purchase_made`
- Analyze: Users who purchase once are 4x likely to purchase again within 7 days
- Message Strategy: Segment by purchase type (cosmetics vs. battle pass) and tailor offers

### Financial Services & Banking

**Primary Journey**: Signup → Account Activation → First Transaction → Account Growth → Upsell → Retention

**Account Activation**:
- Trigger: `account_created` event
- Hour 0: Send activation email + SMS
- Hour 24: If not activated → escalation email (offer support)
- Hour 48: If not activated → phone outreach (high-touch)

**Upsell Triggers**:
- User reaches $50K account balance → Offer investment products
- User completes 10 transactions → Offer premium account tier
- User transfers money 3+ times → Offer bill pay integration

**Churn Prevention**:
- Trigger: `account_inactive_30days` event
- Segment: Understand why inactive (low balance, minimal activity, competitor migration)
- Message: Personalized win-back with action steps

### Telecom & Media

**Primary Journey**: Signup → Service Activation → Regular Usage → Bill Payment → Renewal → Upsell

**New Subscriber Journey**:
- Trigger: `subscription_created`
- Day 0: Welcome SMS + activation instructions
- Day 3: If not activated → activation support
- Day 7: Once activated, send usage tips
- Day 30: Invitation to premium features

**Churn Prevention**:
- Trigger: Users with 40%+ drop in monthly usage → Risk flag
- Action: Offer plan downgrade or incentive to retain

---

## Step 6: Next-Best-Action Logic

At each journey stage, recommend the optimal next action based on:

1. **Event History**: What events has this user already experienced?
2. **Timing**: How much time has elapsed since last event?
3. **Segment**: Does user belong to high/medium/low-value segment?
4. **Channel Preference**: Email vs. SMS vs. Push vs. In-App?
5. **Frequency Cap**: Has user already received 3 messages this week?

Example decision tree:
```
IF event = "cart_abandoned"
  AND time_since_event = 2–4 hours
  AND cart_value > $50
  AND user_segment = "high_value"
  THEN send_personalized_email_reminder()
ELSE IF event = "cart_abandoned"
  AND time_since_event = 24–48 hours
  THEN send_sms_incentive("15% off")
ELSE IF event = "cart_abandoned"
  AND time_since_event > 72 hours
  THEN retarget_on_social_media()
```

---

## Step 7: Journey Design Output

The Journey Recommender deliverable includes:

1. **Journey Map**: Visual/textual diagram of stages, triggers, and transitions
2. **Stage Definitions**: Entry/exit criteria, typical duration, success metrics
3. **Trigger Events**: Which system events initiate journeys
4. **Message Recommendations**: Content strategy per stage
5. **Timing**: Optimal delays between messages based on historical data
6. **Channel Mix**: Email vs. SMS vs. Push success rates for each stage
7. **Estimated Performance**: Expected conversion/engagement rates per stage

Example output:
```
Journey: Cart Abandonment Recovery
├── Trigger: cart_abandoned event
├── Stage 1: Gentle Reminder (2-hour delay)
│   ├── Channel: Email
│   ├── Expected Open Rate: 35%
│   ├── Expected Click Rate: 8% (recovery)
│   └── Success Metric: 15% recover cart within 24h
├── Stage 2: Incentive Offer (26-hour delay)
│   ├── Channel: Email + SMS
│   ├── Offer: 15% off (expires in 24h)
│   └── Success Metric: 25% additional recoveries
└── Stage 3: Urgency (50-hour delay)
    ├── Channel: Push + Retargeting Ad
    ├── Message: "Last chance—your cart expires soon"
    └── Success Metric: 12% final recoveries
Total Recovery Rate: 52% (vs. 8% no-action baseline)
```

---

## Cost & Performance Notes

- **Data Cost**: Event analysis scales with event volume; start with recent 30–60 days
- **Typical Execution**: 10–20 minutes to map and recommend journeys
- **Validation**: A/B test journey recommendations against control groups before full activation
- **Refresh Cadence**: Quarterly; events/timing may shift with seasonality

---

## Related Skills

- **cdp-churn-finder**: Identify at-risk users and trigger win-back journeys
- **cdp-audience-finder**: Build segments for journey entry/exit criteria
- **cdp-data-enricher**: Enhance user profiles to improve journey personalization
