# BFSI Audience Finding Guide

## Overview
BFSI (Banking, Financial Services, Insurance) segmentation depends on wealth tiers, life stage, product cross-sell readiness, and risk profiles. Use CDP data to identify high-net-worth individuals, cross-sell opportunities, and dormant account reactivation targets.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Account balances and assets under management (AUM)
- Account types (savings, checking, investment, retirement)
- Loan products (mortgage, personal, auto)
- Credit card holdings and spending patterns
- Insurance policies (life, health, property, auto)
- Investment portfolio and asset allocation
- Deposit/withdrawal patterns and cash flow
- Loan origination/repayment history
- Digital engagement (app login, online banking)
- Branch visit frequency and service type
- Risk profile and investment preferences
- Regulatory/compliance flags
- Annual income (if available) and employment status
- Life stage indicators (marriage, homeownership, children)
- Financial goals (retirement, education, wealth management)

```
schema_discovery operation: "store", store_type: "profile_store"
schema_discovery operation: "columns", columns: ["account_balance", "loan_amount", "credit_score", "aum"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Wealth tiers**: Total assets, AUM, account value distribution
- **Income indicators**: Monthly deposits, salary patterns, cash flow
- **Product adoption**: Cross-sell readiness, product count
- **Engagement**: Digital adoption, branch vs online preference
- **Risk profile**: Credit score, investment risk tolerance, loan repayment history
- **Life stage markers**: Account age, product expansion over time

```
feature_analysis columns: ["total_assets", "monthly_income", "product_count",
  "credit_score", "digital_engagement_score"],
metric_types: ["basic", "statistical", "quality"]
```

## Common Audience Definitions

### 1. HNI/Ultra High Net Worth (UHNW)
**Filter Criteria:**
- Total assets/AUM: >$1M (HNI) or >$10M (UHNW)
- Account tenure: 3+ years
- Product count: 4+ (savings + investments + insurance + lending)
- Digital engagement: Regular (monthly+)
- Credit profile: Excellent (score >750)
- Digital preference: Omnichannel (app + branch + phone)

**Expected Size:** 0.5-2% of base
**Activation:** Dedicated relationship manager, exclusive wealth products, concierge service, private investment opportunities, exclusive events

### 2. Affluent Segment (Emerging Wealth)
**Filter Criteria:**
- Total assets: $250K-$1M
- Monthly income: >$10K
- Product count: 2-3
- Investment activity: Regular (quarterly+)
- Digital adoption: High (80%+ online transactions)
- Loan eligibility: Prime credit (score >700)

**Expected Size:** 3-8% of base
**Activation:** Premium banking features, investment advisory, insurance reviews, loan pre-qualification, wealth planning consultations

### 3. Mass Market (Core Segment)
**Filter Criteria:**
- Total assets: $10K-$250K
- Monthly income: $3K-$10K
- Product count: 1-2
- Engagement: Monthly banking activity
- Credit score: Good (score >650)
- Digital preference: Online-first (app usage >80%)

**Expected Size:** 60-75% of base
**Activation:** Targeted offers, digital-first communication, simplified product bundles, cashback rewards, financial literacy content

### 4. Dormant Account Reactivation
**Filter Criteria:**
- Last transaction: 90+ days ago
- Previous engagement: Active for 12+ months (not new)
- Account type: Savings (not lending-focused)
- Balance: >$0 (still holds funds)
- Product count: Historical (had 2+ products at peak)
- No recent contact: Email/SMS engagement = 0 for 60+ days

**Expected Size:** 10-15% of base
**Activation:** Win-back email (new features/rates), incentives for reactivation, life event relevance (birthdays, milestones), product migration offers

### 5. Cross-Sell Ready (Product Expansion)
**Filter Criteria:**
- Primary product: Active (regular transactions/payments)
- Product count: 1-2 (room for expansion)
- Tenure: >6 months (relationship established)
- Engagement: Predictable (regular deposits/usage)
- Credit score: >650 (credit-worthy)
- Life stage: Indicators for insurance/investment need

**Expected Size:** 40-50% of base
**Activation:** Recommended products (savings→FD→investment, credit card→loan, insurance bundles), simplification offers, family protection packages

### 6. Mortgage Candidates (Home Ownership Path)
**Filter Criteria:**
- Age: 25-55 (prime home-buying years)
- Monthly income: >$5K
- Credit score: >700 (mortgage-eligible)
- Savings balance: >$20K (down payment potential)
- Loan product: None or excellent repayment history
- Life stage: Married, partnered, or family indicators
- Recent activity: Increased savings deposits (goal-driven behavior)

**Expected Size:** 15-25% of base
**Activation:** Mortgage rate offers, home loans information, property insurance bundles, financial planning for homeownership, partner bank referrals

### 7. Investment-Ready Segment
**Filter Criteria:**
- Liquid assets: >$50K in savings
- Investment portfolio: None or underweight vs savings
- Risk profile: Moderate to aggressive (questionnaire-based)
- Income stability: Regular deposits >$3K/month
- Digital adoption: High (app/online trader potential)
- Time horizon: 5+ years (long-term investor indicators)

**Expected Size:** 15-25% of base
**Activation:** Investment platform access, mutual fund recommendations, SIP programs, stock trading discounts, wealth management consultations

### 8. Loan Prepayment/Refinance Candidates
**Filter Criteria:**
- Active loan: Personal, auto, or mortgage
- Repayment history: Excellent (no late payments)
- Monthly income: Increased 20%+ (capacity to prepay)
- Interest rate: Higher than current market (refinance opportunity)
- Account tenure: Loan >12 months outstanding
- Credit score: Improved since origination (refinance eligible)
- Prepayment trend: Early payments or lump sums observed

**Expected Size:** 5-10% of base (quarter-dependent)
**Activation:** Refinancing offers, prepayment incentives, debt consolidation options, interest rate reviews, loan switching benefits

### 9. Insurance Coverage Gap
**Filter Criteria:**
- Life insurance: None or minimal coverage
- Family indicators: Dependents, mortgage, or children
- Age: <55 (insurability advantage)
- Income: >$3K/month (premium affordability)
- Product depth: >2 banking products (trusted customer)
- Health profile: No exclusions (if available)
- Digital engagement: Regular app usage (comfort with online enrollment)

**Expected Size:** 30-40% of base
**Activation:** Term life insurance bundles, health insurance education, family protection packages, easy digital enrollment, simplified underwriting

## Example Audience Queries

### Query 1: HNI Wealth Retention (Relationship Review)
```sql
SELECT customer_id, email, phone, total_assets, aum_invested,
       product_count, last_transaction_date, relationship_manager_id
