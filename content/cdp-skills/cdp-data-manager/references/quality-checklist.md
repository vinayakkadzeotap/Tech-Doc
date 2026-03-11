# CDP Data Quality Audit Checklist

## Overview
Comprehensive data quality framework covering completeness, accuracy, freshness, consistency, uniqueness, and compliance validation.

## COMPLETENESS CHECKS

### Definition
Measure the extent to which required data is present. Calculated as fill rate per attribute category.

### Check: Core Identity Fields
**Target Threshold:** 100% (no nulls acceptable)
**Fields to Check:** primary_key, email, phone, external_id

**Audit Steps:**
1. Run `feature_analysis` for identity fields with metric_types=["basic"]
2. Review fill_rate for each field (should be 100%)
3. Use `query_builder` to count null values per field
4. Identify records missing critical identity
5. Document exception rate with business context

**Expected Output:**
- email: 99.5-100% fill rate (some test accounts acceptable)
- phone: 95-100% (country-dependent requirements)
- primary_key: 100% (database constraint should enforce)
- external_id: 90-100% (depends on source completeness)

**Remediation if Below Threshold:**
- Investigate source data quality (data entry issues)
- Implement validation at ingestion
- Backfill from alternative sources
- Flag records for manual review

**Measurement Frequency:** Daily

---

### Check: Profile Attributes
**Target Threshold:** 85% for standard attributes, 70% for optional attributes
**Fields to Check:** name, date_of_birth, address, gender, income_level

**Audit Steps:**
1. Use `feature_analysis` on profile attribute list with metric_types=["basic"]
2. Benchmark fill rates against industry standards
3. Compare fill rates across customer segments
4. Use `time_travel` to see fill rate trends (improving vs declining)
5. Identify where data enters system (source-level analysis)

**Expected Output:**
- name: 95-99% (some missing in certain regions/channels)
- date_of_birth: 75-85% (optional, privacy concerns)
- address: 80-90% (varies by acquisition channel)
- phone: 70-80% (privacy, multiple sources)
- email: 95-99% (mandatory for digital channels)

**Remediation if Below Threshold:**
- Implement data collection workflows
- Incentivize profile completion (loyalty rewards)
- Use post-purchase surveys
- Partner data enrichment
- Remove non-essential fields from requirements

**Measurement Frequency:** Weekly

---

### Check: Behavioral Event Completeness
**Target Threshold:** 95% (events recorded within expected window)
**Events to Check:** page_view, click, conversion, transaction, email_open

**Audit Steps:**
1. Use `get_available_event_types` to list all events tracked
2. Use `get_detailed_events` to sample recent events
3. Compare event counts to expected baseline (by day, hour, device)
4. Identify dropped or incomplete events
5. Check timestamp validity and sequence

**Expected Output:**
- Events have valid timestamps (within reasonable range)
- Event sequence makes logical sense
- Required event fields present (user_id, event_type, timestamp)
- Event counts consistent with traffic patterns

**Remediation if Below Threshold:**
- Review tracking implementation (tags, pixels, pixels)
- Check SDK version (may need upgrade)
- Verify event schema validation
- Implement redundant tracking channels
- Monitor for tracking library failures

**Measurement Frequency:** Daily

---

## ACCURACY CHECKS

### Definition
Validate that data values are correct, fall within expected ranges, and match logical patterns.

### Check: Range Validation
**Target Threshold:** 100% (no values outside valid range)
**Fields to Check:** age, income, quantity, price, date fields

**Audit Steps:**
1. Define valid range for each field (business rules)
2. Use `feature_analysis` with metric_types=["statistical"] to get percentiles
3. Review min/max values (identify outliers)
4. Check for impossible values (negative age, future birthdate)
5. Use `query_builder` to count out-of-range records

**Expected Output Examples:**
- age: 18-120 years (0-17 may indicate data entry error)
- income: $0-$10M (outliers above $1M reviewable)
- quantity: 1-999 (0 or negative indicates error)
- price: $0.01-$999,999 (negative = error, $0 = free)
- date_of_birth: valid calendar dates, not future dates

