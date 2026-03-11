# Healthcare Audience Finding Guide

## Overview
Healthcare audience segmentation focuses on patient engagement, appointment compliance, wellness participation, and chronic condition management. Use CDP data to drive preventive care, improve adherence, and manage populations by health risk.

## Key Attributes to Discover

Use `schema_discovery` to locate:
- Patient appointment history (scheduled, completed, no-show, cancellation)
- Medical claims and diagnosis codes
- Chronic condition flags (diabetes, hypertension, asthma, obesity)
- Prescription fill patterns and medication adherence
- Lab results and health metrics
- Patient engagement (portal logins, messaging, app usage)
- Preventive care participation (screenings, vaccinations, wellness programs)
- Telehealth adoption and utilization
- Insurance plan type and coverage details
- Referral source (doctor, self, family, online)
- Hospital/ER visit history
- Wellness program enrollment and activity
- Age and demographic factors
- Health risk score and acuity level
- Communication preferences and engagement
- Social determinants of health (if available)
- Behavioral health flags (mental health screening results)

```
schema_discovery operation: "store", store_type: "profile_store"
schema_discovery operation: "columns", columns: ["appointment_status", "chronic_conditions", "medication_adherence", "health_risk_score"]
```

## Feature Analysis Recommendations

Analyze these metrics for segmentation:
- **Engagement level**: Appointment compliance rate, portal login frequency
- **Health risk**: Chronic condition count, hospitalization history, claims severity
- **Medication adherence**: Prescription fill rate, refill timeliness
- **Preventive care**: Screening participation, vaccination compliance
- **Telehealth readiness**: Digital engagement score, app adoption
- **Care coordination**: Multi-provider engagement, specialist referrals
- **Cost profile**: Claims amount, utilization intensity

```
feature_analysis columns: ["appointment_compliance_rate", "chronic_condition_count",
  "medication_adherence_score", "preventive_care_participation_rate"],
metric_types: ["basic", "statistical", "quality"]
```

## Common Audience Definitions

### 1. Active Engagement Patients (High Compliance)
**Filter Criteria:**
- Appointment compliance: >90% (kept/completed)
- Portal usage: Monthly login minimum
- Medication adherence: >80% refill compliance
- Communication: Responsive to outreach
- Care coordination: Sees provider regularly (3+ visits/year)
- Health status: Stable chronic conditions (if any)
- Digital adoption: Uses patient portal and/or app
- Risk level: Low to moderate

**Expected Size:** 20-30% of base
**Activation:** Preventive care encouragement, wellness program recommendations, health goal setting, appointment reminders, positive reinforcement

### 2. Disengaged/At-Risk Patients (Low Engagement)
**Filter Criteria:**
- Appointment compliance: <60% (frequent no-shows/cancellations)
- Portal usage: <1 login per month
- Communication: Unresponsive to outreach attempts
- Last visit: 6+ months ago (overdue for care)
- Medication adherence: <50% compliance
- Health risk: Moderate to high (chronic conditions untreated)
- Barriers: Known issues (transportation, language, financial)
- Risk of churn: May switch providers or go without care

**Expected Size:** 15-25% of base
**Activation:** Re-engagement campaigns, barrier removal (transportation, language support), simplified appointment booking, care coordination, community health worker outreach

### 3. Chronic Disease Management Cohorts
**Filter Criteria (Diabetes Example):**
- Diagnosis: Diabetes (Type 1 or Type 2)
- Management level: Regular monitoring (HbA1c checks)
- Medication: On antidiabetic therapy
- Comorbidities: May include hypertension, kidney disease
- Engagement: Endocrinology or primary care visits 3+/year
- Health metrics: Latest HbA1c result available
- Education: May have participated in diabetes education
- Risk level: Varies by control level

**Expected Size:** 8-15% of base (varies by condition)
**Activation:** Condition-specific education, medication adherence support, remote monitoring enrollment, specialist coordination, lifestyle intervention programs

