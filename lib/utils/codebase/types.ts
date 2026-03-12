// ─── Codebase Intelligence: Types ─────────────────────────────────

export type DomainId =
  | 'identity-resolution'
  | 'data-platform'
  | 'audiences-segmentation'
  | 'activation-distribution'
  | 'cdp-platform-ui'
  | 'ai-ml-genai'
  | 'profile-data-mgmt'
  | 'analytics-observability'
  | 'auth-consent';

export interface Domain {
  id: DomainId;
  title: string;
  icon: string;
  color: string;
  description: string;
  architectureNotes: string;
  mermaidArch: string;
  mermaidDataFlow: string;
  repos: Repo[];
}

export interface Repo {
  id: string;
  name: string;
  displayName: string;
  purpose: string;
  language: string;
  languages: { name: string; pct: number }[];
  size: string;
  keyModules: KeyModule[];
  dependencies: RepoDependency[];
  interRepoLinks: string[];
  complexity?: ComplexityInfo;
}

export interface KeyModule {
  name: string;
  path: string;
  description: string;
}

export interface RepoDependency {
  name: string;
  type: 'database' | 'queue' | 'cloud' | 'library' | 'service';
  description: string;
}

export interface ComplexityInfo {
  linesOfCode?: number;
  deadCodeFiles?: string[];
  hotspots?: string[];
}
