# CDP Data Manager Troubleshooting Runbook

## Overview
Step-by-step troubleshooting guide for common CDP data issues, with diagnosis steps using MCP tools and resolution actions.

## SYNC FAILURES

### Issue: Authentication Errors

**Symptoms:**
- Connector shows "401 Unauthorized" or "Authentication Failed"
- Sync logs display auth token expired messages
- API requests rejected with credential errors
- Configuration shows valid credentials but still fails

**Diagnosis Steps:**

1. Verify credential freshness:
   - Check last credential update timestamp (should be recent)
   - Use `schema_discovery` overview operation to test API connectivity
   - Confirm API key/token hasn't reached expiration date
   - Review auth logs for failed token refresh attempts

2. Check endpoint accessibility:
   - Ping destination endpoint (if network allows)
   - Verify VPN/proxy configuration if applicable
   - Test connectivity using `health_check` tool
   - Confirm firewall rules allow outbound connections

3. Validate credential format:
   - Verify API key format matches expected pattern
   - Check for special characters or encoding issues
   - Confirm credentials stored in correct configuration field
   - Review API documentation for credential requirements

**Resolution Actions:**

- **Action 1:** Refresh/rotate credentials
  - Generate new API key from source system
  - Update CDP configuration with new key
  - Test sync on small data subset (1-hour window)
  - Monitor first few syncs for success

- **Action 2:** Reset auth token
  - Re-authenticate user/service account
  - Clear cached tokens and refresh
  - Update OAuth refresh tokens if applicable
  - Verify multi-factor authentication settings

- **Action 3:** Whitelist IP addresses
  - Add CDP platform IPs to source system whitelist
  - Coordinate with source system security team
  - Document IP ranges in incident ticket
  - Re-test connectivity after whitelist update

**Escalation Criteria:**
- Issue persists after credential refresh (24 hours)
- Authentication requires external system change
- Multiple sync windows affected
- Critical data flow impacted

---

### Issue: Rate Limiting

**Symptoms:**
- Sync logs show "429 Too Many Requests" errors
- Syncs fail intermittently, not consistently
- Error rate increases during peak hours
- Some batches complete, others throttled

**Diagnosis Steps:**

1. Check rate limit configuration:
   - Review connector rate limit settings (requests/minute)
   - Compare configured limits to API documentation
   - Check if rate limits changed in source API
   - Use `health_check` to see current API quota status

2. Analyze traffic patterns:
   - Use `get_events_by_time_window` to identify peak failure times
   - Calculate requests per minute during failures
   - Check for other syncs running simultaneously
   - Review batch size configuration (records per request)

3. Identify bottleneck:
   - Determine if limit applies to:
     - Total requests per minute across all endpoints
     - Requests per minute per endpoint
     - Concurrent connections allowed
   - Verify rate limit increases available (paid tier?)

**Resolution Actions:**

- **Action 1:** Reduce sync frequency or batch size
  - Lower requests/minute configuration
  - Reduce records per API request (smaller payloads)
  - Increase delay between requests
  - Test with reduced settings and monitor compliance

- **Action 2:** Optimize sync schedule
  - Shift syncs away from peak hours
  - Stagger syncs of multiple connectors
  - Schedule large syncs during off-peak windows
  - Use incremental syncs instead of full loads

- **Action 3:** Request rate limit increase
  - Contact source system support
  - Submit formal request with business justification
  - Provide current usage metrics (requests/minute)
  - Upgrade API tier if cost-justified

- **Action 4:** Implement retry logic
  - Configure exponential backoff (1s, 2s, 4s, 8s)
  - Set max retries to 3-5 attempts
  - Implement circuit breaker pattern
  - Monitor retry success rates

**Escalation Criteria:**
- Rate limiting unsolvable at current API tier
- Business requirements exceed available quota
- Requires contract/SLA renegotiation with source

---

### Issue: Payload/Schema Mismatch

