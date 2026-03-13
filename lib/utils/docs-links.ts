// Module-to-Mintlify documentation mapping
// Maps ZeoAI learning module IDs to relevant Zeotap documentation pages

import { getFullDocsUrl } from './mintlify';

export interface DocsLink {
  title: string;
  path: string;  // relative Mintlify doc path
  description?: string;
}

/**
 * Mapping of module IDs to their related documentation pages.
 * Paths are relative to the Mintlify docs base URL.
 */
export const MODULE_DOCS_MAP: Record<string, DocsLink[]> = {
  // Business Essentials
  'what-is-cdp': [
    { title: 'What is a Customer Data Platform?', path: '/introduction/what-is-cdp' },
    { title: 'CDP Use Cases', path: '/introduction/use-cases' },
  ],
  'what-is-zeotap': [
    { title: 'Getting Started with Zeotap', path: '/introduction/getting-started' },
  ],
  'how-zeotap-works': [
    { title: 'Platform Overview', path: '/introduction/platform-overview' },
  ],

  // Product Mastery
  'unity-dashboard': [
    { title: 'Unity Dashboard Guide', path: '/user-guide/dashboard' },
    { title: 'User Management', path: '/user-guide/user-management' },
  ],
  'data-collection-ui': [
    { title: 'Data Collection Setup', path: '/data-collection/overview' },
    { title: 'Source Connectors', path: '/data-collection/connectors' },
  ],
  'audience-builder': [
    { title: 'Audience Builder', path: '/audiences/builder' },
    { title: 'Segment Rules', path: '/audiences/rules' },
  ],
  'journey-canvas': [
    { title: 'Journey Builder', path: '/journeys/builder' },
    { title: 'Journey Triggers', path: '/journeys/triggers' },
  ],
  'activating-data': [
    { title: 'Destinations Overview', path: '/activation/destinations' },
    { title: 'Sync Configuration', path: '/activation/sync-config' },
  ],
  'reports-dashboards': [
    { title: 'Analytics & Reports', path: '/analytics/overview' },
  ],

  // Engineering Deep Dive
  'platform-overview': [
    { title: 'Architecture Overview', path: '/architecture/overview' },
    { title: 'Platform Components', path: '/architecture/components' },
  ],
  'data-collection': [
    { title: 'Web SDK', path: '/sdks/web' },
    { title: 'Mobile SDK', path: '/sdks/mobile' },
    { title: 'Server-side SDK', path: '/sdks/server' },
  ],
  'data-ingestion': [
    { title: 'Ingestion Pipeline', path: '/architecture/ingestion' },
    { title: 'Data Formats', path: '/data-collection/formats' },
  ],
  'identity-resolution': [
    { title: 'Identity Resolution', path: '/identity/overview' },
    { title: 'ID Matching', path: '/identity/matching' },
  ],
  'profile-store': [
    { title: 'Profile Store', path: '/architecture/profile-store' },
  ],
  'audience-management': [
    { title: 'Audience Engine', path: '/audiences/engine' },
    { title: 'Real-time Segments', path: '/audiences/real-time' },
  ],
  'data-activation': [
    { title: 'Activation Overview', path: '/activation/overview' },
    { title: 'Connector Catalog', path: '/activation/connectors' },
  ],
  'privacy-gdpr': [
    { title: 'Privacy & Compliance', path: '/privacy/overview' },
    { title: 'Consent Management', path: '/privacy/consent' },
    { title: 'GDPR Compliance', path: '/privacy/gdpr' },
  ],
  'auth-iam': [
    { title: 'Authentication', path: '/security/authentication' },
    { title: 'SSO Configuration', path: '/security/sso' },
  ],

  // Customer Success
  'integration-guides': [
    { title: 'Integration Guides', path: '/integrations/overview' },
  ],
  'troubleshooting': [
    { title: 'Troubleshooting', path: '/support/troubleshooting' },
    { title: 'FAQ', path: '/support/faq' },
  ],
};

/**
 * Get documentation links for a specific module
 */
export function getDocsLinksForModule(moduleId: string): DocsLink[] {
  return MODULE_DOCS_MAP[moduleId] || [];
}

/**
 * Get full URLs for module docs links
 */
export function getModuleDocsUrls(moduleId: string): Array<DocsLink & { fullUrl: string }> {
  const links = getDocsLinksForModule(moduleId);
  return links.map((link) => ({
    ...link,
    fullUrl: getFullDocsUrl(link.path),
  }));
}

/**
 * Get all module IDs that have documentation links
 */
export function getLinkedModuleIds(): string[] {
  return Object.keys(MODULE_DOCS_MAP);
}

/**
 * Get total count of unique doc paths across all modules
 */
export function getTotalDocsLinkCount(): number {
  const allPaths = new Set<string>();
  Object.values(MODULE_DOCS_MAP).forEach((links) => {
    links.forEach((link) => allPaths.add(link.path));
  });
  return allPaths.size;
}
