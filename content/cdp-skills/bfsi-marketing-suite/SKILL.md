---
name: bfsi-marketing-suite
description: Entry point for banking, financial services, insurance, and fintech marketing. Orchestrates financial product lifecycle strategies from acquisition through cross-sell optimization and retention. Handles wealth tier segmentation, regulatory compliance considerations, product affinity analysis, and customer risk profiling. Routes users to core CDP skills (audience-finder, churn-finder, lookalike-finder, data-enricher, data-analyzer, journey-recommender, data-scientist) with BFSI-specific context and KPI frameworks for CLTV, products per customer, AUM, NII, NPA ratios, and cross-sell rates.
---

# BFSI Marketing Suite

The BFSI (Banking, Financial Services, Insurance) Marketing Suite is your orchestrator for financial institutions marketing within Zeotap CDP. Whether you're launching a lending campaign, building wealth tier segments, preventing customer attrition, or optimizing cross-sell opportunities, this skill routes you to the right CDP capabilities with financial services guidance.

## When to Use This Skill

**Trigger Keywords:** accounts, deposits, loans, credit cards, insurance, investment, wealth, mortgage, savings, cross-sell, KYC (Know Your Customer), compliance, CLTV, AUM (Assets Under Management), products per customer, churn, customer risk, CRAR, NPA (Non-Performing Assets), financial health, net worth, LTV (Loan-to-Value), DSR (Debt Service Ratio).

**Common Scenarios:**
- Create wealth tier segments for targeted offerings
- Prevent high-net-worth customer churn
- Cross-sell lending products to deposit customers
- Identify mortgage-ready customers (life event triggers)
- Build insurance penetration segments (underinsured customers)
- Optimize credit card spend tiers
- Compliance-driven marketing (regulatory requirements)
- Analyze customer financial health for risk assessment

## Financial Product Lifecycle

### 1. Acquisition Phase
**Objective:** Acquire new customers, maximize account opening
- **Timing:** New year (resolutions), tax season, bonus season, life events
- **Audience strategy:** Lookalike audiences (high-value customers), life event triggers (marriage, home purchase, career change), competitor switching
- **Key metric:** CAC (Customer Acquisition Cost), new account cost, activation rate
- **Route to:** `cdp-lookalike-finder` (find customers similar to valuable ones)

### 2. Account Activation & KYC Phase
**Objective:** Verify identity, complete KYC (Know Your Customer), activate products
- **Timing:** First 30 days post-account opening
- **Audience strategy:** New account holders awaiting verification, document submission tracking
- **Key metrics:** KYC completion rate, account activation rate, first deposit amount
- **Regulatory note:** KYC compliance mandatory; route to Data Scientist for risk assessment if needed
- **Route to:** `cdp-audience-finder` (segment by KYC status), `cdp-data-enricher` (add KYC data)

### 3. Primary Product Phase
**Objective:** Drive usage of primary product (savings, checking, lending)
- **Timing:** Month 1-3 (establish usage)
- **Audience strategy:** New customers by account type, transaction frequency, deposit patterns
- **Key metrics:** Monthly transaction count, average balance, product usage frequency
- **Route to:** `cdp-data-analyzer` (usage pattern analysis), `cdp-journey-recommender` (optimal engagement sequence)

### 4. Cross-Sell & Upsell Phase
**Objective:** Sell complementary products, increase products per customer
- **Timing:** Months 3-12 (after primary product stability)
- **Audience strategy:** Customers by account balance, credit profile, life events, product affinity
- **Key metrics:** Products per customer, cross-sell attachment rate, product penetration
- **Cross-sell Examples:**
  - Deposit customers → Lending (mortgage, auto, personal loan)
  - Credit card holders → Insurance (card protection, travel insurance)
  - Savings account → Investment (mutual funds, bonds, stocks)
  - Loan customers → Deposit (primary account upgrade)
- **Route to:** `cdp-audience-finder` (cross-sell candidates), `cdp-data-enricher` (financial profile)

### 5. Wealth Tier & Relationship Phase
**Objective:** Segment by wealth tier, personalize offerings, build relationships
- **Timing:** Ongoing (wealth tier moves dynamically)
- **Audience strategy:** Wealth tier segmentation (mass market, affluent, HNI, UHNW), relationship manager assignments
- **Key metrics:** CLTV, products per customer, AUM, wallet share
- **Wealth Tier Tiers:**
  - **Mass Market:** <$100k AUM, basic products, digital-first
  - **Affluent:** $100k-$1M AUM, multiple products, relationship support
  - **HNI (High Net Worth):** $1M-$10M AUM, wealth management, dedicated advisory
  - **UHNW (Ultra HNI):** $10M+ AUM, private banking, bespoke solutions
