---
name: retail-marketing-suite
description: Entry point for retail, e-commerce, DTC, and CPG marketing campaigns. Orchestrates customer lifecycle strategies including acquisition, retention, upsell, and seasonal promotions. Handles product-based audience segmentation, shopping behavior analytics, and performance optimization across channels. Routes users to core CDP skills (audience-finder, churn-finder, lookalike-finder, data-enricher, data-analyzer) with retail-specific context and KPI frameworks for AOV, CLTV, repeat rates, and basket metrics.
---

# Retail Marketing Suite

The Retail Marketing Suite is your orchestrator for e-commerce, DTC (Direct-to-Consumer), and CPG (Consumer Packaged Goods) marketing within Zeotap CDP. Whether you're launching a Valentine's Day campaign, optimizing Black Friday strategy, or building loyalty segments, this skill routes you to the right CDP capabilities with retail-specific guidance.

## When to Use This Skill

**Trigger Keywords:** products, shopping, basket, cart, store, SKU, AOV, CLTV, repeat purchase, seasonal campaigns, loyalty programs, inventory, sell-through, DTC, e-commerce, CPG, brand, retail.

**Common Scenarios:**
- Building a back-to-school audience segment
- Analyzing holiday campaign performance
- Creating a VIP loyalty segment
- Preventing cart abandonment churn
- Finding lookalike audiences for top customers
- Enriching customer data with purchase behavior

## Retail Campaign Playbook

### 1. Acquisition Phase
**Objective:** Acquire new customers
- **Seasonal triggers:** Major sales events (Black Friday, Christmas), holidays, new collection launches
- **Audience strategy:** Lookalike audiences from best customers, warm prospects who visited but didn't convert
- **Key metric:** CAC (Customer Acquisition Cost), conversion rate
- **Route to:** `cdp-lookalike-finder` (find similar profiles to your top buyers)

### 2. Retention & Engagement Phase
**Objective:** Keep customers buying and increase frequency
- **Seasonal triggers:** Post-purchase nurture, seasonal reminders, flash sales
- **Audience strategy:** Recent purchasers, frequent buyers, cart abandoners
- **Key metrics:** Repeat purchase rate, NPS, engagement frequency
- **Route to:** `cdp-audience-finder` (segment repeat customers), `cdp-data-enricher` (add purchase history)

### 3. Upsell & Cross-sell Phase
**Objective:** Increase transaction value and product diversity
- **Audience strategy:** Segment by product affinity, purchase recency, AOV, complementary products
- **Key metric:** AOV, basket size, cross-sell rate
- **Route to:** `cdp-audience-finder` (high-value product categories), `cdp-data-analyzer` (product affinity analysis)

### 4. Reactivation Phase
**Objective:** Win back lapsed customers
- **Seasonal triggers:** End-of-season sales, customer win-back campaigns
- **Audience strategy:** Customers with 3-6 month purchase gap, seasonal dormancy
- **Key metric:** Reactivation rate, revenue from returning customers
- **Route to:** `cdp-churn-finder` (identify at-risk & lapsed segments)

### 5. Seasonal & Tactical Phase
**Objective:** Capitalize on holidays and peak periods
- **Campaigns:** Valentine's Day, Easter, Back-to-School, Halloween, Black Friday, Christmas
- **Audience strategy:** Historical seasonal buyers, gift-givers, seasonal shoppers
- **Key metric:** Seasonal ROAS (Return on Ad Spend), seasonal revenue
- **Route to:** `cdp-audience-finder` (seasonal shoppers), `cdp-journey-recommender` (gift guides)

## Skill Routing Guide

### Scenario Examples

**"Build a Valentine's Day gift audience"**
→ Use **cdp-audience-finder** with `seasonal-calendar.md` (Valentine's audience type) and `kpi-glossary.md` (AOV tracking). Create segments: gift givers (female, partners), self-purchasers, romantic occasion buyers.

**"Prevent holiday churn - who's at risk?"**
→ Use **cdp-churn-finder** to identify customers showing purchase pattern decline leading into Q4. Focus on repeat rate decline and basket size erosion.

**"Find customers like our top spenders"**
→ Use **cdp-lookalike-finder** with top AOV segment. Define lookalikes by product category, price affinity, purchase frequency.

**"Analyze why conversion dropped 15% this month"**
→ Use **cdp-data-analyzer** to compare this month's audience composition vs. last month. Segment by device, traffic source, seasonal factor, inventory availability.

**"Enrich customer data with SKU-level purchase history"**
→ Use **cdp-data-enricher** to add product category, price tier, repeat category purchaser flag, seasonality index for personalization.

**"Understand customer journey from browsing to purchase"**
→ Use **cdp-journey-recommender** to map touchpoint sequences. Identify drop-off points, optimal channel mix, cross-sell opportunities in the journey.

**"Create gift-giver vs. personal-purchaser segments"**
→ Use **cdp-audience-finder** to identify behavioral signals: price range, product category diversity, gift wrap/messaging usage, seasonal timing.

## Key Retail KPIs

Load **kpi-glossary.md** for complete definitions, formulas, and benchmarks:

| KPI | Definition | Business Impact |
|-----|-----------|-----------------|
| **AOV** | Average Order Value | Revenue efficiency per transaction |
| **CLTV** | Customer Lifetime Value | Long-term profitability per customer |
| **CAC** | Customer Acquisition Cost | Return on acquisition spending |
| **Repeat Rate** | % of customers who buy again | Customer loyalty & retention |
| **Basket Size** | Items per order | Cross-sell effectiveness |
| **Conversion Rate** | % who purchase / total visitors | Funnel efficiency |
| **Cart Abandonment** | % of carts not completed | Revenue leakage |
| **NPS** | Net Promoter Score | Customer satisfaction & advocacy |
| **Return Rate** | % of orders returned | Product quality & fit |
| **Sell-Through** | % of inventory sold | Inventory effectiveness |

## Reference Files

- **seasonal-calendar.md** - Retail event calendar, audience types, campaign strategies, key metrics per season
- **kpi-glossary.md** - Detailed KPI definitions, formulas, industry benchmarks, calculation examples

## Common Use Case Matrix

| Use Case | Primary Skill | Secondary Skill | Reference |
|----------|---------------|-----------------|-----------|
| Holiday campaign audience | cdp-audience-finder | cdp-data-enricher | seasonal-calendar.md |
| Prevent churn | cdp-churn-finder | cdp-data-analyzer | kpi-glossary.md |
| Find VIP customers | cdp-audience-finder | cdp-data-analyzer | kpi-glossary.md (CLTV) |
| Scale top customer segment | cdp-lookalike-finder | cdp-audience-finder | kpi-glossary.md (AOV) |
| Personalize by product affinity | cdp-data-enricher | cdp-journey-recommender | seasonal-calendar.md |
| Optimize email send time | cdp-data-analyzer | cdp-journey-recommender | kpi-glossary.md |
| Seasonal inventory planning | cdp-data-analyzer | cdp-audience-finder | seasonal-calendar.md |
| Attribution & channel mix | cdp-data-scientist | cdp-journey-recommender | kpi-glossary.md |

## Next Steps

1. **Identify your campaign type** - Is it seasonal, acquisition, retention, or reactivation?
2. **Load the appropriate reference** - Use seasonal-calendar.md for timing, kpi-glossary.md for metrics
3. **Select your skill** - Route to the orchestrator suggested above
4. **Define your audience** - Use CDP skills to segment, analyze, and activate
5. **Measure & iterate** - Track the KPIs relevant to your campaign phase

---

**Questions?** Check the reference files or escalate to a Data Scientist for complex multi-channel attribution or machine learning models.