**Symptoms:**
- Sync fails with "schema mismatch" or "invalid field type" errors
- Partial sync completion (some records succeed, others fail)
- Field mappings broken after source system update
- Type conversion errors (string vs numeric fields)

**Diagnosis Steps:**

1. Compare source and target schemas:
   - Use `schema_discovery` operation to inspect both sides
   - Pull target table schema from `schema_discovery` store operation
   - Get source API response schema documentation
   - Document field count and type differences

2. Identify schema changes:
   - Review source system release notes (recent updates?)
   - Check API documentation version (was it updated?)
   - Use `time_travel` to see when field changes occurred
   - Compare current vs previous sync success timestamps

3. Analyze failed records:
   - Use `get_detailed_events` to extract failed record samples
   - Identify pattern (specific field always fails, certain record type, etc.)
   - Compare failed vs successful records side-by-side
   - Note field values that cause conversion errors

**Resolution Actions:**

- **Action 1:** Update field mappings
  - Modify field type conversions in mapper
  - Add null handling for optional fields
  - Create transformation rules for renamed fields
  - Test on small sample before full sync

- **Action 2:** Handle new/removed fields
  - For new fields: Add to target schema, map from source
  - For removed fields: Deprecate gracefully (don't break sync)
  - For renamed fields: Create alias or transformation
  - Document all changes in data dictionary

- **Action 3:** Implement data cleansing
  - Add validation before inserting to target
  - Remove invalid characters from strings
  - Convert numeric strings to numbers
  - Handle special values (null, empty, zero)
  - Log cleansed data for audit trail

- **Action 4:** Update source API consumption
  - Use older API version if available (backwards compatibility)
  - Request extended support for deprecated fields
  - Migrate to new API format gradually
  - Coordinate timing with source system upgrade

**Escalation Criteria:**
- Schema changes require target table restructuring
- Breaking changes prevent backward compatibility
- Multiple critical fields affected
- Requires data migration/backfill

---

## DATA QUALITY DROPS

### Issue: Missing Fields

**Symptoms:**
- Null values appear in previously populated fields
- Fill rate drops from 95% to 50% (or lower) overnight
- Specific fields consistently empty
- No errors in sync logs, but data missing

**Diagnosis Steps:**

1. Verify data actually missing:
   - Use `feature_analysis` with metric_types=["basic"] to get fill rates
   - Compare fill rates by column across time periods
   - Check if missing in source or during transform
   - Run sample query to spot-check null counts

2. Trace missing data origin:
   - Use `time_travel` with include_statistics=true
   - Check when missing fields started appearing
   - Identify affected records (% of total)
   - Correlate with any sync/system changes

3. Identify root cause:
   - Is source API returning empty values?
   - Is field optional in source (was always sometimes null)?
   - Did field mapping break?
   - Did source system deprecate field?
   - Did field filtering exclude values?

**Resolution Actions:**

- **Action 1:** Check source data availability
  - Verify field still exists in source API
  - Confirm field has data in source system
  - Query source directly (if possible) to verify values
  - Check source system health/performance

- **Action 2:** Review field mapping configuration
  - Confirm mapping still valid (field names correct)
  - Check for transformation logic errors
  - Verify filtering rules aren't excluding values
  - Test mapping with sample record

- **Action 3:** Implement fallback/default values
  - Set sensible defaults for critical fields
  - Use secondary source if primary unavailable
  - Keep historical values if update missing
  - Document fallback rationale

- **Action 4:** Backfill missing data
  - Use previous snapshot if available
  - Query historical records if source maintains history
  - Manually populate critical records
  - Use `time_travel` to restore from earlier version

**Escalation Criteria:**
- Fill rate drops below business SLA threshold
- Critical fields affected
- Root cause unknown and unresolvable
- Requires source system changes

---

### Issue: Duplicate Records

**Symptoms:**
- Customer/user records appear multiple times
- Increasing duplicate count after each sync
- Same primary key values in database
- Aggregations show inflated metrics

**Diagnosis Steps:**

1. Quantify duplicates:
   - Use `feature_analysis` metric_types=["quality"] for cardinality
   - Run deduplication query to count duplicates
   - Identify duplicate detection method (ID vs email vs composite key)
   - Determine duplicate scope (% of records)

2. Identify duplicate pattern:
   - Use `get_detailed_events` to extract duplicate records
   - Compare duplicate records for differences
   - Identify trigger (time of day, sync number, specific source)
   - Check if duplicates tied to specific connector/sync

3. Trace duplicate origin:
   - Check source system (does source have duplicates?)
   - Review sync logs around duplicate appearance
   - Verify primary key/uniqueness constraint
   - Check if merge/dedup process is running

**Resolution Actions:**

- **Action 1:** Implement deduplication at sync
  - Add dedup logic in connector/mapper
  - Use "upsert" instead of "insert only" logic
  - Match on ID, email, or composite key
  - Update existing records instead of creating new ones

- **Action 2:** Enforce database constraints
  - Add unique constraint on primary key
  - Create unique index on email/username
  - Set database triggers to prevent duplicates
  - Update sync to handle constraint violations

- **Action 3:** Identify and merge duplicates
  - Find all duplicate sets in database
  - Determine canonical record (keep/merge)
  - Consolidate related data
  - Update foreign keys/references to merged record

- **Action 4:** Adjust sync logic
  - Add record existence check before insert
  - Implement change detection (skip if unchanged)
  - Use merge/match rules to identify same user
  - Clear duplicate window after merge

**Escalation Criteria:**
- Duplicates affect core business logic
- Deduplication requires complex matching rules
- Manual merge effort significant (>10K records)
- Requires data governance review

---

### Issue: Stale Data

**Symptoms:**
- Data not updating as expected
- Last update timestamps are old
- Customer information outdated
- Changes in source system not reflected

**Diagnosis Steps:**

1. Check sync frequency:
   - Review sync schedule configuration
   - Verify last sync timestamp (when did it run?)
   - Check if syncs are actually executing
   - Look for failed syncs in logs

2. Measure data freshness:
   - Use `feature_analysis` to get last_update timestamps
   - Calculate average age of records (current_time - last_updated)
   - Compare update frequency to configured schedule
   - Identify fields with different update times

3. Trace update failures:
   - Use `get_events_by_time_window` to check sync events
   - Review error logs for failed syncs
   - Check if partial syncs completing (some fields updated)
   - Verify source data actually changing

**Resolution Actions:**

- **Action 1:** Increase sync frequency
  - Review current schedule (daily, hourly, real-time?)
  - Increase to more frequent intervals
  - Calculate cost impact of more frequent syncs
  - Implement based on business freshness requirements

- **Action 2:** Implement incremental sync
  - Change from full refresh to incremental (delta sync)
  - Use "last_modified" timestamp to get only changes
  - Reduces data volume and sync time
  - Allows higher frequency without cost increase

- **Action 3:** Enable real-time/streaming sync
  - Use webhooks/event stream if source supports
  - Implement change data capture (CDC)
  - Process updates immediately when they occur
  - Ensure latency meets business requirements

- **Action 4:** Debug sync execution
  - Check if scheduled sync is running (cron logs)
  - Verify scheduler has proper permissions
  - Confirm network connectivity at sync time
  - Monitor for sync timeout issues

**Escalation Criteria:**
- Data freshness critical for business
- Requires architectural change (webhooks, CDC)
- Cost of high-frequency sync prohibitive
- Source system doesn't support real-time updates

---

## PIPELINE DELAYS

### Issue: Processing Bottlenecks

**Symptoms:**
- Data arrives but processing lags (hours or days behind)
- High CPU/memory usage during processing
- Queue buildup for transformation jobs
- Late completion of dependent pipelines

**Diagnosis Steps:**

1. Identify bottleneck location:
   - Measure latency at each pipeline stage (ingest → transform → load)
   - Use `query_builder` to analyze query performance
   - Check job execution times and resource usage
   - Identify slowest stage (e.g., 80% time spent in transformation)

2. Analyze performance metrics:
   - Monitor CPU, memory, disk I/O during processing
   - Check query execution time and data processed
   - Measure transformation time per record
   - Identify resource constraints (CPU maxed? Memory limited?)

3. Examine data volume:
   - Use `time_travel` to see record counts over time
   - Check if data volume increasing (more records to process)
   - Identify if specific data types are slow
   - Review complexity of transformations

**Resolution Actions:**

- **Action 1:** Optimize slowest pipeline stage
  - For SQL queries: Add indexes, optimize joins, use partitioning
  - For transformation: Batch processing, parallel execution, code optimization
  - For I/O: Compress data, use faster storage, implement caching
  - Profile bottleneck specifically and apply targeted fix

- **Action 2:** Increase compute resources
  - Add more CPU cores/memory to processing system
  - Distribute load across multiple workers/nodes
  - Scale horizontally (more parallel processes)
  - Monitor improvement and adjust as needed

- **Action 3:** Implement caching/memoization
  - Cache reference data lookups
  - Store intermediate results
  - Reuse computed values across runs
  - Invalidate cache on source changes

- **Action 4:** Reduce data volume
  - Filter unnecessary records early (push down filtering)
  - Archive/partition old data
  - Select only required columns
  - Use sampling for testing pipelines

**Escalation Criteria:**
- Processing delays impact downstream consumers
- SLA violations due to latency
- Requires infrastructure/architectural changes
- Cost of scaling exceeds budget

---

### Issue: Quota Exhaustion

**Symptoms:**
- "Quota exceeded" or "limit reached" errors in logs
- Processing stops mid-way through batch
- Nightly jobs fail at specific time
- BigQuery or API quota messages

**Diagnosis Steps:**

1. Identify quota type:
   - BigQuery: Slots, bytes scanned, concurrent queries
   - API: Requests per day/month, data transferred
   - Storage: Disk space, table limits
   - Compute: CPU minutes, concurrent executions

2. Measure quota usage:
   - Use `query_builder` with cost_analysis
   - Check BigQuery usage dashboard
   - Review API usage logs
   - Monitor real-time quota consumption

3. Correlate with failure:
   - Use `get_events_by_time_window` to find exact failure time
   - Check quota usage at that moment
   - Identify what triggered quota spike
   - Calculate if quota resets help (daily/monthly limits)

**Resolution Actions:**

- **Action 1:** Upgrade quota/plan
  - Purchase additional slots/capacity
  - Upgrade to higher tier service
  - Negotiate quota increase with provider
  - Implement flexible/on-demand pricing

- **Action 2:** Optimize resource consumption
  - Reduce data scanned in queries (use partitions, pruning)
  - Cache repeated queries
  - Reduce API requests (batch, aggregate)
  - Compress data, reduce storage

- **Action 3:** Implement quota management
  - Set quota alerts before exhaustion
  - Implement fair-use limits per job
  - Schedule large jobs during off-peak quota windows
  - Monitor hourly/daily usage trends

- **Action 4:** Stagger processing
  - Split large jobs into smaller batches
  - Spread processing over time (avoid spike)
  - Process incremental changes instead of full reloads
  - Prioritize critical jobs

**Escalation Criteria:**
- Quota upgrade required (business decision)
- Cost of expansion significant
- Requires pricing negotiation with provider
- Multiple critical services competing for quota

---

## DESTINATION ISSUES

### Issue: API Changes/Deprecations

**Symptoms:**
- Sync fails with "endpoint not found" (404) errors
- "Field no longer supported" or deprecation warnings
- Breaking changes in API response format
- Destination system forces API version upgrade

**Diagnosis Steps:**

1. Check API status:
   - Review destination API status page
   - Read API changelog/release notes (recent updates?)
   - Check for deprecation notices in API responses
   - Verify API endpoint still exists and accessible

2. Review integration configuration:
   - Check API version being used
   - Review API documentation for current version
   - Identify deprecated fields in use
   - Compare current vs legacy API differences

3. Test with latest API:
   - Create test request with new API version
   - Compare response format between versions
   - Identify fields added/removed/renamed
   - Assess compatibility impact

**Resolution Actions:**

- **Action 1:** Update to latest API version
  - Review breaking changes in upgrade guide
  - Update connector configuration to new version
  - Modify field mappings for API changes
  - Test thoroughly before production deployment

- **Action 2:** Implement API version fallback
  - Keep support for multiple API versions
  - Detect version from destination and adapt
  - Gracefully handle deprecated fields
  - Provide migration path for customers

- **Action 3:** Update field mappings
  - Remove mappings to deprecated fields
  - Add mappings for new fields if relevant
  - Rename fields if name changed
  - Use deprecation flags for old fields

- **Action 4:** Coordinate migration timeline
  - Contact destination support for extended timeline
  - Plan full migration before deprecation end date
  - Communicate timeline to stakeholders
  - Test extensively before cutover

**Escalation Criteria:**
- Deprecation timeline imminent (< 2 weeks)
- Breaking changes require significant rework
- Destination doesn't provide migration path
- Affects multiple customer integrations

---

### Issue: Credential Expiration

**Symptoms:**
- Syncs fail with "invalid credentials" errors
- Error starts at exact timestamp (credential expiry)
- Different failures for different credentials
- Sync succeeds in some systems, fails in others

**Diagnosis Steps:**

1. Check credential expiration:
   - Review credential storage for expiry timestamps
   - Calculate days until expiration
   - Identify which credential (API key, OAuth token, password)
   - Check if rotation schedule was followed

2. Verify credential refresh:
   - Check if credentials auto-refresh (OAuth)
   - Look for refresh token errors
   - Verify refresh schedule is working
   - Check for credential rotation in logs

3. Test credential validity:
   - Manually test credential with simple API call
   - Verify credential has appropriate permissions
   - Check if credential is revoked/disabled
   - Confirm credential format is correct

**Resolution Actions:**

- **Action 1:** Refresh/rotate credentials immediately
  - Generate new API key/token from destination
  - Update CDP configuration with new credential
  - Remove old/expired credential
  - Test sync immediately with new credential

- **Action 2:** Implement automatic credential refresh
  - Set up OAuth refresh token process (if supported)
  - Create credential rotation automation
  - Schedule refresh before expiration date
  - Send alerts 7 days before expiration

- **Action 3:** Use service accounts (if available)
  - Create service account instead of user credential
  - Service accounts don't expire (or expire much later)
  - Reduce manual rotation frequency
  - Improve security with service account controls

- **Action 4:** Monitor credential health
  - Create alerts for soon-to-expire credentials
  - Track credential age and rotation history
  - Audit credential permissions regularly
  - Document all credential rotation events

**Escalation Criteria:**
- Credential expiration broke customer sync
- No mechanism to auto-refresh exists
- Requires integration with credential management system
- Multiple syncs fail due to expired credentials

---

## GENERAL INVESTIGATION WORKFLOW

**Step 1: Confirm Issue Existence**
```
1. Use health_check to verify platform status
2. Run basic query with query_builder to check connectivity
3. Verify issue reproducibility with sample data
```

**Step 2: Diagnose Root Cause**
```
1. Check schema with schema_discovery
2. Analyze events with get_events_by_time_window
3. Review detailed failures with get_detailed_events
4. Use feature_analysis to check data quality metrics
5. Use time_travel to identify when problem started
```

**Step 3: Implement Resolution**
```
1. Apply targeted fix based on root cause
2. Test fix on small dataset (1-day window)
3. Monitor first few production runs for success
4. Gradually increase data volume if successful
5. Document issue and resolution for future reference
```

**Step 4: Prevent Recurrence**
```
1. Add monitoring/alerts for similar issues
2. Implement validation to catch issue early
3. Update documentation with preventive measures
4. Review and improve related processes
5. Share learnings with team
```

