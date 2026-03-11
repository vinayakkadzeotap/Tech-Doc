# Gaming KPI Glossary

Comprehensive reference for gaming and mobile gaming key performance indicators with definitions, formulas, benchmarks, and player analysis guidance.

## Core Engagement Metrics

### Daily Active Users (DAU)

**Definition:** Number of unique players who initiated at least one session within a 24-hour period.

**Formula:**
```
DAU = Count(Unique Player IDs with session in calendar day)
```

**Related Metrics:**
- **7-day moving average (DAU-7MA):** Smooths day-to-day volatility
- **DAU/MAU ratio:** Stickiness score (high % = engaged core)

**Industry Benchmarks:**
- Casual games: 15-30% of MAU is daily
- Mid-core games: 20-40% of MAU is daily
- Hardcore games: 30-50% of MAU is daily
- Social games: 10-20% of MAU is daily

**Example:** 100,000 MAU; 25,000 daily playing = 25% DAU/MAU (good stickiness)

**Trend Analysis:**
- Increasing DAU: Engagement improving, content resonating
- Stable DAU: Mature, healthy baseline
- Declining DAU: Potential churn risk, content drought, competition

**When it matters:** Content effectiveness, player satisfaction, business health

---

### Monthly Active Users (MAU)

**Definition:** Number of unique players who initiated at least one session within a 30-day rolling window.

**Formula:**
```
MAU = Count(Unique Player IDs with any session in last 30 days)
```

**Business Use:**
- User acquisition measure (growth metric)
- Market size assessment
- Ad platform reporting (Facebook, Apple, Google)

**MAU Growth Rate:**
```
MAU Growth % = (This Month MAU - Last Month MAU) / Last Month MAU × 100
```

**Industry Benchmarks:**
- Hyper-casual: 20-50% monthly growth (volatile)
- Casual: 5-15% growth
- Mid-core: 2-8% growth
- Hardcore: 0-5% growth (mature)

**Cohort MAU Analysis:**
Track MAU by install cohort over time to measure long-term retention and lifetime engagement.

**When it matters:** User acquisition strategy, total addressable market, investor metrics

---

### Stickiness Index (DAU/MAU)

**Definition:** Ratio of daily users to monthly users; measure of how often players return.

**Formula:**
```
Stickiness = DAU / MAU × 100
```

**Example:** 25,000 DAU / 100,000 MAU = 25% stickiness

**Industry Benchmarks:**
- Excellent: >35%
- Good: 25-35%
- Average: 15-25%
- Poor: <15%

**Interpretation:**
- 50% stickiness: 1 in 2 monthly players return daily
- 30% stickiness: 1 in 3.3 monthly players return daily
- 20% stickiness: 1 in 5 monthly players return daily

**Improvement Tactics:**
- Daily rewards & streaks (habit formation)
- Push notifications (timely engagement)
- Social features (friend networks)
- Fresh content (seasonal updates, limited-time events)

**When it matters:** Long-term sustainability, content roadmap planning

---

## Retention Metrics

### Day N Retention (D1, D7, D30, D90)

**Definition:** Percentage of players from a cohort who return on specific days after installation.

**Formula:**
```
DN Retention % = Players active on Day N / Cohort size × 100
```

**Example:**
- Day 0 (installation): 10,000 players
- Day 1: 4,000 return = 40% D1 retention
- Day 7: 1,200 return = 12% D7 retention
- Day 30: 400 return = 4% D30 retention

**Industry Benchmarks:**

| Metric | Excellent | Good | Average | Poor |
|--------|-----------|------|---------|------|
| **D1 Retention** | >50% | 40-50% | 25-40% | <25% |
| **D7 Retention** | >30% | 20-30% | 10-20% | <10% |
| **D30 Retention** | >15% | 10-15% | 5-10% | <5% |
| **D90 Retention** | >8% | 5-8% | 2-5% | <2% |

**By Game Type:**

| Game Type | D1 | D7 | D30 |
|-----------|----|----|-----|
| Hyper-casual | 35% | 8% | 2% |
| Casual | 40% | 12% | 4% |
| Mid-core | 45% | 18% | 8% |
| Hardcore | 55% | 30% | 15% |
| Social/MMO | 50% | 25% | 12% |

**Cohort Analysis:**
Compare D1/D7/D30 across install sources (Facebook, Google Ads, Organic, etc.) to identify highest-quality traffic.

**Retention Decay:**
- Most games see 50-70% drop from D1 to D7
- 50-80% drop from D7 to D30
- Stabilization after D30 (committed core players)

