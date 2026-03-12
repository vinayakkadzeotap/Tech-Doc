import type { Domain } from './types';

export const AI_ML_GENAI: Domain = {
  id: 'ai-ml-genai',
  title: 'AI/ML & GenAI',
  icon: 'Brain',
  color: '#a855f7',
  description:
    'AI layer powering natural language segmentation (Ada/Zoe), GenAI services, agentic workflows, MCP servers for code/feature analysis, and ML-driven attribute generation.',
  architectureNotes: `The AI/ML layer integrates at multiple levels of the platform:

Natural Language to Audience: zeotap-genai (Zoe API) is the core GenAI service. Users type natural language queries in the AI Chat UI, and Zoe translates them into audience segment definitions using Gemini LLMs. It fetches schema from canon, generates SQL, then converts SQL to Audience JSON via a multi-stage parser pipeline.

Agentic Platform: zeotap-agentic-server is a multi-agent orchestration system built on Google ADK (Agent Development Kit). The main orchestrator delegates to specialized sub-agents for data mapping, conversational analytics, catalog management, BigQuery operations, and Customer360 queries.

MCP Servers: Two MCP (Model Context Protocol) servers expose CDP capabilities to AI tools like Claude. zeotap-mcp provides feature analysis and AI/ML readiness assessment against BigQuery/Delta Lake. zeotap-MCP-Server enables Customer360 profile search via Unity APIs.

Research & Insights: zeotap-insight-agent (built on DeerFlow/LangGraph) provides multi-step research with web search, RAG retrieval, and output generation (reports, podcasts, presentations).

ML Pipelines: AI-Attributes manages Vertex AI pipelines for predictive attribute generation (churn scores, propensity). discover-nlp indexes catalog data into Elasticsearch for NLP-powered audience discovery.`,
  mermaidArch: `graph TB
    subgraph NLSegmentation["NL Segmentation"]
      ZOE["zeotap-genai<br/>Zoe API (FastAPI)"]
      GEMINI["Gemini 2.5<br/>Flash/Pro"]
    end

    subgraph AgenticPlatform["Agentic Platform"]
      ORCH["zeotap-agentic-server<br/>Main Orchestrator (ADK)"]
      SM["source_mapping<br/>Agent"]
      CA["conversational_analytics<br/>Agent"]
      CAT["catalog_explorer<br/>Agent"]
      C360A["customer360<br/>Agent"]
      CWD["chat_with_data<br/>Pipeline"]
    end

    subgraph MCPLayer["MCP Layer"]
      MCP1["zeotap-mcp<br/>Feature Analysis"]
      MCP2["zeotap-MCP-Server<br/>Customer360 Search"]
    end

    subgraph Research["Research & Insights"]
      INSIGHT["zeotap-insight-agent<br/>DeerFlow + LangGraph"]
    end

    subgraph MLPipelines["ML Pipelines"]
      AIATTR["AI-Attributes<br/>Vertex AI Pipelines"]
      NLP["discover-nlp<br/>ES + SpaCy"]
    end

    subgraph Platform["Platform Services"]
      CANON["canon<br/>Catalog API"]
      BQ["BigQuery"]
      UNITY["Unity API<br/>C360 + Auth"]
    end

    ZOE --> GEMINI
    ZOE --> CANON
    ZOE --> UNITY

    ORCH --> SM
    ORCH --> CA
    ORCH --> CAT
    ORCH --> C360A
    ORCH --> CWD
    CA --> BQ
    CAT --> CANON
    ORCH --> MCP1

    MCP1 --> BQ
    MCP1 --> CANON
    MCP2 --> UNITY

    INSIGHT --> MCP1

    AIATTR --> BQ
    AIATTR --> CANON
    NLP --> CANON`,
  mermaidDataFlow: `sequenceDiagram
    participant User as User (AI Chat UI)
    participant UI as unity-workspace
    participant Zoe as zeotap-genai (Zoe)
    participant Canon as canon (Catalog)
    participant LLM as Gemini 2.5
    participant AE as Audience Engine

    User->>UI: "Show me users who bought in last 7 days"
    UI->>Zoe: POST /api/message {orgId, prompt, token}
    Zoe->>Zoe: Validate token via Unity API
    Zoe->>Canon: Fetch catalog schema
    Canon-->>Zoe: Attribute definitions
    Zoe->>LLM: Generate SQL from NL + schema context
    LLM-->>Zoe: SQL WHERE clause
    Zoe->>Zoe: SQL Parser Pipeline
    Note over Zoe: SQL -> AST -> Field Mapping -> Table Categorization -> Audience JSON
    Zoe-->>UI: Audience JSON definition
    UI->>UI: Display in visual builder
    User->>UI: Save & Activate
    UI->>AE: Create audience segment`,
  repos: [
    {
      id: 'zeotap-genai',
      name: 'zeotap-genai',
      displayName: 'Zoe API (GenAI Service)',
      purpose:
        'Core GenAI service powering natural-language-to-audience-query conversion using Gemini LLMs. Fetches schema from canon, generates SQL, converts to Audience JSON.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '110M',
      keyModules: [
        { name: 'app.py', path: 'zoe/app.py', description: 'FastAPI entry point for the Zoe API' },
        { name: 'llm_response', path: 'zoe/src/bin/llm_response.py', description: 'Core LLM orchestration using Gemini (2.5-flash/pro) with Langfuse observability' },
        { name: 'sql_to_audience_query', path: 'zoe/src/services/sql_to_audience_query.py', description: 'Converts BigQuery SQL WHERE clauses to Audience JSON format' },
        { name: 'sql_parser', path: 'zoe/src/services/sql_parser.py', description: 'SQL parsing pipeline (AST, field mapping, table categorization)' },
        { name: 'schema_utils', path: 'zoe/src/utils/schema_utils.py', description: 'Schema analysis, catalog data fetching (LRU cache, capacity 150)' },
      ],
      dependencies: [
        { name: 'FastAPI', type: 'library', description: 'Web framework' },
        { name: 'Google GenAI', type: 'service', description: 'Gemini 2.5 Flash/Pro models' },
        { name: 'Langfuse', type: 'service', description: 'LLM observability' },
      ],
      interRepoLinks: ['canon', 'unity-workspace'],
    },
    {
      id: 'zeotap-agentic-server',
      name: 'zeotap-agentic-server',
      displayName: 'CDP Host Agent (ADK)',
      purpose:
        'Multi-agent orchestration system built on Google ADK + FastAPI. Main orchestrator delegates to specialized sub-agents for data mapping, analytics, catalog management, and more.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '9.7M',
      keyModules: [
        { name: 'zeotap_main_orchestrator', path: 'agents/zeotap_main_orchestrator/', description: 'Main LlmAgent (Gemini 2.5 Flash) delegating to sub-agents' },
        { name: 'source_mapping', path: 'agents/source_mapping/', description: 'Field mapping between source data and org catalog' },
        { name: 'conversational_analytics_agent', path: 'agents/conversational_analytics_agent/', description: 'Analytics queries on customer data via BigQuery' },
        { name: 'catalog_explorer', path: 'agents/catalog_explorer/', description: 'Catalog discovery and management' },
        { name: 'chat_with_data', path: 'chat_with_data/', description: 'Interactive data querying pipeline with planning/query/refinement agents' },
      ],
      dependencies: [
        { name: 'Google ADK', type: 'library', description: 'Agent Development Kit' },
        { name: 'FastAPI', type: 'library', description: 'Web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Agent state via SQLAlchemy' },
        { name: 'Redis', type: 'database', description: 'Caching' },
        { name: 'Streamlit', type: 'library', description: 'Management UI' },
      ],
      interRepoLinks: ['canon', 'zeotap-mcp'],
    },
    {
      id: 'zeotap-insight-agent',
      name: 'zeotap-insight-agent',
      displayName: 'Deep Research Agent',
      purpose:
        'Deep research agent built on DeerFlow + LangGraph — multi-step research with web search, RAG retrieval, and output generation (reports, podcasts, presentations).',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '15M',
      keyModules: [
        { name: 'graph/', path: 'src/graph/', description: 'LangGraph state machine — research workflow as DAG' },
        { name: 'tools/', path: 'src/tools/', description: 'Tavily web search, web crawling, code execution, RAG retrieval' },
        { name: 'rag/', path: 'src/rag/', description: 'Multiple vector DB backends — Milvus, Qdrant, RagFlow, Dify' },
        { name: 'podcast/', path: 'src/podcast/', description: 'Script writer + TTS for podcast generation' },
        { name: 'ppt/', path: 'src/ppt/', description: 'PowerPoint presentation generation' },
      ],
      dependencies: [
        { name: 'LangGraph', type: 'library', description: 'Agent workflow framework' },
        { name: 'FastAPI', type: 'library', description: 'API server' },
        { name: 'Tavily', type: 'service', description: 'Web search API' },
        { name: 'Milvus/Qdrant', type: 'database', description: 'Vector databases for RAG' },
      ],
      interRepoLinks: ['zeotap-mcp'],
    },
    {
      id: 'zeotap-mcp',
      name: 'zeotap-mcp',
      displayName: 'Feature Analysis MCP Server',
      purpose:
        'MCP server for data feature analysis and AI/ML readiness — schema discovery, query building, feature analysis, and CDF time-travel against BigQuery and Delta Lake.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '7.3M',
      keyModules: [
        { name: 'server.py', path: 'src/server.py', description: 'FastMCP server named "zeotap-feature-analysis"' },
        { name: 'discovery', path: 'src/tools/discovery.py', description: 'SchemaDiscoveryTool — discover data schemas' },
        { name: 'analysis', path: 'src/tools/analysis.py', description: 'FeatureAnalysisTool — AI/ML readiness assessment' },
        { name: 'cdf_time_travel', path: 'src/tools/cdf_time_travel.py', description: 'TimeTravelTool — CDF data versioning' },
      ],
      dependencies: [
        { name: 'FastMCP', type: 'library', description: 'MCP protocol server' },
        { name: 'BigQuery', type: 'cloud', description: 'Data analysis queries' },
        { name: 'Delta Lake', type: 'database', description: 'Time-travel data access' },
      ],
      interRepoLinks: ['canon', 'zeotap-agentic-server'],
    },
    {
      id: 'zeotap-mcp-server',
      name: 'zeotap-MCP-Server',
      displayName: 'Customer360 MCP Server',
      purpose:
        'MCP server for Customer360 profile search — allows AI tools (Claude, etc.) to search for individual customer profiles via Unity platform APIs.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '8.4M',
      keyModules: [
        { name: 'server.py', path: 'zeotap_mcp_server/server.py', description: 'MCP Server named "zeotap-customer360-mcp-server"' },
        { name: 'Customer360APIClient', path: 'zeotap_mcp_server/', description: 'HTTP client for Unity C360 APIs' },
        { name: 'identifiers', path: 'zeotap_mcp_server/identifiers.py', description: 'Dynamic identifier schema generation' },
      ],
      dependencies: [
        { name: 'MCP SDK', type: 'library', description: 'MCP protocol' },
        { name: 'Unity API', type: 'service', description: 'C360 profile data (unity-qa.zeotap.com)' },
      ],
      interRepoLinks: ['unity-workspace'],
    },
    {
      id: 'ai-attributes',
      name: 'AI-Attributes',
      displayName: 'AI Attributes (Vertex AI)',
      purpose:
        'FastAPI service for managing AI/ML pipelines on Vertex AI — handles pipeline creation, scheduling, monitoring, and smart attribute management for predictive modeling.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '23M',
      keyModules: [
        { name: 'main.py', path: 'main.py', description: 'FastAPI application entry point' },
        { name: 'utils.py', path: 'utils.py', description: 'Pipeline management (GCS, Vertex AI, scheduling, smart attributes)' },
        { name: 'churn_pipeline_*', path: '*.json', description: 'Pre-built ML pipeline configs (churn prediction)' },
      ],
      dependencies: [
        { name: 'FastAPI', type: 'library', description: 'Web framework' },
        { name: 'Vertex AI', type: 'cloud', description: 'ML pipeline execution' },
        { name: 'GCS', type: 'cloud', description: 'Model result storage' },
      ],
      interRepoLinks: ['cdp-server-workspace', 'canon'],
    },
    {
      id: 'discover-nlp',
      name: 'discover-nlp',
      displayName: 'NLP Discovery Service',
      purpose:
        'NLP-based data discovery — indexes catalog data into Elasticsearch and processes natural language queries via SpaCy to find relevant audience segments and attributes.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '103M',
      keyModules: [
        { name: 'discover_ingestion', path: 'discover_ingestion/', description: 'ETL pipeline to index catalog data into Elasticsearch' },
        { name: 'discover_consumption', path: 'discover_consumption/', description: 'NLP query processing (SpaCy noun extraction, ES retrieval)' },
        { name: 'nlp_processing', path: 'discover_consumption/nlp_processing/', description: 'SpaCy-based NLP (context analysis, verb processing)' },
        { name: 'es_retrieval', path: 'discover_consumption/es_retrieval/', description: 'Elasticsearch retrieval with threshold scoring' },
      ],
      dependencies: [
        { name: 'Elasticsearch', type: 'database', description: 'Catalog search index' },
        { name: 'SpaCy', type: 'library', description: 'NLP processing' },
        { name: 'RabbitMQ', type: 'queue', description: 'Async query processing' },
      ],
      interRepoLinks: ['canon'],
    },
  ],
};
