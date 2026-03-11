# Telecom KPI Glossary

Comprehensive reference for telecom, mobile carrier, and ISP key performance indicators with definitions, formulas, benchmarks, and subscriber analysis guidance.

## Revenue & Value Metrics

### Average Revenue Per User (ARPU)

**Definition:** Total revenue divided by average number of subscribers; primary health metric for carrier business.

**Formula:**
```
ARPU = Total Monthly Revenue / Average Subscribers in Month
ARPU = (Voice Revenue + Data Revenue + Device Revenue + Other) / Subs
```

**Example:**
- Total revenue: $100M
- Average subscribers: 2M
- ARPU = $100M / 2M = $50/month per subscriber

**Industry Benchmarks:**
- Developed markets: $30-80 per month
- Emerging markets: $5-20 per month
- Premium carriers: $60-120
- Budget carriers: $10-30
- MVNO/prepaid: $5-15

**ARPU Composition:**
- Voice: 20-35% (declining)
- Data: 40-60% (growing)
- Device: 5-15% (seasonal)
- Roaming: 5-10%
- Services/add-ons: 5-10%

**Time-Based ARPU:**
- **Monthly ARPU:** Current month average
- **Quarterly ARPU:** Rolling 3-month average (seasonality smoothing)
- **Annual ARPU:** Full year metric
- **Day 1 ARPU:** Revenue from new subscriber's first month (typically low)

**ARPU Trend Drivers:**
- Plan mix (upgrade to premium tiers)
- Data consumption growth
- Device attachment (subsidized devices boost short-term ARPU)
- Churn (loss of high-ARPU subscribers)
- Roaming (seasonal spikes)
- Add-on services (insurance, cloud, streaming bundles)

**Healthy ARPU Indicators:**
- Growing or stable month-over-month
- 5-10% annual growth through mix improvements
- Declining if mix is shifting to lower-tier plans

**When it matters:** Business health, profitability target, investor metrics, operator comparison

---

### Customer Lifetime Value (CLTV)

**Definition:** Total net profit expected from a subscriber over their entire relationship.

**Formula:**
```
CLTV = (Monthly ARPU × Months as customer - CAC) - Churn Cost
CLTV = Σ(Monthly ARPU) over lifetime / (1 + Discount Rate)^month
```

**Example:**
- Average subscriber lifetime: 48 months (4 years)
- Monthly ARPU: $45
- CAC: $100 (device subsidy, acquisition cost)
- CLTV = ($45 × 48) - $100 = $2,060

**Industry Benchmarks:**
- Postpaid smartphones: $1,500-3,500
- Broadband (home): $1,000-2,500
- Prepaid: $200-800
- MVNO: $150-600

**By Subscriber Segment:**
- Premium subscribers: $3,000+
- Mid-tier: $1,500-2,500
- Budget: $500-1,000
- Prepaid: $200-600

**CLTV Improvement:**
- Increase ARPU (plan upgrades, add-on services)
- Increase lifetime (reduce churn)
- Reduce CAC (more efficient marketing)
- Increase profitability margin

**When it matters:** Acquisition budget allocation, retention ROI, long-term value assessment

---

### Monthly Recurring Revenue (MRR)

**Definition:** Predictable monthly revenue from subscriptions (voice + data plans).

**Formula:**
```
MRR = Sum of all active subscriber monthly plan charges
MRR = Average Subscribers × Average Monthly ARPU
```

**Importance:** Stability metric for carriers (vs. device revenue which is lumpy)

---

## Subscriber Acquisition & Retention

### Subscriber Acquisition Cost (SAC)

**Definition:** Average cost to acquire one new subscriber.

**Formula:**
```
SAC = Total Acquisition Spending / New Subscribers
Includes: Marketing, device subsidies, activation costs, commissions
```

**Example:**
- Total acquisition spend: $50M
- New subscribers: 500,000
- SAC = $50M / 500,000 = $100 per subscriber

**Industry Benchmarks:**
- Postpaid (developed): $50-300 (heavy device subsidies)
- Postpaid (emerging): $20-100
- Prepaid: $10-50
- Broadband: $100-400
- MVNO: $20-80

**Payback Period:**
```
Payback = SAC / Monthly ARPU
Example: $100 SAC / $40 ARPU = 2.5 months to break even
```

**Device Subsidy Impact:**
- High subsidy ($300-500): Boosts short-term ARPU but increases CAC
- Low subsidy: Lower CAC but may reduce quality of subscribers

**Channel Costs:**
- Retail (physical stores): Highest cost
- Dealer/partner channels: Medium cost
- Online: Lower cost
- Direct mail: Medium-high cost

