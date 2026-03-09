'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface Node {
  id: string;
  label: string;
  icon: string;
  layer: string;
  description: string;
  tech: string[];
  x: number;
  y: number;
  color: string;
}

const LAYERS = [
  { id: 'collect', label: 'Collect', color: '#3b82f6', y: 0 },
  { id: 'ingest', label: 'Ingest & Process', color: '#8b5cf6', y: 1 },
  { id: 'store', label: 'Store & Unify', color: '#a855f7', y: 2 },
  { id: 'intelligence', label: 'Intelligence', color: '#ec4899', y: 3 },
  { id: 'activate', label: 'Activate', color: '#f59e0b', y: 4 },
  { id: 'platform', label: 'Platform Services', color: '#10b981', y: 5 },
];

const NODES: Node[] = [
  // Collect layer
  { id: 'web-sdk', label: 'Web SDK', icon: '🌐', layer: 'collect', description: 'JavaScript tag for web event capture', tech: ['JavaScript', 'TCF 2.2'], x: 0, y: 0, color: '#3b82f6' },
  { id: 'mobile-sdk', label: 'Mobile SDK', icon: '📱', layer: 'collect', description: 'iOS and Android SDKs', tech: ['Swift', 'Kotlin'], x: 1, y: 0, color: '#3b82f6' },
  { id: 's2s-api', label: 'S2S API', icon: '🔌', layer: 'collect', description: 'Server-to-server REST API', tech: ['REST', 'gRPC'], x: 2, y: 0, color: '#3b82f6' },
  { id: 'integr8', label: 'Integr8', icon: '🔗', layer: 'collect', description: '150+ pre-built connectors', tech: ['CDAP', 'Batch'], x: 3, y: 0, color: '#3b82f6' },

  // Ingest layer
  { id: 'kafka', label: 'Kafka', icon: '📨', layer: 'ingest', description: 'Real-time event streaming backbone', tech: ['Apache Kafka', 'Avro'], x: 0, y: 1, color: '#8b5cf6' },
  { id: 'beam', label: 'Apache Beam', icon: '⚡', layer: 'ingest', description: 'Unified batch/stream processing', tech: ['Beam', 'Dataflow'], x: 1, y: 1, color: '#8b5cf6' },
  { id: 'spark', label: 'Spark', icon: '🔥', layer: 'ingest', description: 'Large-scale data processing', tech: ['Apache Spark', 'PySpark'], x: 2, y: 1, color: '#8b5cf6' },
  { id: 'cdap', label: 'CDAP', icon: '🔧', layer: 'ingest', description: 'Pipeline orchestration', tech: ['CDAP', 'Airflow'], x: 3, y: 1, color: '#8b5cf6' },

  // Store layer
  { id: 'identity', label: 'Identity Graph', icon: '🔗', layer: 'store', description: 'UCID resolution engine', tech: ['Aerospike', 'Scylla'], x: 0, y: 2, color: '#a855f7' },
  { id: 'delta-lake', label: 'Delta Lake', icon: '💾', layer: 'store', description: 'Profile store with ACID', tech: ['Delta Lake', 'GCS'], x: 1, y: 2, color: '#a855f7' },
  { id: 'bigquery', label: 'BigQuery', icon: '📊', layer: 'store', description: 'Analytics warehouse', tech: ['BigQuery', 'SQL'], x: 2, y: 2, color: '#a855f7' },

  // Intelligence layer
  { id: 'audience', label: 'Audience Engine', icon: '🎯', layer: 'intelligence', description: 'Real-time segmentation', tech: ['Rules Engine', 'Streaming'], x: 0, y: 3, color: '#ec4899' },
  { id: 'ada', label: 'Ada AI', icon: '🤖', layer: 'intelligence', description: 'AI copilot (RAG + LLM)', tech: ['Vertex AI', 'RAG'], x: 1, y: 3, color: '#ec4899' },
  { id: 'ml', label: 'ML Platform', icon: '🧠', layer: 'intelligence', description: 'Propensity & lookalike models', tech: ['Vertex AI', 'TensorFlow'], x: 2, y: 3, color: '#ec4899' },
  { id: 'journeys', label: 'Journey Engine', icon: '🗺️', layer: 'intelligence', description: 'Multi-step orchestration', tech: ['State Machine', 'Kafka'], x: 3, y: 3, color: '#ec4899' },

  // Activate layer
  { id: 'destinations', label: 'Destinations', icon: '🚀', layer: 'activate', description: '100+ activation channels', tech: ['APIs', 'SFTP', 'Webhooks'], x: 0, y: 4, color: '#f59e0b' },
  { id: 'smartpixel', label: 'SmartPixel', icon: '⚡', layer: 'activate', description: 'Real-time web personalization', tech: ['Edge Cache', '<50ms'], x: 1, y: 4, color: '#f59e0b' },

  // Platform layer
  { id: 'gke', label: 'GKE', icon: '☸️', layer: 'platform', description: 'Kubernetes orchestration', tech: ['GKE', 'Istio'], x: 0, y: 5, color: '#10b981' },
  { id: 'terraform', label: 'Terraform', icon: '🏗️', layer: 'platform', description: 'Infrastructure as code', tech: ['Terraform', 'GCP'], x: 1, y: 5, color: '#10b981' },
  { id: 'observability', label: 'Observability', icon: '📈', layer: 'platform', description: 'Monitoring & tracing', tech: ['Prometheus', 'Grafana', 'OTel'], x: 2, y: 5, color: '#10b981' },
  { id: 'cicd', label: 'CI/CD', icon: '🔄', layer: 'platform', description: 'GitOps deployment', tech: ['CloudBuild', 'ArgoCD'], x: 3, y: 5, color: '#10b981' },
];

