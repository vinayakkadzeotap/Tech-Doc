# Healthcare Feature Engineering and Modeling Guide

## Overview
This guide provides feature engineering approaches for healthcare providers and payers. Focus on engagement, clinical outcomes, and utilization prediction.

## Engagement Features

### Patient Portal Activity
Digital engagement indicators:

**Login Behavior**
- Portal logins (frequency)
- Login recency (days since last)
- Login consistency (regular vs. sporadic)
- Feature usage (messaging, scheduling, results viewing)

**Active Engagement**
- Message exchanges with care team
- Appointment self-scheduling
- Prescription refill requests
- Test result reviews

**Implementation**
```sql
SELECT patient_id,
  COUNT(DISTINCT DATE(login_date)) as portal_active_days,
  CURRENT_DATE() - MAX(login_date) as days_since_last_login,
  COUNT(*) as total_logins,
  COUNT(CASE WHEN action='message_sent' THEN 1 END) as messages_sent,
  COUNT(CASE WHEN action='appointment_scheduled' THEN 1 END) as self_scheduled_appointments,
  COUNT(CASE WHEN action='refill_requested' THEN 1 END) as refill_requests
FROM portal_activity
GROUP BY patient_id
```

### Appointment Engagement
Appointment adherence patterns:

**Show Rate**
- Appointments kept (shows vs. scheduled)
- No-show rate (missed opportunities)
- Cancellation pattern (when cancelled)
- Rescheduling rate (find alternative vs. drop)

**Appointment Consistency**
- Appointment frequency (how often see provider)
- Same-day booking vs. advance booking
- Appointment spacing (consistent intervals?)
- Preferred providers (see same physician?)

**Implementation**
```sql
SELECT patient_id,
  COUNT(*) as total_appointments_scheduled,
  COUNT(CASE WHEN status='completed' THEN 1 END) / COUNT(*) as show_rate,
  COUNT(CASE WHEN status='no_show' THEN 1 END) / COUNT(*) as no_show_rate,
  AVG(CASE WHEN status='completed' THEN appointment_duration_minutes END) as avg_appointment_length,
  COUNT(DISTINCT provider_id) as distinct_providers,
  COUNT(CASE WHEN appointment_type='preventive' THEN 1 END) as preventive_appointments
FROM appointments
GROUP BY patient_id
```

### Clinical Communication
Provider engagement:

**Message Volume**
- Messages sent by patient
- Messages received from provider
- Response time by provider
- Message topic categories

**Communication Patterns**
- Communication frequency
- Patient-initiated vs. provider-initiated
- Emergency messages (urgent communication)

**Implementation**
```sql
SELECT patient_id,
  COUNT(*) as total_messages,
  COUNT(CASE WHEN sender='patient' THEN 1 END) as patient_messages,
  COUNT(CASE WHEN sender='provider' THEN 1 END) as provider_messages,
  AVG(CASE WHEN sender='patient' THEN hours_to_response END) as avg_response_time,
  CURRENT_DATE() - MAX(message_date) as days_since_last_message
FROM patient_messages
GROUP BY patient_id
```

## Clinical Features

### Condition Management
Chronic disease engagement:

**Condition Count**
- Number of chronic conditions (disease burden)
- Active conditions (under treatment)
- Condition types (cardiovascular, diabetes, respiratory, etc.)
- Condition severity (based on medications, lab values)

**Condition Trajectory**
- Condition duration (how long diagnosed)
- New conditions (disease progression)
- Resolved conditions (treatment success)
- Comorbidity patterns (multiple conditions together?)

**Implementation**
```sql
SELECT patient_id,
  COUNT(*) as condition_count,
  ARRAY_AGG(DISTINCT condition_code) as condition_codes,
  COUNT(CASE WHEN EXTRACT(YEAR FROM diagnosis_date) = EXTRACT(YEAR FROM CURRENT_DATE()) THEN 1 END) as new_diagnoses_this_year,
  ARRAY_AGG(STRUCT(condition, severity_score) ORDER BY severity_score DESC LIMIT 3) as top_conditions
FROM diagnoses
WHERE active = TRUE
GROUP BY patient_id
```

### Medication Management
Pharmacy engagement and compliance:

**Medication Count**
- Number of medications (complexity)
- Medication types (classes)
- New medications (added this year)
- Medication changes (switches, drops)

**Medication Compliance**
- Medication fill rate (% of time filled)
- Refill consistency (on schedule vs. irregular)
- Medication possession ratio (MPR - compliance proxy)
- Switching medications (non-compliance signal)

**Implementation**
```sql
SELECT patient_id,
  COUNT(DISTINCT medication_id) as medication_count,
  COUNT(CASE WHEN dispensing_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) THEN 1 END) as fills_90d,
  SUM(CASE WHEN medication_type='antihypertensive' THEN 1 ELSE 0 END) as cardiovascular_meds,
  SUM(CASE WHEN medication_type='diabetes' THEN 1 ELSE 0 END) as diabetes_meds,
  COUNT(CASE WHEN days_supply >= expected_days_to_refill THEN 1 END) / COUNT(*) as on_time_refill_rate
FROM pharmacy_fills
GROUP BY patient_id
```