- **Route to:** `cdp-audience-finder` (wealth tier segmentation), `cdp-data-enricher` (AUM tracking)

### 6. Retention & Loyalty Phase
**Objective:** Maximize customer lifetime value, prevent competitive switching
- **Timing:** Ongoing (year 2+)
- **Audience strategy:** High-value segments, long-tenure customers, loyalty program members
- **Key metrics:** CLTV, churn rate, NPS, product loyalty
- **Route to:** `cdp-churn-finder` (identify at-risk), `cdp-audience-finder` (loyalty tiers)

### 7. Compliance & Risk Phase
**Objective:** Ensure regulatory compliance, manage customer risk
- **Timing:** Ongoing, real-time
- **Audience strategy:** Risk-based segmentation, AML (Anti-Money Laundering) flags, KYC update triggers
- **Key metrics:** Compliance rate, risk rating distribution
- **Route to:** `cdp-data-scientist` (risk modeling), `cdp-data-analyzer` (compliance monitoring)

## Skill Routing Guide

### Scenario Examples

**"Identify high-net-worth customers at risk of switching - prevent churn"**
→ Use **cdp-churn-finder** with filters: AUM > $1M, product usage decline, service quality complaints, competitive marketing exposure. Focus on: relationship satisfaction, product switching patterns, advisor tenure changes.

**"Find mass-market customers ready for mortgage - life event triggers"**
→ Use **cdp-audience-finder** with triggers: marriage date, home search activity, age 25-45, household income $75k+, employment stability, credit score improvement trend. Use **cdp-data-enricher** to add lifestyle signals.

**"Create wealth tier segments for personalized offerings"**
→ Use **cdp-audience-finder** with AUM/net worth segmentation:
- Mass: <$100k deposits + investments
- Affluent: $100k-$1M total products
- HNI: $1M-$10M AUM + multiple advisory relationships
- Design tier-specific campaigns per **kpi-glossary.md** wealth tiers

**"Build lookalike audience for high-value customer acquisition"**
→ Use **cdp-lookalike-finder** with best customers (CLTV > $500k, 10+ products, $2M+ AUM). Define lookalikes by: income, age, education, profession, investment behavior, savings rate.

**"Analyze why insurance penetration is low - who's underinsured?"**
→ Use **cdp-data-analyzer** to identify: customers with high account balances/loans but no insurance, life stage (young families = insurance need), product portfolio gaps. Route to: targeted insurance campaigns.

**"Design cross-sell sequence for new deposit customers → lending"**
→ Use **cdp-journey-recommender** to map: optimal timing for lending offer (after 3-6 months stability), offer type (loan size based on balance), channel (app vs. advisor). Use **cdp-data-enricher** for credit scoring.

**"Prevent churn during economic stress - who's vulnerable?"**
→ Use **cdp-churn-finder** to identify: declining balance trends, missed payments, NPA signals, switching behavior. Route to: proactive retention (rate locks, balance transfer incentives, advisory calls).

## Key BFSI KPIs

Load **kpi-glossary.md** for complete definitions, formulas, and benchmarks:

| KPI | Definition | Business Impact |
|-----|-----------|-----------------|
| **CLTV** | Customer Lifetime Value | Long-term profitability per customer |
| **Products per Customer** | Avg # products held | Cross-sell effectiveness, stickiness |
| **AUM** | Assets Under Management | Wealth management business scale |
| **NII** | Net Interest Income | Core lending profitability |
| **CAC** | Customer Acquisition Cost | Acquisition efficiency |
| **Churn Rate** | % customers leaving | Retention health |
| **NPA Ratio** | Non-Performing Assets % | Loan portfolio quality |
| **Cross-sell Rate** | % purchasing additional products | Growth opportunity |
| **Digital Adoption** | % using mobile/online | Digital transformation health |
| **NPS** | Net Promoter Score | Customer satisfaction |

## Common BFSI Use Case Matrix

