import Card from '@/components/ui/Card';

const TERMS = [
  { term: 'UCID', definition: 'Unified Customer Identity — Zeotap\'s core identity concept. A single persistent ID that unifies all cross-device, cross-channel identifiers for one person.' },
  { term: 'CDP', definition: 'Customer Data Platform — A system that creates a persistent, unified customer database accessible to other systems for marketing, analytics, and operations.' },
  { term: 'Delta Lake', definition: 'An open-source storage layer on top of data lakes that provides ACID transactions, schema enforcement, and time-travel. Used by Zeotap for the Profile Store.' },
  { term: 'Apache Kafka', definition: 'A distributed event streaming platform used as Zeotap\'s backbone for real-time data ingestion and event processing.' },
  { term: 'CDAP', definition: 'Cloud Data Application Platform — Used for building and orchestrating data integration pipelines with low-code configuration.' },
  { term: 'Apache Beam', definition: 'A unified programming model for batch and streaming data processing pipelines. Used in Zeotap\'s ingestion layer.' },
  { term: 'Identity Graph', definition: 'A data structure that maps and links multiple identifiers (email, phone, device ID, cookie) belonging to the same person.' },
  { term: 'GKE', definition: 'Google Kubernetes Engine — The managed Kubernetes service on GCP that orchestrates all Zeotap microservices.' },
  { term: 'Vertex AI', definition: 'Google Cloud\'s ML platform used by Zeotap for training and serving models including propensity scoring and Zoe AI.' },
  { term: 'RAG', definition: 'Retrieval-Augmented Generation — An AI architecture where relevant context is retrieved from a knowledge base before generating a response. Powers Zoe.' },
  { term: 'S2S API', definition: 'Server-to-Server API — Zeotap\'s primary endpoint for receiving events directly from backend systems.' },
  { term: 'Segment / Audience', definition: 'A group of customer profiles that match a set of rules or conditions, used for targeted marketing activation.' },
  { term: 'Journey Canvas', definition: 'Zeotap\'s visual tool for building multi-step automated customer campaigns with triggers, conditions, and actions.' },
  { term: 'ArgoCD', definition: 'A GitOps-based continuous delivery tool for Kubernetes. Zeotap uses it for automated, safe production deployments.' },
  { term: 'Terraform', definition: 'An Infrastructure-as-Code tool used to provision and manage Zeotap\'s cloud infrastructure on GCP.' },
  { term: 'Prometheus', definition: 'An open-source monitoring system for collecting and querying metrics. Core part of Zeotap\'s observability stack.' },
  { term: 'OpenTelemetry', definition: 'A vendor-neutral standard for instrumenting, generating, collecting, and exporting telemetry data (traces, metrics, logs).' },
  { term: 'GDPR', definition: 'General Data Protection Regulation — EU regulation governing data privacy and protection that fundamentally shapes Zeotap\'s architecture.' },
  { term: 'Propensity Score', definition: 'An ML-generated probability that a customer will take a specific action (purchase, churn, etc.). Used for predictive targeting.' },
  { term: 'DMP', definition: 'Data Management Platform — An older technology that relied on third-party cookies. CDPs like Zeotap are the modern replacement.' },
  { term: 'Lookalike Modeling', definition: 'An ML technique that finds new users who share characteristics with an existing "seed" audience of known valuable customers.' },
  { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — Properties guaranteed by Delta Lake for profile store updates.' },
  { term: 'SSO', definition: 'Single Sign-On — Allows enterprise users to authenticate with their corporate credentials via SAML 2.0 or OIDC through Auth0.' },
  { term: 'RBAC', definition: 'Role-Based Access Control — Permission system that restricts system access based on user roles (admin, editor, viewer).' },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Glossary</h1>
        <p className="text-text-secondary text-sm mt-1">
          {TERMS.length} key terms and concepts used across Zeotap
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {TERMS.map((item) => (
          <Card key={item.term} className="!p-4">
            <h3 className="text-xs font-bold text-text-accent font-mono mb-1.5">{item.term}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{item.definition}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
