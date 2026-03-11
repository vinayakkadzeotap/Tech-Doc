---
name: cdp-data-scientist
description: Designs predictive models and feature engineering workflows for propensity scoring, churn prediction, segmentation, and classification via BigQuery ML. Maps business questions to BQML model types (LOGISTIC_REG, LINEAR_REG, DNN_CLASSIFIER, KMEANS, AUTOML). Estimates training costs, generates feature specifications, and recommends optimal architectures. Triggers on "predict", "propensity model", "machine learning", "scoring model", "classification", "regression", "clustering", "BQML", "predictive". Powers data-driven decisioning by translating marketing questions into production-ready model designs.
---

# CDP Data Scientist

## Overview

The Data Scientist skill bridges marketing questions ("Can you predict which customers will churn?") to production-ready machine learning models. This skill designs custom models, engineers features, estimates costs, and provides implementation roadmaps—but stops short of execution, requiring explicit user approval before model training begins.

## Typical Workflow

1. **Understand the Business Question** – What are you trying to predict or optimize?
2. **Feature Inventory** – Map available data for model input
3. **Feature Engineering** – Create derived features from raw attributes
4. **Model Selection** – Choose BQML architecture that fits the problem
5. **Cost Estimation** – Use query_builder to estimate training cost
6. **Design Specification** – Document model design (target, features, expected performance)
7. **Obtain Approval** – Present to stakeholder; get go/no-go before training

---

## Step 1: Translate Business Questions to ML Problems

Common marketing questions map to specific model types:

### Classification Problems (Predict Categories)
**Question**: "Which customers will churn in the next 90 days?"
**Problem Type**: Binary Classification (churn: yes/no)
**BQML Model Type**: LOGISTIC_REG or DNN_CLASSIFIER
**Output**: Churn probability (0–100%) per customer

**Question**: "Which customer segment should each prospect join (growth vs. stable vs. at-risk)?"
**Problem Type**: Multi-class Classification (3+ categories)
**BQML Model Type**: DNN_CLASSIFIER or AUTOML_CLASSIFIER
**Output**: Segment assignment + confidence per category

### Regression Problems (Predict Continuous Values)
**Question**: "What's the lifetime value (LTV) of each customer?"
**Problem Type**: Regression (continuous value 0–$1M+)
**BQML Model Type**: LINEAR_REG or DNN_REGRESSOR
**Output**: Predicted LTV per customer ($0–$1M range)

**Question**: "How many products will this customer order in the next 12 months?"
**Problem Type**: Regression (integer count: 0, 1, 2, 3, ...)
**BQML Model Type**: LINEAR_REG or DNN_REGRESSOR
**Output**: Expected order count per customer

### Clustering Problems (Group Similar Customers)
**Question**: "What natural customer segments exist in our base?"
**Problem Type**: Unsupervised Clustering
**BQML Model Type**: KMEANS
**Output**: Cluster assignment (Segment A, B, C, D) per customer

---

## Step 2: Feature Inventory & Selection

Identify all available candidate features for your model:

```
Tool: schema_discovery(operation="columns", store_type="profile_store")
Result: All available customer attributes (sample)
  - Demographic: age, gender, income, location, marital_status, household_size
  - Behavioral: purchase_frequency, avg_order_value, category_affinity
  - Temporal: customer_tenure_days, days_since_last_purchase
  - Engagement: email_open_rate, push_opt_in, session_frequency
  ... (150+ total attributes)
```

Next, assess feature quality using `feature_analysis`:

```
Tool: feature_analysis(columns=[age, purchase_frequency, email_open_rate, ltv_estimate],
                       metric_types=["basic", "statistical"],
                       store_type="profile_store")
Result: Statistical profiles for each candidate feature
  age:
    - fill_rate: 94%
    - data_type: integer
    - range: 18–95
    - mean: 42.3, std_dev: 15.7
    - percentiles: [Q1=32, Q2=43, Q3=54]
    → Good feature (high fill rate, reasonable variance)

  email_open_rate:
    - fill_rate: 87%
    - data_type: float
    - range: 0.0–1.0
    - mean: 0.42, std_dev: 0.21
    → Good feature (behavioral signal with variance)

  category_affinity:
    - fill_rate: 100%
    - data_type: string
    - distinct_values: 1,245
    → Problematic (too high cardinality; needs encoding)
```