### Lab and Vital Tracking
Clinical measurement patterns:

**Test Frequency**
- Lab tests ordered (monitoring intensity)
- Vital sign measurements (visit frequency)
- Test type distribution (what tests done most?)

**Test Results Trends**
- Key metrics (HbA1c for diabetes, BP for hypertension)
- Result improvement/decline (control trajectory)
- Out-of-range results (control status)

**Implementation**
```sql
SELECT patient_id,
  COUNT(*) as total_lab_results,
  COUNT(DISTINCT test_type) as distinct_test_types,
  AVG(CASE WHEN test_code='HBA1C' THEN result_value END) as avg_hba1c,
  PERCENTILE_CONT(CASE WHEN test_code='HBA1C' THEN result_value END, 0.5) OVER (PARTITION BY patient_id) as median_hba1c,
  COUNT(CASE WHEN result_value > normal_range_high THEN 1 END) as out_of_range_results,
  CORR(test_date, result_value) as result_trend
FROM lab_results
GROUP BY patient_id
```

## Behavioral Features

### Preventive Care Engagement
Wellness program participation:

**Preventive Visit Participation**
- Annual preventive visits completed
- Preventive visit recency (up to date?)
- Cancer screening participation (age-appropriate)
- Immunization status

**Prevention Engagement**
- Wellness program enrollment (interest)
- Wellness program activity (participation)
- Health education participation (learning engagement)

**Implementation**
```sql
SELECT patient_id,
  COUNT(CASE WHEN visit_type='preventive' THEN 1 END) as preventive_visits,
  CASE WHEN MAX(CASE WHEN visit_type='preventive' THEN visit_date END) >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR) THEN 'up_to_date' ELSE 'overdue' END as preventive_status,
  COUNT(CASE WHEN screening_type='colonoscopy' THEN 1 END) as colonoscopies,
  COUNT(CASE WHEN screening_type='mammography' THEN 1 END) as mammograms,
  CASE WHEN wellness_program_enrolled THEN 'enrolled' ELSE 'not_enrolled' END as wellness_status
FROM clinical_events
GROUP BY patient_id
```

### Readmission Risk Behaviors
Hospital readmission signals:

**Recent Hospitalization**
- Recent hospital discharge (readmission window)
- Days since discharge (vulnerability period)
- Discharge location (home vs. rehabilitation)

**Post-Discharge Engagement**
- Follow-up appointment scheduled (discharge planning)
- Follow-up appointment attended (care coordination)
- Post-discharge messaging (engagement)

**Implementation**
```sql
SELECT patient_id,
  CASE WHEN discharge_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END as recent_discharge,
  CURRENT_DATE() - MAX(discharge_date) as days_since_discharge,
  discharge_location,
  COUNT(CASE WHEN readmit_within_30_days THEN 1 END) as readmissions_30d,
  CASE WHEN follow_up_scheduled THEN 'scheduled' ELSE 'not_scheduled' END as follow_up_status,
  CASE WHEN follow_up_attended THEN 'completed' ELSE 'missed' END as follow_up_completion
FROM hospitalizations
GROUP BY patient_id
```

### Compliance Patterns
Treatment adherence behaviors:

**Appointment Compliance**
- Appointment show rate (vs. no-show rate)
- No-show frequency (chronic problem?)

**Medication Compliance**
- Medication possession ratio (MPR) (refill adherence)
- Days covered by medication (continuous coverage?)

**Lab Compliance**
- Lab tests completed on schedule
- Preventive screening completion rate

**Implementation**
```sql
SELECT patient_id,
  COUNT(CASE WHEN appointment_status='completed' THEN 1 END) / COUNT(*) as appointment_show_rate,
  COUNT(CASE WHEN appointment_status='no_show' THEN 1 END) as total_no_shows,
  SUM(days_supply) / (CURRENT_DATE() - first_medication_date) as medication_possession_ratio,
  COUNT(CASE WHEN lab_date = expected_date THEN 1 END) / COUNT(*) as on_time_lab_rate
FROM compliance_metrics
GROUP BY patient_id
```

## Healthcare Utilization Features

### Visit Patterns
Utilization by service type:

**Visit Volume**
- Primary care visits (baseline utilization)
- Specialist visits (referral pattern)
- Emergency visits (acute care needs)
- Urgent care visits (unplanned care)

**Visit Trend**
- Visit frequency trend (increasing/decreasing)
- Unnecessary visits (preventable utilization?)
- High utilizer indicator (top quartile)

