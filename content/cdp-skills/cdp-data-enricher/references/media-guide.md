# Media & Entertainment Data Enricher Guide

## Overview
Enrichment playbook for media and streaming platforms, emphasizing content consumption patterns and engagement scoring.

## Core Enrichment Attributes

### 1. Content Affinity Matrix

**Definition:** Multi-dimensional content preference map across genres, formats, and creators
**Dimensions:** Genre, format, creator, language, content maturity, release timing

**Metrics to Calculate:**
- Genre consumption (% of viewing by genre)
- Format preference (series vs movies vs specials)
- Creator affinity (favorite actors, directors, writers)
- Language preference (native language vs dubbed vs subtitled)
- Content maturity preference (rating level watched)
- Brand/franchise loyalty (repeat viewing within franchises)
- Release format (theatrical releases vs streaming originals)

**Affinity Matrix Construction:**
- Primary genre: >50% of viewing time
- Secondary genres: 10-50% of viewing time
- Tertiary interests: 2-10% of viewing time
- Niche interests: <2% (experimental watching)

**Genre Categories:**
- Drama, comedy, thriller, action, horror, sci-fi, fantasy, documentary, sports, reality, animation, talk shows, news, educational

**Affinity Scoring (1-5 per dimension):**
- 5 (High affinity): Frequently watches, completes content
- 4 (Good affinity): Regular viewing, positive engagement
- 3 (Moderate affinity): Occasional viewing, mixed engagement
- 2 (Low affinity): Rare viewing, low completion
- 1 (No affinity): Never/minimal viewing

**Creator Patterns:**
- Identify favorite actors (roles they watch)
- Preferred directors/showrunners
- Production company preferences
- Creator discovery propensity (new creators vs familiar)

**Data Sources:**
- View history with content classification
- Browse/search behavior (indicates interest)
- Completion rate by content type
- Ratings and reviews (preference indicators)
- use `feature_analysis` to calculate affinity percentiles

**Enrichment Output:**
- Primary genre (+ %)
- Secondary genres (list with %)
- Creator preferences (top 5 actors/directors)
- Language preference (primary + alternates)
- Content maturity level (watches PG vs R vs TV-MA)
- Franchise loyalty score (1-5)

### 2. Engagement Depth Score

**Definition:** Intensity and commitment of content consumption
**Dimensions:** Completion rate, session duration, frequency, social engagement

**Metrics to Calculate:**
- Content completion rate (% of series watched, % of episodes completed)
- Session length (minutes watched per session)
- Viewing frequency (sessions per week)
- Watch time (total hours per week)
- Episode binge behavior (episodes watched per session)
- Rewatching propensity (repeats content)
- Pause behavior (pauses per session, indicates active watching)
- Rating submission (rates content, indicates investment)

**Engagement Depth Tiers (1-5):**
- 1 (Casual): <2 hours/week, low completion rate
- 2 (Light): 2-5 hours/week, moderate completion
- 3 (Regular): 5-10 hours/week, good completion
- 4 (Heavy): 10-15 hours/week, high completion
- 5 (Super-user): 15+ hours/week, completes everything

**Engagement Quality Indicators:**
- Active viewing (pauses, ratings indicate attention)
- Passive viewing (background content)
- Social engagement (shares, comments, recommendations)
- Investment level (watches series completion vs drops)

**Time-Based Patterns:**
- Peak viewing hours (when watches content)
- Device preferences (mobile vs TV vs desktop)
- Session timing (evening vs weekend binges)

**Data Sources:**
- View duration and completion tracking
- Session logs with timestamps
- Rating/review submission logs
- Social sharing tracking
- use `time_travel` to identify engagement velocity trends

**Enrichment Output:**
- Engagement depth score (1-5)
- Average weekly watch hours
- Content completion rate (%)
- Binge propensity (hours per session)
- Engagement trend (increasing/stable/declining)
- Device preference (primary viewing device)

### 3. Binge Propensity Score

**Definition:** Likelihood to rapidly consume content (binge-watch behavior)
**Binge Definition:** Multiple episodes/content items in short timeframe

**Metrics to Calculate:**
- Binge frequency (binges per month)
- Average binge session length (hours)
- Episodes per binge session (count)
- Binge series completion rate (% of series completed via binge)
- Binge-triggering content (genres/shows that trigger binge)
- Time between episodes (short interval = binge behavior)
- Weekend vs weekday binge patterns

**Binge Segments:**
- Non-binger: Watches 1 episode per session, slow consumption
- Light binger: 2-3 episodes per session, moderate consumption
- Regular binger: 4-6 episodes per session, weekly binge sessions
- Heavy binger: 6+ episodes per session, multiple weekly binges
- Super-binger: Completes entire seasons in single sittings

**Binge Propensity Score (1-5):**
- 5 (High): Regular multi-episode sessions, completes series quickly
- 4 (Moderate-high): Frequent binges, completes series relatively quickly
- 3 (Moderate): Occasional binges, mixed consumption pattern
- 2 (Low): Rare binges, prefers measured pace
- 1 (Very low): Never binges, watches single episodes

**Binge Triggers:**
- Identify content types that trigger binges
- Optimal release strategy (full drop vs weekly)
- Marketing messages aligned to binge behavior

