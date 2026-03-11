# BQML Model Catalog and Selection Guide

## Overview
This guide provides industry-standard BQML model types with use cases, feature requirements, training considerations, and cost implications. Use this to select the appropriate model for your prediction task.

## Classification Models

### LOGISTIC_REG (Logistic Regression)

**Use Cases**
- Binary classification: Churn vs. retain, purchase vs. no-purchase, click vs. no-click
- Probability prediction: Calibrated probabilities for decision thresholds
- Interpretability required: Understand feature importance and directional impact
- Linear relationships: When feature-outcome relationships are approximately linear

**Typical Features**
- Numerical (recency, frequency, monetary, tenure)
- Categorical (encoded: region, segment, product type)
- Feature engineering: Polynomial features optional (for non-linearity)
- Feature count: Typically 10-50 features (handles multicollinearity well)

**Training Data Requirements**
- Minimum samples: 1,000-10,000 for stable estimates
- Class balance: Works with imbalanced data (use class weights)
- Feature range: Features should be scaled/normalized
- Missing data: Handle missing values before modeling

**Expected Performance**
- AUC-ROC: 0.65-0.85 (depends on predictability of outcome)
- Precision/Recall: Adjustable via threshold tuning
- Training time: Very fast (seconds to minutes for 1M rows)
- Inference time: Subsecond per batch

**Cost Implications**
- Training cost: Low (minimal computation)
- Storage cost: Very low (small model size)
- Inference cost: Minimal
- Best for: Cost-conscious production use

**Example Queries**
```sql
CREATE OR REPLACE MODEL project.dataset.churn_logistic
OPTIONS(
  model_type='LOGISTIC_REG',
  input_label_cols=['churned']
) AS
SELECT
  recency, frequency, monetary,
  product_count, tenure_days,
  digital_active,
  churned
FROM `project.dataset.customer_features`
WHERE date BETWEEN '2024-01-01' AND '2024-12-31';
```

---

### LINEAR_REG (Linear Regression)

**Use Cases**
- Continuous prediction: Lifetime value, revenue forecast, spend prediction
- Numeric target: Any continuous outcome variable
- Interpretability: Feature coefficients show impact magnitude
- Linear trends: Relationships appear roughly linear in scatterplots

**Typical Features**
- Historical averages (avg purchase value, avg frequency)
- Trend indicators (3-month, 6-month, 12-month lookbacks)
- Categorical encoded features (segment, geography)
- Feature count: 10-100 features (more manageable than DNN)

**Training Data Requirements**
- Minimum samples: 10,000+ for stable estimates
- Target distribution: Relatively continuous (not heavily skewed)
- Outlier handling: Remove or cap extreme values
- Missing data: Impute or exclude

**Expected Performance**
- R-squared: 0.4-0.7 typical (0.7+ indicates good fit)
- RMSE: Domain-specific (compare to baseline)
- Training time: Very fast (seconds to minutes)
- Inference time: Instantaneous

**Cost Implications**
- Training cost: Very low
- Storage cost: Minimal
- Inference cost: Negligible
- Best for: Lightweight production systems

**Example Queries**
```sql
CREATE OR REPLACE MODEL project.dataset.ltv_linear
OPTIONS(
  model_type='LINEAR_REG',
  input_label_cols=['customer_lifetime_value']
) AS
SELECT
  avg_order_value,
  purchase_frequency_90d,
  product_diversity,
  tenure_days,
  customer_lifetime_value
FROM `project.dataset.customer_metrics`
WHERE date BETWEEN '2024-01-01' AND '2024-12-31';
```

---

### DNN_CLASSIFIER (Deep Neural Network - Classification)

**Use Cases**
- Complex non-linear relationships: When logistic regression underfits
- Multi-class classification: 3+ outcome classes (risk tiers, propensity quintiles)
- Large feature sets: 100+ features (neural networks capture interactions)
- High-dimensional inputs: Embeddings, image/text data

**Typical Features**
- Extensive feature engineering: Raw + transformed features combined
- Feature interactions: Neural networks learn automatically
- Embeddings: Categorical features as learned embeddings
- Feature count: Hundreds of features manageable

**Training Data Requirements**
- Minimum samples: 100,000+ (more data = better performance)
- Class balance: More sensitive to imbalance than logistic regression
- Feature normalization: Critical (all features should be 0-1 or standardized)
- Missing data: Cannot handle missing values

