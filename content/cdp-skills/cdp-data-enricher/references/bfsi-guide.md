# BFSI Data Enricher Guide

## Overview
Enrichment playbook for banking, financial services, and insurance, emphasizing wealth trajectory, life stage indicators, and cross-sell readiness.

## Core Enrichment Attributes

### 1. Wealth Growth Trajectory

**Definition:** Customer's financial asset growth pattern and wealth progression
**Dimensions:** Account balance growth, income level, savings rate, investment activity

**Metrics to Calculate:**
- Current account balance (primary deposit balance)
- 12-month balance growth (% change)
- Average account balance (over time period)
- Savings rate (deposit frequency and amount)
- Investment portfolio value (if customer has investments)
- Net worth estimate (accounts + investments - liabilities)
- Wealth velocity (speed of accumulation)

**Trajectory Classification:**
- Declining wealth: Negative balance growth over 12 months
- Stable wealth: 0-5% annual growth
- Growing wealth: 5-20% annual growth
- Accelerating wealth: 20%+ annual growth
- High net worth: Portfolio > $250K

**Growth Drivers Analysis:**
- Salary deposits (regular income pattern)
- Investment contributions (savings discipline)
- Interest income (engaged investor)
- Loan repayments (debt reduction)
- Volatility (inconsistent pattern)

**Data Sources:**
- Account transaction history
- Balance statement records
- Investment portfolio data (if applicable)
- Income deposits and patterns
- use `feature_analysis` to calculate wealth percentiles

**Enrichment Output:**
- Wealth growth score (1-5 scale)
- Annual wealth growth rate (%)
- Projected wealth growth (12-month forecast)
- Wealth tier (emerging/established/affluent/high-net-worth)
- Income stability indicator (consistent/variable)

### 2. Product Affinity Score

**Definition:** Propensity to adopt specific banking/financial products
**Products:** Savings accounts, credit cards, loans, investments, insurance, wealth management

**Metrics to Calculate:**
- Product count (number of products held)
- Product adoption sequence (order of product purchases)
- Product usage intensity (activity level per product)
- Product retention (average product tenure)
- Cross-sell readiness (gap between current and potential products)
- Product profitability (revenue generated per product)

**Affinity Calculation by Product Type:**
- Savings products: Balance growth, deposit frequency
- Credit products: Utilization, repayment behavior, credit score
- Investment products: Portfolio activity, diversification
- Insurance products: Coverage types, premium payment reliability
- Lending products: Debt service ratio, repayment history

**Affinity Scoring (1-5):**
- 5 (High affinity): Active user, positive history
- 4 (Good affinity): Regular usage, good standing
- 3 (Moderate affinity): Occasional usage
- 2 (Low affinity): Minimal engagement
- 1 (No affinity): Not suitable or no interest

**Data Sources:**
- Product database and customer holdings
- Transaction activity logs
- Account statements
- Credit bureau data (if available)
- use `query_builder` for cross-product analysis

**Enrichment Output:**
- Primary products (list by usage)
- Product gap analysis (missing products from profile)
- Next recommended product (highest probability cross-sell)
- Product affinity score (1-5 for each product type)
- Cross-sell revenue opportunity estimate ($)

### 3. Digital Maturity Index

**Definition:** Customer's comfort and adoption of digital banking and financial services
**Dimensions:** Digital engagement, app usage, online transaction frequency, digital literacy

**Metrics to Calculate:**
- Digital channel usage frequency (mobile app, web, online)
- Transaction mix (% digital vs branch vs phone)
- Feature adoption (bill pay, fund transfer, etc.)
- Digital engagement score (logins/week, actions/session)
- Online banking literacy (advanced features usage)
- Payment method (digital wallets, cards, etc.)
- Customer service channel preference (digital vs human)

**Maturity Levels:**
- Low (1): Minimal digital activity, branch/phone dependent
- Beginner (2): Starting to use digital, infrequent
- Intermediate (3): Regular digital user, comfortable with basics
- Advanced (4): Heavy digital user, advanced features
- Expert (5): Digital-first customer, uses automation features

**Digital Transformation Stage:**
- Assess readiness for automation, real-time notifications, robo-advice
- Identify barriers to digital adoption (age, tech-phobia, preference)
- Opportunity for digital product recommendations

**Data Sources:**
- Digital channel activity logs (app, web, ATM)
- Transaction records by channel
- Feature usage tracking
- Device and login patterns
- use `time_travel` to track digital adoption trends

**Enrichment Output:**
- Digital maturity score (1-5)
- Primary digital channel (mobile/web/branch)
- Advanced feature adoption rate (%)
- Digital engagement trend (increasing/stable/declining)
- Recommendation (digital service suggestions or support needs)

