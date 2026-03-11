---
name: healthcare-marketing-suite
description: Industry-specific orchestrator for healthcare, pharmaceuticals, wellness, and health insurance marketing. Intelligently routes users through CDP workflows based on healthcare industry triggers—patient enrollment, appointments, medication adherence, wellness programs, compliance, provider networks, telehealth adoption, and health plan engagement. Optimizes patient engagement while maintaining strict HIPAA compliance and regulatory standards.
---

# Healthcare Marketing Suite

## Overview

The Healthcare Marketing Suite is a vertical-specific orchestrator designed for healthcare providers, health insurance companies, pharmaceutical manufacturers, wellness platforms, and health systems. It provides industry-contextual entry points into the Zeotap CDP while maintaining strict compliance with healthcare regulations (HIPAA, FTC, state pharmacy laws) and ethical marketing standards.

## Patient Engagement Lifecycle Framework

The suite operates across five interconnected stages:

### 1. Awareness Phase
Individuals seeking health information, symptom research, condition awareness. No patient relationship yet.

**Recommended Skills:**
- **cdp-audience-finder**: Identify health-interested audiences by condition, demographics, and interests
- **cdp-data-enricher**: Layer in health risk factors, symptoms, and research behaviors
- **cdp-journey-recommender**: Deliver educational content and condition information

### 2. Enrollment Phase
Health plan selection, provider network joining, program enrollment, registration completion.

**Recommended Skills:**
- **cdp-audience-finder**: Segment by eligible cohorts (open enrollment, eligible dependents, life events)
- **cdp-data-analyzer**: Analyze enrollment completion rates and drop-off points
- **cdp-journey-recommender**: Optimize enrollment sequences with plan comparisons and support

### 3. Active Engagement Phase
Regular appointments, medication adherence, preventive care participation, wellness program engagement.

**Recommended Skills:**
- **cdp-data-analyzer**: Monitor appointment attendance and medication compliance
- **cdp-journey-recommender**: Remind appointments, encourage medication refills, recommend preventive care
- **cdp-churn-finder**: Identify patients missing preventive care windows

### 4. Compliance Phase
Treatment compliance, medication adherence, follow-up appointments, care plan adherence.

**Recommended Skills:**
- **cdp-churn-finder**: Identify non-compliant patients at-risk for poor outcomes
- **cdp-data-scientist**: Predict medication non-adherence and missed appointment risk
- **cdp-journey-recommender**: Personalized adherence support and reminder sequences

### 5. Advocacy & Retention Phase
Patient satisfaction, retention through life events, referral generation, community health support.

**Recommended Skills:**
- **cdp-data-analyzer**: Monitor satisfaction and health outcomes
- **cdp-lookalike-finder**: Identify advocate patients for referral programs
- **cdp-journey-recommender**: Nurture long-term relationships and family health involvement

## Key Use Cases

### Appointment Optimization
Maximize appointment attendance and minimize no-show rates. Use **cdp-data-analyzer** to identify patient scheduling patterns and optimal reminder timing. Use **cdp-journey-recommender** to send reminder sequences 24-48 hours and 2-7 days pre-appointment with telehealth options.

### Medication Adherence
Improve treatment outcomes through medication compliance. Use **cdp-data-scientist** to predict non-adherence risk by patient type and condition. Use **cdp-journey-recommender** to deliver personalized adherence support, side effect management, and refill reminders.

### Wellness Program Enrollment
Drive participation in preventive and wellness programs. Use **cdp-audience-finder** to identify high-engagement wellness-eligible patients. Use **cdp-journey-recommender** to deliver program benefits messaging and simplify enrollment workflows.

### Compliance-Sensitive Marketing
Maintain patient trust while driving engagement. Ensure all campaigns comply with HIPAA, FTC Telehealth Rule, state pharmacy regulations, and ethical standards. Layer compliance guardrails into **cdp-journey-recommender** and **cdp-data-enricher** configurations.