**Expected Performance**
- AUC-ROC: 0.75-0.95 (can exceed logistic regression significantly)
- Training time: Minutes to hours (larger models take longer)
- Inference time: Fast once deployed
- Overfitting risk: Monitor validation performance carefully

**Cost Implications**
- Training cost: Moderate (more computation than linear models)
- Storage cost: Larger model size
- Inference cost: Higher than logistic regression
- Best for: Accuracy-critical applications

**Example Queries**
```sql
CREATE OR REPLACE MODEL project.dataset.propensity_dnn
OPTIONS(
  model_type='DNN_CLASSIFIER',
  input_label_cols=['will_purchase'],
  hidden_units=[256, 128, 64],
  dropout=0.1,
  max_iterations=100
) AS
SELECT
  recency, frequency, monetary,
  browsing_frequency, cart_abandonment_rate,
  email_open_rate, sms_response,
  device_mobile, session_duration,
  will_purchase
FROM `project.dataset.customer_features_wide`
WHERE date BETWEEN '2024-01-01' AND '2024-12-31';
```

---

### DNN_REGRESSOR (Deep Neural Network - Regression)

**Use Cases**
- Complex revenue prediction: Capturing non-linear spending patterns
- High-dimensional feature spaces: Many features with interactions
- Non-linear relationships: When linear regression has high residuals
- Elasticity modeling: Capturing price-demand curvature

**Typical Features**
- Raw numerical features (amounts, counts)
- Engineered features (ratios, transformations)
- Categorical features (encoded as numerics)
- Temporal features (seasonality indicators)

**Training Data Requirements**
- Minimum samples: 100,000+ (larger datasets improve generalization)
- Target normalization: Normalize target variable for training
- Feature scaling: All features should be normalized
- Outlier handling: Remove extreme outliers

**Expected Performance**
- R-squared: 0.5-0.85 typical
- RMSE: Usually lower than linear regression
- Training time: Hours for large datasets
- Overfitting: Significant risk with small data

**Cost Implications**
- Training cost: Moderate to high
- Storage cost: Moderate
- Inference cost: Moderate
- Best for: When highest accuracy justifies costs

## Clustering Models

### KMEANS (K-Means Clustering)

**Use Cases**
- Customer segmentation: Grouping customers by behavior/value
- Unsupervised learning: No labeled target variable needed
- Exploratory analysis: Understanding data structure
- Audience creation: Define segments for marketing campaigns

**Typical Features**
- Normalized numerical features
- Multi-dimensional profiles (5-50 dimensions typical)
- Distance-based: Euclidean distance drives clustering
- No label needed: Unsupervised approach

**Training Data Requirements**
- Minimum samples: 1,000+ (more data = more stable clusters)
- Feature scaling: Critical (features must be normalized to 0-1)
- Dimensionality: Up to 100+ features manageable
- Number of clusters: Specify k (try multiple values)

**Expected Performance**
- Silhouette score: 0.4-0.7 indicates good clustering
- Within-cluster variance: Lower is better
- Training time: Fast even for large datasets
- Interpretability: Analyze cluster centroids to understand segments

**Cost Implications**
- Training cost: Low
- Storage cost: Very low
- Inference cost: Fast cluster assignment
- Best for: Quick segmentation needs

**Example Queries**
```sql
CREATE OR REPLACE MODEL project.dataset.customer_segments_kmeans
OPTIONS(
  model_type='KMEANS',
  num_clusters=5
) AS
SELECT
  (recency - MIN(recency) OVER()) / (MAX(recency) OVER() - MIN(recency) OVER()) as recency_norm,
  (frequency - MIN(frequency) OVER()) / (MAX(frequency) OVER() - MIN(frequency) OVER()) as frequency_norm,
  (monetary - MIN(monetary) OVER()) / (MAX(monetary) OVER() - MIN(monetary) OVER()) as monetary_norm,
  tenure_years
FROM `project.dataset.customer_metrics`
WHERE date = CURRENT_DATE();
```

---

## Ensemble Models

### BOOSTED_TREE_CLASSIFIER

**Use Cases**
- Binary classification with missing values
- Feature importance analysis needed
- Production reliability important (robust to outliers)
- Interpretability required (feature importance rankings)

**Typical Features**
- Mix of numerical and categorical
- Missing values automatically handled
- Feature interactions learned automatically
- 10-100+ features typical