**When it matters:** Acquisition strategy, device subsidy decisions, channel mix optimization

---

### Subscriber Churn Rate

**Definition:** Percentage of subscribers who discontinue service during a period.

**Formula:**
```
Monthly Churn % = (Subscribers lost in month / Starting subscribers) × 100
Annualized Churn = 1 - (1 - Monthly Churn)^12
```

**Example:**
- Starting: 1,000,000 subscribers
- Lost during month: 10,000
- Monthly churn = 10,000 / 1,000,000 = 1.0%
- Annualized = 1 - (0.99)^12 = 11.4%

**Industry Benchmarks:**

| Segment | Monthly Rate | Annual Rate | Notes |
|---------|------------|------------|-------|
| Postpaid (contract) | 1-2% | 12-24% | Lowest (contract lock-in) |
| Postpaid (no contract) | 2-3% | 24-36% | Higher (flexibility) |
| Prepaid | 5-10% | 50%+ | Very high (low barrier) |
| Broadband (home) | 1.5-3% | 18-36% | Higher than mobile |
| MVNO | 4-8% | 45%+ | High (price-sensitive) |

**Churn by Tenure:**
- Month 1-3: 15-30% (highest churn, "regret" phase)
- Month 4-12: 2-5% (stabilization)
- Year 2+: 0.5-2% (committed subscribers, low risk)

**Churn Reasons (typical breakdown):**
- Switching carriers: 40-50%
- Service quality/coverage: 20-30%
- Price/billing: 15-20%
- Lifestyle change (moved, stopped using): 5-10%
- Death/account closure: 2-5%

**Churn Prediction Signals:**
- Usage decline (data, voice, frequency)
- Service complaint history
- Contract near expiration
- Missing device upgrade opportunity
- Roaming disputes (bill shock from overages)
- Network quality issues (outages, slow speeds)