### 4. Preventive Care-Focused Audience
**Filter Criteria:**
- Age-appropriate screenings: Up to date (colonoscopy, mammography, etc.)
- Vaccination status: Current (annual flu, age-appropriate)
- Wellness exam: Annual physical completed
- Health risk score: Low to moderate
- Engagement: Proactive (scheduled appointments in advance)
- Lifestyle: May track health metrics (wellness apps)
- Education: High health literacy
- Interest: Preventive care messaging resonates

**Expected Size:** 25-35% of base
**Activation:** Preventive care reminders, screening availability alerts, vaccination clinics, wellness programs, health education, health coaching

### 5. Telehealth-Ready Patients
**Filter Criteria:**
- Digital literacy: High (app users, online engagement)
- Device access: Smartphone or computer (home visits capable)
- Internet connectivity: Reliable (rural or urban)
- Condition type: Suitable for telehealth (not emergency, no exam-dependent)
- Previous use: Telehealth visit history or strong uptake signal
- Preference: Expressed interest in virtual visits
- Barriers: Low (no privacy, transportation, or connectivity issues)
- Engagement: App-active (health records access, messaging use)

**Expected Size:** 40-50% of base
**Activation:** Telehealth appointment scheduling, virtual visit education, technology support, schedule convenience (off-hours), specialty access

