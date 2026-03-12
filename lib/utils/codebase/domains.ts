// ─── Codebase Intelligence: Domain Data ───────────────────────────

import type { Domain, DomainId, Repo } from './types';
import { IDENTITY_RESOLUTION } from './identity-resolution';
import { DATA_PLATFORM } from './data-platform';
import { CDP_PLATFORM_UI } from './cdp-platform-ui';
import { AI_ML_GENAI } from './ai-ml-genai';
import {
  AUDIENCES_SEGMENTATION,
  ACTIVATION_DISTRIBUTION,
  PROFILE_DATA_MGMT,
  ANALYTICS_OBSERVABILITY,
  AUTH_CONSENT,
} from './remaining-domains';

export const DOMAINS: Domain[] = [
  IDENTITY_RESOLUTION,
  DATA_PLATFORM,
  AUDIENCES_SEGMENTATION,
  ACTIVATION_DISTRIBUTION,
  CDP_PLATFORM_UI,
  AI_ML_GENAI,
  PROFILE_DATA_MGMT,
  ANALYTICS_OBSERVABILITY,
  AUTH_CONSENT,
];

export function getDomain(id: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === id);
}

export function getDomainIds(): DomainId[] {
  return DOMAINS.map((d) => d.id);
}

export function getAllRepos(): (Repo & { domainId: DomainId })[] {
  return DOMAINS.flatMap((d) =>
    d.repos.map((r) => ({ ...r, domainId: d.id }))
  );
}