**Training Data Requirements**
- Minimum samples: 10,000+
- Missing data: Handled internally (no imputation needed)
- Class imbalance: Handled via class weights
- Data type consistency: Types matter

**Expected Performance**
- AUC-ROC: 0.70-0.90 typical
- Training time: Minutes to hours
- Inference time: Fast
- Feature importance: Ranked automatically

**Cost Implications**
- Training cost: Moderate
- Inference cost: Low-moderate
- Best for: Production use requiring robustness

### BOOSTED_TREE_REGRESSOR

**Use Cases**
- Revenue/LTV prediction with robustness
- Missing value handling needed
- Feature importance required
- Non-linear patterns expected

**Typical Features**
- Mix of numerical and categorical
- Missing values allowed
- Categorical features encoded
- Up to 100+ features

**Training Data Requirements**
- Minimum samples: 10,000+
- Missing data: Automatically handled
- Feature scaling: Not required
- Outlier handling: Robust to outliers

**Expected Performance**
- R-squared: 0.5-0.85 typical
- Training time: Hours for large datasets
- Inference: Subsecond per record
- Feature importance: Available and interpretable

---

## AutoML Models

### AUTOML_CLASSIFIER

**Use Cases**
- When model type uncertainty: AutoML selects best architecture
- Time-limited projects: Automated tuning saves time
- Best-in-class performance: Tries multiple approaches
- No ML expertise required: Simplified workflow

**How It Works**
- Tries multiple model architectures (linear, tree, neural networks)
- Performs hyperparameter tuning automatically
- Selects best performer on validation set
- Returns ensemble if beneficial

**Expected Performance**
- AUC-ROC: Usually best-in-class (0.75-0.95)
- Training time: Hours to days (extensive search)
- Inference time: Depends on selected model
- Transparency: Less interpretable than single models

**Cost Implications**
- Training cost: High (extensive search)
- Storage cost: Moderate
- Inference cost: Depends on selected model
- Best for: When accuracy is paramount

### AUTOML_REGRESSOR

**Use Cases**
- Continuous prediction without model selection
- Complex datasets: AutoML finds best approach
- Production systems: Automatic tuning ensures good performance

**Expected Performance**
- R-squared: Usually best-in-class (0.6-0.9)
- Training time: Very long (extensive experimentation)
- Inference time: Depends on ensemble composition

---

## Model Selection Matrix

| Task | Best Choice | Fallback | Avoid If |
|------|-------------|----------|----------|
| Binary classification | LOGISTIC_REG | DNN_CLASSIFIER | Interpretability crucial |
| Multi-class classification | DNN_CLASSIFIER | BOOSTED_TREE | Small data (<10K) |
| Continuous prediction (LTV) | LINEAR_REG | BOOSTED_TREE | Complex relationships |
| Segmentation | KMEANS | - | Need supervise |
| Production system | BOOSTED_TREE | LOGISTIC_REG | Inference speed critical |
| High accuracy needed | AUTOML_CLASSIFIER | DNN_CLASSIFIER | Cost constrained |
| Missing data handling | KMEANS | BOOSTED_TREE | Avoiding native handling |

## Cost Planning Workflow

Before training large models, use `query_builder` with your training query to estimate:
1. Data processed (GB) - impacts cost
2. Execution time
3. Query complexity
4. Optimization recommendations

Example:
```sql
-- Use query_builder before training to estimate costs:
SELECT COUNT(*) as row_count,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(CASE WHEN target_variable IS NULL THEN 1 ELSE 0 END) as missing_targets
FROM `project.dataset.training_data`
WHERE date BETWEEN '2024-01-01' AND '2024-12-31';
```

## Model Evaluation Framework

1. **Training vs. Validation**: Compare AUC/RMSE to detect overfitting
2. **Feature Importance**: Ensure important features rank highest
3. **Threshold Tuning**: For classification, optimize precision-recall tradeoff
4. **Business Impact**: Translate metrics to business value (revenue, churn reduction)
5. **Monitoring**: Track model performance over time (data drift detection)

## Deployment Considerations

- **Latency**: Need sub-second inference? (rules out complex AutoML)
- **Interpretability**: Need to explain decisions? (logistic regression or tree models)
- **Scalability**: Inference volume? (all BQML models scale in BigQuery)
- **Maintenance**: Can you retrain monthly? (more complex models require more monitoring)
