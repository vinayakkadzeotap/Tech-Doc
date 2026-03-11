---
name: cdp-marketing-suite
description: |
  Universal entry point and intelligent router for all CDP marketing capabilities. When users don't know which skill
  to use or need guidance navigating the CDP, this skill welcomes them, explains what's possible, and routes to the
  right specialized skill. Includes a decision tree for business intents, vertical-specific suites, and quick-start
  orientation. Use this when users ask "help me with CDP", "what can I do", "I need to run a campaign", "get started",
  "CDP capabilities", "marketing tools". Also runs quick health_check + schema_discovery to orient new users.
  This is the lobby - explain the building, then guide them to the right room.
---

# CDP Marketing Suite

## Welcome to the Zeotap CDP

You've got a powerful customer data platform. This guide explains what you can do, which tool to use for your goal, and how to get started fast.

## What You Can Do

The Zeotap CDP is built for marketing teams to:
- **Find & Target**: Build precise audiences based on who customers are and what they've done
- **Predict & Prioritize**: Identify who's likely to churn, who will buy, who's high-value
- **Personalize Journeys**: Deliver next-best actions, prevent cart abandonment, trigger timely campaigns
- **Enrich & Signal**: Add behavioral data, purchase signals, engagement scores to your customer profiles
- **Analyze & Learn**: Understand trends, why things happen, what's working
- **Model & Optimize**: Build ML models, propensity scores, lookalike audiences
- **Manage & Monitor**: Ensure data quality, pipelines run, everything syncs successfully

All of this starts with understanding your data and keeping systems healthy.

## Quick Start (2 minutes)

**New to this CDP? Run this:**

1. System health check: We'll verify everything is operational
2. Data orientation: We'll show you what customer data exists
3. Next steps: We'll recommend where to go based on your business goal

This takes <2 minutes and gives you solid footing.

---

## Decision Tree: What Do You Want to Do?

### "I need to find/target/build segments"
**Use: cdp-audience-finder**
- Build custom audiences based on demographics, behavior, purchase history
- Create "customers who bought X" or "users from Y country who visited Z"
- Export segments to marketing platforms (Facebook, Google, email, etc.)
- Test segments before launching campaigns

### "I need to know who's leaving / at risk"
**Use: cdp-churn-finder**
- Identify customers likely to churn in the next 30/60/90 days
- Understand why they're leaving (behavior changes, product issues, competitive threats)
- Prioritize high-value customers who are at risk
- Set up retention campaigns automatically

### "I need to find lookalike/similar customers"
**Use: cdp-lookalike-finder**
- Upload a list of your best customers
- Find people who look like them (similar demographics, behavior, purchase patterns)
- Expand to new audiences that are likely to convert
- Works for "customers like my VIP list" or "users similar to recent buyers"

### "I need to deliver next actions / prevent abandonment"
**Use: cdp-journey-recommender**
- What should we say/send to this customer right now?
- Identify cart abandoners and trigger recovery campaigns
- Recommend personalized next offers (cross-sell, upsell)
- Optimize timing and channel (email, SMS, push, web)
- Build if-then decision trees for customer journeys

### "I need to enrich profiles with new signals/attributes"
**Use: cdp-data-enricher**
- Add behavioral signals (engagement, purchase frequency, product affinity)
- Append third-party data (weather, economic indicators, location data)
- Calculate derived attributes (customer lifetime value, engagement score)
- Combine multiple data sources into actionable customer attributes

### "I need insights: Why did this happen? What's the trend?"
**Use: cdp-data-analyzer**
- Deep statistical analysis of customer behavior
- Trend identification (what's growing, what's shrinking)
- Correlation analysis (what factors drive conversions?)
- Cohort analysis (compare customer segments)
- Answer "why" questions with data

### "I need to build ML models / predictive scores"
**Use: cdp-data-scientist**
- Create propensity models (likelihood to buy, churn, click)
- Train lookalike models on your best customers
- Build custom ML pipelines using AutoML or code
- Score all customers with model predictions
- Evaluate model performance, iterate, deploy

### "I need to manage data quality / debug pipelines"
**Use: cdp-data-manager**
- Monitor data freshness and completeness
- Fix broken syncs or destination problems
- Validate data quality across profiles
- Understand data lineage and dependencies
- Ensure compliance (GDPR, CCPA)

### "I need to understand what data exists"
**Use: cdp-metadata-explorer** ← Start here if you're new
- See complete data catalog (what fields, what stores)
- Check data completeness (fill rates)
- Identify sensitive/PII fields
- Understand what you can use for targeting
- Validate data before starting analysis