**When it matters:** Game quality assessment, tutorial effectiveness, install source quality evaluation

---

### Rolling N-Day Retention

**Definition:** Percentage of players active on at least one day within a rolling N-day window.

**Formula:**
```
Rolling N-Day Retention % = Players active any day in period / Cohort size × 100
```

**Example:** D1-D7 rolling retention = % of players who return at least once in first 7 days (may be day 1, 3, 5, or 7)

**Use Case:** Understand grace period impact (players who lapse but return within window)

---

## Monetization Metrics

### Average Revenue Per User (ARPU)

**Definition:** Total revenue divided by all players (includes non-payers).

**Formula:**
```
ARPU = Total Revenue / Total Players
     = (Payers × ARPPU) + (Non-Payers × $0) / Total Players
     = Payer Rate × ARPPU
```

**Example:**
- Total revenue: $100,000
- Total players: 100,000
- ARPU = $100,000 / 100,000 = $1.00

**Industry Benchmarks:**
- Hyper-casual: $0.10-0.50 (ad-driven)
- Casual: $0.50-2.00
- Mid-core: $2.00-8.00
- Hardcore: $5.00-20.00+

**Time-Based ARPU:**
- Day 1 ARPU: Revenue from Day 1 users only
- Monthly ARPU: Revenue per player in month
- Lifetime ARPU: Same as LTV for all-time players

**When it matters:** Business model validation, pricing strategy, profitability per user

---

### Average Revenue Per Paying User (ARPPU)

**Definition:** Average revenue from only the players who spent money.

**Formula:**
```
ARPPU = Total Revenue / Total Paying Players
```

**Example:**
- Total revenue: $100,000
- Total paying players: 2,500
- ARPPU = $100,000 / 2,500 = $40.00

**Industry Benchmarks:**
- Hyper-casual: $5-20
- Casual: $15-50
- Mid-core: $30-100
- Hardcore: $50-500+

**Payer Rate Calculation:**
```
Payer Rate % = Paying Players / Total Players × 100
ARPU = Payer Rate × ARPPU
```

**Spending Distribution (Typical):**
- Top 1% whales: 20-30% of revenue
- Next 5% dolphins: 20-30% of revenue
- Next 10% minnows: 15-25% of revenue
- Remaining 84% free players: 0 revenue

**Spending Tiers:**
- Whales: ARPPU $100+
- Dolphins: ARPPU $10-100
- Minnows: ARPPU $1-10
- Free: ARPPU $0

**When it matters:** Monetization strategy, whale segment protection, pricing optimization

---

### In-App Purchase Conversion Rate (IAP Conv.)

**Definition:** Percentage of players who make at least one purchase.

**Formula:**
```
IAP Conversion % = Paying Players / Total Players × 100
```

**Example:** 2,500 payers / 100,000 players = 2.5% IAP conversion

**Industry Benchmarks:**
- Hyper-casual: 0.5-2%
- Casual: 1-3%
- Mid-core: 2-5%
- Hardcore: 5-15%
- F2P competitive: 2-8%

**First Purchase Timing:**
- % who buy on Day 0: High intent, tutorial purchase
- % who buy on Day 1: Onboarding convert
- % who buy Day 2-7: Post-engagement convert
- % who buy Day 8+: Long-tail converters

**How to Improve:**
- Reduce paywall friction (soft paywalls in onboarding)
- Tutorial purchase positioning (early, low-cost intro offers)
- Limited-time offers (FOMO mechanics)
- Price optimization ($0.99-4.99 for first purchase optimal)
- Cosmetic bundle appeal (easy to purchase)

**When it matters:** Monetization effectiveness, onboarding strategy, pricing optimization

---

### Lifetime Value (LTV)

**Definition:** Total net revenue expected from a player over entire lifespan.

**Formula (Simple):**
```
LTV = ARPU × Lifetime (in months)
```

**Formula (Advanced):**
```
LTV = Σ(Monthly ARPU × Month) / (1 + Discount Rate)^month
```

**Example:**
- Average player lifespan: 12 months
- Monthly ARPU: $1.20
- LTV = $1.20 × 12 = $14.40

**Cohort-Based LTV:**
Calculate separately by install source (Facebook, Google, Organic) to assess quality and adjust CPI.

**By Player Segment (Typical):**
- Whale LTV: $200-2000
- Dolphin LTV: $30-200
- Minnow LTV: $5-30
- Free player LTV: $0