### Readmission Prevention
Reduce preventable hospital readmissions within 30 days. Use **cdp-churn-finder** to identify high-readmission-risk patients post-discharge. Use **cdp-journey-recommender** to coordinate post-discharge care, follow-up appointments, and medication management.

## Skill Routing Quick Reference

| Use Case | Primary Skill | Secondary Skills |
|----------|---------------|------------------|
| Build patient segments | cdp-audience-finder | cdp-data-analyzer |
| Predict non-compliance | cdp-churn-finder | cdp-data-scientist |
| Find engaged patients | cdp-lookalike-finder | cdp-audience-finder |
| Recommend care actions | cdp-journey-recommender | cdp-data-enricher |
| Enrich patient profiles | cdp-data-enricher | cdp-metadata-explorer |
| Analyze health patterns | cdp-data-analyzer | cdp-data-scientist |
| Monitor data governance | cdp-health-diagnostics | cdp-metadata-explorer |

## Integration Points

### Secure Patient Data Integration
Integrate EHR data, claims data, pharmacy data, and appointment history. Use **cdp-data-enricher** to create HIPAA-compliant unified patient records with de-identification protocols when needed.

### HIPAA-Compliant Personalization
Implement **cdp-journey-recommender** with privacy-first personalization. Use patient-identified data for direct care coordination. Implement consent management for marketing communications beyond direct care.

### Real-Time Care Coordination
Trigger care-related communications through **cdp-journey-recommender** for:
- Appointment reminders and rescheduling options
- Post-visit follow-up coordination
- Lab result notifications and education
- Medication refill reminders and adherence support
- Preventive care recommendations (screenings, vaccinations)

### Predictive Analytics for Outcomes
Use **cdp-data-scientist** to build models for:
- Readmission risk prediction
- Medication non-adherence propensity
- Preventive care eligibility and uptake
- Health outcome forecasting
- Cost and utilization prediction

## Compliance & Ethical Framework

### Privacy & Consent Management
- Maintain separate tracking for treatment communication (direct care, operationally necessary)
- Marketing communication (requires explicit opt-in per HIPAA, CAN-SPAM, TCPA)
- Implement consent versioning and granular opt-out capabilities
- Document all consent elections and preference changes

### Telehealth Compliance
- Follow FTC Telehealth Rule requirements for privacy and security
- Ensure platforms are HIPAA-compliant and use encryption
- Disclose telehealth limitations and when in-person care is required
- Maintain proper provider-patient relationship documentation

### Medication Messaging Guardrails
- Ensure marketing messages don't constitute medical advice
- Reference approved medications and indications only
- Include adverse event and contraindication information transparently
- Avoid influencing non-indicated use or off-label applications
- Comply with state pharmacy regulations and FDA guidance

### Accessibility Compliance
- Ensure all communications meet WCAG 2.1 AA accessibility standards
- Provide translated materials for common languages in service area
- Accommodate multiple communication preferences (written, verbal, visual)
- Support patients with disabilities in all journeys

## Reference Materials

- **[Seasonal Calendar](./references/seasonal-calendar.md)**: Open enrollment, flu season, health awareness months, and clinical windows
- **[KPI Glossary](./references/kpi-glossary.md)**: Healthcare-specific metrics and patient outcome indicators

## Getting Started

1. Establish HIPAA compliance framework and privacy guardrails
2. Define patient cohort by condition, plan status, or health need
3. Reference the Seasonal Calendar for health awareness and enrollment timing
4. Select a primary skill based on your objective (engagement, compliance, or outcomes)
5. Implement consent and preference management for all communications
6. Monitor KPIs from the glossary to measure engagement and health outcomes

---

**Last Updated:** 2026-03-05
**Industry Vertical:** Healthcare & Wellness
**Core CDP Version:** 1.0
**Compliance Note:** This suite is designed to support HIPAA, FTC Telehealth Rule, and state-specific healthcare regulations. Healthcare organizations must implement their own compliance frameworks and legal review.
