---
name: cdp-data-analyzer
description: High-level data analysis driven by business goals. Translates "why is X happening?" into systematic data investigation. Use this when you need to understand root causes, explore trends, or answer what-if questions about customer data. Triggered by diagnostic queries, exploratory requests, and performance analysis questions. Pushes back on vague requests—demand clarity on whether you're diagnosing a problem, exploring unknowns, or predicting outcomes before diving into MCP calls.
---

# CDP Data Analyzer Skill

## Purpose
This skill translates business questions and analytical goals into structured data investigations using the Zeotap CDP platform. It bridges the gap between "why is X happening?" and actionable insights backed by data.

## When to Use This Skill

**Trigger on these user intents:**
- "Analyze why our churn increased last month"
- "What's driving engagement in our top segment?"
- "Trend analysis for feature adoption"
- "Data exploration to understand customer behavior"
- "Insights on what happened to our metrics"
- "Performance analysis across cohorts"
- "Dig into the attributes correlated with conversions"
- "Investigate why this audience is underperforming"
- "What's the pattern in our most loyal customers?"

**Do NOT trigger on:**
- Schema/metadata questions (use cdp-metadata-explorer)
- Pipeline/sync monitoring (use cdp-data-manager)
- Audience building/segmentation (use cdp-audience-finder)
- System health checks (use cdp-health-diagnostics)

## Analysis Workflow

### Step 1: Clarify the Analysis Goal
Always ask for or infer the analysis type before touching MCP tools:

- **Diagnostic**: "Why did metric X change?" → Compare time periods, isolate variables
- **Exploratory**: "What are the patterns in our data?" → Distribute analysis, outlier detection
- **Predictive**: "What happens next?" → Trend projection, correlation analysis
- **Comparative**: "How does Segment A differ from Segment B?" → Statistical comparison

### Step 2: Map Goal to Data Using MCP Tools

#### Discovery Phase
```
schema_discovery(operation: "overview")
→ Understand available stores (profile_store, event_store, calculated_attribute)
→ Identify candidate columns for analysis
```

#### Feature Analysis Phase
```
feature_analysis(
  columns: [relevant_attributes],
  metric_types: ["basic", "statistical", "quality", "user_metrics"],
  store_type: [inferred_from_goal]
)
→ Get full statistical picture: distributions, percentiles, cardinality
→ Identify data quality issues that could skew analysis
→ Understand fill rates and missing data patterns
```

#### Temporal Analysis Phase (for trends/changes)
```
time_travel(
  starting_timestamp: [period_1_start],
  ending_timestamp: [period_1_end],
  columns: [relevant_attributes],
  include_statistics: true,
  metrics: ["basic", "statistical", "quality"]
)
→ Compare across time windows to identify changes
→ Measure insert/update/delete velocity
→ Track quality degradation or improvement
```

#### Cost Validation Phase (before heavy lifting)
```
query_builder(query: [proposed_analysis_query], location: "europe-west1")
→ Validate cost before recommending expensive queries
→ Use to scope multi-month or multi-million-row analyses
```

### Step 3: Analysis Frameworks by Goal Type

#### Diagnostic Analysis (Why did X change?)
1. Establish baseline: use time_travel with historical window
2. Identify change point: compare pre/post periods
3. Isolate variables: feature_analysis on suspected drivers
4. Find attribution: which attributes correlate with the change?
5. Validate: cross-check with alternative time windows

**Example Query Path:**
```
time_travel(Jan 1-31 vs Feb 1-28)
  → feature_analysis(metrics:statistical) on columns that changed most
  → time_travel(Feb 1-7 vs Feb 22-28) to narrow the inflection point
```

#### Exploratory Analysis (What patterns exist?)
1. Scan full distribution: feature_analysis(statistical, quality)
2. Identify outliers: look for percentiles far from median
3. Segment by attribute: compare metrics across categorical splits
4. Check temporal patterns: time_travel with include_statistics
5. Cross-correlate: see which attributes co-vary

**Example Query Path:**
```
feature_analysis(all metrics)
  → Spot high cardinality or skewed distributions
  → time_travel(last_3_months, include_statistics)
  → Identify seasonal or growth patterns
```

#### Trend Analysis (Is this growing/shrinking?)
1. Define time buckets: monthly, weekly, or daily granularity
2. Measure velocity: time_travel with change_types filter
3. Calculate slopes: compare insert/update rates across periods
4. Test seasonality: compare same periods across years
5. Project forward: use statistical trends to extrapolate

**Example Query Path:**
```
time_travel(last_12_months, include_statistics, metrics:basic)
  → Measure month-over-month growth rate
  → time_travel(same_period_last_year)
  → Subtract seasonal effect to find true trend
```

### Step 4: Vertical-Specific Analysis Guidance

The analysis approach varies by industry. **Always ask the user's vertical before deep analysis.** Reference these guides:

- **Retail** → `references/retail-guide.md`
  - Focus on cohort analysis, seasonality, basket composition
  - Key metrics: AOV by segment, repeat purchase rates, churn by cohort age

- **Gaming** → `references/gaming-guide.md`
  - Focus on retention curves, monetization funnels, session patterns
  - Key metrics: Day 1/7/30 retention, ARPU by cohort, churn risk signals

- **Telecom** → `references/telecom-guide.md`
  - Focus on network-correlated churn, usage trends, contract lifecycle
  - Key metrics: ARPU drift, usage volatility, customer tenure cohorts

