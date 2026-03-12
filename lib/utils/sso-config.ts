// SSO Provider configuration
// This module provides the architecture for enterprise SSO integration.
// When ready for production, configure the provider details and connect to
// Supabase Auth's built-in SAML/OIDC support.

export interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oidc';
  domain: string; // e.g., "company.com"
  enabled: boolean;
  config: {
    // SAML
    entryPoint?: string;
    certificate?: string;
    issuer?: string;
    // OIDC
    clientId?: string;
    discoveryUrl?: string;
  };
}

// Placeholder: in production, load from DB or env
export const SSO_PROVIDERS: SSOProvider[] = [];

// Check if a domain has SSO configured
export function getSSOProviderForDomain(domain: string): SSOProvider | null {
  return SSO_PROVIDERS.find((p) => p.enabled && p.domain === domain) || null;
}

// Extract domain from email
export function getDomainFromEmail(email: string): string {
  return email.split('@')[1] || '';
}