**How to Reduce:**
- Improve network quality (#1 factor)
- Proactive churn management (win-back offers)
- Service improvement (customer care responsiveness)
- Plan fit optimization (right-size to prevent bill shock)
- Device upgrade programs (refresh commitment)
- Loyalty programs (reward longevity)

**When it matters:** Subscriber base stability, profitability, growth strategy, retention ROI

---

### Net Subscriber Addition (Gross Add - Churn)

**Definition:** Net change in subscriber base after accounting for new additions and losses.

**Formula:**
```
Net Adds = New Subscriber Additions - Subscriber Churn
```

**Example:**
- Gross new additions: 100,000
- Churn: 80,000
- Net adds: 20,000

**Importance:** Reported quarterly to investors; shows true growth (or decline)

---

## Usage & Engagement Metrics

### Minutes of Use (MOU)

**Definition:** Average monthly voice usage per subscriber; traditional measure of voice engagement.

**Formula:**
```
MOU = Total voice minutes in month / Total subscribers
(often expressed as per-subscriber-per-day: MOU/30)
```

**Example:**
- Total voice minutes: 500M
- Subscribers: 10M
- MOU = 500M / 10M = 50 minutes/subscriber/month

**Industry Benchmarks:**
- Developed markets: 300-600 MOU (declining due to messaging/data)
- Emerging markets: 100-300 MOU
- Business segments: Higher (500+ MOU)
- Casual users: Lower (50-150 MOU)

**MOU Trends:**
- Declining globally as messaging/data replace voice
- Still important for elderly demographics
- Indicator of engagement (high MOU = sticky user)

**Voice Usage by Time:**
- Weekday peak: 8-9am, 12-1pm, 5-6pm (work hours)
- Weekend: Evening hours 6-8pm (social)
- International roaming: Lower usage (cost barrier)

**When it matters:** Voice service quality focus, elderly segment understanding, legacy service optimization

---

### Data Consumption per User

**Definition:** Average monthly data usage per subscriber.

**Formula:**
```
Data per user = Total data (GB) in month / Total subscribers
```

**Example:**
- Total data: 10 petabytes (10M GB)
- Subscribers: 5M
- Per user = 10M GB / 5M = 2GB per user

**Industry Benchmarks:**
- Developed markets: 5-15 GB/month (growing)
- Emerging markets: 1-5 GB/month
- High-value segments: 10-30 GB/month
- Budget segments: <1 GB/month

**Data Growth Rate:**
- Annual growth: 30-50% (consumption increasing)
- 5G impact: 20-40% uplift expected (faster speeds enable more usage)

**Data by Usage Type:**
- Video: 60-70% (streaming, social)
- Social/messaging: 10-15%
- Web browsing: 5-10%
- Cloud/backup: 3-5%
- Other: 5-10%

**Data Overage Analysis:**
- % subscribers hitting data limit: High churn risk
- Overage charges: Revenue but increases churn risk
- Plan right-sizing: Critical to prevent bill shock churn

**Network Capacity Planning:**
- High consumption growth requires infrastructure investment
- 5G capacity: Can handle 10x+ more data than 4G
- Congestion periods: Evening hours, weekends (video peak)

**When it matters:** Network capacity planning, plan tier optimization, overage management

---

### Roaming Revenue

**Definition:** Revenue from subscribers using service outside home country.

**Formula:**
```
Roaming Revenue = Roaming minutes + Roaming data + SMS
(typically weighted higher than domestic rates)
```

**Seasonality:**
- Summer (June-Aug): +50-100% (vacation)
- Winter holidays (Dec): +30-50% (family visits)
- Easter/spring (Apr): +20-40% (breaks)
- Otherwise: +5-10% baseline

**Roaming Rates:**
- Incoming (termination): $0.10-0.50 per minute
- Outgoing: $0.50-3.00 per minute (high margin)
- Data: $2-10 per MB (very high margins)
- SMS: $0.25-1.00 per message

**Roaming Revenue Trends:**
- Declining due to competitive pressure and regulation (EU caps roaming)
- Focus shifting to travel bundles (daily/monthly passes)
- Regional roaming (single plan across countries) growing

**Roaming Monetization Tactics:**
- Affordable roaming bundles (still high-margin)
- Destination-specific passes (flexibility)
- Loyalty roaming bonuses (VIP treatment)
- Regional carrier partnerships (seamless roaming)

**When it matters:** International revenue, travel segment monetization, seasonal revenue planning

---

## Network & Service Quality Metrics

### Network Quality Score (NQS) / RAN Metrics

**Definition:** Composite measure of network performance: coverage, speed, reliability.

**Components:**
- **Coverage %:** Geographic area with serviceable signal
- **Speed:** Average download/upload speeds (Mbps)
- **Reliability:** Call drop rate, data connection stability
- **Latency:** Response time (critical for 5G)

**Industry Standards:**
- 4G LTE: 10-50 Mbps download target
- 5G: 100-500+ Mbps download target
- Call drop rate: <1% target
- Availability: >99.9% target

**Network Quality Impact on Churn:**
- Poor network quality: Top reason for churn (20-30%)
- Quality improvement: -1-3% churn reduction
- 5G adoption: Improves quality perception, reduces churn

**Regional Network Quality Variation:**
- Urban: Excellent quality, highest speed
- Suburban: Good quality, variable speed
- Rural: Coverage gaps, lower speed (legacy tech)

**When it matters:** Churn analysis, competitive positioning, infrastructure investment ROI, service quality messaging

---

## Plan & Device Metrics

### Plan Upgrade Rate

**Definition:** Percentage of subscribers moving to higher-tier plans.

**Formula:**
```
Plan Upgrade % = Upgrades to premium / Total eligible subscribers × 100
```

**Example:**
- Subscribers eligible for upgrade: 100,000
- Upgrades to higher tier: 5,000
- Upgrade rate = 5%

**Industry Benchmarks:**
- Healthy carriers: 3-8% annual upgrade rate
- Stagnant carriers: <2%
- Growth mode: 5-10%

**Upgrade Drivers:**
- Data consumption growth (need larger allowance)
- Speed improvements (4G→5G, fiber speeds)
- Device capability (newer phones need more data)
- Competitive offers
- Life changes (home size, family growth)

**Plan Mix Evolution:**
- Unlimited plans: Growing (easier to consume more, higher ARPU)
- Tiered data plans: Declining (increasingly commoditized)
- Family plans: Growing (better ARPU, lower churn)

**When it matters:** ARPU growth strategy, plan design, marketing ROI

---

### Device Upgrade Rate

**Definition:** Percentage of eligible subscribers completing device upgrade.

**Formula:**
```
Device Upgrade % = Subscribers who upgraded device / Eligible subscribers × 100
```

**Upgrade Eligibility:**
- Contract-based: Upgrade after 24 months (varies by carrier)
- Monthly service: Eligible after 12-18 months
- Trade-in programs: Always eligible (no waiting)

**Industry Benchmarks:**
- Annual upgrade rate: 30-40% (varies by region)
- Among eligible: 50-70%
- Premium devices: 20-25% attach rate
- Budget devices: 40-50% attach rate

**Upgrade Cycle Timing:**
- Flagship launches (September, February): Peak upgrades
- Black Friday/holidays: Secondary peak
- Contract renewal: Bundled upgrade incentives

**Device Finance Models:**
- Full subsidy: Customer doesn't pay (locked pricing, high CAC)
- Partial subsidy: Customer pays difference
- Installment plans: Customer pays full price over 24-36 months
- Bring-your-own-device (BYOD): No subsidy, lower CAC

**Post-Upgrade Outcomes:**
- Positive: Refreshed device = improved experience, reduced churn
- Negative: Extended contract = locked in (reduced flexibility)
- Revenue: Device sales + future-locked ARPU commitment

**When it matters:** Device strategy, upgrade campaign ROI, device inventory planning

---

## Service Quality & Satisfaction Metrics

### Net Promoter Score (NPS)

**Definition:** Measure of customer satisfaction and recommendation likelihood (-100 to +100).

**Formula:**
```
NPS = % Promoters (9-10) - % Detractors (0-6)
Range: -100 to +100
```

**Example:**
- 50% promoters (score 9-10)
- 20% detractors (score 0-6)
- NPS = 50% - 20% = +30

**Industry Benchmarks:**
- Excellent: +50 or higher
- Good: +30 to +50
- Average: 0 to +30
- Poor: Below 0

**Telecom-Specific Insights:**
- Lowest NPS industry (many customers dissatisfied with billing, service)
- Network quality drives NPS
- Customer service responsiveness impacts NPS heavily
- Billing disputes major NPS driver

**NPS Correlation with Churn:**
- Promoters: Low churn (5-10% annual)
- Passives: Medium churn (15-25% annual)
- Detractors: High churn (30-50% annual)

**How to Improve:**
- Network quality (coverage, speed, reliability)
- Billing clarity (avoid bill shock)
- Customer service training (resolution speed)
- Plan transparency (no hidden fees)
- Proactive communication (outages, quality issues)

**When it matters:** Service quality focus, customer satisfaction tracking, churn prediction

---

## Contract & Lifecycle Metrics

### Contract Renewal Rate

**Definition:** Percentage of customers renewing contracts at expiration.

**Formula:**
```
Renewal Rate % = Renewals / Eligible for renewal × 100
```

**Example:**
- Eligible for renewal: 50,000 subscribers
- Renewals: 40,000
- Renewal rate = 80%

**Industry Benchmarks:**
- Healthy: 75-85%
- Strong: 85-95%
- Below 75%: Churn/switching problem

**Renewal Window Timing:**
- Months 23-25: Contract approaching expiration
- Month 24-25: Renewal offers peak (lock-in incentives)
- Month 26+: Post-expiration (month-to-month, high churn risk)

**Renewal Incentives:**
- Device upgrade discounts (most effective)
- Plan bundle offers (data + device combined)
- Loyalty bonuses (free month, service credits)
- Price locks (lock rate for 12+ months)

**Non-Renewal Consequences:**
- Month-to-month customers: 2-3x higher monthly churn
- Vulnerable to competitive switching
- May downgrade plans (higher churn, lower ARPU)

**When it matters:** Churn prevention, contract management, loyalty program design

---

### Overage Management

**Definition:** Tracking and management of customers exceeding plan limits.

**Key Metrics:**
- % subscribers hitting limit: Indicates plan fit problems
- Average overage amount: Per-overage customer revenue
- Overage complaint rate: Potential churn signal
- Overage acceptance rate: % willing to pay vs. downgrade

**Overage Types:**
- Data overage: High revenue but major churn risk ($100+ bills)
- International roaming: High revenue, strong churn risk if unexpected
- Voice overage: Rare in modern plans

**Overage Strategy:**
- Soft cap: Warn but allow (customer choice, reduces surprise)
- Hard cap: Block service (prevents bill shock)
- Upgrade nudge: Suggest plan upgrade before hitting limit
- Throttle: Slow speed but allow data (less harsh than block)

**When it matters:** Churn prevention, customer experience, bill shock management

---

## KPI Dashboard Template

| Metric | This Month | Last Month | Last Year | Target | Trend |
|--------|-----------|-----------|-----------|--------|-------|
| ARPU | | | | | |
| Churn Rate % | | | | | |
| Net Subscriber Adds | | | | | |
| Data per User (GB) | | | | | |
| Device Upgrade Rate | | | | | |
| Plan Upgrade Rate | | | | | |
| Roaming Revenue | | | | | |
| NPS | | | | | |
| Network Quality Score | | | | | |
| Contract Renewal Rate | | | | | |
| SAC | | | | | |
| CLTV | | | | | |

Track these metrics monthly and segment by: subscriber type (postpaid/prepaid), tenure, ARPU tier, geographic region, device type.