### "Something seems broken / system not working"
**Use: cdp-health-diagnostics** ← Start here if something's wrong
- Check system status and service health
- Debug failed uploads or sync errors
- See which destinations are having problems
- Get root cause analysis with error messages
- Monitor success rates and pipeline health

---

## Vertical-Specific Solutions

The CDP has pre-built suites for different industries:

### Retail & E-Commerce
- Customer lifetime value scoring
- Purchase propensity and next-product prediction
- Cart abandonment and recovery
- Seasonal trend analysis
- Product affinity and cross-sell recommendations
- Competitive churn detection

### Gaming & Entertainment
- Engagement scoring and churn prediction
- Game/content affinity and recommendations
- Lifetime value and monetization models
- Retention campaign triggering
- AB testing framework for content delivery
- Community/streaming platform integration

### Telecom & Utilities
- Churn prediction (especially for service changes)
- Usage pattern analysis (data, minutes, etc.)
- Billing anomaly detection
- Cross-sell/upsell (upgrade offers)
- Win-back campaigns for disconnected customers
- Network event integration (signal drops, outages)

### BFSI (Banking, Financial Services, Insurance)
- Credit risk scoring
- Fraud detection and anomaly flagging
- Product cross-sell and wealth management
- Lifetime value prediction
- Regulatory compliance tracking
- KYC data management

### Travel & Hospitality
- Booking propensity and next-trip prediction
- Loyalty tier management and benefits
- Seasonal travel pattern analysis
- Destination affinity and recommendations
- Last-minute deals and availability matching
- Review and reputation scoring

### Media & Publishing
- Content affinity and recommendation
- Subscription churn and upgrade propensity
- Paywall conversion optimization
- Engagement scoring (time-on-page, shares, etc.)
- Personalized content delivery
- Audience segmentation for advertising

### Automotive
- Purchase intent scoring (timing models)
- Trade-in valuation and offer personalization
- Service visit prediction and reminders
- Warranty and finance cross-sell
- Competitive intelligence (threat detection)
- Loyalty program optimization

### Healthcare & Pharma
- Patient appointment adherence
- Treatment outcome prediction
- Refill and prescription churn
- Provider affinity and network optimization
- Privacy-compliant patient segmentation
- Clinical trial recruitment

---

## How Each Skill Works

### Skill Structure

Each specialized skill follows this pattern:

1. **Trigger Recognition**: Understands when you need it
2. **Tool Orchestration**: Calls MCP tools in the right sequence
3. **Output Formatting**: Presents results for marketing action
4. **Error Handling**: Gracefully recovers if data is missing
5. **Next Steps**: Suggests follow-up actions or related skills

### MCP Tools Under the Hood

All skills use these MCP integrations:

**Zeotap CDP Tools:**
- `schema_discovery`: Explore data structure and completeness
- `time_travel`: Analyze how data changed over time
- `feature_analysis`: Deep statistical metrics on fields
- `query_builder`: Cost-analyze and optimize SQL queries
- `health_check`: Verify system health

**Observability Tools:**
- `get_org_exists`: Validate organization setup
- `get_available_services_by_org_id`: See active pipeline services
- `get_available_event_types`: Discover what events are logged
- `get_recent_dates`: Find data windows with activity
- `get_events_by_time_window`: Timeline analysis of issues
- `get_destination_health`: Monitor delivery success rates
- `get_error_deep_dive`: Root cause analysis of failures
- `get_detailed_events`: Forensic inspection of event details

You don't need to know these tools - each skill calls them correctly. You just describe what you need.

---

## Getting Started: The Orientation

When you first log in or feel lost, do this:

**Step 1: System Health** (30 seconds)
```
Run: health_check()
Get: System operational status, any active incidents
Why: Ensures you're not debugging problems that don't exist
```

**Step 2: Data Overview** (1 minute)
```
Run: schema_discovery(operation: "overview")
Get: Big picture of all data stores and their size
Why: Understand what you're working with
```

**Step 3: Your Goal** (1 minute)
```
Ask yourself: "What am I trying to accomplish?"
- Find customers? → cdp-audience-finder
- Predict churn? → cdp-churn-finder
- Enrich data? → cdp-data-enricher
- Something else? → Use the decision tree above
```

**Step 4: Deep Dive** (5-15 minutes)
```
Invoke the appropriate skill from the decision tree
Let that skill guide you through the process
Follow its recommendations
```

---

## Common Workflows

### Workflow 1: "Run a Black Friday Campaign"