### 4. Risk Tolerance Profile

**Definition:** Customer's financial risk appetite and investment decision-making preferences
**Dimensions:** Investment style, debt comfort level, insurance coverage, emergency preparedness

**Metrics to Calculate:**
- Portfolio risk profile (conservative/moderate/aggressive)
- Equity vs fixed income allocation (%)
- Currency/forex exposure (domestic vs international)
- Debt-to-income ratio (leverage level)
- Emergency fund presence (6-month savings indicator)
- Insurance coverage adequacy (life, health, property)
- Credit utilization (debt behavior)

**Risk Assessment:**
- Investment risk appetite: Based on portfolio composition
- Credit risk: Based on debt levels and payment history
- Insurance risk: Based on coverage gaps
- Behavioral risk: Based on financial decision patterns

**Risk Tolerance Score (1-5):**
- 1 (Conservative): Fixed income, minimal leverage, comprehensive insurance
- 2 (Cautious): Mixed portfolio, low leverage
- 3 (Balanced): Moderate equity exposure, moderate leverage
- 4 (Growth-oriented): High equity exposure, comfortable with leverage
- 5 (Aggressive): High-risk investments, significant leverage

**Life Stage Adjustment:**
- Adjust risk tolerance based on age, income, family status
- Younger customers: Higher growth tolerance
- Pre-retirement: Shift toward conservative
- Retirees: Capital preservation focus

**Data Sources:**
- Investment portfolio holdings
- Debt records and utilization
- Insurance policy information
- Credit history and payment patterns
- use `feature_analysis` for risk clustering

**Enrichment Output:**
- Risk tolerance tier (conservative/moderate/aggressive)
- Risk profile score (1-5)
- Portfolio allocation recommendation
- Insurance coverage gaps (list)
- Investment product recommendations

### 5. Life Stage Indicators

**Definition:** Behavioral and demographic signals indicating customer life stage
**Life Stages:** Student, early career, family building, mid-career, pre-retirement, retired

**Metrics to Calculate:**
- Age (primary indicator)
- Income level (salary deposits, transaction size)
- Debt profile (student loans, mortgage, auto loans)
- Family status (household size inference, children indicators)
- Asset accumulation (savings rate, investment activity)
- Spending patterns (recurring expenses, lifestyle)

**Life Stage Inference:**
- Age bands combined with income and debt patterns
- Education loan presence (student/early career)
- Mortgage presence (family building/mid-career)
- Retirement account activity (pre-retirement/retired)
- Spending patterns confirming stage hypothesis

**Life Stage Segments:**
- Student: Age 18-25, student loans, minimal balance
- Early career: Age 25-35, growing income, debt building
- Family building: Age 30-45, mortgage, children, multi-product
- Mid-career: Age 40-55, peak earning, investment focus
- Pre-retirement: Age 55-65, wealth preservation, insurance needs
- Retired: Age 65+, fixed income, capital preservation

**Stage-Based Needs Analysis:**
- Identify product needs by stage
- Project future product adoption
- Time marketing messages appropriately

**Data Sources:**
- Customer demographic data
- Transaction history and patterns
- Account balances and growth
- Loan portfolio
- use `schema_discovery` to map account structure

**Enrichment Output:**
- Inferred life stage (category + confidence %)
- Age group (if known)
- Family indicators (children, household size)
- Current financial priorities (by stage)
- Next likely life stage transition (timeline)

### 6. Cross-Sell Readiness Score

**Definition:** Likelihood and timing for additional product adoption
**Readiness Factors:** Product need, financial capacity, digital readiness, engagement level

**Metrics to Calculate:**
- Product gap (unmet banking needs)
- Financial capacity (balance/income sufficient for product)
- Digital readiness (comfort with product channels)
- Engagement score (relationship strength)
- Time since last acquisition (window for next product)
- Risk profile fit (product suitable for risk tolerance)
- Life stage alignment (product timing for life stage)

**Cross-Sell Opportunity Matrix:**
- Rank products by readiness (highest probability first)
- Estimate propensity for each product (%)
- Identify barriers to adoption (if any)
- Recommend intervention/support needed

**Readiness Scoring (1-5 for each product):**
- 5 (Ready now): All factors aligned, immediate offer
- 4 (Ready soon): Mostly aligned, 1-2 week window
- 3 (Potentially ready): Several factors positive, 1-3 month window
- 2 (Future readiness): 3-12 month window
- 1 (Not ready): Barriers exist, defer or support needed

