# Healthcare Lookalike Finder Guide

## Overview
Healthcare lookalike audiences target patients with similar engagement levels, wellness interests, and care consumption patterns. This guide addresses appointment behavior, telehealth adoption, and preventive care affinity for efficient patient acquisition.

## Key Similarity Dimensions

### Engagement Level & Wellness Interest

**Healthcare Engagement**
- Appointment frequency (regular vs acute only)
- Wellness screening participation
- Annual physical attendance
- Preventive care commitment
- Health monitoring consistency

**Wellness Interest**
- Fitness/exercise engagement
- Nutrition program interest
- Mental health service utilization
- Wellness app usage
- Preventive health class participation

**Health Literacy**
- Medical research consumption
- Health information seeking behavior
- Treatment option exploration
- Second opinion seeking
- Patient education participation

**Preventive Care Behavior**
- Preventive screening uptake (age-appropriate)
- Vaccination compliance
- Chronic disease prevention engagement
- Risk factor management
- Early detection participation

### Appointment & Service Patterns

**Appointment Behavior**
- Appointment frequency (yearly, quarterly, monthly)
- Appointment type distribution (preventive, acute, chronic management)
- Appointment scheduling timing (advance vs last-minute)
- Show rate consistency (reliability)
- Cancellation/rescheduling patterns

**Service Mix**
- Primary care vs specialist utilization
- Urgent care usage frequency
- Emergency room visit patterns
- Hospital admission history
- Outpatient procedure frequency

**Virtual vs In-Person**
- Telehealth adoption readiness
- Virtual appointment preference
- Remote monitoring willingness
- In-person preference consistency
- Hybrid care model comfort

### Condition & Treatment Management

**Condition Profile**
- Chronic condition prevalence (diabetes, hypertension, etc.)
- Acute vs chronic care focus
- Comorbidity patterns
- Condition complexity
- Management stability

**Treatment Engagement**
- Medication compliance signals
- Prescription refill patterns
- Treatment adherence consistency
- Procedure acceptance
- Behavioral change program participation

**Disease Prevention Interest**
- Lifestyle modification engagement
- Preventive procedure acceptance
- Risk screening participation
- Early intervention uptake
- Health behavior change support

### Provider & Care Continuity

**Provider Loyalty**
- Primary care provider stability
- Provider switching patterns
- Specialty provider utilization
- Care team consistency
- Multi-provider coordination engagement

**Care Coordination**
- Records sharing comfort
- Referral acceptance rate
- Integrated care adoption
- Cross-provider appointment linkage
- Care plan adherence

**Communication Preference**
- Patient portal usage
- Email communication comfort
- Phone preference
- Text message willingness
- Direct messaging adoption

### Insurance & Financial Behavior

**Insurance Profile**
- Insurance type (HMO, PPO, high-deductible)
- Coverage stability
- Insurance company frequency changes
- Deductible tier comfort
- Out-of-pocket spending patterns

**Financial Engagement**
- Payment consistency
- Financial assistance seeking
- Cost-transparent care interest
- Insurance literacy level
- Payment plan usage

### Demographics & Life Stage

**Life Stage Indicators**
- Age and life stage (young adult, parent, pre-retirement, retirement)
- Family structure (single, parents, multigenerational)
- Dependent care needs
- Caregiving responsibilities
- Employment stability (proxy for insurance continuity)

**Demographic Factors**
- Geographic location (urban, suburban, rural)
- Language preference
- Cultural health beliefs
- Socioeconomic status (proxy)
- Education level (literacy indicator)

## Feature Analysis Methodology

### Essential Metrics (basic)
```
Columns to analyze:
- appointment_frequency_annual
- last_appointment_days_ago
- preventive_care_participation
- wellness_screening_count_annual
- telehealth_adoption_flag
- telehealth_visits_annual
- primary_care_provider_same_flag
- chronic_condition_count
- medication_refill_compliance_score
- mental_health_service_usage
- fitness_program_participation
- annual_medical_spend
- emergency_visits_annual
- specialist_visit_count
- insurance_tenure_days
- patient_portal_usage_frequency
- appointment_show_rate
- condition_management_score
- age_group
- insurance_type
```

Metric types: ["basic", "statistical", "quality"]

Analysis per store_type: "profile_store" (patient profiles and care patterns)

### Statistical Metrics
- Appointment frequency distribution (per year)
- Appointment interval distribution (days between visits)
- Telehealth usage distribution
- Medical spend distribution
- Chronic condition count distribution
- Show rate distribution

### Quality Metrics
- Insurance data synchronization freshness
- Provider directory accuracy
- Clinical data completeness
- Appointment schedule consistency
- Privacy compliance validation