**Data Sources:**
- View history with timestamps (episodes watched per session)
- Session duration tracking
- Content type correlation with binge behavior
- use `time_travel` to analyze temporal viewing patterns

**Enrichment Output:**
- Binge propensity score (1-5)
- Average binge session length (hours)
- Binge frequency (sessions per month)
- Binge trigger genres/shows (list)
- Series completion velocity (days to complete)
- Release strategy recommendation (full drop vs weekly)

### 4. Multi-Platform Usage

**Definition:** Cross-platform consumption pattern and device diversity
**Platforms:** Mobile, tablet, desktop, TV, wearables

**Metrics to Calculate:**
- Device distribution (% of viewing per device)
- Primary device (highest % of viewing)
- Secondary devices (backup viewing options)
- Multi-device usage (watches on 2+ devices)
- Device switching (frequency of switching between devices)
- Location-based patterns (home vs mobile viewing)
- Synchronization behavior (resumes across devices)

**Platform Segments:**
- Mobile-primary: Watches mostly on phone
- TV-primary: Watches mostly on TV
- Desktop-primary: Watches mostly on computer
- Tablet-primary: Watches mostly on tablet
- Omnichannel: Uses multiple devices equally
- Device-switcher: Changes devices frequently
- Single-device: Uses only one device

**Omnichannel Maturity:**
- Single device: Only 1 device type used
- Multi-device: Uses 2+ device types
- Synchronized: Uses multiple devices and syncs progress
- Fully integrated: Seamless experience across all devices

**Content-Device Alignment:**
- Mobile (phones): Short-form, episodic content preferred
- Tablet: Movies, series with moderate viewing
- Desktop: Video, educational, reference content
- TV: Movies, series, premium content
- Wearables: Audio, podcasts, notifications

**Data Sources:**
- Device type tracking in view events
- Playback resume tracking
- Session device logs
- Location information (if available)
- use `schema_discovery` to identify device data fields

**Enrichment Output:**
- Primary device (name + % of viewing)
- Secondary devices (if applicable)
- Omnichannel adoption level (single/multi/synchronized)
- Device switching frequency (times per week)
- Cross-device resume behavior (yes/no/frequency)
- Recommended mobile app features (based on usage)

### 5. Social Amplification Potential

**Definition:** Likelihood to share content and influence peer viewing
**Sharing Dimensions:** Social shares, word-of-mouth, community engagement, content creator interest

**Metrics to Calculate:**
- Social share frequency (shares per month)
- Share platform preferences (Twitter, Facebook, WhatsApp, etc.)
- Shared content types (what they share most)
- Social network size (followers, friends, community)
- Community engagement (comments, forum posts, discussions)
- UGC creation (reviews, fan art, clips)
- Referral generation (generates new subscribers)

**Amplification Segments:**
- Non-sharers: Rarely or never shares
- Light sharers: Occasional shares, small network
- Regular sharers: Frequent shares, moderate network
- Influencers: Regular shares, large network
- Super-spreaders: Very frequent shares, significant influence
- Content creators: Creates own content, significant community

**Share Behavior Patterns:**
- Content-type sharing (only shares certain genres)
- Emotional-driven (shares when moved/entertained)
- Social proof (shares popular content)
- Timing of shares (immediate vs delayed)

**K-Factor Potential (Viral Coefficient):**
- Calculate potential for organic growth through referrals
- Identify high-k-factor user segments
- Optimize content virality by segment

**Data Sources:**
- Social share event logs
- Sharing platform tracking
- Social network metrics (if integrated)
- Community participation logs
- UGC submission tracking
- use `get_detailed_events` to track sharing behavior

**Enrichment Output:**
- Amplification potential tier (low/medium/high)
- Monthly share frequency (count)
- Preferred sharing platforms (list)
- Social network size (followers/friends)
- K-factor estimate (referral potential)
- Content creator interest (yes/no flag)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 90% for viewing events
- Timeliness: Update daily for engagement scores
- Accuracy: Validate genre classifications
- Consistency: Cross-check device and platform data

**MCP Tools Integration:**
- Use `schema_discovery` to map content and viewing event structure
- Use `feature_analysis` to calculate engagement and affinity scores
- Use `time_travel` to identify binge patterns and engagement trends
- Use `get_available_event_types` to discover content-related events

**Enrichment Frequency:**
- Content affinity: Weekly (after viewing patterns change)
- Engagement depth: Daily (with each viewing session)
- Binge propensity: Weekly
- Multi-platform usage: Daily (with each session)
- Social amplification: Weekly (with share events)

**Output Storage:**
- Store enriched attributes in viewer_360 table
- Create daily snapshots for ML model features
- Maintain 90-day rolling window for trend analysis
- Archive previous versions for historical comparison

## Key Analysis Workflows

**MCP Tool Usage Examples:**

1. **Analyze content preferences:**
   - Use `schema_discovery` to understand content tagging
   - Use `feature_analysis` to identify top genres and creators
   - Use `time_travel` to track preference evolution

2. **Measure engagement velocity:**
   - Use `get_detailed_events` to track viewing session patterns
   - Calculate watch-time trends using `time_travel`
   - Identify binge events by analyzing session duration

3. **Predict binge triggers:**
   - Use `query_builder` to analyze which content drives binges
   - Correlate content type with session duration
   - Identify release strategy impact on engagement

