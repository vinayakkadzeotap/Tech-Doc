---
name: cdp-health-diagnostics
description: |
  Quick system status checks and deep error investigation for CDP pipelines. Call this FIRST when anything seems broken,
  when syncs are failing, or when data isn't flowing. Validates pipeline health across all services (Uploader, Sender, Exporter),
  identifies service failures and destination problems, and digs into root causes with forensic detail. Use triggers:
  "what's broken", "system status", "why did sync fail", "health check", "pipeline issues", "upload failed", "is the system working",
  "destination problems", "errors". Essential for ops teams and before escalating issues. Delivers health dashboard with green/yellow/red status.
---

# CDP Health Diagnostics

## Overview

CDP Health Diagnostics is your rapid-response tool for pipeline issues, service failures, and destination problems. Instead of blindly troubleshooting, this skill performs systematic health checks, identifies where failures are occurring, and drills down to root cause analysis with actual error messages and retry patterns.

**When to use this skill:**
- Something feels broken or data isn't flowing
- An audience upload failed
- You need to know if the system is working right now
- Destination sync errors are reported
- You want to compare success vs. failure rates
- You need forensic detail on a specific failure
- You're debugging a data pipeline issue
- You want to know which services are actually active

## How It Works

The skill follows a diagnostic cascade from system-level to failure-level detail:

### Phase 1: Global Health Status
Call `health_check()` with no parameters to get overall system status. This reveals if there are widespread infrastructure issues across all services (Uploader, Sender, Exporter, etc.).

**What it tells you:**
- Is the CDP operational overall?
- Are there known incidents or maintenance windows?
- What's the baseline health score?

### Phase 2: Organization Validation
Call `get_org_exists(org_id: "<your_org_id>")` to confirm:
- Your organization is properly provisioned
- The organization's data table exists in the system
- The org is registered in metadata

If this fails, the org hasn't been set up yet. If it succeeds, you get the official business name - use this for all subsequent calls.

### Phase 3: Service Inventory
Call `get_available_services_by_org_id(org_id: "<org_id>")` to discover which services have recorded activity:
- Uploader - data ingestion pipeline
- Sender - destination delivery
- Exporter - data export service
- Any other active services

**Why this matters**: Not all orgs use all services. This tells you what's relevant to monitor.

### Phase 4: Recent Data Window
Call `get_recent_dates(org_id: "<org_id>")` to find the 6 most recent dates with actual log data. This prevents you from querying empty date ranges.

### Phase 5: Destination Health Check
Call `get_destination_health(org_id: "<org_id>")` for your organization's upload health summary:
- successful_uploads: Count of completed deliveries
- failed_uploads: Count of failed deliveries
- success_rate: Percentage (0-100%)
- affected_destinations: Which destinations have issues

**Interpretation:**
- success_rate > 95%: Green - system is healthy
- success_rate 80-95%: Yellow - isolated issues, investigate
- success_rate < 80%: Red - systemic problem, drill deeper

### Phase 6: Deep Error Dive (If Issues Found)
If Phase 5 shows failures, call `get_error_deep_dive(org_id: "<org_id>", service_name: "<service>", date: "YYYY-MM-DD")`:
- error_messages: Actual error text from failures
- destination_ids: Which destinations failed
- retry_attempts: How many times system retried
- timestamp: When did each error occur

### Phase 7: Forensic Detail (If Still Unclear)
Call `get_detailed_events(org_id: "<org_id>", service_name: "<service>", event_type: "<type>")` to extract:
- Full event payloads with all metadata
- Comparison across multiple failures to find patterns
- Hidden fields in JSON that explain the issue

## Output Format

Present results as a health dashboard:

```
🏥 CDP HEALTH DASHBOARD

┌─────────────────────────────────────────────────────────────────┐
│ GLOBAL SYSTEM STATUS                                            │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Overall: OPERATIONAL                                         │
│ Infrastructure: Healthy                                         │
│ Last Check: 2 minutes ago                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ORGANIZATION: Acme Marketing Inc (org_12345)                    │
├─────────────────────────────────────────────────────────────────┤
│ Status: ✅ PROVISIONED                                          │
│ Active Services: 3                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SERVICE HEALTH                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Uploader        ✅ ACTIVE     Last activity: 2024-03-02         │
│ Sender          ✅ ACTIVE     Last activity: 2024-03-02         │
│ Exporter        🟡 ACTIVE     Last activity: 2024-02-28         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ DESTINATION DELIVERY (Last 7 days)                              │
├─────────────────────────────────────────────────────────────────┤
│ Successful: 4,523 uploads                                       │
│ Failed:       127 uploads                                       │
│ Success Rate: 97.3% ✅                                          │
│                                                                 │
│ Problem Destinations:                                           │
│  - Facebook Ads (118 failures) - Auth token expired             │
│  - Google Analytics (9 failures) - Rate limit exceeded          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RECENT ISSUES (if any)                                          │
├─────────────────────────────────────────────────────────────────┤
│ [2024-03-02 14:32] Destination: Facebook Ads                   │
│ Error: "401 Unauthorized - Token expired"                       │
│ Retries: 3 (all failed)                                         │
│ Impact: 47 audience uploads blocked                             │
│                                                                 │
│ RECOMMENDATION: Re-authenticate Facebook Ads connector          │
└─────────────────────────────────────────────────────────────────┘
```

