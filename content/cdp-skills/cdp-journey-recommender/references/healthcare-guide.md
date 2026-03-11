# Healthcare Journey Recommender Guide

## Overview
Healthcare and wellness industry journey templates, emphasizing patient engagement, appointment compliance, preventive care, and chronic disease management.

## Core Journey Patterns

### 1. Enrollment-to-First-Appointment-Follow-Up
**Trigger Events:** enrollment_completed, welcome_kit_sent, first_appointment_scheduled, first_appointment_completed, follow_up_care_initiated
**Journey Duration:** 0-90 days post-enrollment

**Journey Stages:**
- Stage 1: Enrollment completion (0 hours)
- Stage 2: Welcome and onboarding (0-3 days)
- Stage 3: Provider selection and assignment (3-7 days)
- Stage 4: First appointment scheduling (7-14 days)
- Stage 5: First appointment (14-30 days)
- Stage 6: Follow-up care and treatment (30-90 days)
- Stage 7: Ongoing relationship and loyalty (90+ days)

**Timing Windows:**
- Welcome packet: 0-2 hours post-enrollment
- Provider introduction: 1-2 days post-enrollment
- First appointment offer: 3-5 days post-enrollment
- Appointment confirmation: 2-3 days pre-scheduled appointment
- Pre-appointment reminders: 24 hours and 2 hours before
- Post-appointment follow-up: Same day post-visit
- Prescription/treatment confirmation: 1-2 days post-visit
- Next appointment scheduling: 3-7 days post-visit

**Channel Recommendations:**
- Email (40%): Appointment confirmations, educational content
- SMS (35%): Appointment reminders, test results
- In-app messaging (15%): Health tracking and status updates
- Phone/automated calls (5%): Appointment reminders
- Patient portal: Central hub for records and messaging

**Conversion Expectations:**
- First appointment scheduling rate: 65-75%
- First appointment completion rate: 85-90%
- Follow-up care adherence: 75-85%
- Provider satisfaction (NPS): 60+
- Patient retention (12-month): 80-90%

### 2. Missed-Appointment-to-Reschedule
**Trigger Events:** appointment_missed, rescheduling_outreach_initiated, rescheduling_offer_sent, appointment_rebooked
**Miss Window:** Same-day or 24-hour notification

**Journey Stages:**
- Stage 1: Miss detection (real-time or end of appointment slot)
- Stage 2: Immediate outreach (within 2 hours)
- Stage 3: Rescheduling incentive (same day)
- Stage 4: Rescheduling options presentation (within 24 hours)
- Stage 5: Rescheduling confirmation (immediate upon booking)
- Stage 6: Appointment reminder sequence (multi-touch)
- Stage 7: Compliance follow-up (post-completion)

**Timing Windows:**
- Immediate outreach: 0-2 hours after miss
- First rescheduling incentive: 2-4 hours post-miss
- Secondary contact attempt: 24 hours post-miss
- Alternative options offered: 24-48 hours post-miss
- Appointment reminder: 72 hours, 24 hours, 24 minutes before
- Post-visit compliance tracking: 1-3 days post-reschedule

**Channel Recommendations:**
- SMS (primary): Urgent outreach and rescheduling links
- Phone call (secondary): High-risk or elderly patients
- Email: Detailed rescheduling options
- In-app messaging: Flexible scheduling interface
- Patient portal: Self-service rescheduling

**Conversion Expectations:**
- Immediate rescheduling rate: 30-40%
- Rescheduling within 24 hours: 45-55%
- Total rescheduling rate: 60-70%
- Rescheduled appointment completion: 85-90%
- Compliance improvement after miss: 25-35%

### 3. Wellness-Signup-to-Milestone-Advocacy
**Trigger Events:** wellness_program_enrolled, health_assessment_completed, milestone_achieved, advocacy_opportunity, referral_generated
**Program Duration:** 12+ months with milestone-based engagement

**Journey Stages:**
- Stage 1: Wellness program enrollment (0 days)
- Stage 2: Health assessment and baseline (days 1-7)
- Stage 3: Personalized plan creation (days 7-14)
- Stage 4: Engagement milestones (months 1-6)
- Stage 5: Progress celebration (months 3, 6, 9, 12)
- Stage 6: Advocacy opportunity (month 9+)
- Stage 7: Referral generation (ongoing)

**Timing Windows:**
- Welcome onboarding: 0-3 days
- Health assessment: Days 3-7
- Plan delivery: Days 7-10
- First milestone (weight, activity): Day 30
- Incentive reward: Same day as milestone
- Progress check-in: Monthly
- Celebration notification: Quarterly (3, 6, 9, 12 months)
- Referral request: Month 9-12 (high satisfaction cohort)

