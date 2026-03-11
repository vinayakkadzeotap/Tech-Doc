# Healthcare Marketing KPI Glossary

Essential performance metrics for healthcare, pharmaceutical, wellness, and health insurance marketing campaigns in the Zeotap CDP. All metrics should align with clinical outcomes and patient safety.

## Patient Acquisition & Engagement Metrics

### Patient Acquisition Cost (PAC)
**Definition**: Total marketing spend divided by number of new patients acquired.
- **Formula**: Total Marketing Spend / New Patients Acquired
- **Benchmark**: $50-200 PAC depending on specialty and channel
- **Use Case**: Evaluate marketing efficiency and channel effectiveness
- **CDP Insight**: Track PAC by acquisition channel, specialty, and patient complexity

### Appointment Show Rate
**Definition**: Percentage of scheduled appointments where patients actually attend.
- **Formula**: (Attended Appointments / Scheduled Appointments) × 100
- **Benchmark**: 80-90% show rate is healthy, <75% indicates friction
- **Use Case**: Measure scheduling effectiveness and access barriers
- **CDP Insight**: Use **cdp-data-analyzer** to identify patterns by time, provider, and patient segment

### Appointment No-Show Rate
**Definition**: Percentage of scheduled appointments where patients fail to appear.
- **Formula**: (No-Show Appointments / Scheduled Appointments) × 100
- **Benchmark**: 10-20% no-show rate is typical, varies by specialty and population
- **Use Case**: Identify scheduling, access, or engagement barriers
- **CDP Insight**: Use **cdp-churn-finder** to predict high-risk no-show patients for proactive outreach

### First Appointment Completion Rate
**Definition**: Percentage of patients who complete first appointment after initial scheduling.
- **Formula**: (First Appointments Completed / First Appointments Scheduled) × 100
- **Benchmark**: 70-85% indicates healthy new patient experience
- **Use Case**: Measure onboarding friction and new patient retention
- **CDP Insight**: Use **cdp-journey-recommender** to optimize pre-appointment support sequences

### Patient Retention Rate
**Definition**: Percentage of patients who return for follow-up care within recommended timeframe.
- **Formula**: (Returning Patients / Total Patients) × 100
- **Benchmark**: 65-80% patient retention is healthy
- **Use Case**: Measure practice loyalty and continuity of care
- **CDP Insight**: Correlate with patient satisfaction and health outcomes

## Enrollment & Plan Metrics

### Enrollment Completion Rate
**Definition**: Percentage of health plan enrollment applications completed and submitted.
- **Formula**: (Completed Enrollments / Started Enrollments) × 100
- **Benchmark**: 60-75% completion is typical
- **Use Case**: Identify enrollment friction and funnel optimization opportunities
- **CDP Insight**: Use **cdp-data-analyzer** to identify drop-off points and simplify workflows

### Plan Selection Conversion
**Definition**: Percentage of plan comparisons that result in plan selection and enrollment.
- **Formula**: (Plan Selections / Plan Comparisons) × 100
- **Benchmark**: 15-30% conversion from comparison to enrollment
- **Use Case**: Measure plan education effectiveness and decision support
- **CDP Insight**: Use **cdp-journey-recommender** to optimize plan recommendation logic

### Plan Retention Rate
**Definition**: Percentage of plan members who renew coverage for next plan year.
- **Formula**: (Renewed Members / Eligible Members) × 100
- **Benchmark**: 85-95% plan year-to-year renewal indicates plan satisfaction
- **Use Case**: Measure plan satisfaction and member engagement
- **CDP Insight**: Use **cdp-churn-finder** to identify at-risk members for retention outreach

### Network Switching Rate
**Definition**: Percentage of members who switch providers within plan network year-to-year.
- **Formula**: (Members Switching Providers / Total Members) × 100
- **Benchmark**: 10-25% switching rate is typical, varies by provider satisfaction
- **Use Case**: Measure provider satisfaction and quality perception
- **CDP Insight**: Correlate with provider satisfaction scores and quality metrics

## Clinical Engagement & Compliance Metrics

### Medication Adherence Rate
**Definition**: Percentage of prescribed medication doses actually taken by patients.
- **Formula**: (Doses Taken / Doses Prescribed) × 100
- **Benchmark**: 80%+ adherence is associated with good health outcomes
- **Use Case**: Primary indicator of treatment effectiveness and health outcomes
- **CDP Insight**: Use **cdp-churn-finder** to predict non-adherence and trigger support interventions

### Medication Refill Rate
**Definition**: Percentage of medication refills requested on schedule without gap in therapy.
- **Formula**: (Refills Requested on Schedule / Total Refills Needed) × 100
- **Benchmark**: 70-80% on-schedule refills indicates good adherence
- **Use Case**: Early warning indicator for non-adherence and disengagement
- **CDP Insight**: Use **cdp-journey-recommender** to send refill reminders at optimal timing

### Preventive Care Completion
**Definition**: Percentage of patients completing recommended preventive care (screenings, immunizations).
- **Examples**: Breast cancer screening, colorectal cancer screening, annual flu vaccination
- **Benchmark**: 40-60% preventive care completion in most populations
- **Use Case**: Measure prevention engagement and population health
- **CDP Insight**: Use **cdp-audience-finder** to identify eligible patients and **cdp-journey-recommender** for outreach

