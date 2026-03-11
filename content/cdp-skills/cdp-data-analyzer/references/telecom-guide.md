# Telecom Industry Analysis Guide

## Overview
This guide provides analysis frameworks for telecom carriers and service providers. Focus on subscriber behavior, usage patterns, churn drivers, and revenue optimization.

## Subscriber Base Analysis

### Subscriber Lifecycle Stages
Track customers through their journey:

**New Subscriber** (0-3 months)
- Activation completion rate
- Initial plan exploration
- Feature adoption patterns
- Early churn risk identification

**Growth Subscriber** (3-12 months)
- Usage stabilization
- Plan upgrade readiness signals
- Service confidence indicators
- Network quality perception

**Mature Subscriber** (12-36 months)
- Usage normalization
- Churn susceptibility signals
- Cross-sell opportunity identification
- Loyalty indicators

**At-Risk Subscriber** (36+ months OR showing decline)
- Usage declining
- Increased complaint frequency
- Plan downgrade requests
- Competitive offer vulnerability

### Cohort Analysis
- Track monthly cohorts through lifecycle
- Measure churn rates by lifecycle stage
- Identify cohort-specific patterns (network improvements benefit newer cohorts more?)
- Compare pre/post-service-change cohorts

Use `time_travel` to analyze subscriber base composition changes across quarters.

## Usage Pattern Trends

### Core Usage Metrics
Track consumption patterns by service type:

**Data Usage**
- GB per month (trending up/flat/down)
- Peak usage hours
- Data speed tier preference
- Streaming vs. general usage patterns

**Voice Usage**
- Minutes per month (declining due to messaging/app adoption)
- Peak calling hours
- Domestic vs. roaming minutes
- Call duration distribution

**SMS/Messaging**
- Message count per month
- Decline rate (transition to OTT apps)
- Roaming message usage
- Bundle utilization

### Trend Decomposition
Analyze drivers of usage changes:
- **Feature adoption**: New unlimited plans driving higher usage?
- **Seasonal patterns**: Summer vacation increasing roaming usage?
- **Network quality**: Better coverage enabling video streaming?
- **Competitive shifts**: Usage changes due to competitor offerings?

### Subscriber Segmentation by Usage
- Heavy users (top 20%): Data hogs, long talkers
- Moderate users (middle 60%): Balanced consumption
- Light users (bottom 20%): Minimal engagement, churn risk

Use `feature_analysis` with `metric_types: ["statistical", "quality"]` to profile usage distributions.

## Network-Correlated Churn Analysis

### Service Quality Indicators
Track metrics correlating with churn:
- **Drop call rate**: Calls dropped vs. total calls
- **Network congestion**: Peak hour blocking probability
- **Coverage gaps**: Geographic areas with poor signal
- **Speed degradation**: Actual speeds vs. promised speeds

### Churn-Quality Relationship
Analyze customer churn by service quality:
1. Segment subscribers by experienced quality metrics
2. Calculate churn rate per quality tier
3. Identify quality "cliff points" (quality level triggering churn)
4. Measure improvement ROI (quality investment → churn reduction)

### Root Cause Analysis
- High churn in specific geographies suggests coverage issues
- High churn post-network-outage suggests outage impact duration matters
- Churn increase after speed test suggests network-aware customer knowledge
- Churn by network type (4G vs. 5G) suggests technology readiness issues

### Implementation
Map quality metrics to subscriber data using `time_travel` CDF analysis to identify temporal correlations between outages and churn.

## Plan Migration Analysis

### Plan Movement Patterns
Track transitions between plans:
- **Upgrade**: Moving to higher-tier plan (data allowance, speed, features)
- **Downgrade**: Moving to lower-tier plan (cost concern signals)
- **Lateral**: Switching between same-tier plans (feature preference change)
- **Bundle addition**: Adding bundled services (home internet, TV)

### Upgrade Drivers
Identify what triggers upgrades:
- Usage approaching limits (often 70-80% of monthly allowance)
- New service launches (5G, WiFi calling)
- Competitive promotional offers
- Device technology changes (5G-capable phones)
- Family changes (adding family members)

