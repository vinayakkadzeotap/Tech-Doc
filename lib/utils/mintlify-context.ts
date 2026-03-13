// Docs context fetcher for CDP Assistant RAG augmentation
// Pulls relevant Mintlify documentation to enrich assistant responses

import { mintlifySearch, isMintlifyConfigured, getFullDocsUrl } from './mintlify';

const MAX_CONTEXT_LENGTH = 2000;

/**
 * Fetch and format documentation context for a user query.
 * Returns a structured context block for injection into the system prompt.
 * Returns empty string if Mintlify is not configured or no results found.
 */
export async function fetchDocsContext(query: string): Promise<string> {
  if (!isMintlifyConfigured()) {
    return '';
  }

  try {
    const results = await mintlifySearch(query, 3);

    if (results.length === 0) {
      return '';
    }

    const sections = results.map((r, i) => {
      const fullUrl = getFullDocsUrl(r.url);
      const content = r.content || r.description || '';
      return `### ${i + 1}. ${r.title}\n${content}\nSource: ${fullUrl}`;
    });

    let context = sections.join('\n\n');

    // Truncate to max length to keep the context manageable
    if (context.length > MAX_CONTEXT_LENGTH) {
      context = context.slice(0, MAX_CONTEXT_LENGTH) + '\n\n[...truncated]';
    }

    return context;
  } catch {
    return '';
  }
}

/**
 * Check if docs context is available for augmentation
 */
export function isDocsAugmentationAvailable(): boolean {
  return isMintlifyConfigured();
}