## Seed Audience Definition

### Approach
1. **Select Patient Type**: Identify valuable or strategic segment
2. **Establish Care Pattern**: Document appointment and service frequency
3. **Map Condition Profile**: Identify managed conditions and complexity
4. **Profile Engagement**: Document wellness and preventive care interest
5. **Define Provider Relationship**: Identify continuity and coordination level

### Example Seed Profiles

**Seed 1: "Engaged Preventive Care Patient"**
- Appointment frequency: 2-4 visits/year (wellness focus)
- Preventive screening: Annual participation
- Chronic conditions: 0-1 (well-managed)
- Telehealth adoption: High (30-50% of visits)
- Wellness engagement: High (fitness, nutrition programs)
- Mental health: Occasional preventive counseling
- Primary care continuity: Very high (same provider 90%+)
- Insurance: Stable, long tenure
- Patient portal: Active user (monthly+)
- Medication compliance: Excellent (refills on schedule)

**Seed 2: "Chronic Disease Manager"**
- Appointment frequency: 4-8 visits/year (disease management)
- Preventive screening: Compliant (condition-relevant)
- Chronic conditions: 2-3 (diabetes, hypertension, etc.)
- Telehealth adoption: Moderate (20-30% of visits)
- Wellness engagement: Moderate (condition-specific programs)
- Mental health: Regular mental health support (comorbidity)
- Primary care continuity: High (same provider 80%+)
- Specialist coordination: High
- Insurance: Stable, some provider network navigation
- Medication compliance: Good (multiple medications)

**Seed 3: "Casual Acute-Care Patient"**
- Appointment frequency: 1-2 visits/year (as-needed)
- Preventive screening: Inconsistent (falls behind)
- Chronic conditions: 0 (or undiagnosed)
- Telehealth adoption: Low (rare usage)
- Wellness engagement: Low (sporadic interest)
- Mental health: No services
- Primary care continuity: Low (multiple providers)
- Emergency visit frequency: Moderate (acute flare-ups)
- Insurance: Stable but coverage gaps
- Medication compliance: Variable

## Matching Methodology

### Feature Space Construction
1. **Care Pattern Vector**: Appointment frequency, service mix, regularity
2. **Engagement Profile**: Wellness participation, preventive care, portal usage
3. **Condition Vector**: Chronic condition count, complexity, stability
4. **Provider Relationship**: Primary care continuity, coordination level
5. **Technology Adoption**: Telehealth usage, patient portal, remote monitoring

### Similarity Scoring
- **Care Frequency Alignment**: Within ±1-2 visits/year of seed
- **Condition Profile**: Same chronic condition count range (±1)
- **Preventive Care Participation**: Similar screening compliance rate
- **Telehealth Comfort**: Same adoption tier (high/moderate/low)
- **Provider Continuity**: Similar primary care loyalty percentage
- **Insurance Stability**: Similar insurance tenure and type
- **Engagement Level**: Similar wellness and preventive care interest

### Candidate Filtering
- **Exclude**: Patients with serious compliance issues or DNR flags
- **Exclude**: Patients with poor appointment attendance (show rates <50%)
- **Exclude**: Patients with complex social/behavioral health issues (if targeting general wellness)
- **Priority**: Patients new to health system with engaged signals
- **Priority**: Patients approaching age-specific screening milestones
- **Bias toward**: Patients with technology comfort (telemedicine adoption)

### Lookalike Expansion Tiers

**Tier 1: Conservative (High Fidelity)**
- Must match: Care frequency range, condition profile, engagement level
- Can vary: Specific providers (same specialty), secondary conditions
- Expansion ratio: 4-8x
- Expected engagement match: 85-95%

**Tier 2: Moderate (Balanced)**
- Must match: Patient type (preventive-focused vs disease-manager), care engagement
- Can vary: Specific conditions (same complexity level), telehealth adoption
- Expansion ratio: 12-25x
- Expected engagement match: 70-85%

**Tier 3: Aggressive (Volume)**
- Must match: General patient type (engaged vs sporadic), insurance type
- Can vary: Specific conditions, provider network
- Expansion ratio: 40-100x
- Expected engagement match: 50-75%

## Expected Expansion Ratios

### By Patient Type

**Preventive Care Seeds**
- Conservative: 5-10x
- Moderate: 15-30x
- Aggressive: 40-100x
- Rationale: Growing segment, broad appeal for wellness programs

**Chronic Disease Manager Seeds**
- Conservative: 4-8x
- Moderate: 12-20x
- Aggressive: 30-60x
- Rationale: Smaller segment, specific condition targeting

**Acute-Care Only Seeds**
- Conservative: 8-15x
- Moderate: 20-40x
- Aggressive: 60-150x
- Rationale: Large population, lower engagement baseline