**Feature Selection Rules**:
- ✓ Use: Fill rate > 70%, reasonable variance (std_dev > 0)
- ⚠️ Consider: Fill rate 50–70% (may need imputation)
- ✗ Avoid: Fill rate < 50% (too sparse for learning)
- ✗ Avoid: Constant columns (zero variance)
- ✗ Avoid: High cardinality string columns (> 1,000 unique values; needs one-hot encoding)
- ✗ Avoid: PII columns directly (use only derived/aggregated versions)

---

## Step 3: Feature Engineering – Create Powerful Signals

Raw data often lacks predictive power. Engineer derived features using `time_travel`:

### Time-Based Aggregations (Most Common)

Use `time_travel` to create rolling window features:

```
Tool: time_travel(starting_timestamp="2025-09-05", ending_timestamp="2026-03-05",
                  columns=["purchase_count", "purchase_value"],
                  change_types=["insert"],
                  include_statistics=true)
Result: Raw purchase events for each user over 6 months
```

From raw events, engineer derived features:

```
6-Month Rolling Features (for churn prediction):
├── purchase_count_6m: Total purchases in last 6 months
├── purchase_count_3m: Total purchases in last 3 months
├── purchase_count_1m: Total purchases in last 1 month
├── purchase_frequency_trend: (1m count - 3m count) / 3m count
│   → If negative, user is purchasing less frequently (churn signal)
├── avg_order_value_6m: Average order value (6-month window)
├── days_since_last_purchase: Time since most recent purchase
│   → High values (>60 days) indicate churn risk
└── purchase_velocity: (Sum last 30 days) / (Sum previous 30 days)
    → If declining, engagement dropping

Example: User X
├── purchase_count_6m = 12
├── purchase_count_1m = 1  ← Declining velocity!
├── days_since_last_purchase = 32  ← At-risk timeframe
├── purchase_frequency_trend = -75%  ← Strong downward trend
└── Churn Risk Score: 78% (HIGH)
```

### Engagement Velocity Features

```
Tool: time_travel(starting_timestamp="2026-01-05", ending_timestamp="2026-03-05",
                  columns=["engagement_score", "session_count"],
                  change_types=["update_postimage"],
                  include_statistics=true)
Result: Engagement changes over time
```

Derived features:
```
├── engagement_score_change_1m: Change in engagement from 2m ago to 1m ago
├── engagement_score_change_recent: Change from 1m ago to today
├── session_acceleration: Session count growth rate (acceleration = risky signal)
└── engagement_volatility: Standard deviation of weekly engagement scores
    → High volatility sometimes indicates churn (erratic behavior)
```

### Cohort & Retention Features

```
├── cohort_age_months: Months since user joined
├── month_1_retention: Did user return in month 1? (0/1 binary)
├── repeat_purchase_rate: % of months with purchase since joining
└── time_to_first_repeat: Days between 1st and 2nd purchase
    → Predictor: Users who repeat quickly are more valuable
```

### External Context Features

```
├── seasonality_factor: Is this purchase season for user's category?
├── inventory_stock_level: Are products in user's affinity category in stock?
├── price_index: Current price vs. 6-month historical average
    → Price sensitivity affects churn (if prices rise, churn increases)
└── competitor_presence: Any competing brands in user's affinity category?
```

---

## Step 4: Model Selection Guide

Map your business problem to BQML model types:

### Churn Prediction (Binary Classification)

```
Business Question: "Will customer X churn (stop purchasing) in next 90 days?"
Target Variable: churn_flag (0 = stays, 1 = churns)
Input Features: purchase_frequency, days_since_last_purchase, engagement_trend

BQML Model Type: LOGISTIC_REG (recommended for interpretability)
├── Pros: Fast to train, interpretable coefficients, production-ready
├── Cons: Assumes linear relationship between features and churn
└── Use When: Need simple, explainable model for business stakeholders

Alternative: DNN_CLASSIFIER
├── Pros: Captures complex feature interactions (non-linear), higher accuracy
├── Cons: Slower, less interpretable ("black box")
└── Use When: Need best possible accuracy; interpretability less critical

Model Design:
├── Training Data: 12 months of historical customer behavior
├── Label Timing: Customers who didn't purchase for 90+ days = churned (1)
├── Sample: 500K customers (80/20 train/test split)
├── Expected Metrics: 75–85% accuracy, 70–80% AUC-ROC
```

### Lifetime Value (LTV) Prediction (Regression)

