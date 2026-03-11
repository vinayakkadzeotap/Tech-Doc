---
name: cdp-data-manager
description: Monitor data pipelines, check quality metrics, troubleshoot sync failures. The operations control center for data health. Use this when you need to assess pipeline status, validate data freshness, debug why data isn't flowing, or investigate sync errors. Triggered by monitoring requests, quality audits, and incident investigation. URGENT: escalate immediately on pipeline failures or data quality drops below 95% success rate.
---

# CDP Data Manager Skill

## Purpose
This skill operates as the control center for data pipeline health, quality monitoring, and troubleshooting. It transforms "is our data flowing?" into systematic health checks and root-cause investigations.

## When to Use This Skill

**Trigger on these user intents:**
- "Check our data pipeline status"
- "Is data flowing to our destinations?"
- "Data quality audit needed"
- "Sync failed—what happened?"
- "Upload status for [destination]"
- "Our data completeness is dropping"
- "Missing data in production"
- "Destination health check"
- "Pipeline is broken"
- "Data freshness concerns"
- "Audience sync failures"
- "Troubleshoot data quality issues"

**Do NOT trigger on:**
- Analysis/insights questions (use cdp-data-analyzer)
- Audience building (use cdp-audience-finder)
- Schema/metadata questions (use cdp-metadata-explorer)
- System performance (use cdp-health-diagnostics)

## Operational Modes

### Mode 1: Health Dashboard (Quick Status Check)

**When to use:** User wants a high-level overview of pipeline health

**MCP Tool Sequence:**
```
1. get_org_exists(org_id) → Validate org and get business name
2. get_available_services_by_org_id(org_id) → List active services
3. get_destination_health(org_id, [optional: date, service]) → Success/failure ratios
4. get_events_by_time_window(org_id, service, start_date, end_date) → Recent activity
```

**Interpretation Rules:**
- **Green (>95% success)**: Pipeline healthy, no action needed
- **Yellow (90-95% success)**: Minor issues, monitor closely, escalate to data engineering if trending down
- **Red (<90% success)**: Critical issue, immediate escalation needed

**Output Format:**
```
ORGANIZATION: [Business Name]
STATUS: [GREEN/YELLOW/RED]

Services Active:
- Uploader: [success_count]/[total_count] (X% success)
- Sender: [success_count]/[total_count] (X% success)
- Exporter: [success_count]/[total_count] (X% success)

Destinations with Issues (< 95% success):
- Destination A: 87% success (N failures in last 24h) → ESCALATE
- Destination B: 92% success (trending down, monitor)

Recent Activity (last 24-48h):
- Total events: N
- Failed uploads: N
- Last successful sync: [timestamp]
```

**Escalation Triggers:**
- Any destination below 90% success
- Success rate dropping >5 points in 24h
- No successful syncs in >6 hours during business hours

### Mode 2: Data Quality Audit (Comprehensive Quality Check)

**When to use:** User wants deep quality validation across all data

**MCP Tool Sequence:**
```
1. schema_discovery(overview) → Understand data structure
2. feature_analysis(
     columns: [all_or_critical],
     metric_types: ["basic", "quality"],
     store_type: [profile_store|event_store]
   ) → Get fill rates, cardinality, PII flags
3. time_travel(
     starting_timestamp: [previous_period],
     ending_timestamp: [current_period],
     metrics: ["basic", "quality"]
   ) → Compare quality across time windows
4. Identify degradation: Compare fill_rate_pct change, distinct_count changes
```

**Quality Checklist (Always Validate):**

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Column Fill Rate | >95% per critical column | Investigate missing data source |
| Cardinality Stability | <5% change month-over-month | Check for data pipeline drift |
| PII Flagged Columns | 0 unexpected | Review schema for new PII additions |
| Data Freshness | Updates within 24h | Check sync schedule vs. source delay |
| Outlier Percentage | <0.1% of values | Validate against business rules |
| Duplicate Rate | <0.5% by key | Check for double-syncs or merge issues |

**Quality Report Template:**
```
DATA QUALITY AUDIT: [Date Range]

OVERALL QUALITY SCORE: [X%]
- Green (>95%): All critical metrics healthy
- Yellow (85-95%): Minor issues, non-critical columns affected
- Red (<85%): Critical columns degraded, requires action

Critical Columns:
- [Column A]: Fill rate 99.2% ✓, Cardinality 1.2M ✓
- [Column B]: Fill rate 87% ⚠, Down from 96% last month → INVESTIGATE
- [Column C]: New PII flag detected ⚠ → REVIEW SCHEMA

Recent Changes:
- Column [X] cardinality jumped 40% in last 7 days
- Column [Y] fill rate trending down 2% per day
- [N] columns now receiving NULL values that weren't before

Recommendations:
1. [Action item prioritized by severity]
2. [Action item]
```