| Use Case | Primary Skill | Secondary Skill | Reference |
|----------|---------------|-----------------|-----------|
| Prevent HNI churn | cdp-churn-finder | cdp-data-enricher | kpi-glossary.md (CLTV) |
| Mortgage cross-sell | cdp-audience-finder | cdp-journey-recommender | seasonal-calendar.md (life events) |
| Wealth tier segmentation | cdp-audience-finder | cdp-data-analyzer | kpi-glossary.md (AUM tiers) |
| Insurance penetration | cdp-data-analyzer | cdp-audience-finder | kpi-glossary.md (underinsurance) |
| Credit card spend upgrade | cdp-audience-finder | cdp-data-enricher | kpi-glossary.md (spend tiers) |
| Loan portfolio risk | cdp-data-scientist | cdp-data-analyzer | kpi-glossary.md (NPA) |
| Digital adoption push | cdp-audience-finder | cdp-journey-recommender | seasonal-calendar.md |
| Tax planning cross-sell | cdp-audience-finder | cdp-data-analyzer | seasonal-calendar.md (tax season) |

## Regulatory Compliance Framework

### KYC (Know Your Customer)
- Required at account opening
- Updated periodically (annual minimum)
- Enhanced KYC for high-value customers
- Triggers: significant wealth increase, business nature change

### AML (Anti-Money Laundering)
- Real-time monitoring of transactions
- Suspicious Activity Reports (SAR) if triggered
- Transaction pattern monitoring

### GDPR/Privacy Compliance
- Explicit consent for marketing
- Data retention limits
- Right to deletion (with exceptions)

### Responsible Lending
- Affordability assessments
- Income verification
- Fair lending practices (no discrimination)

### Risk Management
- Credit risk assessment
- Operational risk monitoring
- Compliance risk tracking

---

## Wealth Tier Segmentation Framework

### Mass Market ($0-$100k)
- **Products:** Savings account, debit card, basic loans
- **Channel:** Digital-first, self-service, chatbot support
- **Campaigns:** Automated, digital, low cost
- **Lifetime value:** Low ($5k-20k)

### Affluent ($100k-$1M)
- **Products:** Multiple deposits, credit cards, mortgages, basic investment
- **Channel:** Mobile app, online platform, occasional in-branch
- **Campaigns:** Segmented digital, targeted offers, mobile-first
- **Lifetime value:** Medium ($50k-200k)

### HNI ($1M-$10M)
- **Products:** Investment accounts, wealth management, business banking, insurance
- **Channel:** Dedicated relationship manager, quarterly reviews, private events
- **Campaigns:** Personalized, advisor-supported, bespoke solutions
- **Lifetime value:** High ($200k-$1M)

### UHNW ($10M+)
- **Products:** Private banking, estate planning, offshore accounts, exclusive investments
- **Channel:** Senior advisor, C-suite access, concierge services
- **Campaigns:** VIP events, philanthropic focus, bespoke financial planning
- **Lifetime value:** Very high ($1M-$5M+)

## Reference Files

- **seasonal-calendar.md** - Financial year events (tax season, bonus season, financial year-end), product-specific campaigns, regulatory calendars, life event triggers
- **kpi-glossary.md** - Detailed KPI definitions, formulas, industry benchmarks, wealth tier benchmarks, NPA analysis, cross-sell metrics

## Next Steps

1. **Identify your campaign objective** - Acquisition? Cross-sell? Churn prevention? Wealth management? Regulatory compliance?
2. **Load the appropriate reference** - Use seasonal-calendar.md for timing, kpi-glossary.md for metrics
3. **Select your skill** - Route to the orchestrator suggested in the matrix above
4. **Define your segments** - Use wealth tier framework and CDP skills for precise audience targeting
5. **Ensure compliance** - Always verify regulatory requirements (KYC, AML, fair lending, privacy)
6. **Measure & iterate** - Track the BFSI-specific KPIs relevant to your campaign

---

**Advanced Features:**
- Propensity modeling: Predict likelihood of product purchase (Data Scientist)
- Credit risk scoring: Assess loan default probability (Data Scientist)
- Customer lifetime value prediction: Forecast long-term profitability (Data Scientist)
- Churn prediction: Identify at-risk customers before they leave (Churn-Finder + Data Scientist)
- Product affinity analysis: Understand which products customers prefer together (Data Analyzer)
- Life event triggers: Marriage, home purchase, career change correlations (Journey Recommender)

**Compliance Reminders:**
- All marketing must comply with KYC/AML regulations
- Lending decisions cannot discriminate based on protected characteristics
- Customer data must be handled per GDPR/local privacy laws
- Clear disclosure required for all product terms
- Fair pricing without predatory practices

**Questions?** Check the reference files or escalate to a Data Scientist for propensity modeling, credit risk assessment, or complex compliance scenarios.
