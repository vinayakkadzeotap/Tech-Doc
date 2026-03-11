# Healthcare Data Enricher Guide

## Overview
Enrichment playbook for healthcare and wellness organizations, emphasizing patient engagement and compliance scoring.

## Core Enrichment Attributes

### 1. Patient Engagement Score

**Definition:** Overall propensity to actively participate in health management
**Engagement Dimensions:** Appointment compliance, medication adherence, health tracking, wellness engagement

**Metrics to Calculate:**
- Appointment attendance rate (attended / scheduled)
- Appointment scheduling frequency (proactive scheduling)
- Preventive care utilization (annual checkups, screenings)
- Health information access (views patient portal)
- Medication refill patterns (timely vs delayed refills)
- Health goal tracking (uses tracking tools)
- Wellness program participation (enrolls, participates)
- Customer service contact frequency (proactive vs reactive)

**Engagement Dimensions Scoring (1-5 each):**
- Appointment engagement: 5 = proactive scheduler, perfect attendance
- Medication engagement: 5 = timely refills, high compliance
- Preventive engagement: 5 = participates in all screenings
- Technology engagement: 5 = frequent portal usage
- Wellness engagement: 5 = active program participation
- Support engagement: 5 = communicates health questions

**Overall Engagement Score (1-5):**
- Combines dimension scores (weighted average)
- 5 (Highly engaged): Participates across all dimensions
- 4 (Engaged): Strong participation, minor gaps
- 3 (Moderately engaged): Participates inconsistently
- 2 (Low engagement): Minimal participation, passive
- 1 (Disengaged): Very low participation, high risk

**Engagement Drivers:**
- Health literacy (understanding health information)
- Trust in provider (confidence in care)
- Convenience (ease of access)
- Motivation (personal health goals)
- Support system (family/friend encouragement)

**Data Sources:**
- Appointment records (scheduled vs attended)
- Medication refill logs
- Portal login and usage
- Wellness program enrollment and participation
- Health data submission (self-tracking)
- use `feature_analysis` to compute engagement percentiles

**Enrichment Output:**
- Overall engagement score (1-5)
- Engagement dimension breakdown (scores by dimension)
- Engagement trend (improving/stable/declining)
- Key engagement driver (dimension with highest score)
- Engagement gap (lowest dimension for improvement)
- Disengagement risk (if trend declining)

### 2. Appointment Compliance Index

**Definition:** Patient's consistency in attending scheduled medical appointments
**Compliance Measurement:** No-show rate, cancellation patterns, rescheduling behavior

**Metrics to Calculate:**
- Appointment attendance rate (attended / scheduled %)
- No-show rate (no-shows / scheduled appointments %)
- Cancellation rate (cancellations / scheduled %)
- Last-minute changes (cancellations/reschedules within 24 hrs)
- Same-day attendance (how many show without advance issues)
- Appointment type compliance (emergency vs preventive)
- Provider compliance variation (compliance rates by provider)
- Time-of-day compliance (morning vs afternoon, weekday vs weekend)

**Compliance Tiers (based on attendance rate):**
- Excellent (5): 95%+ attendance rate, reliable
- Good (4): 85-94% attendance, mostly reliable
- Adequate (3): 75-84% attendance, reasonable
- Poor (2): 60-74% attendance, frequent issues
- Critical (1): <60% attendance, high no-show risk

**No-Show Risk Factors:**
- Previous no-shows (predictor of future no-shows)
- Appointment type (preventive vs urgent)
- Time of appointment (early morning higher no-show)
- Advance notice (less notice = higher no-show)
- Appointment reason (chronic follow-up vs acute care)
- Demographic factors (age, distance, transportation)
- Digital literacy (reminder responsiveness)

**Cancellation Patterns:**
- Routine cancellations (reschedules with new appointment)
- Abandonments (cancel without rescheduling)
- Last-minute cancellations (within 24 hours)
- Pattern cancellations (specific days/times)
- Competitive cancellations (may switch providers)

**Data Sources:**
- Appointment database (scheduled, attended, no-show, cancelled)
- Cancellation reason codes (if tracked)
- Reminder interaction logs (emails, SMS, calls)
- Appointment confirmation logs
- Rescheduling patterns
- use `time_travel` to identify compliance trends

**Enrichment Output:**
- Compliance index (1-5 score)
- Attendance rate (%)
- No-show rate (%)
- No-show risk (low/medium/high)
- Optimal reminder timing (when patient responds best)
- Reminder channel preference (email, SMS, phone)
- Intervention strategy (required for high-risk patients)

### 3. Wellness Motivation Level

**Definition:** Patient's intrinsic motivation for health improvement and behavior change
**Motivation Factors:** Health goal setting, program enrollment, activity tracking, engagement duration

**Metrics to Calculate:**
- Wellness program enrollment (participates yes/no)
- Health goal setting (establishes measurable goals)
- Activity tracking (logs exercise, diet, weight, etc.)
- Program completion rate (completes program modules)
- Milestone achievement (reaches health targets)
- Program engagement duration (weeks/months active)
- Consistency of tracking (frequency of data entry)
- Behavior change metrics (steps change, weight loss, etc.)

**Motivation Segments:**
- Intrinsically motivated: Self-driven, consistent engagement
- Externally motivated: Responds to incentives, programs
- Casually interested: Light engagement, sporadic participation
- Low motivation: Minimal involvement, drops quickly
- Resistant: Doesn't engage, skeptical of programs