## Similarity Dimension Weighting

### Critical Dimensions (Weight: 3.0x)
- Patient engagement level (program fit)
- Care frequency (utilization pattern)
- Preventive care interest (wellness alignment)
- Insurance stability (continuity)

### Important Dimensions (Weight: 2.0x)
- Chronic condition profile (clinical fit)
- Telehealth adoption (operational fit)
- Primary care continuity (relationship strength)
- Wellness participation (health behavior)

### Supplementary Dimensions (Weight: 1.0x)
- Specific condition details (personalization)
- Demographic factors (targeting refinement)
- Geographic location (convenience)

## Implementation Approach

### Data Requirements
- Appointment history (24+ months)
- Claim/encounter data
- Chronic condition documentation
- Insurance enrollment data
- Preventive screening records
- Patient portal usage logs
- Medication refill records

### Lookalike Creation Steps
1. Use schema_discovery to understand patient data model
2. Run feature_analysis on seed cohort for care patterns
3. Use time_travel to identify appointment behavior trends
4. Calculate feature-space similarity for candidates
5. Apply care engagement and condition-based filtering
6. Generate lookalike audiences at multiple expansion tiers
7. Validate against historical program enrollment and engagement

### Validation Strategy
- Compare lookalike appointment frequency to seed
- Verify preventive care participation rates
- Check chronic condition distribution
- Monitor telehealth adoption consistency
- Track program enrollment and compliance

## Segment-Specific Matching

### Preventive Program Matching
- Emphasis on wellness engagement and screening participation
- Lower chronic disease burden
- Expected expansion: 15-40x

### Chronic Disease Program Matching
- Emphasis on condition type and management consistency
- High medication adherence
- Expected expansion: 10-20x

### Mental Health Service Matching
- Emphasis on mental health awareness and service usage
- Comorbidity patterns
- Expected expansion: 8-15x

## Performance Expectations

- Lookalike audience size: 50-200x seed (depending on patient type)
- Program enrollment: 20-40% higher than non-targeted patients
- Appointment adherence: 85-95% of seed appointment show rate
- Preventive screening completion: 75-90% of seed rate
- Medication refill compliance: 80-95% of seed compliance
- Patient satisfaction: 85%+ alignment with seed
- False positive rate: 12-20%

## Privacy & Compliance Considerations

- HIPAA compliance for all patient data handling
- State health privacy law compliance (varies by state)
- Genetic privacy (if applicable to condition)
- Mental health privacy (additional safeguards)
- Behavioral health privacy (sensitive conditions)
- Patient consent for targeting programs
- Transparent opt-in/opt-out mechanisms

## Seasonal & Lifecycle Patterns

- Age-appropriate screening windows
- Insurance plan changes (open enrollment periods)
- Seasonal illness patterns
- Referral period (new to system patterns)
- Condition management seasonal variations

## Monitoring & Optimization

### Key Metrics
- Appointment attendance consistency
- Preventive screening participation
- Medication refill patterns
- Program enrollment rates
- Patient satisfaction scores

### Refinement Triggers
- Appointment frequency variance >25%
- Preventive care participation drops
- Telehealth adoption significantly different
- Condition management deterioration
- Patient dissatisfaction patterns

## Integration with CDP Tools

### schema_discovery Usage
- Explore profile_store for patient dimensions
- Identify calculated_attribute for engagement scores, health risk
- Verify HIPAA-compliant data handling

### feature_analysis Usage
- Analyze seed cohort with metric_types: ["basic", "statistical", "quality"]
- Establish appointment and engagement distributions
- Identify condition clustering
- Validate data quality and completeness

### time_travel Usage
- Track appointment patterns over 24+ months
- Monitor appointment frequency trends
- Identify seasonal care patterns
- Detect early disengagement signals
- Monitor medication refill consistency

### query_builder Usage
- Cost estimation for patient history queries
- Optimize HIPAA-compliant data extraction
- Model scalability of expansion tiers

## Implementation Checklist

- [ ] Define 2-4 seed patient profiles (by care pattern)
- [ ] Establish appointment frequency baselines
- [ ] Document condition profiles and complexity levels
- [ ] Map preventive care participation patterns
- [ ] Create feature space vectors
- [ ] Build similarity scoring formula
- [ ] Establish HIPAA/privacy compliance framework
- [ ] Test on historical patients (backtesting)
- [ ] Validate lookalike vs seed engagement metrics
- [ ] Set up performance dashboards
- [ ] Plan program-specific targeting strategy
- [ ] Document expansion ratio assumptions
- [ ] Schedule quarterly model updates
- [ ] Establish ongoing privacy audit process