```
1. Use cdp-metadata-explorer
   → What fields can we use to target? (demographics, behavior, purchase history)

2. Use cdp-audience-finder
   → Build "high-value customers likely to buy again"
   → Build "similar-to-our-VIPs" for acquisition

3. Use cdp-churn-finder
   → Identify inactive customers to re-engage

4. Use cdp-data-enricher
   → Add seasonal purchase scores to profiles

5. Use cdp-journey-recommender
   → What offer for each customer segment? When to send?

6. Use cdp-health-diagnostics
   → Verify all destination syncs before campaign launch
```

### Workflow 2: "Why Did Our Retention Drop?"

```
1. Use cdp-health-diagnostics
   → Verify data pipelines are working (data actually there?)

2. Use cdp-data-analyzer
   → Cohort analysis: compare recent customers to historical
   → Trend analysis: when did retention start dropping?

3. Use cdp-churn-finder
   → Who is churning? What changed about them?

4. Use cdp-metadata-explorer
   → Did a critical data field stop flowing? (data quality issue)
```

### Workflow 3: "Build a Propensity Model"

```
1. Use cdp-metadata-explorer
   → What features are available? How complete?

2. Use cdp-data-analyst
   → Correlation analysis: what predicts the outcome?

3. Use cdp-data-scientist
   → Build model with AutoML or custom training
   → Score all customers

4. Use cdp-audience-finder
   → Export high-propensity segments

5. Use cdp-health-diagnostics
   → Monitor that scores refresh daily as new data arrives
```

---

## Tips & Best Practices

### For New Users
- Start with cdp-metadata-explorer to understand your data
- Run health_check regularly to catch issues early
- Ask specific questions ("show me customers from X") rather than vague ones
- Use the decision tree to find the right tool for your job

### For Campaign Managers
- Build once, export many times (write once to profiles, send to multiple destinations)
- Use segment IDs in your email/ads tools for tracking
- Monitor destination health before campaigns launch
- A/B test different segments to find what works

### For Analysts
- Time travel analysis is powerful for understanding behavior change
- Always validate data completeness before analysis
- Use feature_analysis to understand statistical distributions
- Join profile data (who) with event data (what they did)

### For Data Engineers
- Monitor pipeline health daily (get_destination_health)
- Track data freshness (get_recent_dates shows recency)
- Use schema_discovery to document data contracts
- Set up alerts for when success_rate < 95%

### For DevOps/Operations
- Run health_check before escalating issues
- Use get_error_deep_dive for root cause, not guessing
- Track destination problems separately from platform health
- Maintain runbooks for common errors

---

## Still Not Sure?

### Pick one of these based on your title:

**I'm a Marketer** → Start with cdp-audience-finder or cdp-journey-recommender

**I'm an Analyst** → Start with cdp-data-analyzer or cdp-metadata-explorer

**I'm a Data Scientist** → Start with cdp-data-scientist

**I'm an Ops person** → Start with cdp-health-diagnostics

**I'm new** → Start with cdp-metadata-explorer (understand what you have)

**Something's broken** → Start with cdp-health-diagnostics

---

## What Each Skill Delivers

| Skill | Input | Output | Time |
|-------|-------|--------|------|
| cdp-metadata-explorer | "what data do we have?" | Data catalog with fill rates, types, PII flags | 2-5 min |
| cdp-audience-finder | Business rules, demographics, behavior | Segmented audiences ready to export | 5-15 min |
| cdp-churn-finder | Customer behaviors, outcomes | Churn risk scores, cohort analysis | 5-10 min |
| cdp-lookalike-finder | Reference customer list | Expanded audience of similar customers | 10-20 min |
| cdp-journey-recommender | Customer state, context | Next-best-action recommendations | 5-10 min |
| cdp-data-enricher | Raw profiles, third-party data | Enhanced profiles with new signals | 10-30 min |
| cdp-data-analyzer | Business questions | Statistical answers, trends, correlations | 5-20 min |
| cdp-data-scientist | Historical outcomes, features | ML model, scored customer predictions | 20-60 min |
| cdp-data-manager | Data quality concerns | Health report, remediation steps | 5-15 min |
| cdp-health-diagnostics | "is it broken?" | Health dashboard, root causes | 2-5 min |

---

## Related Skills & Resources

- **cdp-metadata-explorer**: When you need to know what data exists
- **cdp-health-diagnostics**: When something breaks or you need system status
- Individual vertical suites: Available in your workspace for retail, gaming, telco, BFSI, etc.

---

## Questions?

Each skill has detailed documentation on how to use it, what it does, and examples. Start with the decision tree above, pick your skill, and let it guide you.

**The CDP is powerful.** You've got this.

---

*Last Updated: 2026-03-05*
