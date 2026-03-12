import type { Domain } from './types';

export const DATA_PLATFORM: Domain = {
  id: 'data-platform',
  title: 'Data Platform (DaaP)',
  icon: 'Database',
  color: '#3b82f6',
  description:
    'The core data processing backbone — handles ingestion, transformation, segment computation, and raw data export pipelines using Apache Beam, Dataflow, and BigQuery.',
  architectureNotes: `The Data Platform operates in 5 layers:

Layer 1 — Ingestion: daap/transform handles first-party data parsing (CSV/JSON to Avro/Parquet). daap-3P-ingestion handles third-party partner data with ID validation pipelines. GoogleCloudUtils provides Apache Beam/Dataflow pipelines for GCS, BigQuery, Snowflake, and PubSub data movement.

Layer 2 — Enrichment: daap-external libraries enrich profiles with identity resolution (Aerospike-based ZuID generation), IP-to-location lookup, and app classification. Pluggable via IEnricherDependency interface.

Layer 3 — Merge & Profile Store: Multiple merge strategies (dp-merge, multidp-merge, multi-profile-merge, apps-merge, telco-merge) create unified user profiles stored in Delta Lake format.

Layer 4 — Segmentation: daap-segment-library translates segment definitions (predicate trees of AND/OR/IAND clauses) into executable SQL. daap-segment-api provides REST CRUD with AWS SWF workflow orchestration for export tasks.

Layer 5 — Export: datawave (RDEP) exports raw data via a DSL-driven pipeline using the ZeoFlow Free Monad pattern (loadSources → runTransformations → writeToSinks) with configurable compliance policies. daap/bireporting generates BI analytics reports to MySQL.

All batch processing uses Spark 2.4 + Scala 2.11 with Delta Lake for the Profile Store.`,
  mermaidArch: `graph TB
    subgraph Ingestion["Layer 1: Ingestion"]
      DAAP_T["daap/transform<br/>1P Data (CSV/JSON→Avro)"]
      DAAP_3P["daap-3P-ingestion<br/>3P Partner Data"]
      GCU["GoogleCloudUtils<br/>Beam/Dataflow Pipelines"]
    end

    subgraph Enrichment["Layer 2: Enrichment"]
      AE["daap/attribute-enricher<br/>Identity + Location + App"]
      AERO["Aerospike<br/>ID Store"]
    end

    subgraph Merge["Layer 3: Merge"]
      DPM["dp-merge<br/>Single DP Merge"]
      MDPM["multidp-merge<br/>Cross-DP Merge"]
      MPM["multi-profile-merge<br/>Profile Unification"]
    end

    subgraph Storage["Profile Store"]
      DELTA["Delta Lake<br/>Unified Profiles"]
      BQ["BigQuery<br/>Analytics Data"]
    end

    subgraph Segmentation["Layer 4: Segmentation"]
      SLIB["daap-segment-library<br/>Predicate→SQL Engine"]
      SAPI["daap-segment-api<br/>Segment REST API"]
    end

    subgraph Export["Layer 5: Export"]
      DW["datawave (RDEP)<br/>Raw Data Exports"]
      BIR["daap/bireporting<br/>BI Reports"]
      BP["beam-pipeline<br/>BQ Analytics"]
    end

    DAAP_T --> AE
    DAAP_3P --> AE
    GCU --> AE
    AE --> AERO
    AE --> DPM
    DPM --> MDPM
    MDPM --> MPM
    MPM --> DELTA
    DELTA --> SLIB
    SLIB --> SAPI
    DELTA --> DW
    DELTA --> BQ
    BQ --> BP
    DELTA --> BIR`,
  mermaidDataFlow: `sequenceDiagram
    participant Raw as Raw Data Source
    participant Transform as daap/transform
    participant Enrich as attribute-enricher
    participant Merge as dp-merge → multi-merge
    participant Delta as Profile Store (Delta Lake)
    participant SegAPI as daap-segment-api
    participant SegLib as segment-library
    participant RDEP as datawave (RDEP)
    participant Dest as Export Destination

    Raw->>Transform: CSV/JSON/Parquet files
    Transform->>Transform: Schema mapping + validation
    Transform->>Enrich: Standardized Avro records
    Enrich->>Enrich: Identity resolution (Aerospike)
    Enrich->>Enrich: Location enrichment (IP lookup)
    Enrich->>Merge: Enriched profiles
    Merge->>Delta: Unified profiles

    Note over SegAPI,SegLib: Segmentation Path
    SegAPI->>SegLib: Segment definition JSON
    SegLib->>SegLib: PredicateParser → clause tree
    SegLib->>SegLib: getExportQuery() → SQL
    SegLib->>Delta: Execute SQL query
    Delta-->>SegAPI: Segment export data

    Note over RDEP,Dest: Raw Export Path
    RDEP->>RDEP: Fetch DSL config
    RDEP->>Delta: Read vertex/edge snapshots
    RDEP->>RDEP: Apply policies + filters
    RDEP->>Dest: GCS/S3/SFTP/RabbitMQ`,
  repos: [
    {
      id: 'daap',
      name: 'daap',
      displayName: 'DaaP Core Platform',
      purpose:
        'Foundational data platform mono-repo — shared libraries for ingestion encoding/transformation, enrichment services (identity, location, app), and 14 Spark processing jobs covering transform, merge, BI reporting, and GDPR.',
      language: 'Java',
      languages: [
        { name: 'Java', pct: 55 },
        { name: 'Scala', pct: 40 },
        { name: 'Other', pct: 5 },
      ],
      size: '225M',
      keyModules: [
        { name: 'daap-library/transform-encoder', path: 'daap-library/transform-encoder/', description: 'RecordParser, JsonAvroRecordParser — raw CSV/JSON to Avro' },
        { name: 'daap-external/daap-identity-store', path: 'daap-external/daap-identity-store/', description: 'IdStoreExecutor, AerospikeIdStoreClient — identity resolution + ZuID generation' },
        { name: 'daap-processing/transform', path: 'daap-processing/transform/', description: 'SparkJsonTransformJob — schema mapping, regex filtering, validation' },
        { name: 'daap-processing/dp-merge', path: 'daap-processing/dp-merge/', description: 'Single data partner merge (fieldType.json-driven)' },
        { name: 'daap-processing/multidp-merge', path: 'daap-processing/multidp-merge/', description: 'Cross-data-partner profile merge' },
        { name: 'daap-processing/bireporting', path: 'daap-processing/bireporting/', description: 'BI reports → MySQL (static, dynamic, interest, apps, DQ reports)' },
        { name: 'daap-processing/gdprprocessor', path: 'daap-processing/gdprprocessor/', description: 'GDPR data deletion processing' },
      ],
      dependencies: [
        { name: 'Apache Spark 2.4', type: 'library', description: 'Batch processing framework' },
        { name: 'Aerospike', type: 'database', description: 'Identity store for ZuID generation' },
        { name: 'GCS', type: 'cloud', description: 'Data storage' },
        { name: 'MySQL', type: 'database', description: 'BI report export' },
        { name: 'Elasticsearch', type: 'database', description: 'Profile indexing (Jest client)' },
      ],
      interRepoLinks: ['daap-3P-ingestion', 'daap-segment-library', 'zeocore-idu-microservices'],
    },
    {
      id: 'daap-segment-library',
      name: 'daap-segment-library',
      displayName: 'Segment Query & Export Library',
      purpose:
        'Translates segment definitions (predicate trees of AND/OR/IAND clauses) into executable SQL. Includes Spark jobs for segment export from Delta Lake and revenue attribution analytics.',
      language: 'Java',
      languages: [
        { name: 'Java', pct: 50 },
        { name: 'Scala', pct: 50 },
      ],
      size: '104M',
      keyModules: [
        { name: 'PredicateParser', path: 'daap-segment-query-library/', description: 'JSON → clause tree (StaticLeaf, DynamicLeaf, AppsLeaf)' },
        { name: 'SingleSegmentQuery', path: 'daap-segment-query-library/', description: 'getCountQuery() / getExportQuery() — predicate tree → SQL' },
        { name: 'export/Driver', path: 'daap-segment-library-processing/', description: 'Reads Delta Lake profile store, generates + executes SQL, writes exports' },
        { name: 'RevenueAttributionDriver', path: 'daap-segment-library-processing/', description: 'Revenue attribution analytics pipeline' },
      ],
      dependencies: [
        { name: 'Spark SQL', type: 'library', description: 'Query execution engine' },
        { name: 'Delta Lake', type: 'database', description: 'Profile store format' },
        { name: 'Presto', type: 'database', description: 'SQL execution via JDBC' },
      ],
      interRepoLinks: ['daap-segment-api', 'daap'],
    },
    {
      id: 'daap-segment-api',
      name: 'daap-segment-api',
      displayName: 'Segment API Service',
      purpose:
        'Play Framework REST API for segment CRUD, estimation, export management, revenue attribution, and taxonomy metadata. Orchestrates exports via AWS SWF workflows.',
      language: 'Scala',
      languages: [
        { name: 'Java', pct: 45 },
        { name: 'Scala', pct: 55 },
      ],
      size: '18M',
      keyModules: [
        { name: 'SegmentsController', path: 'app/controllers/', description: 'Segment CRUD, export, revenue attribution REST endpoints' },
        { name: 'MetaController', path: 'app/controllers/', description: 'Taxonomy, countries, dimension stats' },
        { name: 'jsonToEBeanQueryBuilder', path: 'app/', description: 'JSON filter → EBean ORM queries' },
        { name: 'IWorkflowService', path: 'app/services/', description: 'AWS SWF workflow orchestration for export tasks' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Segment metadata via Ebean ORM' },
        { name: 'Elasticsearch', type: 'database', description: 'Catalog/profile store queries' },
        { name: 'AWS SWF', type: 'cloud', description: 'Workflow orchestration for exports' },
      ],
      interRepoLinks: ['daap-segment-library', 'clarkkent-the-connect'],
    },
    {
      id: 'daap-3p-ingestion',
      name: 'daap-3P-ingestion',
      displayName: '3P Data Ingestion',
      purpose:
        'Handles third-party data partner ingestion — transform, preprocess, attribute enrichment, and ID validation pipeline (blacklist, length, regex, value validators) with BigQuery integration.',
      language: 'Java',
      languages: [
        { name: 'Java', pct: 60 },
        { name: 'Scala', pct: 40 },
      ],
      size: '30M',
      keyModules: [
        { name: 'transform', path: 'profile-ingestion/transform/', description: '3P data transformation layer' },
        { name: 'component-extraction-layer', path: 'profile-ingestion/component-extraction-layer/', description: 'ID validation pipeline (BlacklistValidator, LengthValidator, RegexValidator)' },
        { name: 'attribute-enricher', path: 'profile-ingestion/attribute-enricher/', description: 'Relational data source enrichment with config service integration' },
        { name: 'tools/BigQueryClient', path: 'profile-ingestion/tools/', description: 'BigQuery integration for data access' },
      ],
      dependencies: [
        { name: 'Apache Spark', type: 'library', description: 'Batch processing' },
        { name: 'BigQuery', type: 'cloud', description: 'Data queries' },
        { name: 'GCS', type: 'cloud', description: 'Data storage' },
        { name: 'MySQL/PostgreSQL', type: 'database', description: 'Via JDBC' },
      ],
      interRepoLinks: ['daap'],
    },
    {
      id: 'datawave',
      name: 'datawave',
      displayName: 'Datawave (RDEP)',
      purpose:
        'Raw Data Exports Pipeline — reads identity graph snapshots from Delta Lake, applies configurable compliance policies and filters via DSL, exports to GCS/S3/SFTP/RabbitMQ. Uses ZeoFlow Free Monad pattern.',
      language: 'Scala',
      languages: [
        { name: 'Scala', pct: 70 },
        { name: 'Java', pct: 30 },
      ],
      size: '150M',
      keyModules: [
        { name: 'rdep-exports/Driver', path: 'datawave-processing/rdep-exports/', description: 'Main RDEP engine — fetches DSL config, determines job type, dispatches processing' },
        { name: 'ExportDSL', path: 'datawave-processing/rdep-exports/', description: 'ZeoFlow Free Monad: loadSources → runTransformations → writeToSinks' },
        { name: 'action-registry', path: 'datawave-library/action-registry/', description: 'Policy engine — SQLAction, SchemaAction, RowFilterAction, ComplianceAction' },
        { name: 'data-standardiser-core', path: 'datawave-library/data-standardiser-core/', description: 'Data quality operations (trim, case, regex, split, substitute)' },
        { name: 'RawDataExport', path: 'datawave-processing/raw-data-export/', description: 'Reads Delta Lake vertex/edge snapshots, applies transforms + opt-out, writes exports' },
      ],
      dependencies: [
        { name: 'Spark 2.4', type: 'library', description: 'Batch processing' },
        { name: 'Delta Lake', type: 'database', description: 'Vertex/edge snapshot storage' },
        { name: 'ZeoFlow', type: 'library', description: 'Free Monad DSL framework' },
        { name: 'RabbitMQ', type: 'queue', description: 'Export publishing' },
        { name: 'GCS/S3/SFTP', type: 'cloud', description: 'Export destinations' },
      ],
      interRepoLinks: ['zeoflow', 'data-io', 'daap'],
    },
    {
      id: 'beam-pipeline',
      name: 'beam-pipeline',
      displayName: 'Beam Pipeline',
      purpose:
        'Spark + BigQuery data pipeline for analytics processing using the BigQuery Spark connector with functional programming via Cats.',
      language: 'Scala',
      languages: [
        { name: 'Scala', pct: 80 },
        { name: 'Java', pct: 20 },
      ],
      size: '12M',
      keyModules: [
        { name: 'Main pipeline', path: 'src/', description: 'Spark jobs reading/writing BigQuery with cloud-storage-utils' },
      ],
      dependencies: [
        { name: 'Spark 2.4', type: 'library', description: 'Processing framework' },
        { name: 'BigQuery', type: 'cloud', description: 'Via Spark connector' },
        { name: 'Cats', type: 'library', description: 'Functional Scala (Free Monad)' },
        { name: 'MySQL/PostgreSQL', type: 'database', description: 'Database connectivity' },
      ],
      interRepoLinks: ['data-io'],
    },
    {
      id: 'google-cloud-utils',
      name: 'GoogleCloudUtils',
      displayName: 'GCP Dataflow Pipelines',
      purpose:
        'Apache Beam/Dataflow pipelines for data movement — GCS→PubSub, BQ→PubSub, BQ→S3, BQ→Bigtable, Snowflake→PubSub. Primary ingestion gateway with event standardization, hyper-batching, and Symphony integration.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '1.8M',
      keyModules: [
        { name: 'GCSToPubSubDataflowPipeline', path: 'beam/pipelines/', description: 'GCS file parsing (CSV/JSON/Parquet) → event standardization → PubSub' },
        { name: 'BQToPubsubDataflowPipeline', path: 'beam/pipelines/', description: 'BigQuery query results → JSON → PubSub' },
        { name: 'RTCABackfillPipeline', path: 'beam/pipelines/', description: 'Real-Time Composable Audience backfill → Bigtable' },
        { name: 'EventStandardizationTransform', path: 'transformations/', description: 'Event standardization using CDAP Wrangler recipes' },
        { name: 'FlexRunner', path: 'beam/', description: 'CLI entry point dispatching by --pipelineType argument' },
      ],
      dependencies: [
        { name: 'Apache Beam 2.52', type: 'library', description: 'Pipeline framework' },
        { name: 'Dataflow', type: 'cloud', description: 'GCP execution engine' },
        { name: 'BigQuery', type: 'cloud', description: 'Source/sink' },
        { name: 'PubSub', type: 'queue', description: 'Message publishing' },
        { name: 'Bigtable', type: 'database', description: 'RTCA storage' },
        { name: 'Snowflake', type: 'cloud', description: 'Source connector' },
        { name: 'Redis', type: 'database', description: 'Caching' },
      ],
      interRepoLinks: ['cdp-commons', 'cdp-server-workspace'],
    },
  ],
};