export default function ArchitectureGraph() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const filteredNodes = activeLayer
    ? NODES.filter((n) => n.layer === activeLayer)
    : NODES;

  return (
    <div className="space-y-6">
      {/* Layer filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveLayer(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            !activeLayer
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
          }`}
        >
          All Layers
        </button>
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === layer.id
                ? 'text-white border'
                : 'bg-bg-surface/50 text-text-muted border border-border hover:border-border-strong'
            }`}
            style={activeLayer === layer.id ? { backgroundColor: `${layer.color}20`, borderColor: `${layer.color}50`, color: layer.color } : {}}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Graph grid */}
      {LAYERS.map((layer) => {
        const layerNodes = filteredNodes.filter((n) => n.layer === layer.id);
        if (layerNodes.length === 0) return null;

        return (
          <div key={layer.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
              <h3 className="text-sm font-bold text-text-secondary">{layer.label}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {layerNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  className={`
                    text-left p-4 rounded-2xl border transition-all duration-200
                    ${selectedNode?.id === node.id
                      ? 'border-2 -translate-y-1 shadow-lg'
                      : 'border-border hover:border-border-strong hover:-translate-y-0.5'
                    }
                  `}
                  style={{
                    backgroundColor: selectedNode?.id === node.id ? `${node.color}10` : 'rgba(255,255,255,0.02)',
                    borderColor: selectedNode?.id === node.id ? `${node.color}60` : undefined,
                  }}
                >
                  <span className="text-2xl block mb-2">{node.icon}</span>
                  <div className="text-sm font-bold">{node.label}</div>
                  <div className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{node.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Selected node detail */}
      {selectedNode && (
        <Card className="animate-fade-in !p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{selectedNode.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{selectedNode.label}</h3>
              <p className="text-sm text-text-secondary mt-1">{selectedNode.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedNode.tech.map((t) => (
                  <Badge key={t} color={selectedNode.color}>{t}</Badge>
                ))}
              </div>
              <div className="mt-3">
                <Badge color={LAYERS.find((l) => l.id === selectedNode.layer)?.color || '#999'}>
                  {LAYERS.find((l) => l.id === selectedNode.layer)?.label}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 text-xs text-text-muted pt-4 border-t border-border">
        <span>{NODES.length} platform components</span>
        <span>{LAYERS.length} architectural layers</span>
        <span>Click any node for details</span>
      </div>
    </div>
  );
}
