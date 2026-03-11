# Media & Streaming Lookalike Finder Guide

## Overview
Media and streaming lookalike audiences target customers with similar content consumption patterns, viewing behavior, and subscription preferences. This guide addresses genre preference matching, platform usage, and engagement rhythm for efficient subscriber acquisition.

## Key Similarity Dimensions

### Content Consumption Patterns

**Genre Preference**
- Primary genre affinity (drama, comedy, action, documentary, etc.)
- Genre diversity (specialist vs broad consumer)
- Sub-genre preferences
- Content discovery method (browsing vs recommendations)
- Content theme preferences (character-driven vs plot-driven)

**Viewing Behavior**
- Viewing time per day/week baseline
- Session frequency and duration
- Peak viewing times
- Device-based viewing patterns
- Content completion rate

**Binge Behavior**
- Binge-watcher vs episodic viewer
- Series completion rate
- Duration of binge sessions
- Content sequencing (watching multiple series vs one focus)
- Return rate after completion

**Content Preference Evolution**
- Genre exploration (trying new genres)
- Content quality expectations
- New vs popular content preference
- Cult following likelihood (niche content)
- Award-winning content interest

### Platform & Device Behavior

**Primary Platform Usage**
- Platform preference (Netflix, Disney+, HBO Max, etc.)
- Multi-platform subscription patterns
- Platform-specific feature usage
- Device type preference (TV, mobile, tablet, computer)
- Device quantity (single vs multi-device household)

**Viewing Infrastructure**
- Internet quality requirements
- Download/offline consumption usage
- Simultaneous stream count needs
- 4K/HD preferences
- Smart TV vs other devices

**Technology Adoption**
- Early adopter of new features
- Interactive content participation (Black Mirror: Bandersnatch style)
- Real-time vs on-demand preference
- Voice interface adoption
- Personalization feature usage

### Subscription & Engagement

**Subscription Tier**
- Basic vs standard vs premium tier
- Plan upgrade/downgrade patterns
- Free vs paid preference (when choice available)
- Household sharing (profile sharing usage)
- Trial-to-paid conversion likelihood

**Engagement Depth**
- App/service feature exploration
- Recommendation acceptance
- Watchlist creation and usage
- Social sharing frequency
- Community engagement (forums, discussions)

**Payment Behavior**
- Billing willingness (price sensitivity)
- Subscription duration commitment
- Bundle preference (ad-supported vs premium)
- Family/household plan adoption
- Gift subscription acceptance

### Social & Influencer Engagement

**Social Sharing Behavior**
- Content sharing frequency
- Sharing platform (Twitter, Instagram, TikTok)
- Spoiler discussion patterns
- Influencer recommendation following
- User-generated content consumption

**Community Engagement**
- Fan community participation
- Online discussion group involvement
- Review writing and rating behavior
- Fan art/content creation
- Streaming party participation

**Social Network Effect**
- Influence on friends' subscriptions
- Household co-viewers
- Family watch-together patterns
- Friend recommendation acceptance

### Ad Engagement (If Applicable)

**Ad Response**
- Ad skip behavior
- Ad completion rates (if skippable)
- Ad recall patterns
- Ad-supported tier users
- Ad-free preference willingness to pay

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- hours_watched_monthly
- sessions_per_week
- session_duration_average_minutes
- primary_genre
- genre_count_monthly
- content_completion_rate
- binge_episodes_per_session
- subscription_tier
- multi_platform_subscription_count
- primary_device_type
- simultaneous_streams_needed
- days_since_last_watch
- subscriber_tenure_days
- content_sharing_frequency
- recommendation_acceptance_rate
- family_household_profiles_count
- new_feature_adoption_score
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (subscriber profiles and preferences)

### Statistical Metrics
- Viewing hours distribution (10th, 50th, 90th percentiles)
- Session frequency distribution
- Session duration distribution
- Genre diversity distribution (entropy metric)
- Completion rate distribution

### Quality Metrics
- Viewing timestamp consistency
- Content categorization accuracy
- Device type classification consistency
- Recommendation system data freshness

