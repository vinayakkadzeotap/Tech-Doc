# BFSI Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for banking, financial services, and insurance. Focus on profitability, risk, and cross-sell prediction.

## Financial Features

### Account Balance Metrics
Deposit and asset levels:

**Balance Snapshots**
- Current balance (most recent)
- Average balance (30/60/90/365 day average)
- Minimum balance (financial stress indicator)
- Maximum balance (wealth indicator)

**Balance Trends**
- Balance growth rate (monthly change)
- Balance volatility (variance, STDDEV)
- Balance trajectory (accelerating growth vs. declining)
- Low-balance frequency (how often near zero?)

**Implementation**
```sql
SELECT account_id,
  CURRENT_DATE() - account_opened_date as account_tenure_days,
  (SELECT balance FROM account_balances WHERE account_id = accounts.account_id ORDER BY snapshot_date DESC LIMIT 1) as current_balance,
  AVG(balance) OVER (PARTITION BY account_id RANGE BETWEEN INTERVAL 365 DAY PRECEDING AND CURRENT ROW) as avg_balance_365d,
  STDDEV(balance) OVER (PARTITION BY account_id RANGE BETWEEN INTERVAL 365 DAY PRECEDING AND CURRENT ROW) as balance_volatility
FROM accounts
LEFT JOIN account_balances USING (account_id)
```

### Transaction Metrics
Movement and activity indicators:

**Transaction Volume**
- Monthly transaction count (frequency)
- Average transaction amount
- Transaction count trend (increasing/decreasing activity)
- Transaction type mix (deposits vs. withdrawals)

**Transaction Patterns**
- Inflows (deposits, salary)
- Outflows (spending, transfers)
- Net monthly flow (savings rate)
- Net flow trend (are they saving more?)

**Implementation**
```sql
SELECT account_id,
  COUNT(*) as total_transactions,
  COUNT(DISTINCT DATE(transaction_date)) as active_days,
  AVG(CASE WHEN transaction_type IN ('deposit', 'salary') THEN transaction_amount ELSE 0 END) as avg_inflow,
  AVG(CASE WHEN transaction_type IN ('withdrawal', 'transfer') THEN transaction_amount ELSE 0 END) as avg_outflow,
  SUM(CASE WHEN transaction_type='salary' THEN transaction_amount ELSE 0 END) as total_salary_received
FROM transactions
GROUP BY account_id
```

### Investment Metrics
Financial engagement level:

**Investment Portfolio**
- Total invested amount
- Investment types (stocks, bonds, mutual funds)
- Portfolio diversification (# of distinct holdings)
- Risk profile (conservative vs. aggressive)

**Investment Activity**
- Investment transaction frequency
- Trading frequency (active investor?)
- Portfolio value trend
- Return performance (available if tracked)

**Implementation**
```sql
SELECT customer_id,
  SUM(investment_value) as total_investments,
  COUNT(DISTINCT investment_product) as distinct_products,
  COUNT(DISTINCT investment_type) as investment_type_count,
  SUM(CASE WHEN investment_type='stock' THEN investment_value ELSE 0 END) as equity_value,
  SUM(CASE WHEN investment_type='bond' THEN investment_value ELSE 0 END) as fixed_income_value
FROM investment_holdings
GROUP BY customer_id
```

## Behavioral Features

### Digital Activity
Technology engagement:

**Platform Usage**
- Mobile app logins (frequency)
- Web banking visits (frequency)
- Branch visits (frequency)
- ATM usage (frequency)

**Digital Adoption**
- Days since last digital login (inactive?)
- Digital-to-total transaction ratio (preference)
- Mobile vs. web preference
- Bill pay enrollment (convenience adoption)

**Implementation**
```sql
SELECT customer_id,
  DATE_DIFF(CURRENT_DATE(), MAX(CASE WHEN platform='mobile' THEN login_date END), DAY) as days_since_mobile_login,
  COUNT(CASE WHEN platform='mobile' THEN 1 END) as mobile_logins_90d,
  COUNT(CASE WHEN platform='web' THEN 1 END) as web_logins_90d,
  COUNT(DISTINCT DATE(login_date)) as active_days_90d
FROM platform_usage
WHERE login_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
GROUP BY customer_id
```

### Customer Service Engagement
Support and relationship signals:

**Support Contact**
- Support calls (frequency)
- Complaint count (satisfaction indicator)
- Complaint resolution time
- Complaint type (billing vs. service issues)

**Relationship Strength**
- Account manager assigned (relationship importance)
- Relationship tenure (how long served by account manager)
- Meeting frequency (deep vs. transactional relationship)

**Implementation**
```sql
SELECT customer_id,
  COUNT(*) as total_support_contacts,
  COUNT(CASE WHEN contact_type='complaint' THEN 1 END) as complaint_count,
  AVG(CASE WHEN contact_type='complaint' THEN resolution_hours END) as avg_complaint_resolution_hours,
  COUNT(DISTINCT account_manager_id) as distinct_account_managers
FROM customer_interactions
GROUP BY customer_id
```

## Product Features

### Product Holding
Portfolio composition:

**Product Count**
- Total products owned (penetration)
- Active products (in use vs. dormant)
- Product mix (savings, credit, investment types)
- Product tenure (how long owning each)

**Product Sophistication**
- Tier of products (basic vs. premium)
- Premium product enrollment (wealth indicator)
- New product adoption rate (early adopter?)

**Implementation**
```sql
SELECT customer_id,
  COUNT(*) as product_count,
  COUNT(CASE WHEN is_active THEN 1 END) as active_products,
  ARRAY_AGG(STRUCT(product_type, product_name, years_held) ORDER BY years_held DESC) as product_mix
FROM customer_products
GROUP BY customer_id
```

### Tenure Metrics
Product and relationship age:

**Relationship Tenure**
- Years as customer
- Tenure segment (new, established, loyal)

**Product Tenure**
- Years in current main account
- Longest held product
- Most recent product added

**Implementation**
```sql
SELECT customer_id,
  CURRENT_DATE() - MIN(account_open_date) as customer_tenure_days,
  CASE
    WHEN CURRENT_DATE() - MIN(account_open_date) < 365 THEN 'new'
    WHEN CURRENT_DATE() - MIN(account_open_date) < 1825 THEN 'established'
    ELSE 'loyal'
  END as tenure_segment
FROM customer_accounts
GROUP BY customer_id
```

## Risk Features

### Payment Behavior
Credit quality indicators:

**Payment History**
- On-time payment rate (%)
- Days-past-due distribution (ever late?)
- Late payments count (frequency)
- Charge-offs (previous defaults)

**Payment Timeliness**
- Average days late (if paid late)
- Payment consistency (always on-time vs. variable)
- Recent payment trend (improving vs. declining)

**Implementation**
```sql
SELECT loan_id,
  COUNT(*) as total_payments_due,
  COUNT(CASE WHEN days_past_due = 0 THEN 1 END) as on_time_payments,
  COUNT(CASE WHEN days_past_due > 0 THEN 1 END) / COUNT(*) as delinquency_rate,
  MAX(days_past_due) as max_days_past_due
FROM payment_history
GROUP BY loan_id
```

### Credit Utilization
Leverage and financial stress:

**Credit Card Utilization**
- Credit utilization ratio (balance vs. limit)
- Utilization trend (increasing = stress?)
- Revolving balance patterns (carrying debt)
- Minimum payment patterns (can't pay full?)

**Loan Leverage**
- Total debt amount
- Debt-to-income ratio
- Debt concentration (one large loan vs. spread)

**Implementation**
```sql
SELECT customer_id,
  SUM(current_balance) / SUM(credit_limit) as credit_utilization_ratio,
  COUNT(CASE WHEN current_balance > 0.8 * credit_limit THEN 1 END) as high_utilization_accounts,
  SUM(CASE WHEN is_revolving THEN current_balance ELSE 0 END) as revolving_debt,
  SUM(CASE WHEN is_revolving = FALSE THEN current_balance ELSE 0 END) as installment_debt
FROM credit_accounts
GROUP BY customer_id
```

## Insurance Features (if applicable)

### Coverage Features
Insurance products and claims:

**Policy Holdings**
- Policy types (auto, home, life, health)
- Total premium (annual spend)
- Claims history (frequency, amounts)
- Claims rate (risk assessment)

**Risk Profile**
- Age (driver age for auto, home age for homeowner)
- Claims frequency (high-risk indicator)
- Claims amount (severity)
- Loss ratio (claims amount vs. premiums)

**Implementation**
```sql
SELECT policy_holder_id,
  COUNT(*) as policy_count,
  SUM(annual_premium) as total_annual_premium,
  COUNT(CASE WHEN is_active THEN 1 END) as active_policies,
  COUNT(DISTINCT claim_id) as claims_count,
  AVG(claim_amount) as avg_claim_amount
FROM insurance_policies
LEFT JOIN claims USING (policy_id)
GROUP BY policy_holder_id
```

## Common BFSI Models

### Cross-Sell Prediction
Predict product adoption likelihood:

**Target Definition**
- Will open investment account in next 90 days
- Will adopt new product in next 30 days

**Feature Selection**
- Current product count (room to grow)
- Balance level (affordability)
- Transaction activity (engagement)
- Digital adoption (comfort with new channels)
- Peer adoption (segment trend)

**Recommended Model**: LOGISTIC_REG or DNN_CLASSIFIER

### Churn Prediction
Predict account closure:

**Target Definition**
- Closed account within 90 days
- No transactions for 60+ days (dormancy as churn)

**Feature Selection**
- Digital engagement decline (reduced usage signal)
- Complaint frequency (dissatisfaction)
- Product count (single-product at higher risk)
- Balance trend (declining = leaving)
- Support call frequency (problem resolution)

**Recommended Model**: BOOSTED_TREE (robust) or LOGISTIC_REG (fast)

### Credit Risk / Default Prediction
Predict loan default or delinquency:

**Target Definition**
- 90+ days past due in next 12 months
- Loan charged off

**Feature Selection**
- Payment history (strongest predictor)
- Debt-to-income ratio (affordability)
- Credit utilization (financial stress)
- Income stability (salary consistency)
- Employment status (job stability)
- Age of credit (newer credit riskier)

**Recommended Model**: BOOSTED_TREE (handles missing data) or LOGISTIC_REG (interpretability)

### Profitability Prediction
Predict customer lifetime value:

**Target Definition**
- Total profit from customer (net of risk costs) over 12-24 months

**Feature Selection**
- Balance level (deposit revenue)
- Transaction count (fee revenue)
- Product count (cross-sell value)
- Account tenure (stability)
- Risk score (deduction for default risk)
- Digital engagement (lower cost to serve)

**Recommended Model**: LINEAR_REG or BOOSTED_TREE_REGRESSOR

## Feature Engineering Best Practices

1. **Temporal Alignment**: All features measured as of same date (avoid data leakage)
2. **Stability vs. Recency**: Mix stable features (tenure) with recent features (90d balance)
3. **Regulatory Considerations**: Fair lending laws restrict certain features (race, gender)
4. **Data Quality**: Financial data usually high quality, but handle missing carefully
5. **Class Imbalance**: Default rates low (5%); use class weights or resampling in models

## Cost Optimization Tips

- Use `query_builder` before large balance aggregations (daily snapshots = large tables)
- Transaction data voluminous; aggregate to customer-month level before features
- Investment data less frequent; can compute at detail level
- Materialized feature tables pay off for scoring large customer bases daily
- Test models on sample before running full customer base (estimate cost first)

## Model Monitoring

- **Portfolio Risk Drift**: Is delinquency rate increasing?
- **Product Mix Shift**: Are customers adopting new products?
- **Behavioral Change**: Is digital adoption accelerating?
- **Macro Sensitivity**: Is model stable during economic changes?
- **Regulatory Changes**: Impact on feature availability and model constraints