### Downgrade Triggers
Identify churn-risk downgrade signals:
- Cost-driven downgrades (price sensitivity indicator)
- Feature elimination (indicates changing needs)
- Post-competitor-contact downgrades (lost to competition)
- Downgrade to minimum plan before churn (preparation signal)

### Plan Feature Affinity
- Which features drive retention?
- Which features are rarely used (redundant/unnecessary)?
- Do bundle subscribers have lower churn?
- What plan is "sticky" (lowest downgrade rate)?

## ARPU Trend Decomposition

### Average Revenue Per User Calculation
ARPU = (Data Revenue + Voice Revenue + SMS Revenue + Services + Add-ons) / Subscriber Count

### Trend Components
Decompose ARPU trends into drivers:

**Usage Component**: More data/minutes consumed
- Volume increase but flat pricing = ARPU increase
- Volume stable but price decrease = ARPU decrease

**Price Component**: Plan price changes
- Plan upgrades → higher ARPU
- Promotional discounting → lower ARPU
- Plan obsolescence → migration changes

**Mix Component**: Service portfolio shifts
- More video subscriber adoption → higher data ARPU
- Decline of voice → lower overall ARPU
- Bundle adoption (voice + data + services) → higher ARPU

**Subscriber Quality Component**: Churn/acquisition shifts
- High-value subscriber churn → ARPU decline
- Low-value subscriber churn → ARPU increase
- Acquisition of value-tier subscribers → ARPU decline

### Analysis Approach
1. Calculate ARPU by month and subscriber cohort
2. Segment by service mix (voice-heavy, data-heavy, balanced)
3. Track ARPU movement for each segment separately
4. Identify inflection points coinciding with pricing/feature changes

Use `query_builder` cost analysis for large historical ARPU aggregations.

## Device Ecosystem Analysis

### Device Diversity
Track subscriber device portfolio:
- **Smartphone distribution**: iPhone vs. Android market share
- **Capability levels**: 4G vs. 5G capable devices
- **Device age**: Average device tenure, upgrade cycles
- **Brand preferences**: Device brand loyalty within subscriber base

### Device-Usage Correlation
- 5G devices show higher data usage?
- Older devices show declining usage (replacement timing signal)?
- Specific device models have higher churn (quality perception)?
- Device type affects plan choice (premium devices → premium plans)?

### Device Ecosystem and Revenue
- High-end device owners = higher ARPU?
- Device upgrade cycles correlate with plan upgrades?
- Bundle offers more attractive to specific device owners?
- Device trade-in program participants have better retention?

### Implementation
Use `feature_analysis` with `metric_types: ["quality"]` to profile device portfolio and identify device-churn correlations.

## Competitive Landscape Signals

### Churn Attribution Signals
Identify competitive pressure indicators:
- **Win/loss analysis**: Exit interview signals (moving to Competitor A)
- **Network switching**: Subscriber complaints about competitor coverage
- **Promotional pressure**: Churn spikes during competitor campaigns
- **Feature gaps**: Churn if competitor enables feature not yet available

### Competitive Offer Response
- What % of subscribers accept competitive offers (win-back attempts show elasticity)
- How long before they churn after offer rejection?
- Are specific segments more poachable?
- Does counter-offer prevent churn or just delay?

### Market Share Trends
- Track market share by geographic region
- Benchmark share vs. growth/churn trends
- Identify geographies losing share (need defensive action)
- Identify geographies gaining share (replicable best practices?)

### Monitoring Approach
1. Track competitor promotional campaigns and timing
2. Measure churn spikes around competitor activities
3. Analyze win/loss data for mention patterns
4. Calculate competitor-attributed churn rate

Use `time_travel` to analyze churn trends around known competitive events.

## Integration Workflow

1. **Data Mapping**: Use `schema_discovery` to identify subscriber, usage, quality, and plan tables
2. **Quality Analysis**: Apply `feature_analysis` to usage and quality distributions
3. **Temporal Analysis**: Use `time_travel` for trend decomposition and event impact
4. **Cost Planning**: Use `query_builder` before large subscriber behavior joins