```
Business Question: "What's the total LTV of each customer over next 3 years?"
Target Variable: predicted_ltv_3year (continuous value: $0–$500K+)
Input Features: historical_ltv, avg_order_value, repeat_rate, tenure

BQML Model Type: LINEAR_REG (recommended if features are scaled)
├── Pros: Interpretable, fast, low overfitting risk
├── Cons: Assumes linear relationship (LTV doesn't grow linearly)
└── Use When: Need explainability; features correlate linearly with LTV

Alternative: DNN_REGRESSOR
├── Pros: Captures exponential LTV growth patterns
├── Cons: Less interpretable
└── Use When: Historical LTV shows non-linear patterns; want highest accuracy

Model Design:
├── Training Data: 24 months of historical customers
├── Target: Actual LTV achieved in subsequent 36 months
├── Sample: 300K customers with complete transaction history
├── Expected Metrics: RMSE $150–300 (depending on LTV variance)
```

### Customer Segmentation (Clustering)

```
Business Question: "What natural customer segments exist? How should we group?"
Target Variable: None (unsupervised learning)
Input Features: purchase_frequency, avg_order_value, engagement_score, tenure

BQML Model Type: KMEANS (only clustering option in BQML)
├── Specify K (number of clusters): Usually 3–8 segments
├── Pros: Fast, interpretable clusters, good for exploratory analysis
├── Cons: Requires manual K selection; may need iteration
└── Use When: Want to discover natural groupings

Model Design:
├── Training Data: All active customers (1M+)
├── K Value: Start with K=4; evaluate silhouette score; iterate K=3–8
├── Expected Output: 4 clusters with 25%/30%/25%/20% distribution
├── Naming: Growth Segment, Loyal Base, At-Risk, New Prospects

Interpreting Clusters (Example):
Cluster A (Growth): high purchase_frequency, high engagement, young cohort
Cluster B (Loyal): moderate purchase_frequency, very high repeat_rate, older cohort
Cluster C (At-Risk): declining frequency, low engagement, high churn rate
Cluster D (Prospects): low frequency, high AOV, likely high-value but untapped
```

### Classification with 3+ Categories (Multi-class)

```
Business Question: "Which product category should we recommend to each user?"
Target Variable: next_category (Electronics, Home & Garden, Fashion, etc.)
Input Features: browse_history, purchase_history, category_affinity

BQML Model Type: DNN_CLASSIFIER (handles 3+ classes well)
├── Alternative: AUTOML_CLASSIFIER (if you want Google to optimize)
└── Output: Probability distribution across all categories

Model Design:
├── Training Data: 6 months of purchase data + browsing history
├── Classes: 12 product categories
├── Sample: 1M users with category purchases
├── Expected Metrics: 65–75% top-1 accuracy, 85–92% top-3 accuracy
```

### When to Use AUTOML (Let Google Optimize)

```
AUTOML_CLASSIFIER or AUTOML_REGRESSOR
├── Use When: Problem is complex, features are messy, you want highest accuracy
├── Pros: Google AutoML automatically selects model, tuning parameters
├── Cons: Cost is ~2-3x higher; slower; less control; slower iteration
├── Recommendation: Start with LOGISTIC_REG or LINEAR_REG; if accuracy insufficient,
│   upgrade to DNN or AUTOML

Cost Consideration:
├── LOGISTIC_REG: ~$5–15 per 1M row dataset
├── LINEAR_REG: ~$5–15 per 1M row dataset
├── DNN_CLASSIFIER/DNN_REGRESSOR: ~$20–50 per 1M row dataset
├── KMEANS: ~$20–30 per 1M row dataset
└── AUTOML_CLASSIFIER/AUTOML_REGRESSOR: ~$50–150+ per 1M row dataset
    (due to hyperparameter tuning runs)
```

---

## Step 5: Cost Estimation via query_builder

Before training any model, estimate the cost using the BQML cost analyzer:

```
Tool: query_builder(
  query="CREATE OR REPLACE MODEL `project.dataset.churn_prediction_model`
         OPTIONS(model_type='LOGISTIC_REG', INPUT_LABEL_COLS=['churn_flag']) AS
         SELECT feature_1, feature_2, ..., feature_50, churn_flag
         FROM `project.dataset.training_data`
         WHERE training_data_flag = 1",
  location="europe-west1",
  model_type="LOGISTIC_REG"
)
Result:
{
  "estimated_cost_usd": 12.50,
  "data_processed_gb": 25.3,
  "execution_time_estimate": "3–5 minutes",
  "query_complexity": "medium",
  "query_category": "bqml",
  "optimization_suggestions": [
    "Consider removing low-variance features (feature_42, feature_48)",
    "Current query processes 25.3 GB; could reduce to 15 GB by feature selection"
  ]
}
```

**Cost Benchmarks**:
- Small dataset (100K rows, 50 features): $2–5
- Medium dataset (1M rows, 100 features): $10–25
- Large dataset (10M rows, 150 features): $50–150
- Very large dataset (100M+ rows): $500+

