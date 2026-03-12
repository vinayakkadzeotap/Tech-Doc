// ─── Codebase Intelligence: Search Index ────────────────────────────

import { DOMAINS } from './domains';
import type { DomainId, Repo } from './types';

export interface SearchableItem {
  id: string;
  type: 'repo' | 'module' | 'dependency';
  name: string;
  description: string;
  domainId: DomainId;
  domainTitle: string;
  domainColor: string;
  repoId: string;
  repoName: string;
  language?: string;
  depType?: 'database' | 'queue' | 'cloud' | 'library' | 'service';
  usedByRepoCount?: number;
  connectedRepoCount?: number;
  path?: string;
}

export interface SearchFilters {
  type?: 'repo' | 'module' | 'dependency';
  domainId?: DomainId;
  language?: string;
  depType?: string;
}

// CDP skill cross-linking map
const CDP_SKILL_MAP: Partial<Record<DomainId, { id: string; label: string }[]>> = {
  'audiences-segmentation': [
    { id: 'cdp-audience-finder', label: 'Audience Finder' },
    { id: 'cdp-lookalike-finder', label: 'Lookalike Finder' },
  ],
  'data-platform': [
    { id: 'cdp-data-manager', label: 'Data Manager' },
    { id: 'cdp-data-analyzer', label: 'Data Analyzer' },
    { id: 'cdp-metadata-explorer', label: 'Metadata Explorer' },
  ],
  'ai-ml-genai': [
    { id: 'cdp-data-scientist', label: 'Data Scientist' },
    { id: 'cdp-data-enricher', label: 'Data Enricher' },
  ],
  'activation-distribution': [
    { id: 'cdp-journey-recommender', label: 'Journey Recommender' },
  ],
  'analytics-observability': [
    { id: 'cdp-health-diagnostics', label: 'Health Diagnostics' },
  ],
  'profile-data-mgmt': [
    { id: 'cdp-churn-finder', label: 'Churn Finder' },
    { id: 'cdp-data-enricher', label: 'Data Enricher' },
  ],
  'cdp-platform-ui': [
    { id: 'cdp-marketing-suite', label: 'Marketing Suite' },
  ],
};

export function getRelatedCDPSkills(domainId: DomainId): { id: string; label: string }[] {
  return CDP_SKILL_MAP[domainId] ?? [];
}

// Build the flat search index from DOMAINS (computed once at import time)
function buildIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];
  const depCounts = new Map<string, number>();

  // First pass: count dependency usage
  for (const domain of DOMAINS) {
    for (const repo of domain.repos) {
      for (const dep of repo.dependencies) {
        depCounts.set(dep.name, (depCounts.get(dep.name) ?? 0) + 1);
      }
    }
  }

  const seenDeps = new Set<string>();

  for (const domain of DOMAINS) {
    for (const repo of domain.repos) {
      // Repo item
      items.push({
        id: `repo:${repo.id}`,
        type: 'repo',
        name: repo.displayName,
        description: repo.purpose,
        domainId: domain.id,
        domainTitle: domain.title,
        domainColor: domain.color,
        repoId: repo.id,
        repoName: repo.displayName,
        language: repo.language,
        connectedRepoCount: repo.interRepoLinks.length,
      });

      // Module items
      for (const mod of repo.keyModules) {
        items.push({
          id: `mod:${repo.id}:${mod.name}`,
          type: 'module',
          name: mod.name,
          description: mod.description,
          domainId: domain.id,
          domainTitle: domain.title,
          domainColor: domain.color,
          repoId: repo.id,
          repoName: repo.displayName,
          path: mod.path,
        });
      }

      // Dependency items (deduplicated)
      for (const dep of repo.dependencies) {
        if (!seenDeps.has(dep.name)) {
          seenDeps.add(dep.name);
          items.push({
            id: `dep:${dep.name}`,
            type: 'dependency',
            name: dep.name,
            description: dep.description,
            domainId: domain.id,
            domainTitle: domain.title,
            domainColor: domain.color,
            repoId: repo.id,
            repoName: repo.displayName,
            depType: dep.type,
            usedByRepoCount: depCounts.get(dep.name) ?? 1,
          });
        }
      }
    }
  }

  return items;
}

const INDEX = buildIndex();

export function searchCodebase(query: string, filters?: SearchFilters): SearchableItem[] {
  const q = query.toLowerCase().trim();

  let results = INDEX;

  if (filters?.type) results = results.filter((item) => item.type === filters.type);
  if (filters?.domainId) results = results.filter((item) => item.domainId === filters.domainId);
  if (filters?.language) results = results.filter((item) => item.language === filters.language);
  if (filters?.depType) results = results.filter((item) => item.depType === filters.depType);

  if (!q) return results;

  return results.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.path && item.path.toLowerCase().includes(q))
  );
}

export function getReposUsingDependency(depName: string): { repo: Repo; domainId: DomainId; domainTitle: string }[] {
  const results: { repo: Repo; domainId: DomainId; domainTitle: string }[] = [];
  for (const domain of DOMAINS) {
    for (const repo of domain.repos) {
      if (repo.dependencies.some((d) => d.name === depName)) {
        results.push({ repo, domainId: domain.id, domainTitle: domain.title });
      }
    }
  }
  return results;
}

export function getReposConnectedTo(repoId: string): { repo: Repo; domainId: DomainId }[] {
  const results: { repo: Repo; domainId: DomainId }[] = [];
  // Find the target repo's name
  let targetName = '';
  for (const domain of DOMAINS) {
    for (const repo of domain.repos) {
      if (repo.id === repoId || repo.name === repoId) {
        targetName = repo.name;
        break;
      }
    }
    if (targetName) break;
  }
  if (!targetName) return results;

  for (const domain of DOMAINS) {
    for (const repo of domain.repos) {
      if (repo.interRepoLinks.includes(targetName) || repo.name === targetName) {
        if (repo.id !== repoId && repo.name !== repoId) {
          results.push({ repo, domainId: domain.id });
        }
      }
    }
  }
  return results;
}

export function getAllLanguages(): string[] {
  const langs = new Set<string>();
  for (const domain of DOMAINS) {
    for (const repo of domain.repos) {
      langs.add(repo.language);
    }
  }
  return Array.from(langs).sort();
}

export function getSearchStats() {
  const repos = INDEX.filter((i) => i.type === 'repo').length;
  const modules = INDEX.filter((i) => i.type === 'module').length;
  const deps = INDEX.filter((i) => i.type === 'dependency').length;
  return { repos, modules, deps, total: INDEX.length };
}