## Seed Audience Definition

### Approach
1. **Select Subscriber Type**: Identify valuable or strategic segment
2. **Establish Viewing Baseline**: Document content consumption patterns
3. **Map Content Affinity**: Identify genre and content preferences
4. **Profile Engagement**: Document binge patterns and social behavior
5. **Define Platform Usage**: Identify device and platform preferences

### Example Seed Profiles

**Seed 1: "Dedicated Binge Watcher"**
- Monthly viewing: 40+ hours
- Session length: 120+ minutes typical
- Genre primary: Drama series, prestige content
- Content diversity: 2-3 active series at once
- Completion rate: 80%+
- Binge pattern: Marathon weekend viewing
- Tier: Premium (ad-free, multiple streams)
- Devices: TV primary, tablet secondary
- Social: High sharing, community participant
- Tenure: Long-term, stable subscriber

**Seed 2: "Casual Entertainment Consumer"**
- Monthly viewing: 15-25 hours
- Session length: 45-60 minutes typical
- Genre primary: Comedy, reality, light content
- Content diversity: Varied, browsing-driven
- Completion rate: 40-50%
- Binge pattern: Evening relaxation, episodic
- Tier: Standard (with ads or mid-tier)
- Devices: TV primary, mobile browsing
- Social: Occasional sharing, friends influence
- Tenure: Moderate, trial-prone to downgrade

**Seed 3: "Quality-Focused Viewer"**
- Monthly viewing: 20-30 hours
- Session length: 90-120 minutes typical
- Genre primary: Award-winning, documentaries, prestige
- Content diversity: Focused, purposeful selection
- Completion rate: 70-90%
- Binge pattern: Scheduled viewing, quality focus
- Tier: Premium (quality preference)
- Devices: Multi-device, quality-conscious
- Social: Review writing, community forums
- Tenure: Long-term, engaged subscriber

## Matching Methodology

### Feature Space Construction
1. **Viewing Pattern Vector**: Hours, frequency, session length
2. **Genre Affinity**: Multi-hot encoding of genre preferences
3. **Engagement Style**: Binge vs episodic, completion rates
4. **Platform Footprint**: Device preferences, multi-platform usage
5. **Community Engagement**: Sharing, recommendation, discussion participation

### Similarity Scoring
- **Viewing Volume Alignment**: Within ±40% of seed monthly viewing hours
- **Genre Preference Match**: Similar primary genre, ±1-2 secondary genres
- **Session Pattern**: ±20 minutes session duration, ±1 session/week frequency
- **Binge Behavior**: Same classification (binge vs episodic)
- **Platform Preference**: Same primary platform/device
- **Tier Alignment**: Same or adjacent subscription tier

### Candidate Filtering
- **Exclude**: Currently churned or cancelled subscribers
- **Exclude**: Customers with payment issues
- **Priority**: Customers with active watchlists (engagement signal)
- **Priority**: Recent signups showing high early engagement
- **Bias toward**: Multi-platform subscribers (cross-promotion opportunity)

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Primary genre, viewing volume range, tier preference
- Can vary: Secondary genres, session timing, device types
- Expansion ratio: 4-8x
- Expected engagement match: 85-95%

**Tier 2: Moderate (Balanced)**
- Must match: Content appetite (hours range), engagement style
- Can vary: Specific genres (similar type), platform mix
- Expansion ratio: 12-25x
- Expected engagement match: 70-85%

**Tier 3: Aggressive (Volume)**
- Must match: General subscriber type (casual vs dedicated)
- Can vary: Genres, viewing patterns (±50% tolerance)
- Expansion ratio: 40-100x
- Expected engagement match: 50-75%

## Expected Expansion Ratios

### By Subscriber Type

**Dedicated Binge Seeds**
- Conservative: 3-6x
- Moderate: 10-18x
- Aggressive: 25-50x
- Rationale: Smaller dedicated segment, high-value

**Casual Viewer Seeds**
- Conservative: 6-12x
- Moderate: 18-40x
- Aggressive: 60-150x
- Rationale: Large casual population, volume segment