**LTV Calculation by Day:**
- Day 1 LTV: Revenue in first 24 hours
- Day 7 LTV: Revenue through day 7 (acquisition cost comparison)
- Day 30 LTV: Revenue through day 30
- Lifetime LTV: All revenue until churn

**When it matters:** CPI budgeting, source quality assessment, player value prediction

---

## Acquisition Metrics

### Cost Per Install (CPI)

**Definition:** Average amount spent to acquire one installation.

**Formula:**
```
CPI = Total User Acquisition Spend / Installs
```

**Example:** $50,000 spend / 10,000 installs = $5.00 CPI

**Industry Benchmarks:**
- Hyper-casual: $0.10-0.50
- Casual: $0.50-2.00
- Mid-core: $1.00-5.00
- Hardcore: $3.00-15.00

**CPI by Channel:**
- Facebook/Instagram: $0.20-2.00 (volume, varied quality)
- Google App Campaigns: $0.30-3.00 (broad reach)
- TikTok: $0.15-1.50 (viral, young demographic)
- YouTube: $0.50-3.00 (brand play)
- Organic: $0 (reference baseline)
- Influencer: $2.00-10.00 (high quality, premium)

**CPI Payback Period:**
```
Payback = CPI / Daily ARPU
Example: $5 CPI / $0.10 daily ARPU = 50 days payback
```

**When it matters:** User acquisition budgeting, channel ROI comparison, growth strategy

---

### Return on Ad Spend (ROAS)

**Definition:** Revenue generated per dollar spent on user acquisition.

**Formula:**
```
ROAS = Revenue from campaign / Ad spend
(2:1 = $2 revenue per $1 spent)
```

**Example:** $50,000 revenue ÷ $10,000 ad spend = 5:1 ROAS

**Industry Benchmarks:**
- Healthy: 3:1 to 5:1
- Aggressive: 2:1 to 3:1
- Unsustainable: <2:1

**LTV:CPI Ratio:**
```
LTV:CPI ratio = LTV / CPI
Healthy: >3:1 ratio
```

**When it matters:** User acquisition ROI, budget allocation, channel prioritization

---

## Session Metrics

### Average Session Length (ASL)

**Definition:** Mean duration of gameplay per session.

**Formula:**
```
ASL = Total Session Duration / Total Sessions
```

**Example:** 500,000 minutes / 100,000 sessions = 5 minutes average

**Industry Benchmarks:**
- Hyper-casual: 2-5 minutes
- Casual: 5-20 minutes
- Mid-core: 15-45 minutes
- Hardcore: 45-180+ minutes
- Social/MMO: 30-120 minutes

**By Cohort Age:**
- Day 0-1 new: 3-8 minutes (onboarding)
- Day 7 players: 10-25 minutes (engaged)
- Day 30+ players: 20-60+ minutes (core)

**Session Length Decline Signal:**
- Weeks 1-2: Declining ASL predicts churn
- Month 2-3: Stabilization expected (core vs. casual split)
- Month 6+: Sustained decline = content drought risk

**How to Increase:**
- Progression systems (always something to work toward)
- Session-based rewards (complete dailies, events)
- Content depth (roguelike, procedural generation)
- Social features (guilds, competitive modes)
- Limited-time events (time-gated content)

**When it matters:** Content effectiveness, engagement depth, fun factor

---

### Sessions Per Day (SPD)

**Definition:** Average number of sessions per active player per day.

**Formula:**
```
SPD = Total Sessions / (DAU × 1 day)
    = Total Sessions per day / DAU
```

**Example:** 300,000 sessions / 100,000 DAU = 3.0 sessions per day

**Industry Benchmarks:**
- Casual: 1-2 sessions per day
- Mid-core: 2-4 sessions per day
- Hardcore: 3-6+ sessions per day

**Push Notification Impact:**
- With push: +15-25% session increase (when well-timed)
- Poorly timed: -5-10% (frustration, uninstall risk)

**Return Intervals:**
- Same-day return: % returning again after first session
- Next-day return: % returning on D1

**When it matters:** Push notification strategy, engagement optimization

---

## Churn & Retention Analysis

### Churn Rate

**Definition:** Percentage of players inactive for 30+ consecutive days.

**Formula:**
```
Monthly Churn % = Players inactive 30+ days / Starting players × 100
```

**Example:** 10,000 players inactive 30+ days / 100,000 starting = 10% monthly churn

**Industry Benchmarks:**
- Casual: 5-15% monthly
- Mid-core: 10-20% monthly
- Hardcore: 15-25% monthly
- Social/MMO: 10-15% monthly