## Example Interactions

### User says: "The system is broken"

You should:
1. Call `health_check()` - confirm if it's system-wide
2. If system is up, ask for org_id
3. Call `get_org_exists(org_id)` - validate org
4. Call `get_available_services_by_org_id(org_id)` - what's active
5. Call `get_recent_dates(org_id)` - get data window
6. Call `get_destination_health(org_id)` - health summary
7. If failures > 5%, call `get_error_deep_dive()` for root cause
8. Present dashboard with actionable next steps

### User says: "Why did my upload fail?"

You should:
1. Call `health_check()` - rule out global issues
2. Ask for org_id and optionally which upload/date
3. Call `get_org_exists(org_id)` - validate
4. Call `get_recent_dates(org_id)` - find relevant dates
5. Call `get_destination_health(org_id, date)` - show failures on that day
6. Call `get_error_deep_dive(org_id, "Sender", date)` - get error messages
7. Extract error text and destination ID
8. If still unclear, call `get_detailed_events()` for full payload
9. Present: "Your upload failed because [specific error]. Here's how to fix it."

### User says: "Is the system working?"

You should:
1. Call `health_check()` - global status
2. Ask for org_id
3. Call `get_org_exists(org_id)` - confirm provisioning
4. Call `get_available_services_by_org_id(org_id)` - list active services
5. Call `get_destination_health(org_id)` - last 7 days health
6. Present green/yellow/red dashboard with confidence assessment

## Key Concepts

**Health Check**: Quick pulse on entire system infrastructure. If this fails, it's a platform-wide issue.

**Org Validation**: Confirms your organization is properly set up. Required for all subsequent diagnostics.

**Service Active**: Service has logged events in the past period. If a service is inactive, it may not be configured for your org.

**Success Rate**: Percentage of destination uploads that completed without errors. >95% is healthy.

**Destination**: External system (Facebook, Google, etc.) receiving data from your CDP.

**Error Deep Dive**: Actual error messages and metadata explaining why deliveries failed.

**Retry Attempts**: How many times the system automatically tried to fix the failure. High retries = transient issue. Zero retries = permanent problem.

## Troubleshooting Playbook

### Issue: "Only 70% of uploads succeed"
```
1. Run get_destination_health() - which destinations are failing?
2. Run get_error_deep_dive() for each failing destination
3. Common causes:
   - Auth tokens expired (re-authenticate)
   - Rate limits hit (reduce batch size)
   - Data format mismatch (validate schema)
   - Network timeouts (increase timeout, retry)
```

### Issue: "Data hasn't synced in 3 days"
```
1. Run get_available_services_by_org_id() - is Uploader active?
2. Run get_recent_dates() - what dates have logs?
3. If no logs: ingest pipeline stopped, check Uploader errors
4. If logs but no sends: Sender service may be blocked
5. Run get_error_deep_dive() on last active date
```

### Issue: "One destination keeps failing"
```
1. Run get_destination_health() - isolate destination
2. Run get_error_deep_dive(service_name: "Sender", date: recent_date)
3. Filter results for that destination_id
4. Look for pattern in error messages
5. Common fixes: re-auth, update credentials, check account status
```

## Tips for Operations Teams

1. **Run health checks daily**: Catch issues before they impact campaigns
2. **Monitor destination success rates**: Keep above 95%
3. **Track error patterns**: Repeated auth errors suggest credential rotation needed
4. **Check service recency**: If a service is 2+ days old, it may be stuck
5. **Use forensic detail sparingly**: Full event payloads are useful for debug, not for monitoring
6. **Set alerts**: Success rate drops below 90% → escalate to engineering
7. **Document errors**: Keep a log of common errors and resolutions

## Related Skills

- **cdp-metadata-explorer**: If you need to verify data schemas after a health issue
- **cdp-marketing-suite**: Route back here for other CDP needs
- **cdp-data-manager**: Advanced data pipeline management

---

*Last Updated: 2026-03-05*