**Data Sources:**
- Product holding records
- Account analysis (balance, income, debt)
- Engagement metrics (login, transaction frequency)
- Life stage indicators
- use `query_builder` for cross-sell ROI modeling

**Enrichment Output:**
- Top 3 products by readiness (ranked)
- Readiness score for each priority product (1-5)
- Recommended offer timing (now/soon/future)
- Estimated conversion probability (%)
- Expected revenue impact (annual value)

### 7. Channel Preference Evolution

**Definition:** Customer's preferred communication and service channels over time
**Evolution:** Tracking shift from traditional to digital or vice versa

**Metrics to Calculate:**
- Primary channel (where customer prefers engagement)
- Secondary channel (backup preference)
- Channel usage frequency (interactions per month by channel)
- Channel switching rate (changes in preference over time)
- Omnichannel adoption (uses 3+ channels)
- Response rate by channel (engagement rate)
- Optimal engagement window (preferred time/day)

**Channel Categories:**
- Branch visits (in-person)
- Phone calls (human agent)
- Email (asynchronous)
- Mobile app (digital self-service)
- Web (digital self-service)
- SMS (messaging)
- Social media (digital engagement)
- Video call (digital human interaction)

**Preference Evolution Trends:**
- Traditional to digital (shifting to app/web)
- Branch reduction (fewer in-person visits)
- Omnichannel adoption (integrated experience)
- Self-service preference (lower cost channels)

**Communication Preference:**
- Frequency preference (weekly/monthly contact acceptable)
- Content preference (offers, education, updates, alerts)
- Timing preference (morning/evening, weekday/weekend)

**Data Sources:**
- Customer interaction history (all channels)
- Response rate tracking
- Engagement metrics by channel
- use `get_detailed_events` for channel event analysis

**Enrichment Output:**
- Primary channel (name + usage %)
- Secondary channel (if applicable)
- Channel evolution trend (traditional to digital)
- Optimal contact window (day/time)
- Omnichannel readiness (yes/no)
- Recommended engagement channel mix

### 8. Complaint Sensitivity Score

**Definition:** Customer's propensity to escalate concerns and likelihood to churn from poor service
**Sensitivity Factors:** Complaint frequency, complaint severity, resolution satisfaction, brand loyalty

**Metrics to Calculate:**
- Complaint frequency (complaints per year)
- Complaint types (billing, service, product issues)
- Resolution satisfaction (resolved to customer satisfaction)
- Complaint escalation rate (% escalated to higher level)
- Time to resolution (average days to close)
- Repeat complaint rate (same issue multiple times)
- Churn prediction after complaint (propensity to leave)

**Sensitivity Tiers:**
- Low (1): Few complaints, easy to resolve, loyal
- Low-medium (2): Occasional complaints, reasonable expectations
- Medium (3): Moderate complaints, some sensitivity
- Medium-high (4): Frequent complaints, high expectations
- High (5): Very frequent complaints, churn risk

**Complaint Driver Analysis:**
- Service quality issues
- Billing discrepancies
- Product feature problems
- Customer service quality
- Billing/collections experience

**Churn Risk Assessment:**
- Strong complaint correlation with churn
- Monitor complaint-to-churn pipeline
- Identify complaint patterns preceding churns
- Priority support for high-sensitivity customers

**Data Sources:**
- Customer service complaint logs
- Resolution tracking
- Customer satisfaction surveys
- Churn event logs
- use `time_travel` for complaint-to-churn timeline

**Enrichment Output:**
- Complaint sensitivity score (1-5)
- Annual complaint frequency (count)
- Average resolution time (days)
- Churn risk (yes/no flag, if complaint)
- Retention strategy (proactive support recommendation)
- VIP service flag (priority handling)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 80% for core financial attributes
- Timeliness: Update daily for balances, weekly for scores
- Accuracy: Validate against transaction and account systems
- Consistency: Cross-check product holdings with system records

**MCP Tools Integration:**
- Use `schema_discovery` to map banking account and transaction data
- Use `feature_analysis` to calculate wealth and risk scores
- Use `time_travel` to track financial trajectory trends
- Use `query_builder` for cross-sell ROI analysis

**Enrichment Frequency:**
- Wealth metrics: Daily
- Product affinity: Monthly
- Digital maturity: Monthly
- Risk profile: Quarterly
- Life stage: Quarterly
- Cross-sell readiness: Weekly
- Channel preference: Monthly
- Complaint sensitivity: Monthly

**Output Storage:**
- Store enriched attributes in customer_360 table
- Create daily snapshots for analytics
- Maintain historical scoring for audit
- Archive previous versions for trend analysis

