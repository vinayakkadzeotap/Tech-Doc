# Gaming Lookalike Finder Guide

## Overview
Gaming lookalike audiences are built on playstyle, spending patterns, and engagement rhythms. This guide addresses genre preferences, session patterns, and social behavior matching for acquiring similar high-value players.

## Key Similarity Dimensions

### Genre & Content Preference

**Primary Genre Affinity**
- Core game type (RPG, FPS, Puzzle, Strategy, Casual, etc.)
- Genre concentration (specialist vs diversified player)
- Sub-genre preferences within primary
- Thematic preference (fantasy, sci-fi, historical, etc.)
- Competitive vs collaborative game preference

**Content Discovery Pattern**
- How players discover games (store browsing, influencers, friends, ads)
- Content type preference (story-driven, gameplay-focused, social)
- Update engagement (follow patch notes, early access adoption)
- Event participation tendency
- Cross-platform content awareness

### Spending Behavior

**Spending Tier Classification**
- Whale: >$100/month average
- Dolphin: $10-99/month average
- Minnow: <$10/month
- Free-to-play: $0 spending

**Monetization Preference**
- Cosmetic spending focus
- Battle pass purchases
- Season pass patterns
- Premium currency preference
- Gambling mechanics (loot boxes) engagement

**Purchase Frequency**
- Spending consistency (regular vs sporadic)
- Spending triggers (new content, events, seasonal)
- Impulse vs planned purchase ratio
- Gifting behavior

### Session & Engagement Patterns

**Session Structure**
- Typical session length (2 hours vs 30 minutes)
- Sessions per week consistency
- Peak play times (evening, weekend, etc.)
- Session rhythm (daily streaks vs irregular)
- Playtime windows (commute gaming vs marathon sessions)

**Engagement Depth**
- Progression speed through content
- Skill level indicators (KDR, rank, completion %)
- Feature exploration (trying new mechanics)
- Patch adoption speed
- Challenge difficulty preference

**Event Participation**
- Special event attendance rate
- Limited-time content engagement
- Tournament/competitive event interest
- Community challenge participation
- Seasonal content adoption

### Social & Community Behavior

**Social Structure**
- Solo player vs multiplayer preference
- Friends list size active in game
- Guild/clan participation
- Social feature usage (chat, groups, streaming)
- Influencer following

**Cooperative Patterns**
- Team play frequency
- Squad/party consistency
- Communication tool usage
- Raid/dungeon participation
- Cross-friend-group play

**Competitive Engagement**
- PvP participation rate
- Leaderboard interest
- Ranked mode engagement
- Tournament participation
- Streaming/content creation

### Platform & Device Behavior

**Platform Preference**
- Primary platform (PC, Console, Mobile)
- Cross-platform play adoption
- Device upgrade patterns
- Platform-specific feature usage
- Controller vs keyboard preference

**Device Loyalty**
- Device tenure before upgrade
- Accessory investment
- Hardware performance tier
- Multi-device play
- Portability importance

### Progression & Achievement

**Progression Speed**
- Time-to-max-level patterns
- Completion rate of story content
- Achievement hunting behavior
- Endgame engagement speed
- Seasonal reset participation

**Achievement Type Preference**
- Combat-focused achievements
- Exploration rewards
- Collection completion
- Skill-based accomplishments
- Social achievements

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- primary_genre
- total_spending_lifetime
- monthly_spending_average
- spending_tier
- average_session_length_minutes
- sessions_per_week
- login_streak_current
- friends_active_count
- guild_member_flag
- competitive_rank
- progression_level_percent
- event_participation_rate
- days_since_new_player
- cosmetic_purchase_count
- platform_primary
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (player profile and preferences)

### Statistical Metrics
- Session length distribution (10th, 50th, 90th percentiles)
- Spending distribution by tier
- Friends list size distribution
- Progression speed percentiles (levels per week)
- Event participation rate distribution

### Quality Metrics
- Session timestamp consistency
- Spending data integrity (currency conversion)
- Rank/progression data validation
- Genre categorization consistency

## Seed Audience Definition

### Approach
1. **Select Successful Player Segment**: Choose profitable/engaged demographic
2. **Define Playing Style**: Establish primary characteristics
3. **Profile Monetization**: Document spending patterns
4. **Map Social Patterns**: Identify community engagement level

### Example Seed Profiles

**Seed 1: "Casual Social Gamer"**
- Primary genre: Puzzle/Casual
- Spending tier: Minnow ($2-5/month)
- Session pattern: 3-4 sessions/week, 30 minutes each
- Social: Friends-focused, casual competition
- Device: Mobile primary
- Progression: Relaxed, no pressure

**Seed 2: "Competitive Focused Player"**
- Primary genre: FPS/MOBA
- Spending tier: Dolphin ($25-50/month)
- Session pattern: 5-7 sessions/week, 90+ minutes each
- Social: Team-oriented, competitive ranking focused
- Device: PC/Console
- Progression: Fast advancement, skill-based

**Seed 3: "Story-Driven Explorer"**
- Primary genre: RPG/Adventure
- Spending tier: Dolphin ($15-30/month)
- Session pattern: 3 sessions/week, 120+ minutes each
- Social: Solo/occasional multiplayer
- Device: Console primary
- Progression: Thorough, achievement hunting

## Matching Methodology

### Feature Space Construction
1. **Genre Vector**: Multi-hot encoding of preferred genres
2. **Spending Profile**: Historical spending amount and pattern
3. **Session Signature**: Typical session length and frequency
4. **Social Score**: Friend count and community participation
5. **Platform Profile**: Device and platform usage