**Churn Prediction Signals:**
- Session frequency decline (5x/wk → 3x/wk → 1x/wk)
- Session length shortening
- IAP spend cessation (for payers)
- Event participation drop
- Social feature disengagement

**Reactivation Windows:**
- 30+ days inactive: High churn risk (reactivation campaigns)
- 60+ days inactive: Severe churn (win-back required)
- 90+ days inactive: Zombie accounts (low recovery probability)
- 180+ days inactive: Consider uninstall rate high

**How to Reduce:**
- Retention at D1/D7/D30 (prevent early churn)
- Content roadmap visibility (keep players informed)
- Reactivation campaigns (new content, seasonal return)
- Win-back offers (discount cosmetics, free premium currency)
- Community features (social stickiness)

**When it matters:** Long-term sustainability, content planning, reactivation ROI

---

## Monetization Analysis Metrics

### Spending Distribution

**Typical Gaming Monetization Curve (Pareto):**
- Top 1-5% (Whales): 30-50% of revenue
- Next 5-10% (Dolphins): 20-30% of revenue
- Next 10-15% (Minnows): 15-25% of revenue
- Remaining 70-85% (Free): 0-10% of revenue

**By Cohort Age:**

| Cohort Age | Payer Rate | ARPPU | LTV |
|------------|-----------|-------|-----|
| Day 0-1 | 0.5-1.5% | $5-15 | $5-15 |
| Day 7 | 1-3% | $10-30 | $30-100 |
| Day 30 | 1.5-4% | $15-50 | $100-400 |
| Day 90+ | 2-5% | $20-100 | $200-1000+ |

**Whale Retention Critical:**
If whales churn, revenue impact is 20-50% of total. Protect top 1% players with:
- VIP status recognition
- Exclusive cosmetics
- Early access to content
- Direct customer support

**When it matters:** Revenue optimization, spending tier strategy, whale protection

---

## Advanced Metrics

### LTV:CPI Ratio

**Definition:** Lifetime value compared to acquisition cost; indicator of sustainable growth.

**Formula:**
```
LTV:CPI = LTV / CPI
Healthy: ≥3:1
Minimum: 1:1 (break-even)
```

**Example:** $14.40 LTV / $5.00 CPI = 2.88:1 ratio (below healthy threshold)

**Interpretation:**
- 5:1 or better: Strong profitability, can increase marketing spend
- 3:1: Healthy balance
- <2:1: Unsustainable, reduce CPI or improve retention

**When it matters:** Growth sustainability, marketing budget allocation

---

### Payer Activation Rate (First Purchase)

**Definition:** % of players converting to paying within specific timeframe.

**Formula:**
```
Payer Activation % = First Purchase players / Cohort size × 100
Within X days (0, 1, 7, 30)
```

**Industry Benchmarks:**
- Within Day 0: 0.5-1.5% (strong monetization design)
- Within Day 1: 1-3% (tutorial conversion)
- Within Day 7: 2-5%
- Within Day 30: 3-8%

**When it matters:** Monetization funnel effectiveness, tutorial design, first-purchase timing optimization

---

### Player Value Distribution

**Visualization (Typical):**
```
$1000+ LTV:  ████ (1%)
$100-1000:   ████████████ (5%)
$10-100:     ████████████████████ (15%)
$1-10:       ████████████████████████████ (25%)
$0:          ████████████████████████████████████ (54%)
```

**Segment Protection:**
- Top 1% = 20-30% revenue; protect with VIP program
- Next 4% = 20-30% revenue; nurture with engagement
- Next 15% = 15-25% revenue; monetization optimization
- Bottom 80% = 15-25% revenue; ads or conversion

**When it matters:** Segment strategy, monetization design, player protection

---

## KPI Monitoring Dashboard

| Metric | Today | Last Week | Last Month | Target | Status |
|--------|-------|-----------|------------|--------|--------|
| DAU | | | | | |
| MAU | | | | | |
| D1 Retention | | | | | |
| D7 Retention | | | | | |
| D30 Retention | | | | | |
| ARPU | | | | | |
| ARPPU | | | | | |
| Payer Rate | | | | | |
| LTV | | | | | |
| Churn Rate | | | | | |
| ASL (min) | | | | | |
| CPI | | | | | |
| ROAS | | | | | |
| LTV:CPI Ratio | | | | | |

Track these metrics daily/weekly to identify trends and respond to issues early.