**Common Quality Issues & Remediation:**

| Symptom | Root Cause | Remediation |
|---------|-----------|-------------|
| Fill rate sudden drop | Source system sync stopped | Check source connection, restart sync job |
| Cardinality explosion | New data source added | Validate schema update, check for duplicates |
| Outliers in numeric field | Source system bug or config change | Compare pre/post outlier profiles, escalate to source team |
| PII flags increase | Unencrypted field included | Audit schema changes, re-encrypt if needed |
| Duplicate keys | Reprocessing or merge conflict | Check dedup logic, validate upsert conditions |

### Mode 3: Incident Investigation (Root Cause Forensics)

**When to use:** A specific failure has occurred and you need to understand why

**MCP Tool Sequence:**
```
1. get_org_exists(org_id) → Validate org
2. get_recent_dates(org_id, [service]) → Find dates with logs
3. get_events_by_time_window(org_id, service, start_date, end_date)
   → Narrow down problem window
4. get_error_deep_dive(org_id, service, date)
   → Extract error details, destination IDs, retry attempts from JSON payload
5. get_detailed_events(org_id, service, event_type, limit)
   → Raw forensic payloads to confirm root cause
```

**Incident Investigation Framework:**

#### Step 1: Scope the Problem
```
Q1: Which service failed? (Uploader, Sender, Exporter, etc.)
Q2: When did it start? (Find via get_recent_dates)
Q3: Is it ongoing or resolved? (Check latest successful sync)
Q4: Is it all destinations or specific ones? (get_destination_health)
```

#### Step 2: Identify the Error Pattern
```
get_error_deep_dive output typically shows:
- error_message: The root error (API rejection, timeout, auth failure)
- destination_id: Which downstream system
- retry_count: How many times we've retried
- last_retry_timestamp: When we gave up
- affected_record_count: How many records impacted

Look for patterns:
- Same error across all attempts → Configuration issue
- Different errors on retries → Transient issue (rate limit, network)
- Error only on specific destination → Destination API problem
- Correlation with time → Check for scheduled jobs, config changes
```

#### Step 3: Extract Forensic Details
```
get_detailed_events returns raw event payloads:
- Full request/response bodies
- Timeout durations
- Retry backoff patterns
- Header/auth information (redacted for PII)

Use to:
- Validate that we're sending correct data
- Confirm destination is rejecting valid records
- Check if retry strategy is appropriate
- Identify systematic vs. one-off failures
```

#### Step 4: Root Cause Categories & Escalation

| Root Cause | Evidence | Escalation |
|-----------|----------|-----------|
| **Our Code Bug** | Same error on all retries, consistent pattern | Data Engineering team → P1 |
| **Destination API Issue** | Errors start/stop with destination uptime | Destination vendor + our integration team → P1 |
| **Network/Transient** | Different errors on retries, then recovers | Monitor, no immediate escalation, alert if recurring |
| **Configuration/Auth** | Auth failures, endpoint not found | Data Engineering → P2 (operational) |
| **Rate Limiting** | 429/quota errors, recovers after backoff | Negotiate limits with destination or increase batch size |
| **Data Quality** | Destination rejecting specific field values | Data Engineering + source team → P2 |
| **Timing/Scheduling** | Failure during business hours or batch window | Check job scheduler, coordinate with dependent systems |

**Incident Report Template:**
```
INCIDENT: [Service] sync failures on [Date]

SCOPE:
- Service: [Uploader/Sender/etc]
- Duration: [Start time] to [End time] (resolved/ongoing)
- Affected destinations: [List]
- Records impacted: ~[N]

ROOT CAUSE:
[Identified cause from error_deep_dive]

EVIDENCE:
- Error message: "[exact error from logs]"
- Affected destination ID: [destination]
- Retry attempts: [N] (last at [time])
- Pattern: [transient / systematic / degrading]

REMEDIATION:
1. Immediate: [Action taken or recommended]
2. Follow-up: [Escalation or monitoring]
3. Prevention: [Process/config change to prevent recurrence]

CONFIDENCE: [Low/Medium/High] - based on log completeness and error clarity
```

## Quality Metrics Deep Dive

### Fill Rate Analysis
- **Definition**: Percentage of records that have a non-null value for a column
- **Target**: >95% for critical columns, >90% for secondary
- **Investigation**: If dropping, check:
  - Did source system stop sending this field?
  - Did schema update add new optional field?
  - Are certain user segments missing this data?

### Cardinality Analysis
- **Definition**: Number of distinct values in a column
- **Target**: Stable month-over-month (5% variance acceptable)
- **Investigation**: If exploding, check:
  - New data sources added to pipeline?
  - Are we now capturing values we filtered before?
  - Is there a data quality issue creating garbage values?