### Similarity Scoring
- **Genre Match**: Cosine similarity of genre preferences
- **Spending Tier Proximity**: Same tier or adjacent tier with 70% tolerance
- **Session Pattern Alignment**: ±20 minutes session length, ±1 session/week frequency
- **Social Behavior**: Similar guild participation and friend count ranges
- **Platform Consistency**: Same primary platform preference

### Candidate Filtering
- **Exclude**: Players in active churn detection window
- **Exclude**: Players with zero spending (if monetization goal)
- **Exclude**: Banned or suspended accounts
- **Priority**: Players with increasing engagement trends
- **Bias toward**: Similar tenure as seed (onboarding stability)

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Primary genre, spending tier, session pattern
- Can vary: Secondary genre, exact session length (±10 min)
- Expansion ratio: 3-5x
- Expected LTCV match: 85%+ of seed

**Tier 2: Moderate (Balanced)**
- Must match: Spending tier, playstyle family
- Can vary: Secondary genre, session frequency (±1/week)
- Expansion ratio: 8-15x
- Expected LTCV match: 70-85% of seed

**Tier 3: Aggressive (Volume)**
- Must match: General player type (core vs casual)
- Can vary: Specific genre, spending volatility tolerance
- Expansion ratio: 25-50x
- Expected LTCV match: 50-70% of seed

## Expected Expansion Ratios

### By Seed Type

**Casual Player Seeds**
- Conservative: 5-8x
- Moderate: 15-25x
- Aggressive: 40-80x
- Rationale: Large casual population, many similar players

**Core Player Seeds**
- Conservative: 3-5x
- Moderate: 8-15x
- Aggressive: 20-40x
- Rationale: Smaller committed population, harder to match

**Whale Player Seeds**
- Conservative: 1-3x
- Moderate: 3-8x
- Aggressive: 10-20x
- Rationale: Extremely rare profile, limited similar players

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Primary genre (content fit essential)
- Spending tier (monetization alignment)
- Session frequency (engagement match)
- Platform (technical compatibility)

### Important Dimensions (Weight: 2.0x)
- Social engagement style (team vs solo)
- Progression speed (onboarding fit)
- Event participation (retention predictor)
- Monetization preferences (offer relevance)

### Supplementary Dimensions (Weight: 1.0x)
- Secondary genres (nice-to-have diversity)
- Cosmetic preferences (personalization)
- Device diversity (edge case handling)

## Implementation Approach

### Data Requirements
- 30+ days of behavioral history per player
- Complete genre and platform tracking
- Spending transaction detail linked to player
- Social connection data (friends, guilds)
- Session-level gameplay metrics

### Lookalike Creation Steps
1. Use schema_discovery to understand player data model
2. Run feature_analysis on seed cohort for baseline metrics
3. Use time_travel to identify stable players (not churning)
4. Calculate feature-space similarity for candidates
5. Apply tier-based filtering and expansion thresholds
6. Generate lookalike audience segments
7. Validate with historical acquisition cohort performance

### Validation Strategy
- Compare lookalike ARPU to seed ARPU
- Track Day 7 retention rates
- Monitor genre preference distribution
- Verify spending tier consistency
- A/B test against random audience

## Segment-Specific Matching

### Free-to-Play Monetization Focus
- Emphasis on spending tier matching
- De-weight genre diversity (monetization more important)
- Look for increasing spending trajectory in seed
- Expected ROAS: 1.5-2.5x vs baseline

### Premium Game Focus
- Emphasis on genre and platform matching
- Spending secondary to engagement
- Look for high event participation
- Expected lift: 2-3x conversion rate

### Esports-Focused Matching
- Emphasis on competitive indicators
- Rank/skill level matching critical
- Social/team behavior weighting
- Expected expansion: 5-10x (tight market)

## Performance Expectations

- Lookalike audience size: 10-200x seed (depending on seed selection)
- LTV per lookalike player: 65-90% of seed LTV
- Conversion lift: 20-50% vs non-targeted audience
- Day 7 retention match: 80-95% of seed D7R
- 30-day retention match: 70-90% of seed D30R
- False positive rate: 10-20% (players not actually similar)

## Monitoring & Optimization

### Key Metrics to Track
- Actual LTCV vs predicted LTCV
- Tier adoption consistency
- Genre preference stability
- Spending pattern changes
- Session engagement trends

### Refinement Triggers
- LTCV variance >20% from expectation
- Spending tier shift (Dolphin → Whale)
- Engagement cliff detection
- New content update impact
- Seasonal spending pattern changes

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for available player dimensions
- Identify calculated_attribute for pre-computed metrics (LTCV, engagement score)
- Verify genre taxonomy consistency

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish spending and session distributions
- Identify outliers and spending tiers

### time_travel Usage
- Track player engagement changes over 60-90 days
- Identify stable vs churning players
- Validate spending pattern consistency
- Monitor genre preference changes

### query_builder Usage
- Cost estimation for lookalike matching queries
- Optimize similarity calculation efficiency
- Model data processing costs for scale

## Implementation Checklist

- [ ] Define 2-4 seed player profiles
- [ ] Map genre taxonomy and platform options
- [ ] Document similarity dimensions and weights
- [ ] Establish spending tier definitions
- [ ] Create feature space vectors
- [ ] Build similarity scoring algorithm
- [ ] Test on historical players (backtesting)
- [ ] Validate lookalike vs seed cohort metrics
- [ ] Set up performance tracking
- [ ] Plan A/B testing framework
- [ ] Document expansion ratio assumptions
- [ ] Schedule quarterly model updates