- **BFSI** → `references/bfsi-guide.md`
  - Focus on AUM trajectories, product adoption lifecycle, risk segmentation
  - Key metrics: Asset growth by segment, product cross-sell, dormancy signals

- **Travel** → `references/travel-guide.md`
  - Focus on booking patterns, seasonality, destination affinity
  - Key metrics: Trip frequency, advance booking window, price sensitivity

- **Media** → `references/media-guide.md`
  - Focus on engagement depth, content affinity, churn risk
  - Key metrics: Session length, content completion, subscription duration

- **Automotive** → `references/automotive-guide.md`
  - Focus on model affinity, dealer network, maintenance lifecycle
  - Key metrics: Intent signals, service appointment frequency, loyalty cohorts

- **Healthcare** → `references/healthcare-guide.md`
  - Focus on appointment adherence, condition-specific cohorts, compliance
  - Key metrics: Provider affinity, appointment no-show rates, medication adherence

## Presenting Findings

Structure all analysis findings as:

1. **Key Insight** (1-2 sentences): The headline finding
2. **Supporting Data**: The metrics, trends, and comparisons that back it up
3. **Confidence Level**: Based on sample size, data quality, and time window coverage
4. **Recommended Next Steps**: What to investigate further, or what actions to take

**Example:**
```
KEY INSIGHT: Mobile users in Western Europe have 34% lower 7-day retention than desktop users in the same cohort.

SUPPORTING DATA:
- Desktop cohort (Jan 1-7, n=45,000): 64% Day 7 retention
- Mobile cohort (Jan 1-7, n=38,000): 42% Day 7 retention
- Difference persists in Feb and Mar data (seasonally adjusted)
- Gap narrows on devices with iOS 17+ (2-point improvement)

CONFIDENCE: High (large sample sizes, consistent across months)

NEXT STEPS:
1. Investigate if gap is device-specific (iOS vs Android) or OS version
2. Run feature_analysis on mobile cohort to identify attribute differences
3. Coordinate with product team to isolate UX differences
4. Segment by user acquisition source (organic vs paid) to check cohort quality
```

## Related Skills

- **cdp-data-scientist**: For deeper statistical modeling, predictive analytics, or ML-driven insights
- **cdp-audience-finder**: To build segments or audiences based on analysis findings
- **cdp-data-manager**: If analysis reveals data quality issues or pipeline problems
- **cdp-metadata-explorer**: To understand schema or data lineage questions

## Common Pitfalls to Avoid

1. **Confusing correlation with causation**: Always caveat findings; recommend A/B testing for validation
2. **Ignoring data quality**: Check fill_rate and cardinality before trusting patterns
3. **Cherry-picking time windows**: Always compare multiple periods to rule out noise
4. **Forgetting seasonal factors**: Adjust for known seasonal patterns before calling something a trend
5. **Over-indexing on outliers**: Use percentile analysis, not just min/max
6. **Skipping cost checks**: Always run query_builder before recommending expensive multi-month queries

## Key MCP Tools Reference

| Tool | When to Use | Output |
|------|-------------|--------|
| `schema_discovery(overview)` | Start of analysis to find relevant data | Store types, column counts, data freshness |
| `feature_analysis(all)` | Understanding distributions and relationships | Percentiles, cardinality, fill rates, PII flags |
| `time_travel` | Comparing time periods or measuring trends | Change statistics, CDF breakdown, temporal patterns |
| `query_builder` | Before recommending large queries | Cost estimate, execution time, optimization tips |

## Example Workflows

### Workflow 1: Diagnose Churn Spike
```
1. User says: "Churn went up 15% last month, why?"
2. Clarify: "Churn" = cancellation rate? Inactive for 30 days? (diagnostic goal)
3. schema_discovery(overview) → find churn-related columns
4. time_travel(prev_month vs current_month, metrics:basic) → quantify change
5. feature_analysis(quality) on top 10 columns → find which ones changed
6. time_travel(weekly granularity, last_3_months) → pinpoint the inflection point
7. Isolate: feature_analysis(all) on cohorts before/after inflection
8. Conclude: "Churn spike correlates with 40% drop in email engagement (fill rate down)"
```

### Workflow 2: Explore Engagement Patterns
```
1. User says: "Help us understand what drives engagement"
2. Clarify: Engagement = login frequency? Session time? Feature usage? (exploratory)
3. schema_discovery(overview) → find engagement metrics
4. feature_analysis(all) → statistical deep dive on all engagement columns
5. Identify: "Power users" (top 10% by session count) vs "casual" (bottom 25%)
6. feature_analysis(specific columns) on each segment → compare profiles
7. time_travel(last_3_months) → see if segments are stable or shifting
8. Conclude: "3 distinct engagement profiles exist; power users skew 35+ and have 4x session length"
```

### Workflow 3: Validate Trend
```
1. User says: "Is our app adoption growing?"
2. Clarify: Monthly active users? Feature adoption rate? (trend analysis)
3. schema_discovery(overview) + feature_analysis(basic) → baseline
4. time_travel(last_12_months, metrics:basic, include_statistics) → measure month-over-month
5. query_builder(trend query) → validate cost before heavy projection
6. time_travel(same_period_last_year) → check seasonality
7. Conclude: "Core MAU growing 8% MoM, but seasonal dip occurs Oct-Nov each year"
```