FROM customer_profiles
WHERE total_assets > 1000000
AND account_tenure_months >= 36
AND product_count >= 4
AND credit_score > 750
AND last_transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
AND dormancy_flag = false
ORDER BY total_assets DESC, last_transaction_date DESC
```

### Query 2: Cross-Sell Ready (Savings to Investment Conversion)
```sql
SELECT customer_id, email, phone, savings_balance, monthly_income,
       product_list, digital_engagement_score
FROM customer_profiles
WHERE savings_balance > 50000
AND monthly_income > 5000
AND product_count = 1
AND primary_product = 'savings_account'
AND digital_engagement_score > 70
AND last_login >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
AND NOT EXISTS (
  SELECT 1 FROM customer_products
  WHERE customer_id = cp.customer_id
  AND product_type IN ('mutual_fund', 'stocks', 'bonds', 'investment')
)
ORDER BY savings_balance DESC
```

### Query 3: Mortgage Readiness (Home Loan Qualification)
```sql
SELECT customer_id, email, phone, savings_balance, monthly_income,
       credit_score, employment_status, age, family_status
FROM customer_profiles
WHERE age BETWEEN 25 AND 55
AND monthly_income > 5000
AND credit_score > 700
AND savings_balance > 20000
AND (family_status IN ('married', 'partnered') OR dependents > 0)
AND NOT EXISTS (
  SELECT 1 FROM customer_loans
  WHERE customer_id = cp.customer_id
  AND loan_type = 'mortgage'
)
AND last_login >= DATE_SUB(CURRENT_DATE, INTERVAL 60 DAY)
GROUP BY customer_id, email, phone, savings_balance, monthly_income
HAVING AVG(monthly_deposit_amount) > 3000
ORDER BY credit_score DESC, savings_balance DESC
```

## Channel Strategy by Segment

| Segment | Email | SMS | Phone | App Push | Branch | Video Call |
|---------|-------|-----|-------|----------|--------|-----------|
| HNI/UHNW | Medium | Low | Very High | Low | Very High | Very High |
| Affluent | High | Medium | High | High | High | Medium |
| Mass Market | Very High | High | Low | Very High | Low | Low |
| Dormant | Very High | High | Low | Medium | Low | Low |
| Cross-Sell Ready | High | High | Low | Very High | Medium | Medium |
| Mortgage Candidates | High | High | Medium | High | High | Medium |
| Investment-Ready | High | Medium | Medium | Very High | Low | Low |
| Loan Refinance | Very High | Medium | High | High | Medium | Medium |
| Insurance Gap | High | High | Low | High | Medium | Low |

## Life Stage-Based Segmentation

1. **Young Professional (25-35)**: Savings account, individual loans, term insurance, education loans
2. **New Parent (30-45)**: Mortgage, child education plans, family insurance, investment accounts
3. **Mid-Career (40-55)**: Wealth accumulation, investment portfolios, insurance review, retirement planning
4. **Pre-Retirement (55-65)**: Portfolio rebalancing, life insurance conversion, pension planning, estate planning
5. **Retiree (65+)**: Liquidity products, retirement income strategies, legacy planning, simplified access

## Tips for Success

1. Use wealth tier as primary segmentation; tailor experience by ARPU
2. Build cross-sell models: savings→investment→insurance in sequence
3. Monitor life stage events (marriage, home purchase, children); pre-target
4. Track dormancy early (30+ days); activate before churn
5. Use credit score as gatekeeping mechanism for credit products
6. Analyze loan repayment behavior; predict refinance readiness
7. Use time_travel to track product adoption patterns (timing windows)
8. Create financial health scorecards; engage on weak areas (insurance gaps)
9. Monitor income volatility; adjust product offers accordingly