**Pro Tips for Cost Management**:
1. Feature selection: Remove low-variance features early (saves 30–40% cost)
2. Sampling: Train on random 20% of data; validate on full data; costs 5x less
3. Materialized training tables: Pre-compute features once; reuse across models (avoid repeated calculation)

---

## Step 6: Model Design Specification Document

The Data Scientist deliverable is a detailed design spec. Example:

```
MODEL DESIGN SPECIFICATION
Project: Churn Prediction for Retention Campaign
Generated: 2026-03-05
Status: DESIGN READY FOR APPROVAL

BUSINESS PROBLEM
├── Question: Which customers are at risk of churning in next 90 days?
├── Business Impact: Identify top 10% at-risk for win-back campaign
├── Success Metric: 40% of identified churners stay (vs. 5% baseline)
└── Timeline: Need by 2026-04-01

MODEL ARCHITECTURE
├── Model Type: LOGISTIC_REG (Binary Classification)
├── Target Variable: churn_flag (0=stays, 1=churns in next 90 days)
├── Training Data Window: Jan 2025–Dec 2025 (12 months)
├── Prediction Window: Next 90 days (Apr–Jun 2026)
└── Sample Size: 500K customers (min. 1K churned for label balance)

FEATURE SPECIFICATION (50 total features)
├── Behavioral (20 features)
│   ├── purchase_count_6m: Purchases in last 6 months
│   ├── purchase_count_1m: Purchases in last 1 month
│   ├── purchase_frequency_trend: (1m - 3m) / 3m
│   ├── days_since_last_purchase: (HIGH SIGNAL)
│   ├── avg_order_value_6m: Average order size
│   ├── engagement_score: Normalized engagement 0–100
│   ├── engagement_trend: Change in engagement recent vs. baseline
│   ├── email_open_rate: % of emails opened
│   ├── session_frequency: Sessions per month
│   ├── session_duration_avg: Average time per session (seconds)
│   └── (10 more behavioral features)
├── Demographic (10 features)
│   ├── age_group: Binned age (18–25, 26–35, etc.)
│   ├── geography: Region
│   ├── customer_tenure_years: Years since signup
│   └── (7 more demographic features)
├── Transactional (10 features)
│   ├── category_diversity: # of distinct categories purchased
│   ├── repeat_purchase_rate: % months with repeat purchase
│   ├── return_rate: % of orders returned
│   ├── avg_margin_per_order: Profitability per transaction
│   └── (6 more transactional features)
├── Seasonal (5 features)
│   ├── last_purchase_season: When was last purchase?
│   ├── seasonality_index: Likelihood of purchase in current season
│   └── (3 more seasonal features)
└── Velocity (5 features)
    ├── purchase_velocity: Recent velocity vs. historical
    ├── engagement_acceleration: Is engagement increasing/decreasing?
    └── (3 more velocity features)

TRAINING CONFIGURATION
├── Data Split: 80% training, 20% validation
├── Class Balance: 10% churned, 90% retained (imbalanced; requires weighting)
├── Feature Scaling: Numeric features standardized (mean=0, std=1)
├── Categorical Encoding: One-hot for low-cardinality, hash for high-cardinality
└── Missing Values: Impute with median (numeric) or mode (categorical)

EXPECTED PERFORMANCE
├── Accuracy: 78–82% (customers correctly classified)
├── Precision: 65–70% (of those predicted to churn, % actually churn)
├── Recall: 60–68% (of actual churners, % we catch)
├── AUC-ROC: 0.78–0.85 (discrimination ability)
├── Business KPI: Precision of 68% means 680 of 1,000 identified at-risk customers
│   will actually churn (actionable for win-back campaign)
└── Confidence: High (well-established churn prediction problem)

COST ESTIMATE
├── Training Cost: $12.50 (LOGISTIC_REG, 500K rows, 50 features, 25 GB processed)
├── Prediction Cost: $2.00 (batch scoring on 5M customers)
├── Total: ~$15 per training run
└── Frequency: Retrain monthly (total $180/year)

VERTICAL BENCHMARK (Retail E-Commerce)
├── Typical Accuracy: 75–85%
├── Typical AUC-ROC: 0.76–0.82
├── Industry Churn Rate: 8–15%
├── Our Churn Rate: 10% (aligned with industry)
└── Confidence Level: MEDIUM-HIGH

RISKS & MITIGATIONS
├── Risk: Model biased toward recent churners; misses slow churn
│   Mitigation: Use rolling time windows; test model on 0–30, 30–60, 60–90 day cohorts
├── Risk: Seasonal variations not captured
│   Mitigation: Add seasonal features; retrain quarterly
├── Risk: New customer segment (< 30 days) has insufficient history
│   Mitigation: Create separate "new customer" model; apply rules-based early warning
└── Risk: Model drift over time (customer behavior shifts)
    Mitigation: Monitor prediction distribution monthly; retrain if accuracy drops >5%

NEXT STEPS (PENDING APPROVAL)
1. Stakeholder Approval: Review this design; confirm feature selection + success metrics
2. Development: Write SQL to build training dataset
3. Training: Execute model training (15 min, $12.50)
4. Validation: Compare accuracy vs. benchmarks; A/B test on holdout cohort
5. Deployment: Schedule model for production; set up monthly retraining
6. Monitoring: Track model accuracy, feature importance, prediction drift

APPROVAL SIGN-OFF
├── Marketer Lead: ___________________ Date: ___________
├── Data Lead: ______________________ Date: ___________
└── Model Ready for Training: ☐ YES   ☐ NO (revisions needed)
```