### Data Freshness
- **Definition**: Lag between source system update and CDP record update
- **Target**: <24 hours for most use cases, <1 hour for real-time segments
- **Investigation**: If degrading, check:
  - Has source system slowed down?
  - Is batch window scheduled during heavy load?
  - Are there downstream dependency delays?

### Error Rates
- **Definition**: Count of failed syncs / total attempted syncs
- **Target**: <5% error rate (99.5% success threshold)
- **Investigation**: Use get_error_deep_dive to categorize:
  - Transient errors (retry-able, usually resolve)
  - Permanent errors (require code/config fix)

## References & Runbooks

- `references/troubleshooting-runbook.md`: Step-by-step guides for common failures
- `references/quality-checklist.md`: Weekly/monthly quality validation checklist
- `references/destination-health-matrix.md`: Expected SLA per destination, escalation contacts

## Related Skills

- **cdp-health-diagnostics**: For system-level performance issues, infrastructure health
- **cdp-metadata-explorer**: To understand schema, lineage, or data ownership questions
- **cdp-data-analyzer**: If quality issues reveal insights or require analysis
- **cdp-audience-finder**: If data quality affects audience sync eligibility

## Common Pitfalls to Avoid

1. **Ignoring context**: Always check if failure occurred during maintenance windows or known source delays
2. **Over-reacting to transient errors**: Network hiccups resolve on retry; only escalate if persistent
3. **Confusing fill rate with data quality**: A column can be 100% filled but contain garbage values
4. **Forgetting time zones**: Ensure date filters account for UTC vs. local time (especially critical for daily batch jobs)
5. **Missing historical context**: Compare quality metrics to 30/60/90-day baselines, not just yesterday
6. **Escalating without diagnostics**: Always have error_deep_dive output before contacting data engineering

## Key MCP Tools Reference

| Tool | Use Case | Output |
|------|----------|--------|
| `get_org_exists` | Validate org ID and get metadata | Org name, exists flag, table status |
| `get_available_services_by_org_id` | See which services have logs | List of active services (Uploader, Sender, etc) |
| `get_destination_health` | Check success/failure per destination | Success counts, failure counts, health ratio |
| `get_recent_dates` | Find dates with data | Recent dates that contain logs for org |
| `get_events_by_time_window` | Activity summary over date range | Event counts, types, service breakdown |
| `get_error_deep_dive` | Forensic root cause analysis | Error messages, destination IDs, retry history |
| `get_detailed_events` | Raw event payloads | Full request/response, timing, headers |
| `get_available_event_types` | See what event types exist | List of distinct event types in logs |
| `schema_discovery(overview)` | Understand data structure | Store types, column distribution |
| `feature_analysis(quality)` | Quality metrics per column | Fill rates, cardinality, PII flags |
| `time_travel(metrics:quality)` | Quality comparison over time | Before/after quality metrics |

## Example Workflows

### Workflow 1: Quick Health Check (5 minutes)
```
1. User: "Is our pipeline healthy?"
2. get_org_exists(org_id) → Validate
3. get_destination_health(org_id) → Get success rates
4. Check: Any destination <95% success?
   - YES → Get recent_dates, run get_events_by_time_window to narrow down
   - NO → Report all green, mention last successful sync
5. Output: Health dashboard with status summary
```

### Workflow 2: Data Quality Audit (15 minutes)
```
1. User: "Audit our data quality"
2. schema_discovery(overview) → Identify stores
3. feature_analysis(all_columns, quality+basic) → Get fill rates, cardinality
4. Compare: Against baseline from 30 days ago (time_travel)
5. Identify: Columns where metrics degraded >5%
6. Investigate: For each degraded column, find reason (source, schema change, business logic)
7. Output: Quality report with scores, trend analysis, remediation steps
```

### Workflow 3: Incident Investigation (20 minutes)
```
1. User: "Our sync failed yesterday"
2. get_org_exists(org_id) → Validate
3. get_recent_dates(org_id) → Find dates with failures
4. get_events_by_time_window(org_id, service, date_range) → Narrow down time window
5. get_error_deep_dive(org_id, service, incident_date) → Extract root cause details
6. get_detailed_events(org_id, service, failed_event_type, limit=10) → Get forensic payloads
7. Categorize: Transient vs. permanent error, affected destination, retry pattern
8. Output: Incident report with root cause, evidence, remediation actions, escalation
```

### Workflow 4: Quality Degradation Alert (10 minutes)
```
1. User: "Fill rate on [column] dropped 15%"
2. feature_analysis([column], quality) → Current metrics
3. time_travel(last_month, metrics:quality) → Historical fill rate
4. Compare: Identify inflection point (when drop occurred)
5. time_travel(narrower_window) → Pinpoint exact date
6. get_events_by_time_window(date) → Check for sync changes
7. Output: Quality timeline, likely cause (source/schema/sync change), investigation path
```