**Motivation Scoring (1-5):**
- 5 (High): Consistent engagement, achieves goals, sustained behavior change
- 4 (Good): Regular participation, meets some goals
- 3 (Moderate): Intermittent engagement, mixed results
- 2 (Low): Minimal participation, limited behavior change
- 1 (Very low): No engagement, no behavior change

**Motivational Drivers:**
- Health condition severity (motivated by health risk)
- Life events (new year, health scare, family events)
- Social support (support from family/friends)
- Incentives (rewards programs, prizes)
- Progress visibility (tracking and feedback)
- Community support (peer support groups)

**Behavior Change Stage:**
- Pre-contemplation: Not thinking about change
- Contemplation: Thinking about change
- Preparation: Getting ready to change
- Action: Recently changed behavior
- Maintenance: Sustaining behavior change

**Data Sources:**
- Wellness program enrollment records
- Health goal tracking database
- Activity and biometric logs
- Program engagement logs
- Milestone achievement records
- use `feature_analysis` to identify motivation patterns

**Enrichment Output:**
- Motivation level (1-5 score)
- Program participation status (enrolled/not enrolled)
- Health goals (list of goals)
- Engagement consistency (frequency of actions)
- Behavior change progress (measurable outcomes)
- Stage of change (pre-contemplation through maintenance)
- Intervention recommendation (support type needed)

### 4. Telehealth Readiness Score

**Definition:** Patient's comfort and capability to use telehealth/virtual care services
**Readiness Factors:** Technology literacy, device access, internet, comfort with virtual interaction

**Metrics to Calculate:**
- Digital device access (has smartphone, computer, tablet)
- Internet connectivity (has reliable internet)
- Technology literacy (comfort with digital tools)
- Previous telehealth use (has used virtual visits)
- Virtual visit completion rate (completed visits / scheduled)
- Device stability (technical issues with telehealth)
- Communication preference (prefers video, phone, chat)
- Care type suitability (appropriate conditions for telehealth)

**Readiness Tiers (1-5):**
- 5 (High readiness): Tech-savvy, devices/internet, completed telehealth
- 4 (Good readiness): Comfortable with tech, capable of telehealth
- 3 (Moderate readiness): Basic tech comfort, some barriers
- 2 (Low readiness): Limited tech comfort, significant barriers
- 1 (Not ready): Very limited tech, multiple barriers

**Readiness Assessment:**
- Device access (phone, computer, tablet yes/no)
- Internet quality (broadband, mobile, limited)
- Age/demographic tech comfort
- Previous digital health tool use
- Health conditions suitable for telehealth
- Privacy concerns (comfort with home virtual visits)
- Language/hearing needs (closed captions, interpreters)

**Telehealth Adoption Barriers:**
- Technology anxiety (fear of tech)
- Device/internet access (lack resources)
- Privacy concerns (home setting issues)
- Condition requirements (needs physical exam)
- Comfort (prefers in-person)
- Digital literacy (doesn't know how to use)

**Telehealth Opportunity:**
- Identify suitable patients for telehealth
- Address barriers for reluctant patients
- Recommend telehealth education/support
- Project telehealth adoption rate

**Data Sources:**
- Device and internet information (from registration)
- Digital tool usage history (patient portal, messaging)
- Telehealth visit scheduling and completion
- Technical issue logs
- Demographic and technology skill assessment
- use `schema_discovery` to map telehealth utilization

**Enrichment Output:**
- Telehealth readiness score (1-5)
- Device access status (devices available)
- Internet quality (broadband/mobile/limited)
- Tech comfort level (score 1-5)
- Previous telehealth experience (yes/no)
- Virtual visit completion rate (%)
- Recommended care modality (in-person/virtual/hybrid)
- Support needed for adoption (training, devices, etc.)

## Enrichment Pipeline Process

**Data Quality Standards:**
- Fill rate: Minimum 85% for appointment and engagement data
- Timeliness: Update daily for appointments, weekly for wellness
- Accuracy: Validate against EHR and appointment systems
- Consistency: Cross-check engagement metrics with activity logs

**MCP Tools Integration:**
- Use `schema_discovery` to map healthcare event structure
- Use `feature_analysis` to calculate engagement and compliance scores
- Use `time_travel` to identify compliance trends and appointment patterns
- Use `get_detailed_events` to track behavior change and wellness progress

**Enrichment Frequency:**
- Appointment compliance: Daily (real-time for no-shows)
- Patient engagement: Weekly (rolling calculation)
- Wellness motivation: Weekly (activity tracking)
- Telehealth readiness: Monthly (reassess capabilities)

**Output Storage:**
- Store enriched attributes in patient_360 table
- Create daily updates for appointment compliance
- Maintain 12-month rolling window for compliance trends
- Archive historical engagement scores for longitudinal analysis

## Key Analysis Workflows

**MCP Tool Usage Examples:**

1. **Analyze appointment compliance:**
   - Use `get_detailed_events` to track appointment attendance
   - Identify no-show patterns by time, provider, type
   - Calculate compliance scores and risk tiers

2. **Monitor wellness engagement:**
   - Use `time_travel` to track health goal progress
   - Analyze program engagement duration and drop-off
   - Identify successful behavior change cohorts

3. **Assess telehealth opportunity:**
   - Use `feature_analysis` to score readiness by patient segment
   - Identify barriers and support needs
   - Project adoption by condition type