**Channel Recommendations:**
- Email (35%): Program updates, health tips, progress reports
- In-app messaging (30%): Daily tracking, motivation, milestone alerts
- SMS (20%): Appointment reminders, achievement celebrations
- Gamification/leaderboard (10%): Community engagement
- Wearable integration (5%): Seamless health tracking

**Conversion Expectations:**
- Program enrollment to assessment: 75-85%
- Plan completion rate: 50-60%
- Milestone achievement rate: 40-50% per milestone
- 12-month retention: 60-70%
- Advocacy/referral rate: 20-30%

### 4. Annual-Checkup-Reminder-to-Compliance
**Trigger Events:** annual_checkup_due, preventive_care_reminder, appointment_booked, checkup_completed, results_reviewed, next_appointment_scheduled
**Checkup Frequency:** Annual for adults, varies by age/risk

**Journey Stages:**
- Stage 1: Preventive care due notification (45 days before annual date)
- Stage 2: Appointment availability and incentives (30 days before)
- Stage 3: Appointment booking confirmation (14 days before)
- Stage 4: Pre-appointment preparation (3 days before)
- Stage 5: Appointment reminder (24 hours before)
- Stage 6: Checkup completion (day 0)
- Stage 7: Results and recommendations (1-3 days post-checkup)
- Stage 8: Follow-up care scheduling (7-14 days post-checkup)

**Timing Windows:**
- First reminder: 45 days before annual date
- Incentive offer: 30-35 days before
- Confirmation email: 14 days before appointment
- Pre-appointment instructions: 3 days before
- Appointment reminder: 24 hours before
- Results notification: 1-3 days post-visit
- Follow-up scheduling: 7-14 days post-visit
- Next year's reminder: 30-45 days after this visit

**Channel Recommendations:**
- Email (40%): Results, follow-up instructions, scheduling
- SMS (35%): Appointment reminders, results alerts
- Patient portal (15%): Results review, lab orders
- Phone (5%): High-risk patient follow-up
- In-app messaging (5%): Appointment confirmations

**Conversion Expectations:**
- Reminder engagement rate: 50-60%
- Appointment booking rate: 60-70%
- Appointment completion rate: 85-90%
- Results review rate: 70-80%
- Follow-up compliance: 75-85%
- Next-year re-engagement: 80-90%

## Data Requirements

**Essential Attributes:**
- patient_profile (age, health_status, chronic_conditions, risk_level)
- appointment_history (frequency, completion_rate, no-show_rate)
- health_metrics (vital_signs, lab_results, health_assessments)
- medication_profile (current_medications, compliance_rate, refill_frequency)
- wellness_engagement (program_enrollment, activity_tracking, goal_progress)
- communication_preferences (channel_preference, contact_frequency, language)
- compliance_score (appointment_adherence, medication_adherence, engagement_level)

**Event Tracking:**
- enrollment_completed, welcome_kit_sent
- appointment_scheduled, appointment_reminder_sent, appointment_completed, appointment_missed
- health_assessment_completed, lab_results_received, prescription_filled
- wellness_milestone_achieved, health_goal_reached
- follow_up_scheduled, follow_up_completed
- advocacy_request_sent, referral_generated

## Key Performance Indicators

- First appointment completion rate: 85-90%
- Annual checkup compliance rate: 70-80%
- Missed appointment rate (target: <10%)
- Rescheduling rate after miss: 60-70%
- Medication adherence rate: 70-80%
- Preventive care engagement: 60-70%
- Patient satisfaction (HCAHPS): 75+
- Patient retention rate: 80-90%
- Wellness program ROI by participants
- Referral generation rate: 20-30%

## Measurement & Optimization

**MCP Tools Usage:**
- Use `schema_discovery` to map healthcare events and patient journey
- Use `feature_analysis` to identify no-show risk and engagement propensity scores
- Use `time_travel` to analyze appointment compliance patterns and seasonal health trends
- Use `get_detailed_events` to track missed appointment recovery effectiveness

**Testing Framework:**
- A/B test appointment reminder timing (72hr vs 24hr)
- Test reminder channels (SMS vs email vs phone)
- Segment by age, health status, and risk level
- Personalize preventive care education

**Compliance & Privacy:**
- Ensure HIPAA compliance in all communications
- Manage consent and opt-out preferences
- Secure patient data in all journeys
- Maintain audit trails of all patient interactions

