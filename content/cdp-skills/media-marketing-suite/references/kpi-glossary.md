# Media & Entertainment KPI Glossary

Essential performance metrics for streaming, OTT, publishing, and entertainment marketing campaigns in the Zeotap CDP.

## Subscriber Metrics

### ARPU (Average Revenue Per User)
**Definition**: Total revenue divided by average number of subscribers in a period.
- **Formula**: Total Revenue / Average Number of Subscribers
- **Benchmark**: $10-20/month for US streaming, varies by market and plan mix
- **Use Case**: Track monetization efficiency and pricing strategy impact
- **CDP Insight**: Use **cdp-data-enricher** to track ARPU by subscriber segment, plan tier, and acquisition channel

### Subscriber Growth
**Definition**: Month-over-month or year-over-year change in total subscriber count.
- **Formula**: (Current Period Subscribers - Previous Period Subscribers) / Previous Period × 100
- **Benchmark**: 5-15% quarterly growth for mature platforms, 20%+ for growth-stage
- **Use Case**: Primary business health metric, investor communication
- **CDP Insight**: Correlate growth by cohort, acquisition channel, and content release cadence

### Trial-to-Paid Conversion
**Definition**: Percentage of trial signups that convert to paid subscription.
- **Formula**: (Paid Conversions / Trial Signups) × 100
- **Benchmark**: 20-40% for most platforms (varies by trial length and conversion funnel)
- **Use Case**: Measure free trial effectiveness and pricing strategy impact
- **CDP Insight**: Use **cdp-data-analyzer** to identify conversion friction points and **cdp-journey-recommender** to optimize sequences

### Subscriber Churn Rate
**Definition**: Percentage of customers who cancel subscription in a given period.
- **Formula**: (Cancelled Subscriptions / Beginning Subscribers) × 100
- **Benchmark**: 2-5% monthly churn for subscription platforms
- **Use Case**: Primary retention metric, directly impacts lifetime value
- **CDP Insight**: Use **cdp-churn-finder** to predict churn and identify at-risk cohorts

### Net Subscriber Addition
**Definition**: New subscribers acquired minus subscribers lost (churn) in a period.
- **Formula**: New Subscribers - Churned Subscribers
- **Benchmark**: Positive net additions indicate healthy growth
- **Use Case**: Measure net business health and growth trajectory
- **CDP Insight**: Analyze net additions by acquisition channel and cohort to optimize spend

## Engagement Metrics

### DAU/MAU (Daily/Monthly Active Users)
**Definition**: Number of unique users engaging with content on daily/monthly basis.
- **DAU Benchmark**: 40-60% of total subscribers
- **MAU Benchmark**: 70-85% of total subscribers
- **Use Case**: Measure content engagement and platform stickiness
- **CDP Insight**: Track cohort DAU/MAU to identify engagement decline early

### Engagement Rate
**Definition**: Percentage of registered subscribers who actively engage with content in a period.
- **Formula**: (Active Users / Total Subscribers) × 100
- **Benchmark**: 60-75% monthly engagement is healthy
- **Use Case**: Overall platform health and content relevance assessment
- **CDP Insight**: Build engagement tiers (high/medium/low) with **cdp-audience-finder** for targeted interventions

### Session Frequency
**Definition**: Average number of times a subscriber logs in per week/month.
- **Benchmark**: 3-4 sessions/week for healthy engagement
- **Use Case**: Measure habit formation and content stickiness
- **CDP Insight**: Segment by session frequency to identify at-risk (declining sessions) subscribers

### Average Watch Time
**Definition**: Average minutes/hours of content consumed per subscriber per period.
- **Benchmark**: 2-4 hours/week for casual platforms, 8-12 hours/week for heavy-use platforms
- **Use Case**: Measure content consumption depth and satisfaction
- **CDP Insight**: Use **cdp-data-analyzer** to correlate watch time with churn and lifetime value

### Content Completion Rate
**Definition**: Percentage of content started that is watched to completion.
- **Formula**: (Completed Views / Total Views Started) × 100
- **Benchmark**: 50-70% for 30-minute shows, 40-60% for 60-minute shows, 60-80% for movies
- **Use Case**: Measure content quality, pacing, and subscriber satisfaction
- **CDP Insight**: Track completion by content type, genre, and audience segment to improve recommendations

### Time to Next Engagement
**Definition**: Average days between viewing sessions.
- **Benchmark**: 1-2 days for engaged users, 7+ days indicates at-risk
- **Use Case**: Early warning indicator for churn risk
- **CDP Insight**: Use **cdp-churn-finder** to flag users with increasing time between sessions

## Monetization Metrics