**Implementation**
```sql
SELECT patient_id,
  COUNT(CASE WHEN visit_type='primary_care' THEN 1 END) as primary_care_visits,
  COUNT(CASE WHEN visit_type='specialist' THEN 1 END) as specialist_visits,
  COUNT(CASE WHEN visit_type='emergency' THEN 1 END) as emergency_visits,
  COUNT(CASE WHEN visit_type='urgent_care' THEN 1 END) as urgent_visits,
  CASE WHEN COUNT(*) > PERCENTILE_CONT(COUNT(*), 0.75) OVER () THEN 'high_utilizer' ELSE 'normal' END as utilization_level
FROM visits
GROUP BY patient_id
```

### Cost Patterns
Healthcare spending indicators:

**Claim Amounts**
- Total claim amounts (spending)
- Average claim amount
- Claim amount trend (increasing spending)

**Cost Distribution**
- Inpatient costs (hospitalizations)
- Outpatient costs (visits, procedures)
- Pharmacy costs (medication spending)
- Cost concentration (few expensive events vs. many small)

**Implementation**
```sql
SELECT patient_id,
  SUM(claim_amount) as total_claims,
  AVG(claim_amount) as avg_claim,
  SUM(CASE WHEN service_type='inpatient' THEN claim_amount ELSE 0 END) as inpatient_costs,
  SUM(CASE WHEN service_type='outpatient' THEN claim_amount ELSE 0 END) as outpatient_costs,
  SUM(CASE WHEN service_type='pharmacy' THEN claim_amount ELSE 0 END) as pharmacy_costs
FROM claims
GROUP BY patient_id
```

## Common Healthcare Models

### Readmission Risk
Predict 30-day hospital readmission:

**Target Definition**
- Readmitted within 30 days of discharge (yes/no)

**Feature Selection**
- Recent hospitalization (primary risk factor)
- Condition severity (HbA1c, ejection fraction for appropriate conditions)
- Medication compliance (uncontrolled disease increases risk)
- Social support (isolation increases risk)
- Follow-up appointment scheduled (protective factor)
- Age and comorbidities (older, more conditions = higher risk)

**Recommended Model**: LOGISTIC_REG or BOOSTED_TREE

### Appointment No-Show Prediction
Predict who will miss appointments:

**Target Definition**
- Will not-show to appointment (yes/no)

**Feature Selection**
- Historical no-show rate (repeats pattern)
- Appointment type (routine vs. specialty)
- Appointment scheduling (same-day vs. advance)
- Transportation barriers (proxy from address)
- Reminder engagement (open rate, click rate)
- Clinical severity (higher severity = higher show likelihood)

**Recommended Model**: LOGISTIC_REG or DNN_CLASSIFIER

### Medication Non-Compliance Prediction
Predict who won't fill prescriptions:

**Target Definition**
- Will not fill prescribed medication (yes/no)
- Medication possession ratio < 80% (non-compliant)

**Feature Selection**
- Historical medication compliance (repeats behavior)
- Number of medications (complexity barrier)
- Cost-sharing amount (affordability barrier)
- Condition type (some conditions more medication-critical)
- Pharmacy availability (access barrier)
- Literacy signals (if available)

**Recommended Model**: LOGISTIC_REG or BOOSTED_TREE

### High-Cost Patient Identification
Predict who will have high utilization:

**Target Definition**
- Will be top 10% spender next year (yes/no)
- Predicted healthcare costs (regression)

**Feature Selection**
- Current health conditions (strongest predictor)
- Medication count (disease burden proxy)
- Recent hospitalization (indicates acuity)
- Age (cost increases with age)
- Comorbidity count (multiple conditions = higher cost)
- Engagement level (engaged patients may spend less via prevention)

**Recommended Model**: BOOSTED_TREE or LINEAR_REG (for cost prediction)

## Feature Engineering Best Practices

1. **Time Windows**: Use rolling windows for recent engagement (last 90 days)
2. **Data Privacy**: Ensure HIPAA compliance when using patient data
3. **Temporal Alignment**: Align features with prediction date (avoid data leakage)
4. **Clinical Relevance**: Features should map to clinical decision-making
5. **Missing Data**: Healthcare data often sparse (NULL for missing tests); handle carefully

## Cost Optimization Tips

- Use `query_builder` before large claims/visit aggregations
- Pre-aggregate by patient-month before computing features
- Use diagnosis codes efficiently (many codes = slow grouping)
- Cache commonly computed features (conditions, medications)
- Batch score models overnight for daily patient lists

## Model Monitoring

- **Readmission Rates**: Is baseline readmission increasing (quality issue)?
- **Condition Progression**: Are patients getting sicker (program ineffectiveness)?
- **Medication Compliance**: Is MPR declining (affordability pressure)?
- **Engagement Shift**: Are portal logins declining (digital divide widening)?
- **Demographic Equity**: Does model performance vary by demographic (fairness concerns)?

## Regulatory Considerations

- Ensure models don't violate fair lending/fair treatment laws
- Document model rationale for clinical interpretability
- Monitor for unintended bias by protected attributes
- Obtain IRB approval if research study
- Comply with HIPAA de-identification standards
