import type { Domain } from './types';

export const CDP_PLATFORM_UI: Domain = {
  id: 'cdp-platform-ui',
  title: 'CDP Platform & UI',
  icon: 'Layout',
  color: '#2563eb',
  description:
    'The user-facing platform — Angular-based NX monorepo powering the CDP dashboard, data management UI, configuration services, and Vega-based analytics visualizations.',
  architectureNotes: `The CDP Platform & UI layer consists of three tiers:

Frontend: Two Angular 17 + NX monorepos — unity-workspace (main CDP UI with audiences, C360, analytics, AI chat, symphony, predictive models) and unity-data (data sources, channels, studio, segments, RBAC). Both use Okta + Firebase auth, lazy-loaded feature modules, and a shared ZUI design system.

BFF Layer: cdp-server-workspace is a NestJS monorepo with three apps — cdp-server (analytics via BigQuery, audience reports, C360 events, audit logs), interact-server (real-time personalization with targeting rules), and predictive-model-server (ML model lifecycle via Vertex AI).

Supporting Services: canon is the single source of truth for all schema/metadata (catalog attributes, identities, calculated attributes). zen serves Vega-Lite chart specifications consumed by the analytics dashboards. cdp-commons and cdp-commons-go provide shared type definitions across Java and Go backend services.

Auth flows through Okta SSO with tokens validated at every layer. The UI calls the BFF, which fans out to canon for catalog, BigQuery for analytics, Profile API for C360 data, and Vertex AI for predictive models.`,
  mermaidArch: `graph TB
    subgraph Frontend["Frontend (Angular 17 + NX)"]
      UW["unity-workspace<br/>Main CDP UI"]
      UD["unity-data<br/>Data Management UI"]
      ZUI["ZUI Design System<br/>Shared Components"]
    end

    subgraph BFF["BFF Layer (NestJS)"]
      CDP["cdp-server<br/>Analytics, Reports, C360"]
      INT["interact-server<br/>Real-time Personalization"]
      PM["predictive-model-server<br/>ML Model Lifecycle"]
    end

    subgraph Services["Supporting Services"]
      CANON["canon<br/>Catalog & Schema (Play/Java)"]
      ZEN["zen<br/>Vega Chart Specs (Express)"]
      CC["cdp-commons<br/>Shared Java Types"]
      CCG["cdp-commons-go<br/>Shared Go Types"]
    end

    subgraph Data["Data Layer"]
      BQ["BigQuery<br/>Analytics Data"]
      PG["PostgreSQL<br/>Metadata"]
      REDIS["Redis<br/>Cache"]
      VAI["Vertex AI<br/>ML Pipelines"]
    end

    UW --> CDP
    UW --> INT
    UW --> PM
    UD --> CANON
    UW --> ZUI
    UD --> ZUI

    CDP --> BQ
    CDP --> PG
    CDP --> REDIS
    INT --> PG
    PM --> VAI

    CDP --> CANON
    UW --> ZEN`,
  mermaidDataFlow: `sequenceDiagram
    participant User as User Browser
    participant UI as unity-workspace
    participant BFF as cdp-server (NestJS)
    participant Canon as canon (Catalog)
    participant BQ as BigQuery
    participant Redis as Redis Cache

    User->>UI: Navigate to Analytics
    UI->>BFF: GET /analytics/dashboard
    BFF->>Redis: Check cache
    alt Cache miss
      BFF->>BQ: Execute parameterized SQL
      BQ-->>BFF: Query results
      BFF->>Redis: Cache results
    end
    BFF-->>UI: Chart data
    UI->>UI: Render Vega-Lite chart

    User->>UI: Open Audience Builder
    UI->>BFF: GET /catalog/attributes
    BFF->>Canon: /canon/api/v3/search
    Canon-->>BFF: Attribute schema
    BFF-->>UI: Attribute list
    User->>UI: Build segment rules
    UI->>BFF: POST /audiences/create`,
  repos: [
    {
      id: 'unity-workspace',
      name: 'unity-workspace',
      displayName: 'Unity Workspace (Main CDP UI)',
      purpose:
        'Primary Zeotap CDP user interface — Angular 17 + NX monorepo hosting audiences, C360, analytics, channels, symphony, AI chat, predictive models, and more.',
      language: 'TypeScript',
      languages: [
        { name: 'TypeScript', pct: 70 },
        { name: 'JavaScript', pct: 15 },
        { name: 'HTML', pct: 10 },
        { name: 'SCSS', pct: 5 },
      ],
      size: '168M',
      keyModules: [
        { name: 'projects/cdp', path: 'projects/cdp/', description: 'Main Angular app entry point (port 4200)' },
        { name: 'projects/audience', path: 'projects/audience/', description: 'Visual audience builder with predicate rules' },
        { name: 'projects/ai-chat', path: 'projects/ai-chat/', description: 'AI Chat UI calling zeotap-genai (Zoe API)' },
        { name: 'projects/analytics', path: 'projects/analytics/', description: 'Analytics dashboards with Vega-Lite charts' },
        { name: 'projects/customer360', path: 'projects/customer360/', description: 'Individual customer profile viewer' },
        { name: 'projects/symphony-v2', path: 'projects/symphony-v2/', description: 'Journey/workflow orchestration canvas' },
        { name: 'projects/zen-chart-lib', path: 'projects/zen-chart-lib/', description: 'Vega chart library consuming zen specs' },
        { name: 'projects/zui-lib', path: 'projects/zui-lib/', description: 'Shared design system components' },
      ],
      dependencies: [
        { name: 'Angular 17', type: 'library', description: 'Core framework' },
        { name: 'NX', type: 'library', description: 'Monorepo build system' },
        { name: 'Okta', type: 'service', description: 'SSO authentication' },
        { name: 'Firebase', type: 'service', description: 'Auth provider' },
        { name: 'Vega-Lite', type: 'library', description: 'Chart rendering' },
        { name: 'jsplumb', type: 'library', description: 'Flow diagrams for Symphony' },
      ],
      interRepoLinks: ['cdp-server-workspace', 'canon', 'zen', 'zeotap-genai'],
    },
    {
      id: 'unity-data',
      name: 'unity-data',
      displayName: 'Unity Data App',
      purpose:
        'Companion Angular + NX monorepo for the "Data" product — data sources, channels/destinations, studio, segments, RBAC user management.',
      language: 'TypeScript',
      languages: [
        { name: 'TypeScript', pct: 70 },
        { name: 'JavaScript', pct: 15 },
        { name: 'HTML', pct: 10 },
        { name: 'SCSS', pct: 5 },
      ],
      size: '110M',
      keyModules: [
        { name: 'projects/data', path: 'projects/data/', description: 'Main Angular app for data management' },
        { name: '+rbac', path: 'projects/data/+rbac/', description: 'RBAC user/org management' },
        { name: '+segments', path: 'projects/data/+segments/', description: 'ZAT segment builder' },
        { name: '+studio', path: 'projects/data/+studio/', description: 'Visual data flow studio (jsplumbtoolkit)' },
        { name: 'projects/core', path: 'projects/core/', description: 'Auth, catalog services, HTTP layer' },
      ],
      dependencies: [
        { name: 'Angular', type: 'library', description: 'Core framework' },
        { name: 'NX', type: 'library', description: 'Monorepo build system' },
        { name: 'Okta', type: 'service', description: 'SSO authentication' },
        { name: 'jsplumbtoolkit', type: 'library', description: 'Visual flow diagrams' },
      ],
      interRepoLinks: ['canon', 'cdp-server-workspace'],
    },
    {
      id: 'cdp-server-workspace',
      name: 'cdp-server-workspace',
      displayName: 'CDP App Server (BFF)',
      purpose:
        'NestJS monorepo with three backend apps — cdp-server (analytics/BigQuery, audience reports, C360), interact-server (real-time personalization), predictive-model-server (ML lifecycle via Vertex AI).',
      language: 'TypeScript',
      languages: [
        { name: 'TypeScript', pct: 95 },
        { name: 'Other', pct: 5 },
      ],
      size: '18M',
      keyModules: [
        { name: 'apps/cdp-server', path: 'apps/cdp-server/', description: 'Main BFF: analytics, audience reports, C360 events, audit logs' },
        { name: 'apps/interact-server', path: 'apps/interact-server/', description: 'Real-time personalization with targeting rules' },
        { name: 'apps/predictive-model-server', path: 'apps/predictive-model-server/', description: 'ML model lifecycle triggering Vertex AI pipelines' },
        { name: 'libs/common', path: 'libs/common/', description: 'Shared auth module (InternalAuthGuard), HTTP, cache' },
      ],
      dependencies: [
        { name: 'NestJS', type: 'library', description: 'Backend framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Metadata via TypeORM' },
        { name: 'BigQuery', type: 'cloud', description: 'Analytics queries' },
        { name: 'Redis', type: 'database', description: 'Response caching' },
        { name: 'Vertex AI', type: 'cloud', description: 'ML pipeline execution' },
      ],
      interRepoLinks: ['unity-workspace', 'canon', 'AI-Attributes'],
    },
    {
      id: 'canon',
      name: 'canon',
      displayName: 'Canon (Catalog Service)',
      purpose:
        'Single source of truth for all schema/metadata — manages catalog attributes, identities, datasources, calculated attributes, and composable catalog search across the entire platform.',
      language: 'Java',
      languages: [
        { name: 'Java', pct: 85 },
        { name: 'Scala', pct: 10 },
        { name: 'Other', pct: 5 },
      ],
      size: '170M',
      keyModules: [
        { name: 'CatalogController', path: 'app/controllers/', description: 'Catalog CRUD (v1/v2/v3) for attributes and calculated attributes' },
        { name: 'ComposableCatalogController', path: 'app/controllers/', description: 'Composable catalog search and attribute editing' },
        { name: 'IdentityController', path: 'app/controllers/', description: 'Identity metadata management (identifiers, graphs)' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Java web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Catalog database via Ebean ORM' },
        { name: 'Caffeine', type: 'library', description: 'In-memory caching' },
      ],
      interRepoLinks: ['unity-workspace', 'unity-data', 'zeotap-genai', 'zeotap-mcp', 'cdp-commons'],
    },
    {
      id: 'zen',
      name: 'zen',
      displayName: 'Zen (Chart Config Creator)',
      purpose:
        'Web app for creating and serving Vega-Lite chart specifications — Express.js backend + Angular frontend for visual chart configuration, powering CDP analytics dashboards.',
      language: 'JS/TS',
      languages: [
        { name: 'JavaScript', pct: 50 },
        { name: 'TypeScript', pct: 40 },
        { name: 'Other', pct: 10 },
      ],
      size: '22M',
      keyModules: [
        { name: 'server.js', path: 'server.js', description: 'Express.js API serving chart specs from /specs/' },
        { name: 'app/vega-chart-app', path: 'app/vega-chart-app/', description: 'Angular UI for visual Vega-Lite spec editing' },
        { name: 'specs/', path: 'specs/', description: 'Pre-built chart configurations (spec.json, params.json, schema.json)' },
        { name: 'queries/', path: 'queries/', description: 'BigQuery/SQL templates for chart data' },
      ],
      dependencies: [
        { name: 'Express.js', type: 'library', description: 'Backend API server' },
        { name: 'Vega-Lite', type: 'library', description: 'Chart specification format' },
        { name: 'Angular', type: 'library', description: 'Chart editor UI' },
      ],
      interRepoLinks: ['unity-workspace'],
    },
    {
      id: 'cdp-commons',
      name: 'cdp-commons',
      displayName: 'CDP Commons (Java)',
      purpose:
        'Shared Java library providing common data types, utilities, and service abstractions (predicate parser, catalog types, symphony types, Redis/RabbitMQ utilities) used across CDP backend services.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '5.7M',
      keyModules: [
        { name: 'predicateparserv2', path: 'src/main/java/com/zeotap/cdp/predicateparserv2/', description: 'Predicate/expression parser for audience segment rules' },
        { name: 'catalog', path: 'src/main/java/com/zeotap/cdp/catalog/', description: 'Catalog data structures' },
        { name: 'symphony', path: 'src/main/java/com/zeotap/cdp/symphony/', description: 'Symphony workflow types' },
        { name: 'redis', path: 'src/main/java/com/zeotap/cdp/redis/', description: 'Redis client utilities' },
        { name: 'rabbitmq', path: 'src/main/java/com/zeotap/cdp/rabbitmq/', description: 'RabbitMQ messaging utilities' },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Database driver' },
        { name: 'Redis', type: 'database', description: 'Client utilities' },
        { name: 'RabbitMQ', type: 'queue', description: 'Messaging utilities' },
      ],
      interRepoLinks: ['canon', 'cdp-server-workspace'],
    },
    {
      id: 'cdp-commons-go',
      name: 'cdp-commons-go',
      displayName: 'CDP Commons (Go)',
      purpose:
        'Go shared library providing common types and utilities for Go-based CDP microservices — catalog types, expression evaluation, workflow step config, HTTP and transformation utilities.',
      language: 'Go',
      languages: [{ name: 'Go', pct: 100 }],
      size: '680K',
      keyModules: [
        { name: 'types/catalog', path: 'types/catalog.go', description: 'Catalog data models' },
        { name: 'types/expr', path: 'types/expr.go', description: 'Expression evaluation engine' },
        { name: 'types/wf_stepconfig', path: 'types/wf_stepconfig.go', description: 'Workflow step configuration' },
        { name: 'utils/compiler', path: 'utils/compiler.go', description: 'Expression compiler' },
      ],
      dependencies: [
        { name: 'expr-lang/expr', type: 'library', description: 'Expression evaluation' },
        { name: 'Gin', type: 'library', description: 'HTTP framework' },
      ],
      interRepoLinks: ['symphony-wf-executor'],
    },
  ],
};