### Care Plan Adherence Rate
**Definition**: Percentage of patients following recommended treatment plan and lifestyle modifications.
- **Formula**: (Compliant Patients / Total Patients) × 100
- **Benchmark**: 60-75% care plan adherence typical
- **Use Case**: Measure treatment effectiveness and health outcomes probability
- **CDP Insight**: Use **cdp-data-scientist** to model adherence propensity by patient type

### Telehealth Utilization Rate
**Definition**: Percentage of visits conducted via telehealth vs. in-person.
- **Formula**: (Telehealth Visits / Total Visits) × 100
- **Benchmark**: 15-25% telehealth adoption is typical post-pandemic
- **Use Case**: Measure digital adoption and access expansion
- **CDP Insight**: Track utilization by specialty, geography, and patient age group

## Health Outcome Metrics

### Readmission Rate
**Definition**: Percentage of patients readmitted to hospital within 30 days of discharge.
- **Formula**: (30-Day Readmissions / Total Discharges) × 100
- **Benchmark**: 10-15% is typical, <10% is high-quality care
- **Use Case**: Critical quality and cost metric tied to reimbursement
- **CDP Insight**: Use **cdp-churn-finder** to identify high-risk post-discharge patients

### Emergency Department Utilization
**Definition**: Number of ED visits per 1,000 plan members annually.
- **Benchmark**: 400-600 ED visits per 1,000 members typical
- **Use Case**: Measure preventive care effectiveness and access barriers
- **CDP Insight**: Correlate ED visits with lack of preventive care and primary care access

### Hospital Length of Stay
**Definition**: Average number of days patients remain hospitalized per admission.
- **Benchmark**: 3-5 days average depending on condition
- **Use Case**: Measure care efficiency and clinical protocols
- **CDP Insight**: Identify outliers for intervention and best practice protocols

### Disease-Specific Outcome Metrics
**Examples**: HbA1c control in diabetes, blood pressure control in hypertension, pain scores post-surgery
- **Use Case**: Measure clinical effectiveness of treatment protocols
- **CDP Insight**: Use **cdp-data-scientist** to model outcome predictors and intervention opportunities

### Patient Satisfaction (HCAHPS)
**Definition**: Hospital Consumer Assessment of Healthcare Providers and Systems score.
- **Scale**: 0-100 composite score measuring patient experience
- **Benchmark**: 75-85 composite score indicates strong patient satisfaction
- **Use Case**: Measure patient experience and quality of care
- **CDP Insight**: Correlate satisfaction with health outcomes and readmission risk

## Financial & Utilization Metrics

### Patient Lifetime Value (PLV)
**Definition**: Total net revenue expected from a patient relationship over lifetime.
- **Formula**: (Annual Revenue × Gross Margin × Relationship Duration) - Acquisition Cost
- **Benchmark**: 3-5x annual visit revenue for healthy practices
- **Use Case**: Determine optimal retention and acquisition investment
- **CDP Insight**: Use **cdp-data-scientist** to build predictive PLV models by condition and age

### Cost Per Quality-Adjusted Life Year (QALY)
**Definition**: Treatment cost per year of healthy life gained.
- **Formula**: Treatment Cost / Quality-Adjusted Life Years Gained
- **Benchmark**: Varies by condition and treatment type
- **Use Case**: Economic evaluation of treatment effectiveness and value
- **CDP Insight**: Use in value-based care assessments and treatment protocol optimization

### Total Cost of Care (TCOC)
**Definition**: All medical and pharmacy costs attributable to a patient annually.
- **Components**: Outpatient visits, inpatient, ED, pharmacy, procedures
- **Benchmark**: Varies by age and condition complexity
- **Use Case**: Identify high-cost patients and intervention opportunities
- **CDP Insight**: Use **cdp-churn-finder** to identify high-risk, high-cost patients for care management

### Chronic Disease Management ROI
**Definition**: Return on investment for chronic disease management programs.
- **Formula**: (Savings from Reduced Utilization - Program Costs) / Program Costs
- **Benchmark**: 2:1 to 5:1 ROI typical for successful programs
- **Use Case**: Justify investment in disease management programs
- **CDP Insight**: Track program effectiveness and participant engagement correlations

### Wellness Program Participation ROI
**Definition**: Health improvement and cost savings per dollar invested in wellness programs.
- **Formula**: (Productivity Gains + Medical Savings - Program Costs) / Program Costs
- **Benchmark**: 1.5:1 to 3:1 ROI typical
- **Use Case**: Justify wellness program investment and identify effective programs
- **CDP Insight**: Segment results by program type and participant demographics

---

**CDP Integration Tips**:
- Build patient segments using **cdp-audience-finder** based on risk score, condition type, and engagement level
- Develop predictive models with **cdp-data-scientist** for readmission risk, medication non-adherence, and preventive care eligibility
- Monitor data quality and HIPAA compliance with **cdp-health-diagnostics**
- Use **cdp-data-enricher** to layer clinical data, pharmacy data, and claims data with consent guardrails
- Power patient engagement sequences with **cdp-journey-recommender** using clinically appropriate triggers
- Implement robust consent and preference management for all marketing and engagement communications