### Subscriber Lifetime Value (LTV)
**Definition**: Total net profit expected from a subscriber over their lifetime.
- **Formula**: (Average Monthly Revenue × Gross Margin × Average Subscription Duration) - Acquisition Cost
- **Benchmark**: 15-30x monthly ARPU for healthy platforms
- **Use Case**: Determine optimal customer acquisition spend and retention investment
- **CDP Insight**: Use **cdp-data-scientist** to build predictive LTV models by cohort and channel

### Customer Acquisition Cost (CAC)
**Definition**: Total marketing spend divided by number of new subscribers acquired.
- **Formula**: Total Marketing Spend / New Subscribers Acquired
- **Benchmark**: CAC should be <20-30% of first year LTV
- **Use Case**: Evaluate marketing efficiency and channel ROI
- **CDP Insight**: Track CAC by channel, campaign, and geographic market to optimize spend

### Payback Period
**Definition**: Months required for cumulative subscriber revenue to exceed acquisition cost.
- **Formula**: CAC / Monthly ARPU (simplified)
- **Benchmark**: 3-6 months for healthy platforms
- **Use Case**: Assess marketing investment sustainability and ROI timeline
- **CDP Insight**: Calculate payback period by acquisition channel to identify most efficient sources

### Ad CPM (Cost Per Mille)
**Definition**: Revenue earned per 1,000 ad impressions (for ad-supported tiers).
- **Formula**: (Total Ad Revenue / Total Impressions) × 1,000
- **Benchmark**: $5-20 CPM depending on content, audience, and market
- **Use Case**: Measure advertising monetization efficiency
- **CDP Insight**: Use **cdp-data-enricher** to layer in audience quality metrics to improve CPM rates

## Content Performance Metrics

### Content Cost Per Subscriber
**Definition**: Total content acquisition/production cost divided by subscriber base.
- **Formula**: Total Content Spend / Total Subscribers
- **Benchmark**: $5-15 per subscriber per year
- **Use Case**: Measure content spending efficiency relative to subscriber base
- **CDP Insight**: Correlate content spend with engagement and churn metrics

### Release Velocity
**Definition**: Number of new titles or episodes released per week/month.
- **Benchmark**: Varies by platform and strategy (2-5 titles per week typical)
- **Use Case**: Measure content production and release cadence
- **CDP Insight**: Analyze correlation between release velocity and churn to find optimal cadence

### Reach (First Week)
**Definition**: Percentage of subscriber base that engages with new content in first week of release.
- **Benchmark**: 10-20% reach for typical releases, 30%+ for major releases
- **Use Case**: Measure marketing effectiveness and content appeal
- **CDP Insight**: Use **cdp-audience-finder** to identify subscribers who didn't reach new content for targeting

### Engagement by Genre
**Definition**: Average engagement metrics (watch time, completion rate) by content category.
- **Benchmark**: Varies widely by genre and platform strategy
- **Use Case**: Inform content strategy and production investment decisions
- **CDP Insight**: Use **cdp-data-analyzer** to identify underperforming genres and optimize portfolio

## Satisfaction & Loyalty Metrics

### Net Promoter Score (NPS)
**Definition**: Percentage of promoters minus percentage of detractors on "likelihood to recommend" scale.
- **Formula**: (% Promoters - % Detractors) × 100
- **Benchmark**: 30-50 for streaming industry, 60+ indicates market leadership
- **Use Case**: Measure customer satisfaction and brand loyalty
- **CDP Insight**: Correlate NPS by content preference, plan type, and account age

### Customer Satisfaction (CSAT)
**Definition**: Percentage of subscribers satisfied or very satisfied with platform experience.
- **Scale**: Usually 1-5 or 1-10
- **Benchmark**: 75-85% satisfied/very satisfied
- **Use Case**: Track service quality, content library, and UX satisfaction
- **CDP Insight**: Identify dissatisfaction drivers by subscriber segment for targeted improvements

### Referral Rate
**Definition**: Percentage of subscribers who refer others, or number of referrals per subscriber.
- **Benchmark**: 2-5% of subscribers generate referrals (varies by program structure)
- **Use Case**: Measure viral growth and word-of-mouth effectiveness
- **CDP Insight**: Use **cdp-lookalike-finder** to identify high-referral subscribers and model lookalikes

---

**CDP Integration Tips**:
- Build subscriber segmentation using **cdp-audience-finder** based on engagement levels and churn risk
- Develop predictive models with **cdp-data-scientist** for churn propensity and ARPU forecasting
- Monitor KPI health and data quality with **cdp-health-diagnostics**
- Use **cdp-data-enricher** to layer platform data with third-party audience attributes
- Power content recommendations with **cdp-journey-recommender** based on viewing patterns