**Remediation if Out of Range:**
- Implement input validation at collection
- Flag outliers for manual review
- Use business logic to reject invalid entries
- Create exception workflow for valid edge cases
- Clean historical data

**Measurement Frequency:** Weekly

---

### Check: Format Validation
**Target Threshold:** 100% (all values match expected format)
**Fields to Check:** email, phone, zip code, currency, date formats

**Audit Steps:**
1. Define expected format per field (regex patterns)
2. Use `feature_analysis` with metric_types=["quality"] for format review
3. Sample records and manually verify format
4. Use `query_builder` to test format with regex matching
5. Identify format variations and edge cases

**Expected Output:**
- email: valid email format (user@domain.com)
- phone: valid format for region (+1-555-555-5555 for US)
- zip_code: valid format (5 digits for US, variations by country)
- currency: consistent decimal places (USD = 2 decimals)
- date: ISO format (YYYY-MM-DD) or consistent regional format

**Remediation if Invalid Format:**
- Add format validation at ingestion
- Implement data transformation/cleaning
- Use master data format in ETL
- Document accepted format variations
- Provide format guidance to data sources

**Measurement Frequency:** Weekly

---

### Check: Outlier Detection
**Target Threshold:** <1% outliers (or acceptable business variation)
**Fields to Check:** order_value, session_duration, purchase_frequency, engagement_score

**Audit Steps:**
1. Use `feature_analysis` with metric_types=["statistical"] to get percentiles
2. Calculate outlier bounds (e.g., >3 standard deviations)
3. Use `time_travel` to see outlier trends
4. Review samples of outliers for legitimacy
5. Determine if outliers are data errors or valid edge cases

**Expected Output:**
- order_value: mean $87, median $65, 95th percentile $250
  - Outliers >$5K: review if legitimate whale customer or data error
- session_duration: mean 8 min, median 6 min, 95th percentile 45 min
  - Outliers >5 hours: legitimate power users or session tracking error
- purchase_frequency: mean 3x/year, outliers >50x/year: review for automation

**Remediation if High Outlier Rate:**
- Investigate root cause of outliers
- Implement outlier handling (cap, flag, remove)
- Create separate business logic for outlier segment
- Document legitimate outlier patterns
- Monitor for anomalies

**Measurement Frequency:** Weekly

---

## FRESHNESS CHECKS

### Definition
Measure how current data is and alignment with expected update frequency.

### Check: Last Update Timestamps
**Target Threshold:** Within SLA window (e.g., 24 hours)
**Fields to Check:** last_updated, last_login, last_purchase, last_activity

**Audit Steps:**
1. Use `feature_analysis` to get last_update statistics
2. Calculate average age of records (current_date - last_updated)
3. Identify records not updated recently
4. Use `time_travel` to verify when last real update occurred
5. Compare to configured sync schedule

**Expected Output:**
- Core customer attributes: updated within 24 hours (95%+ of records)
- Behavioral data: updated within 6 hours (near real-time systems)
- Derived attributes: updated within sync window
- Reference data: updated within 7 days (less frequent change)

**Remediation if Stale:**
- Increase sync frequency
- Implement incremental/real-time sync
- Check for sync failures (verify sync ran successfully)
- Verify source data actually updated
- Implement backfill for stale records

**Measurement Frequency:** Daily

---

### Check: Sync Frequency Compliance
**Target Threshold:** 100% of scheduled syncs complete successfully
**Tracking:** Scheduled sync vs actual sync timestamp

**Audit Steps:**
1. Pull sync schedule configuration
2. Use `get_events_by_time_window` to review recent syncs
3. Calculate sync success rate (successful / scheduled)
4. Identify failed syncs and error patterns
5. Monitor average sync duration and variance