**Quality Viewer Seeds**
- Conservative: 5-10x
- Moderate: 15-30x
- Aggressive: 40-80x
- Rationale: Niche quality-focused segment

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Primary genre (content fit)
- Viewing volume (engagement level)
- Session pattern (usage consistency)
- Binge behavior (retention predictor)

### Important Dimensions (Weight: 2.0x)
- Subscription tier (product preference)
- Completion rate (satisfaction proxy)
- Platform preference (technology fit)
- Social engagement (community value)

### Supplementary Dimensions (Weight: 1.0x)
- Device specifics (operational)
- Secondary genres (personalization)
- Sharing patterns (acquisition channel)

## Implementation Approach

### Data Requirements
- Minimum 60 days of viewing history
- Complete genre tagging for viewed content
- Device and platform tracking
- Session-level data (start time, duration)
- Social sharing and engagement events
- Subscription tier and dates

### Lookalike Creation Steps
1. Use schema_discovery to understand viewing behavior data model
2. Run feature_analysis on seed segment for baseline metrics
3. Use time_travel to identify stable viewers (not churning)
4. Calculate feature-space similarity for candidates
5. Apply genre and engagement-based filtering
6. Generate lookalike audiences at multiple tiers
7. Validate against historical acquisition performance

### Validation Strategy
- Compare lookalike monthly viewing hours to seed
- Verify genre preference distribution
- Check binge-vs-episodic pattern consistency
- Monitor tier adoption rates
- Track churn rate similarity

## Segment-Specific Matching

### Premium/Ad-Free Matching
- Emphasis on viewing volume and high engagement
- Quality content preference
- Expected expansion: 5-15x

### Ad-Supported Tier Matching
- Emphasis on casual viewers with budget sensitivity
- Broader genre acceptance
- Expected expansion: 30-80x

### International Content Matching
- Language/subtitle preference
- Cultural content preferences
- Regional platform availability
- Expected expansion: 8-20x

## Performance Expectations

- Lookalike audience size: 50-200x seed (depending on seed type)
- Viewing hours per month: 70-95% of seed viewing
- Tier conversion: 80-95% adopt within 30 days
- Churn rate: Within ±2% of seed segment
- Engagement lift: 20-40% vs non-targeted audience
- Content recommendation acceptance: 75-90% of seed
- False positive rate: 12-18%

## Seasonal Patterns

- Peak viewing periods (holidays, breaks)
- New season release impact
- Summer viewing patterns (outdoor competition)
- Award season content waves
- Event-driven viewing (sports, live content)

## Monitoring & Optimization

### Key Metrics
- Monthly viewing hours consistency
- Genre preference stability
- Churn rate alignment
- Tier upgrade/downgrade patterns
- Social sharing engagement

### Refinement Triggers
- Viewing hours variance >25% from seed
- Genre preference shift detected
- Churn rate >3% variance
- Binge behavior changes
- Device preference evolution

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for subscriber dimensions
- Identify calculated_attribute for engagement scores
- Verify genre and platform taxonomy

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish viewing and engagement distributions
- Identify tier and device preferences
- Validate genre categorization

### time_travel Usage
- Track viewing patterns over 90+ days
- Identify stable vs declining viewers
- Monitor genre preference changes
- Detect early churn signals

### query_builder Usage
- Cost estimation for viewing history queries
- Optimize genre matching calculations
- Model scalability of expansion tiers

## Implementation Checklist

- [ ] Define 2-4 seed subscriber profiles
- [ ] Establish viewing baseline and tolerance bands
- [ ] Document genre taxonomy and preferences
- [ ] Map binge vs episodic behavior patterns
- [ ] Create feature space vectors
- [ ] Build similarity scoring formula
- [ ] Test on historical subscribers (backtesting)
- [ ] Validate lookalike vs seed engagement metrics
- [ ] Set up performance dashboards
- [ ] Plan A/B testing for targeting
- [ ] Document expansion ratio assumptions
- [ ] Schedule quarterly model refinement
