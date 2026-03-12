// SSO Configuration for Zeotap Learning Platform
// Uses Supabase Auth's built-in Google OAuth provider

// Allowed email domains for SSO login
export const ALLOWED_DOMAINS = ['zeotap.com'];

// Check if an email domain is allowed
export function isAllowedDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return ALLOWED_DOMAINS.includes(domain);
}

// Extract domain from email
export function getDomainFromEmail(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}