**Expected Output:**
- Nightly syncs: execute between midnight-6am, complete within 2 hours
- Hourly syncs: execute on hour mark, complete within 30 minutes
- Real-time syncs: latency <5 minutes from source change

**Remediation if Sync Failures:**
- Investigate sync error logs
- Check system resource availability
- Verify connector credentials still valid
- Review recent schema changes
- Increase timeout if needed

**Measurement Frequency:** Daily

---

### Check: Data Latency
**Target Threshold:** Acceptable business latency (varies by use case)
**Tracking:** Time from event occurrence to data availability

**Audit Steps:**
1. Identify key data freshness requirements by use case
2. Measure end-to-end latency (source → capture → process → available)
3. Use `time_travel` with starting/ending timestamps to measure delay
4. Break down latency by component (ingest, transform, load)
5. Compare to SLA requirements

**Expected Output:**
- Real-time personalization: <5 minute latency required
- Batch marketing: <24 hour latency acceptable
- Analytics/reporting: <48 hour latency acceptable
- Compliance audits: <30 day latency acceptable

**Remediation if Exceeds SLA:**
- Identify slowest component (source, ingest, transform, load)
- Apply targeted optimization to bottleneck
- Implement incremental processing for near-real-time
- Add caching for frequently accessed data
- Use streaming architecture if needed

**Measurement Frequency:** Hourly (monitor) / Daily (audit)

---

## CONSISTENCY CHECKS

### Definition
Validate that data is consistent across sources, systems, and time periods.

### Check: Cross-Source Validation
**Target Threshold:** 100% match (or <1% acceptable variance)
**Data to Check:** Customer master, email addresses, phone numbers, purchase history

**Audit Steps:**
1. Identify overlapping data sources (same attribute from multiple sources)
2. Use `query_builder` to compare values between sources
3. Calculate match rate (matching values / total records)
4. Identify systematic differences (source A always higher, etc.)
5. Use `time_travel` to see consistency over time

**Expected Output:**
- Customer email: 99%+ match between email service and CRM
- Purchase value: <5% variance between payment system and CDP
- Phone number: 98%+ match (some formatting differences acceptable)
- Product category: 100% match (reference data should be identical)

**Remediation if Inconsistent:**
- Identify authoritative source (single source of truth)
- Route all updates through authoritative source
- Implement reconciliation process for divergences
- Document acceptable variance with business logic
- Create data governance rules

**Measurement Frequency:** Weekly

---

### Check: Temporal Consistency
**Target Threshold:** Logical consistency in time-ordered data
**Data to Check:** Event sequences, state transitions, historical progression