---

## Step 7: Model Evaluation Metrics Explained

Once trained, interpret model performance:

### Classification Metrics (Churn, Likelihood, etc.)

- **Accuracy**: % of all predictions correct (misleading if classes imbalanced)
- **Precision**: Of those predicted "churned", % actually churn (minimize false alarms)
- **Recall**: Of actual churners, % we catch (minimize missed churners)
- **AUC-ROC**: Discrimination ability (0.5 = random, 1.0 = perfect)
- **Confusion Matrix**: True Positives, False Positives, True Negatives, False Negatives

For churn: High Recall (catch at-risk) > High Precision (avoid false alarms)

### Regression Metrics (LTV, Revenue, etc.)

- **RMSE** (Root Mean Squared Error): Average prediction error in dollars
- **MAE** (Mean Absolute Error): Absolute deviation from actual
- **MAPE** (Mean Absolute Percentage Error): % error relative to actual value
- **R² Score**: Variance explained (0 = model useless, 1.0 = perfect)

Example: LTV model with RMSE=$200 means predictions are off by ±$200 on average

### Clustering Metrics (Segmentation)

- **Silhouette Score**: How well separated are clusters? (−1 = bad, +1 = excellent)
- **Inertia**: Sum of squared distances within clusters (lower = tighter clusters)
- **Davies-Bouldin Index**: Average cluster similarity (lower = better separation)

---

## Vertical-Specific Model Playbooks

### Retail & E-Commerce

**Top Models**:
1. Churn Prediction (LOGISTIC_REG): Identify at-risk customers for retention
2. LTV Prediction (DNN_REGRESSOR): Prioritize high-value prospects
3. Category Recommendation (DNN_CLASSIFIER): Next-best-product
4. Segmentation (KMEANS): Identify 4–6 natural customer tiers

**Typical Features**: Purchase frequency, AOV, category affinity, seasonality, return rate

### Gaming & Entertainment

**Top Models**:
1. Churn Prediction (DNN_CLASSIFIER): Predict who quits playing
2. Monetization Propensity (LOGISTIC_REG): Will user spend?
3. Genre Preference (DNN_CLASSIFIER): What should we recommend?
4. Lifetime Value (DNN_REGRESSOR): Expected spend over user lifetime

**Typical Features**: Session frequency, playtime, monetization signals, genre affinity

### Financial Services

**Top Models**:
1. Credit Risk (LOGISTIC_REG): Will customer default?
2. LTV (DNN_REGRESSOR): Predicted customer profitability
3. Churn (DNN_CLASSIFIER): Will customer switch banks?
4. Product Cross-sell (LOGISTIC_REG): Will customer buy insurance/investment product?

**Typical Features**: Account balance, transaction patterns, tenure, income, behavior velocity
**Compliance**: Filter features to exclude/proxy for protected attributes (race, age-as-proxy)

---

## Important: This Skill Designs, Doesn't Execute

This Data Scientist skill produces specifications and cost estimates. It does **not** train models without explicit user approval.

**Workflow**:
1. Present model design specification (this document)
2. User reviews, asks questions, approves
3. User explicitly says: "Train the model"
4. Only then does model training execute

This prevents accidental model deployments and ensures stakeholder alignment.

---

## Related Skills

- **cdp-data-enricher**: Engineer features for model training
- **cdp-audience-finder**: Use model outputs to define segments
- **cdp-churn-finder**: Apply churn model to identify at-risk customers
- **cdp-data-analyzer**: Post-model validation and performance tracking