### 6. Medication Non-Adherence Risk
**Filter Criteria:**
- Medication count: 2+ chronic conditions requiring medication
- Refill rate: <70% compliance (missing refills)
- Pattern: Consistent gaps (forgetting, side effects, cost)
- Engagement: Low (doesn't attend medication management visits)
- Cost barriers: High copay or uninsured
- Complexity: Multiple medications (confusion risk)
- Recent visit: Discussed medication adherence
- Risk level: High (disease progression risk)

**Expected Size:** 12-20% of base
**Activation:** Medication adherence programs, pill organizers, reminder systems, cost assistance, simplified regimens, pharmacist consultations

### 7. Mental Health Screening-Positive
**Filter Criteria:**
- Screening results: Positive for depression/anxiety (PHQ-9, GAD-7)
- Mental health engagement: Limited or no mental health visits
- Primary care: Regularly engages with PCP but not mental health
- Risk level: Moderate to high (untreated behavioral health)
- Barriers: Stigma, access, cost (common factors)
- Comorbidities: May have chronic physical health conditions
- Substance use: Assessment completed or history noted
- Crisis risk: Safety assessment completed

**Expected Size:** 15-25% of base
**Activation:** Mental health resource education, integrated care messaging, therapist/psychiatrist matching, peer support groups, crisis hotline information

### 8. Hospital Discharge/Transition of Care
**Filter Criteria:**
- Recent discharge: Within 30 days of hospital/ER visit
- Follow-up status: Needs to schedule post-discharge appointment
- Diagnosis: Acute event or exacerbation of chronic condition
- Engagement: High risk of readmission if not coordinated
- Appointment: Follow-up ordered but not yet scheduled
- Medication: New medications requiring monitoring
- Recovery: Home health or intensive outpatient program candidate
- Social factors: May need discharge follow-up support

**Expected Size:** 5-8% of base (monthly flow)
**Activation:** Discharge appointment reminders, post-discharge education, home health coordination, 30-day follow-up push, medication counseling, care coordination calls

### 9. Wellness Program Enthusiasts (Prevention Leaders)
**Filter Criteria:**
- Wellness program: Enrolled and actively participating
- Health tracking: Uses health apps, wearables, or patient portal
- Engagement: Regular activity log, challenges, or goal updates
- Risk level: Low (preventive-minded)
- Health behaviors: Exercise, nutrition, stress management documented
- Motivation: Intrinsically motivated (not just incentive-driven)
- Social engagement: Participates in group activities or challenges
- Health literacy: High (understands health metrics)

**Expected Size:** 10-15% of base
**Activation:** Advanced programs (coaching, personalization), community challenges, goal-based incentives, health champion opportunities, exclusive wellness content

## Example Audience Queries

### Query 1: High-Engagement Patient Retention
```sql
SELECT patient_id, email, phone, last_appointment_date, appointment_compliance_rate,
       chronic_condition_count, portal_login_frequency_monthly
FROM patient_profiles
WHERE appointment_compliance_rate > 0.90
AND portal_login_frequency_monthly >= 1
AND medication_adherence_score > 0.80
AND days_since_last_visit <= 180
AND active_patient_flag = true
AND communication_preference_email = true
ORDER BY last_appointment_date DESC
```

### Query 2: Disengaged Patient Re-engagement
```sql
SELECT patient_id, email, phone, last_appointment_date, appointment_compliance_rate,
       chronic_condition_count, health_risk_score, known_barriers
FROM patient_profiles
WHERE appointment_compliance_rate < 0.60
AND days_since_last_visit >= 180
AND medication_adherence_score < 0.50
AND health_risk_score BETWEEN 'moderate' AND 'high'
AND outreach_attempts_last_3m <= 2
AND active_patient_flag = true
ORDER BY health_risk_score DESC, days_since_last_visit DESC
```

### Query 3: Medication Adherence Intervention
```sql
SELECT patient_id, email, phone, medication_count, medication_adherence_score,
       condition_list, last_medication_counseling_date, copay_amount
FROM patient_medications
WHERE medication_count >= 2
AND medication_adherence_score < 0.70
AND condition_list IN ('hypertension', 'diabetes', 'asthma', 'COPD', 'heart_failure')
AND days_since_last_refill_miss > 7
AND NOT EXISTS (
  SELECT 1 FROM adherence_programs
  WHERE patient_id = pm.patient_id
  AND program_status = 'active'
)
AND refill_reminders_accepted = false
ORDER BY medication_adherence_score ASC, medication_count DESC
```

## Engagement Channel Recommendations

| Segment | Email | SMS | Patient Portal | Phone | App Push | In-Person |
|---------|-------|-----|---|----------|-------|----------|
| Active Engagement | Medium | Low | Very High | Medium | Medium | Medium |
| Disengaged | Very High | Very High | Low | Very High | Medium | High |
| Chronic Disease | High | High | High | Medium | Medium | High |
| Preventive Care | High | Medium | High | Low | Medium | Low |
| Telehealth-Ready | High | Medium | Very High | Low | Very High | Low |
| Non-Adherence | Very High | Very High | Medium | High | High | Medium |
| Mental Health | High | Medium | High | Very High | Low | High |
| Post-Discharge | Very High | Very High | High | Very High | Medium | High |
| Wellness Leaders | High | Low | Very High | Low | Very High | High |

## Population Health Management Approach

1. **Risk Stratification**: Segment population by health risk score (low/moderate/high)
2. **Care Coordination**: Identify high-risk patients; assign care coordinators
3. **Engagement Tiers**: Active patients (light touch), at-risk (intensive outreach)
4. **Condition Management**: Group by chronic conditions; condition-specific programs
5. **Readiness Assessment**: Evaluate telehealth readiness, digital literacy, barriers
6. **Outcome Metrics**: Track HbA1c, BP control, appointment compliance, patient satisfaction

## Tips for Success

1. Use HIPAA-compliant messaging; protect sensitive health information
2. Segment by health risk score; allocate resources to high-risk populations
3. Monitor appointment compliance trends; no-show patterns are churn signals
4. Track medication adherence monthly; early intervention prevents complications
5. Use time_travel to analyze patient flow changes (seasonal flu, readmission patterns)
6. Build risk algorithms: chronic conditions + utilization + engagement = risk score
7. Identify mental health screening positives; reduce stigma with gentle outreach
8. Plan discharge follow-up at admission time; 30-day readmission prevention critical
9. Use condition-specific education; evidence-based interventions improve outcomes
10. Monitor social determinants of health; address barriers (transportation, language, cost)