**Audit Steps:**
1. Review sequences of events for logical order
2. Validate state transitions (can't go from inactive → purchased → cancelled → active)
3. Use `time_travel` to identify temporal anomalies
4. Check for backwards-moving data (last_purchase_date goes back in time)
5. Verify date fields make logical sense

**Expected Output:**
- first_purchase_date <= last_purchase_date (always)
- account_created <= first_purchase (purchase after account creation)
- event sequence ordered by timestamp (no backward time jumps)
- retention_date >= activation_date (can't retain before activation)

**Remediation if Inconsistent:**
- Investigate source data integrity
- Check for data correction/restatement logic
- Verify timestamp accuracy at collection
- Implement validation rules at ingestion
- Create exception handling for valid edge cases

**Measurement Frequency:** Weekly

---

### Check: Referential Integrity
**Target Threshold:** 100% (all foreign keys valid)
**Checking:** Customer ID references, product references, category mappings

**Audit Steps:**
1. Identify all foreign key relationships
2. Use `query_builder` to count orphaned references
3. Check for missing parent records
4. Verify child records map to valid parents
5. Look for referential integrity constraint violations

**Expected Output:**
- Every order has valid customer_id (customer exists)
- Every item references valid product (product exists)
- Every category references valid category_parent (if hierarchical)
- No orphaned records without parent

**Remediation if Broken:**
- Identify why parent records missing
- Create parent records for orphaned children (if valid)
- Remove orphaned records (if not valid)
- Implement foreign key constraints in database
- Add validation during data load

**Measurement Frequency:** Weekly

---

## UNIQUENESS CHECKS

### Definition
Verify that unique data has no duplicates and deduplication is working.

### Check: Primary Key Uniqueness
**Target Threshold:** 100% unique values (no duplicates)
**Keys to Check:** customer_id, order_id, session_id, product_sku

**Audit Steps:**
1. Use `feature_analysis` with metric_types=["quality"] to get cardinality
2. Calculate expected cardinality (distinct count)
3. Compare expected vs actual unique values
4. Use `query_builder` to count duplicates: SELECT id, COUNT(*) FROM table GROUP BY id HAVING COUNT(*) > 1
5. Identify which IDs have duplicates and how many

**Expected Output:**
- customer_id: 100% unique (primary key constraint enforced)
- order_id: 100% unique (database constraint ensures uniqueness)
- product_sku: 100% unique (reference data deduped)
- session_id: 100% unique (generated unique per session)

**Remediation if Duplicates Found:**
- Implement database unique constraint (if not exists)
- Identify duplicate source (merge, resync, import error)
- Merge duplicate records (keep authoritative version)
- Implement deduplication logic in load process
- Add monitoring for duplicate attempts

**Measurement Frequency:** Daily

---

### Check: Deduplication Effectiveness
**Target Threshold:** <1% duplicate rate on mergeable entities
**Entities to Check:** Customer records, email addresses, phone numbers

**Audit Steps:**
1. Define deduplication keys (customer by email, phone, external_id)
2. Use `query_builder` to identify potential duplicates
3. Calculate duplicate rate (duplicates / total records)
4. Use `feature_analysis` to get uniqueness_ratio
5. Verify dedup process is running (check for recent dedup events)

**Expected Output:**
- Email uniqueness: 99.5%+ (same email = same customer)
- Phone uniqueness: 98%+ (same phone = same customer, household scenarios)
- External_id uniqueness: 100% (source system ID uniqueness)
- Customer dedup rate: <0.5% duplicates after merging

**Remediation if High Duplicate Rate:**
- Review deduplication rules (too strict/loose?)
- Implement fuzzy matching for names/addresses
- Add manual review queue for high-risk duplicates
- Merge confirmed duplicates
- Improve data entry standards to prevent future dupes

**Measurement Frequency:** Weekly

---

## COMPLIANCE CHECKS

### Definition
Verify that data is properly classified, flagged, and managed per compliance requirements.

### Check: PII Classification and Flagging
**Target Threshold:** 100% of PII fields identified and flagged
**PII Types:** Email, phone, SSN, credit card, name, address, DOB

**Audit Steps:**
1. Use `schema_discovery` operation to review all columns
2. Use `feature_analysis` with metric_types=["quality"] for PII detection
3. Identify all fields containing PII (review is_pii flag)
4. Verify encryption status of PII fields
5. Check access controls on PII data

**Expected Output:**
- email: flagged as PII, encrypted if stored, access logged
- phone: flagged as PII, masked in logs, encryption status verified
- ssn: flagged as PII, encrypted, very restricted access
- credit_card: flagged as PII, tokenized/encrypted, minimal storage
- name: may be PII depending on use case, assessed for sensitivity

**Remediation if Not Properly Classified:**
- Add PII flags to data dictionary
- Implement encryption for flagged PII fields
- Set up access controls (read on need-to-know)
- Enable audit logging for PII access
- Document PII handling procedures

**Measurement Frequency:** Quarterly

---

### Check: Consent and Privacy Status
**Target Threshold:** 100% valid consent status recorded
**Status Types:** Email opt-in, SMS opt-in, profiling consent, data sale consent

**Audit Steps:**
1. Identify all consent types required by regulations (GDPR, CCPA, etc.)
2. Use `feature_analysis` to check consent_status values and fill rate
3. Verify consent timestamps (when was consent given?)
4. Validate consent against regulatory requirements
5. Use `time_travel` to track consent changes over time

**Expected Output:**
- Email_opt_in: consent recorded (yes/no/unknown/pending)
- SMS_opt_in: consent recorded for all customers
- Marketing_consent: GDPR compliance required in EU
- Data_sale_consent: CCPA compliance required in CA
- Consent timestamps: within expected range (not future, not too old)

**Remediation if Non-Compliant:**
- Implement consent collection workflow
- Add consent status field to customer record
- Audit historical consents (re-collect if missing)
- Set up consent expiry/renewal workflows
- Implement consent enforcement (don't contact without consent)

**Measurement Frequency:** Monthly

---

### Check: Data Retention Policy Compliance
**Target Threshold:** 100% of data within retention policy
**Retention Rules:** Delete after N days/years, retention period by data type

**Audit Steps:**
1. Define retention policy by data type (customer, transaction, behavioral)
2. Use `query_builder` to identify records past retention date
3. Calculate % of data compliant with retention policy
4. Use `time_travel` to confirm data deletions occurred
5. Verify deletion events logged

**Expected Output:**
- Customer data: retained per contract (typically 3-5 years post-active)
- Transaction data: 7 years (financial/tax compliance)
- Behavioral event data: 90 days to 2 years (varies by use case)
- Deleted records: permanently removed, not recoverable

**Remediation if Non-Compliant:**
- Schedule data deletion for records past retention date
- Implement automated retention enforcement
- Create retention schedule in data governance system
- Document retention rationale per data type
- Audit deletion compliance

**Measurement Frequency:** Quarterly

---

## AUDIT EXECUTION WORKFLOW

### Daily Audit (Automated)
1. Run completeness check on core identity fields
2. Monitor sync frequency and success rate
3. Check for duplicate primary keys
4. Verify last_update timestamps within SLA
5. Alert on any threshold violations

### Weekly Audit (Automated + Manual Review)
1. Comprehensive accuracy checks (range, format, outliers)
2. Cross-source consistency validation
3. Temporal consistency verification
4. Uniqueness and deduplication effectiveness
5. Generate quality report, flag issues for investigation

### Monthly Audit (Manual Review)
1. Review PII classification and encryption status
2. Validate consent and privacy status
3. Assess data freshness across all sources
4. Perform sample data quality spot-checks
5. Review and update quality standards

### Quarterly Audit (Comprehensive Review)
1. Full compliance review (GDPR, CCPA, HIPAA, etc.)
2. Retention policy enforcement
3. Access control audit
4. Data governance effectiveness assessment
5. Recommend process improvements

---

## QUALITY SCORECARD

**Metric:** Fill Rate (Completeness)
- Target: ≥95% for core attributes, ≥85% for optional
- Frequency: Daily
- Tool: `feature_analysis` with metric_types=["basic"]

**Metric:** Uniqueness Ratio
- Target: ≥99.5% for unique-constraint fields
- Frequency: Daily
- Tool: `feature_analysis` with metric_types=["quality"]

**Metric:** Freshness (Age of Records)
- Target: ≤24 hours average age
- Frequency: Daily
- Tool: `feature_analysis` with last update times

**Metric:** Accuracy (Outliers)
- Target: <1% out-of-range values
- Frequency: Weekly
- Tool: `feature_analysis` with metric_types=["statistical"]

**Metric:** Consistency (Cross-source match rate)
- Target: ≥99% match between authoritative sources
- Frequency: Weekly
- Tool: `query_builder` cross-source comparison

**Metric:** Sync Success Rate
- Target: 99.5%+ scheduled syncs complete
- Frequency: Daily
- Tool: `get_events_by_time_window` for sync events

**Overall Quality Score:** Weighted average of metrics
- Target: ≥95% overall quality
- Monthly: Generate executive report
- Trend: Monitor month-over-month improvement

